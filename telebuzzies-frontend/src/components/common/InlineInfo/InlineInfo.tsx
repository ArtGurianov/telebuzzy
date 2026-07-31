import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { AlertCircleIcon } from "lucide-react";
import { TooltipPopover } from "@/components/common/TooltipPopover/TooltipPopover";

interface InlineInfoProps {
  className?: string;
  children?: ReactNode;
  label: string;
  description?: string | null;
}

export const InlineInfo = ({
  className,
  children,
  label,
  description,
}: InlineInfoProps) => {
  return (
    <div
      className={cn(
        "flex rounded-md overflow-clip border-2 border-muted-foreground/80 shadow-card/30 shadow-lg",
        className
      )}
    >
      <span className="flex gap-1 px-2 bg-primary/30 justify-center items-center border-r border-muted-foreground/40 font-medium text-muted-foreground/80">
        {label}
        {description ? (
          <TooltipPopover content={description}>
            {<AlertCircleIcon size={16} className="text-muted-foreground" />}
          </TooltipPopover>
        ) : null}
      </span>
      <div className="flex gap-1 grow items-center justify-center bg-accent/80">
        {children ? (
          <div className="flex grow justify-center items-center text-center">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
};
