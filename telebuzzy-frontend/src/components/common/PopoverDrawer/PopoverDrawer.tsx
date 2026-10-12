"use client";

import {
  useBreakpoint,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@mydaogs/ui/client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PopoverDrawerProps {
  className?: string;
  children: ReactNode;
  content: ReactNode;
  title: string;
  onClose?: () => void;
}

const PopoverWrapper = ({
  className,
  children,
  content,
  title,
  onClose,
}: PopoverDrawerProps) => {
  return (
    <Popover onOpenChange={onClose}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className={cn(
          "rounded-tb-card border-tb-border-default bg-tb-surface-base p-4 shadow-tb-card",
          className
        )}
        sideOffset={8}
        collisionPadding={8}
      >
        <div className="mb-3 flex w-full items-center">
          <h2 className="font-display text-2xl font-semibold">{title}</h2>
          <span className="sr-only">{`Popover content for ${title}`}</span>
        </div>
        {content}
      </PopoverContent>
    </Popover>
  );
};

const DrawerWrapper = ({
  className,
  children,
  content,
  title,
  onClose,
}: PopoverDrawerProps) => {
  return (
    <Drawer onClose={onClose}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className={cn("bg-tb-surface-base px-2 py-2", className)}>
        <DrawerHeader>
          <DrawerTitle className="text-center font-display text-3xl font-semibold">
            {title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {`Drawer content for ${title}`}
          </DrawerDescription>
        </DrawerHeader>
        <div className="py-4 px-3">{content}</div>
      </DrawerContent>
    </Drawer>
  );
};

export const PopoverDrawer = (props: PopoverDrawerProps) => {
  const isWindowOverSM = useBreakpoint("sm");

  const Comp = isWindowOverSM ? PopoverWrapper : DrawerWrapper;
  return <Comp {...props} />;
};
