import { Metadata } from "next";
export const metadata: Metadata = {
  title: "The LocalClaw Playbook — Deploy AI Agents for Your Local Business",
  description: "A comprehensive 16-chapter guide to deploying autonomous AI agents using OpenClaw and NVIDIA NemoClaw. From installation to going live — no coding required.",
  openGraph: {
    title: "The LocalClaw Playbook — AI Agents for Local Business",
    description: "Step-by-step guide to deploying AI agents for your local business. 16 chapters covering installation, security, channels, and real-world agent recipes.",
    url: "https://localclawagents.com/playbook",
  },
  alternates: { canonical: "https://localclawagents.com/playbook" },
  robots: { index: true, follow: true },
};
export default function PlaybookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
