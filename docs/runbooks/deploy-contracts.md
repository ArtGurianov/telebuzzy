# Deploy contracts

Deploys a fresh `Telebuzzy` (implementation + `ERC1967Proxy`) to Sepolia with `script/deployments/FullDeployment.s.sol`. On testnet the same run also deploys `TestUSDT` and `MyDaogsIsolatedDividends`. Design background: [`decisions/blockchain.md`](../decisions/blockchain.md)

## When to use

- First deployment to a network
- Redeploying from scratch (new proxy address, empty subscription state)
- Not for upgrading an existing proxy — that keeps the proxy address and is covered by [`decisions/solidity-upgradeability.md`](../decisions/solidity-upgradeability.md)

## Prerequisites

- Foundry installed, submodules initialised (`git submodule update --init --recursive`)
- Deployer wallet funded with Sepolia ETH
- Working tree committed, so the deployed code matches a known revision
- `forge build && forge test` green in `telebuzzy-solidity/`

## 1. Configure `telebuzzy-solidity/.env`

```bash
NETWORK=testnet                 # never "mainnet" here
DEPLOYER_PRIVATE_KEY=0x...
PREDEPLOYED_ADDRESS_USD=        # empty → deploys TestUSDT
PREDEPLOYED_ADDRESS_DIVIDENDS=  # empty → deploys MyDaogsIsolatedDividends
MONTHLY_PRICE_USD=5             # whole USD, not token units
ANNUAL_PRICE_USD=50             # whole USD, not token units
SEPOLIA_RPC_URL=https://...
ETHERSCAN_API_KEY=...           # used by --verify via foundry.toml [etherscan]
```

`.env` is gitignored — never commit it

## 2. Load env and dry-run

Without `--broadcast` nothing is sent: the script is simulated against Sepolia and prints the addresses and gas estimate

```bash
cd telebuzzy-solidity
forge clean && set -a && source .env && set +a

forge script script/deployments/FullDeployment.s.sol:FullDeployment \
  --rpc-url "$SEPOLIA_RPC_URL"
```

Use `&&` after `forge clean`, never `&` — a backgrounded clean races the script's compilation and can delete `out/` mid-run

## 3. Deploy

```bash
forge script script/deployments/FullDeployment.s.sol:FullDeployment \
  --rpc-url "$SEPOLIA_RPC_URL" \
  --broadcast \
  --verify \
  --slow \
  --timeout 300
```

- `--slow` sends each transaction only after the previous one is confirmed — the deploys depend on each other (TestUSDT → Dividends → implementation → proxy)
- `--verify` publishes sources to Etherscan
- `--timeout 300` is the broadcast timeout in seconds

## 4. Record the output

The script logs every address. Keep them with the commit hash (`git rev-parse HEAD`) in the team's deployment notes

| Log line | Used for |
| --- | --- |
| `Telebuzzy PROXY address` | `NEXT_PUBLIC_CONTRACT_ADDRESS` in the frontend — the only app-facing address |
| `Telebuzzy implementation address` | Upgrades and Etherscan reference only, never the app |
| `USDT token contract address` | Import into MetaMask, mint test tokens |
| `Dividends contract address` | Reference only |

The full transaction log is written to `broadcast/FullDeployment.s.sol/11155111/run-latest.json`. `.gitignore` excludes only local Anvil (`31337`) and dry-run logs, so commit the Sepolia broadcast folder as the deployment record

## 5. Point the frontend at the new contract

1. Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to the proxy address in Vercel (Production and Preview)
2. Redeploy — `NEXT_PUBLIC_*` values are inlined at build time
3. The ABI only changes when the contract source changes. If it did, run `pnpm abi:export` at the repo root and commit before redeploying (CI fails on a stale ABI)

## 6. Smoke test

1. Open the proxy on [sepolia.etherscan.io](https://sepolia.etherscan.io) and confirm it shows as verified, and that `FEES_TOKEN_MONTHLY_PRICE` / `FEES_TOKEN_ANNUAL_PRICE` match `.env`
2. From a test wallet, call `publicMint1000USDT()` on the TestUSDT contract (24h cooldown per address)
3. On the site, sign in, subscribe to PRO, and confirm the plan switches to PRO

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `EnvValueNotProvided` | `DEPLOYER_PRIVATE_KEY` or `NETWORK` missing — check `.env` was sourced |
| `RequiredAddressUSDT` / `RequiredAddressDividends` | `NETWORK=mainnet` without predeployed addresses — use `testnet` for Sepolia |
| Run interrupted mid-broadcast (timeout, RPC drop) | Re-run the step 3 command with `--resume` added — it continues from the broadcast log instead of redeploying |
| Deployed but verification failed | Re-run the step 3 command with `--resume`; `--verify` retries verification for the recorded deployments |
| Site still reads the old contract | Frontend was not rebuilt after changing `NEXT_PUBLIC_CONTRACT_ADDRESS` |
