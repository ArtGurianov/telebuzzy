import { ReactNode } from "react";
import { ExampleApi } from "@/components/ExampleApi/ExampleApi";
import { Hero } from "@/components/Hero/Hero";
import { Instructions } from "@/components/Instructions/Instructions";
import { Motto } from "@/components/Motto/Motto";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Hero />
      <Motto />
      <Instructions />
      <ExampleApi />
      {children}
    </>
  );
}
