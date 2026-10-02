import db from "@/config/db";
import { appDataSchema } from "@/lib/schemas/appDataSchema";
import { AppBusinessError, formatDataMessage } from "@/lib/utils";
import { NextResponse } from "next/server";
import { getSubscriptionData } from "@/app/actions/getSubscriptionData";
import { getUserBillingPlan } from "@/lib/utils/getUserBillingPlan";
import { formatErrorMessage, formatErrorStatusCode } from "@mydaogs/contract";
import { calculateBillingPeriodStartTimestamp } from "@/lib/utils/calculateBillingPeriod";
import { getServerConfig } from "@/config/env";
import { sendEmail } from "@/app/actions/sendEmail";
import { EMAIL_MESSAGE_TYPES } from "@/lib/utils/contsants";

const ENV_CONFIG = getServerConfig();
const TELEGRAM_API_URL = `https://api.telegram.org/bot${ENV_CONFIG.TG_BOT_TOKEN}`;

const sendTelegramMessage = async (chatId: number, text: string) => {
  let response: Response;
  try {
    response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
  } catch {
    throw new AppBusinessError("Telegram is unreachable, please retry", 502);
  }
  if (response.ok) return;

  const { description } = await response.json().catch(() => ({}));
  const reason = description ?? `status ${response.status}`;
  if (response.status === 429) {
    throw new AppBusinessError(`Telegram rate limit: ${reason}`, 503);
  }
  if (response.status >= 500) {
    throw new AppBusinessError(`Telegram error: ${reason}`, 502);
  }
  throw new AppBusinessError(`Telegram rejected the message: ${reason}`, 422);
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => {
      throw new AppBusinessError("Request body must be valid JSON", 400);
    });
    const verificationResult = appDataSchema.safeParse(body);
    if (verificationResult.error) {
      const errorStr = verificationResult.error.errors.reduce(
        (temp, next) =>
          `${temp} ${next.path.toString().toUpperCase()} - ${next.message};`,
        ""
      );
      throw new AppBusinessError(`Fields verification failed: ${errorStr}`, 400);
    }

    const { apiKey, ...rest } = verificationResult.data;

    const user = await db.user.findFirst({ where: { apiKey } });
    if (!user) {
      throw new AppBusinessError("Api key not found", 404);
    }
    if (!user.tgUserId) {
      throw new AppBusinessError("Please register api key in bot first", 400);
    }
    const subscriptionResult = await getSubscriptionData(user.id);
    if (!subscriptionResult.success) {
      throw new AppBusinessError(subscriptionResult.errorMessage, 500);
    }
    const { subscriptionStartTimestamp, subscriptionEndTimestamp } =
      subscriptionResult.data;
    const billingPlan = getUserBillingPlan(Number(subscriptionEndTimestamp));
    const messagesLimitNumber =
      billingPlan === "PRO"
        ? ENV_CONFIG.NEXT_PUBLIC_MESSAGES_LIMIT_PRO
        : ENV_CONFIG.NEXT_PUBLIC_MESSAGES_LIMIT_LITE;
    const billingPeriodStartTimestamp = calculateBillingPeriodStartTimestamp(
      Number(subscriptionStartTimestamp) * 1000 ||
        Math.round(user.createdAt.getTime())
    );
    if (
      user.billingPeriodStart.getTime() === billingPeriodStartTimestamp &&
      user.billingPeriodMessagesSent >= messagesLimitNumber
    ) {
      if (!user.limitReachedEmailSent) {
        await sendEmail(
          user.email!,
          billingPlan === "LIGHT"
            ? EMAIL_MESSAGE_TYPES.LIMIT_REACHED_LITE
            : EMAIL_MESSAGE_TYPES.LIMIT_REACHED_PRO
        );
        await db.user.update({
          where: { id: user.id },
          data: { limitReachedEmailSent: true },
        });
      }
      throw new AppBusinessError(
        `Number of messages has exceeded limit.${
          billingPlan === "LIGHT" ? " Consider upgrading to the PRO plan" : ""
        }`,
        429
      );
    }
    // Deliver first, so a failed delivery is never counted against the quota.
    await sendTelegramMessage(user.tgUserId, formatDataMessage(rest));

    const isResetBillingPeriod =
      billingPeriodStartTimestamp !== user.billingPeriodStart.getTime();
    if (isResetBillingPeriod) {
      await sendEmail(
        user.email!,
        billingPlan === "LIGHT"
          ? EMAIL_MESSAGE_TYPES.SUBSCRIPTION_RESET_LITE
          : EMAIL_MESSAGE_TYPES.SUBSCRIPTION_RESET_PRO
      );
    }
    await db.user.update({
      where: { id: user.id },
      data: {
        billingPeriodMessagesSent: isResetBillingPeriod
          ? 1
          : user.billingPeriodMessagesSent + 1,
        billingPeriodStart: isResetBillingPeriod
          ? new Date(billingPeriodStartTimestamp)
          : user.billingPeriodStart,
        limitReachedEmailSent: false,
      },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: formatErrorMessage(error) },
      { status: formatErrorStatusCode(error) }
    );
  }
}
