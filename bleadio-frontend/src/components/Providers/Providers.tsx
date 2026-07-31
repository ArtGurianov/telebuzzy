"use client";

import { wagmiConfig } from "@/config/web3/wagmiConfig";
import { ReactNode, useState } from "react";
import { State, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SubscriptionProvider } from "./SubscriptionProvider";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: ReactNode;
  initialState?: State;
}

export const Providers = ({ children, initialState }: ProvidersProps) => {
  const [config] = useState(() => wagmiConfig);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <WagmiProvider config={config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          <SubscriptionProvider>{children}</SubscriptionProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
};
