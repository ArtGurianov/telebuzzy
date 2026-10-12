import Image from "next/image";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Section } from "@/components/common/Section/Section";

const EXAMPLE_REQUEST = `POST /api/notify
Authorization: Bearer $TELEBUZZY_API_KEY
Content-Type: application/json

{
  "title": "Payment failed",
  "severity": "critical",
  "app": "Acme Shop",
  "action": "Card declined",
  "timestamp": "2026-10-12T09:41:07Z",
  "orderId": 4821
}`;

/**
 * Static illustration of one request and the Telegram message it produces,
 * mirroring the layout of `formatDataMessage`. Clearly marked as an example
 */
export const NotificationPreview = () => {
  return (
    <Section
      id="example"
      eyebrow="Example notification"
      title="Something’s buzzing!"
      description="Your app sends one HTTPS request. A moment later the message lands in your personal Telegram."
    >
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-6">
        <figure className="flex min-w-0 flex-col gap-2">
          <figcaption className="px-1 text-sm font-semibold text-tb-ink-secondary">
            {"Your app sends"}
          </figcaption>
          <pre className="overflow-x-auto rounded-tb-card bg-tb-ink-primary p-5 font-mono text-xs leading-relaxed md:text-[13px] text-tb-surface-sky shadow-tb-card">
            <code>{EXAMPLE_REQUEST}</code>
          </pre>
        </figure>

        <div
          aria-hidden
          className="mx-auto flex size-12 items-center justify-center rounded-full bg-tb-brand-yellow text-tb-ink-primary shadow-[0_0_0_2px_var(--tb-brand-pink)]"
        >
          <ArrowDown className="size-6 md:hidden" />
          <ArrowRight className="hidden size-6 md:block" />
        </div>

        <figure className="flex min-w-0 flex-col gap-2">
          <figcaption className="px-1 text-sm font-semibold text-tb-ink-secondary">
            {"You receive in Telegram"}
          </figcaption>
          <div className="flex flex-col gap-3 rounded-tb-card bg-[#cfe6f7] p-4 shadow-tb-card">
            <div className="flex items-center gap-3 border-b border-white/60 pb-3">
              <span
                aria-hidden
                className="flex size-10 items-end justify-center overflow-hidden rounded-full bg-tb-brand-yellow"
              >
                <Image
                  src="/tt-head.webp"
                  alt=""
                  width={1024}
                  height={827}
                  sizes="40px"
                  className="h-auto w-[34px] translate-y-1"
                />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-semibold">{"Telebuzzy"}</span>
                <span className="text-sm text-tb-ink-secondary">{"bot"}</span>
              </span>
            </div>
            <div className="max-w-[22rem] self-start rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[15px] leading-relaxed shadow-sm">
              <p>
                {"🔴 "}
                <b>{"CRITICAL"}</b>
              </p>
              <p>
                <i>{"TITLE:"}</i>{" "}
                <b className="underline">{"Payment failed"}</b>
              </p>
              <p>
                <i>{"APP:"}</i> <b>{"Acme Shop"}</b>
              </p>
              <p>
                <i>{"ACTION:"}</i> <b>{"Card declined"}</b>
              </p>
              <p>
                <i>{"DATE:"}</i> <b>{"2026-10-12 09:41:07 UTC"}</b>
              </p>
              <p className="mt-3 underline">{"OTHER DATA FIELDS"}</p>
              <p>
                <i>{"orderId"}</i>
                {": "}
                <b>{"4821"}</b>
              </p>
              <p className="mt-1 text-right text-xs text-tb-ink-secondary">
                {"09:41"}
              </p>
            </div>
          </div>
        </figure>
      </div>
    </Section>
  );
};
