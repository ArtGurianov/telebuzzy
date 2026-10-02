# [ARCH] - Zod Schema Validation

## Description

Zod schemas validate all forms and request payloads, providing typed parsing and custom refinements where needed

## Behavior

- Schemas live under `telebuzzy-frontend/src/lib/schemas/`
- Used with react-hook-form `zodResolver` for form input (`emailSchema`, `uuidSchema`) and with plain `.parse`/`.safeParse` for non-form data shapes: the `/api/notify` payload (`appDataSchema`), and on-chain read results decoded via viem (`feesTokenDetailsSchema`, `subscriptionDataSchema`)
- `appDataSchema` uses `.catchall()` with a string/number/boolean union (transformed to string) so callers can attach arbitrary primitive fields to a notification beyond the required `title`; `apiKey` and `idempotencyKey` are optional in the body because the route prefers the `Authorization: Bearer` and `Idempotency-Key` headers; `severity` is an enum (`critical` / `warning` / `info`); `timestamp` accepts an ISO 8601 string or epoch seconds/milliseconds (numbers below `1e12` are seconds) and is transformed to a `Date`; `ommitedKeySchema` is the same shape with `apiKey` and `idempotencyKey` stripped — the fields rendered into the Telegram message
- On-chain numeric reads (`feesTokenDetailsSchema.minClaimableUnitsAmount`, `subscriptionDataSchema.*Timestamp`) are typed `z.bigint()` to match viem's `uint256` decoding

## Related files

- `telebuzzy-frontend/src/lib/schemas/`
