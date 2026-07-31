"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FC, useRef } from "react";
import { useAccount, useConnect } from "wagmi";

interface ConnectWalletBtnProps {
  isConnecting: boolean;
  onChangeIsConnecting: () => void;
}

export const ConnectWalletBtn: FC<ConnectWalletBtnProps> = ({
  isConnecting,
  onChangeIsConnecting,
}) => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const lockedRef = useRef(false);

  connectors[0].getProvider().then((provider) => {
    // @ts-expect-error: wagmi ships provider with unknown type
    provider.on("display_uri", (deeplink: string) => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      onChangeIsConnecting();
      router.push(deeplink);
    });
  });

  const handleClick = () => {
    connect({ connector: connectors[0] });
  };

  if (isConnected) return null;

  return (
    <Button disabled={isConnecting} onClick={handleClick}>
      {isConnecting ? "Connecting..." : "Connect MetaMask"}
    </Button>
  );
};
