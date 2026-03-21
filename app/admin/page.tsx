"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const BG         = "#080704";
const BG2        = "#0D0B07";
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

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // ── Auth ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setAuthError("Invalid password.");
    }
  };

  // Check if already authed (cookie exists)
  useEffect(() => {
    fetch("/api/admin/submissions")
      .then(res => { if (res.ok) setAuthed(true); })
      .catch(() => {});
  }, []);

  // ── Fetch submissions ──
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/submissions?status=${filter}`);
    if (res.ok) {
      const data = await res.json();
      setSubmissions(data.submissions || []);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    if (authed) fetchSubmissions();
  }, [authed, filter, fetchSubmissions]);

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

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) +
      " · " + d.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
  };

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
  const counts = {
    all: submissions.length,
    new: submissions.filter(s => s.status === "new").length,
  };

  return (
    <>
      <style>{`
        .admin-row {
          transition: background 0.15s;
          cursor: pointer;
        }
        .admin-row:hover {
          background: rgba(201,146,42,0.04) !important;
        }
        .admin-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          font-family: 'Inter', sans-serif;
          white-space: nowrap;
        }
        .admin-filter {
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
          background: transparent;
          color: ${DIM};
        }
        .admin-filter:hover { color: ${CREAM}; }
        .admin-filter.active {
          border-color: ${GOLD};
          background: rgba(201,146,42,0.1);
          color: ${GOLD};
        }
        .admin-detail-label {
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          font-weight: 600;
          color: ${DIM};
          margin-bottom: 0.3rem;
          font-family: 'Inter', sans-serif;
        }
        .admin-detail-value {
          font-size: 0.88rem;
          color: ${CREAM};
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:BG, color:CREAM }}>

        {/* ── NAV ── */}
        <nav style={{
          position:"fixed", top:0, left:0, right:0, zIndex:200,
          background:"rgba(8,7,4,0.97)", borderBottom:`1px solid ${GOLD_BORDER}`,
          padding:"0 5%", display:"flex", alignItems:"center", justifyContent:"space-between",
          height:"68px", backdropFilter:"blur(14px)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
            <Link href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:"10px" }}>
              <ClawIcon size={30} color={GOLD} />
              <span className="lc-logo-text">LocalClaw</span>
            </Link>
            <span style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:DIM, fontWeight:"600", background:GOLD_MID, border:`1px solid ${BORDER}`, borderRadius:"100px", padding:"4px 12px" }}>ADMIN</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"1.2rem" }}>
            <span style={{ ...sans, color:DIM, fontSize:"0.78rem" }}>
              {counts.new > 0 && <span style={{ color:"#22C55E", fontWeight:"700" }}>{counts.new} new</span>}
              {counts.new > 0 && " · "}
              {submissions.length} total
            </span>
            <Link href="/" style={{ ...sans, color:DIM, fontSize:"0.78rem", textDecoration:"none" }}>← Site</Link>
          </div>
        </nav>

        <div style={{ paddingTop:"68px", display:"flex", minHeight:"calc(100vh - 68px)" }}>

          {/* ── LEFT: TABLE ── */}
          <div style={{ flex:1, borderRight:`1px solid ${BORDER}`, display:"flex", flexDirection:"column" }}>

            {/* Filters */}
            <div style={{ padding:"1.2rem 1.6rem", borderBottom:`1px solid ${BORDER}`, display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
              {STATUSES.map(s => (
                <button
                  key={s.key}
                  className={`admin-filter${filter === s.key ? " active" : ""}`}
                  onClick={() => setFilter(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div style={{ flex:1, overflowY:"auto" }}>
              {loading ? (
                <div style={{ padding:"3rem", textAlign:"center" }}>
                  <p style={{ ...sans, color:DIM, fontSize:"0.88rem" }}>Loading...</p>
                </div>
              ) : submissions.length === 0 ? (
                <div style={{ padding:"4rem 2rem", textAlign:"center" }}>
                  <p style={{ ...display, fontSize:"1.4rem", color:MUTED, marginBottom:"0.5rem" }}>No submissions yet.</p>
                  <p style={{ ...sans, fontSize:"0.84rem", color:DIM }}>Intake form leads will appear here when clients submit.</p>
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
                    {submissions.map(s => (
                      <tr
                        key={s.id}
                        className="admin-row"
                        onClick={() => { setSelected(s); setEditNotes(s.admin_notes || ""); }}
                        style={{
                          borderBottom:`1px solid ${BORDER}`,
                          background: selected?.id === s.id ? "rgba(201,146,42,0.06)" : "transparent",
                        }}
                      >
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

          {/* ── RIGHT: DETAIL PANEL ── */}
          <div style={{ width:"420px", flexShrink:0, overflowY:"auto", background:BG2 }}>
            {selected ? (
              <div style={{ padding:"2rem 1.8rem" }}>
                {/* Header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"2rem" }}>
                  <div>
                    <h2 style={{ ...display, fontSize:"1.5rem", fontWeight:"700", marginBottom:"0.3rem" }}>{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} style={{ ...sans, fontSize:"0.84rem", color:GOLD, textDecoration:"none" }}>{selected.email}</a>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", color:DIM, cursor:"pointer", fontSize:"1.2rem", padding:"4px" }}>×</button>
                </div>

                {/* Status changer */}
                <div style={{ marginBottom:"2rem" }}>
                  <div className="admin-detail-label">STATUS</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}>
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s.key}
                        onClick={() => updateSubmission(selected.id, { status: s.key })}
                        disabled={saving}
                        style={{
                          ...sans, fontSize:"0.72rem", fontWeight:"600", padding:"5px 12px",
                          borderRadius:"100px", cursor:"pointer", border:"1px solid", transition:"all 0.2s",
                          background: selected.status === s.key ? `${s.color}20` : "transparent",
                          borderColor: selected.status === s.key ? s.color : BORDER,
                          color: selected.status === s.key ? s.color : DIM,
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details grid */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.4rem", marginBottom:"2rem" }}>
                  <div>
                    <div className="admin-detail-label">BUSINESS</div>
                    <div className="admin-detail-value">{selected.business}</div>
                  </div>
                  <div>
                    <div className="admin-detail-label">INDUSTRY</div>
                    <div className="admin-detail-value">{selected.industry || "—"}</div>
                  </div>
                  <div>
                    <div className="admin-detail-label">TEAM SIZE</div>
                    <div className="admin-detail-value">{selected.team_size || "—"}</div>
                  </div>
                  <div>
                    <div className="admin-detail-label">BUDGET</div>
                    <div className="admin-detail-value">
                      {selected.budget === "starter" ? "Starter — $997 + $149/mo" :
                       selected.budget === "business" ? "Business — $1,997 + $299/mo" :
                       selected.budget === "fullstack" ? "Full Stack — $3,500 + $499/mo" :
                       selected.budget === "unsure" ? "Not sure yet" :
                       selected.budget || "—"}
                    </div>
                  </div>
                </div>

                {/* Automations */}
                <div style={{ marginBottom:"2rem" }}>
                  <div className="admin-detail-label">AUTOMATIONS REQUESTED</div>
                  {selected.automations && selected.automations.length > 0 ? (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem", marginTop:"0.4rem" }}>
                      {selected.automations.map((a, i) => (
                        <span key={i} style={{
                          ...sans, fontSize:"0.75rem", color:MUTED, padding:"4px 10px",
                          background:GOLD_MID, border:`1px solid ${BORDER}`, borderRadius:"2px",
                        }}>{a}</span>
                      ))}
                    </div>
                  ) : (
                    <div className="admin-detail-value">—</div>
                  )}
                </div>

                {/* Additional details */}
                {selected.details && (
                  <div style={{ marginBottom:"2rem" }}>
                    <div className="admin-detail-label">ADDITIONAL DETAILS</div>
                    <div className="admin-detail-value" style={{ whiteSpace:"pre-wrap", color:MUTED, fontSize:"0.85rem", lineHeight:"1.7" }}>{selected.details}</div>
                  </div>
                )}

                {/* Admin notes */}
                <div style={{ marginBottom:"1.5rem" }}>
                  <div className="admin-detail-label">YOUR NOTES</div>
                  <textarea
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                    placeholder="Add notes about this lead..."
                    rows={4}
                    style={{
                      ...sans, width:"100%", background:BG, border:`1px solid ${BORDER}`,
                      borderRadius:"2px", padding:"12px 14px", color:CREAM, fontSize:"0.85rem",
                      outline:"none", boxSizing:"border-box", resize:"vertical", lineHeight:"1.65",
                    }}
                  />
                  <button
                    onClick={() => updateSubmission(selected.id, { admin_notes: editNotes })}
                    disabled={saving || editNotes === (selected.admin_notes || "")}
                    style={{
                      ...sans, marginTop:"0.6rem", padding:"8px 20px", fontSize:"0.76rem",
                      fontWeight:"600", letterSpacing:"0.06em", border:"none", borderRadius:"2px",
                      cursor: editNotes === (selected.admin_notes || "") ? "default" : "pointer",
                      background: editNotes === (selected.admin_notes || "") ? DIM : GOLD,
                      color: BG, transition:"all 0.2s",
                      opacity: editNotes === (selected.admin_notes || "") ? 0.4 : 1,
                    }}
                  >
                    {saving ? "SAVING..." : "SAVE NOTES"}
                  </button>
                </div>

                {/* Timestamp */}
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
      </div>
    </>
  );
}
