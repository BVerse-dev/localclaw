import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalClaw — AI Agents for Local Businesses",
  description: "LocalClaw deploys autonomous AI agents that handle your inbox, close leads, book appointments, and post content — 24/7. No technical knowledge required.",
  openGraph: {
    title: "LocalClaw — AI Agents for Local Businesses",
    description: "We deploy AI agents for local businesses that never sleep.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
