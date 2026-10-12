import { ReactNode } from "react";
import { GoodToKnow } from "@/components/GoodToKnow/GoodToKnow";
import { Hero } from "@/components/Hero/Hero";
import { Instructions } from "@/components/Instructions/Instructions";
import { NotificationPreview } from "@/components/NotificationPreview/NotificationPreview";
import { Plans } from "@/components/Plans/Plans";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Hero />
      <NotificationPreview />
      <Instructions />
      <Plans />
      <GoodToKnow />
      {children}
    </>
  );
}
