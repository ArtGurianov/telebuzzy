import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InterceptQueryData } from "@/lib/types";
import { Providers } from "@/components/Providers/Providers";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { QueryInterceptor } from "@/components/common/DialogDrawer/QueryInterceptor";
import { UserProfileBtn } from "@/components/Buttons/UserProfileBtn";
import { UserSvgUrl } from "@/components/svg";
import { UpgradeBanner } from "@/components/UpgradeBanner/UpgradeBanner";
import Image from "next/image";
import getConfig from "next/config";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/Footer/Footer";
import { LoginDialog } from "@/components/Login/LoginDialog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blead.io",
  description:
    "Send notifications from e-businesses to your personal Telegram.",
};

const INTERCEPT_QUERIES_CONFIG: InterceptQueryData[] = [
  {
    queryKey: "loggedIn",
    title: "Logged in",
    children: <h1>{"Successfully logged in"}</h1>,
  },
  {
    queryKey: "loggedOut",
    title: "Logged out",
    children: <h1>{"Successfully logged out"}</h1>,
  },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");
  const initialState = cookieToInitialState(getConfig(), cookieHeader);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col justify-start items-center bg-background bg-[url(/bg-image.png)] bg-repeat text-foreground min-h-screen`}
      >
        <Providers initialState={initialState}>
          <UserProfileBtn
            className="absolute top-4 right-2 md:right-8 lg:opacity-60 lg:hover:opacity-100"
            variant="unset"
            size="unset"
          >
            <Image
              src={UserSvgUrl}
              className="w-16"
              alt="user"
              width="0"
              height="0"
              sizes="100vh"
              priority
            />
          </UserProfileBtn>
          <div className="p-4 flex flex-col justify-center items-center max-w-[720px] min-h-[calc(100vh-2rem)]">
            {children}
          </div>
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
