import { z } from "zod";

export const subscriptionDataSchema = z.object({
  subscriptionStartTimestamp: z.bigint(),
  subscriptionEndTimestamp: z.bigint(),
});
