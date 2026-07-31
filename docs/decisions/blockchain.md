# Blockchain

This decision has no upstream copy — it is required and project-specific

## What this doc answers

- Which contracts exist, and what state each one owns
- Which chains are targeted, and which is authoritative for each environment
- Which operations are onchain and which are offchain, and why the line sits there
- How onchain state reaches the offchain store, and what happens when the two disagree

## Contracts

- **`Telebuzzies`** (`telebuzzies-solidity/src/contracts/Telebuzzies.sol`) — the only project contract. It is `ITelebuzziesArgs, MyDaogsAbstractProject` (UUPS proxy, from the `mydaogs-ecosystem-contracts` submodule) and owns:
  - `FEES_TOKEN_MONTHLY_PRICE` / `FEES_TOKEN_ANNUAL_PRICE` — whole-USD prices, settable by a project admin/super-admin
  - `subscriptions: mapping(bytes32 userIdHash => SubscriptionData)` — `subscriptionStartTimestamp` / `subscriptionEndTimestamp` per user
  - `updateSubscription(userIdHash, plan)` — charges the current fees token via the abstract's `_charge`, with `serviceFeeBPS = 10_000` and `_to = address(0)`, so **100% of every charge goes to the dividends contract**; the project itself never custodies subscription revenue
- **`MyDaogsIsolatedDividends`** (from `mydaogs-ecosystem-contracts`) — resolves the current fees token (`getFeesTokenDetails()`) and receives 100% of subscription charges. Deployed fresh per environment via `MyDaogsIsolatedDividendsModule`; the ecosystem admin is whoever owns this contract
- **`TestUSDT`** (from `mydaogs-ecosystem-contracts`, test-only) — the fees token on development/test networks, minted via `publicMint1000USDT()` (fixed amount, 24h cooldown, waived in the test env's first block). Production networks use a real stablecoin address passed as `PREDEPLOYED_ADDRESS_USD`

`Telebuzzies` is deployed behind an `ERC1967Proxy`; the proxy address is the canonical app-facing address (`NEXT_PUBLIC_CONTRACT_ADDRESS`) and must never be confused with the implementation address logged alongside it at deploy time

## Chains

`getAppChain()` (`telebuzzies-frontend/src/lib/utils/getAppChain.ts`) maps `NEXT_PUBLIC_APP_ENV` to a chain:

| `NEXT_PUBLIC_APP_ENV` | Chain |
| --- | --- |
| `development` / `test` | Foundry (local Anvil) |
| `production` + `NEXT_PUBLIC_NETWORK=testnet` | Sepolia |
| `production` + `NEXT_PUBLIC_NETWORK=mainnet` | BSC |

Each chain gets its own `Telebuzzies` deployment (own proxy address, own admin set) — there is no bridging or shared state between them.

## Onchain vs. offchain split

**Onchain**: subscription lifecycle (start/end timestamps, plan), pricing, admin roles, and 100%-to-dividends revenue split. This is the billing source of truth — `getUserBillingPlan` derives PRO vs. LIGHT purely from whether `subscriptionEndTimestamp` is in the future, read live from the contract

**Offchain** (MongoDB via Prisma, `User` model): `apiKey`, `tgUserId`, `billingPeriodStart`, `billingPeriodMessagesSent`. The rolling 30-day billing period's *start* is derived from the onchain subscription start (falling back to `user.createdAt` for never-subscribed users), but the *message-count enforcement* within that period is purely an offchain counter enforced server-side in `POST /api/notify` — there is no onchain concept of a message quota

## No indexer, no projection table

Telebuzzies has no event indexer and no MongoDB mirror of onchain events. `getSubscriptionData` reads the contract live via viem, server-side, on every request that needs it (the notify endpoint, the billing UI). There is no `bytes32` onchain reference stored in an offchain row that a dev reseed could orphan, and no chain-scoped sync cursor to keep consistent — the two stores simply don't cross-reference each other by ID. This is a deliberate simplicity tradeoff for the product's current scale: an extra live RPC read per request, in exchange for no indexer, no reconciliation job, and no drift between projections and chain state to debug
