"use client";

import { useSubscription } from "@/components/Providers/SubscriptionProvider";
import { cn } from "@/lib/utils";
import { BILLING_PLANS } from "@/lib/utils/contsants";
import { getUserBillingPlan } from "@/lib/utils/getUserBillingPlan";
import { getClientConfig } from "@/config/env";
import { useState } from "react";
import { XIcon } from "lucide-react";
import Link from "next/link";

const ENV_CONFIG = getClientConfig();

export const UpgradeBanner = () => {
  const [isManualOpen, setIsManualOpen] = useState(true);
  const { data } = useSubscription();

  const isVisible =
    !!data &&
    getUserBillingPlan(Number(data.subscriptionEndTimestamp)) ===
      BILLING_PLANS.LIGHT &&
    isManualOpen;

  return (
    <aside
      aria-label="Upgrade to PRO"
      aria-hidden={!isVisible}
      inert={!isVisible}
      className={cn(
        // Solid dark bar: stands apart from the translucent cream cards and
        // the busy backdrop. .tb-on-dark switches focus rings to white
        "tb-on-dark fixed inset-x-3 bottom-3 z-20 mx-auto flex max-w-xl flex-col items-center gap-3 rounded-tb-card bg-tb-ink-primary py-4 pr-12 pl-5 text-tb-surface-white shadow-[0_0_0_1px_rgb(255_255_255/0.15),0_18px_40px_-10px_rgb(24_38_63/0.7)] sm:flex-row sm:justify-between",
        // Enter: slow and soft after the page settles. Exit: quick
        isVisible
          ? "translate-y-0 opacity-100 transition-[translate,opacity] delay-[1200ms] duration-500 ease-tb-out"
          : "translate-y-[calc(100%+1.5rem)] opacity-0 transition-[translate,opacity] duration-200 ease-tb-out"
      )}
    >
      <p className="text-center text-pretty sm:text-left">
        <span className="font-semibold">{"You’re on LITE"}</span>
        <span className="text-tb-surface-white/75">
          {` · ${ENV_CONFIG.NEXT_PUBLIC_MESSAGES_LIMIT_LITE.toLocaleString("en-US")} notifications per 30 days`}
        </span>
      </p>
      <Link
        href="/billing"
        scroll={false}
        className="tb-pressable tb-cta-yellow inline-flex h-11 shrink-0 items-center rounded-full px-5 font-semibold"
      >
        {"Upgrade to PRO"}
      </Link>
      <button
        type="button"
        aria-label="Dismiss"
        className="tb-pressable absolute top-1/2 right-2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-tb-surface-white/80 hover:bg-tb-surface-white/10 hover:text-tb-surface-white"
        onClick={() => {
          setIsManualOpen(false);
        }}
      >
        <XIcon aria-hidden className="size-5" />
      </button>
    </aside>
  );
};
