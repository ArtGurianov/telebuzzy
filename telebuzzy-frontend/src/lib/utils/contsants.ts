export const BILLING_PLANS = {
  LIGHT: "LIGHT",
  PRO: "PRO",
} as const;

export const ONE_MONTH_MS = 30 * 24 * 3600 * 1000;

export const EMAIL_MESSAGE_TYPES = {
  SUBSCRIPTION_UPGRADED: "SUBSCRIPTION_UPGRADED",
  SUBSCRIPTION_RESET_LITE: "SUBSCRIPTION_RESET_LITE",
  SUBSCRIPTION_RESET_PRO: "SUBSCRIPTION_RESET_PRO",
  LIMIT_REACHED_LITE: "LIMIT_REACHED_LITE",
  LIMIT_REACHED_PRO: "LIMIT_REACHED_PRO",
} as const;

// Messages with severity "critical" may still be delivered this many times
// per billing period after the plan's regular limit is exhausted.
export const CRITICAL_RESERVE_PER_PERIOD = 10;

export const NOTIFY_SEVERITIES = {
  CRITICAL: "critical",
  WARNING: "warning",
  INFO: "info",
} as const;
