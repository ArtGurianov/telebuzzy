"use client";

import { wagmiConfig } from "@/config/web3/wagmiConfig";
import { ReactNode, useState } from "react";
import { State, WagmiProvider, useAccount } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CACHE_TIMES } from "@mydaogs/query";
import { SubscriptionProvider } from "./SubscriptionProvider";
import { SessionProvider } from "next-auth/react";
import { PendingTxWatcher } from "@/config/web3/txClient";
import { DialogShellProvider } from "@mydaogs/ui/client";

interface ProvidersProps {
  children: ReactNode;
  initialState?: State;
}

/**
 * Resumes any subscription transaction a live write hook no longer owns
 * (page reload, closed tab). Rendered inside `WagmiProvider` /
 * `QueryClientProvider` because it needs both the connected account and the
 * query client to reconcile.
 */
const PendingTxWatcherMount = () => {
  const { address } = useAccount();
  return <PendingTxWatcher account={address} />;
};

export const Providers = ({ children, initialState }: ProvidersProps) => {
  const [config] = useState(() => wagmiConfig);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Every query in this app is a chain read (`useReadContract`,
        // `useTransactionReceipt`) - never cached, always fresh.
        defaultOptions: { queries: CACHE_TIMES.NO_CACHE },
      })
  );

  return (
    <SessionProvider>
      <WagmiProvider config={config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          <SubscriptionProvider>
            <DialogShellProvider>{children}</DialogShellProvider>
          </SubscriptionProvider>
          <PendingTxWatcherMount />
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
};
