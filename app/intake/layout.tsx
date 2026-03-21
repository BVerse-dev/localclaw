import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discovery Intake — Tell Us About Your Business",
  description: "Fill out this quick 2-minute form so we can prepare your AI agent deployment. Select your automations, choose your plan, and proceed to secure checkout. No commitment required.",
  alternates: {
    canonical: "https://localclawagents.com/intake",
  },
  openGraph: {
    title: "LocalClaw Discovery Intake — Get Your AI Agent",
    description: "Tell us about your business and we'll deploy your AI agent in under 24 hours. Fill out the intake form to get started.",
    url: "https://localclawagents.com/intake",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
