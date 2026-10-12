import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { bsc } from "viem/chains";
import { Section } from "@/components/common/Section/Section";
import { getClientConfig } from "@/config/env";
import { getAppChain } from "@/lib/utils/getAppChain";
import { CRITICAL_RESERVE_PER_PERIOD } from "@/lib/utils/contsants";
import { cn } from "@/lib/utils";

const ENV_CONFIG = getClientConfig();

const formatLimit = (limit: number) => limit.toLocaleString("en-US");

export const Plans = () => {
  const chain = getAppChain();
  const isTestNetwork = chain.id !== bsc.id;

  const plans = [
    {
      name: "LITE",
      price: "Free",
      highlight: false,
      features: [
        `${formatLimit(ENV_CONFIG.NEXT_PUBLIC_MESSAGES_LIMIT_LITE)} notifications per 30 days`,
        `+${CRITICAL_RESERVE_PER_PERIOD} critical messages after the limit`,
        "Email sign-in, no wallet needed",
      ],
    },
    {
      name: "PRO",
      price: "30 or 360 days",
      highlight: true,
      features: [
        `${formatLimit(ENV_CONFIG.NEXT_PUBLIC_MESSAGES_LIMIT_PRO)} notifications per 30 days`,
        `+${CRITICAL_RESERVE_PER_PERIOD} critical messages after the limit`,
        `Paid in stablecoin from your wallet on ${chain.name}`,
      ],
    },
  ];

  return (
    <Section
      id="plans"
      eyebrow="Plans"
      title="Start free, buzz more with PRO"
      description={
        isTestNetwork
          ? `PRO checkout currently runs on the ${chain.name} test network — no real funds are charged.`
          : "PRO prices are read live from the subscription contract at checkout."
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={cn(
              "flex flex-col gap-5 rounded-tb-card border bg-tb-surface-white p-6",
              plan.highlight
                ? "border-transparent shadow-[0_0_0_3px_var(--tb-brand-pink)]"
                : "border-tb-border-default"
            )}
          >
            <header className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <h3 className="font-display text-3xl font-semibold">
                  {plan.name}
                </h3>
                <p className="text-tb-ink-secondary">{plan.price}</p>
              </div>
              {plan.highlight ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-tb-brand-yellow px-3 py-1 text-sm font-semibold">
                  <Sparkles aria-hidden className="size-4" />
                  {"More buzz"}
                </span>
              ) : null}
            </header>
            <ul className="flex grow flex-col gap-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check
                    aria-hidden
                    className="mt-0.5 size-5 shrink-0 text-tb-success"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {plan.highlight ? (
              <Link
                href="/billing"
                scroll={false}
                className="tb-pressable tb-cta-blue inline-flex h-12 items-center justify-center rounded-full px-6 font-semibold"
              >
                {"Upgrade to PRO"}
              </Link>
            ) : (
              <Link
                href="#get-started"
                className="tb-pressable tb-cta-white inline-flex h-12 items-center justify-center rounded-full px-6 font-semibold"
              >
                {"Start for free"}
              </Link>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
};
