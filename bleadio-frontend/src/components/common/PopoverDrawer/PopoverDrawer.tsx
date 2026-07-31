"use client";

import { useBreakpoint } from "@/lib/hooks/useBreakpoint";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
        className={cn("px-4", className)}
        sideOffset={8}
        collisionPadding={8}
      >
        <div className="flex w-full justify-center items-center px-4">
          <h2 className="text-center font-serif font-normal text-3xl mb-4 text-muted-foreground">
            {title}
          </h2>
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
      <DrawerContent className={cn("px-2 py-2", className)}>
        <DrawerHeader>
          <DrawerTitle className="text-center font-serif font-medium text-4xl text-muted-foreground">
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
