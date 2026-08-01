"use client";

import { ComponentProps } from "react";
import { DialogDrawer as KitDialogDrawer } from "@mydaogs/ui/client";

export type DialogDrawerProps = ComponentProps<typeof KitDialogDrawer>;

/**
 * Thin wrapper around `@mydaogs/ui/client`'s `DialogDrawer`. The kit renders
 * the title/description chrome itself (via the single `DialogShellProvider`
 * host mounted in `Providers.tsx`) - this wrapper only adds the app's styled
 * content box around `children`.
 */
export const DialogDrawer = ({
  className,
  children,
  ...rest
}: DialogDrawerProps) => {
  return (
    <KitDialogDrawer className={className} {...rest}>
      <div className="py-4 px-3 bg-primary/20 border border-primary rounded-md">
        {children}
      </div>
    </KitDialogDrawer>
  );
};
