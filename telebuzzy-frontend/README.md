# telebuzzy-frontend

Next.js 15 (App Router) app behind [telebuzzy.xyz](https://telebuzzy.xyz): the website, the public `POST /api/notify` endpoint, and the webhook for the [@telebuzzy_bot](https://t.me/telebuzzy_bot) Telegram bot.

For what the product does and how customers use the API, see the [root README](../README.md).

## Prerequisites

- Node.js 22 and **pnpm 10** (pinned via `packageManager`; `corepack enable` picks it up)
- A MongoDB database (e.g. MongoDB Atlas)
- A [Resend](https://resend.com) API key with a verified sending domain
- A Telegram bot token from [@BotFather](https://t.me/BotFather). **Use a separate bot for local development**, not `@telebuzzy_bot` (see the webhook warning below)
- A deployed `Telebuzzy` contract (see [`telebuzzy-solidity`](../telebuzzy-solidity/README.md)), or a local Anvil node for development

## Environment

Copy `.env.example` to `.env` and fill in every variable. They are validated with Zod in `src/config/env.ts`, and the app (and `pnpm install`) fails fast if any are missing.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_ENV` | `development` / `test` → local Anvil chain; `production` → public network |
| `NEXT_PUBLIC_NETWORK` | With `production`: `testnet` → Sepolia, `mainnet` → BSC |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `Telebuzzy` **proxy** address (not the implementation) |
| `NEXT_PUBLIC_MESSAGES_LIMIT_LITE` | Messages per 30-day period on the free plan |
| `NEXT_PUBLIC_MESSAGES_LIMIT_PRO` | Messages per 30-day period on PRO |
| `DATABASE_URL` | MongoDB connection string, including the database name |
| `AUTH_SECRET` | Random secret for Auth.js (`openssl rand -base64 32`) |
| `AUTH_RESEND_KEY` | Resend API key (magic-link and billing emails) |
| `TG_BOT_TOKEN` | Telegram bot token |
| `APP_DOMAIN` | Public URL of the app, without a trailing slash, e.g. `https://telebuzzy.xyz` |

`NEXT_PUBLIC_*` values are inlined at build time, so changing them requires a rebuild.

## Local development

```bash
pnpm install     # also runs prisma generate and registers the Telegram webhook
pnpm db:push     # create collections/indexes in MongoDB
pnpm dev         # https://localhost (port 80, experimental HTTPS)
```

> ⚠️ **Webhook warning:** `pnpm install` (via `postinstall`) and `pnpm webhook:register` point the bot's webhook at `APP_DOMAIN`. Running them locally with the production `TG_BOT_TOKEN` would take over `@telebuzzy_bot` from production. Always develop with your own test bot.

| Script | Description |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Prisma client generation |
| `pnpm db:push` | Push the Prisma schema to MongoDB |
| `pnpm db:flush` | ⚠️ Force-reset the database |
| `pnpm webhook:register` | Point the Telegram bot webhook at `APP_DOMAIN` |

There is no frontend test suite yet.

## Contract ABI

`src/config/web3/abi.ts` is **generated**. Don't edit it by hand. After changing the contract, run `pnpm abi:export` from the repo root and commit the result. CI fails if it is stale.

## Deploying to Vercel

1. Import the repository and set **Root Directory** to `telebuzzy-frontend`.
2. Add every environment variable above for **Production and Preview**. `postinstall` validates them during install, so a build without them fails.
3. Add the `telebuzzy.xyz` domain and point DNS at Vercel.
4. Once the domain serves the app, verify the bot webhook:
   ```bash
   curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```
   `url` should be `https://telebuzzy.xyz/api/webhook/<TOKEN>` with no `last_error_message`. If not, redeploy or run `pnpm webhook:register` with production env.
5. Smoke test: sign in, link the key in [@telebuzzy_bot](https://t.me/telebuzzy_bot), send a `POST /api/notify`, then subscribe to PRO from a wallet.
