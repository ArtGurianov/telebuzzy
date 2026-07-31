import db from "@/config/db";
import { appDataSchema } from "@/lib/schemas/appDataSchema";
import { AppClientError, formatDataMessage } from "@/lib/utils";
import { NextResponse } from "next/server";
import { getSubscriptionData } from "@/app/actions/getSubscriptionData";
import { getUserBillingPlan } from "@/lib/utils/getUserBillingPlan";
import { formatErrorMessage } from "@/lib/utils/formatErrorMessage";
import { subscriptionDataSchema } from "@/lib/schemas/subscriptionDataSchema";
import { calculateBillingPeriodStartTimestamp } from "@/lib/utils/calculateBillingPeriod";
import { z } from "zod";
import { getServerConfig } from "@/config/env";
import { sendEmail } from "@/app/actions/sendEmail";
import { EMAIL_MESSAGE_TYPES } from "@/lib/utils/contsants";

const ENV_CONFIG = getServerConfig();
const TELEGRAM_API_URL = `https://api.telegram.org/bot${ENV_CONFIG.TG_BOT_TOKEN}`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const verificationResult = appDataSchema.safeParse(body);
    if (verificationResult.error) {
      const errorStr = verificationResult.error.errors.reduce(
        (temp, next) =>
          `${temp} ${next.path.toString().toUpperCase()} - ${next.message};`,
        ""
      );
      throw new AppClientError(`Fields verification failed: ${errorStr}`);
    }

    const { apiKey, ...rest } = verificationResult.data;

    const user = await db.user.findFirst({ where: { apiKey } });
    if (!user) {
      throw new AppClientError("Api key not found");
    }
    if (!user.tgUserId) {
      throw new AppClientError("Please register api key in bot first");
    }
    const { data: subscriptionData, errorMessage: subsctiptionErrorMessage } =
      await getSubscriptionData(user.id);
    if (subsctiptionErrorMessage) {
      throw new AppClientError(subsctiptionErrorMessage);
    }
    const { subscriptionStartTimestamp, subscriptionEndTimestamp } =
      subscriptionData as z.infer<typeof subscriptionDataSchema>;
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
      throw new AppClientError(
        `Number of messages has exceeded limit.${
          billingPlan === "LIGHT" ? " Consider upgrading to the PRO plan" : ""
        }`
      );
    }
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

    const qs = new URLSearchParams({
      text: formatDataMessage(rest),
    }).toString();
    await fetch(
      `${TELEGRAM_API_URL}/sendMessage?chat_id=${user.tgUserId}&${qs}&parse_mode=HTML`
    );

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: formatErrorMessage(error) },
      { status: 400 }
    );
  }
}
