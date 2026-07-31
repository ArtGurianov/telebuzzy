# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blead.io is a service that lets e-businesses send custom notifications to a user's personal Telegram. Monorepo with two packages:

- **bleadio-frontend/** — Next.js 15 (App Router) + React 19 web app
- **bleadio-solidity/** — Foundry project with the `Blead.sol` smart contract

## Commands

### Frontend (`bleadio-frontend/`)

```bash
pnpm dev              # Dev server on port 80 with experimental HTTPS
pnpm build            # Production build
pnpm lint             # ESLint
pnpm db:generate      # Prisma generate
pnpm db:push          # Push schema to MongoDB (skip generate)
pnpm db:flush         # Force-reset database
pnpm webhook:register # Register Telegram bot webhook
```

Package manager is **pnpm**. `postinstall` runs `prisma generate` + webhook registration — a valid `.env` (all server vars) is required for `pnpm install` to complete, because the webhook script calls `getServerConfig()`.

There is no frontend test suite; tests exist only in the Solidity package.

### Solidity (`bleadio-solidity/`)

```bash
forge build                    # Compile contracts
forge test                     # Run tests (test/Blead.t.sol)
forge test --match-test <name> -vvvv   # Run a single test, verbose
forge script script/BleadDeployment.s.sol --rpc-url <RPC> --broadcast  # Deploy
```

Uses Foundry with `forge-std` and `openzeppelin-contracts` as git submodule dependencies. Remappings in `remappings.txt`. Deployment reads env vars: `ENV_MODE`, `DEPLOYER_PRIVATE_KEY`, `MONTHLY_PRICE_USD`, `ANNUAL_PRICE_USD`, and (production only) `USD_CONTRACT_ADDRESS`.

## Architecture

### Frontend

**Auth:** Email magic link via Auth.js v5 (next-auth beta.25) + Resend. Session is extended with custom fields (`tgUserId`, `apiKey`, `billingPeriodStart`, `billingPeriodMessagesSent`). Middleware at root re-exports `auth` from `@/config/auth`.

**Core API — `POST /api/notify`:** The product's main endpoint. Accepts `{ apiKey, title, ... }`, looks up user by apiKey in MongoDB, reads subscription from blockchain server-side (`getSubscriptionData` action via viem), enforces billing period message limits, sends formatted HTML to Telegram Bot API. Sends notification emails (via Resend) when a limit is reached or a billing period resets.

**Telegram bot webhook — `POST /api/webhook/[token]`:** Authorized by the URL path token matching `TG_BOT_TOKEN`. Handles `/start` and `/set_api_key <UUID>` commands; links Telegram user ID to the MongoDB user record. Control-flow quirk: every reply to the Telegram user — including success messages — is delivered by throwing `AppClientError`, which the catch block forwards to the Telegram sendMessage API.

**Plans / billing:** Two plans. In code the constant is `BILLING_PLANS.LIGHT` / `BILLING_PLANS.PRO` (`src/lib/utils/contsants.ts`), but env vars and email types call the free plan "LITE" (`NEXT_PUBLIC_MESSAGES_LIMIT_LITE`, `LIMIT_REACHED_LITE`) — keep this inconsistency in mind when searching. There is no on-chain record for free users: `getUserBillingPlan` returns PRO iff the on-chain `subscriptionEndTimestamp` is in the future, otherwise LIGHT.

**Subscription flow:** User connects MetaMask (headless connector via wagmi v2), approves ERC-20 spending, calls `Blead.updateSubscription(bytes32(userId), plan)`. Client reads subscription data via `SubscriptionProvider` context (wagmi `useReadContract`).

**Billing period:** Rolling 30-day windows computed by `calculateBillingPeriodStartTimestamp` from the on-chain subscription start (falls back to `user.createdAt` for never-subscribed users). Enforced server-side in the notify endpoint and mirrored client-side.

**Network routing:** `getAppChain()` maps env vars: development/test → Foundry (local Anvil), production+testnet → Sepolia, production+mainnet → BSC.

**Login guard pattern:** `withAuthBtn` HOC — if unauthenticated, fires `CustomEvent("open-login-dialog")` instead of executing the action. `LoginDialog` listens for this event.

**Environment:** All env vars validated via Zod schemas in `src/config/env.ts` (separate client and server schemas). Many modules call `getServerConfig()`/`getClientConfig()` at module scope, so invalid env fails at import time, not request time. See `.env.example` for required variables.

**UI:** shadcn/ui components in `src/components/ui/`, Tailwind CSS v4, Radix UI primitives, Framer Motion. Responsive dialog/drawer pattern via `DialogDrawer` component.

### Solidity

**`Blead.sol`:** Ownable contract managing subscriptions keyed by `bytes32(userId)`. Charges a USD-denominated ERC-20 stablecoin via `transferFrom` to the owner (price is scaled by the token's `decimals()` at call time). Subscriptions extend if still active, otherwise start fresh. MONTHLY = 30 days, ANNUAL = 360 days. Owner can change the token address and prices.

**Deployment script:** `BleadDeployment.s.sol` reads `ENV_MODE` — in "development" deploys a `TestUSD` mock token alongside `Blead`; in "production" uses a real stablecoin address from env.

**ABI note:** The frontend ABI (`src/config/web3/abi.ts`) references functions like `getFeesTokenDetails()` and fields like `FEES_TOKEN_MONTHLY_PRICE` that don't exist in the current `Blead.sol` in this repo. The contract or ABI may be out of sync — verify against `Blead.sol` before relying on ABI entries other than `getSubscriptionData` and `updateSubscription`.

### Key Config Paths

- `src/config/auth/index.ts` — NextAuth configuration
- `src/config/db.ts` — Prisma singleton
- `src/config/env.ts` — Zod env validation (client + server schemas)
- `src/config/web3/` — ABI, network config, viem client, wagmi config
- `prisma/schema.prisma` — MongoDB schema (User, Account, Session, VerificationToken)
- `src/lib/utils/contsants.ts` — plan/email constants (note the misspelled filename)

### Path Alias

`@/*` maps to `./src/*` (tsconfig).
