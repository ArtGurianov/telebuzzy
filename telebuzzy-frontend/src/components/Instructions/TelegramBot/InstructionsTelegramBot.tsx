import Link from "next/link";
import { Send } from "lucide-react";
import { Step } from "../Step";

export const InstructionsTelegramBot = () => {
  return (
    <Step
      index={2}
      title="Connect @telebuzzy_bot"
      description={
        <>
          {"Open the bot in Telegram and send "}
          <code className="rounded-md bg-tb-surface-sky px-1.5 py-0.5 font-mono text-[0.9em] font-medium break-all text-tb-ink-primary">
            {"/set_api_key <YOUR_KEY>"}
          </code>
          {". One Telegram account receives each key’s messages."}
        </>
      }
    >
      <Link
        href="https://t.me/telebuzzy_bot"
        target="_blank"
        rel="noopener noreferrer"
        className="tb-pressable tb-cta-blue inline-flex h-11 items-center gap-2 rounded-full px-5 font-semibold"
      >
        <Send aria-hidden className="size-4" />
        {"Open @telebuzzy_bot"}
        <span className="sr-only">{" (opens in a new tab)"}</span>
      </Link>
    </Step>
  );
};
