"use client";

import { Button } from "@mydaogs/ui";
import { GetComponentProps } from "@/lib/types";
import { FC } from "react";
import { erc20Abi, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { withAuthBtn } from "../Login/withAuthBtn";
import { useSession } from "next-auth/react";
import { buildPendingTxConflictKey } from "@mydaogs/web3-tx";
import { useAppWriteContract, usePendingTxScope } from "@/config/web3/txClient";
import { TX_ACTION, TX_CONFLICT, TX_ENTITY } from "@/config/web3/txSync";

interface ApproveTransactionBtnProps extends GetComponentProps<typeof Button> {
  currentAllowanceUsd?: number;
  currentBalanceUsd?: number;
  priceUsd?: number;
  usdContractAddress?: `0x${string}`;
  telebuzziesContractAddress: `0x${string}`;
  decimals?: number;
  successMessage?: string;
  onSuccess: () => void;
  onError: () => void;
}

const ApproveTransactionBtnCore: FC<ApproveTransactionBtnProps> = ({
  currentAllowanceUsd,
  currentBalanceUsd,
  priceUsd,
  usdContractAddress,
  telebuzziesContractAddress,
  decimals,
  successMessage,
  onSuccess,
  onError,
  children,
}) => {
  const { data } = useSession();
  const { address } = useAccount();

  // The submit/success/error toasts come from `useAppWriteContract` itself
  // (see `txClient.ts`'s `toastAdapter`/`useMessages`) - do not toast here
  // too, or every tx state shows two toasts.
  const { writeContract, isProcessing, isError } = useAppWriteContract({
    onSuccess: () => {
      onSuccess();
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
        buildPendingTxConflictKey(data.user.id, TX_CONFLICT.APPROVE_USD)
      )
    : false;

  const sendTransaction = () => {
    if (
      data?.user.id &&
      usdContractAddress != null &&
      typeof priceUsd === "number" &&
      typeof decimals === "number"
    ) {
      writeContract(
        {
          abi: erc20Abi,
          address: usdContractAddress,
          functionName: "approve",
          args: [telebuzziesContractAddress, parseUnits(priceUsd.toString(), decimals)],
        },
        {
          pendingItems: [
            {
              entityType: TX_ENTITY.SUBSCRIPTION,
              entityId: data.user.id,
              conflictKey: TX_CONFLICT.APPROVE_USD,
              actionKey: TX_ACTION.APPROVE_USD,
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
        !usdContractAddress ||
        typeof decimals !== "number" ||
        typeof priceUsd !== "number" ||
        typeof currentAllowanceUsd !== "number" ||
        currentAllowanceUsd >= priceUsd ||
        typeof currentBalanceUsd !== "number" ||
        currentBalanceUsd < priceUsd
      }
      onClick={() => sendTransaction()}
    >
      {!isProcessing && !isBlockedByPendingTx ? children : "waiting..."}
    </Button>
  );
};

const ApproveTransactionBtn = withAuthBtn(ApproveTransactionBtnCore);
ApproveTransactionBtn.displayName = "ApproveTransactionBtn";

export { ApproveTransactionBtn };
