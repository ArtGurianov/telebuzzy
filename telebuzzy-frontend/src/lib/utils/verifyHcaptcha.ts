import { z } from "zod";
import { getServerConfig } from "@/config/env";

const HCAPTCHA_VERIFY_URL = "https://api.hcaptcha.com/siteverify";
const VERIFY_TIMEOUT_MS = 5000;

const siteverifyResponseSchema = z.object({
  success: z.boolean(),
  "error-codes": z.array(z.string()).optional(),
});

/**
 * Verifies an hCaptcha response token server-side. Tokens are single-use and
 * bound to the configured site key. Any network/parse failure counts as
 * unverified, so sign-in fails closed when hCaptcha is unreachable
 */
export const verifyHcaptcha = async (
  token: string,
  remoteIp?: string | null
): Promise<boolean> => {
  const { HCAPTCHA_SECRET_KEY, NEXT_PUBLIC_HCAPTCHA_SITE_KEY } =
    getServerConfig();

  const body = new URLSearchParams({
    secret: HCAPTCHA_SECRET_KEY,
    response: token,
    sitekey: NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
  });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(HCAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });
    if (!response.ok) return false;
    const result = siteverifyResponseSchema.safeParse(await response.json());
    return result.success && result.data.success;
  } catch {
    return false;
  }
};
