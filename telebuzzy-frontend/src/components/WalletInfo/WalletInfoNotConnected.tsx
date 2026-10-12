"use client";

import { useState } from "react";
import { ConnectWalletBtn } from "../Buttons/ConnectWalletBtn";
import Link from "next/link";

export const WalletInfoNotConnected = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center">
      <span className="font-medium">{"Wallet not connected"}</span>
      <ConnectWalletBtn
        isConnecting={isConnecting}
        onChangeIsConnecting={() => setIsConnecting(true)}
      />
      <p className="w-full text-center text-sm text-tb-ink-secondary">
        {"Can’t connect? "}
        <Link
          className="font-medium text-tb-brand-blue-strong underline underline-offset-4"
          href={`https://metamask.io/download`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {"Get MetaMask"}
          <span className="sr-only">{" (opens in a new tab)"}</span>
        </Link>
      </p>
    </div>
  );
};
