// ═════════════════════════════════════════════════════════════════════════════
// LocalClaw — single source of truth for plans, pricing, and Stripe wiring.
// Every page, API route, and the Stripe webhook reads from here.
// To change a price: update `setup` / `monthly` (in USD) — checkout uses these
// amounts directly against the Stripe product IDs below.
// ═════════════════════════════════════════════════════════════════════════════

export type PlanKey = "starter" | "business" | "fullstack" | "command";
export type CheckoutKey = PlanKey | "discovery";

export interface Plan {
  key: PlanKey;
  name: string;
  tag: string;
  setup: number;   // one-time setup fee, USD
  monthly: number; // monthly retainer, USD
  highlight: boolean;
  desc: string;
  features: string[];
  // admin / provisioning metadata
  channels: string;
  heartbeat: string;
  stripe: {
    setupProduct: string;
    monthlyProduct: string;
    // Combined payment link (setup fee + monthly subscription in one checkout).
    // Used as the fallback if /api/checkout can't create a session, and shareable directly.
    link: string;
    // Separate links for sales use (not shown on the site yet):
    setupOnlyLink?: string;   // one-time setup fee only — no subscription
    monthlyOnlyLink?: string; // monthly management only — for clients who already paid setup
  };
}

export const DISCOVERY = {
  key: "discovery" as const,
  name: "Discovery Deposit",
  amount: 97,
  stripe: {
    product: "prod_UBnKhnelnuhCNt",
    link: "https://buy.stripe.com/dRm28tc1s3t0gUnaBI0sU02",
  },
};

export const ADDITIONAL_AGENT_PRICE = 850;

// Stripe coupon ($97 off, once) auto-applied by /api/checkout when the buyer has
// already paid the discovery deposit. No public promo code exists for it.
export const DISCOVERY_CREDIT_COUPON = "LC_DISCOVERY_CREDIT_97";

export const PLANS: Plan[] = [
  {
    key: "starter",
    name: "Starter Agent",
    tag: "SOLO OPERATORS",
    setup: 997,
    monthly: 149,
    highlight: false,
    desc: "One agent for one operator, on the framework that fits you best. Email triage, calendar management, and daily briefings.",
    features: [
      "1 Executive Agent",
      "Your choice of agent framework",
      "Email + Calendar integration",
      "Daily morning briefing",
      "Telegram or WhatsApp interface",
      "Security guardrails layer",
      "14-day hypercare",
    ],
    channels: "1 channel",
    heartbeat: "24h",
    stripe: {
      setupProduct: "prod_UBnKmcdOmSuxFA",
      monthlyProduct: "prod_UBnKOEhrlXQqkc",
      link: "https://buy.stripe.com/28EeVfd5wgfMcE7h060sU0a",
      setupOnlyLink: "https://buy.stripe.com/5kQ14p2qSd3AeMf1180sU04",
      monthlyOnlyLink: "https://buy.stripe.com/6oUdRbd5we7E6fJ25c0sU01",
    },
  },
  {
    key: "business",
    name: "Business Engine",
    tag: "MOST POPULAR",
    setup: 1997,
    monthly: 299,
    highlight: true,
    desc: "Two to three agents for your core team — Owner, Sales, and Ops running in parallel with shared context.",
    features: [
      "2–3 Executive Agents",
      "Mix frameworks per role",
      "CRM + Email + Calendar",
      "Sales follow-up automation",
      "Slack + WhatsApp interface",
      "Security guardrails layer",
      "Priority support channel",
    ],
    channels: "3 channels",
    heartbeat: "6h",
    stripe: {
      setupProduct: "prod_UBnKtoqdgcW12U",
      monthlyProduct: "prod_UBnKXxBIfOEWax",
      link: "https://buy.stripe.com/28EbJ34z0fbI5bFh060sU0b",
      setupOnlyLink: "https://buy.stripe.com/aFa00l7Lce7EavZfW20sU05",
      monthlyOnlyLink: "https://buy.stripe.com/7sY6oJ5D4fbI6fJ25c0sU06",
    },
  },
  {
    key: "fullstack",
    name: "Full Stack",
    tag: "GROWING TEAMS",
    setup: 3500,
    monthly: 499,
    highlight: false,
    desc: "Full agent deployment for multi-location businesses, law firms, clinics, and growing teams.",
    features: [
      "5+ Executive Agents",
      "Full integration stack",
      "Custom workflow engineering",
      "KPI dashboard setup",
      "Enterprise security policies",
      "30-day hypercare",
      "Dedicated account manager",
    ],
    channels: "All channels",
    heartbeat: "30m",
    stripe: {
      setupProduct: "prod_UBnKybyNYMDiZd",
      monthlyProduct: "prod_UBnKN6DR3qXEVQ",
      link: "https://buy.stripe.com/cNidRb5D43t07jNaBI0sU0c",
      setupOnlyLink: "https://buy.stripe.com/4gM9AV4z0d3AgUn7pw0sU07",
      monthlyOnlyLink: "https://buy.stripe.com/cNi3cx8Pg0gO1Zt5ho0sU08",
    },
  },
  {
    key: "command",
    name: "Agent Command Center",
    tag: "ENTERPRISE",
    setup: 4500,
    monthly: 799,
    highlight: false,
    desc: "Your entire AI workforce across every framework — OpenClaw, Hermes, Claude, OpenAI and more — orchestrated from one command center.",
    features: [
      "Unlimited agents across multiple frameworks",
      "Multi-agent orchestration & hand-offs",
      "Custom-built agents for your workflows",
      "Dedicated private server / VPC",
      "Enterprise guardrails + full audit trail",
      "99.9% uptime SLA & priority response",
      "Monthly strategy & optimisation call",
    ],
    channels: "All channels",
    heartbeat: "15m",
    stripe: {
      setupProduct: "prod_VeQzOODtZ7bLfr",
      monthlyProduct: "prod_VeR0R0HPgUMr23",
      link: "https://buy.stripe.com/dRm28taXoe7E0VpaBI0sU09",
      setupOnlyLink: "https://buy.stripe.com/6oU3cx0iK2oWdIb25c0sU0d",
      monthlyOnlyLink: "https://buy.stripe.com/eVqeVf5D44x47jNh060sU0e",
    },
  },
];

export const PLAN_KEYS = PLANS.map((p) => p.key);

export function getPlan(key: string | null | undefined): Plan | undefined {
  return PLANS.find((p) => p.key === key);
}

export function isPlanKey(key: unknown): key is PlanKey {
  return typeof key === "string" && (PLAN_KEYS as string[]).includes(key);
}

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
export const planPriceLabel = (p: Plan) => `${usd(p.setup)} setup + ${usd(p.monthly)}/mo`;

/** Best-effort plan detection from an amount in cents — fallback only (metadata is preferred). */
export function planFromAmount(cents: number): CheckoutKey {
  // exact matches for setup, monthly, or setup+first month combined
  for (const p of PLANS) {
    const c = [p.setup, p.monthly, p.setup + p.monthly].map((d) => d * 100);
    if (c.includes(cents)) return p.key;
  }
  // otherwise nearest setup tier at or below the amount
  const sorted = [...PLANS].sort((a, b) => b.setup - a.setup);
  for (const p of sorted) if (cents >= p.setup * 100) return p.key;
  return "discovery";
}

// Agent frameworks we deploy & manage — used across marketing pages.
// `cli` is the value passed to openclaw-templates/onboard.sh --framework.
export const FRAMEWORKS = [
  { name: "OpenClaw", cli: "openclaw", desc: "Open-source autonomous agent framework" },
  { name: "Hermes Agent", cli: "hermes", desc: "Nous Research's self-improving agent" },
  { name: "NVIDIA NemoClaw", cli: "openclaw", desc: "Enterprise guardrails & privacy routing" },
  { name: "Claude Agent SDK", cli: "claude-sdk", desc: "Anthropic's agent toolkit" },
  { name: "OpenAI Agents", cli: "openai-agents", desc: "OpenAI Agents SDK & Codex" },
  { name: "n8n", cli: "n8n", desc: "Visual workflow automation" },
  { name: "CrewAI", cli: "crewai", desc: "Role-based multi-agent crews" },
  { name: "LangGraph", cli: "langgraph", desc: "Stateful agent orchestration" },
  { name: "Custom Builds", cli: "custom", desc: "Bespoke agents for your stack" },
];

/** Framework the client chose on the intake form ("[Framework: X]" line in details). */
export function frameworkFromDetails(details: string | null | undefined): { name: string; cli: string } {
  const m = details?.match(/\[Framework:\s*([^\]]+)\]/);
  const picked = m ? FRAMEWORKS.find((f) => f.name === m[1].trim()) : undefined;
  return picked ? { name: picked.name, cli: picked.cli } : { name: "OpenClaw (default)", cli: "openclaw" };
}
