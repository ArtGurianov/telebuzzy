import { ONE_MONTH_MS } from "./contsants";

export const calculateBillingPeriodStartTimestamp = (
  subscriptionStartTimestampMs: number
) => {
  const nowMs = new Date().getTime();
  const totalPassedMs = nowMs - subscriptionStartTimestampMs;
  const currentPeriodPassedMs = totalPassedMs % ONE_MONTH_MS;

  return nowMs - currentPeriodPassedMs;
};
