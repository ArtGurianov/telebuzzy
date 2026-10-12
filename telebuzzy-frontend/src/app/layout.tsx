import type { Metadata, Viewport } from "next";
import { Fredoka, Geist, Geist_Mono } from "next/font/google";
import { InterceptQueryData } from "@/lib/types";
import { Providers } from "@/components/Providers/Providers";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { QueryInterceptor } from "@/components/common/DialogDrawer/QueryInterceptor";
import { UserProfileBtn } from "@/components/Buttons/UserProfileBtn";
import { UpgradeBanner } from "@/components/UpgradeBanner/UpgradeBanner";
import { Backdrop } from "@/components/Backdrop/Backdrop";
import { UserRound } from "lucide-react";
import { wagmiConfig } from "@/config/web3/wagmiConfig";
import "./globals.css";
import { Toaster } from "@mydaogs/ui/client";
import { Footer } from "@/components/Footer/Footer";
import { LoginDialog } from "@/components/Login/LoginDialog";
import { isSiteIndexable, SITE } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  metadataBase: SITE.url,
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Telegram notifications",
    "Telegram notification API",
    "send Telegram message from app",
    "webhook to Telegram",
    "app alerts",
    "order notifications",
    "developer notifications",
  ],
  publisher: SITE.publisher,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: "en_US",
    images: [SITE.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: isSiteIndexable
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
};

const INTERCEPT_QUERIES_CONFIG: InterceptQueryData[] = [
  {
    queryKey: "loggedIn",
    title: "Logged in",
    children: <p className="text-center text-lg">{"Successfully logged in"}</p>,
  },
  {
    queryKey: "loggedOut",
    title: "Logged out",
    children: (
      <p className="text-center text-lg">{"Successfully logged out"}</p>
    ),
  },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");
  const initialState = cookieToInitialState(wagmiConfig, cookieHeader);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} font-sans antialiased flex flex-col items-center text-foreground min-h-svh`}
      >
        <Backdrop />
        <Providers initialState={initialState}>
          {/* Fixed so the Account button stays reachable while scrolling.
              The full-width strip lets clicks through; only the button
              takes them */}
          <header className="pointer-events-none fixed top-0 inset-x-0 z-10 flex justify-end px-4 pt-4 md:px-8">
            <UserProfileBtn
              className="pointer-events-auto tb-pressable tb-cta-yellow h-11 gap-2 rounded-full px-4 text-base font-semibold"
              variant="unset"
              size="reset"
            >
              <UserRound aria-hidden className="size-5" />
              {"Account"}
            </UserProfileBtn>
          </header>
          <main className="flex w-full max-w-5xl grow flex-col items-stretch gap-6 px-4 md:gap-10 md:px-8">
            {children}
          </main>
          <Footer />
          <LoginDialog />
          <UpgradeBanner />
          <QueryInterceptor config={INTERCEPT_QUERIES_CONFIG} />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
