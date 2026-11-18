import type { Metadata } from "next";
import LegalPage from "../LegalPage";
import { PRIVACY_POLICY, PRIVACY_URL } from "@/lib/policy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How LocalClaw collects, uses, shares and protects personal information, and your privacy rights.",
  alternates: { canonical: PRIVACY_URL },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="Privacy Policy"
      intro="This policy explains what personal information LocalClaw collects, how we use and share it, how we keep it safe, and the choices and rights you have."
      highlight="We never sell your personal information or use it for advertising. Card details are handled entirely by Stripe and never touch our servers."
      sections={PRIVACY_POLICY}
    />
  );
}
