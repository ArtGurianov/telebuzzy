"use client";

import { Button } from "@mydaogs/ui";
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
