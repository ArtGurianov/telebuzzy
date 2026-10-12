"use client";

import { Button } from "@mydaogs/ui";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export const LogoutBtn = () => {
  return (
    <Button
      onClick={() => signOut()}
      variant="unset"
      size="reset"
      className="tb-pressable tb-cta-white h-10 gap-2 rounded-full px-4 text-sm font-semibold"
    >
      <LogOut aria-hidden className="size-4" />
      {"Log out"}
    </Button>
  );
};
