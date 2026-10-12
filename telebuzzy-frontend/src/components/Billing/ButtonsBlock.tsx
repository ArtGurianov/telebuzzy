"use client";

import { ApproveTransactionBtn } from "@/components/Buttons/ApproveTransactionBtn";
import { SpendTransactionBtn } from "@/components/Buttons/SpendTransactionBtn";
import { BillingPlansSolidityKey } from "./constants";

interface ButtonsBlockProps {
  usdContractAddress?: `0x${string}`;
  telebuzzyContractAddress: `0x${string}`;
  priceUsd?: number;
  allowance?: number;
  balance?: number;
  decimals?: number;
  billingPlan: BillingPlansSolidityKey;
  badge?: string | null;
  onRefetchAllowance: () => void;
  onRefetchBalance: () => void;
}

export const ButtonsBlock = ({
  usdContractAddress,
  telebuzzyContractAddress,
  priceUsd,
  allowance,
  balance,
  decimals,
  billingPlan,
  badge,
  onRefetchAllowance,
  onRefetchBalance,
}: ButtonsBlockProps) => {
  return (
    <div className="relative flex w-full flex-col items-stretch gap-4 rounded-tb-card border border-tb-border-default bg-tb-surface-white p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-2xl font-semibold">
          {billingPlan === "MONTLY" ? "30 days" : "360 days"}
        </h3>
        {badge ? (
          <span className="rounded-full bg-tb-brand-yellow px-3 py-1 text-sm font-semibold">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="font-display text-4xl font-semibold">
        {typeof priceUsd === "number" ? `$${priceUsd}` : "…"}
        <span className="ml-1 font-sans text-base font-normal text-tb-ink-secondary">
          {"USD"}
        </span>
      </p>
      <div className="flex flex-col items-stretch gap-2">
        <ApproveTransactionBtn
          usdContractAddress={usdContractAddress}
          telebuzzyContractAddress={telebuzzyContractAddress}
          priceUsd={priceUsd}
          currentAllowanceUsd={allowance}
          currentBalanceUsd={balance}
          decimals={decimals}
          successMessage="Successfully updated allowance!"
          onSuccess={onRefetchAllowance}
          onError={() => {}}
        >{`Approve ${priceUsd || ""} USD`}</ApproveTransactionBtn>
        <SpendTransactionBtn
          contractAddress={telebuzzyContractAddress}
          priceUsd={priceUsd}
          currentAllowanceUsd={allowance}
          currentBalanceUsd={balance}
          billingPlan={billingPlan}
          successMessage="Well done! Successfully updated your subscription!"
          onSuccess={() => {
            onRefetchAllowance();
            onRefetchBalance();
          }}
          onError={() => {}}
        >
          {"Purchase"}
        </SpendTransactionBtn>
      </div>
    </div>
  );
};
