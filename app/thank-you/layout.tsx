import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Confirmed — Your Spot is Reserved",
  description: "Your LocalClaw deposit has been received. We'll reach out within 2 hours to schedule your discovery call and get your AI agent live in under 24 hours.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
