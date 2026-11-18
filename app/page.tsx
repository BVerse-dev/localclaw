import type { Metadata } from "next";
import LocalClaw from "./LocalClawClient";

export const metadata: Metadata = {
  title: "LocalClaw — Every AI Agent Your Business Needs | Live in 24 Hours",
  description: "The one-stop AI agent partner. We deploy, secure and manage agents on OpenClaw, Hermes, Claude, OpenAI, n8n and more — handling your inbox, leads, appointments and content 24/7. Live in under 24 hours.",
  alternates: {
    canonical: "https://localclawagents.com",
  },
  openGraph: {
    title: "LocalClaw — The One-Stop AI Agent Partner for Business",
    description: "Every AI agent framework, one partner. OpenClaw, Hermes, Claude, OpenAI, n8n and more — deployed, secured and managed for your business.",
    url: "https://localclawagents.com",
  },
};

export default function Page() {
  return <LocalClaw />;
}
