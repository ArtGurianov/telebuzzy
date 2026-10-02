import { z } from "zod";
import { NOTIFY_SEVERITIES } from "../utils/contsants";

// Epoch numbers below this are treated as seconds, above as milliseconds
// (1e12 ms is Sep 2001; 1e12 s is ~33,000 years from now).
const EPOCH_MS_THRESHOLD = 1e12;

// Accepts epoch seconds, epoch milliseconds, or any Date-parsable string
// (ISO 8601 / RFC 3339 recommended).
const epochToDate = (epoch: number) =>
  new Date(epoch < EPOCH_MS_THRESHOLD ? epoch * 1000 : epoch);

const timestampSchema = z
  .union([z.number(), z.string()])
  .transform((value) => {
    if (typeof value === "number") return epochToDate(value);
    const trimmed = value.trim();
    return /^\d+(\.\d+)?$/.test(trimmed)
      ? epochToDate(Number(trimmed))
      : new Date(trimmed);
  })
  .refine((date) => !Number.isNaN(date.getTime()), {
    message:
      "Invalid timestamp. Use an ISO 8601 string or epoch seconds/milliseconds",
  });

// Extra fields may be any primitive; they are rendered as text.
const extraFieldSchema = z
  .union([z.string(), z.number(), z.boolean()])
  .transform(String);

export const idempotencyKeySchema = z.string().trim().min(1).max(255);

export const appDataSchema = z
  .object({
    // Prefer the `Authorization: Bearer <key>` header; the body field is
    // kept for existing integrations
    apiKey: z.optional(z.string()),
    // Also accepted as the `Idempotency-Key` header, which takes precedence
    idempotencyKey: z.optional(idempotencyKeySchema),
    severity: z.optional(
      z.enum([
        NOTIFY_SEVERITIES.CRITICAL,
        NOTIFY_SEVERITIES.WARNING,
        NOTIFY_SEVERITIES.INFO,
      ])
    ),
    title: z.string(),
    app: z.optional(z.string()),
    action: z.optional(z.string()),
    timestamp: z.optional(timestampSchema),
  })
  .catchall(extraFieldSchema);

// The fields rendered into the Telegram message
export const ommitedKeySchema = appDataSchema.omit({
  apiKey: true,
  idempotencyKey: true,
});
