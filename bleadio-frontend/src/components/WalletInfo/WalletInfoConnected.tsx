"use client";

import { useAccount, useReadContract } from "wagmi";
import { DisconnectWalletBtn } from "../Buttons/DisconnectWalletBtn";
import { formatUnits } from "viem";
import { bleadContractAbi, usdContractAbi } from "@/config/web3/abi";
import { getClientConfig } from "@/config/env";
import { TruncatedString } from "../common/TruncatedString/TruncatedString";
import { TooltipPopover } from "../common/TooltipPopover/TooltipPopover";
import { AlertCircleIcon } from "lucide-react";
import { feesTokenDetailsSchema } from "@/lib/schemas/feesTokenDetailsSchema";

const ENV_CONFIG = getClientConfig();

export const WalletInfoConnected = () => {
  const { address } = useAccount();

  const {
    data: feesContractDetails,
    isPending: isPendingFeesContractDetails,
    isError: isErrorFeesContractDetails,
  } = useReadContract({
    abi: bleadContractAbi,
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
    abi: usdContractAbi,
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
        <p className="flex gap-2 justify-center items-center flex-wrap font-mono font-medium">
          {"Connected:"}
          <TruncatedString cutFrom="middle">{address!}</TruncatedString>
        </p>
        <p className="flex justify-center items-center gap-1 font-mono">
          {`Balance: ${displayBalance}`}
          {validationResult.success ? (
            <TooltipPopover
              content={`${validationResult.data.symbol} token address is ${validationResult.data.tokenAddress} on BNB chain`}
            >
              <AlertCircleIcon size={16} className="text-muted" />
            </TooltipPopover>
          ) : null}
        </p>
      </div>
      <DisconnectWalletBtn />
    </div>
  );
};
