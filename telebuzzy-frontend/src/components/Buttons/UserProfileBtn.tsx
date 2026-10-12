"use client";

import { PopoverDrawer } from "@/components/common/PopoverDrawer/PopoverDrawer";
import { withAuthBtn } from "@/components/Login/withAuthBtn";
import { Button } from "@mydaogs/ui";
import { LogoutBtn } from "./LogoutBtn";
import { useSession } from "next-auth/react";
import { useSubscription } from "../Providers/SubscriptionProvider";
import { getUserBillingPlan } from "@/lib/utils/getUserBillingPlan";
import { getClientConfig } from "@/config/env";
import { cn } from "@/lib/utils";
import { GetComponentProps } from "@/lib/types";
import Link from "next/link";
import { BILLING_PLANS } from "@/lib/utils/contsants";

const DISPLAY_USER_KEYS = {
  EMAIL: "EMAIL",
  TG_ID: "TG_ID",
  MESSAGES_SENT: "MESSAGES_SENT",
  BILLING_PLAN: "BILLING_PLAN",
  SUBSCRIPTION_TILL: "SUBSCRIPTION_TILL",
} as const;
type DisplayUserKey = keyof typeof DISPLAY_USER_KEYS;
const DISPLAY_DATA_ORDER: DisplayUserKey[] = [
  DISPLAY_USER_KEYS.EMAIL,
  DISPLAY_USER_KEYS.TG_ID,
  DISPLAY_USER_KEYS.MESSAGES_SENT,
  DISPLAY_USER_KEYS.BILLING_PLAN,
  DISPLAY_USER_KEYS.SUBSCRIPTION_TILL,
];

const UserProfileBtnCore = ({
  children,
  className,
  variant,
  size,
}: GetComponentProps<typeof Button>) => {
  const {
    data: subscriptionData,
    isPending,
    isLoading,
    isError,
  } = useSubscription();

  const { data: session } = useSession();
  if (!session) return null;
  const {
    user: { email, tgUserId, billingPeriodMessagesSent },
  } = session;

  let displayBillingPlan = "loading...";
  if (isError) {
    displayBillingPlan = "error";
  }
  if (subscriptionData) {
    displayBillingPlan = getUserBillingPlan(
      Number(subscriptionData.subscriptionEndTimestamp)
    );
  }
  if (isPending || isLoading) {
    displayBillingPlan = "loading...";
  }

  let displaySubscriptionTill = "loading...";
  if (isError) {
    displaySubscriptionTill = "error";
  }
  if (subscriptionData) {
    displaySubscriptionTill = `${
      Number(subscriptionData.subscriptionEndTimestamp) === 0
        ? "-"
        : new Date(
            Number(subscriptionData.subscriptionEndTimestamp) * 1000
          ).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
    }`;
  }
  if (isPending || isLoading) {
    displaySubscriptionTill = "loading...";
  }

  const messagesLimit =
    displayBillingPlan === "PRO"
      ? getClientConfig().NEXT_PUBLIC_MESSAGES_LIMIT_PRO
      : getClientConfig().NEXT_PUBLIC_MESSAGES_LIMIT_LITE;
  const isLimitReached = billingPeriodMessagesSent >= messagesLimit;

  const displayData: Record<DisplayUserKey, { label: string; value: string }> =
    {
      [DISPLAY_USER_KEYS.EMAIL]: { label: "Email", value: email! },
      [DISPLAY_USER_KEYS.TG_ID]: {
        label: "Telegram ID",
        value: tgUserId ? tgUserId.toString() : "Not connected (see step 2)",
      },
      [DISPLAY_USER_KEYS.MESSAGES_SENT]: {
        label: "Sent this period",
        value: `${billingPeriodMessagesSent.toString()} / ${messagesLimit}`,
      },
      [DISPLAY_USER_KEYS.BILLING_PLAN]: {
        label: "Plan",
        value:
          displayBillingPlan === BILLING_PLANS.LIGHT
            ? "LITE"
            : displayBillingPlan,
      },
      [DISPLAY_USER_KEYS.SUBSCRIPTION_TILL]: {
        label: "PRO until",
        value: displaySubscriptionTill,
      },
    };

  return (
    <PopoverDrawer
      title="Your account"
      className="sm:w-96"
      content={
        <div className="flex flex-col gap-4">
          <dl className="flex flex-col divide-y divide-tb-border-default rounded-tb-control border border-tb-border-default bg-tb-surface-white">
            {DISPLAY_DATA_ORDER.map((each) => (
              <div
                className="flex items-center justify-between gap-4 px-4 py-2.5"
                key={each}
              >
                <dt className="shrink-0 text-sm text-tb-ink-secondary">
                  {displayData[each].label}
                </dt>
                <dd
                  className={cn("min-w-0 truncate text-right font-medium", {
                    "font-mono text-sm": each !== DISPLAY_USER_KEYS.EMAIL,
                    "text-tb-danger":
                      each === DISPLAY_USER_KEYS.MESSAGES_SENT &&
                      isLimitReached,
                    "text-tb-warning":
                      each === DISPLAY_USER_KEYS.TG_ID && !tgUserId,
                  })}
                >
                  {displayData[each].value}
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex items-center justify-between gap-2">
            <LogoutBtn />
            <Link
              href="/billing"
              scroll={false}
              className="tb-pressable tb-cta-blue inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold"
            >
              {displayBillingPlan === BILLING_PLANS.PRO
                ? "Extend PRO"
                : "Upgrade to PRO"}
            </Link>
          </div>
        </div>
      }
    >
      <Button className={className} variant={variant} size={size}>
        {children}
      </Button>
    </PopoverDrawer>
  );
};

const UserProfileBtn = withAuthBtn(UserProfileBtnCore);
UserProfileBtn.displayName = "UserProfileBtn";

export { UserProfileBtn };
