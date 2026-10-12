"use client";

import { resetApiKey } from "@/app/actions/resetApiKey";
import { ResetApiKeyBtn } from "@/components/Buttons/ResetApiKeyBtn";
import { FormStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CopyToClipboardBtn } from "@mydaogs/ui/client";
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
        updateSession({ apiKey: res.success ? res.data : null }).finally(() => {
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
      className={cn(
        "flex flex-col gap-3 rounded-tb-control border-2 border-tb-border-default bg-tb-surface-base p-2 sm:flex-row sm:items-center",
        { "border-tb-danger bg-tb-status-critical-bg": status === "ERROR" }
      )}
    >
      <div className="flex min-w-0 grow items-center gap-2 pl-2">
        <span className="shrink-0 text-xs font-semibold tracking-wide text-tb-ink-secondary uppercase">
          {"API key"}
        </span>
        <span
          className={cn(
            "min-w-0 grow truncate font-mono text-sm md:text-base",
            { "text-tb-danger": status === "ERROR" }
          )}
          aria-live="polite"
        >
          {displayValue}
        </span>
        {!!sessionData?.user?.apiKey ? (
          <CopyToClipboardBtn
            value={sessionData.user.apiKey}
            size="icon"
            variant="ghost"
          />
        ) : null}
      </div>
      <ResetApiKeyBtn
        className="tb-pressable h-11 shrink-0 rounded-full px-6 text-base font-semibold"
        disabled={status === "LOADING"}
        userEmail={sessionData?.user?.email || null}
        onClick={() => {
          handleResetApiKey();
        }}
      >
        {sessionData?.user?.apiKey ? "Reset key" : "Get API key"}
      </ResetApiKeyBtn>
    </div>
  );
};
