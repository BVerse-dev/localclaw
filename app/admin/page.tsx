"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const BG         = "#080704";
const BG2        = "#0D0B07";
const BG3        = "#111009";
const GOLD       = "#C9922A";
const GOLD_BORDER= "rgba(201,146,42,0.22)";
const GOLD_MID   = "rgba(201,146,42,0.07)";
const CREAM      = "#F5EED8";
const MUTED      = "#9A8F7E";
const DIM        = "#635C50";
const BORDER     = "rgba(201,146,42,0.14)";

const display: React.CSSProperties = { fontFamily:"'Cormorant Garamond', Georgia, serif" };
const sans: React.CSSProperties    = { fontFamily:"'Inter', system-ui, sans-serif" };

// ── Status config ─────────────────────────────────────────────────────────────
const STATUSES = [
  { key: "all",         label: "All",         color: MUTED },
  { key: "new",         label: "New",         color: "#22C55E" },
  { key: "contacted",   label: "Contacted",   color: "#3B82F6" },
  { key: "call_booked", label: "Call Booked",  color: "#A855F7" },
  { key: "onboarded",   label: "Onboarded",   color: GOLD },
  { key: "active",      label: "Active",      color: "#10B981" },
  { key: "lost",        label: "Lost",        color: "#EF4444" },
];

const STATUS_OPTIONS = STATUSES.filter(s => s.key !== "all");
const PIPELINE_STAGES = ["new","contacted","call_booked","onboarded","active"];

function getStatusColor(status: string) {
  return STATUSES.find(s => s.key === status)?.color || MUTED;
}
function getStatusLabel(status: string) {
  return STATUSES.find(s => s.key === status)?.label || status;
}

// ── ClawIcon ──────────────────────────────────────────────────────────────────
function ClawIcon({ size = 36, color = GOLD }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 6 C10 6, 7 14, 9 24 C10 30, 14 34, 16 36" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M18 4 C18 4, 16 13, 18 23 C19.5 29.5, 22 33, 23 36" stroke={color} strokeWidth="3.2" strokeLinecap="round" fill="none"/>
      <path d="M26 6 C26 6, 25 15, 27 24 C28.5 30, 30 33, 30 36" stroke={color} strokeWidth="2.6" strokeLinecap="round" fill="none"/>
      <path d="M10 6 C11 3, 14 2, 15 4" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M18 4 C19 1, 22 1, 22 3" stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none"/>
      <path d="M26 6 C27 3, 30 3, 29 5" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Submission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  business: string;
  industry: string | null;
  team_size: string | null;
  budget: string | null;
  automations: string[];
  details: string | null;
  status: string;
  admin_notes: string | null;
  payment_status: string | null;
  payment_amount: number | null;
  payment_currency: string | null;
  stripe_customer_id: string | null;
  paid_at: string | null;
  plan: string | null;
  subscription_status: string | null;
  subscription_id: string | null;
  subscription_plan: string | null;
  subscription_current_period_end: string | null;
  monthly_amount: number | null;
  last_payment_at: string | null;
  failed_payment_reason: string | null;
}

interface PaymentData {
  stats: {
    totalRevenue: number;
    totalPaid: number;
    totalUnpaid: number;
    totalRefunded: number;
    totalLeads: number;
    conversionRate: number;
    planCounts: Record<string, number>;
    planRevenue: Record<string, number>;
  };
  recentCharges: Array<{
    id: string;
    amount: number;
    currency: string;
    email: string;
    name: string;
    status: string;
    created: number;
    refunded: boolean;
    receiptUrl: string | null;
    matchedLeadId: string | null;
  }>;
  paidLeads: Array<{
    id: string;
    name: string;
    email: string;
    business: string;
    plan: string;
    amount: number;
    currency: string;
    paidAt: string;
    status: string;
  }>;
  unpaidLeads: Array<{
    id: string;
    name: string;
    email: string;
    business: string;
    budget: string;
    status: string;
    createdAt: string;
  }>;
}

interface Booking {
  id: number;
  uid: string;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  attendeeName: string;
  attendeeEmail: string;
  videoUrl: string | null;
  location: string;
  cancellationReason: string | null;
  matchedLeadId: string | null;
  matchedLeadStatus: string | null;
}

interface BookingData {
  upcoming: Booking[];
  past: Booking[];
  cancelled: Booking[];
  stats: { total: number; upcoming: number; past: number; cancelled: number; matched: number };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function budgetLabel(b: string | null) {
  if (b === "starter") return "Starter — $997 + $149/mo";
  if (b === "business") return "Business — $1,997 + $299/mo";
  if (b === "fullstack") return "Full Stack — $3,500 + $499/mo";
  if (b === "unsure") return "Not sure yet";
  return b || "—";
}
function budgetSetupValue(b: string | null): number {
  if (b === "starter") return 997;
  if (b === "business") return 1997;
  if (b === "fullstack") return 3500;
  return 0;
}
function budgetMonthlyValue(b: string | null): number {
  if (b === "starter") return 149;
  if (b === "business") return 299;
  if (b === "fullstack") return 499;
  return 0;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day:"numeric", month:"short" });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) +
    " · " + d.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
}

function formatCallTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { weekday:"short", day:"numeric", month:"short" }) +
    " · " + d.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
}

function timeUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return "now";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `in ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `in ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `in ${days}d`;
}

// ── Tab type ──────────────────────────────────────────────────────────────────
type TabKey = "overview" | "leads" | "payments" | "calls" | "calendar" | "agents" | "settings";

interface PaymentEvent {
  id: string;
  created_at: string;
  event_type: string;
  email: string | null;
  amount: number;
  currency: string;
  status: string;
  failure_reason: string | null;
  metadata: Record<string, unknown>;
}

interface EventsData {
  events: PaymentEvent[];
  summary: Record<string, number>;
  recentFailures: Array<{ type: string; reason: string; email: string; created: string }>;
}

// ── Agent types ──────────────────────────────────────────────────────────────
interface DeployedAgent {
  id: string;
  submission_id: string | null;
  agent_name: string;
  slug: string;
  plan: string;
  business_type: string;
  workspace_files: Record<string, string>;
  tools_enabled: string[];
  status: string;
  deploy_log: string | null;
  channels_connected: string[];
  heartbeat_interval: string;
  last_heartbeat_at: string | null;
  nemoclaw_enabled: boolean;
  env_vars_set: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface GeneratedConfig {
  agentName: string;
  slug: string;
  plan: string;
  planMeta: { name: string; price: string; setup: string; channels: number; heartbeat: string; subAgents: boolean; nemoclaw: boolean; color: string };
  businessType: string;
  businessTypeMeta: { label: string; icon: string };
  files: Record<string, string>;
  tools: { required: Array<{ id: string; name: string; icon: string; category: string; description: string; requiredEnvVars: string[]; requiresClientKey: boolean; optional: boolean; configNotes?: string }>; optional: Array<{ id: string; name: string; icon: string; category: string; description: string; requiredEnvVars: string[]; requiresClientKey: boolean; optional: boolean; configNotes?: string }>; industry: Array<{ id: string; name: string; icon: string }> };
  envVars: { required: Record<string, string>; optional: Record<string, string> };
  deployCommand: string;
}

const PLAN_COLORS: Record<string, string> = { starter: "#22C55E", business: "#3B82F6", fullstack: "#C9922A" };
const PLAN_NAMES: Record<string, string> = { starter: "Starter", business: "Business", fullstack: "Full Stack" };
const STATUS_ICONS: Record<string, { icon: string; color: string; label: string }> = {
  configured: { icon: "⚙️", color: "#F59E0B", label: "Configured" },
  deploying:  { icon: "🚀", color: "#3B82F6", label: "Deploying" },
  active:     { icon: "🟢", color: "#22C55E", label: "Active" },
  paused:     { icon: "⏸️", color: "#6B7280", label: "Paused" },
  error:      { icon: "🔴", color: "#EF4444", label: "Error" },
};

function paymentBadge(ps: string | null, amount: number | null) {
  if (ps === "paid") return { label: `PAID $${((amount || 0) / 100).toLocaleString()}`, color: "#10B981" };
  if (ps === "refunded") return { label: "REFUNDED", color: "#EF4444" };
  return { label: "UNPAID", color: "#6B7280" };
}

function planLabel(p: string | null) {
  if (p === "starter") return "Starter";
  if (p === "business") return "Business Engine";
  if (p === "fullstack") return "Full Stack";
  if (p === "discovery") return "Discovery ($97)";
  return p || "—";
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<"all"|"paid"|"unpaid"|"refunded">("all");
  const [eventsData, setEventsData] = useState<EventsData | null>(null);
  const [syncingPayments, setSyncingPayments] = useState(false);
  const [filter, setFilter] = useState("all");
  const [callFilter, setCallFilter] = useState<"upcoming"|"past"|"cancelled">("upcoming");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [tab, setTab] = useState<TabKey>("overview");
  const [agents, setAgents] = useState<DeployedAgent[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [generatedConfig, setGeneratedConfig] = useState<GeneratedConfig | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<DeployedAgent | null>(null);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [togglingAgent, setTogglingAgent] = useState<string | null>(null);
  const [savingAgent, setSavingAgent] = useState(false);

  // ── Auth ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setAuthed(true);
    else setAuthError("Invalid password.");
  };

  useEffect(() => {
    fetch("/api/admin/submissions")
      .then(res => { if (res.ok) setAuthed(true); })
      .catch(() => {});
  }, []);

  // ── Fetch submissions ──
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/submissions?status=all");
    if (res.ok) {
      const data = await res.json();
      setSubmissions(data.submissions || []);
    }
    setLoading(false);
  }, []);

  // ── Fetch bookings ──
  const fetchBookings = useCallback(async () => {
    const res = await fetch("/api/admin/bookings");
    if (res.ok) {
      const data = await res.json();
      setBookingData(data);
    }
  }, []);

  // ── Fetch payments ──
  const fetchPayments = useCallback(async () => {
    const res = await fetch("/api/admin/payments");
    if (res.ok) {
      const data = await res.json();
      setPaymentData(data);
    }
  }, []);

  // ── Fetch events ──
  const fetchEvents = useCallback(async () => {
    const res = await fetch("/api/admin/events?limit=50");
    if (res.ok) {
      const data = await res.json();
      setEventsData(data);
    }
  }, []);

  useEffect(() => {
    if (authed) {
      fetchSubmissions();
      fetchBookings();
      fetchPayments();
      fetchEvents();
    }
  }, [authed, fetchSubmissions, fetchBookings, fetchPayments, fetchEvents]);

  // ── Sync payments from Stripe ──
  const syncPayments = async () => {
    setSyncingPayments(true);
    const res = await fetch("/api/admin/payments", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      if (data.synced > 0) {
        await fetchSubmissions();
        await fetchPayments();
      }
    }
    setSyncingPayments(false);
  };

  // ── Sync bookings → lead statuses ──
  const syncBookings = async () => {
    setSyncing(true);
    const res = await fetch("/api/admin/bookings", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      if (data.synced > 0) {
        await fetchSubmissions();
        await fetchBookings();
      }
    }
    setSyncing(false);
  };

  // ── Fetch agents ──
  const fetchAgents = useCallback(async () => {
    setAgentsLoading(true);
    const res = await fetch("/api/admin/agents?action=list");
    if (res.ok) {
      const data = await res.json();
      setAgents(data.agents || []);
    }
    setAgentsLoading(false);
  }, []);

  useEffect(() => {
    if (authed && tab === "agents") fetchAgents();
  }, [authed, tab, fetchAgents]);

  // ── Generate agent config from submission ──
  const generateConfig = async (submissionId: string) => {
    setGeneratingFor(submissionId);
    const res = await fetch(`/api/admin/agents?action=generate&submissionId=${submissionId}`);
    if (res.ok) {
      const data = await res.json();
      setGeneratedConfig(data.generated);
    }
    setGeneratingFor(null);
  };

  // ── Save agent config ──
  const saveAgent = async () => {
    if (!generatedConfig) return;
    setSavingAgent(true);
    const sub = submissions.find(s => slugify_admin(s.business) === generatedConfig.slug);
    const res = await fetch("/api/admin/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save",
        submissionId: sub?.id,
        agentName: generatedConfig.agentName,
        slug: generatedConfig.slug,
        plan: generatedConfig.plan,
        businessType: generatedConfig.businessType,
        files: generatedConfig.files,
        toolsEnabled: generatedConfig.tools.required.map((t: { id: string }) => t.id),
      }),
    });
    if (res.ok) {
      setGeneratedConfig(null);
      await fetchAgents();
      await fetchSubmissions();
    }
    setSavingAgent(false);
  };

  // ── Toggle agent on/off ──
  const toggleAgent = async (agentId: string, currentStatus: string) => {
    setTogglingAgent(agentId);
    const enabled = currentStatus !== "active";
    await fetch("/api/admin/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", agentId, enabled }),
    });
    await fetchAgents();
    setTogglingAgent(null);
  };

  // ── Delete agent ──
  const deleteAgent = async (agentId: string) => {
    if (!confirm("Are you sure you want to delete this agent configuration?")) return;
    await fetch("/api/admin/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", agentId }),
    });
    setSelectedAgent(null);
    await fetchAgents();
  };

  // ── Slugify helper ──
  function slugify_admin(t: string) { return t.toLowerCase().replace(/[^a-z0-9 -]/g,"").replace(/ /g,"-").replace(/-+/g,"-").replace(/^-|-$/g,""); }

  // ── Update submission ──
  const updateSubmission = async (id: string, updates: { status?: string; admin_notes?: string }) => {
    setSaving(true);
    await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    await fetchSubmissions();
    if (selected?.id === id) {
      setSelected(prev => prev ? { ...prev, ...updates } : null);
    }
    setSaving(false);
  };

  // ── Computed stats ──
  const stats = useMemo(() => {
    const total = submissions.length;
    const byStatus: Record<string, number> = {};
    STATUSES.forEach(s => { byStatus[s.key] = 0; });
    submissions.forEach(s => { byStatus[s.status] = (byStatus[s.status] || 0) + 1; });
    byStatus.all = total;

    const pipelineValue = submissions
      .filter(s => s.status !== "lost")
      .reduce((sum, s) => sum + budgetSetupValue(s.budget), 0);

    const monthlyRecurring = submissions
      .filter(s => s.status === "active" || s.status === "onboarded")
      .reduce((sum, s) => sum + budgetMonthlyValue(s.budget), 0);

    const conversionRate = total > 0
      ? Math.round(((byStatus.active || 0) + (byStatus.onboarded || 0)) / total * 100)
      : 0;

    const thisWeek = submissions.filter(s => {
      const d = new Date(s.created_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    }).length;

    const activeSubs = submissions.filter(s => s.subscription_status === "active").length;
    const pastDueSubs = submissions.filter(s => s.subscription_status === "past_due").length;
    const cancelledSubs = submissions.filter(s => s.subscription_status === "cancelled").length;
    const stripeRevenue = submissions.filter(s => s.payment_status === "paid").reduce((sum, s) => sum + ((s.payment_amount || 0) / 100), 0);
    const stripeMRR = submissions.filter(s => s.subscription_status === "active").reduce((sum, s) => sum + ((s.monthly_amount || 0) / 100), 0);

    return { total, byStatus, pipelineValue, monthlyRecurring, conversionRate, thisWeek, activeSubs, pastDueSubs, cancelledSubs, stripeRevenue, stripeMRR };
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    if (filter === "all") return submissions;
    return submissions.filter(s => s.status === filter);
  }, [submissions, filter]);

  const recentLeads = useMemo(() => submissions.slice(0, 10), [submissions]);

  const automationStats = useMemo(() => {
    const counts: Record<string, number> = {};
    submissions.forEach(s => {
      (s.automations || []).forEach(a => { counts[a] = (counts[a] || 0) + 1; });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [submissions]);

  // Leads without a booking (need outreach)
  const leadsWithoutBooking = useMemo(() => {
    if (!bookingData) return [];
    const bookedEmails = new Set([
      ...bookingData.upcoming.map(b => b.attendeeEmail.toLowerCase()),
      ...bookingData.past.map(b => b.attendeeEmail.toLowerCase()),
    ]);
    return submissions.filter(s =>
      (s.status === "new" || s.status === "contacted") &&
      !bookedEmails.has(s.email.toLowerCase())
    );
  }, [submissions, bookingData]);

  // ── Cal.com embed ──
  useEffect(() => {
    if (!authed || tab !== "calendar") return;
    const existing = document.getElementById("cal-embed-script");
    if (existing) return;
    const script = document.createElement("script");
    script.id = "cal-embed-script";
    script.type = "text/javascript";
    script.innerHTML = `
      (function (C, A, L) {
        let p = function (a, ar) { a.q.push(ar); };
        let d = C.document;
        C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments;
          if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true; }
          if (ar[0] === L) { const api = function () { p(api, arguments); };
            const namespace = ar[1]; api.q = api.q || [];
            if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar);
            return; }
          p(cal, ar);
        };
      })(window, "https://app.cal.com/embed/embed.js", "init");
      Cal("init", "15min", { origin: "https://cal.com" });
      Cal.ns["15min"]("inline", {
        elementOrSelector: "#cal-embed-container",
        calLink: "bverse/15min",
        layout: "month_view",
        config: { theme: "dark" },
      });
      Cal.ns["15min"]("ui", {
        theme: "dark",
        styles: { branding: { brandColor: "#C9922A" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    `;
    document.body.appendChild(script);
  }, [authed, tab]);

  // ── LOGIN SCREEN ──
  if (!authed) {
    return (
      <div style={{ minHeight:"100vh", background:BG, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:"100%", maxWidth:"380px", padding:"0 24px" }}>
          <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
            <ClawIcon size={40} color={GOLD} />
            <h1 style={{ ...display, fontSize:"2rem", fontWeight:"700", color:CREAM, marginTop:"1rem" }}>Admin</h1>
            <p style={{ ...sans, color:DIM, fontSize:"0.82rem", marginTop:"0.4rem" }}>LocalClaw Command Centre</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              style={{
                ...sans, width:"100%", background:BG2, border:`1px solid ${BORDER}`,
                borderRadius:"2px", padding:"14px 18px", color:CREAM, fontSize:"0.9rem",
                outline:"none", boxSizing:"border-box", marginBottom:"1rem",
              }}
            />
            {authError && <p style={{ ...sans, color:"#EF4444", fontSize:"0.82rem", marginBottom:"0.8rem" }}>{authError}</p>}
            <button type="submit" style={{
              ...sans, width:"100%", background:GOLD, color:BG, padding:"14px",
              fontWeight:"700", fontSize:"0.82rem", letterSpacing:"0.1em", border:"none",
              borderRadius:"2px", cursor:"pointer",
            }}>
              SIGN IN
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,146,42,0.18); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(201,146,42,0.35); }
        * { scrollbar-width: thin; scrollbar-color: rgba(201,146,42,0.18) transparent; }

        /* ── Selection ── */
        ::selection { background: rgba(201,146,42,0.25); color: ${CREAM}; }

        /* ── Smooth transitions ── */
        .admin-row { transition: background 0.2s, box-shadow 0.2s; cursor: pointer; }
        .admin-row:hover { background: rgba(201,146,42,0.04) !important; box-shadow: inset 3px 0 0 ${GOLD}; }
        .admin-status-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 100px; font-size: 0.7rem;
          font-weight: 600; letter-spacing: 0.06em; font-family: 'Inter', sans-serif;
          white-space: nowrap; transition: transform 0.15s;
        }
        .admin-status-pill:hover { transform: scale(1.03); }
        .admin-filter {
          padding: 6px 14px; border-radius: 100px; font-size: 0.72rem;
          font-weight: 500; letter-spacing: 0.06em; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
          background: transparent; color: ${DIM};
        }
        .admin-filter:hover { color: ${CREAM}; background: rgba(245,240,232,0.03); }
        .admin-filter.active {
          border-color: ${GOLD}; background: rgba(201,146,42,0.1); color: ${GOLD};
          box-shadow: 0 0 12px rgba(201,146,42,0.08);
        }
        .admin-detail-label {
          font-size: 0.65rem; letter-spacing: 0.18em; font-weight: 600;
          color: ${DIM}; margin-bottom: 0.3rem; font-family: 'Inter', sans-serif;
          text-transform: uppercase;
        }
        .admin-detail-value {
          font-size: 0.88rem; color: ${CREAM}; font-family: 'Inter', sans-serif; line-height: 1.6;
        }
        .admin-tab {
          padding: 12px 22px; font-size: 0.76rem; font-weight: 600;
          letter-spacing: 0.1em; font-family: 'Inter', sans-serif;
          cursor: pointer; border: none; background: transparent;
          color: ${DIM}; transition: all 0.25s; border-bottom: 2px solid transparent;
          position: relative;
        }
        .admin-tab:hover { color: ${CREAM}; background: rgba(201,146,42,0.03); }
        .admin-tab.active {
          color: ${GOLD}; border-bottom-color: ${GOLD};
          background: rgba(201,146,42,0.04);
        }
        .admin-tab.active::after {
          content: ''; position: absolute; bottom: -1px; left: 20%; right: 20%;
          height: 2px; background: ${GOLD}; filter: blur(4px); opacity: 0.5;
        }
        .stat-card {
          background: ${BG2}; border: 1px solid ${BORDER}; border-radius: 6px;
          padding: 1.3rem 1.5rem; flex: 1; min-width: 160px;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .stat-card:hover {
          border-color: ${GOLD_BORDER}; transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .stat-card-accent {
          background: linear-gradient(135deg, rgba(201,146,42,0.1), rgba(201,146,42,0.02));
          border: 1px solid ${GOLD_BORDER}; border-radius: 6px;
          padding: 1.3rem 1.5rem; flex: 1; min-width: 160px;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .stat-card-accent:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201,146,42,0.1);
        }
        .pipeline-bar {
          height: 34px; border-radius: 4px; display: flex; align-items: center;
          padding: 0 14px; font-family: 'Inter', sans-serif; font-size: 0.72rem;
          font-weight: 600; color: rgba(255,255,255,0.9); transition: all 0.3s;
          cursor: pointer; position: relative; min-width: 40px;
        }
        .pipeline-bar:hover { opacity: 0.85; transform: translateX(3px); box-shadow: 4px 0 12px rgba(0,0,0,0.15); }
        .overview-card {
          background: ${BG2}; border: 1px solid ${BORDER}; border-radius: 6px;
          padding: 1.5rem; overflow: hidden;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .overview-card:hover { border-color: rgba(201,146,42,0.12); }
        .activity-item {
          display: flex; align-items: flex-start; gap: 12px; padding: 10px 0;
          border-bottom: 1px solid ${BORDER}; transition: background 0.15s, padding-left 0.2s;
        }
        .activity-item:hover { padding-left: 4px; }
        .activity-item:last-child { border-bottom: none; }
        .booking-card {
          background: ${BG3}; border: 1px solid ${BORDER}; border-radius: 6px;
          padding: 1.2rem 1.4rem; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .booking-card:hover { border-color: ${GOLD_BORDER}; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        .booking-card.matched { border-left: 3px solid ${GOLD}; }
        .call-filter {
          padding: 6px 16px; border-radius: 100px; font-size: 0.72rem;
          font-weight: 600; letter-spacing: 0.06em; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
          background: transparent; color: ${DIM};
        }
        .call-filter:hover { color: ${CREAM}; background: rgba(245,240,232,0.03); }
        .call-filter.active {
          border-color: ${GOLD}; background: rgba(201,146,42,0.1); color: ${GOLD};
        }
        .sync-btn {
          padding: 8px 18px; border-radius: 4px; font-size: 0.72rem;
          font-weight: 600; letter-spacing: 0.08em; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.25s; border: 1px solid ${GOLD_BORDER};
          background: rgba(201,146,42,0.08); color: ${GOLD};
        }
        .sync-btn:hover { background: rgba(201,146,42,0.18); box-shadow: 0 0 16px rgba(201,146,42,0.1); transform: translateY(-1px); }
        .sync-btn:disabled { opacity: 0.5; cursor: default; transform: none; box-shadow: none; }
        .action-btn {
          padding: 6px 14px; border-radius: 4px; font-size: 0.7rem;
          font-weight: 600; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.2s; border: none;
          text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
        }
        .action-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        #cal-embed-container { width: 100%; min-height: 600px; overflow: hidden; border-radius: 6px; }
        #cal-embed-container iframe { border-radius: 6px; }

        /* ── Fade-in animation ── */
        @keyframes admin-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .admin-fade { animation: admin-fade-in 0.35s cubic-bezier(.22,1,.36,1) both; }
      ` }} />

      <div style={{ minHeight:"100vh", background:BG, color:CREAM }}>

        {/* ── NAV ── */}
        <nav style={{
          position:"fixed", top:0, left:0, right:0, zIndex:200,
          background:"rgba(8,7,4,0.97)", borderBottom:`1px solid ${GOLD_BORDER}`,
          padding:"0 5%", display:"flex", alignItems:"center", justifyContent:"space-between",
          height:"60px", backdropFilter:"blur(14px)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
            <Link href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:"10px" }}>
              <ClawIcon size={28} color={GOLD} />
              <span style={{ ...display, fontSize:"1.2rem", fontWeight:"700", color:CREAM }}>LocalClaw</span>
            </Link>
            <span style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", background:GOLD_MID, border:`1px solid ${BORDER}`, borderRadius:"100px", padding:"3px 10px" }}>COMMAND CENTRE</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"1.2rem" }}>
            {bookingData && bookingData.stats.upcoming > 0 && (
              <span style={{ ...sans, fontSize:"0.72rem", color:"#A855F7", fontWeight:"600", background:"rgba(168,85,247,0.1)", border:"1px solid rgba(168,85,247,0.2)", borderRadius:"100px", padding:"3px 12px" }}>
                {bookingData.stats.upcoming} upcoming call{bookingData.stats.upcoming > 1 ? "s" : ""}
              </span>
            )}
            {stats.byStatus.new > 0 && (
              <span style={{ ...sans, fontSize:"0.72rem", color:"#22C55E", fontWeight:"600", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:"100px", padding:"3px 12px" }}>
                {stats.byStatus.new} new lead{stats.byStatus.new > 1 ? "s" : ""}
              </span>
            )}
            <span style={{ ...sans, color:DIM, fontSize:"0.78rem" }}>{stats.total} total</span>
            <Link href="/" style={{ ...sans, color:DIM, fontSize:"0.78rem", textDecoration:"none" }}>← Site</Link>
          </div>
        </nav>

        {/* ── TABS (sticky below nav) ── */}
        <div style={{
          position:"sticky", top:"60px", zIndex:190,
          background:"rgba(8,7,4,0.98)", backdropFilter:"blur(12px)",
          borderBottom:`1px solid ${BORDER}`,
          display:"flex", paddingLeft:"5%",
          marginTop:"60px",
        }}>
          {(["overview","leads","payments","calls","calendar","agents","settings"] as TabKey[]).map(t => (
            <button key={t} className={`admin-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
              {t === "overview" ? "OVERVIEW" : t === "leads" ? "LEADS" : t === "payments" ? "PAYMENTS" : t === "calls" ? "CALLS" : t === "calendar" ? "CALENDAR" : t === "agents" ? "🤖 AGENTS" : "⚙ SETTINGS"}
              {t === "calls" && bookingData && bookingData.stats.upcoming > 0 && (
                <span style={{ marginLeft:"6px", background:"rgba(168,85,247,0.2)", color:"#A855F7", padding:"1px 6px", borderRadius:"100px", fontSize:"0.65rem" }}>{bookingData.stats.upcoming}</span>
              )}
              {t === "payments" && paymentData && paymentData.stats.totalPaid > 0 && (
                <span style={{ marginLeft:"6px", background:"rgba(16,185,129,0.2)", color:"#10B981", padding:"1px 6px", borderRadius:"100px", fontSize:"0.65rem" }}>{paymentData.stats.totalPaid}</span>
              )}
              {t === "agents" && agents.filter(a => a.status === "active").length > 0 && (
                <span style={{ marginLeft:"6px", background:"rgba(201,146,42,0.2)", color:GOLD, padding:"1px 6px", borderRadius:"100px", fontSize:"0.65rem" }}>{agents.filter(a => a.status === "active").length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* ── OVERVIEW TAB ── */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {tab === "overview" && (
          <div className="admin-fade" style={{ padding:"2rem 5%", maxWidth:"1400px", margin:"0 auto" }}>

            {/* KPI Cards */}
            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"2rem" }}>
              <div className="stat-card-accent">
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:GOLD, fontWeight:"600", marginBottom:"0.5rem" }}>TOTAL LEADS</div>
                <div style={{ ...display, fontSize:"2.2rem", fontWeight:"700", color:CREAM, lineHeight:1 }}>{stats.total}</div>
                <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.4rem" }}>{stats.thisWeek} this week</div>
              </div>
              <div className="stat-card">
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.5rem" }}>UPCOMING CALLS</div>
                <div style={{ ...display, fontSize:"2.2rem", fontWeight:"700", color:"#A855F7", lineHeight:1 }}>{bookingData?.stats.upcoming || 0}</div>
                <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.4rem" }}>{bookingData?.stats.past || 0} completed</div>
              </div>
              <div className="stat-card">
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.5rem" }}>CONVERSION RATE</div>
                <div style={{ ...display, fontSize:"2.2rem", fontWeight:"700", color:CREAM, lineHeight:1 }}>{stats.conversionRate}%</div>
                <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.4rem" }}>onboarded + active</div>
              </div>
              <div className="stat-card-accent" style={{ cursor:"pointer" }} onClick={() => setTab("payments")}>
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:GOLD, fontWeight:"600", marginBottom:"0.5rem" }}>STRIPE REVENUE</div>
                <div style={{ ...display, fontSize:"2.2rem", fontWeight:"700", color:GOLD, lineHeight:1 }}>
                  ${((paymentData?.stats.totalRevenue || 0) / 100).toLocaleString()}
                </div>
                <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.4rem" }}>
                  {paymentData?.stats.totalPaid || 0} paid · {paymentData?.stats.totalUnpaid || 0} unpaid
                </div>
              </div>
              <div className="stat-card">
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.5rem" }}>PIPELINE VALUE</div>
                <div style={{ ...display, fontSize:"2.2rem", fontWeight:"700", color:CREAM, lineHeight:1 }}>${stats.pipelineValue.toLocaleString()}</div>
                <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.4rem" }}>MRR: ${stats.monthlyRecurring.toLocaleString()}/mo</div>
              </div>
            </div>

            {/* Main grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>

              {/* Upcoming Calls */}
              <div className="overview-card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                  <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600" }}>UPCOMING CALLS</div>
                  <button onClick={() => setTab("calls")} style={{ ...sans, fontSize:"0.7rem", color:GOLD, background:"none", border:"none", cursor:"pointer" }}>View all →</button>
                </div>
                {!bookingData || bookingData.upcoming.length === 0 ? (
                  <div style={{ ...sans, fontSize:"0.84rem", color:DIM, textAlign:"center", padding:"2rem 0" }}>No upcoming calls.</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                    {bookingData.upcoming.slice(0, 5).map(b => (
                      <div key={b.id} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 12px", background:BG3, borderRadius:"4px", border:`1px solid ${BORDER}` }}>
                        <div style={{ width:10, height:10, borderRadius:"50%", background:"#A855F7", flexShrink:0 }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ ...sans, fontSize:"0.82rem", fontWeight:"600", color:CREAM }}>{b.attendeeName}</div>
                          <div style={{ ...sans, fontSize:"0.72rem", color:MUTED }}>{formatCallTime(b.startTime)}</div>
                        </div>
                        <div style={{ ...sans, fontSize:"0.68rem", color:"#A855F7", fontWeight:"600", flexShrink:0 }}>{timeUntil(b.startTime)}</div>
                        {b.videoUrl && (
                          <a href={b.videoUrl} target="_blank" rel="noopener noreferrer" className="action-btn" style={{ background:"rgba(168,85,247,0.15)", color:"#A855F7", fontSize:"0.65rem" }}>
                            JOIN
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Needs Outreach */}
              <div className="overview-card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                  <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600" }}>NEEDS OUTREACH</div>
                  <span style={{ ...sans, fontSize:"0.68rem", color: leadsWithoutBooking.length > 0 ? "#EF4444" : DIM, fontWeight:"600" }}>
                    {leadsWithoutBooking.length} lead{leadsWithoutBooking.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {leadsWithoutBooking.length === 0 ? (
                  <div style={{ ...sans, fontSize:"0.84rem", color:DIM, textAlign:"center", padding:"2rem 0" }}>All leads have been contacted or booked.</div>
                ) : (
                  <div>
                    {leadsWithoutBooking.slice(0, 6).map(s => (
                      <div key={s.id} className="activity-item" style={{ cursor:"pointer" }} onClick={() => { setSelected(s); setEditNotes(s.admin_notes || ""); setTab("leads"); }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:getStatusColor(s.status), marginTop:"6px", flexShrink:0 }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:"8px" }}>
                            <div style={{ ...sans, fontSize:"0.82rem", fontWeight:"600", color:CREAM, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
                            <div style={{ ...sans, fontSize:"0.68rem", color:DIM, whiteSpace:"nowrap", flexShrink:0 }}>{timeAgo(s.created_at)}</div>
                          </div>
                          <div style={{ ...sans, fontSize:"0.75rem", color:MUTED }}>{s.business} · {s.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pipeline */}
              <div className="overview-card">
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"1.2rem" }}>LEAD PIPELINE</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                  {PIPELINE_STAGES.map(stage => {
                    const count = stats.byStatus[stage] || 0;
                    const maxCount = Math.max(...PIPELINE_STAGES.map(s => stats.byStatus[s] || 0), 1);
                    const width = Math.max((count / maxCount) * 100, 8);
                    const color = getStatusColor(stage);
                    return (
                      <div key={stage} style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                        <div style={{ ...sans, fontSize:"0.7rem", color:DIM, width:"80px", textAlign:"right", fontWeight:"500" }}>{getStatusLabel(stage)}</div>
                        <div style={{ flex:1 }}>
                          <div className="pipeline-bar" style={{ width:`${width}%`, background:`${color}cc` }} onClick={() => { setFilter(stage); setTab("leads"); }}>
                            {count}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ display:"flex", alignItems:"center", gap:"12px", opacity:0.5, marginTop:"4px" }}>
                    <div style={{ ...sans, fontSize:"0.7rem", color:DIM, width:"80px", textAlign:"right", fontWeight:"500" }}>Lost</div>
                    <div style={{ flex:1 }}>
                      <div className="pipeline-bar" style={{ width:`${Math.max(((stats.byStatus.lost || 0) / Math.max(...PIPELINE_STAGES.map(s => stats.byStatus[s] || 0), 1)) * 100, 8)}%`, background:"rgba(239,68,68,0.6)" }} onClick={() => { setFilter("lost"); setTab("leads"); }}>
                        {stats.byStatus.lost || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Automations + Status Grid */}
              <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
                <div className="overview-card">
                  <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"1rem" }}>TOP REQUESTED AUTOMATIONS</div>
                  {automationStats.length === 0 ? (
                    <div style={{ ...sans, fontSize:"0.84rem", color:DIM, textAlign:"center", padding:"1rem 0" }}>No data yet.</div>
                  ) : (
                    <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                      {automationStats.map(([name, count]) => {
                        const maxCount = automationStats[0][1];
                        const pct = (count / maxCount) * 100;
                        return (
                          <div key={name}>
                            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"3px" }}>
                              <span style={{ ...sans, fontSize:"0.76rem", color:CREAM }}>{name}</span>
                              <span style={{ ...sans, fontSize:"0.72rem", color:DIM }}>{count}</span>
                            </div>
                            <div style={{ height:"4px", background:GOLD_MID, borderRadius:"2px", overflow:"hidden" }}>
                              <div style={{ height:"100%", width:`${pct}%`, background:GOLD, borderRadius:"2px", transition:"width 0.4s" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="overview-card">
                  <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"1rem" }}>STATUS BREAKDOWN</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
                    {STATUS_OPTIONS.map(s => (
                      <div key={s.key} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px", background:BG3, border:`1px solid ${BORDER}`, borderRadius:"4px", cursor:"pointer" }} onClick={() => { setFilter(s.key); setTab("leads"); }}>
                        <div style={{ width:10, height:10, borderRadius:"50%", background:s.color }} />
                        <div>
                          <div style={{ ...sans, fontSize:"1rem", fontWeight:"700", color:CREAM, lineHeight:1 }}>{stats.byStatus[s.key] || 0}</div>
                          <div style={{ ...sans, fontSize:"0.65rem", color:DIM, marginTop:"2px" }}>{s.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* ── LEADS TAB ── */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {tab === "leads" && (
          <div className="admin-fade" style={{ display:"flex", minHeight:"calc(100vh - 120px)" }}>
            <div style={{ flex:1, borderRight:`1px solid ${BORDER}`, display:"flex", flexDirection:"column" }}>
              <div style={{ position:"sticky", top:"104px", zIndex:100, background:"rgba(8,7,4,0.98)", backdropFilter:"blur(10px)", padding:"1.2rem 1.6rem", borderBottom:`1px solid ${BORDER}`, display:"flex", gap:"0.5rem", flexWrap:"wrap", alignItems:"center" }}>
                {STATUSES.map(s => (
                  <button key={s.key} className={`admin-filter${filter === s.key ? " active" : ""}`} onClick={() => setFilter(s.key)}>
                    {s.label}
                    {s.key !== "all" && (stats.byStatus[s.key] || 0) > 0 && (
                      <span style={{ marginLeft:"4px", opacity:0.6 }}>({stats.byStatus[s.key]})</span>
                    )}
                  </button>
                ))}
              </div>
              <div style={{ flex:1, overflowY:"auto" }}>
                {loading ? (
                  <div style={{ padding:"3rem", textAlign:"center" }}><p style={{ ...sans, color:DIM }}>Loading...</p></div>
                ) : filteredSubmissions.length === 0 ? (
                  <div style={{ padding:"4rem 2rem", textAlign:"center" }}>
                    <p style={{ ...display, fontSize:"1.4rem", color:MUTED, marginBottom:"0.5rem" }}>No submissions yet.</p>
                    <p style={{ ...sans, fontSize:"0.84rem", color:DIM }}>Intake form leads will appear here.</p>
                  </div>
                ) : (
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ borderBottom:`1px solid ${BORDER}` }}>
                        {["Date","Name","Business","Budget","Payment","Status"].map(h => (
                          <th key={h} style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.16em", fontWeight:"600", color:DIM, padding:"12px 16px", textAlign:"left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map(s => (
                        <tr key={s.id} className="admin-row" onClick={() => { setSelected(s); setEditNotes(s.admin_notes || ""); }}
                          style={{ borderBottom:`1px solid ${BORDER}`, background: selected?.id === s.id ? "rgba(201,146,42,0.06)" : "transparent" }}>
                          <td style={{ ...sans, fontSize:"0.8rem", color:DIM, padding:"14px 16px", whiteSpace:"nowrap" }}>
                            {new Date(s.created_at).toLocaleDateString("en-GB", { day:"numeric", month:"short" })}
                          </td>
                          <td style={{ padding:"14px 16px" }}>
                            <div style={{ ...sans, fontSize:"0.86rem", fontWeight:"600", color:CREAM }}>{s.name}</div>
                            <div style={{ ...sans, fontSize:"0.75rem", color:DIM }}>{s.email}</div>
                          </td>
                          <td style={{ ...sans, fontSize:"0.84rem", color:MUTED, padding:"14px 16px" }}>{s.business}</td>
                          <td style={{ ...sans, fontSize:"0.8rem", color:MUTED, padding:"14px 16px" }}>
                            {s.budget === "starter" ? "$997" : s.budget === "business" ? "$1,997" : s.budget === "fullstack" ? "$3,500" : s.budget || "—"}
                          </td>
                          <td style={{ padding:"14px 16px" }}>
                            {(() => { const pb = paymentBadge(s.payment_status, s.payment_amount); return (
                              <span className="admin-status-pill" style={{ color:pb.color, background:`${pb.color}15`, border:`1px solid ${pb.color}30` }}>
                                <span style={{ width:6, height:6, borderRadius:"50%", background:pb.color }} />
                                {pb.label}
                              </span>
                            ); })()}
                          </td>
                          <td style={{ padding:"14px 16px" }}>
                            <span className="admin-status-pill" style={{ color:getStatusColor(s.status), background:`${getStatusColor(s.status)}15`, border:`1px solid ${getStatusColor(s.status)}30` }}>
                              <span style={{ width:6, height:6, borderRadius:"50%", background:getStatusColor(s.status) }} />
                              {getStatusLabel(s.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Detail Panel */}
            <div style={{ width:"420px", flexShrink:0, overflowY:"auto", background:BG2 }}>
              {selected ? (
                <div style={{ padding:"2rem 1.8rem" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem" }}>
                    <div>
                      <h2 style={{ ...display, fontSize:"1.5rem", fontWeight:"700", marginBottom:"0.3rem" }}>{selected.name}</h2>
                      <a href={`mailto:${selected.email}`} style={{ ...sans, fontSize:"0.84rem", color:GOLD, textDecoration:"none" }}>{selected.email}</a>
                    </div>
                    <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", color:DIM, cursor:"pointer", fontSize:"1.2rem", padding:"4px" }}>×</button>
                  </div>

                  <div style={{ marginBottom:"2rem" }}>
                    <div className="admin-detail-label">STATUS</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}>
                      {STATUS_OPTIONS.map(s => (
                        <button key={s.key} onClick={() => updateSubmission(selected.id, { status: s.key })} disabled={saving}
                          style={{ ...sans, fontSize:"0.72rem", fontWeight:"600", padding:"5px 12px", borderRadius:"100px", cursor:"pointer", border:"1px solid", transition:"all 0.2s",
                            background: selected.status === s.key ? `${s.color}20` : "transparent",
                            borderColor: selected.status === s.key ? s.color : BORDER,
                            color: selected.status === s.key ? s.color : DIM }}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Banner */}
                  {selected.payment_status === "paid" && (
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 16px", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:"4px", marginBottom:"1.5rem" }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:"#10B981" }} />
                      <div style={{ flex:1 }}>
                        <div style={{ ...sans, fontSize:"0.82rem", fontWeight:"700", color:"#10B981" }}>
                          PAID — ${((selected.payment_amount || 0) / 100).toLocaleString()} {(selected.payment_currency || "usd").toUpperCase()}
                        </div>
                        <div style={{ ...sans, fontSize:"0.72rem", color:MUTED }}>
                          {selected.plan ? planLabel(selected.plan) : ""}{selected.paid_at ? ` · ${formatDate(selected.paid_at)}` : ""}
                        </div>
                      </div>
                    </div>
                  )}
                  {selected.payment_status === "refunded" && (
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 16px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"4px", marginBottom:"1.5rem" }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:"#EF4444" }} />
                      <div style={{ ...sans, fontSize:"0.82rem", fontWeight:"700", color:"#EF4444" }}>REFUNDED</div>
                    </div>
                  )}
                  {(!selected.payment_status || selected.payment_status === "unpaid") && (
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 16px", background:"rgba(107,114,128,0.08)", border:"1px solid rgba(107,114,128,0.15)", borderRadius:"4px", marginBottom:"1.5rem" }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:"#6B7280" }} />
                      <div style={{ ...sans, fontSize:"0.82rem", fontWeight:"600", color:"#6B7280" }}>NO PAYMENT RECEIVED</div>
                    </div>
                  )}

                  {/* Subscription banner */}
                  {selected.subscription_status && (
                    <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 16px", marginBottom:"1rem", borderRadius:"4px",
                      background: selected.subscription_status === "active" ? "rgba(16,185,129,0.06)" : selected.subscription_status === "past_due" ? "rgba(245,158,11,0.06)" : "rgba(239,68,68,0.06)",
                      border: `1px solid ${selected.subscription_status === "active" ? "rgba(16,185,129,0.2)" : selected.subscription_status === "past_due" ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)"}`,
                    }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background: selected.subscription_status === "active" ? "#10B981" : selected.subscription_status === "past_due" ? "#F59E0B" : "#EF4444" }} />
                      <div style={{ flex:1 }}>
                        <span style={{ ...sans, fontSize:"0.75rem", fontWeight:"700", color: selected.subscription_status === "active" ? "#10B981" : selected.subscription_status === "past_due" ? "#F59E0B" : "#EF4444" }}>
                          SUBSCRIPTION: {selected.subscription_status.toUpperCase().replace("_", " ")}
                        </span>
                        {selected.monthly_amount ? <span style={{ ...sans, fontSize:"0.72rem", color:MUTED }}> · ${((selected.monthly_amount || 0) / 100).toLocaleString()}/mo</span> : null}
                      </div>
                      {selected.failed_payment_reason && (
                        <div style={{ ...sans, fontSize:"0.68rem", color:"#EF4444", maxWidth:"180px", textAlign:"right" }}>{selected.failed_payment_reason}</div>
                      )}
                    </div>
                  )}

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.4rem", marginBottom:"2rem" }}>
                    <div><div className="admin-detail-label">BUSINESS</div><div className="admin-detail-value">{selected.business}</div></div>
                    <div><div className="admin-detail-label">INDUSTRY</div><div className="admin-detail-value">{selected.industry || "—"}</div></div>
                    <div><div className="admin-detail-label">TEAM SIZE</div><div className="admin-detail-value">{selected.team_size || "—"}</div></div>
                    <div><div className="admin-detail-label">BUDGET</div><div className="admin-detail-value">{budgetLabel(selected.budget)}</div></div>
                    <div><div className="admin-detail-label">PLAN</div><div className="admin-detail-value">{planLabel(selected.plan)}</div></div>
                    <div><div className="admin-detail-label">STRIPE ID</div><div className="admin-detail-value" style={{ fontSize:"0.75rem", wordBreak:"break-all" }}>{selected.stripe_customer_id || "—"}</div></div>
                  </div>

                  <div style={{ marginBottom:"2rem" }}>
                    <div className="admin-detail-label">AUTOMATIONS REQUESTED</div>
                    {selected.automations?.length > 0 ? (
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem", marginTop:"0.4rem" }}>
                        {selected.automations.map((a, i) => (
                          <span key={i} style={{ ...sans, fontSize:"0.75rem", color:MUTED, padding:"4px 10px", background:GOLD_MID, border:`1px solid ${BORDER}`, borderRadius:"2px" }}>{a}</span>
                        ))}
                      </div>
                    ) : <div className="admin-detail-value">—</div>}
                  </div>

                  {selected.details && (
                    <div style={{ marginBottom:"2rem" }}>
                      <div className="admin-detail-label">ADDITIONAL DETAILS</div>
                      <div className="admin-detail-value" style={{ whiteSpace:"pre-wrap", color:MUTED, fontSize:"0.85rem", lineHeight:"1.7" }}>{selected.details}</div>
                    </div>
                  )}

                  <div style={{ marginBottom:"1.5rem" }}>
                    <div className="admin-detail-label">YOUR NOTES</div>
                    <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Add notes about this lead..." rows={4}
                      style={{ ...sans, width:"100%", background:BG, border:`1px solid ${BORDER}`, borderRadius:"2px", padding:"12px 14px", color:CREAM, fontSize:"0.85rem", outline:"none", boxSizing:"border-box", resize:"vertical", lineHeight:"1.65" }} />
                    <button onClick={() => updateSubmission(selected.id, { admin_notes: editNotes })} disabled={saving || editNotes === (selected.admin_notes || "")}
                      style={{ ...sans, marginTop:"0.6rem", padding:"8px 20px", fontSize:"0.76rem", fontWeight:"600", letterSpacing:"0.06em", border:"none", borderRadius:"2px",
                        cursor: editNotes === (selected.admin_notes || "") ? "default" : "pointer",
                        background: editNotes === (selected.admin_notes || "") ? DIM : GOLD, color: BG, transition:"all 0.2s",
                        opacity: editNotes === (selected.admin_notes || "") ? 0.4 : 1 }}>
                      {saving ? "SAVING..." : "SAVE NOTES"}
                    </button>
                  </div>

                  <div style={{ ...sans, fontSize:"0.73rem", color:DIM, paddingTop:"1rem", borderTop:`1px solid ${BORDER}` }}>
                    Submitted {formatDate(selected.created_at)}
                  </div>
                </div>
              ) : (
                <div style={{ padding:"4rem 2rem", textAlign:"center" }}>
                  <p style={{ ...display, fontSize:"1.2rem", color:MUTED, marginBottom:"0.5rem" }}>Select a lead</p>
                  <p style={{ ...sans, fontSize:"0.82rem", color:DIM }}>Click any row to view full details.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* ── PAYMENTS TAB ── */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {tab === "payments" && (
          <div className="admin-fade" style={{ padding:"2rem 5%", maxWidth:"1400px", margin:"0 auto" }}>

            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <div>
                <h2 style={{ ...display, fontSize:"1.6rem", fontWeight:"700", marginBottom:"0.3rem" }}>Payment Tracking</h2>
                <p style={{ ...sans, fontSize:"0.82rem", color:DIM }}>Stripe payments synced with your lead pipeline</p>
              </div>
              <div style={{ display:"flex", gap:"0.8rem", alignItems:"center" }}>
                <button onClick={syncPayments} disabled={syncingPayments} className="sync-btn">
                  {syncingPayments ? "SYNCING..." : "SYNC STRIPE PAYMENTS"}
                </button>
                <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer"
                  style={{ ...sans, fontSize:"0.72rem", fontWeight:"600", color:BG, background:GOLD, padding:"8px 18px", borderRadius:"2px", textDecoration:"none", letterSpacing:"0.06em" }}>
                  STRIPE DASHBOARD →
                </a>
              </div>
            </div>

            {/* Revenue KPI Cards */}
            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"2rem" }}>
              <div className="stat-card-accent">
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:GOLD, fontWeight:"600", marginBottom:"0.5rem" }}>TOTAL REVENUE</div>
                <div style={{ ...display, fontSize:"2.2rem", fontWeight:"700", color:GOLD, lineHeight:1 }}>
                  ${((paymentData?.stats.totalRevenue || 0) / 100).toLocaleString()}
                </div>
                <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.4rem" }}>from {paymentData?.stats.totalPaid || 0} payment{(paymentData?.stats.totalPaid || 0) !== 1 ? "s" : ""}</div>
              </div>
              <div className="stat-card">
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.5rem" }}>PAID</div>
                <div style={{ ...display, fontSize:"2.2rem", fontWeight:"700", color:"#10B981", lineHeight:1 }}>{paymentData?.stats.totalPaid || 0}</div>
                <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.4rem" }}>converted leads</div>
              </div>
              <div className="stat-card">
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.5rem" }}>UNPAID</div>
                <div style={{ ...display, fontSize:"2.2rem", fontWeight:"700", color:"#F59E0B", lineHeight:1 }}>{paymentData?.stats.totalUnpaid || 0}</div>
                <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.4rem" }}>pending / curious</div>
              </div>
              <div className="stat-card">
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.5rem" }}>REFUNDED</div>
                <div style={{ ...display, fontSize:"2.2rem", fontWeight:"700", color:"#EF4444", lineHeight:1 }}>{paymentData?.stats.totalRefunded || 0}</div>
                <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.4rem" }}>returned</div>
              </div>
              <div className="stat-card">
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.5rem" }}>CONVERSION</div>
                <div style={{ ...display, fontSize:"2.2rem", fontWeight:"700", color:CREAM, lineHeight:1 }}>{paymentData?.stats.conversionRate || 0}%</div>
                <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.4rem" }}>leads → paid</div>
              </div>
            </div>

            {/* Revenue by Plan */}
            {paymentData && Object.keys(paymentData.stats.planRevenue).length > 0 && (
              <div className="overview-card" style={{ marginBottom:"2rem" }}>
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"1.2rem" }}>REVENUE BY PLAN</div>
                <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
                  {Object.entries(paymentData.stats.planRevenue).map(([plan, rev]) => {
                    const count = paymentData.stats.planCounts[plan] || 0;
                    const colors: Record<string, string> = { discovery: "#F59E0B", starter: "#3B82F6", business: "#A855F7", fullstack: "#10B981" };
                    const color = colors[plan] || GOLD;
                    return (
                      <div key={plan} style={{ flex:"1", minWidth:"160px", padding:"1rem 1.2rem", background:BG3, border:`1px solid ${BORDER}`, borderRadius:"4px", borderTop:`3px solid ${color}` }}>
                        <div style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.12em", color, fontWeight:"700", marginBottom:"0.5rem" }}>{planLabel(plan).toUpperCase()}</div>
                        <div style={{ ...display, fontSize:"1.6rem", fontWeight:"700", color:CREAM, lineHeight:1 }}>${(rev / 100).toLocaleString()}</div>
                        <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.3rem" }}>{count} customer{count !== 1 ? "s" : ""}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main grid: recent charges + paid/unpaid leads */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>

              {/* Recent Stripe Charges */}
              <div className="overview-card">
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"1rem" }}>RECENT STRIPE CHARGES</div>
                {!paymentData || paymentData.recentCharges.length === 0 ? (
                  <div style={{ ...sans, fontSize:"0.84rem", color:DIM, textAlign:"center", padding:"2rem 0" }}>No charges yet.</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                    {paymentData.recentCharges.slice(0, 10).map(c => (
                      <div key={c.id} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 12px", background:BG3, borderRadius:"4px", border:`1px solid ${BORDER}` }}>
                        <div style={{ width:10, height:10, borderRadius:"50%", background: c.refunded ? "#EF4444" : c.status === "succeeded" ? "#10B981" : "#F59E0B", flexShrink:0 }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                            <div style={{ ...sans, fontSize:"0.82rem", fontWeight:"600", color:CREAM, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.name}</div>
                            <div style={{ ...sans, fontSize:"0.88rem", fontWeight:"700", color: c.refunded ? "#EF4444" : "#10B981", flexShrink:0 }}>
                              {c.refunded ? "−" : "+"}${(c.amount / 100).toLocaleString()}
                            </div>
                          </div>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <div style={{ ...sans, fontSize:"0.72rem", color:MUTED }}>{c.email}</div>
                            <div style={{ ...sans, fontSize:"0.68rem", color:DIM }}>{new Date(c.created * 1000).toLocaleDateString("en-GB", { day:"numeric", month:"short" })}</div>
                          </div>
                        </div>
                        <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
                          {c.matchedLeadId && (
                            <span style={{ ...sans, fontSize:"0.6rem", fontWeight:"600", color:GOLD, background:`${GOLD}15`, padding:"2px 8px", borderRadius:"100px", border:`1px solid ${GOLD}30` }}>MATCHED</span>
                          )}
                          {c.receiptUrl && (
                            <a href={c.receiptUrl} target="_blank" rel="noopener noreferrer" style={{ ...sans, fontSize:"0.6rem", fontWeight:"600", color:DIM, textDecoration:"none" }}>Receipt ↗</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Unpaid Leads — follow up needed */}
              <div className="overview-card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
                  <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600" }}>UNPAID LEADS — FOLLOW UP</div>
                  <span style={{ ...sans, fontSize:"0.68rem", color: (paymentData?.unpaidLeads.length || 0) > 0 ? "#F59E0B" : DIM, fontWeight:"600" }}>
                    {paymentData?.unpaidLeads.length || 0}
                  </span>
                </div>
                {!paymentData || paymentData.unpaidLeads.length === 0 ? (
                  <div style={{ ...sans, fontSize:"0.84rem", color:DIM, textAlign:"center", padding:"2rem 0" }}>All leads have paid!</div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column" }}>
                    {paymentData.unpaidLeads.slice(0, 10).map(l => (
                      <div key={l.id} className="activity-item" style={{ cursor:"pointer" }}
                        onClick={() => {
                          const lead = submissions.find(s => s.id === l.id);
                          if (lead) { setSelected(lead); setEditNotes(lead.admin_notes || ""); setTab("leads"); }
                        }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:"#F59E0B", marginTop:"6px", flexShrink:0 }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:"8px" }}>
                            <div style={{ ...sans, fontSize:"0.82rem", fontWeight:"600", color:CREAM, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.name}</div>
                            <div style={{ ...sans, fontSize:"0.68rem", color:DIM, whiteSpace:"nowrap", flexShrink:0 }}>{timeAgo(l.createdAt)}</div>
                          </div>
                          <div style={{ ...sans, fontSize:"0.75rem", color:MUTED }}>{l.business} · {l.email}</div>
                          <div style={{ display:"flex", gap:"8px", marginTop:"4px" }}>
                            <span className="admin-status-pill" style={{ color:getStatusColor(l.status), background:`${getStatusColor(l.status)}15`, border:`1px solid ${getStatusColor(l.status)}30`, fontSize:"0.58rem" }}>
                              {getStatusLabel(l.status)}
                            </span>
                            {l.budget && (
                              <span style={{ ...sans, fontSize:"0.65rem", color:DIM }}>{budgetLabel(l.budget)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Paid Leads Table */}
            {paymentData && paymentData.paidLeads.length > 0 && (
              <div className="overview-card" style={{ marginTop:"1.5rem" }}>
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"1rem" }}>PAID CUSTOMERS</div>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${BORDER}` }}>
                      {["Customer","Business","Plan","Amount","Paid On","Status"].map(h => (
                        <th key={h} style={{ ...sans, fontSize:"0.63rem", letterSpacing:"0.14em", fontWeight:"600", color:DIM, padding:"10px 12px", textAlign:"left" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paymentData.paidLeads.map(l => (
                      <tr key={l.id} className="admin-row" style={{ borderBottom:`1px solid ${BORDER}` }}
                        onClick={() => {
                          const lead = submissions.find(s => s.id === l.id);
                          if (lead) { setSelected(lead); setEditNotes(lead.admin_notes || ""); setTab("leads"); }
                        }}>
                        <td style={{ padding:"12px" }}>
                          <div style={{ ...sans, fontSize:"0.84rem", fontWeight:"600", color:CREAM }}>{l.name}</div>
                          <div style={{ ...sans, fontSize:"0.72rem", color:DIM }}>{l.email}</div>
                        </td>
                        <td style={{ ...sans, fontSize:"0.82rem", color:MUTED, padding:"12px" }}>{l.business}</td>
                        <td style={{ padding:"12px" }}>
                          <span style={{ ...sans, fontSize:"0.75rem", fontWeight:"600", color:CREAM }}>{planLabel(l.plan)}</span>
                        </td>
                        <td style={{ ...sans, fontSize:"0.88rem", fontWeight:"700", color:"#10B981", padding:"12px" }}>
                          ${(l.amount / 100).toLocaleString()}
                        </td>
                        <td style={{ ...sans, fontSize:"0.78rem", color:MUTED, padding:"12px" }}>
                          {l.paidAt ? new Date(l.paidAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) : "—"}
                        </td>
                        <td style={{ padding:"12px" }}>
                          <span className="admin-status-pill" style={{ color:getStatusColor(l.status), background:`${getStatusColor(l.status)}15`, border:`1px solid ${getStatusColor(l.status)}30` }}>
                            <span style={{ width:6, height:6, borderRadius:"50%", background:getStatusColor(l.status) }} />
                            {getStatusLabel(l.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* ── CALLS TAB ── */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {tab === "calls" && (
          <div className="admin-fade" style={{ padding:"2rem 5%", maxWidth:"1400px", margin:"0 auto" }}>

            {/* Header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <div>
                <h2 style={{ ...display, fontSize:"1.6rem", fontWeight:"700", marginBottom:"0.3rem" }}>Call Management</h2>
                <p style={{ ...sans, fontSize:"0.82rem", color:DIM }}>All Cal.com bookings synced with your lead pipeline</p>
              </div>
              <div style={{ display:"flex", gap:"0.8rem", alignItems:"center" }}>
                <button onClick={syncBookings} disabled={syncing} className="sync-btn">
                  {syncing ? "SYNCING..." : "SYNC LEAD STATUSES"}
                </button>
                <a href="https://app.cal.com/bookings" target="_blank" rel="noopener noreferrer"
                  style={{ ...sans, fontSize:"0.72rem", fontWeight:"600", color:BG, background:GOLD, padding:"8px 18px", borderRadius:"2px", textDecoration:"none", letterSpacing:"0.06em" }}>
                  MANAGE IN CAL.COM →
                </a>
              </div>
            </div>

            {/* Call Stats */}
            <div style={{ display:"flex", gap:"1rem", marginBottom:"1.5rem", flexWrap:"wrap" }}>
              <div className="stat-card" style={{ minWidth:"140px" }}>
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.4rem" }}>UPCOMING</div>
                <div style={{ ...display, fontSize:"1.8rem", fontWeight:"700", color:"#A855F7", lineHeight:1 }}>{bookingData?.stats.upcoming || 0}</div>
              </div>
              <div className="stat-card" style={{ minWidth:"140px" }}>
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.4rem" }}>COMPLETED</div>
                <div style={{ ...display, fontSize:"1.8rem", fontWeight:"700", color:"#10B981", lineHeight:1 }}>{bookingData?.stats.past || 0}</div>
              </div>
              <div className="stat-card" style={{ minWidth:"140px" }}>
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.4rem" }}>CANCELLED</div>
                <div style={{ ...display, fontSize:"1.8rem", fontWeight:"700", color:"#EF4444", lineHeight:1 }}>{bookingData?.stats.cancelled || 0}</div>
              </div>
              <div className="stat-card" style={{ minWidth:"140px" }}>
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.4rem" }}>MATCHED TO LEADS</div>
                <div style={{ ...display, fontSize:"1.8rem", fontWeight:"700", color:GOLD, lineHeight:1 }}>{bookingData?.stats.matched || 0}</div>
              </div>
              <div className="stat-card" style={{ minWidth:"140px" }}>
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.4rem" }}>NEEDS OUTREACH</div>
                <div style={{ ...display, fontSize:"1.8rem", fontWeight:"700", color: leadsWithoutBooking.length > 0 ? "#EF4444" : DIM, lineHeight:1 }}>{leadsWithoutBooking.length}</div>
              </div>
            </div>

            {/* Call Filters */}
            <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.5rem" }}>
              {(["upcoming","past","cancelled"] as const).map(f => (
                <button key={f} className={`call-filter${callFilter === f ? " active" : ""}`} onClick={() => setCallFilter(f)}>
                  {f === "upcoming" ? "Upcoming" : f === "past" ? "Completed" : "Cancelled"}
                  <span style={{ marginLeft:"4px", opacity:0.6 }}>({bookingData?.stats[f] || 0})</span>
                </button>
              ))}
            </div>

            {/* Booking Cards */}
            {!bookingData ? (
              <div style={{ ...sans, color:DIM, textAlign:"center", padding:"3rem" }}>Loading bookings...</div>
            ) : (bookingData[callFilter] || []).length === 0 ? (
              <div style={{ ...sans, color:DIM, textAlign:"center", padding:"3rem" }}>
                No {callFilter} calls.
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem" }}>
                {(bookingData[callFilter] || []).map(b => (
                  <div key={b.id} className={`booking-card${b.matchedLeadId ? " matched" : ""}`}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"16px" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"0.5rem" }}>
                          <div style={{ ...sans, fontSize:"1rem", fontWeight:"700", color:CREAM }}>{b.attendeeName}</div>
                          {b.matchedLeadId && (
                            <span className="admin-status-pill" style={{ color:GOLD, background:`${GOLD}15`, border:`1px solid ${GOLD}30`, fontSize:"0.6rem" }}>
                              MATCHED LEAD
                            </span>
                          )}
                          {b.matchedLeadStatus && (
                            <span className="admin-status-pill" style={{ color:getStatusColor(b.matchedLeadStatus), background:`${getStatusColor(b.matchedLeadStatus)}15`, border:`1px solid ${getStatusColor(b.matchedLeadStatus)}30`, fontSize:"0.6rem" }}>
                              {getStatusLabel(b.matchedLeadStatus)}
                            </span>
                          )}
                          {b.status === "CANCELLED" && (
                            <span className="admin-status-pill" style={{ color:"#EF4444", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", fontSize:"0.6rem" }}>
                              CANCELLED
                            </span>
                          )}
                        </div>
                        <div style={{ ...sans, fontSize:"0.82rem", color:MUTED, marginBottom:"0.3rem" }}>
                          <a href={`mailto:${b.attendeeEmail}`} style={{ color:MUTED, textDecoration:"none" }}>{b.attendeeEmail}</a>
                        </div>
                        <div style={{ display:"flex", gap:"1.5rem", marginTop:"0.6rem" }}>
                          <div>
                            <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.14em", color:DIM, fontWeight:"600" }}>
                              {callFilter === "upcoming" ? "SCHEDULED" : callFilter === "past" ? "COMPLETED" : "WAS SCHEDULED"}
                            </div>
                            <div style={{ ...sans, fontSize:"0.84rem", color:CREAM, marginTop:"2px" }}>{formatCallTime(b.startTime)}</div>
                          </div>
                          <div>
                            <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.14em", color:DIM, fontWeight:"600" }}>DURATION</div>
                            <div style={{ ...sans, fontSize:"0.84rem", color:CREAM, marginTop:"2px" }}>15 min</div>
                          </div>
                          <div>
                            <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.14em", color:DIM, fontWeight:"600" }}>BOOKED</div>
                            <div style={{ ...sans, fontSize:"0.84rem", color:CREAM, marginTop:"2px" }}>{timeAgo(b.createdAt)}</div>
                          </div>
                        </div>
                        {b.cancellationReason && (
                          <div style={{ ...sans, fontSize:"0.78rem", color:"#EF4444", marginTop:"0.6rem", padding:"6px 10px", background:"rgba(239,68,68,0.05)", borderRadius:"2px", border:"1px solid rgba(239,68,68,0.1)" }}>
                            Reason: {b.cancellationReason}
                          </div>
                        )}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:"6px", flexShrink:0 }}>
                        {callFilter === "upcoming" && b.videoUrl && (
                          <a href={b.videoUrl} target="_blank" rel="noopener noreferrer" className="action-btn" style={{ background:"#A855F7", color:"#fff" }}>
                            JOIN CALL
                          </a>
                        )}
                        {b.matchedLeadId && (
                          <button className="action-btn" style={{ background:GOLD_MID, color:GOLD, border:`1px solid ${BORDER}` }}
                            onClick={() => {
                              const lead = submissions.find(s => s.id === b.matchedLeadId);
                              if (lead) { setSelected(lead); setEditNotes(lead.admin_notes || ""); setTab("leads"); }
                            }}>
                            VIEW LEAD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* ── CALENDAR TAB ── */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {tab === "calendar" && (
          <div className="admin-fade" style={{ padding:"2rem 5%", maxWidth:"1400px", margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
              <div>
                <h2 style={{ ...display, fontSize:"1.6rem", fontWeight:"700", marginBottom:"0.3rem" }}>Booking Calendar</h2>
                <p style={{ ...sans, fontSize:"0.82rem", color:DIM }}>Cal.com — 15-minute discovery calls · Book directly or share the link</p>
              </div>
              <a href="https://app.cal.com/bookings" target="_blank" rel="noopener noreferrer"
                style={{ ...sans, fontSize:"0.72rem", fontWeight:"600", color:BG, background:GOLD, padding:"8px 18px", borderRadius:"2px", textDecoration:"none", letterSpacing:"0.06em" }}>
                MANAGE IN CAL.COM →
              </a>
            </div>
            <div style={{ background:BG2, border:`1px solid ${BORDER}`, borderRadius:"4px", overflow:"hidden" }}>
              <div id="cal-embed-container" />
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* ── AGENTS TAB ── */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {tab === "agents" && (
          <div className="admin-fade" style={{ padding:"2rem 5%", maxWidth:"1400px", margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem" }}>
              <div>
                <h2 style={{ ...display, fontSize:"1.6rem", fontWeight:"700", marginBottom:"0.3rem" }}>Agent Control Center</h2>
                <p style={{ ...sans, fontSize:"0.82rem", color:DIM }}>Deploy, manage, and monitor OpenClaw AI agents for your clients</p>
              </div>
              <button onClick={fetchAgents} style={{ ...sans, fontSize:"0.7rem", fontWeight:"600", color:GOLD, background:GOLD_MID, border:`1px solid ${GOLD_BORDER}`, borderRadius:"6px", padding:"8px 16px", cursor:"pointer" }}>
                {agentsLoading ? "Loading..." : "↻ Refresh"}
              </button>
            </div>

            {/* ── Agent Stats Row ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:"1rem", marginBottom:"2.5rem" }}>
              {[
                { label: "Total Agents", value: agents.length, color: CREAM },
                { label: "Active", value: agents.filter(a => a.status === "active").length, color: "#22C55E" },
                { label: "Configured", value: agents.filter(a => a.status === "configured").length, color: "#F59E0B" },
                { label: "Paused", value: agents.filter(a => a.status === "paused").length, color: "#6B7280" },
                { label: "Ready to Deploy", value: submissions.filter(s => s.payment_status === "paid" && !agents.find(a => a.submission_id === s.id)).length, color: "#3B82F6" },
              ].map((stat, i) => (
                <div key={i} className="overview-card" style={{ textAlign:"center" }}>
                  <div style={{ ...display, fontSize:"2rem", fontWeight:"700", color:stat.color }}>{stat.value}</div>
                  <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.15em", color:DIM, marginTop:"4px" }}>{stat.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* ── Ready to Deploy: Paid leads without agents ── */}
            {(() => {
              const readyLeads = submissions.filter(s =>
                (s.payment_status === "paid" || s.status === "onboarded" || s.status === "call_booked") &&
                !agents.find(a => a.submission_id === s.id)
              );
              if (readyLeads.length === 0) return null;
              return (
                <div style={{ marginBottom:"2.5rem" }}>
                  <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"1rem" }}>READY TO DEPLOY — GENERATE AGENT CONFIG</div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:"1rem" }}>
                    {readyLeads.map(s => (
                      <div key={s.id} className="overview-card" style={{ borderLeft:`3px solid ${s.payment_status === "paid" ? "#22C55E" : "#3B82F6"}`, cursor:"pointer", transition:"transform 0.2s" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.8rem" }}>
                          <div>
                            <div style={{ ...sans, fontSize:"0.9rem", fontWeight:"700", color:CREAM }}>{s.business}</div>
                            <div style={{ ...sans, fontSize:"0.72rem", color:MUTED }}>{s.name} · {s.email}</div>
                          </div>
                          <div style={{ display:"flex", gap:"6px" }}>
                            {s.payment_status === "paid" && (
                              <span style={{ ...sans, fontSize:"0.55rem", fontWeight:"700", color:"#22C55E", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", padding:"2px 8px", borderRadius:"100px" }}>PAID</span>
                            )}
                            <span style={{ ...sans, fontSize:"0.55rem", fontWeight:"700", color:getStatusColor(s.status), background:`${getStatusColor(s.status)}15`, border:`1px solid ${getStatusColor(s.status)}30`, padding:"2px 8px", borderRadius:"100px" }}>{getStatusLabel(s.status)}</span>
                          </div>
                        </div>
                        <div style={{ ...sans, fontSize:"0.72rem", color:DIM, marginBottom:"0.8rem" }}>
                          {s.industry && <span>Industry: {s.industry} · </span>}
                          {s.budget && <span>Plan: {budgetLabel(s.budget)} · </span>}
                          {s.automations && s.automations.length > 0 && <span>{s.automations.length} automations requested</span>}
                        </div>
                        <button
                          onClick={() => generateConfig(s.id)}
                          disabled={generatingFor === s.id}
                          style={{ ...sans, fontSize:"0.72rem", fontWeight:"700", color:"#080704", background:GOLD, border:"none", borderRadius:"8px", padding:"10px 20px", cursor:"pointer", width:"100%", transition:"opacity 0.2s" }}
                        >
                          {generatingFor === s.id ? "⚙️ Generating..." : "🤖 Generate Agent Config"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── Generated Config Preview Modal ── */}
            {generatedConfig && (
              <div style={{ marginBottom:"2.5rem", background:BG2, border:`1px solid ${GOLD_BORDER}`, borderRadius:"12px", padding:"2rem", position:"relative" }}>
                <button onClick={() => setGeneratedConfig(null)} style={{ position:"absolute", top:"1rem", right:"1rem", background:"none", border:"none", color:MUTED, cursor:"pointer", fontSize:"1.2rem" }}>✕</button>

                <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"1.5rem" }}>
                  <div style={{ width:"48px", height:"48px", borderRadius:"12px", background:GOLD_MID, border:`1px solid ${GOLD_BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem" }}>
                    {generatedConfig.businessTypeMeta?.icon || "🤖"}
                  </div>
                  <div>
                    <h3 style={{ ...display, fontSize:"1.3rem", fontWeight:"700", marginBottom:"2px" }}>{generatedConfig.agentName}</h3>
                    <div style={{ ...sans, fontSize:"0.72rem", color:MUTED }}>
                      {generatedConfig.businessTypeMeta?.label} · <span style={{ color:PLAN_COLORS[generatedConfig.plan] || GOLD }}>{PLAN_NAMES[generatedConfig.plan] || generatedConfig.plan}</span> · {generatedConfig.planMeta?.price}
                    </div>
                  </div>
                </div>

                {/* Workspace Files */}
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.8rem" }}>GENERATED WORKSPACE FILES</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:"8px", marginBottom:"1.5rem" }}>
                  {Object.keys(generatedConfig.files).map(fname => (
                    <button
                      key={fname}
                      onClick={() => setViewingFile(viewingFile === fname ? null : fname)}
                      style={{ ...sans, fontSize:"0.72rem", fontWeight:"600", color: viewingFile === fname ? "#080704" : CREAM, background: viewingFile === fname ? GOLD : BG3, border:`1px solid ${viewingFile === fname ? GOLD : BORDER}`, borderRadius:"8px", padding:"10px 12px", cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}
                    >
                      📄 {fname}
                    </button>
                  ))}
                </div>

                {/* File Preview */}
                {viewingFile && generatedConfig.files[viewingFile] && (
                  <div style={{ marginBottom:"1.5rem", position:"relative" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"6px" }}>
                      <span style={{ ...sans, fontSize:"0.7rem", fontWeight:"700", color:GOLD }}>{viewingFile}</span>
                      <button
                        onClick={() => { navigator.clipboard.writeText(generatedConfig.files[viewingFile]); }}
                        style={{ ...sans, fontSize:"0.6rem", color:MUTED, background:BG3, border:`1px solid ${BORDER}`, borderRadius:"4px", padding:"4px 10px", cursor:"pointer" }}
                      >
                        📋 Copy
                      </button>
                    </div>
                    <pre style={{ ...sans, fontSize:"0.68rem", color:CREAM, background:"#050403", border:`1px solid ${BORDER}`, borderRadius:"8px", padding:"1rem", maxHeight:"400px", overflow:"auto", whiteSpace:"pre-wrap", lineHeight:"1.6" }}>
                      {generatedConfig.files[viewingFile]}
                    </pre>
                  </div>
                )}

                {/* Tools Required */}
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.8rem" }}>REQUIRED TOOLS ({generatedConfig.tools.required.length})</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:"8px", marginBottom:"1.5rem" }}>
                  {generatedConfig.tools.required.map((tool: { id: string; icon: string; name: string; requiresClientKey: boolean; description: string; configNotes?: string }) => (
                    <div key={tool.id} style={{ ...sans, fontSize:"0.72rem", color:CREAM, background:BG3, border:`1px solid ${BORDER}`, borderRadius:"8px", padding:"10px 14px", display:"flex", gap:"10px", alignItems:"flex-start" }}>
                      <span style={{ fontSize:"1.1rem" }}>{tool.icon}</span>
                      <div>
                        <div style={{ fontWeight:"700", marginBottom:"2px" }}>{tool.name}
                          {tool.requiresClientKey && <span style={{ fontSize:"0.55rem", color:"#F59E0B", marginLeft:"6px", background:"rgba(245,158,11,0.1)", padding:"1px 6px", borderRadius:"100px" }}>CLIENT KEY NEEDED</span>}
                        </div>
                        <div style={{ fontSize:"0.65rem", color:DIM }}>{tool.description.substring(0, 80)}...</div>
                        {tool.configNotes && <div style={{ fontSize:"0.6rem", color:MUTED, fontStyle:"italic", marginTop:"3px" }}>{tool.configNotes}</div>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Optional Tools */}
                {generatedConfig.tools.optional.length > 0 && (
                  <>
                    <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.8rem" }}>OPTIONAL TOOLS ({generatedConfig.tools.optional.length})</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:"8px", marginBottom:"1.5rem" }}>
                      {generatedConfig.tools.optional.map((tool: { id: string; icon: string; name: string; requiresClientKey: boolean; description: string }) => (
                        <div key={tool.id} style={{ ...sans, fontSize:"0.72rem", color:MUTED, background:BG3, border:`1px solid ${BORDER}`, borderRadius:"8px", padding:"10px 14px", display:"flex", gap:"10px", alignItems:"flex-start", opacity:0.7 }}>
                          <span style={{ fontSize:"1.1rem" }}>{tool.icon}</span>
                          <div>
                            <div style={{ fontWeight:"600", color:CREAM }}>{tool.name}
                              {tool.requiresClientKey && <span style={{ fontSize:"0.55rem", color:"#F59E0B", marginLeft:"6px", background:"rgba(245,158,11,0.1)", padding:"1px 6px", borderRadius:"100px" }}>CLIENT KEY</span>}
                            </div>
                            <div style={{ fontSize:"0.65rem", color:DIM }}>{tool.description.substring(0, 80)}...</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Deploy Command */}
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.8rem" }}>DEPLOY COMMAND</div>
                <div style={{ position:"relative", marginBottom:"1.5rem" }}>
                  <pre style={{ ...sans, fontSize:"0.72rem", color:"#22C55E", background:"#050403", border:`1px solid ${BORDER}`, borderRadius:"8px", padding:"1rem", overflow:"auto" }}>
                    $ {generatedConfig.deployCommand}
                  </pre>
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedConfig.deployCommand)}
                    style={{ position:"absolute", top:"8px", right:"8px", ...sans, fontSize:"0.6rem", color:MUTED, background:BG3, border:`1px solid ${BORDER}`, borderRadius:"4px", padding:"4px 10px", cursor:"pointer" }}
                  >
                    📋
                  </button>
                </div>

                {/* Env Vars Needed */}
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.8rem" }}>ENVIRONMENT VARIABLES NEEDED</div>
                <div style={{ background:"#050403", border:`1px solid ${BORDER}`, borderRadius:"8px", padding:"1rem", marginBottom:"1.5rem", position:"relative" }}>
                  <button
                    onClick={() => {
                      const envStr = [
                        "# Required",
                        ...Object.entries(generatedConfig.envVars.required).map(([k, v]) => `${k}= ${v}`),
                        "", "# Optional",
                        ...Object.entries(generatedConfig.envVars.optional).map(([k, v]) => `${k}= ${v}`),
                      ].join("\n");
                      navigator.clipboard.writeText(envStr);
                    }}
                    style={{ position:"absolute", top:"8px", right:"8px", ...sans, fontSize:"0.6rem", color:MUTED, background:BG3, border:`1px solid ${BORDER}`, borderRadius:"4px", padding:"4px 10px", cursor:"pointer" }}
                  >
                    📋 Copy All
                  </button>
                  {Object.entries(generatedConfig.envVars.required).map(([key, comment]) => (
                    <div key={key} style={{ ...sans, fontSize:"0.68rem", marginBottom:"3px" }}>
                      <span style={{ color:"#F59E0B" }}>{key}</span><span style={{ color:DIM }}>=</span> <span style={{ color:DIM, fontSize:"0.6rem" }}>{String(comment)}</span>
                    </div>
                  ))}
                  {Object.keys(generatedConfig.envVars.optional).length > 0 && (
                    <>
                      <div style={{ ...sans, fontSize:"0.6rem", color:DIM, margin:"8px 0 4px", borderTop:`1px solid ${BORDER}`, paddingTop:"8px" }}>Optional:</div>
                      {Object.entries(generatedConfig.envVars.optional).map(([key, comment]) => (
                        <div key={key} style={{ ...sans, fontSize:"0.68rem", marginBottom:"3px", opacity:0.6 }}>
                          <span style={{ color:"#6B7280" }}>{key}</span><span style={{ color:DIM }}>=</span> <span style={{ color:DIM, fontSize:"0.6rem" }}>{String(comment)}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Save & Deploy Buttons */}
                <div style={{ display:"flex", gap:"1rem" }}>
                  <button
                    onClick={saveAgent}
                    disabled={savingAgent}
                    style={{ ...sans, fontSize:"0.78rem", fontWeight:"700", color:"#080704", background:GOLD, border:"none", borderRadius:"8px", padding:"14px 32px", cursor:"pointer", flex:1, transition:"opacity 0.2s" }}
                  >
                    {savingAgent ? "Saving..." : "💾 Save Agent Configuration"}
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(generatedConfig.deployCommand); }}
                    style={{ ...sans, fontSize:"0.78rem", fontWeight:"700", color:CREAM, background:"transparent", border:`1px solid ${GOLD_BORDER}`, borderRadius:"8px", padding:"14px 32px", cursor:"pointer" }}
                  >
                    📋 Copy Deploy Command
                  </button>
                </div>
              </div>
            )}

            {/* ── Deployed Agents List ── */}
            {agents.length > 0 && (
              <div style={{ marginBottom:"2.5rem" }}>
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"1rem" }}>DEPLOYED AGENTS</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(380px, 1fr))", gap:"1rem" }}>
                  {agents.map(agent => {
                    const si = STATUS_ICONS[agent.status] || STATUS_ICONS.configured;
                    const matched = submissions.find(s => s.id === agent.submission_id);
                    return (
                      <div key={agent.id} className="overview-card" style={{ borderLeft:`3px solid ${si.color}`, cursor:"pointer", transition:"transform 0.2s, border-color 0.2s" }} onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.6rem" }}>
                          <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                            <div style={{ width:"40px", height:"40px", borderRadius:"10px", background:GOLD_MID, border:`1px solid ${GOLD_BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem" }}>🤖</div>
                            <div>
                              <div style={{ ...sans, fontSize:"0.9rem", fontWeight:"700", color:CREAM }}>{agent.agent_name}</div>
                              <div style={{ ...sans, fontSize:"0.65rem", color:MUTED }}>{agent.slug}</div>
                            </div>
                          </div>
                          <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
                            <span style={{ ...sans, fontSize:"0.55rem", fontWeight:"700", color:PLAN_COLORS[agent.plan] || MUTED, background:`${PLAN_COLORS[agent.plan] || MUTED}15`, border:`1px solid ${PLAN_COLORS[agent.plan] || MUTED}30`, padding:"2px 8px", borderRadius:"100px" }}>
                              {PLAN_NAMES[agent.plan] || agent.plan}
                            </span>
                            <span style={{ ...sans, fontSize:"0.55rem", fontWeight:"700", color:si.color, background:`${si.color}15`, border:`1px solid ${si.color}30`, padding:"2px 8px", borderRadius:"100px" }}>
                              {si.icon} {si.label}
                            </span>
                          </div>
                        </div>

                        <div style={{ ...sans, fontSize:"0.72rem", color:DIM, marginBottom:"0.8rem" }}>
                          Type: {agent.business_type} · Heartbeat: {agent.heartbeat_interval || "24h"} · Tools: {agent.tools_enabled?.length || 0} active
                          {agent.nemoclaw_enabled && <span style={{ color:"#14B8A6", marginLeft:"8px" }}>🛡️ NemoClaw</span>}
                        </div>

                        {matched && (
                          <div style={{ ...sans, fontSize:"0.65rem", color:MUTED, marginBottom:"0.6rem" }}>
                            Client: {matched.name} · {matched.email} · {matched.business}
                          </div>
                        )}

                        {/* Toggle + Actions */}
                        <div style={{ display:"flex", gap:"8px", marginTop:"0.4rem" }} onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => toggleAgent(agent.id, agent.status)}
                            disabled={togglingAgent === agent.id}
                            style={{ ...sans, fontSize:"0.65rem", fontWeight:"700", color: agent.status === "active" ? "#EF4444" : "#22C55E", background: agent.status === "active" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", border:`1px solid ${agent.status === "active" ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`, borderRadius:"6px", padding:"6px 14px", cursor:"pointer", flex:1 }}
                          >
                            {togglingAgent === agent.id ? "..." : agent.status === "active" ? "⏸ Pause Agent" : "▶ Activate Agent"}
                          </button>
                          <button
                            onClick={() => { navigator.clipboard.writeText(`./onboard.sh --name "${matched?.business || agent.agent_name}" --type ${agent.business_type} --plan ${agent.plan} --owner "${matched?.name || ""}" --email "${matched?.email || ""}"`); }}
                            style={{ ...sans, fontSize:"0.65rem", fontWeight:"600", color:MUTED, background:BG3, border:`1px solid ${BORDER}`, borderRadius:"6px", padding:"6px 14px", cursor:"pointer" }}
                          >
                            📋 CMD
                          </button>
                          <button
                            onClick={() => deleteAgent(agent.id)}
                            style={{ ...sans, fontSize:"0.65rem", fontWeight:"600", color:"#EF4444", background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.15)", borderRadius:"6px", padding:"6px 10px", cursor:"pointer" }}
                          >
                            🗑
                          </button>
                        </div>

                        {/* Expanded Details */}
                        {selectedAgent?.id === agent.id && agent.workspace_files && Object.keys(agent.workspace_files).length > 0 && (
                          <div style={{ marginTop:"1rem", paddingTop:"1rem", borderTop:`1px solid ${BORDER}` }}>
                            <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.15em", color:DIM, fontWeight:"600", marginBottom:"0.6rem" }}>WORKSPACE FILES</div>
                            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"0.8rem" }}>
                              {Object.keys(agent.workspace_files).map(f => (
                                <button
                                  key={f}
                                  onClick={(e) => { e.stopPropagation(); setViewingFile(viewingFile === `${agent.id}-${f}` ? null : `${agent.id}-${f}`); }}
                                  style={{ ...sans, fontSize:"0.62rem", fontWeight:"600", color: viewingFile === `${agent.id}-${f}` ? "#080704" : CREAM, background: viewingFile === `${agent.id}-${f}` ? GOLD : BG3, border:`1px solid ${viewingFile === `${agent.id}-${f}` ? GOLD : BORDER}`, borderRadius:"6px", padding:"4px 10px", cursor:"pointer" }}
                                >
                                  {f}
                                </button>
                              ))}
                            </div>
                            {viewingFile?.startsWith(`${agent.id}-`) && (
                              <pre style={{ ...sans, fontSize:"0.65rem", color:CREAM, background:"#050403", border:`1px solid ${BORDER}`, borderRadius:"6px", padding:"0.8rem", maxHeight:"300px", overflow:"auto", whiteSpace:"pre-wrap", lineHeight:"1.5" }}>
                                {agent.workspace_files[viewingFile.replace(`${agent.id}-`, "")]}
                              </pre>
                            )}
                            <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.15em", color:DIM, fontWeight:"600", margin:"0.8rem 0 0.4rem" }}>ENABLED TOOLS</div>
                            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                              {(agent.tools_enabled || []).map((tid: string) => (
                                <span key={tid} style={{ ...sans, fontSize:"0.6rem", color:GOLD, background:GOLD_MID, border:`1px solid ${GOLD_BORDER}`, borderRadius:"100px", padding:"3px 10px" }}>{tid}</span>
                              ))}
                              {(!agent.tools_enabled || agent.tools_enabled.length === 0) && (
                                <span style={{ ...sans, fontSize:"0.62rem", color:DIM }}>No tools configured yet</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Empty State ── */}
            {agents.length === 0 && !agentsLoading && !generatedConfig && submissions.filter(s => s.payment_status === "paid" && !agents.find(a => a.submission_id === s.id)).length === 0 && (
              <div style={{ textAlign:"center", padding:"4rem 2rem" }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🤖</div>
                <h3 style={{ ...display, fontSize:"1.3rem", fontWeight:"700", marginBottom:"0.5rem" }}>No Agents Yet</h3>
                <p style={{ ...sans, fontSize:"0.82rem", color:DIM, maxWidth:"400px", margin:"0 auto" }}>
                  When clients sign up and pay, their intake data will appear here. Click &ldquo;Generate Agent Config&rdquo; to create their full OpenClaw workspace files automatically.
                </p>
              </div>
            )}

            {/* ── Tool Registry Reference ── */}
            <div style={{ marginTop:"2rem", paddingTop:"2rem", borderTop:`1px solid ${BORDER}` }}>
              <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"1rem" }}>FULL TOOL REGISTRY — BY PLAN</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem" }}>
                {(["starter", "business", "fullstack"] as const).map(plan => (
                  <div key={plan} style={{ background:BG3, border:`1px solid ${BORDER}`, borderRadius:"10px", padding:"1.2rem", borderTop:`3px solid ${PLAN_COLORS[plan]}` }}>
                    <div style={{ ...sans, fontSize:"0.78rem", fontWeight:"700", color:PLAN_COLORS[plan], marginBottom:"0.2rem" }}>{PLAN_NAMES[plan]}</div>
                    <div style={{ ...sans, fontSize:"0.6rem", color:DIM, marginBottom:"1rem" }}>
                      {plan === "starter" ? "$149/mo · 1 channel · 24h heartbeat" : plan === "business" ? "$349/mo · 3 channels · 6h heartbeat" : "$699/mo · All channels · 30m heartbeat · Sub-agents · NemoClaw"}
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:"4px" }}>
                      {[
                        ...(plan === "starter" ? ["whatsapp OR telegram", "n8n", "resend", "supabase", "cal.com", "anthropic", "localclaw alerts"] : []),
                        ...(plan === "business" ? ["whatsapp", "telegram", "instagram", "n8n", "resend", "supabase", "cal.com", "stripe", "postiz", "nanobana", "anthropic", "openai fallback", "localclaw alerts"] : []),
                        ...(plan === "fullstack" ? ["whatsapp", "telegram", "instagram", "gmail", "discord", "slack", "n8n", "resend", "supabase", "cal.com", "stripe", "postiz", "nanobana", "google business", "nemoclaw", "sentry", "anthropic", "openai", "tavily", "localclaw alerts"] : []),
                      ].map((tool, i) => (
                        <div key={i} style={{ ...sans, fontSize:"0.62rem", color:CREAM, padding:"3px 0", display:"flex", alignItems:"center", gap:"6px" }}>
                          <span style={{ color:"#22C55E", fontSize:"0.5rem" }}>●</span> {tool}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* ── SETTINGS TAB ── */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {tab === "settings" && (
          <div className="admin-fade" style={{ padding:"2rem 5%", maxWidth:"1100px", margin:"0 auto" }}>
            <div style={{ marginBottom:"2rem" }}>
              <h2 style={{ ...display, fontSize:"1.6rem", fontWeight:"700", marginBottom:"0.3rem" }}>Settings & Integrations</h2>
              <p style={{ ...sans, fontSize:"0.82rem", color:DIM }}>Manage all connected services and configuration</p>
            </div>

            {/* Integration Status Cards */}
            <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"1rem" }}>CONNECTED SERVICES</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"2.5rem" }}>

              {/* Supabase */}
              <div className="overview-card" style={{ borderLeft:"3px solid #3ECF8E" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"0.6rem" }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:"#3ECF8E" }} />
                      <span style={{ ...sans, fontSize:"0.82rem", fontWeight:"700", color:CREAM }}>Supabase</span>
                      <span style={{ ...sans, fontSize:"0.6rem", fontWeight:"600", color:"#3ECF8E", background:"rgba(62,207,142,0.1)", padding:"2px 8px", borderRadius:"100px" }}>CONNECTED</span>
                    </div>
                    <div style={{ ...sans, fontSize:"0.78rem", color:MUTED, marginBottom:"0.8rem" }}>Database · Lead storage · Payment tracking · Event log</div>
                    <div style={{ display:"flex", gap:"1.2rem" }}>
                      <div><div style={{ ...sans, fontSize:"1.1rem", fontWeight:"700", color:CREAM }}>{submissions.length}</div><div style={{ ...sans, fontSize:"0.62rem", color:DIM }}>Total leads</div></div>
                      <div><div style={{ ...sans, fontSize:"1.1rem", fontWeight:"700", color:CREAM }}>{eventsData?.events.length || 0}</div><div style={{ ...sans, fontSize:"0.62rem", color:DIM }}>Events logged</div></div>
                    </div>
                  </div>
                  <a href="https://supabase.com/dashboard/project/dfuwkysnaveauodclqdm" target="_blank" rel="noopener noreferrer"
                    style={{ ...sans, fontSize:"0.68rem", fontWeight:"600", color:DIM, textDecoration:"none", padding:"6px 12px", border:`1px solid ${BORDER}`, borderRadius:"2px" }}>
                    Open →
                  </a>
                </div>
              </div>

              {/* Stripe */}
              <div className="overview-card" style={{ borderLeft:"3px solid #635BFF" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"0.6rem" }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:"#635BFF" }} />
                      <span style={{ ...sans, fontSize:"0.82rem", fontWeight:"700", color:CREAM }}>Stripe</span>
                      <span style={{ ...sans, fontSize:"0.6rem", fontWeight:"600", color:"#635BFF", background:"rgba(99,91,255,0.1)", padding:"2px 8px", borderRadius:"100px" }}>CONNECTED</span>
                    </div>
                    <div style={{ ...sans, fontSize:"0.78rem", color:MUTED, marginBottom:"0.8rem" }}>Payments · Subscriptions · Webhooks · Revenue tracking</div>
                    <div style={{ display:"flex", gap:"1.2rem" }}>
                      <div><div style={{ ...sans, fontSize:"1.1rem", fontWeight:"700", color:"#10B981" }}>${stats.stripeRevenue.toLocaleString()}</div><div style={{ ...sans, fontSize:"0.62rem", color:DIM }}>Revenue</div></div>
                      <div><div style={{ ...sans, fontSize:"1.1rem", fontWeight:"700", color:CREAM }}>{stats.activeSubs}</div><div style={{ ...sans, fontSize:"0.62rem", color:DIM }}>Active subs</div></div>
                      <div><div style={{ ...sans, fontSize:"1.1rem", fontWeight:"700", color:"#F59E0B" }}>{stats.pastDueSubs}</div><div style={{ ...sans, fontSize:"0.62rem", color:DIM }}>Past due</div></div>
                    </div>
                  </div>
                  <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer"
                    style={{ ...sans, fontSize:"0.68rem", fontWeight:"600", color:DIM, textDecoration:"none", padding:"6px 12px", border:`1px solid ${BORDER}`, borderRadius:"2px" }}>
                    Open →
                  </a>
                </div>
              </div>

              {/* Cal.com */}
              <div className="overview-card" style={{ borderLeft:"3px solid #F97316" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"0.6rem" }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:"#F97316" }} />
                      <span style={{ ...sans, fontSize:"0.82rem", fontWeight:"700", color:CREAM }}>Cal.com</span>
                      <span style={{ ...sans, fontSize:"0.6rem", fontWeight:"600", color:"#F97316", background:"rgba(249,115,22,0.1)", padding:"2px 8px", borderRadius:"100px" }}>CONNECTED</span>
                    </div>
                    <div style={{ ...sans, fontSize:"0.78rem", color:MUTED, marginBottom:"0.8rem" }}>Booking · Discovery calls · Calendar embed · Auto-sync</div>
                    <div style={{ display:"flex", gap:"1.2rem" }}>
                      <div><div style={{ ...sans, fontSize:"1.1rem", fontWeight:"700", color:"#A855F7" }}>{bookingData?.stats.upcoming || 0}</div><div style={{ ...sans, fontSize:"0.62rem", color:DIM }}>Upcoming</div></div>
                      <div><div style={{ ...sans, fontSize:"1.1rem", fontWeight:"700", color:CREAM }}>{bookingData?.stats.past || 0}</div><div style={{ ...sans, fontSize:"0.62rem", color:DIM }}>Completed</div></div>
                      <div><div style={{ ...sans, fontSize:"1.1rem", fontWeight:"700", color:CREAM }}>{bookingData?.stats.matched || 0}</div><div style={{ ...sans, fontSize:"0.62rem", color:DIM }}>Matched</div></div>
                    </div>
                  </div>
                  <a href="https://app.cal.com/settings" target="_blank" rel="noopener noreferrer"
                    style={{ ...sans, fontSize:"0.68rem", fontWeight:"600", color:DIM, textDecoration:"none", padding:"6px 12px", border:`1px solid ${BORDER}`, borderRadius:"2px" }}>
                    Open →
                  </a>
                </div>
              </div>

              {/* Resend */}
              <div className="overview-card" style={{ borderLeft:"3px solid #00D4AA" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"0.6rem" }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:"#00D4AA" }} />
                      <span style={{ ...sans, fontSize:"0.82rem", fontWeight:"700", color:CREAM }}>Resend</span>
                      <span style={{ ...sans, fontSize:"0.6rem", fontWeight:"600", color:"#00D4AA", background:"rgba(0,212,170,0.1)", padding:"2px 8px", borderRadius:"100px" }}>CONNECTED</span>
                    </div>
                    <div style={{ ...sans, fontSize:"0.78rem", color:MUTED, marginBottom:"0.8rem" }}>Email alerts · Lead notifications · Payment alerts · Failure warnings</div>
                    <div style={{ display:"flex", gap:"1.2rem" }}>
                      <div><div style={{ ...sans, fontSize:"0.78rem", color:CREAM }}>alerts@mail.localclawagents.com</div><div style={{ ...sans, fontSize:"0.62rem", color:DIM }}>Sending from</div></div>
                    </div>
                  </div>
                  <a href="https://resend.com/emails" target="_blank" rel="noopener noreferrer"
                    style={{ ...sans, fontSize:"0.68rem", fontWeight:"600", color:DIM, textDecoration:"none", padding:"6px 12px", border:`1px solid ${BORDER}`, borderRadius:"2px" }}>
                    Open →
                  </a>
                </div>
              </div>
            </div>

            {/* Webhook & Data Flow */}
            <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"1rem" }}>DATA FLOW</div>
            <div className="overview-card" style={{ marginBottom:"2.5rem" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {[
                  { from: "Website", arrow: "→", to: "Intake Form", desc: "Visitor fills out form with business details", color: GOLD },
                  { from: "Intake Form", arrow: "→", to: "Supabase", desc: "Lead saved to database + email alert sent via Resend", color: "#3ECF8E" },
                  { from: "Intake Form", arrow: "→", to: "Stripe Checkout", desc: "Redirect to payment after form submission", color: "#635BFF" },
                  { from: "Stripe", arrow: "→", to: "Webhook → Supabase", desc: "Payment confirmed → lead updated → email alert sent", color: "#635BFF" },
                  { from: "Cal.com", arrow: "→", to: "Supabase (sync)", desc: "Bookings matched to leads by email → status auto-updated", color: "#F97316" },
                  { from: "All Systems", arrow: "→", to: "Admin Dashboard", desc: "Real-time view of leads, payments, calls, subscriptions", color: CREAM },
                ].map((step, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 14px", background: i % 2 === 0 ? BG3 : "transparent", borderRadius:"4px" }}>
                    <span style={{ ...sans, fontSize:"0.78rem", fontWeight:"700", color: step.color, minWidth:"130px" }}>{step.from}</span>
                    <span style={{ ...sans, fontSize:"0.72rem", color:DIM }}>{step.arrow}</span>
                    <span style={{ ...sans, fontSize:"0.78rem", fontWeight:"600", color:CREAM, minWidth:"150px" }}>{step.to}</span>
                    <span style={{ ...sans, fontSize:"0.75rem", color:MUTED }}>{step.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stripe Event Log */}
            <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"1rem" }}>STRIPE EVENT LOG</div>

            {/* Event summary pills */}
            {eventsData && Object.keys(eventsData.summary).length > 0 && (
              <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", marginBottom:"1rem" }}>
                {Object.entries(eventsData.summary).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                  const isFailure = type.includes("failed") || type.includes("refund") || type.includes("deleted");
                  const isSuccess = type.includes("succeeded") || type.includes("completed") || type.includes("paid");
                  const color = isFailure ? "#EF4444" : isSuccess ? "#10B981" : DIM;
                  return (
                    <span key={type} style={{ ...sans, fontSize:"0.68rem", fontWeight:"600", color, background:`${color}12`, padding:"4px 10px", borderRadius:"100px", border:`1px solid ${color}25` }}>
                      {type.replace("customer.", "").replace("checkout.session.", "checkout.").replace("payment_intent.", "pi.")} ({count})
                    </span>
                  );
                })}
              </div>
            )}

            {/* Recent failures */}
            {eventsData && eventsData.recentFailures.length > 0 && (
              <div className="overview-card" style={{ marginBottom:"1rem", borderLeft:"3px solid #EF4444" }}>
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.16em", color:"#EF4444", fontWeight:"600", marginBottom:"0.8rem" }}>RECENT FAILURES</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                  {eventsData.recentFailures.map((f, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px", background:"rgba(239,68,68,0.04)", borderRadius:"4px" }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:"#EF4444", flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <span style={{ ...sans, fontSize:"0.78rem", fontWeight:"600", color:CREAM }}>{f.email || "Unknown"}</span>
                        <span style={{ ...sans, fontSize:"0.72rem", color:"#EF4444", marginLeft:"8px" }}>{f.reason}</span>
                      </div>
                      <span style={{ ...sans, fontSize:"0.68rem", color:DIM }}>{timeAgo(f.created)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full event log */}
            <div className="overview-card">
              {!eventsData || eventsData.events.length === 0 ? (
                <div style={{ ...sans, fontSize:"0.84rem", color:DIM, textAlign:"center", padding:"2rem 0" }}>No events recorded yet. Events will appear here after Stripe activity.</div>
              ) : (
                <div style={{ maxHeight:"400px", overflowY:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ borderBottom:`1px solid ${BORDER}`, position:"sticky", top:0, background:BG2 }}>
                        {["Time","Event","Email","Amount","Status"].map(h => (
                          <th key={h} style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.14em", fontWeight:"600", color:DIM, padding:"8px 10px", textAlign:"left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {eventsData.events.map(ev => {
                        const isFailure = ev.status === "failed" || ev.event_type.includes("failed") || ev.event_type.includes("refund");
                        const isSuccess = ev.status === "succeeded" || ev.status === "completed" || ev.status === "paid";
                        const dotColor = isFailure ? "#EF4444" : isSuccess ? "#10B981" : "#F59E0B";
                        return (
                          <tr key={ev.id} style={{ borderBottom:`1px solid ${BORDER}` }}>
                            <td style={{ ...sans, fontSize:"0.72rem", color:DIM, padding:"8px 10px", whiteSpace:"nowrap" }}>{timeAgo(ev.created_at)}</td>
                            <td style={{ ...sans, fontSize:"0.74rem", color:CREAM, padding:"8px 10px", fontWeight:"500" }}>
                              {ev.event_type.replace("customer.", "").replace("checkout.session.", "checkout.").replace("payment_intent.", "pi.")}
                            </td>
                            <td style={{ ...sans, fontSize:"0.74rem", color:MUTED, padding:"8px 10px" }}>{ev.email || "—"}</td>
                            <td style={{ ...sans, fontSize:"0.78rem", fontWeight:"600", color: ev.amount > 0 ? (isFailure ? "#EF4444" : "#10B981") : DIM, padding:"8px 10px" }}>
                              {ev.amount > 0 ? `$${(ev.amount / 100).toLocaleString()}` : "—"}
                            </td>
                            <td style={{ padding:"8px 10px" }}>
                              <span style={{ display:"inline-flex", alignItems:"center", gap:"4px" }}>
                                <span style={{ width:6, height:6, borderRadius:"50%", background:dotColor }} />
                                <span style={{ ...sans, fontSize:"0.68rem", color:dotColor, fontWeight:"600" }}>
                                  {ev.failure_reason ? ev.failure_reason.substring(0, 40) : ev.status}
                                </span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginTop:"2.5rem", marginBottom:"1rem" }}>QUICK LINKS</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"0.8rem" }}>
              {[
                { label: "Stripe Payments", url: "https://dashboard.stripe.com/payments", color: "#635BFF" },
                { label: "Stripe Subscriptions", url: "https://dashboard.stripe.com/subscriptions", color: "#635BFF" },
                { label: "Stripe Webhooks", url: "https://dashboard.stripe.com/webhooks", color: "#635BFF" },
                { label: "Stripe Customers", url: "https://dashboard.stripe.com/customers", color: "#635BFF" },
                { label: "Supabase Tables", url: "https://supabase.com/dashboard/project/dfuwkysnaveauodclqdm/editor", color: "#3ECF8E" },
                { label: "Supabase Logs", url: "https://supabase.com/dashboard/project/dfuwkysnaveauodclqdm/logs/explorer", color: "#3ECF8E" },
                { label: "Cal.com Bookings", url: "https://app.cal.com/bookings", color: "#F97316" },
                { label: "Cal.com Settings", url: "https://app.cal.com/settings", color: "#F97316" },
                { label: "Resend Emails", url: "https://resend.com/emails", color: "#00D4AA" },
                { label: "Resend Domains", url: "https://resend.com/domains", color: "#00D4AA" },
                { label: "Vercel Dashboard", url: "https://vercel.com", color: CREAM },
                { label: "GitHub Repo", url: "https://github.com/BVerse-dev/localclaw", color: CREAM },
              ].map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  style={{ ...sans, display:"flex", alignItems:"center", gap:"8px", padding:"12px 14px", background:BG2, border:`1px solid ${BORDER}`, borderRadius:"4px", textDecoration:"none", transition:"border-color 0.2s, background 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD_BORDER; e.currentTarget.style.background = GOLD_MID; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = BG2; }}
                >
                  <div style={{ width:8, height:8, borderRadius:"50%", background:link.color, flexShrink:0 }} />
                  <span style={{ fontSize:"0.78rem", fontWeight:"500", color:CREAM }}>{link.label}</span>
                  <span style={{ fontSize:"0.68rem", color:DIM, marginLeft:"auto" }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
