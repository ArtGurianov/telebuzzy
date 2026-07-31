"use client";

import { useBreakpoint } from "@/lib/hooks/useBreakpoint";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InterceptQueryData } from "@/lib/types";

export interface QueryInterceptorProps {
  className?: string;
  config: InterceptQueryData[];
}

const DialogWrapper = ({
  className,
  data,
  isOpen,
  onClose,
}: {
  className?: string;
  data: InterceptQueryData;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("py-8 px-4", className)}>
        <DialogHeader>
          <DialogTitle className="text-center font-serif text-4xl my-4 text-muted-foreground">
            {data.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {`Dialog content for ${data.title}`}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 px-3 bg-primary/20 border border-primary rounded-md">
          {data.children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DrawerWrapper = ({
  className,
  data,
  isOpen,
  onClose,
}: {
  className?: string;
  data: InterceptQueryData;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className={cn("px-2 py-2", className)}>
        <DrawerHeader>
          <DrawerTitle className="text-center font-serif text-4xl text-muted-foreground">
            {data.title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {`Drawer content for ${data.title}`}
          </DrawerDescription>
        </DrawerHeader>
        <div className="py-4 px-3 bg-primary/20 border border-primary rounded-md">
          {data.children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export const QueryInterceptor = ({
  config,
  ...rest
}: QueryInterceptorProps) => {
  const isWindowOverSM = useBreakpoint("sm");

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<InterceptQueryData>();

  useEffect(() => {
    for (const key of params.keys()) {
      for (const item of config) {
        if (item.queryKey === key) {
          setData(item);
          setIsOpen(true);
        }
      }
    }
  }, [params]);

  const handleClose = () => {
    if (data) {
      const updatedParams = new URLSearchParams(params);
      updatedParams.delete(data.queryKey);
      router.push(`${pathname}${updatedParams.toString()}`);
    }
    setIsOpen(false);
  };

  if (!data) return;

  const Comp = isWindowOverSM ? DialogWrapper : DrawerWrapper;
  return <Comp data={data} {...rest} isOpen={isOpen} onClose={handleClose} />;
};
