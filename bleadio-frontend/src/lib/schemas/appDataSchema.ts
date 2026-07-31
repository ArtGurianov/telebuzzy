import { z } from "zod";

export const appDataSchema = z
  .object({
    apiKey: z.string(),
    title: z.string(),
    app: z.optional(z.string()),
    action: z.optional(z.string()),
    timestamp: z.optional(z.coerce.number()),
  })
  .catchall(z.string());

export const ommitedKeySchema = appDataSchema.omit({ apiKey: true });
