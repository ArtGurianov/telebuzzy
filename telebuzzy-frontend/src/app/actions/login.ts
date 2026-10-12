"use server";

import { headers } from "next/headers";
import { signIn } from "@/config/auth";
import { loginSchema } from "@/lib/schemas/loginSchema";
import { AppBusinessError, createActionResponse } from "@/lib/utils";
import { verifyHcaptcha } from "@/lib/utils/verifyHcaptcha";

/**
 * The only way to request a magic link: the Auth.js HTTP sign-in endpoint is
 * closed in `api/auth/[...nextauth]/route.ts`, so every email send passes the
 * hCaptcha check below first. On success `signIn` throws Next's redirect
 */
export const login = async (data: { email: string; captchaToken: string }) => {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return createActionResponse({
      error: new AppBusinessError("Invalid email or captcha", 400),
    });
  }

  const remoteIp = (await headers())
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const isHuman = await verifyHcaptcha(parsed.data.captchaToken, remoteIp);
  if (!isHuman) {
    return createActionResponse({
      error: new AppBusinessError(
        "Captcha verification failed. Please try again",
        403
      ),
    });
  }

  await signIn("resend", {
    email: parsed.data.email,
    redirectTo: "/?loggedIn=true",
  });
  return createActionResponse();
};
