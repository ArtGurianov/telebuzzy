import db from "@/config/db";
import {
  appDataSchema,
  idempotencyKeySchema,
} from "@/lib/schemas/appDataSchema";
import { AppBusinessError, formatDataMessage } from "@/lib/utils";
import { NextResponse } from "next/server";
import { getSubscriptionData } from "@/app/actions/getSubscriptionData";
import { getUserBillingPlan } from "@/lib/utils/getUserBillingPlan";
import { formatErrorMessage, formatErrorStatusCode } from "@mydaogs/contract";
import { calculateBillingPeriodStartTimestamp } from "@/lib/utils/calculateBillingPeriod";
import { getServerConfig } from "@/config/env";
import { sendEmail } from "@/app/actions/sendEmail";
import {
  EMAIL_MESSAGE_TYPES,
  NOTIFY_SEVERITIES,
} from "@/lib/utils/contsants";
import { sendTelegramMessage } from "./telegram";
import {
  markLimitReachedEmailSent,
  QuotaState,
  quotaHeaders,
  readQuota,
  releaseQuotaSlot,
  reserveQuotaSlot,
  rollBillingPeriod,
} from "./quota";
import {
  claimIdempotencyKey,
  markIdempotencyKeyDelivered,
  releaseIdempotencyKey,
} from "./idempotency";

const ENV_CONFIG = getServerConfig();

const formatValidationError = (error: {
  errors: { path: (string | number)[]; message: string }[];
}) =>
  error.errors.reduce(
    (temp, next) =>
      `${temp} ${next.path.toString().toUpperCase()} - ${next.message};`,
    ""
  );

/** `Authorization: Bearer <key>`; undefined when the header is absent */
const getBearerApiKey = (request: Request) => {
  const header = request.headers.get("authorization");
  if (header === null) return undefined;
  const match = header.match(/^Bearer\s+(\S+)\s*$/i);
  if (!match) {
    throw new AppBusinessError(
      "Malformed Authorization header. Expected `Bearer <api key>`",
      401
    );
  }
  return match[1];
};

const getIdempotencyKey = (request: Request, bodyKey: string | undefined) => {
  const header = request.headers.get("idempotency-key");
  if (header === null) return bodyKey;
  const result = idempotencyKeySchema.safeParse(header);
  if (!result.success) {
    throw new AppBusinessError(
      `Invalid Idempotency-Key header:${formatValidationError(result.error)}`,
      400
    );
  }
  return result.data;
};

export async function POST(request: Request) {
  // Set once the user's quota is known, so error responses carry it too
  let quota: QuotaState | null = null;

  try {
    const body = await request.json().catch(() => {
      throw new AppBusinessError("Request body must be valid JSON", 400);
    });
    const verificationResult = appDataSchema.safeParse(body);
    if (verificationResult.error) {
      throw new AppBusinessError(
        `Fields verification failed:${formatValidationError(verificationResult.error)}`,
        400
      );
    }

    const {
      apiKey: bodyApiKey,
      idempotencyKey: bodyIdempotencyKey,
      ...message
    } = verificationResult.data;
    const apiKey = getBearerApiKey(request) ?? bodyApiKey;
    if (!apiKey) {
      throw new AppBusinessError(
        "Missing API key. Send it as `Authorization: Bearer <api key>`",
        401
      );
    }
    const idempotencyKey = getIdempotencyKey(request, bodyIdempotencyKey);

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
    const limit =
      billingPlan === "PRO"
        ? ENV_CONFIG.NEXT_PUBLIC_MESSAGES_LIMIT_PRO
        : ENV_CONFIG.NEXT_PUBLIC_MESSAGES_LIMIT_LITE;
    const periodStart = new Date(
      calculateBillingPeriodStartTimestamp(
        Number(subscriptionStartTimestamp) * 1000 ||
          Math.round(user.createdAt.getTime())
      )
    );
    const quotaParams = { userId: user.id, limit, periodStart };

    if (await rollBillingPeriod(user, periodStart)) {
      await sendEmail(
        user.email!,
        billingPlan === "LIGHT"
          ? EMAIL_MESSAGE_TYPES.SUBSCRIPTION_RESET_LITE
          : EMAIL_MESSAGE_TYPES.SUBSCRIPTION_RESET_PRO
      );
    }

    let claimId: string | null = null;
    if (idempotencyKey) {
      const claim = await claimIdempotencyKey(user.id, idempotencyKey);
      if (claim.kind === "duplicate") {
        quota = await readQuota(quotaParams);
        return NextResponse.json(
          { duplicate: true },
          { status: 200, headers: quotaHeaders(quota) }
        );
      }
      claimId = claim.id;
    }

    try {
      const reservation = await reserveQuotaSlot({
        ...quotaParams,
        critical: message.severity === NOTIFY_SEVERITIES.CRITICAL,
      });
      if (!reservation || reservation.slot === "criticalReserve") {
        // The regular quota is exhausted either way
        if (await markLimitReachedEmailSent(user.id)) {
          await sendEmail(
            user.email!,
            billingPlan === "LIGHT"
              ? EMAIL_MESSAGE_TYPES.LIMIT_REACHED_LITE
              : EMAIL_MESSAGE_TYPES.LIMIT_REACHED_PRO
          );
        }
      }
      if (!reservation) {
        quota = await readQuota(quotaParams);
        throw new AppBusinessError(
          `Number of messages has exceeded limit.${
            billingPlan === "LIGHT" ? " Consider upgrading to the PRO plan" : ""
          }`,
          429
        );
      }
      quota = reservation.quota;

      try {
        await sendTelegramMessage({
          chatId: user.tgUserId,
          text: formatDataMessage(message),
          silent: message.severity === NOTIFY_SEVERITIES.INFO,
        });
      } catch (error) {
        // A failed delivery is never counted against the quota
        quota = await releaseQuotaSlot({
          ...quotaParams,
          slot: reservation.slot,
        });
        throw error;
      }
    } catch (error) {
      if (claimId) await releaseIdempotencyKey(claimId);
      throw error;
    }

    if (claimId) {
      // Delivered already; if this write fails the claim goes stale and a
      // retry after PENDING_CLAIM_STALE_MS may deliver once more
      await markIdempotencyKeyDelivered(claimId).catch(() => undefined);
    }

    return NextResponse.json(
      { duplicate: false },
      { status: 200, headers: quotaHeaders(quota) }
    );
  } catch (error) {
    return NextResponse.json(
      { error: formatErrorMessage(error) },
      {
        status: formatErrorStatusCode(error),
        headers: quota ? quotaHeaders(quota) : undefined,
      }
    );
  }
}
