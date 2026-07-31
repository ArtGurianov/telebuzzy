"use client";

import { GetComponentProps } from "@/lib/types";
import { FC, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export const withAuthBtn = <T extends GetComponentProps<typeof Button>>(
  component: FC<T>
): FC<T> => {
  const WithAuthBtn = (props: T) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const { data, status } = useSession();
    const Cmp = component;
    Cmp.displayName = "Button";
    return data?.user ? (
      <Cmp {...props} />
    ) : (
      <Button
        ref={buttonRef}
        disabled={status === "loading"}
        size={props.size}
        variant={props.variant}
        className={props.className}
        onClick={() => {
          const event = new CustomEvent("open-login-dialog", {
            bubbles: true,
          });
          buttonRef.current?.dispatchEvent(event);
        }}
      >
        {status === "loading" ? "loading..." : props.children}
      </Button>
    );
  };
  WithAuthBtn.displayName = "WithAuthBtn";

  return WithAuthBtn;
};
