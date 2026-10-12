"use client";

import Link from "next/link";
import { KeyRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface GetApiKeyCtaProps {
  className?: string;
}

/**
 * Guests go straight to the magic-link dialog; signed-in users jump to their
 * key in step 1. The href keeps the scroll fallback when JS has not loaded
 */
export const GetApiKeyCta = ({ className }: GetApiKeyCtaProps) => {
  const { data: session, status } = useSession();
  const isGuest = status !== "loading" && !session?.user;

  return (
    <Link
      href="#get-started"
      className={cn("tb-cta-blue", className)}
      onClick={(event) => {
        if (!isGuest) return;
        event.preventDefault();
        event.currentTarget.dispatchEvent(
          new CustomEvent("open-login-dialog", { bubbles: true })
        );
      }}
    >
      <KeyRound aria-hidden className="size-5" />
      {"Get your API key"}
    </Link>
  );
};
