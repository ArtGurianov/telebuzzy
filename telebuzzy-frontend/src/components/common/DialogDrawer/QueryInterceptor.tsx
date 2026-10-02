"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DialogDrawer } from "@/components/common/DialogDrawer/DialogDrawer";
import { InterceptQueryData } from "@/lib/types";

export interface QueryInterceptorProps {
  className?: string;
  config: InterceptQueryData[];
}

export const QueryInterceptor = ({
  config,
  className,
}: QueryInterceptorProps) => {
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
      const queryString = updatedParams.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
    }
    setIsOpen(false);
  };

  if (!data) return;

  return (
    <DialogDrawer
      className={className}
      title={data.title}
      isOpen={isOpen}
      onClose={handleClose}
    >
      {data.children}
    </DialogDrawer>
  );
};
