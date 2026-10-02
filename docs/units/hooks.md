# React hooks

## Locations

- Colocated with the component that uses them - non reusable
- `telebuzzy-frontend/src/lib/hooks/` - reusable within the app

## Units files lists (file path + one sentence short description)

### Non-Reusable

<!-- route-scoped hooks colocated with usage -->

### Reusable

<!-- hooks under telebuzzy-frontend/src/lib/hooks/ -->

- `useWindowSize`/`useBreakpoint`, sourced from `@mydaogs/ui/client` - `useWindowSize` tracks `window.innerWidth`/`innerHeight` across resize events, `useBreakpoint(targetBreakpoint)` reports whether the current window width is above a named breakpoint, built on `useWindowSize`. Used by `telebuzzy-frontend/src/components/common/PopoverDrawer/PopoverDrawer.tsx` to switch between `Popover` and `Drawer`
- `telebuzzy-frontend/src/components/Providers/SubscriptionProvider.tsx` - `useSubscription` reads the connected user's on-chain subscription context (`isIdle`/`isLoading`/`isPending`/`isError`/`data`/`refetch`); colocated with `SubscriptionProvider` rather than `src/lib/hooks/` since it is the provider's own accessor
- `telebuzzy-frontend/src/config/web3/txClient.ts` - `useAppWriteContract`, built by `@mydaogs/web3-client`'s `createUseAppWriteContract` and bound to this app's tx storage, toast adapter, English copy, and explorer URLs; wraps a wagmi contract write with submit/receipt/reconciliation lifecycle, a durable cross-tab pending record, and automatic query invalidation. Used by `ApproveTransactionBtn` and `SpendTransactionBtn`
- `telebuzzy-frontend/src/config/web3/txClient.ts` - `usePendingTxScope`, built by `@mydaogs/web3-client`'s `createUsePendingTxScope` and bound to this app's tx storage; reads the durable pending-tx registry to tell a control whether a transaction for its entity/conflict key is already in flight in this tab, another tab, or after a reload
