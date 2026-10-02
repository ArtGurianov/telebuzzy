import { createChainResolver } from "@mydaogs/web3";
import { getClientConfig } from "@/config/env";
import { AppChain, NETWORK_NAMES_MAP } from "@/config/web3/networkConfig";

const ENV_CONFIG = getClientConfig();

// createChainResolver's map is keyed by its own LOCAL/TESTNET/MAINNET
// network identifiers, not this project's FOUNDRY/TESTNET/MAINNET ones.
const resolveChain = createChainResolver({
  LOCAL: NETWORK_NAMES_MAP.FOUNDRY,
  TESTNET: NETWORK_NAMES_MAP.TESTNET,
  MAINNET: NETWORK_NAMES_MAP.MAINNET,
});

export function getAppChain(): AppChain {
  return resolveChain({
    NODE_ENV: ENV_CONFIG.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_NETWORK: ENV_CONFIG.NEXT_PUBLIC_NETWORK,
  }) as AppChain;
}
