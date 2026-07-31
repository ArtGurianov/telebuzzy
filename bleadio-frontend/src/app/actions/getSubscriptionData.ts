"use server";

import { getServerConfig } from "@/config/env";
import { bleadContractAbi } from "@/config/web3/abi";
import { viemClient } from "@/config/web3/viemClient";
import { subscriptionDataSchema } from "@/lib/schemas/subscriptionDataSchema";
import {
  AppClientError,
  createActionResponse,
  stringToBytes32,
} from "@/lib/utils/";

const ENV_CONFIG = getServerConfig();

export const getSubscriptionData = async (userId: string) => {
  try {
    const subscriptionData = await viemClient.readContract({
      abi: bleadContractAbi,
      address: ENV_CONFIG.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      args: [stringToBytes32(userId)],
      functionName: "getSubscriptionData",
    });
    const validationResult = subscriptionDataSchema.safeParse(subscriptionData);
    if (!validationResult.success) {
      throw new AppClientError("Received incorrect value type from blockchain");
    }

    return createActionResponse({
      data: validationResult.data,
    });
  } catch (error) {
    return createActionResponse({
      error,
    });
  }
};
