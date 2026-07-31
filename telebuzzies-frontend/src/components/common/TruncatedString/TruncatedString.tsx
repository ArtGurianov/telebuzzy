"use client";

import {
  truncateString,
  TruncateStringProps,
} from "@/lib/utils/truncatedString";
import { TooltipPopover } from "@/components/common/TooltipPopover/TooltipPopover";
import { cn } from "@/lib/utils";

export interface TruncatedStringProps
  extends Omit<TruncateStringProps, "value"> {
  className?: string;
  children: string;
}

export const TruncatedString = ({
  className,
  maxLen,
  cutFrom,
  children,
}: TruncatedStringProps) => {
  return (
    <TooltipPopover
      content={children}
      className={cn("underline cursor-pointer", className)}
    >
      {`${truncateString({ value: children, maxLen, cutFrom })}`}
    </TooltipPopover>
  );
};
