"use client";

import { Button as KitButton } from "@mydaogs/ui";
import { cn } from "@/lib/utils/cn";
import type { ComponentProps } from "react";

export type TelebuzzyButtonProps = ComponentProps<typeof KitButton>;

/*
 * @mydaogs/ui 0.9.2 uses text-main-foreground for every Button variant.
 * The light variants require dark ink in the opt-in .tb-theme.
 * This wrapper adds an app-owned class; the stylesheet scopes the override
 * to .tb-theme, so legacy components outside that scope are untouched.
 */
const INK_VARIANTS = new Set([
  "secondary",
  "outline",
  "flat",
  "ghost",
  "link",
]);

export const TelebuzzyButton = ({
  variant,
  className,
  ...props
}: TelebuzzyButtonProps) => (
  <KitButton
    {...props}
    variant={variant}
    className={cn(className, INK_VARIANTS.has(String(variant)) && "tb-button-ink")}
  />
);
