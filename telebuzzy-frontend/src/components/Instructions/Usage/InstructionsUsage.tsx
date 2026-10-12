"use client";

import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";
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
  const idPrefix = useId();
  const tabRefs = useRef<Partial<Record<CodeblockKey, HTMLButtonElement>>>({});
  const tabId = (key: CodeblockKey) => `${idPrefix}-tab-${key}`;
  const panelId = `${idPrefix}-panel`;

  // WAI-ARIA Tabs pattern with automatic activation: arrows move focus and
  // selection together, Home/End jump to the ends, only the selected tab is
  // in the Tab order
  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = CODEBLOCKS_ORDER.indexOf(lang);
    const last = CODEBLOCKS_ORDER.length - 1;
    const nextIndex = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (nextIndex === undefined) return;
    event.preventDefault();
    const next = CODEBLOCKS_ORDER[nextIndex];
    setLang(next);
    tabRefs.current[next]?.focus();
  };

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
      <div className="tb-on-dark flex flex-col overflow-hidden rounded-tb-control bg-[#282b2e] shadow-tb-card">
        <div className="flex items-center gap-1 border-b border-white/10 pr-1.5">
          {/* p-1.5 leaves room for the offset focus ring inside the scroller */}
          <div
            role="tablist"
            aria-label="Code sample language"
            className="flex grow gap-1 overflow-x-auto p-1.5"
          >
            {CODEBLOCKS_ORDER.map((each) => (
              <button
                key={each}
                ref={(node) => {
                  if (node) tabRefs.current[each] = node;
                }}
                id={tabId(each)}
                type="button"
                role="tab"
                aria-selected={each === lang}
                aria-controls={panelId}
                tabIndex={each === lang ? 0 : -1}
                className={cn(
                  "tb-pressable h-9 shrink-0 cursor-pointer rounded-lg px-3 font-mono text-sm text-white/70",
                  each === lang
                    ? "bg-tb-brand-yellow text-tb-ink-primary"
                    : "hover:bg-white/10 hover:text-white"
                )}
                onClick={() => {
                  setLang(each);
                }}
                onKeyDown={handleTabKeyDown}
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
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(lang)}
          tabIndex={0}
          className="min-h-80 overflow-x-auto text-sm focus-visible:outline-offset-[-4px]"
        >
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
