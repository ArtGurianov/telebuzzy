import { createPublicClient, http } from "viem";
import { AppChain } from "./networkConfig";

// Without an rpcUrl viem falls back to the chain's built-in public endpoint
export const createViemClient = (chain: AppChain, rpcUrl?: string) =>
  createPublicClient({
    chain,
    transport: http(rpcUrl),
  });
