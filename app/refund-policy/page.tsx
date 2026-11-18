import type { Metadata } from "next";
import LegalPage from "../LegalPage";
import { REFUND_POLICY, REFUND_URL } from "@/lib/policy";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "All LocalClaw payments are final and non-refundable. How cancellation of monthly plans works.",
  alternates: { canonical: REFUND_URL },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="BILLING"
      title="Refund & Cancellation Policy"
      intro="We keep billing simple and transparent. Here is exactly how payments, cancellations, and billing questions work at LocalClaw."
      highlight="All payments are final and non-refundable. Monthly plans can be cancelled at any time to stop future billing — your agents stay active until the end of the period you've paid for."
      sections={REFUND_POLICY}
    />
  );
}
