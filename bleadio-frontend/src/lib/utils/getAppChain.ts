import { getClientConfig } from "@/config/env";
import { NETWORK_NAMES_MAP } from "@/config/web3/networkConfig";

const ENV_CONFIG = getClientConfig();

export function getAppChain() {
  switch (ENV_CONFIG.NEXT_PUBLIC_APP_ENV) {
    case "development":
      return NETWORK_NAMES_MAP.FOUNDRY;
    case "test":
      return NETWORK_NAMES_MAP.FOUNDRY;
    case "production":
      return ENV_CONFIG.NEXT_PUBLIC_NETWORK === "mainnet"
        ? NETWORK_NAMES_MAP.MAINNET
        : NETWORK_NAMES_MAP.TESTNET;
    default:
      return NETWORK_NAMES_MAP.FOUNDRY;
  }
}
