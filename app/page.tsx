import type { Metadata } from "next";
import LocalClaw from "./LocalClawClient";

export const metadata: Metadata = {
  title: "LocalClaw — AI Agents for Local Businesses | Deploy in 24 Hours",
  description: "We deploy autonomous AI agents that handle your inbox, close leads, book appointments, and post content — 24/7. Powered by OpenClaw + NVIDIA NemoClaw. Setup in under 24 hours. No technical knowledge required.",
  alternates: {
    canonical: "https://localclawagents.com",
  },
  openGraph: {
    title: "LocalClaw — AI Agents for Local Businesses",
    description: "We deploy AI agents for local businesses that never sleep. Email, leads, calls, social media — fully automated.",
    url: "https://localclawagents.com",
  },
};

export default function Page() {
  return <LocalClaw />;
}
