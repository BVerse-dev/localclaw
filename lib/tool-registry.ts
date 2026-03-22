// ─── LocalClaw Tool Registry ────────────────────────────────────────────────
// Maps every tool an agent might need, grouped by category.
// Each tool has: id, name, description, requiredEnvVars, plans it's available on,
// setupUrl, and whether it needs an API key from the client.

export interface Tool {
  id: string;
  name: string;
  icon: string;          // emoji for display
  category: ToolCategory;
  description: string;
  requiredEnvVars: string[];
  plans: ("starter" | "business" | "fullstack")[];
  setupUrl?: string;
  requiresClientKey: boolean;
  optional: boolean;
  configNotes?: string;
}

export type ToolCategory =
  | "messaging"
  | "automation"
  | "crm"
  | "payments"
  | "calendar"
  | "marketing"
  | "security"
  | "analytics"
  | "content"
  | "ai";

export const TOOL_CATEGORIES: Record<ToolCategory, { label: string; color: string; icon: string }> = {
  messaging:  { label: "Messaging Channels",  color: "#22C55E", icon: "💬" },
  automation: { label: "Workflow Automation",  color: "#3B82F6", icon: "⚡" },
  crm:        { label: "CRM & Database",       color: "#8B5CF6", icon: "🗄️" },
  payments:   { label: "Payments & Billing",   color: "#F59E0B", icon: "💳" },
  calendar:   { label: "Scheduling",           color: "#EC4899", icon: "📅" },
  marketing:  { label: "Social & Marketing",   color: "#EF4444", icon: "📣" },
  security:   { label: "Security & Guardrails",color: "#14B8A6", icon: "🛡️" },
  analytics:  { label: "Analytics & Reporting", color: "#6366F1", icon: "📊" },
  content:    { label: "Content Generation",   color: "#F97316", icon: "🎨" },
  ai:         { label: "AI & Language Models", color: "#C9922A", icon: "🧠" },
};

export const TOOL_REGISTRY: Tool[] = [
  // ── MESSAGING ──
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: "💬",
    category: "messaging",
    description: "Primary customer communication channel. Handles inbound messages, lead capture, appointment confirmations, and follow-ups via WhatsApp Business API.",
    requiredEnvVars: ["WHATSAPP_TOKEN", "WHATSAPP_PHONE_ID", "WHATSAPP_ACCOUNT_ID", "WHATSAPP_VERIFY_TOKEN"],
    plans: ["starter", "business", "fullstack"],
    setupUrl: "https://business.facebook.com/latest/whatsapp_manager",
    requiresClientKey: true,
    optional: false,
    configNotes: "Scan QR code in OpenClaw gateway: openclaw channels login",
  },
  {
    id: "telegram",
    name: "Telegram Bot",
    icon: "✈️",
    category: "messaging",
    description: "Customer messaging + owner alert channel. Create a bot via @BotFather, get the token, and connect.",
    requiredEnvVars: ["TELEGRAM_BOT_TOKEN", "OWNER_TELEGRAM_CHAT_ID"],
    plans: ["starter", "business", "fullstack"],
    setupUrl: "https://t.me/BotFather",
    requiresClientKey: true,
    optional: false,
    configNotes: "Also used for owner escalation alerts on all plans",
  },
  {
    id: "instagram",
    name: "Instagram DMs",
    icon: "📸",
    category: "messaging",
    description: "Lead capture via Instagram Direct Messages. Picks up DMs, responds to inquiries, routes to WhatsApp for transactions.",
    requiredEnvVars: ["INSTAGRAM_ACCOUNT_ID", "INSTAGRAM_TOKEN"],
    plans: ["business", "fullstack"],
    setupUrl: "https://developers.facebook.com/apps",
    requiresClientKey: true,
    optional: false,
    configNotes: "Requires Facebook Developer App + Instagram Business Account",
  },
  {
    id: "gmail",
    name: "Gmail / Email",
    icon: "📧",
    category: "messaging",
    description: "Formal email communications — quotes, contracts, follow-ups. OAuth2 auth required.",
    requiredEnvVars: ["GMAIL_ADDRESS", "GMAIL_OAUTH_CLIENT_ID", "GMAIL_OAUTH_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN"],
    plans: ["fullstack"],
    setupUrl: "https://console.cloud.google.com/apis/credentials",
    requiresClientKey: true,
    optional: true,
    configNotes: "Full Stack only. Set up OAuth2 consent screen in Google Cloud Console.",
  },
  {
    id: "discord",
    name: "Discord",
    icon: "🎮",
    category: "messaging",
    description: "Community and team communication channel. Useful for businesses with Discord communities.",
    requiredEnvVars: ["DISCORD_BOT_TOKEN", "DISCORD_GUILD_ID", "DISCORD_ALERT_CHANNEL"],
    plans: ["fullstack"],
    setupUrl: "https://discord.com/developers/applications",
    requiresClientKey: true,
    optional: true,
  },
  {
    id: "slack",
    name: "Slack",
    icon: "💼",
    category: "messaging",
    description: "Internal team alerts and coordination. Owner/staff get notified of leads and escalations.",
    requiredEnvVars: ["SLACK_BOT_TOKEN", "SLACK_ALERT_CHANNEL", "SLACK_WEBHOOK_URL"],
    plans: ["fullstack"],
    setupUrl: "https://api.slack.com/apps",
    requiresClientKey: true,
    optional: true,
  },

  // ── AUTOMATION ──
  {
    id: "n8n",
    name: "n8n Workflows",
    icon: "⚡",
    category: "automation",
    description: "Core automation engine. Handles lead capture, follow-up sequences, CRM sync, booking confirmations, and owner notifications.",
    requiredEnvVars: ["N8N_WEBHOOK_TOKEN"],
    plans: ["starter", "business", "fullstack"],
    setupUrl: "http://localhost:5678",
    requiresClientKey: false,
    optional: false,
    configNotes: "Self-hosted on same VPS as OpenClaw. Import workflow JSONs from openclaw-templates/n8n/",
  },
  {
    id: "resend",
    name: "Resend (Transactional Email)",
    icon: "📨",
    category: "automation",
    description: "Sends transactional emails — welcome emails to new leads, booking confirmations, owner alerts.",
    requiredEnvVars: ["RESEND_API_KEY"],
    plans: ["starter", "business", "fullstack"],
    setupUrl: "https://resend.com/api-keys",
    requiresClientKey: false,
    optional: false,
    configNotes: "Uses LocalClaw's Resend account (alerts@mail.localclawagents.com). No client key needed.",
  },

  // ── CRM ──
  {
    id: "supabase",
    name: "Supabase (CRM Database)",
    icon: "🗄️",
    category: "crm",
    description: "Central database for leads, bookings, conversations, quotes, and agent activity logs.",
    requiredEnvVars: ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_KEY"],
    plans: ["starter", "business", "fullstack"],
    setupUrl: "https://supabase.com/dashboard",
    requiresClientKey: false,
    optional: false,
    configNotes: "Uses LocalClaw's Supabase project. Each client gets a row prefix or separate schema.",
  },

  // ── PAYMENTS ──
  {
    id: "stripe",
    name: "Stripe Payments",
    icon: "💳",
    category: "payments",
    description: "Payment link delivery, invoice tracking, subscription monitoring. Agent sends payment links via WhatsApp.",
    requiredEnvVars: ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY", "STRIPE_PAYMENT_LINK"],
    plans: ["business", "fullstack"],
    setupUrl: "https://dashboard.stripe.com/apikeys",
    requiresClientKey: true,
    optional: true,
    configNotes: "Business & Full Stack only. Client needs their own Stripe account for receiving payments.",
  },

  // ── CALENDAR ──
  {
    id: "cal",
    name: "Cal.com Scheduling",
    icon: "📅",
    category: "calendar",
    description: "Appointment booking engine. Agent checks availability, books slots, and sends confirmation links.",
    requiredEnvVars: ["CAL_API_KEY", "CAL_USERNAME", "CAL_EVENT_TYPE", "CAL_EVENT_TYPE_ID"],
    plans: ["starter", "business", "fullstack"],
    setupUrl: "https://cal.com/settings/developer/api-keys",
    requiresClientKey: true,
    optional: false,
    configNotes: "Client needs a Cal.com account. Free tier works for Starter plan.",
  },

  // ── MARKETING ──
  {
    id: "postiz",
    name: "Postiz (Social Scheduling)",
    icon: "📣",
    category: "marketing",
    description: "Schedule and auto-publish social media posts across platforms. Agent creates content and queues it via API.",
    requiredEnvVars: ["POSTIZ_API_KEY", "POSTIZ_WORKSPACE_ID"],
    plans: ["business", "fullstack"],
    setupUrl: "https://postiz.com",
    requiresClientKey: true,
    optional: true,
    configNotes: "Connects to Instagram, Facebook, X/Twitter, LinkedIn, TikTok. Business & Full Stack only.",
  },
  {
    id: "nanobana",
    name: "NanoBana Pro (Image Generation)",
    icon: "🎨",
    category: "content",
    description: "AI-powered image and banner generation for social media posts, ads, and marketing materials.",
    requiredEnvVars: ["NANOBANA_API_KEY"],
    plans: ["business", "fullstack"],
    setupUrl: "https://nanobana.pro",
    requiresClientKey: true,
    optional: true,
    configNotes: "Agent generates branded images for social posts. Pair with Postiz for full automation.",
  },
  {
    id: "google_business",
    name: "Google Business Profile",
    icon: "📍",
    category: "marketing",
    description: "Manage reviews, reply to customer reviews, update business hours and posts on Google.",
    requiredEnvVars: ["GOOGLE_BUSINESS_ACCESS_TOKEN", "GOOGLE_BUSINESS_ACCOUNT_ID", "GOOGLE_BUSINESS_LOCATION_ID"],
    plans: ["fullstack"],
    setupUrl: "https://business.google.com",
    requiresClientKey: true,
    optional: true,
    configNotes: "Full Stack only. Agent monitors and responds to Google reviews automatically.",
  },

  // ── SECURITY ──
  {
    id: "nemoclaw",
    name: "NemoClaw Security Layer",
    icon: "🛡️",
    category: "security",
    description: "NVIDIA NemoClaw guardrails — monitors all outbound messages for policy compliance, pricing accuracy, PII leaks, and prompt injection attempts.",
    requiredEnvVars: ["NEMOCLAW_ENABLED"],
    plans: ["fullstack"],
    requiresClientKey: false,
    optional: false,
    configNotes: "Full Stack exclusive. Runs as a parallel process alongside the main agent. Zero-config — uses LocalClaw's guardrail policies.",
  },

  // ── ANALYTICS ──
  {
    id: "sentry",
    name: "Sentry (Error Monitoring)",
    icon: "🐛",
    category: "analytics",
    description: "Real-time error tracking and performance monitoring for the agent runtime.",
    requiredEnvVars: ["SENTRY_DSN"],
    plans: ["fullstack"],
    setupUrl: "https://sentry.io",
    requiresClientKey: false,
    optional: true,
    configNotes: "Uses LocalClaw's Sentry project. No client setup needed.",
  },
  {
    id: "localclaw_alerts",
    name: "LocalClaw Alert System",
    icon: "🚨",
    category: "analytics",
    description: "Central monitoring endpoint. All agents report heartbeats, errors, and escalations to LocalClaw HQ.",
    requiredEnvVars: ["LOCALCLAW_API_KEY"],
    plans: ["starter", "business", "fullstack"],
    setupUrl: "https://localclawagents.com/admin",
    requiresClientKey: false,
    optional: false,
    configNotes: "Auto-configured during onboarding. Reports to localclawagents@gmail.com.",
  },

  // ── AI MODELS ──
  {
    id: "anthropic",
    name: "Anthropic Claude (Primary LLM)",
    icon: "🧠",
    category: "ai",
    description: "Primary language model. Claude Haiku for fast routing, Claude Sonnet for complex reasoning and sales conversations.",
    requiredEnvVars: ["ANTHROPIC_API_KEY"],
    plans: ["starter", "business", "fullstack"],
    setupUrl: "https://console.anthropic.com/settings/keys",
    requiresClientKey: false,
    optional: false,
    configNotes: "Uses LocalClaw's Anthropic account. Haiku for Starter, Sonnet for Business/Full Stack.",
  },
  {
    id: "openai",
    name: "OpenAI GPT (Fallback LLM)",
    icon: "🤖",
    category: "ai",
    description: "Fallback language model when Anthropic is unavailable. GPT-4o-mini for routing, GPT-4o for complex tasks.",
    requiredEnvVars: ["OPENAI_API_KEY"],
    plans: ["business", "fullstack"],
    setupUrl: "https://platform.openai.com/api-keys",
    requiresClientKey: false,
    optional: true,
    configNotes: "Business & Full Stack fallback only. Uses LocalClaw's OpenAI account.",
  },
  {
    id: "tavily",
    name: "Tavily (Web Search)",
    icon: "🔍",
    category: "ai",
    description: "Real-time web search for the Researcher sub-agent. Finds competitor info, market data, local business intelligence.",
    requiredEnvVars: ["TAVILY_API_KEY"],
    plans: ["fullstack"],
    setupUrl: "https://tavily.com",
    requiresClientKey: false,
    optional: true,
    configNotes: "Full Stack only — powers the Researcher sub-agent.",
  },

  // ── INDUSTRY-SPECIFIC ──
  {
    id: "opentable",
    name: "OpenTable / Resy (Restaurant)",
    icon: "🍽️",
    category: "calendar",
    description: "Restaurant reservation management. Sync with existing OpenTable or Resy account.",
    requiredEnvVars: ["OPENTABLE_API_KEY"],
    plans: ["business", "fullstack"],
    requiresClientKey: true,
    optional: true,
    configNotes: "Restaurant industry only. Agent can check and create reservations.",
  },
  {
    id: "mls_idx",
    name: "MLS / IDX Feed (Real Estate)",
    icon: "🏠",
    category: "crm",
    description: "Property listing data feed. Agent can search listings, share details with leads, and match criteria.",
    requiredEnvVars: ["MLS_API_KEY", "MLS_API_URL"],
    plans: ["business", "fullstack"],
    requiresClientKey: true,
    optional: true,
    configNotes: "Real estate industry only. Requires MLS board access.",
  },
  {
    id: "clio",
    name: "Clio (Law Practice Management)",
    icon: "⚖️",
    category: "crm",
    description: "Law firm case and client management. Sync contacts, create intake records, check attorney availability.",
    requiredEnvVars: ["CLIO_API_TOKEN", "CLIO_CLIENT_ID"],
    plans: ["business", "fullstack"],
    requiresClientKey: true,
    optional: true,
    configNotes: "Law firm industry only.",
  },
  {
    id: "servicetitan",
    name: "ServiceTitan / Jobber (Home Services)",
    icon: "🔧",
    category: "crm",
    description: "Field service management. Sync jobs, dispatch techs, track estimates and invoices.",
    requiredEnvVars: ["SERVICETITAN_API_KEY", "SERVICETITAN_TENANT_ID"],
    plans: ["business", "fullstack"],
    requiresClientKey: true,
    optional: true,
    configNotes: "Home services industry only (HVAC, plumbing, electrical).",
  },
  {
    id: "shopify",
    name: "Shopify / WooCommerce (Retail)",
    icon: "🛒",
    category: "crm",
    description: "E-commerce integration. Check inventory, track orders, handle product inquiries.",
    requiredEnvVars: ["SHOPIFY_API_KEY", "SHOPIFY_STORE_URL"],
    plans: ["business", "fullstack"],
    requiresClientKey: true,
    optional: true,
    configNotes: "Retail/ecommerce industry only.",
  },
  {
    id: "ehr",
    name: "EHR / Practice Management (Medical)",
    icon: "🏥",
    category: "calendar",
    description: "Electronic health records scheduling integration. Book patient appointments, check provider availability.",
    requiredEnvVars: ["EHR_API_KEY", "EHR_API_URL"],
    plans: ["business", "fullstack"],
    requiresClientKey: true,
    optional: true,
    configNotes: "Medical/healthcare industry only. HIPAA compliance required — NemoClaw layer recommended.",
  },
];

// ── Helper functions ──

export function getToolsForPlan(plan: "starter" | "business" | "fullstack"): Tool[] {
  return TOOL_REGISTRY.filter(t => t.plans.includes(plan));
}

export function getToolsForIndustry(industry: string): Tool[] {
  const industryToolMap: Record<string, string[]> = {
    restaurant:     ["opentable"],
    "real-estate":  ["mls_idx"],
    "law-firm":     ["clio"],
    "home-services":["servicetitan"],
    retail:         ["shopify"],
    medical:        ["ehr"],
  };
  const ids = industryToolMap[industry] || [];
  return TOOL_REGISTRY.filter(t => ids.includes(t.id));
}

export function getRequiredTools(plan: "starter" | "business" | "fullstack"): Tool[] {
  return getToolsForPlan(plan).filter(t => !t.optional);
}

export function getOptionalTools(plan: "starter" | "business" | "fullstack"): Tool[] {
  return getToolsForPlan(plan).filter(t => t.optional);
}

export function getToolsByCategory(plan: "starter" | "business" | "fullstack"): Record<ToolCategory, Tool[]> {
  const tools = getToolsForPlan(plan);
  const grouped = {} as Record<ToolCategory, Tool[]>;
  for (const cat of Object.keys(TOOL_CATEGORIES) as ToolCategory[]) {
    const catTools = tools.filter(t => t.category === cat);
    if (catTools.length > 0) grouped[cat] = catTools;
  }
  return grouped;
}

// ── Plan metadata ──

export const PLAN_META = {
  starter: {
    name: "Starter",
    price: "$149/mo",
    setup: "$997",
    channels: 1,
    heartbeat: "24h",
    subAgents: false,
    nemoclaw: false,
    color: "#22C55E",
  },
  business: {
    name: "Business",
    price: "$349/mo",
    setup: "$1,997",
    channels: 3,
    heartbeat: "6h",
    subAgents: false,
    nemoclaw: false,
    color: "#3B82F6",
  },
  fullstack: {
    name: "Full Stack",
    price: "$699/mo",
    setup: "$3,500",
    channels: 6,
    heartbeat: "30m",
    subAgents: true,
    nemoclaw: true,
    color: "#C9922A",
  },
};

// ── Business type metadata ──

export const BUSINESS_TYPES: Record<string, { label: string; icon: string; templateFile: string }> = {
  restaurant:     { label: "Restaurant / Food & Beverage", icon: "🍽️", templateFile: "restaurant.md" },
  "real-estate":  { label: "Real Estate",                  icon: "🏠", templateFile: "real-estate.md" },
  "law-firm":     { label: "Law Firm / Legal",             icon: "⚖️", templateFile: "law-firm.md" },
  "home-services":{ label: "Home Services (HVAC/Plumbing)", icon: "🔧", templateFile: "home-services.md" },
  medical:        { label: "Medical / Healthcare",         icon: "🏥", templateFile: "medical.md" },
  retail:         { label: "Retail / E-commerce",          icon: "🛒", templateFile: "retail.md" },
  general:        { label: "General Service Business",     icon: "🏢", templateFile: "general.md" },
};
