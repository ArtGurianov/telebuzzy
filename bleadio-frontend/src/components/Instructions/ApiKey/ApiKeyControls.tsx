"use client";

import { resetApiKey } from "@/app/actions/resetApiKey";
import { ResetApiKeyBtn } from "@/components/Buttons/ResetApiKeyBtn";
import { FormStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Clipboard } from "@/components/common/Clipboard/Clipboard";
import { useSession } from "next-auth/react";

const API_KEY_MASK = "••••••••-••••-••••-••••-••••••••••••";

export const ApiKeyControls = () => {
  const {
    data: sessionData,
    update: updateSession,
    status: sessionStatus,
  } = useSession();

  const [status, setStatus] = useState<FormStatus>("PENDING");

  const handleResetApiKey = () => {
    setStatus("LOADING");
    resetApiKey(sessionData!.user.id!)
      .then((res) => {
        updateSession({ apiKey: res.data }).finally(() => {
          setStatus(res.success ? "SUCCESS" : "ERROR");
        });
      })
      .catch(() => {
        setStatus("ERROR");
      });
  };

  let displayValue = sessionData?.user?.apiKey || API_KEY_MASK;
  if (status === "LOADING" || sessionStatus === "loading") {
    displayValue = "loading...";
  }
  if (status === "ERROR") {
    displayValue = "Error! Please try again";
  }

  return (
    <div
      className={cn("flex px-2 py-1 justify-center items-center gap-4 w-full", {
        "bg-red-800/20": status === "ERROR",
      })}
    >
      <span className="grow">{displayValue}</span>
      {!!sessionData?.user?.apiKey ? (
        <Clipboard
          value={sessionData.user.apiKey}
          className="w-6 self-stretch"
        />
      ) : null}
      <ResetApiKeyBtn
        disabled={status === "LOADING"}
        userEmail={sessionData?.user?.email || null}
        onClick={() => {
          handleResetApiKey();
        }}
      >
        {sessionData?.user?.apiKey ? "Reset" : "Get"}
      </ResetApiKeyBtn>
    </div>
  );
};
