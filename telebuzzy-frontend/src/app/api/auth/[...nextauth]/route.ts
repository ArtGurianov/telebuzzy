import { NextRequest } from "next/server";
import { handlers } from "@/config/auth";

export const { GET } = handlers;

// Magic links are requested only through the `login` server action, which
// verifies hCaptcha and calls `signIn` in-process. Rejecting the HTTP sign-in
// endpoint stops bots from skipping the captcha by posting to it directly.
// Every other POST (e.g. sign-out) is passed through unchanged
export const POST = (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith("/api/auth/signin")) {
    return Response.json(
      { error: "Sign in through the website form" },
      { status: 403 }
    );
  }
  return handlers.POST(request);
};
