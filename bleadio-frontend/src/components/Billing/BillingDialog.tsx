"use client";

import { bleadContractAbi, usdContractAbi } from "@/config/web3/abi";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { ButtonsBlock } from "./ButtonsBlock";
import { BILLING_PLANS_SOLIDITY_KEYS } from "./constants";
import { getClientConfig } from "@/config/env";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WalletInfo } from "../WalletInfo/WalletInfo";
import { feesTokenDetailsSchema } from "@/lib/schemas/feesTokenDetailsSchema";
import { MyDaogsPromo } from "../MyDaogsPromo/MyDaogsPromo";
import { useRouter } from "next/navigation";

const ENV_CONFIG = getClientConfig();

export const BillingDialog = () => {
  const router = useRouter();
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
    data: balance,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
    refetch: refetchBalance,
  } = useReadContract({
    abi: usdContractAbi,
    address: validationResult.data?.tokenAddress as `0x${string}`,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: validationResult.success && !!address },
  });

  const {
    data: monthlyPrice,
    isPending: isPendingMonthlyPrice,
    isError: isErrorMonthlyPrice,
  } = useReadContract({
    abi: bleadContractAbi,
    address: ENV_CONFIG.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "FEES_TOKEN_MONTHLY_PRICE",
  });

  const {
    data: annualPrice,
    isPending: isPendingAnnualPrice,
    isError: isErrorAnnualPrice,
  } = useReadContract({
    abi: bleadContractAbi,
    address: ENV_CONFIG.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "FEES_TOKEN_ANNUAL_PRICE",
  });

  const {
    data: allowance,
    isLoading: isLoadingAllowance,
    isError: isErrorAllowance,
    refetch: refetchAllowance,
  } = useReadContract({
    abi: usdContractAbi,
    address: validationResult.data?.tokenAddress as `0x${string}`,
    functionName: "allowance",
    args: [address!, ENV_CONFIG.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`],
    query: { enabled: validationResult.success && !!address },
  });

  const isLoading =
    isPendingFeesContractDetails ||
    isLoadingBalance ||
    isPendingMonthlyPrice ||
    isPendingAnnualPrice ||
    isLoadingAllowance;

  const isError =
    isErrorFeesContractDetails ||
    isErrorBalance ||
    isErrorMonthlyPrice ||
    isErrorAnnualPrice ||
    isErrorAllowance;

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        router.push("/");
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-mono">
            {"blead.io PRO PLAN"}
          </DialogTitle>
          <DialogDescription className="text-center font-sans font-medium text-md text-primary underline underline-offset-4">
            {"Jump from 100 to 5000 telegram notifications per month!"}
          </DialogDescription>
        </DialogHeader>
        {isError ? (
          <p>{"An error occured while getting data from the blockchain"}</p>
        ) : null}
        {isLoading ? <p>{"Loading data from the blockchain"}</p> : null}
        <WalletInfo />
        <div className="w-full flex gap-8 justify-center items-center flex-wrap md:flex-nowrap">
          <ButtonsBlock
            usdContractAddress={
              validationResult.data?.tokenAddress as `0x${string}` | undefined
            }
            bleadContractAddress={
              ENV_CONFIG.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`
            }
            priceUsd={
              typeof monthlyPrice === "bigint"
                ? Number(monthlyPrice)
                : undefined
            }
            allowance={
              typeof allowance === "bigint" && validationResult.success
                ? Number(
                    formatUnits(allowance, validationResult.data?.decimals)
                  )
                : undefined
            }
            balance={
              typeof balance === "bigint" && validationResult.success
                ? Number(formatUnits(balance, validationResult.data.decimals))
                : undefined
            }
            decimals={
              validationResult.success
                ? validationResult.data.decimals
                : undefined
            }
            billingPlan={BILLING_PLANS_SOLIDITY_KEYS.MONTLY}
            onRefetchAllowance={() => {
              refetchAllowance();
            }}
            onRefetchBalance={() => {
              refetchBalance();
            }}
          />
          <ButtonsBlock
            usdContractAddress={
              validationResult.success
                ? (validationResult.data.tokenAddress as `0x${string}`)
                : undefined
            }
            bleadContractAddress={
              ENV_CONFIG.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`
            }
            priceUsd={
              typeof annualPrice === "bigint" ? Number(annualPrice) : undefined
            }
            allowance={
              typeof allowance === "bigint" && validationResult.success
                ? Number(formatUnits(allowance, validationResult.data.decimals))
                : undefined
            }
            balance={
              typeof balance === "bigint" && validationResult.success
                ? Number(formatUnits(balance, validationResult.data.decimals))
                : undefined
            }
            decimals={
              validationResult.success
                ? validationResult.data.decimals
                : undefined
            }
            billingPlan={BILLING_PLANS_SOLIDITY_KEYS.ANNUAL}
            onRefetchAllowance={() => {
              refetchAllowance();
            }}
            onRefetchBalance={() => {
              refetchBalance();
            }}
          />
        </div>
        <MyDaogsPromo />
      </DialogContent>
    </Dialog>
  );
};
