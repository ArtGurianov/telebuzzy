"use client";

import { useEffect, useState } from "react";
import {
  CodeblockKey,
  CODEBLOCKS,
  CODEBLOCKS_KEYS,
  CODEBLOCKS_ORDER,
} from "./constants";
import { CodeBlock, androidstudio as theme } from "react-code-blocks";
import { cn } from "@/lib/utils";
import { CopyToClipboardBtn } from "@mydaogs/ui/client";
import { Step } from "../Step";

export const InstructionsUsage = () => {
  const [lang, setLang] = useState<CodeblockKey>(CODEBLOCKS_KEYS.bash);

  // react-code-blocks renders differently on the server; mount it client-side
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  return (
    <Step
      index={3}
      title="Send notifications from anywhere"
      description={
        <>
          {"POST to "}
          <code className="font-mono font-medium text-tb-ink-primary">
            {"/api/notify"}
          </code>
          {" with your key. Add an "}
          <code className="font-mono font-medium text-tb-ink-primary">
            {"Idempotency-Key"}
          </code>
          {" so a retry doesn’t buzz twice."}
        </>
      }
    >
      <div className="flex flex-col overflow-hidden rounded-tb-control bg-[#282b2e] shadow-tb-card">
        <div className="flex items-center gap-1 border-b border-white/10 p-1.5">
          <div
            role="tablist"
            aria-label="Code sample language"
            className="flex grow gap-1 overflow-x-auto"
          >
            {CODEBLOCKS_ORDER.map((each) => (
              <button
                key={each}
                type="button"
                role="tab"
                aria-selected={each === lang}
                className={cn(
                  "tb-pressable h-9 shrink-0 cursor-pointer rounded-lg px-3 font-mono text-sm text-white/70",
                  each === lang
                    ? "bg-tb-brand-yellow text-tb-ink-primary"
                    : "hover:bg-white/10 hover:text-white"
                )}
                onClick={() => {
                  setLang(each);
                }}
              >
                {each}
              </button>
            ))}
          </div>
          <div className="shrink-0 rounded-lg bg-tb-surface-white">
            <CopyToClipboardBtn
              value={CODEBLOCKS[lang]}
              size="icon"
              variant="ghost"
            />
          </div>
        </div>
        <div role="tabpanel" className="min-h-80 overflow-x-auto text-sm">
          {isInitialized ? (
            <CodeBlock
              customStyle={{ borderRadius: "0px", padding: "0.75rem 0" }}
              language={lang}
              text={CODEBLOCKS[lang]}
              theme={theme}
              showLineNumbers
            />
          ) : null}
        </div>
      </div>
    </Step>
  );
};
