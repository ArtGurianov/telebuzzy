import { cookieStorage, createConfig, createStorage } from "wagmi";
import { createViemClient } from "./viemClient";
import { getAppChain } from "@/lib/utils";
import { metaMask } from "wagmi/connectors";

const chain = getAppChain();

export const wagmiConfig = createConfig({
  chains: [chain],
  connectors: [
    metaMask({
      headless: true,
    }),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  client: () => createViemClient(chain),
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
