"use server";

import { getServerConfig } from "@/config/env";
import { telebuzzyContractAbi } from "@/config/web3/abi";
import { createViemClient } from "@/config/web3/viemClient";
import { subscriptionDataSchema } from "@/lib/schemas/subscriptionDataSchema";
import {
  AppBusinessError,
  createActionResponse,
  getAppChain,
  stringToBytes32,
} from "@/lib/utils/";

const ENV_CONFIG = getServerConfig();
const viemClient = createViemClient(
  getAppChain(),
  ENV_CONFIG.RPC_URL ?? ENV_CONFIG.NEXT_PUBLIC_RPC_URL
);

export const getSubscriptionData = async (userId: string) => {
  try {
    const subscriptionData = await viemClient.readContract({
      abi: telebuzzyContractAbi,
      address: ENV_CONFIG.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      args: [stringToBytes32(userId)],
      functionName: "getSubscriptionData",
    });
    const validationResult = subscriptionDataSchema.safeParse(subscriptionData);
    if (!validationResult.success) {
      throw new AppBusinessError(
        "Received incorrect value type from blockchain",
        500
      );
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
