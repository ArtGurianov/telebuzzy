# React hooks

## Locations

- Colocated with the component that uses them - non reusable
- `telebuzzies-frontend/src/lib/hooks/` - reusable within the app

## Units files lists (file path + one sentence short description)

### Non-Reusable

<!-- route-scoped hooks colocated with usage -->

### Reusable

<!-- hooks under telebuzzies-frontend/src/lib/hooks/ -->

- `telebuzzies-frontend/src/lib/hooks/useWindowSize.ts` - tracks `window.innerWidth`/`innerHeight` across resize events
- `telebuzzies-frontend/src/lib/hooks/useBreakpoint.ts` - reports whether the current window width is above a named Tailwind breakpoint, built on `useWindowSize`
- `telebuzzies-frontend/src/components/Providers/SubscriptionProvider.tsx` - `useSubscription` reads the connected user's on-chain subscription context (`isIdle`/`isLoading`/`isPending`/`isError`/`data`/`refetch`); colocated with `SubscriptionProvider` rather than `src/lib/hooks/` since it is the provider's own accessor
- `telebuzzies-frontend/src/config/web3/txClient.ts` - `useAppWriteContract`, built by `@mydaogs/web3-client`'s `createUseAppWriteContract` and bound to this app's tx storage, toast adapter, English copy, and explorer URLs; wraps a wagmi contract write with submit/receipt/reconciliation lifecycle, a durable cross-tab pending record, and automatic query invalidation. Used by `ApproveTransactionBtn` and `SpendTransactionBtn`
- `telebuzzies-frontend/src/config/web3/txClient.ts` - `usePendingTxScope`, built by `@mydaogs/web3-client`'s `createUsePendingTxScope` and bound to this app's tx storage; reads the durable pending-tx registry to tell a control whether a transaction for its entity/conflict key is already in flight in this tab, another tab, or after a reload
