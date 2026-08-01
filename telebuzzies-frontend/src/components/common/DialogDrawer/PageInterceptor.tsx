"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { DialogDrawer } from "@/components/common/DialogDrawer/DialogDrawer";

export interface PageInterceptorProps {
  className?: string;
  children: ReactNode;
  title: string;
}

export const PageInterceptor = ({
  className,
  children,
  title,
}: PageInterceptorProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    router.back();
  };

  return (
    <DialogDrawer
      className={className}
      title={title}
      isOpen={isOpen}
      onClose={handleClose}
    >
      {children}
    </DialogDrawer>
  );
};
