"use server";

import { signIn } from "@/config/auth";

export const login = async (email: string) => {
  await signIn("resend", { email, redirectTo: "/?loggedIn=true" });
  return;
};
