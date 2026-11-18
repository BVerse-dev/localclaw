import type { Metadata } from "next";
import LegalPage from "../LegalPage";
import { TERMS, TERMS_URL } from "@/lib/policy";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern LocalClaw AI agent deployment and management services.",
  alternates: { canonical: TERMS_URL },
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Terms of Service"
      intro="These terms govern your use of LocalClaw's AI agent deployment and management services. Please read them carefully — you must accept them, together with our Refund Policy, before making any payment."
      highlight="All payments are final and non-refundable. See our Refund Policy for details, including how to cancel a monthly plan."
      sections={TERMS}
    />
  );
}
