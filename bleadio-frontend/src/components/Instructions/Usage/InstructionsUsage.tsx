"use client";

import { useEffect, useState } from "react";
import {
  CodeblockKey,
  CODEBLOCKS,
  CODEBLOCKS_KEYS,
  CODEBLOCKS_ORDER,
} from "./constants";
import { CodeBlock, androidstudio as theme } from "react-code-blocks";
import { Clipboard } from "@/components/common/Clipboard/Clipboard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const InstructionsUsage = () => {
  const [lang, setLang] = useState<CodeblockKey>(CODEBLOCKS_KEYS.bash);

  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    setIsInitialized(true);
  }, []);
  if (!isInitialized) return null;

  return (
    <li className="flex flex-col gap-0">
      <h3 className="w-full px-2 font-mono">
        {"3. Send notifications from anywhere"}
      </h3>
      <div className="flex flex-col border-y-2 border-x-1 overflow-clip rounded-md border-muted-foreground/80">
        <ul className="flex w-full items-stretch">
          {CODEBLOCKS_ORDER.map((each) => (
            <li
              className={cn(
                "grow text-center px-2 py-1 bg-primary/30 border-x-1 border-card",
                {
                  "bg-card text-popover": each === lang,
                }
              )}
              key={each}
            >
              <Button
                variant="unset"
                size="unset"
                className="w-full h-full text-xl font-serif"
                onClick={() => {
                  setLang(each);
                }}
              >
                {each}
              </Button>
            </li>
          ))}
        </ul>
        <div className="relative">
          <Clipboard
            theme="light"
            value={CODEBLOCKS[lang]}
            className="absolute top-4 right-4 w-8 h-8"
          />
          <CodeBlock
            customStyle={{ borderRadius: "0px" }}
            language={lang}
            text={CODEBLOCKS[lang]}
            theme={theme}
            wrapLongLines
            showLineNumbers
          />
        </div>
      </div>
    </li>
  );
};
