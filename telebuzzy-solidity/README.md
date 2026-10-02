# telebuzzy-solidity

Foundry project with the `Telebuzzy` subscription contract that powers PRO plans on [telebuzzy.xyz](https://telebuzzy.xyz).

`Telebuzzy` is a UUPS-upgradeable contract (behind an `ERC1967Proxy`) built on `MyDaogsAbstractProject`. Users buy a MONTHLY (30 days) or ANNUAL (360 days) subscription keyed by `bytes32(userId)`. Payment is in the fees token resolved by the `MyDaogsIsolatedDividends` contract, and 100% of every charge goes to that dividends contract. Buying while still subscribed extends the current subscription. See [`docs/decisions/blockchain.md`](../docs/decisions/blockchain.md) for the full design.

## Setup

Requires [Foundry](https://book.getfoundry.sh/getting-started/installation). Dependencies are git submodules:

```bash
git submodule update --init --recursive
forge build
forge test
```

| Command | Description |
|---|---|
| `forge build` | Compile |
| `forge test` | Run the test suite (`test/Telebuzzy.t.sol`) |
| `forge test --match-test <name> -vvvv` | Run one test, verbose |
| `forge fmt` | Format (CI runs `forge fmt --check`) |

## Deploying

Full step-by-step procedure (dry run, deploy, recording addresses, troubleshooting): [`docs/runbooks/deploy-contracts.md`](../docs/runbooks/deploy-contracts.md).

Copy `.env.example` to `.env`:

| Variable | Description |
|---|---|
| `NETWORK` | `testnet` (or anything other than `mainnet`) deploys a `TestUSDT` token and a `MyDaogsIsolatedDividends` contract when no predeployed addresses are given. `mainnet` requires both predeployed addresses |
| `DEPLOYER_PRIVATE_KEY` | Deployer key, funded with gas on the target chain |
| `PREDEPLOYED_ADDRESS_USD` | Existing stablecoin address (optional on testnet) |
| `PREDEPLOYED_ADDRESS_DIVIDENDS` | Existing dividends contract (optional on testnet) |
| `MONTHLY_PRICE_USD` | Monthly price in whole USD, e.g. `5` |
| `ANNUAL_PRICE_USD` | Annual price in whole USD, e.g. `50` |
| `SEPOLIA_RPC_URL` | Sepolia RPC endpoint (Alchemy, Infura, …) |
| `ETHERSCAN_API_KEY` | For `--verify` |

Deploy to Sepolia (`forge script` compiles first):

```bash
forge script script/deployments/FullDeployment.s.sol --rpc-url sepolia --broadcast --verify
```

The script logs both addresses. Set the **PROXY** address as `NEXT_PUBLIC_CONTRACT_ADDRESS` in the frontend; the implementation address is never used by the app.

On testnet, the deployer receives 1000 TestUSDT, and anyone can call `publicMint1000USDT()` on the TestUSDT contract (24h cooldown) to get tokens for trying PRO.

## Frontend ABI

After changing the contract, regenerate the frontend ABI from the repo root and commit it:

```bash
pnpm abi:export
```

This writes `telebuzzy-frontend/src/config/web3/abi.ts` from the compiler output. CI fails if the committed file is out of date.
