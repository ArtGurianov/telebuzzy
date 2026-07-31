"use client";

import { useState } from "react";
import { ConnectWalletBtn } from "../Buttons/ConnectWalletBtn";
import Link from "next/link";

export const WalletInfoNotConnected = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center">
      <span className="font-mono text-lg text-primary">
        {"Wallet not connected"}
      </span>
      <ConnectWalletBtn
        isConnecting={isConnecting}
        onChangeIsConnecting={() => setIsConnecting(true)}
      />
      <div className="px-4 py-px bg-primary/10 border-l-3 border-b-2 border-primary/80 font-light font-serif w-full text-center text-primary">
        {"Can't connect? "}
        <Link
          className="underline font-medium text-lg font-serif"
          href={`https://metamask.io/download`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {"GET METAMASK"}
        </Link>
      </div>
    </div>
  );
};
