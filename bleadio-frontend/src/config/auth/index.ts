import NextAuth, { DefaultSession } from "next-auth";
import Resend from "next-auth/providers/resend";
import db from "@/config/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { getServerConfig } from "../env";

declare module "next-auth" {
  interface Session {
    user: {
      tgUserId?: number;
      apiKey?: string;
      billingPeriodStart: Date;
      billingPeriodMessagesSent: number;
    } & DefaultSession["user"];
  }

  interface User {
    tgUserId?: number;
    apiKey?: string;
    billingPeriodStart: Date;
    billingPeriodMessagesSent: number;
  }
}

export const LOGGED_IN_QUERY_KEY = "loggedIn";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    Resend({
      from: "noreply@blead.io",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.tgUserId = user.tgUserId;
      session.user.apiKey = user.apiKey;
      session.user.billingPeriodMessagesSent = user.billingPeriodMessagesSent;
      session.user.billingPeriodStart = user.billingPeriodStart;
      return session;
    },
  },
  secret: getServerConfig().AUTH_SECRET,
  pages: {
    verifyRequest: "/",
  },
});
