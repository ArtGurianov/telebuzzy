"use client";

import { Button } from "@/components/ui/button";
import { bleadContractAbi } from "@/config/web3/abi";
import { stringToBytes32 } from "@/lib/utils";
import { useTransactionReceipt, useWriteContract } from "wagmi";
import {
  BILLING_PLANS_SOLIDITY_KEYS_MAP,
  BillingPlansSolidityKey,
} from "@/components/Billing/constants";
import { FC, useEffect } from "react";
import { withAuthBtn } from "@/components/Login/withAuthBtn";
import { GetComponentProps } from "@/lib/types";
import { useSubscription } from "@/components/Providers/SubscriptionProvider";
import { useSession } from "next-auth/react";
import { sendEmail } from "@/app/actions/sendEmail";
import { EMAIL_MESSAGE_TYPES } from "@/lib/utils/contsants";
import { toast } from "sonner";

interface SpendTransactionBtnProps extends GetComponentProps<typeof Button> {
  currentAllowanceUsd?: number;
  currentBalanceUsd?: number;
  priceUsd?: number;
  contractAddress: `0x${string}`;
  billingPlan: BillingPlansSolidityKey;
  onSuccess: () => void;
  onError: () => void;
}

const SpendTransactionBtnCore: FC<SpendTransactionBtnProps> = ({
  currentAllowanceUsd,
  currentBalanceUsd,
  priceUsd,
  contractAddress,
  billingPlan,
  onSuccess,
  onError,
  children,
}) => {
  const { data } = useSession();

  const { writeContract, data: hash, isError: isTxError } = useWriteContract();

  useEffect(() => {
    if (hash) {
      toast("Transaction is sent!");
    }
  }, [hash]);

  const { refetch } = useSubscription();

  const {
    isFetching,
    isSuccess,
    isError: isReceiptError,
  } = useTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      refetch();
      onSuccess();
      sendEmail(data!.user.email!, EMAIL_MESSAGE_TYPES.SUBSCRIPTION_UPGRADED);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isTxError || isReceiptError) {
      onError();
    }
  }, [isTxError, isReceiptError]);

  const sendTransaction = () => {
    if (data?.user.id) {
      writeContract({
        abi: bleadContractAbi,
        address: contractAddress,
        functionName: "updateSubscription",
        args: [
          stringToBytes32(data.user.id),
          BILLING_PLANS_SOLIDITY_KEYS_MAP[billingPlan],
        ],
      });
    }
  };

  return (
    <Button
      disabled={
        isTxError ||
        isReceiptError ||
        isFetching ||
        !priceUsd ||
        typeof currentAllowanceUsd !== "number" ||
        currentAllowanceUsd < priceUsd ||
        typeof currentBalanceUsd !== "number" ||
        currentBalanceUsd < priceUsd
      }
      onClick={() => {
        sendTransaction();
      }}
    >
      {!isFetching ? children : "waiting..."}
    </Button>
  );
};

const SpendTransactionBtn = withAuthBtn(SpendTransactionBtnCore);
SpendTransactionBtn.displayName = "SpendTransactionBtn";

export { SpendTransactionBtn };
