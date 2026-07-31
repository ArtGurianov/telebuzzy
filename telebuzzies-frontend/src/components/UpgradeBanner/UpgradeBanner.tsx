"use client";

import { useSubscription } from "@/components/Providers/SubscriptionProvider";
import { cn } from "@/lib/utils";
import { BILLING_PLANS } from "@/lib/utils/contsants";
import { getUserBillingPlan } from "@/lib/utils/getUserBillingPlan";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const UpgradeBanner = () => {
  const router = useRouter();
  const [isManualOpen, setIsManualOpen] = useState(true);
  const { data } = useSubscription();

  const isVisible =
    data &&
    getUserBillingPlan(Number(data.subscriptionEndTimestamp)) ===
      BILLING_PLANS.LIGHT &&
    isManualOpen;

  return (
    <div
      className={cn(
        "fixed flex flex-col gap-2 w-full bottom-0 translate-y-full px-4 py-4 bg-foreground/90 justify-center items-center border-t-2 rounded-t-lg",
        {
          "transform -translate-y-0 duration-800 delay-1000 ease-in-out":
            isVisible,
        },
        {
          "transform translate-y-full duration-800 ease-in-out": !isVisible,
        }
      )}
    >
      <Button
        variant="unset"
        size="unset"
        className="text-accent absolute top-4 right-4 opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        onClick={() => {
          setIsManualOpen(false);
        }}
      >
        <XIcon />
      </Button>
      <p className="flex flex-col gap-1 lg:flex-row justify-center items-center text-accent">
        <span>{"You’re currently on a LITE plan"}</span>
        <span>{"limited to 100 notifications/month."}</span>
      </p>
      <p className="flex gap-2 justify-center items-center text-accent">
        {"Need more?"}
        <Button onClick={() => router.push("/billing")}>
          {"Upgrade to PRO"}
        </Button>
      </p>
    </div>
  );
};
