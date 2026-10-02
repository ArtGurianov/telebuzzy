import db from "@/config/db";
import { AppBusinessError } from "@/lib/utils";
import { Prisma } from "@prisma/client";

// How long a delivered key keeps deduplicating retries
const IDEMPOTENCY_KEY_TTL_MS = 24 * 3600 * 1000;
// A PENDING claim older than this is treated as abandoned (the request that
// made it died mid-flight) and may be taken over by a retry
const PENDING_CLAIM_STALE_MS = 60 * 1000;

const STATUS = { PENDING: "PENDING", DELIVERED: "DELIVERED" } as const;

const IN_PROGRESS_ERROR = () =>
  new AppBusinessError(
    "A request with this idempotency key is still being processed. Retry later",
    409
  );

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === "P2002";

export type IdempotencyClaim =
  | { kind: "claimed"; id: string }
  | { kind: "duplicate" };

export const claimIdempotencyKey = async (
  userId: string,
  idempotencyKey: string
): Promise<IdempotencyClaim> => {
  const now = Date.now();
  await db.notifyRequest.deleteMany({
    where: { userId, createdAt: { lt: new Date(now - IDEMPOTENCY_KEY_TTL_MS) } },
  });

  try {
    const row = await db.notifyRequest.create({
      data: { userId, idempotencyKey, status: STATUS.PENDING },
    });
    return { kind: "claimed", id: row.id };
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
  }

  const existing = await db.notifyRequest.findUnique({
    where: { userId_idempotencyKey: { userId, idempotencyKey } },
  });
  if (!existing) throw IN_PROGRESS_ERROR();
  if (existing.status === STATUS.DELIVERED) return { kind: "duplicate" };
  if (now - existing.createdAt.getTime() < PENDING_CLAIM_STALE_MS) {
    throw IN_PROGRESS_ERROR();
  }

  // Abandoned claim: take it over, unless a concurrent retry got there first
  const { count } = await db.notifyRequest.updateMany({
    where: {
      id: existing.id,
      status: STATUS.PENDING,
      createdAt: existing.createdAt,
    },
    data: { createdAt: new Date(now) },
  });
  if (count !== 1) throw IN_PROGRESS_ERROR();
  return { kind: "claimed", id: existing.id };
};

export const markIdempotencyKeyDelivered = (id: string) =>
  db.notifyRequest.update({
    where: { id },
    data: { status: STATUS.DELIVERED },
  });

/** Frees the key after a failed attempt so the client can retry it */
export const releaseIdempotencyKey = (id: string) =>
  db.notifyRequest.deleteMany({ where: { id, status: STATUS.PENDING } });
