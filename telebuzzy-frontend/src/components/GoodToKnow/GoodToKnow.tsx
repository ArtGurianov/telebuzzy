import { BellOff, Repeat, ShieldAlert, UserRound } from "lucide-react";
import { Section } from "@/components/common/Section/Section";
import { CRITICAL_RESERVE_PER_PERIOD } from "@/lib/utils/contsants";

const FACTS = [
  {
    icon: UserRound,
    title: "One recipient per key",
    body: "Each API key delivers to the single Telegram account that registered it with the bot.",
  },
  {
    icon: Repeat,
    title: "Safe retries",
    body: "Reuse the same Idempotency-Key when you retry a request and the duplicate is skipped. Keys are remembered for 24 hours.",
  },
  {
    icon: BellOff,
    title: "Severity that means something",
    body: "Critical and warning messages arrive with a regular Telegram notification; info messages are delivered silently.",
  },
  {
    icon: ShieldAlert,
    title: "Critical reserve",
    body: `When your plan limit is reached, ${CRITICAL_RESERVE_PER_PERIOD} more critical messages still get through each 30-day period.`,
  },
];

export const GoodToKnow = () => {
  return (
    <Section
      id="good-to-know"
      eyebrow="Good to know"
      title="Small print, plainly"
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {FACTS.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="flex gap-4 rounded-tb-card border border-tb-border-default bg-tb-surface-white/80 p-5"
          >
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-tb-surface-sky text-tb-brand-blue-strong"
            >
              <Icon className="size-5" />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-pretty text-tb-ink-secondary">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
};
