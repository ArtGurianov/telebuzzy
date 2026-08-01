"use client";

import { Button } from "@mydaogs/ui";
import { telebuzziesContractAbi } from "@/config/web3/abi";
import { stringToBytes32 } from "@/lib/utils";
import { useAccount } from "wagmi";
import {
  BILLING_PLANS_SOLIDITY_KEYS_MAP,
  BillingPlansSolidityKey,
} from "@/components/Billing/constants";
import { FC } from "react";
import { withAuthBtn } from "@/components/Login/withAuthBtn";
import { GetComponentProps } from "@/lib/types";
import { useSubscription } from "@/components/Providers/SubscriptionProvider";
import { useSession } from "next-auth/react";
import { sendEmail } from "@/app/actions/sendEmail";
import { EMAIL_MESSAGE_TYPES } from "@/lib/utils/contsants";
import { buildPendingTxConflictKey } from "@mydaogs/web3-tx";
import { useAppWriteContract, usePendingTxScope } from "@/config/web3/txClient";
import { TX_ACTION, TX_CONFLICT, TX_ENTITY } from "@/config/web3/txSync";

interface SpendTransactionBtnProps extends GetComponentProps<typeof Button> {
  currentAllowanceUsd?: number;
  currentBalanceUsd?: number;
  priceUsd?: number;
  contractAddress: `0x${string}`;
  billingPlan: BillingPlansSolidityKey;
  successMessage?: string;
  onSuccess: () => void;
  onError: () => void;
}

const SpendTransactionBtnCore: FC<SpendTransactionBtnProps> = ({
  currentAllowanceUsd,
  currentBalanceUsd,
  priceUsd,
  contractAddress,
  billingPlan,
  successMessage,
  onSuccess,
  onError,
  children,
}) => {
  const { data } = useSession();
  const { address } = useAccount();
  const { refetch } = useSubscription();

  // The submit/success/error toasts come from `useAppWriteContract` itself
  // (see `txClient.ts`'s `toastAdapter`/`useMessages`) - do not toast here
  // too, or every tx state shows two toasts.
  const { writeContract, isProcessing, isError } = useAppWriteContract({
    // `queryKeysToInvalidate` below already refreshes every active
    // `useReadContract` read - including the subscription context's - once
    // reconciliation finishes, which would cover this. `refetch()` is kept
    // as a second, independent path so a subscription read that is not
    // "active" in react-query's sense at that moment (e.g. mid-remount)
    // still gets refreshed.
    onSuccess: () => {
      refetch();
      onSuccess();
      sendEmail(data!.user.email!, EMAIL_MESSAGE_TYPES.SUBSCRIPTION_UPGRADED);
    },
    onError: () => {
      onError();
    },
    successMessage,
    queryKeysToInvalidate: [["readContract"]],
  });

  const pendingScope = usePendingTxScope({
    entityType: TX_ENTITY.SUBSCRIPTION,
    account: address ?? null,
  });
  const isBlockedByPendingTx = data?.user.id
    ? pendingScope.blockingEntryByConflictKey.has(
        buildPendingTxConflictKey(data.user.id, TX_CONFLICT.UPDATE_SUBSCRIPTION)
      )
    : false;

  const sendTransaction = () => {
    if (data?.user.id) {
      writeContract(
        {
          abi: telebuzziesContractAbi,
          address: contractAddress,
          functionName: "updateSubscription",
          args: [
            stringToBytes32(data.user.id),
            BILLING_PLANS_SOLIDITY_KEYS_MAP[billingPlan],
          ],
        },
        {
          pendingItems: [
            {
              entityType: TX_ENTITY.SUBSCRIPTION,
              entityId: data.user.id,
              conflictKey: TX_CONFLICT.UPDATE_SUBSCRIPTION,
              actionKey: TX_ACTION.UPDATE_SUBSCRIPTION,
            },
          ],
        }
      );
    }
  };

  return (
    <Button
      disabled={
        isError ||
        isProcessing ||
        isBlockedByPendingTx ||
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
      {!isProcessing && !isBlockedByPendingTx ? children : "waiting..."}
    </Button>
  );
};

const SpendTransactionBtn = withAuthBtn(SpendTransactionBtnCore);
SpendTransactionBtn.displayName = "SpendTransactionBtn";

export { SpendTransactionBtn };
