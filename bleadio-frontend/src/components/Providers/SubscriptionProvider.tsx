"use client";

import { useSession } from "next-auth/react";
import { subscriptionDataSchema } from "@/lib/schemas/subscriptionDataSchema";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { z } from "zod";
import { useReadContract } from "wagmi";
import { bleadContractAbi } from "@/config/web3/abi";
import { getClientConfig } from "@/config/env";
import { stringToBytes32 } from "@/lib/utils";

interface SubscriptionProviderProps {
  children: ReactNode;
}

interface SubscriptionProviderData {
  isIdle: boolean;
  isLoading: boolean;
  isPending: boolean;
  isError: boolean;
  data: z.infer<typeof subscriptionDataSchema> | null;
  refetch: () => void;
}

const INITIAL_VALUE = {
  isIdle: true,
  isLoading: false,
  isPending: true,
  isError: false,
  data: null,
  refetch: () => {},
} as const satisfies SubscriptionProviderData;

export const SubscriptionContext =
  createContext<SubscriptionProviderData>(INITIAL_VALUE);

export const SubscriptionProvider = ({
  children,
}: SubscriptionProviderProps) => {
  const { data: session } = useSession();
  const result = useReadContract({
    abi: bleadContractAbi,
    address: getClientConfig().NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getSubscriptionData",
    args: session?.user?.id ? [stringToBytes32(session.user.id)] : undefined,
    query: { enabled: !!session?.user?.id },
  });

  const returnValue = useMemo(() => {
    const { data, isError, isPending, isLoading, refetch } = result;
    const value: SubscriptionProviderData = {
      isIdle: isPending && !isLoading,
      isLoading,
      isPending,
      isError,
      data: null,
      refetch,
    };

    if (data) {
      const validationResult = subscriptionDataSchema.safeParse(data);
      value.isError = value.isError || !!validationResult.error;
      value.data = validationResult.data ? validationResult.data : null;
    }

    return value;
  }, [result]);

  return (
    <SubscriptionContext.Provider value={returnValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const value = useContext(SubscriptionContext);
  if (!value) {
    throw new Error("SubscriptionContext used outside of its provider.");
  }
  return value;
};
