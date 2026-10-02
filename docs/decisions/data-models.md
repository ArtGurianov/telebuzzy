# Data models

This decision has no upstream copy — it is required and project-specific

## What this doc answers

- Which offchain entities exist, and what does each own
- Which relationships are enforced in the database and which only in application code
- Which fields are denormalized, and what keeps them consistent
- Which records are user-owned, and what happens to them when the user is removed

## Decision

Offchain storage is a single MongoDB database (Prisma, `telebuzzy-frontend/prisma/schema.prisma`) with five models — the Auth.js v5 adapter's three standard models, `User` extended with this product's own fields, and `NotifyRequest` for idempotency keys:

- **`User`** — one row per end user. Auth.js fields (`email`, `emailVerified`, `name`, `image`) sit alongside:
  - `apiKey` (`String`, default a fresh UUID) — the credential e-businesses pass to `POST /api/notify` (`Authorization: Bearer` header, or the legacy `apiKey` body field); looked up there to resolve the user
  - `tgUserId` (`Int?`) — set once the user runs `/set_api_key <apiKey>` against the Telegram bot; `null` until then, and notify requests fail closed until it's set
  - `billingPeriodStart` (`DateTime`, defaults to `now()` at signup) — the rolling 30-day window start; superseded by the onchain subscription start once the user ever subscribes (see `decisions/blockchain.md`)
  - `billingPeriodMessagesSent` (`Int`, defaults to `0`) — offchain counter enforced in `/api/notify`, reset when the billing period rolls over
  - `billingPeriodCriticalReserveUsed` (`Int`, defaults to `0`) — how many `severity: "critical"` messages were delivered past the plan limit this period, capped at `CRITICAL_RESERVE_PER_PERIOD`; reset at rollover
  - `limitReachedEmailSent` (`Boolean`, defaults to `false`) — set once per period by the first request that finds the regular quota exhausted, so the limit-reached email goes out exactly once; reset at rollover
- **`NotifyRequest`** — one row per `(userId, idempotencyKey)` sent to `/api/notify` (unique). `status` is `PENDING` while the request is in flight and `DELIVERED` after Telegram accepts the message. Rows older than 24h are deleted lazily by the next keyed request from the same user; a `PENDING` row older than 60s counts as abandoned and may be taken over by a retry. Failed attempts delete their row so the key can be retried
- **`Account`** / **`Session`** / **`VerificationToken`** — unmodified Auth.js v5 + `@auth/prisma-adapter` models, owning OAuth/credential linkage, session tokens, and magic-link tokens respectively

## Relationships and enforcement

- `Account.userId`, `Session.userId` and `NotifyRequest.userId` are enforced with `onDelete: Cascade` at the database level — deleting a `User` deletes their accounts, sessions and idempotency keys with it
- `apiKey → User` and `tgUserId → User` are both effectively unique lookup keys in application code (the notify endpoint and the webhook handler each resolve a `User` by one of them), but neither carries a Prisma `@unique` constraint today

## Denormalization

- `billingPeriodMessagesSent` is a denormalized counter, not derived from a message log — there is no persisted record of individual sent notifications. Every change is a single conditional atomic update: a request reserves a slot (`billingPeriodMessagesSent < limit` in the update's filter) before sending, and gives it back if delivery fails, so concurrent requests cannot overshoot the limit. The rollover reset is likewise conditional on the stored `billingPeriodStart`, so only one request performs it
- Billing plan (LIGHT vs. PRO) is never stored on `User` at all — it's computed on read from onchain subscription state, so there is nothing here to keep in sync with the chain

## User-owned records and removal

There is no account-deletion flow today. `Account`/`Session` cascade-delete with their `User` if a row is ever removed directly; there is no cleanup path for onchain subscription state (it lives on the contract, keyed by a hash derived from the user id, independent of whether the offchain `User` row still exists)
