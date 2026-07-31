"use client";

import { ApproveTransactionBtn } from "@/components/Buttons/ApproveTransactionBtn";
import { SpendTransactionBtn } from "@/components/Buttons/SpendTransactionBtn";
import { BillingPlansSolidityKey } from "./constants";
import { toast } from "sonner";

interface ButtonsBlockProps {
  usdContractAddress?: `0x${string}`;
  bleadContractAddress: `0x${string}`;
  priceUsd?: number;
  allowance?: number;
  balance?: number;
  decimals?: number;
  billingPlan: BillingPlansSolidityKey;
  onRefetchAllowance: () => void;
  onRefetchBalance: () => void;
}

export const ButtonsBlock = ({
  usdContractAddress,
  bleadContractAddress,
  priceUsd,
  allowance,
  balance,
  decimals,
  billingPlan,
  onRefetchAllowance,
  onRefetchBalance,
}: ButtonsBlockProps) => {
  return (
    <div className="flex relative flex-col gap-3 justify-center items-center py-8 w-full max-w-[320px] border-2 rounded-xl bg-gradient-to-br from-card/40 to-muted/40">
      {billingPlan === "ANNUAL" ? (
        <span className="absolute top-2 right-0 px-2 bg-popover/60 rounded-l-md text-primary font-serif">
          {"Save 30%"}
        </span>
      ) : null}
      <h2 className="text-3xl font-light font-mono text-foreground/80 text-center">
        {billingPlan === "MONTLY" ? "30 days" : "360 days"}
      </h2>
      <h3 className="text-4xl font-semibold font-sans bg-accent/20 border-y-2 border-accent w-full text-center text-accent-foreground py-1">
        {typeof priceUsd === "number" ? `${priceUsd}$` : "..."}
      </h3>
      <div className="flex flex-col gap-2 justify-center items-stretch mt-2 px-2">
        <ApproveTransactionBtn
          usdContractAddress={usdContractAddress}
          bleadContractAddress={bleadContractAddress}
          priceUsd={priceUsd}
          currentAllowanceUsd={allowance}
          currentBalanceUsd={balance}
          decimals={decimals}
          onSuccess={() => {
            onRefetchAllowance();
            toast("Successfully updated allowance!");
          }}
          onError={() => {
            toast("An error occured while performing a transaction");
          }}
        >{`Approve ${priceUsd || ""} USD`}</ApproveTransactionBtn>
        <SpendTransactionBtn
          contractAddress={bleadContractAddress}
          priceUsd={priceUsd}
          currentAllowanceUsd={allowance}
          currentBalanceUsd={balance}
          billingPlan={billingPlan}
          onSuccess={() => {
            onRefetchAllowance();
            onRefetchBalance();
            toast("Well done! Successfully updated your subscription!");
          }}
          onError={() => {
            toast("An error occured while performing a transaction");
          }}
        >
          {"Purchase"}
        </SpendTransactionBtn>
      </div>
    </div>
  );
};
