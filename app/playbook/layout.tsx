import { Metadata } from "next";
export const metadata: Metadata = {
  title: "The LocalClaw Playbook (OpenClaw Edition) — Deploy AI Agents for Your Business",
  description: "The OpenClaw edition of our 17-chapter guide to deploying autonomous AI agents with OpenClaw and NVIDIA NemoClaw — from LocalClaw, the one-stop partner for every AI agent framework. No coding required.",
  openGraph: {
    title: "The LocalClaw Playbook — OpenClaw Edition",
    description: "Step-by-step guide to deploying OpenClaw AI agents for your business. 17 chapters covering framework choice, installation, security, channels, and real-world agent recipes.",
    url: "https://localclawagents.com/playbook",
  },
  alternates: { canonical: "https://localclawagents.com/playbook" },
  robots: { index: true, follow: true },
};
export default function PlaybookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
