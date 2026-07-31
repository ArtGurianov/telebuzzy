"use client";

import { Button } from "@/components/ui/button";
import { usdContractAbi } from "@/config/web3/abi";
import { GetComponentProps } from "@/lib/types";
import { FC, useEffect } from "react";
import { parseUnits } from "viem";
import { useTransactionReceipt, useWriteContract } from "wagmi";
import { withAuthBtn } from "../Login/withAuthBtn";
import { toast } from "sonner";

interface ApproveTransactionBtnProps extends GetComponentProps<typeof Button> {
  currentAllowanceUsd?: number;
  currentBalanceUsd?: number;
  priceUsd?: number;
  usdContractAddress?: `0x${string}`;
  bleadContractAddress: `0x${string}`;
  decimals?: number;
  onSuccess: () => void;
  onError: () => void;
}

const ApproveTransactionBtnCore: FC<ApproveTransactionBtnProps> = ({
  currentAllowanceUsd,
  currentBalanceUsd,
  priceUsd,
  usdContractAddress,
  bleadContractAddress,
  decimals,
  onSuccess,
  onError,
  children,
}) => {
  const { writeContract, data: hash, isError: isTxError } = useWriteContract();

  useEffect(() => {
    if (hash) {
      toast("Transaction is sent!");
    }
  }, [hash]);

  const {
    isFetching,
    isSuccess,
    isError: isReceiptError,
  } = useTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isTxError || isReceiptError) {
      onError();
    }
  }, [isTxError, isReceiptError]);

  const sendTransaction = () => {
    if (!!usdContractAddress && !!priceUsd && !!decimals) {
      writeContract({
        abi: usdContractAbi,
        address: usdContractAddress,
        functionName: "approve",
        args: [bleadContractAddress, parseUnits(priceUsd.toString(), decimals)],
      });
    }
  };

  return (
    <Button
      disabled={
        isTxError ||
        isReceiptError ||
        isFetching ||
        !usdContractAddress ||
        !decimals ||
        typeof priceUsd !== "number" ||
        typeof currentAllowanceUsd !== "number" ||
        currentAllowanceUsd >= priceUsd ||
        typeof currentBalanceUsd !== "number" ||
        currentBalanceUsd < priceUsd
      }
      onClick={() => sendTransaction()}
    >
      {!isFetching ? children : "waiting..."}
    </Button>
  );
};

const ApproveTransactionBtn = withAuthBtn(ApproveTransactionBtnCore);
ApproveTransactionBtn.displayName = "ApproveTransactionBtn";

export { ApproveTransactionBtn };
