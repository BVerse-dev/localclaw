import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://localclawagents.com";
const SITE_NAME = "LocalClaw";
const SITE_TITLE = "LocalClaw — AI Agents for Local Businesses";
const SITE_DESC = "LocalClaw deploys autonomous AI agents that handle your inbox, close leads, book appointments, and post content — 24/7. Powered by OpenClaw + NVIDIA NemoClaw. No technical knowledge required. Live in under 24 hours.";
const OG_IMAGE = `${SITE_URL}/icon.svg`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#C9922A" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // ── Core ──
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  // ── Keywords ──
  keywords: [
    "AI agents",
    "AI agents for local businesses",
    "AI business automation",
    "AI virtual assistant",
    "autonomous agents",
    "AI lead generation",
    "AI appointment booking",
    "AI email management",
    "AI social media automation",
    "OpenClaw",
    "NVIDIA NemoClaw",
    "AI for real estate",
    "AI for law firms",
    "AI for clinics",
    "AI for restaurants",
    "AI for agencies",
    "business process automation",
    "AI CRM automation",
    "AI sales agent",
    "AI calling agent",
    "LocalClaw",
    "deploy AI agents",
    "managed AI agents",
    "AI agent deployment",
    "small business AI",
    "local business automation",
    "AI customer service",
    "AI for ecommerce",
    "AI agent security",
    "AI chatbot alternative",
    "automate my business",
    "AI receptionist",
    "AI for small business owners",
    "best AI tools for business",
    "AI agent provider",
    "automated lead follow up",
    "24/7 AI support",
    "AI scheduling assistant",
    "no code AI automation",
    "AI inbox management",
    "digital transformation small business",
    "AI marketing automation",
    "AI for healthcare",
    "reduce no shows AI",
    "AI powered business",
  ],

  // ── Authors ──
  authors: [
    { name: "BVerse", url: "https://twitter.com/Th3Alch3mist_" },
  ],
  creator: "BVerse",
  publisher: "LocalClaw",

  // ── Icons ──
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.svg",
  },

  // ── Manifest ──
  manifest: "/manifest.webmanifest",

  // ── Open Graph ──
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [
      {
        url: OG_IMAGE,
        width: 512,
        height: 512,
        alt: "LocalClaw — AI Agents for Local Businesses",
        type: "image/svg+xml",
      },
    ],
  },

  // ── Twitter / X ──
  twitter: {
    card: "summary",
    site: "@Th3Alch3mist_",
    creator: "@Th3Alch3mist_",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [OG_IMAGE],
  },

  // ── Robots ──
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Canonical & Alternates ──
  alternates: {
    canonical: SITE_URL,
  },

  // ── Verification (add your codes when ready) ──
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-code",
  //   other: { "msvalidate.01": "your-bing-code" },
  // },

  // ── Category ──
  category: "technology",

  // ── Other ──
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
  },
};

// ── JSON-LD Structured Data ─────────────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LocalClaw",
  url: SITE_URL,
  logo: OG_IMAGE,
  description: SITE_DESC,
  founder: {
    "@type": "Person",
    name: "BVerse",
    url: "https://twitter.com/Th3Alch3mist_",
  },
  sameAs: [
    "https://twitter.com/Th3Alch3mist_",
    "https://github.com/BVerse-dev/localclaw",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "localclawagents@gmail.com",
    availableLanguage: "English",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Agent Deployment for Local Businesses",
  provider: {
    "@type": "Organization",
    name: "LocalClaw",
    url: SITE_URL,
  },
  description: "We deploy autonomous AI agents for local businesses — handling email, leads, appointments, social media, and CRM automation. Powered by OpenClaw framework with NVIDIA NemoClaw enterprise security. Live in under 24 hours.",
  serviceType: "AI Business Automation",
  areaServed: {
    "@type": "Place",
    name: "Worldwide",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI Agent Plans",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Starter Agent",
        description: "One AI agent for solo operators. Email triage, calendar management, daily briefings via Telegram.",
        price: "997",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "149",
          priceCurrency: "USD",
          unitText: "MONTH",
          referenceQuantity: { "@type": "QuantitativeValue", value: "1", unitCode: "MON" },
        },
      },
      {
        "@type": "Offer",
        name: "Business Engine",
        description: "2-3 AI agents for your core team. CRM, email, calendar, sales follow-up, Slack + WhatsApp interface.",
        price: "1997",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "299",
          priceCurrency: "USD",
          unitText: "MONTH",
          referenceQuantity: { "@type": "QuantitativeValue", value: "1", unitCode: "MON" },
        },
      },
      {
        "@type": "Offer",
        name: "Full Stack",
        description: "5+ AI agents for enterprise. Full integration stack, custom workflows, KPI dashboard, dedicated account manager.",
        price: "3500",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "499",
          priceCurrency: "USD",
          unitText: "MONTH",
          referenceQuantity: { "@type": "QuantitativeValue", value: "1", unitCode: "MON" },
        },
      },
    ],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESC,
  publisher: {
    "@type": "Organization",
    name: "LocalClaw",
    url: SITE_URL,
    logo: OG_IMAGE,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is LocalClaw?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LocalClaw deploys autonomous AI agents for local businesses. These agents handle email triage, lead capture, appointment booking, social media posting, CRM automation, and more — running 24/7 without any technical knowledge required from the business owner.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to set up?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LocalClaw agents go live in under 24 hours. After a 15-minute discovery call, we handle everything — VPS setup, agent configuration, integrations, and security hardening. You just show up.",
      },
    },
    {
      "@type": "Question",
      name: "What industries does LocalClaw serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LocalClaw serves real estate agents, law firms, healthcare clinics, marketing agencies, e-commerce businesses, restaurants, consultants, finance firms, construction companies, and any local business looking to automate operations with AI.",
      },
    },
    {
      "@type": "Question",
      name: "How much does LocalClaw cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LocalClaw offers three plans: Starter ($997 setup + $149/month) for solo operators, Business Engine ($1,997 setup + $299/month) for core teams, and Full Stack ($3,500 setup + $499/month) for enterprise. All plans include a $97 refundable discovery deposit and 30-day satisfaction guarantee.",
      },
    },
    {
      "@type": "Question",
      name: "Is LocalClaw secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every LocalClaw deployment ships with NVIDIA NemoClaw enterprise security. This includes OAuth credential handling, Docker sandboxing, firewall hardening, read-only permissions by default, instant kill switches, and full audit trails on every agent action.",
      },
    },
    {
      "@type": "Question",
      name: "What is the refund policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LocalClaw offers a 30-day satisfaction guarantee. If you're not happy with your agent deployment, you get a full refund — no questions asked. The $97 discovery deposit is also fully credited toward your setup fee.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LocalClaw AI Agent Platform",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Cloud-based",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "97",
    highPrice: "3500",
    priceCurrency: "USD",
    offerCount: "3",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "6",
    bestRating: "5",
    worstRating: "4",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://buy.stripe.com" />
        <link rel="dns-prefetch" href="https://cal.com" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
