import db from "@/config/db";
import {
  CRITICAL_RESERVE_PER_PERIOD,
  ONE_MONTH_MS,
} from "@/lib/utils/contsants";
import { Prisma } from "@prisma/client";

export type QuotaState = {
  limit: number;
  used: number;
  criticalReserveUsed: number;
  periodStart: Date;
};

export type QuotaSlot = "regular" | "criticalReserve";

const QUOTA_FIELDS = {
  billingPeriodMessagesSent: true,
  billingPeriodCriticalReserveUsed: true,
} as const;

const toQuotaState = (
  user: Prisma.UserGetPayload<{ select: typeof QUOTA_FIELDS }>,
  limit: number,
  periodStart: Date
): QuotaState => ({
  limit,
  used: user.billingPeriodMessagesSent,
  criticalReserveUsed: user.billingPeriodCriticalReserveUsed,
  periodStart,
});

const isRecordNotFound = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === "P2025";

/**
 * Moves the user's counters into the billing period starting at
 * `periodStart`. Returns true only for the single request that performed the
 * reset, so side effects (the reset email) happen once.
 */
export const rollBillingPeriod = async (
  user: { id: string; billingPeriodStart: Date },
  periodStart: Date
) => {
  if (user.billingPeriodStart.getTime() === periodStart.getTime()) {
    return false;
  }
  const { count } = await db.user.updateMany({
    where: { id: user.id, billingPeriodStart: user.billingPeriodStart },
    data: {
      billingPeriodStart: periodStart,
      billingPeriodMessagesSent: 0,
      billingPeriodCriticalReserveUsed: 0,
      limitReachedEmailSent: false,
    },
  });
  return count === 1;
};

/**
 * Atomically takes one message from the regular quota, or — for critical
 * messages once the regular quota is exhausted — from the critical reserve.
 * Returns null when nothing is left.
 */
export const reserveQuotaSlot = async ({
  userId,
  limit,
  periodStart,
  critical,
}: {
  userId: string;
  limit: number;
  periodStart: Date;
  critical: boolean;
}): Promise<{ slot: QuotaSlot; quota: QuotaState } | null> => {
  try {
    const user = await db.user.update({
      where: {
        id: userId,
        billingPeriodStart: periodStart,
        billingPeriodMessagesSent: { lt: limit },
      },
      data: { billingPeriodMessagesSent: { increment: 1 } },
      select: QUOTA_FIELDS,
    });
    return { slot: "regular", quota: toQuotaState(user, limit, periodStart) };
  } catch (error) {
    if (!isRecordNotFound(error)) throw error;
  }
  if (!critical) return null;

  try {
    const user = await db.user.update({
      where: {
        id: userId,
        billingPeriodStart: periodStart,
        billingPeriodCriticalReserveUsed: { lt: CRITICAL_RESERVE_PER_PERIOD },
      },
      data: { billingPeriodCriticalReserveUsed: { increment: 1 } },
      select: QUOTA_FIELDS,
    });
    return {
      slot: "criticalReserve",
      quota: toQuotaState(user, limit, periodStart),
    };
  } catch (error) {
    if (!isRecordNotFound(error)) throw error;
    return null;
  }
};

/** Gives back a slot taken by `reserveQuotaSlot` when delivery failed. */
export const releaseQuotaSlot = async ({
  userId,
  limit,
  periodStart,
  slot,
}: {
  userId: string;
  limit: number;
  periodStart: Date;
  slot: QuotaSlot;
}) => {
  const field =
    slot === "regular"
      ? "billingPeriodMessagesSent"
      : "billingPeriodCriticalReserveUsed";
  try {
    const user = await db.user.update({
      // Skipped if the period rolled over meanwhile — the counter was reset
      where: { id: userId, billingPeriodStart: periodStart, [field]: { gt: 0 } },
      data: { [field]: { decrement: 1 } },
      select: QUOTA_FIELDS,
    });
    return toQuotaState(user, limit, periodStart);
  } catch (error) {
    if (!isRecordNotFound(error)) throw error;
    return readQuota({ userId, limit, periodStart });
  }
};

export const readQuota = async ({
  userId,
  limit,
  periodStart,
}: {
  userId: string;
  limit: number;
  periodStart: Date;
}) => {
  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
    select: QUOTA_FIELDS,
  });
  return toQuotaState(user, limit, periodStart);
};

/** Returns true only for the request that flipped the flag, so it emails once. */
export const markLimitReachedEmailSent = async (userId: string) => {
  const { count } = await db.user.updateMany({
    where: { id: userId, limitReachedEmailSent: false },
    data: { limitReachedEmailSent: true },
  });
  return count === 1;
};

export const quotaHeaders = (quota: QuotaState): Record<string, string> => ({
  "X-Telebuzzy-Limit": String(quota.limit),
  "X-Telebuzzy-Remaining": String(Math.max(0, quota.limit - quota.used)),
  "X-Telebuzzy-Critical-Reserve-Remaining": String(
    Math.max(0, CRITICAL_RESERVE_PER_PERIOD - quota.criticalReserveUsed)
  ),
  "X-Telebuzzy-Reset": String(
    Math.floor((quota.periodStart.getTime() + ONE_MONTH_MS) / 1000)
  ),
});
