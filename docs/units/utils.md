# Utility functions

## Locations

- Colocated with the component/module that uses them - non reusable
- `telebuzzies-frontend/src/lib/utils/` - reusable within the app, re-exported via `index.ts`
- `telebuzzies-frontend/src/lib/schemas/` - Zod validation schemas

## Units files lists (file path + one sentence short description)

### Non-Reusable

<!-- route-scoped or component-scoped utils colocated with usage -->

### Reusable

`telebuzzies-frontend/src/lib/utils/index.ts` re-exports:

- `cn` - Tailwind class-name merge helper
- `AppClientError` - error thrown by the Telegram webhook handler to drive its reply-via-error control flow
- `createActionResponse` - standardized server action response shape
- `formatDataMessage` - formats notification HTML for the Telegram Bot API
- `getAppChain` - maps `NEXT_PUBLIC_APP_ENV`/`NEXT_PUBLIC_NETWORK` to the active viem/wagmi chain
- `stringToBytes32` - packs and pads/truncates a string (user id) into the `bytes32` key the contract stores subscriptions under
