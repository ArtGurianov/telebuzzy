# [ARCH] - Zod Schema Validation

## Description

Zod schemas validate all forms and request payloads, providing typed parsing and custom refinements where needed

## Behavior

- Schemas live under `telebuzzy-frontend/src/lib/schemas/`
- Used with react-hook-form `zodResolver` for form input (`emailSchema`, `uuidSchema`) and with plain `.parse`/`.safeParse` for non-form data shapes: the `/api/notify` payload (`appDataSchema`), and on-chain read results decoded via viem (`feesTokenDetailsSchema`, `subscriptionDataSchema`)
- `appDataSchema` uses `.catchall(z.string())` so callers can attach arbitrary string fields to a notification beyond the required `apiKey`/`title`; `ommitedKeySchema` is the same shape with `apiKey` stripped, for echoing the payload back without the credential
- On-chain numeric reads (`feesTokenDetailsSchema.minClaimableUnitsAmount`, `subscriptionDataSchema.*Timestamp`) are typed `z.bigint()` to match viem's `uint256` decoding

## Related files

- `telebuzzy-frontend/src/lib/schemas/`
