import { getClientConfig, getServerConfig } from "@/config/env";

const CLIENT_ENV = getClientConfig();
const SERVER_ENV = getServerConfig();

export const SITE = {
  name: "Telebuzzy",
  title: "Telebuzzy — Telegram notifications for your apps",
  description:
    "Get important updates from your apps straight to your personal Telegram. One API request. No bot to build.",
  ogImage: {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "Telebuzzy logo over a sunny landscape with the tagline “Your apps have something to tell you.”",
  },
  supportEmail: "support@telebuzzy.xyz",
  publisher: "MyDAOgs Ecosystem",
  themeColor: "#5fb4f2",
  // APP_DOMAIN is the deployment's public origin (also used for the Telegram webhook)
  url: new URL(SERVER_ENV.APP_DOMAIN),
} as const;

/**
 * Only the production deployment is indexed. Vercel preview builds can run
 * with NEXT_PUBLIC_APP_ENV=production, so VERCEL_ENV is checked too.
 */
export const isSiteIndexable =
  CLIENT_ENV.NEXT_PUBLIC_APP_ENV === "production" &&
  (process.env.VERCEL_ENV ?? "production") === "production";

export const absoluteUrl = (path = "/") => new URL(path, SITE.url).toString();
