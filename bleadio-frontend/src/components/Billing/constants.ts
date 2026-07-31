import { ValueOf } from "@/lib/types";

export const BILLING_PLANS_SOLIDITY_KEYS = {
  MONTLY: "MONTLY",
  ANNUAL: "ANNUAL",
} as const;
export type BillingPlansSolidityKey = ValueOf<
  typeof BILLING_PLANS_SOLIDITY_KEYS
>;

export const BILLING_PLANS_SOLIDITY_KEYS_MAP: Record<
  BillingPlansSolidityKey,
  number
> = {
  [BILLING_PLANS_SOLIDITY_KEYS.MONTLY]: 0,
  [BILLING_PLANS_SOLIDITY_KEYS.ANNUAL]: 1,
};
