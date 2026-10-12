"use client";

import { useAccount } from "wagmi";
import { WalletInfoNotConnected } from "./WalletInfoNotConnected";
import { WalletInfoConnected } from "./WalletInfoConnected";

export const WalletInfo = () => {
  const { isConnected } = useAccount();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-tb-card bg-tb-surface-sky px-4 py-4">
      {!isConnected ? <WalletInfoNotConnected /> : <WalletInfoConnected />}
    </div>
  );
};
