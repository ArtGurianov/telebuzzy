"use client";

import { useAccount } from "wagmi";
import { WalletInfoNotConnected } from "./WalletInfoNotConnected";
import { WalletInfoConnected } from "./WalletInfoConnected";

export const WalletInfo = () => {
  const { isConnected } = useAccount();

  return (
    <div className="flex w-full px-2 py-3 flex-col gap-4 justify-center items-center bg-foreground/10">
      {!isConnected ? <WalletInfoNotConnected /> : <WalletInfoConnected />}
    </div>
  );
};
