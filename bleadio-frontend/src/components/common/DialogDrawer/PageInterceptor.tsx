"use client";

import { useBreakpoint } from "@/lib/hooks/useBreakpoint";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";

export interface PageInterceptorProps {
  className?: string;
  children: ReactNode;
  title: string;
}

const DialogWrapper = ({
  className,
  children,
  title,
  isOpen,
  onClose,
}: PageInterceptorProps & { isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("py-8 px-4", className)}>
        <DialogHeader>
          <DialogTitle className="text-center font-serif text-4xl my-4 text-muted-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {`Dialog content for ${title}`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 px-3 bg-primary/20 border border-primary">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DrawerWrapper = ({
  className,
  children,
  title,
  isOpen,
  onClose,
}: PageInterceptorProps & { isOpen: boolean; onClose: () => void }) => {
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className={cn("px-2 py-2", className)}>
        <DrawerHeader>
          <DrawerTitle className="text-center font-serif text-4xl text-muted-foreground">
            {title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {`Drawer content for ${title}`}
          </DrawerDescription>
        </DrawerHeader>
        <div className="py-4 px-3 bg-primary/20 border border-primary">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const PageInterceptor = (props: PageInterceptorProps) => {
  const isWindowOverSM = useBreakpoint("sm");

  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  const Comp = isWindowOverSM ? DialogWrapper : DrawerWrapper;
  return <Comp {...props} isOpen={isOpen} onClose={handleClose} />;
};
