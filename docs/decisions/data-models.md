# Data models

This decision has no upstream copy — it is required and project-specific

## What this doc answers

- Which offchain entities exist, and what does each own
- Which relationships are enforced in the database and which only in application code
- Which fields are denormalized, and what keeps them consistent
- Which records are user-owned, and what happens to them when the user is removed

## Decision

Offchain storage is a single MongoDB database (Prisma, `telebuzzy-frontend/prisma/schema.prisma`) with four models — the Auth.js v5 adapter's three standard models, plus `User` extended with this product's own fields:

- **`User`** — one row per end user. Auth.js fields (`email`, `emailVerified`, `name`, `image`) sit alongside:
  - `apiKey` (`String`, default a fresh UUID) — the credential e-businesses pass to `POST /api/notify`; looked up there to resolve the user
  - `tgUserId` (`Int?`) — set once the user runs `/set_api_key <apiKey>` against the Telegram bot; `null` until then, and notify requests fail closed until it's set
  - `billingPeriodStart` (`DateTime`, defaults to `now()` at signup) — the rolling 30-day window start; superseded by the onchain subscription start once the user ever subscribes (see `decisions/blockchain.md`)
  - `billingPeriodMessagesSent` (`Int`, defaults to `0`) — offchain counter enforced in `/api/notify`, reset when the billing period rolls over
  - `limitReachedEmailSent` (`Boolean`, defaults to `false`) — guards against re-sending the same limit-reached email every request once the cap is hit for the period; reset to `false` on every request that successfully sends a notification (not only at rollover)
- **`Account`** / **`Session`** / **`VerificationToken`** — unmodified Auth.js v5 + `@auth/prisma-adapter` models, owning OAuth/credential linkage, session tokens, and magic-link tokens respectively

## Relationships and enforcement

- `Account.userId` and `Session.userId` are enforced with `onDelete: Cascade` at the database level — deleting a `User` deletes their accounts and sessions with it
- `apiKey → User` and `tgUserId → User` are both effectively unique lookup keys in application code (the notify endpoint and the webhook handler each resolve a `User` by one of them), but neither carries a Prisma `@unique` constraint today

## Denormalization

- `billingPeriodMessagesSent` is a denormalized counter, not derived from a message log — there is no persisted record of individual sent notifications. It is kept consistent only by being incremented in the same request that sends a notification, and reset when `billingPeriodStart` rolls over
- Billing plan (LIGHT vs. PRO) is never stored on `User` at all — it's computed on read from onchain subscription state, so there is nothing here to keep in sync with the chain

## User-owned records and removal

There is no account-deletion flow today. `Account`/`Session` cascade-delete with their `User` if a row is ever removed directly; there is no cleanup path for onchain subscription state (it lives on the contract, keyed by a hash derived from the user id, independent of whether the offchain `User` row still exists)
