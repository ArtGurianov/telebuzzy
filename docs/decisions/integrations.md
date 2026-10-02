# Integrations

This decision has no upstream copy — it is required and project-specific

## What this doc answers

- Which third-party services are depended on, and what each one is the source of truth for
- What the failure behaviour is when one is unavailable
- Which of them hold user data, and under what basis
- What replacing one would cost, and which are deliberately easy to swap

## Decision

- **Telegram Bot API** — the product's core delivery channel. `POST /api/notify` sends the formatted notification via `sendMessage`, with `disable_notification` set for `severity: "info"`; the bot webhook (`POST /api/webhook/[token]`, authorized by the URL token matching `TG_BOT_TOKEN`) handles `/start` and `/set_api_key <uuid>`, which is the only way a `User.tgUserId` gets set. `/api/notify` checks the `sendMessage` response and delivers *before* incrementing the billing counter, so a failed delivery is never billed: Telegram unreachable or 5xx → `502`, Telegram rate limit → `503`, any other Telegram rejection (e.g. bot blocked by the user) → `422`, each with Telegram's `description` in `error`. The webhook's own reply-via-`AppBusinessError` send can itself fail silently (caught and turned into a 400, nothing further). There is no retry and no fallback delivery channel — this integration **is** the product
- **Resend** (`AUTH_RESEND_KEY`) — sends Auth.js v5 magic-link emails and the billing notification emails (`SUBSCRIPTION_UPGRADED`, `SUBSCRIPTION_RESET_LITE/PRO`, `LIMIT_REACHED_LITE/PRO`, from `EMAIL_MESSAGE_TYPES`). Source of truth for whether those emails were *sent*; `User.limitReachedEmailSent` is the only persisted record of send state, and it is not reconciled against Resend's own delivery status. If Resend is unavailable, sign-in and billing emails silently fail to arrive — magic-link sign-in has no fallback, but `POST /api/notify` still completes and updates billing state either way, since the email send isn't on that request's critical path for the Telegram delivery itself
- **MongoDB** (`DATABASE_URL`) — the offchain store of record for everything in `decisions/data-models.md`. No fallback; the app cannot serve authenticated routes or `/api/notify` without it
- **Blockchain RPC** (viem, server-side) — reads subscription/pricing state live from the `Telebuzzy` contract on every `/api/notify` call and on the billing UI. Uses `RPC_URL` (server-only, optional) or `NEXT_PUBLIC_RPC_URL` (also used by the browser's wagmi client) — a provider endpoint such as Infura or Alchemy. `NEXT_PUBLIC_RPC_URL` is required when `NEXT_PUBLIC_APP_ENV=production`, because viem's built-in public endpoints are not dependable (Sepolia's default no longer serves free traffic). If the provider is down or rate-limited, reads fail and `/api/notify` returns `500`

## User data held by third parties

- **Resend** holds the email address and message content for every magic-link and billing email sent through it
- **Telegram** holds the bot conversation history (message text sent via `sendMessage`) on its own servers, outside this app's control
- MongoDB is self/product-hosted, not a third party in this sense

## Swap cost

- **Resend** is the easiest to swap — it's called from a small number of send sites (`sendEmail` action, Auth.js provider config) behind no abstraction layer of its own, but the call sites are few enough that swapping providers is a contained change
- **Telegram** is the hardest to swap — the entire product proposition ("send notifications to your personal Telegram") is Telegram-specific; replacing it is a product pivot, not an integration swap
- **MongoDB** is a normal Prisma datasource swap (change `provider` + connection string), constrained only by which Prisma features the `@id @default(auto()) @db.ObjectId` fields rely on being Mongo-specific
