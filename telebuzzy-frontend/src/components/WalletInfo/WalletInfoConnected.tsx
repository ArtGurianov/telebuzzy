"use client";

import { useAccount, useReadContract } from "wagmi";
import { DisconnectWalletBtn } from "../Buttons/DisconnectWalletBtn";
import { erc20Abi, formatUnits } from "viem";
import { telebuzzyContractAbi } from "@/config/web3/abi";
import { getClientConfig } from "@/config/env";
import { TruncatedString, TooltipPopover } from "@mydaogs/ui/client";
import { AlertCircleIcon } from "lucide-react";
import { feesTokenDetailsSchema } from "@/lib/schemas/feesTokenDetailsSchema";
import { getAppChain } from "@/lib/utils/getAppChain";

const ENV_CONFIG = getClientConfig();

export const WalletInfoConnected = () => {
  const { address } = useAccount();

  const {
    data: feesContractDetails,
    isPending: isPendingFeesContractDetails,
    isError: isErrorFeesContractDetails,
  } = useReadContract({
    abi: telebuzzyContractAbi,
    address: ENV_CONFIG.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getFeesTokenDetails",
  });

  const validationResult =
    feesTokenDetailsSchema.safeParse(feesContractDetails);

  const {
    data: balanceUsd,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
  } = useReadContract({
    abi: erc20Abi,
    address: validationResult.data?.tokenAddress as `0x${string}`,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: validationResult.success && !!address },
  });

  const isLoading = isPendingFeesContractDetails || isLoadingBalance;

  const isError = isErrorFeesContractDetails || isErrorBalance;

  let displayBalance = "loading...";
  if (validationResult.success && typeof balanceUsd === "bigint") {
    displayBalance = `${formatUnits(
      balanceUsd,
      validationResult.data.decimals
    )}${validationResult.data.symbol}`;
  }
  if (isLoading) {
    displayBalance = "loading...";
  }
  if (isError) {
    displayBalance = "blockchain fetch error";
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center w-full px-6">
      <div className="flex flex-col gap-1 justify-center items-start">
        <p className="flex flex-wrap items-center justify-center gap-2 font-medium">
          {"Connected:"}
          <TruncatedString maxLen={11} cutFrom="middle">
            {address!}
          </TruncatedString>
        </p>
        <p className="flex items-center justify-center gap-1 text-tb-ink-secondary">
          {`Balance: ${displayBalance}`}
          {validationResult.success ? (
            <TooltipPopover
              content={`${validationResult.data.symbol} token address is ${validationResult.data.tokenAddress} on ${getAppChain().name}`}
            >
              <AlertCircleIcon size={16} className="text-tb-ink-secondary" />
            </TooltipPopover>
          ) : null}
        </p>
      </div>
      <DisconnectWalletBtn />
    </div>
  );
};
