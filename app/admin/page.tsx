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
type TabKey = "overview" | "leads" | "calls" | "calendar";

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [filter, setFilter] = useState("all");
  const [callFilter, setCallFilter] = useState<"upcoming"|"past"|"cancelled">("upcoming");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [tab, setTab] = useState<TabKey>("overview");

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

  useEffect(() => {
    if (authed) {
      fetchSubmissions();
      fetchBookings();
    }
  }, [authed, fetchSubmissions, fetchBookings]);

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

    return { total, byStatus, pipelineValue, monthlyRecurring, conversionRate, thisWeek };
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
        .admin-row { transition: background 0.15s; cursor: pointer; }
        .admin-row:hover { background: rgba(201,146,42,0.04) !important; }
        .admin-status-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 100px; font-size: 0.7rem;
          font-weight: 600; letter-spacing: 0.06em; font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }
        .admin-filter {
          padding: 6px 14px; border-radius: 100px; font-size: 0.72rem;
          font-weight: 500; letter-spacing: 0.06em; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
          background: transparent; color: ${DIM};
        }
        .admin-filter:hover { color: ${CREAM}; }
        .admin-filter.active {
          border-color: ${GOLD}; background: rgba(201,146,42,0.1); color: ${GOLD};
        }
        .admin-detail-label {
          font-size: 0.65rem; letter-spacing: 0.18em; font-weight: 600;
          color: ${DIM}; margin-bottom: 0.3rem; font-family: 'Inter', sans-serif;
        }
        .admin-detail-value {
          font-size: 0.88rem; color: ${CREAM}; font-family: 'Inter', sans-serif; line-height: 1.6;
        }
        .admin-tab {
          padding: 10px 20px; font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.08em; font-family: 'Inter', sans-serif;
          cursor: pointer; border: none; background: transparent;
          color: ${DIM}; transition: all 0.2s; border-bottom: 2px solid transparent;
        }
        .admin-tab:hover { color: ${CREAM}; }
        .admin-tab.active { color: ${GOLD}; border-bottom-color: ${GOLD}; }
        .stat-card {
          background: ${BG2}; border: 1px solid ${BORDER}; border-radius: 4px;
          padding: 1.2rem 1.4rem; flex: 1; min-width: 160px;
        }
        .stat-card-accent {
          background: linear-gradient(135deg, rgba(201,146,42,0.08), rgba(201,146,42,0.02));
          border: 1px solid ${GOLD_BORDER}; border-radius: 4px;
          padding: 1.2rem 1.4rem; flex: 1; min-width: 160px;
        }
        .pipeline-bar {
          height: 32px; border-radius: 2px; display: flex; align-items: center;
          padding: 0 12px; font-family: 'Inter', sans-serif; font-size: 0.72rem;
          font-weight: 600; color: rgba(255,255,255,0.9); transition: all 0.3s;
          cursor: pointer; position: relative; min-width: 40px;
        }
        .pipeline-bar:hover { opacity: 0.85; transform: translateX(2px); }
        .overview-card {
          background: ${BG2}; border: 1px solid ${BORDER}; border-radius: 4px;
          padding: 1.4rem; overflow: hidden;
        }
        .activity-item {
          display: flex; align-items: flex-start; gap: 12px; padding: 10px 0;
          border-bottom: 1px solid ${BORDER}; transition: background 0.15s;
        }
        .activity-item:last-child { border-bottom: none; }
        .booking-card {
          background: ${BG3}; border: 1px solid ${BORDER}; border-radius: 4px;
          padding: 1.2rem 1.4rem; transition: border-color 0.2s;
        }
        .booking-card:hover { border-color: ${GOLD_BORDER}; }
        .booking-card.matched { border-left: 3px solid ${GOLD}; }
        .call-filter {
          padding: 6px 16px; border-radius: 100px; font-size: 0.72rem;
          font-weight: 600; letter-spacing: 0.06em; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
          background: transparent; color: ${DIM};
        }
        .call-filter:hover { color: ${CREAM}; }
        .call-filter.active {
          border-color: ${GOLD}; background: rgba(201,146,42,0.1); color: ${GOLD};
        }
        .sync-btn {
          padding: 8px 18px; border-radius: 2px; font-size: 0.72rem;
          font-weight: 600; letter-spacing: 0.08em; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.2s; border: 1px solid ${GOLD_BORDER};
          background: rgba(201,146,42,0.08); color: ${GOLD};
        }
        .sync-btn:hover { background: rgba(201,146,42,0.15); }
        .sync-btn:disabled { opacity: 0.5; cursor: default; }
        .action-btn {
          padding: 6px 14px; border-radius: 2px; font-size: 0.7rem;
          font-weight: 600; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.2s; border: none;
          text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
        }
        #cal-embed-container { width: 100%; min-height: 600px; overflow: hidden; border-radius: 4px; }
        #cal-embed-container iframe { border-radius: 4px; }
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

        {/* ── TABS ── */}
        <div style={{ paddingTop:"60px", borderBottom:`1px solid ${BORDER}`, display:"flex", paddingLeft:"5%" }}>
          {(["overview","leads","calls","calendar"] as TabKey[]).map(t => (
            <button key={t} className={`admin-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
              {t === "overview" ? "OVERVIEW" : t === "leads" ? "LEADS" : t === "calls" ? "CALLS" : "CALENDAR"}
              {t === "calls" && bookingData && bookingData.stats.upcoming > 0 && (
                <span style={{ marginLeft:"6px", background:"rgba(168,85,247,0.2)", color:"#A855F7", padding:"1px 6px", borderRadius:"100px", fontSize:"0.65rem" }}>{bookingData.stats.upcoming}</span>
              )}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* ── OVERVIEW TAB ── */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {tab === "overview" && (
          <div style={{ padding:"2rem 5%", maxWidth:"1400px", margin:"0 auto" }}>

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
              <div className="stat-card">
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.5rem" }}>PIPELINE VALUE</div>
                <div style={{ ...display, fontSize:"2.2rem", fontWeight:"700", color:GOLD, lineHeight:1 }}>${stats.pipelineValue.toLocaleString()}</div>
                <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.4rem" }}>setup fees (excl. lost)</div>
              </div>
              <div className="stat-card">
                <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", marginBottom:"0.5rem" }}>MONTHLY RECURRING</div>
                <div style={{ ...display, fontSize:"2.2rem", fontWeight:"700", color:"#10B981", lineHeight:1 }}>${stats.monthlyRecurring.toLocaleString()}</div>
                <div style={{ ...sans, fontSize:"0.72rem", color:MUTED, marginTop:"0.4rem" }}>active + onboarded MRR</div>
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
          <div style={{ display:"flex", minHeight:"calc(100vh - 100px)" }}>
            <div style={{ flex:1, borderRight:`1px solid ${BORDER}`, display:"flex", flexDirection:"column" }}>
              <div style={{ padding:"1.2rem 1.6rem", borderBottom:`1px solid ${BORDER}`, display:"flex", gap:"0.5rem", flexWrap:"wrap", alignItems:"center" }}>
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
                        {["Date","Name","Business","Budget","Status"].map(h => (
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

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.4rem", marginBottom:"2rem" }}>
                    <div><div className="admin-detail-label">BUSINESS</div><div className="admin-detail-value">{selected.business}</div></div>
                    <div><div className="admin-detail-label">INDUSTRY</div><div className="admin-detail-value">{selected.industry || "—"}</div></div>
                    <div><div className="admin-detail-label">TEAM SIZE</div><div className="admin-detail-value">{selected.team_size || "—"}</div></div>
                    <div><div className="admin-detail-label">BUDGET</div><div className="admin-detail-value">{budgetLabel(selected.budget)}</div></div>
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
        {/* ── CALLS TAB ── */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {tab === "calls" && (
          <div style={{ padding:"2rem 5%", maxWidth:"1400px", margin:"0 auto" }}>

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
          <div style={{ padding:"2rem 5%", maxWidth:"1400px", margin:"0 auto" }}>
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

      </div>
    </>
  );
}
