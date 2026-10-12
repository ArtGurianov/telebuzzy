"use client";

import { telebuzzyContractAbi } from "@/config/web3/abi";
import { erc20Abi, formatUnits } from "viem";
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
} from "@mydaogs/ui/client";
import { WalletInfo } from "../WalletInfo/WalletInfo";
import { feesTokenDetailsSchema } from "@/lib/schemas/feesTokenDetailsSchema";
import { MyDaogsPromo } from "../MyDaogsPromo/MyDaogsPromo";
import { useRouter } from "next/navigation";
import { getAppChain } from "@/lib/utils/getAppChain";
import { bsc } from "viem/chains";

const ENV_CONFIG = getClientConfig();

export const BillingDialog = () => {
  const router = useRouter();
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
    data: balance,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
    refetch: refetchBalance,
  } = useReadContract({
    abi: erc20Abi,
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
    abi: telebuzzyContractAbi,
    address: ENV_CONFIG.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "FEES_TOKEN_MONTHLY_PRICE",
  });

  const {
    data: annualPrice,
    isPending: isPendingAnnualPrice,
    isError: isErrorAnnualPrice,
  } = useReadContract({
    abi: telebuzzyContractAbi,
    address: ENV_CONFIG.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "FEES_TOKEN_ANNUAL_PRICE",
  });

  const {
    data: allowance,
    isLoading: isLoadingAllowance,
    isError: isErrorAllowance,
    refetch: refetchAllowance,
  } = useReadContract({
    abi: erc20Abi,
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

  const annualSavingsPct =
    typeof monthlyPrice === "bigint" &&
    typeof annualPrice === "bigint" &&
    monthlyPrice > BigInt(0)
      ? Math.round(
          (1 - Number(annualPrice) / (Number(monthlyPrice) * 12)) * 100
        )
      : null;

  const chain = getAppChain();
  const isTestNetwork = chain.id !== bsc.id;

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
      <DialogContent className="h-auto max-h-[calc(100%-2rem)] gap-5 overflow-y-auto rounded-tb-feature bg-tb-surface-base sm:max-w-2xl">
        <DialogHeader className="items-center gap-2 text-center sm:text-center">
          <DialogTitle className="font-display text-3xl font-semibold">
            {"Telebuzzy PRO"}
          </DialogTitle>
          <DialogDescription className="text-center text-base text-pretty text-tb-ink-secondary">
            {`Go from ${ENV_CONFIG.NEXT_PUBLIC_MESSAGES_LIMIT_LITE.toLocaleString("en-US")} to ${ENV_CONFIG.NEXT_PUBLIC_MESSAGES_LIMIT_PRO.toLocaleString("en-US")} notifications every 30 days. Pay with a stablecoin from your wallet on ${chain.name}.`}
          </DialogDescription>
          {isTestNetwork ? (
            <p className="rounded-full bg-tb-status-warning-bg px-3 py-1 text-sm font-medium text-tb-warning">
              {`Test network — ${chain.name} test tokens only, no real funds`}
            </p>
          ) : null}
        </DialogHeader>
        {isError ? (
          <p
            role="alert"
            className="rounded-tb-control bg-tb-status-critical-bg px-4 py-2 text-center text-tb-danger"
          >
            {"Couldn’t load data from the blockchain. Please try again later."}
          </p>
        ) : null}
        {isLoading ? (
          <p aria-live="polite" className="text-center text-tb-ink-secondary">
            {"Loading data from the blockchain…"}
          </p>
        ) : null}
        <WalletInfo />
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <ButtonsBlock
            usdContractAddress={
              validationResult.data?.tokenAddress as `0x${string}` | undefined
            }
            telebuzzyContractAddress={
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
            telebuzzyContractAddress={
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
            badge={
              annualSavingsPct && annualSavingsPct > 0
                ? `Save ${annualSavingsPct}%`
                : null
            }
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
