# Utility functions

## Locations

- Colocated with the component/module that uses them - non reusable
- `telebuzzy-frontend/src/lib/utils/` - reusable within the app, re-exported via `index.ts`
- `telebuzzy-frontend/src/lib/schemas/` - Zod validation schemas

## Units files lists (file path + one sentence short description)

### Non-Reusable

<!-- route-scoped or component-scoped utils colocated with usage -->

### Reusable

`telebuzzy-frontend/src/lib/utils/index.ts` re-exports:

- `cn` - Tailwind class-name merge helper
- `AppBusinessError` - error thrown by the Telegram webhook handler to drive its reply-via-error control flow, sourced from `@mydaogs/contract`
- `createActionResponse` - standardized server action response shape, sourced from `@mydaogs/contract`
- `formatDataMessage` - formats notification HTML for the Telegram Bot API
- `getAppChain` - maps `NEXT_PUBLIC_APP_ENV`/`NEXT_PUBLIC_NETWORK` to the active viem/wagmi chain via `@mydaogs/web3`'s `createChainResolver`
- `stringToBytes32` - packs and pads/truncates a string (user id) into the `bytes32` key the contract stores subscriptions under, sourced from `@mydaogs/web3`
- `truncateString` - shortens a long string for display with a leading/trailing character count, sourced from `@mydaogs/core`
