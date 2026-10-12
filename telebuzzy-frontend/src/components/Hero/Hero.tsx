import Link from "next/link";
import { ArrowDown, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

const CTA_BASE =
  "tb-pressable inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold";

export const Hero = () => {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex min-h-svh flex-col items-center"
    >
      {/* Keeps the floating backdrop logo uncovered on first paint */}
      <div
        className="w-full shrink-0"
        style={{
          height: "calc(var(--tb-logo-top) + var(--tb-logo-height) + 1rem)",
        }}
      />
      <div className="tb-card flex w-full max-w-3xl flex-col items-center gap-5 px-6 py-8 text-center md:px-12 md:py-10">
        <p
          className="tb-rise inline-flex items-center gap-2 rounded-full bg-tb-surface-sky px-3 py-1 text-sm font-medium text-tb-ink-secondary"
          style={{ "--tb-delay": "150ms" } as React.CSSProperties}
        >
          <span aria-hidden className="size-2 rounded-full bg-tb-brand-pink" />
          <span>
            <span className="sr-only">{"Telebuzzy — "}</span>
            {"Telegram notifications for your apps"}
          </span>
        </p>
        <h1
          id="hero-title"
          className="tb-rise font-display text-4xl leading-[1.1] font-semibold text-balance text-tb-ink-primary md:text-6xl md:leading-[1.08]"
          style={{ "--tb-delay": "220ms" } as React.CSSProperties}
        >
          {"Your apps have something to tell you."}
        </h1>
        <p
          className="tb-rise max-w-xl text-lg text-pretty text-tb-ink-secondary"
          style={{ "--tb-delay": "290ms" } as React.CSSProperties}
        >
          {
            "Get important updates from your apps straight to your personal Telegram. One API request. No bot to build."
          }
        </p>
        <div
          className="tb-rise flex w-full flex-col items-stretch justify-center gap-3 pt-1 sm:w-auto sm:flex-row"
          style={{ "--tb-delay": "360ms" } as React.CSSProperties}
        >
          <Link href="#get-started" className={cn(CTA_BASE, "tb-cta-blue")}>
            <KeyRound aria-hidden className="size-5" />
            {"Get your API key"}
          </Link>
          <Link href="#how-it-works" className={cn(CTA_BASE, "tb-cta-white")}>
            {"See how it works"}
            <ArrowDown aria-hidden className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
