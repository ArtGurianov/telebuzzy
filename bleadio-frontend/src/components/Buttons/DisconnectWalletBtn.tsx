"use client";

import { Button } from "@/components/ui/button";
import { useDisconnect } from "wagmi";

export const DisconnectWalletBtn = () => {
  const { disconnect } = useDisconnect();

  return (
    <Button
      onClick={() => {
        disconnect();
      }}
    >
      {"Disconnect"}
    </Button>
  );
};
