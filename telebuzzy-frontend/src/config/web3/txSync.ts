import { createTxSyncStorage, createTxSyncVocabulary } from "@mydaogs/web3-tx";

/**
 * This app's tx vocabulary. Producers (write hooks in the billing buttons)
 * and consumers (`usePendingTxScope`, `PendingTxWatcher`) must agree on these
 * strings exactly - a renamed key discards a stale localStorage record
 * instead of leaving a control permanently disabled with no matching writer.
 *
 * There is one entity type today because both writes act on the same thing:
 * the connected user's subscription.
 */
export const TX_ENTITY = {
  SUBSCRIPTION: "subscription",
} as const;

/** The two on-chain writes the billing flow performs. */
export const TX_ACTION = {
  APPROVE_USD: "subscription:approve-usd",
  UPDATE_SUBSCRIPTION: "subscription:update-subscription",
} as const;

/**
 * One conflict key per action, not per billing plan. A wallet can only ever
 * have one `approve` or one `updateSubscription` transaction in flight at a
 * time (same account, sequential nonces), so a pending MONTHLY approve
 * correctly disables the ANNUAL approve control too, and vice versa.
 */
export const TX_CONFLICT = {
  APPROVE_USD: "approve-usd",
  UPDATE_SUBSCRIPTION: "update-subscription",
} as const;

const subscriptionTxVocabulary = createTxSyncVocabulary({
  entities: TX_ENTITY,
  actions: TX_ACTION,
  conflicts: TX_CONFLICT,
});

/**
 * Durable localStorage-backed registry for in-flight subscription
 * transactions, shared by `useAppWriteContract`, `usePendingTxScope`, and
 * `PendingTxWatcher` (see `txClient.ts`).
 *
 * `lockNamespace` scopes the Web Locks this instance takes, so this app's
 * pending-tx coordination cannot collide with another app on the same origin.
 */
export const txSyncStorage = createTxSyncStorage({
  vocabulary: subscriptionTxVocabulary,
  lockNamespace: "telebuzzy",
});
