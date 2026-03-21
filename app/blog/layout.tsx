import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — AI Automation Insights for Local Businesses",
  description:
    "Expert guides, industry trends, and actionable strategies for automating your local business with AI agents. Learn how to close more leads, save time, and outperform your competition.",
  alternates: {
    canonical: "https://localclawagents.com/blog",
  },
  openGraph: {
    title: "LocalClaw Blog — AI Automation Insights",
    description:
      "Expert guides and strategies for automating your local business with AI agents. Close more leads, save time, and outperform your competition.",
    url: "https://localclawagents.com/blog",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
