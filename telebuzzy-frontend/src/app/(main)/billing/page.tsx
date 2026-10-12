import type { Metadata } from "next";
import { BillingDialog } from "@/components/Billing/BillingDialog";

// Wallet checkout dialog over the landing page: not a standalone page to
// index. Crawlable (not in robots.txt) so crawlers can read the noindex;
// no canonical, which would contradict it
export const metadata: Metadata = {
  title: "Upgrade to PRO",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function BillingPage() {
  return <BillingDialog />;
}
