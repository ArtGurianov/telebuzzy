"use client";

import { truncateString, TruncateStringProps } from "@mydaogs/core";
import { TooltipPopover } from "@/components/common/TooltipPopover/TooltipPopover";
import { cn } from "@/lib/utils";

export interface TruncatedStringProps
  extends Omit<TruncateStringProps, "value"> {
  className?: string;
  children: string;
}

export const TruncatedString = ({
  className,
  leading,
  trailing,
  separator,
  children,
}: TruncatedStringProps) => {
  return (
    <TooltipPopover
      content={children}
      className={cn("underline cursor-pointer", className)}
    >
      {`${truncateString({ value: children, leading, trailing, separator })}`}
    </TooltipPopover>
  );
};
