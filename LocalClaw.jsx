import {
  Mail, Calendar, Zap, MessageSquare, BarChart2, Shield,
  MapPin, Home, Activity, Scale, Coffee, TrendingUp, Briefcase, Wrench,
  CheckCircle, Users, Lock, Eye, RefreshCw, Building2
} from "lucide-react";

const ICON_URL = "https://media.base44.com/images/public/69b2ee3113ccfbf0b800b1d9/d0b95b560_generated_image.png";
const LOGOTYPE_URL = "https://media.base44.com/images/public/69b2ee3113ccfbf0b800b1d9/0189e7d16_generated_image.png";

const GOLD = "#C9922A";
const GOLD_DIM = "rgba(201,146,42,0.15)";
const GOLD_MID = "rgba(201,146,42,0.08)";
const CREAM = "#F5F0E8";
const MUTED = "#A89880";
const DIM = "#7A6E62";
const BG = "#0A0A0A";
const BG2 = "#0D0D0D";
const BORDER = "rgba(245,240,232,0.06)";
const GOLD_BORDER = "rgba(201,146,42,0.2)";

const sans = { fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" };
const serif = { fontFamily: "'Georgia','Times New Roman',serif" };

// Real brand logo URLs from official sources / CDNs
const INTEGRATIONS = [
  { name: "Gmail",            src: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" },
  { name: "Google Calendar",  src: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" },
  { name: "Outlook",          src: "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" },
  { name: "Slack",            src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
  { name: "WhatsApp",         src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
  { name: "Notion",           src: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" },
  { name: "Google Drive",     src: "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" },
  { name: "Zoom",             src: "https://upload.wikimedia.org/wikipedia/commons/1/11/Zoom_Logo_2022.svg" },
  { name: "HubSpot",         src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg" },
  { name: "GitHub",           src: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
  { name: "Google Sheets",    src: "https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg" },
  { name: "Telegram",         src: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" },
];

export default function LocalClaw() {
  return (
    <div style={{ ...serif, background: BG, color: CREAM, minHeight: "100vh", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0A0A; }
        .nav-link { color: #A89880; text-decoration: none; font-size: 0.8rem; letter-spacing: 0.1em; font-family: 'Inter', sans-serif; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #F5F0E8; }
        .card-hover { transition: border-color 0.2s, background 0.2s; }
        .card-hover:hover { border-color: rgba(201,146,42,0.35) !important; background: rgba(201,146,42,0.04) !important; }
        .btn-primary { background: #C9922A; color: #0A0A0A; padding: 16px 36px; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.1em; text-decoration: none; border-radius: 1px; display: inline-block; transition: opacity 0.2s; }
        .btn-primary:hover { opacity: 0.88; }
        .btn-secondary { background: transparent; color: #F5F0E8; padding: 16px 36px; font-family: 'Inter', sans-serif; font-weight: 500; font-size: 0.85rem; letter-spacing: 0.08em; text-decoration: none; border-radius: 1px; border: 1px solid rgba(245,240,232,0.18); display: inline-block; transition: border-color 0.2s; }
        .btn-secondary:hover { border-color: rgba(245,240,232,0.4); }
        .integration-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; overflow: hidden; transition: transform 0.2s, border-color 0.2s; flex-shrink: 0; }
        .integration-icon:hover { transform: scale(1.12); border-color: rgba(201,146,42,0.5); }
        .integration-icon img { width: 20px; height: 20px; object-fit: contain; }
        .notion-icon img { filter: invert(1); }
        .github-icon img { filter: invert(1); }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .four-col { grid-template-columns: repeat(2,1fr) !important; }
          .step-row { flex-direction: column !important; gap: 1rem !important; }
          .connects-strip { flex-wrap: wrap !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,10,0.96)", borderBottom: `1px solid ${GOLD_BORDER}`, padding: "0 6%", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px", backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={ICON_URL} alt="LocalClaw" style={{ height: "34px", width: "34px", objectFit: "contain" }} />
          <img src={LOGOTYPE_URL} alt="LocalClaw" style={{ height: "22px", objectFit: "contain", filter: "brightness(1.1)" }} />
        </div>
        <div className="nav-links" style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
          <a href="#what" className="nav-link">WHAT IT DOES</a>
          <a href="#how" className="nav-link">HOW IT WORKS</a>
          <a href="#pricing" className="nav-link">PRICING</a>
          <a href="#security" className="nav-link">SECURITY</a>
          <a href="#book" className="btn-primary" style={{ padding: "10px 22px", fontSize: "0.78rem" }}>BOOK A CALL</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "160px 6% 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "15%", right: "5%", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(201,146,42,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(201,146,42,0.03) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "920px", position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: GOLD_MID, border: `1px solid ${GOLD_BORDER}`, borderRadius: "100px", padding: "6px 18px", marginBottom: "2.8rem" }}>
            <div style={{ width: "5px", height: "5px", background: GOLD, borderRadius: "50%" }} />
            <span style={{ ...sans, fontSize: "0.7rem", letterSpacing: "0.18em", color: GOLD, fontWeight: "600" }}>LOCALCLAW AGENT ENGINE</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(3rem, 7.5vw, 6.5rem)", lineHeight: "1.02", fontWeight: "700", marginBottom: "2rem", letterSpacing: "-0.025em", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            We deploy AI agents<br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>for local businesses</em><br />
            that never sleep.
          </h1>

          {/* Subtext */}
          <p style={{ ...sans, fontSize: "1.1rem", color: MUTED, maxWidth: "580px", lineHeight: "1.75", marginBottom: "3.5rem", fontWeight: "400" }}>
            LocalClaw combines OpenClaw's autonomous agent framework with NVIDIA NemoClaw enterprise security — deployed and managed for your business. No technical knowledge required.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "3.5rem" }}>
            <a href="#book" className="btn-primary">BOOK A FREE 15-MIN CALL</a>
            <a href="#how" className="btn-secondary">SEE HOW IT WORKS</a>
          </div>

          {/* CONNECTS TO strip */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }} className="connects-strip">
            <span style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.18em", color: DIM, fontWeight: "600", whiteSpace: "nowrap" }}>CONNECTS TO</span>

            {/* Overlapping icon stack */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {INTEGRATIONS.map((app, i) => (
                <div
                  key={i}
                  className={`integration-icon ${app.name === "Notion" ? "notion-icon" : ""} ${app.name === "GitHub" ? "github-icon" : ""}`}
                  title={app.name}
                  style={{ marginLeft: i === 0 ? 0 : "-8px", zIndex: INTEGRATIONS.length - i }}
                >
                  <img src={app.src} alt={app.name} />
                </div>
              ))}
              {/* +10,000 bubble */}
              <div style={{
                marginLeft: "-8px",
                zIndex: 0,
                height: "36px",
                minWidth: "68px",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 12px"
              }}>
                <span style={{ ...sans, fontSize: "0.72rem", fontWeight: "700", color: CREAM, letterSpacing: "0.02em" }}>+10,000</span>
              </div>
            </div>
          </div>

          {/* Trust tags */}
          <div style={{ display: "flex", gap: "2.5rem", marginTop: "3rem", flexWrap: "wrap" }}>
            {[
              ["OpenClaw Powered", "Open-source agent framework"],
              ["NVIDIA NemoClaw", "Enterprise security layer"],
              ["Same-Day Deployment", "Live in under 24 hours"]
            ].map(([title, sub], i) => (
              <div key={i}>
                <div style={{ ...sans, fontSize: "0.88rem", fontWeight: "600", color: CREAM, marginBottom: "0.2rem" }}>{title}</div>
                <div style={{ ...sans, fontSize: "0.78rem", color: DIM }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: GOLD_MID, borderTop: `1px solid ${GOLD_BORDER}`, borderBottom: `1px solid ${GOLD_BORDER}`, padding: "2.2rem 6%" }}>
        <div className="four-col" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", maxWidth: "960px", margin: "0 auto", textAlign: "center" }}>
          {[["24 Hours","SETUP WINDOW"],["NemoClaw™","SECURITY LAYER"],["24 / 7","AGENT UPTIME"],["Telegram","INTERFACE"]].map(([val, label], i) => (
            <div key={i}>
              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: "700", color: GOLD, marginBottom: "0.25rem" }}>{val}</div>
              <div style={{ ...sans, fontSize: "0.65rem", letterSpacing: "0.18em", color: DIM }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section id="what" style={{ padding: "110px 6%" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...sans, fontSize: "0.7rem", letterSpacing: "0.22em", color: GOLD, marginBottom: "1.2rem", fontWeight: "600" }}>WHAT YOUR AGENT DOES</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(2.2rem,4.5vw,3.5rem)", fontWeight: "700", marginBottom: "1rem", lineHeight: "1.08" }}>Not another chatbot.<br />A working digital employee.</h2>
          <p style={{ ...sans, color: MUTED, maxWidth: "520px", marginBottom: "4.5rem", lineHeight: "1.75", fontSize: "0.95rem" }}>Your agent runs on dedicated infrastructure, checking your inbox, calendar, and connected tools every 30 minutes — taking action without you asking.</p>

          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: GOLD_BORDER }}>
            {[
              { Icon: Mail,           time: "Every 30 min",  title: "Inbox Triage",         desc: "Scans your email, flags urgent messages, drafts replies for your review — never miss a lead or client query again." },
              { Icon: Calendar,       time: "9:00 AM Daily", title: "Morning Briefing",      desc: "Sends a Telegram summary of today's meetings, attendee backgrounds, priorities, and action items before your day starts." },
              { Icon: Zap,            time: "On Demand",     title: "Instant Actions",       desc: "\"Running 10 min late\" — your agent emails your next meeting and reschedules. Talk to it like a human assistant." },
              { Icon: MessageSquare,  time: "Ongoing",       title: "Comms Monitor",         desc: "Watches Slack, WhatsApp, and CRM threads. Surfaces what matters and filters what doesn't, keeping you in control." },
              { Icon: BarChart2,      time: "Weekly",        title: "Performance Reports",   desc: "Automated KPI summaries delivered to Telegram — campaign results, lead counts, follow-up status, and action items." },
              { Icon: Shield,         time: "Always",        title: "NemoClaw Security",     desc: "NVIDIA's enterprise guardrails run on every agent action. Your credentials never leave your infrastructure." },
            ].map(({ Icon, time, title, desc }, i) => (
              <div key={i} style={{ background: BG2, padding: "2.8rem 2.2rem" }}>
                <div style={{ width: "42px", height: "42px", background: GOLD_MID, border: `1px solid ${GOLD_BORDER}`, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                  <Icon size={18} color={GOLD} strokeWidth={1.5} />
                </div>
                <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.18em", color: GOLD, marginBottom: "0.6rem", fontWeight: "600" }}>{time}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: "700", marginBottom: "0.8rem", fontSize: "1.3rem" }}>{title}</div>
                <div style={{ ...sans, color: DIM, fontSize: "0.88rem", lineHeight: "1.65" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section style={{ padding: "90px 6%", background: BG2 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...sans, fontSize: "0.7rem", letterSpacing: "0.22em", color: GOLD, marginBottom: "1.2rem", fontWeight: "600" }}>BUILT FOR</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(2.2rem,4.5vw,3.2rem)", fontWeight: "700", marginBottom: "3.5rem", lineHeight: "1.08" }}>Any business that needs leverage.</h2>

          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: GOLD_BORDER }}>
            {[
              { Icon: MapPin,      label: "Local Businesses",        desc: "Any business, any size, any industry. If you operate locally, your agent works harder than your competition's team." },
              { Icon: Home,        label: "Realtors & Brokers",      desc: "Lead follow-up, listing updates, client briefings, and appointment scheduling — all automated." },
              { Icon: Activity,    label: "Clinics & Practices",     desc: "Appointment triage, patient communications, staff coordination, and supplier follow-ups streamlined." },
              { Icon: Scale,       label: "Law Firms",               desc: "Case status tracking, client follow-up, document summaries, and deadline alerts managed autonomously." },
              { Icon: Coffee,      label: "Restaurants & Hospitality",desc: "Reservation management, supplier comms, daily ops reports, and promotion scheduling automated." },
              { Icon: Building2,   label: "Property Managers",       desc: "Tenant communications, maintenance request triage, lease renewals, and contractor coordination handled automatically." },
              { Icon: TrendingUp,  label: "Agencies & Studios",      desc: "Client reporting, project management, billing follow-ups, and creative workflows running in parallel." },
              { Icon: Briefcase,   label: "Investors & VCs",         desc: "Deal flow tracking, portfolio updates, LP communications, and meeting prep — all on autopilot." },
              { Icon: Wrench,      label: "Contractors & Trades",    desc: "Quote follow-ups, job scheduling, supplier coordination, and invoice reminders — zero manual overhead." },
            ].map(({ Icon, label, desc }, i) => (
              <div key={i} className="card-hover" style={{ background: BG, padding: "2.2rem 2rem", border: "1px solid transparent", cursor: "default" }}>
                <div style={{ width: "38px", height: "38px", background: GOLD_MID, border: `1px solid ${GOLD_BORDER}`, borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.2rem" }}>
                  <Icon size={16} color={GOLD} strokeWidth={1.5} />
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: "700", marginBottom: "0.6rem", fontSize: "1.15rem" }}>{label}</div>
                <div style={{ ...sans, color: DIM, fontSize: "0.85rem", lineHeight: "1.6" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: "110px 6%" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p style={{ ...sans, fontSize: "0.7rem", letterSpacing: "0.22em", color: GOLD, marginBottom: "1.2rem", fontWeight: "600" }}>THE PROCESS</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(2.2rem,4.5vw,3.2rem)", fontWeight: "700", marginBottom: "4.5rem", lineHeight: "1.08" }}>Go live same day.<br />No technical knowledge needed.</h2>

          {[
            { num: "01", Icon: Users,      title: "Kickoff Call",      duration: "20–45 min",  desc: "We map your integrations — email, calendar, CRM, Slack — identify your highest-leverage workflows, and plan your agent configuration. You tell us what to automate. We handle everything else." },
            { num: "02", Icon: Lock,       title: "Deploy & Secure",   duration: "Same Day",   desc: "We provision your infrastructure, install OpenClaw, layer NVIDIA NemoClaw security guardrails, configure Composio OAuth middleware, and wire every integration. Docker sandboxing and firewall hardening included. You go live the same day." },
            { num: "03", Icon: RefreshCw,  title: "14-Day Hypercare",  duration: "Full Support",desc: "You get a dedicated Slack channel with direct access to our team. We tune workflows, expand agent permissions as trust builds, fix edge cases, and make sure your agent is earning its keep from day one." },
          ].map((step, i) => (
            <div key={i} className="step-row" style={{ display: "flex", gap: "3.5rem", padding: "3.5rem 0", borderBottom: i < 2 ? `1px solid ${BORDER}` : "none", alignItems: "flex-start" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(3.5rem,6vw,5.5rem)", fontWeight: "700", color: GOLD_DIM, lineHeight: "1", flexShrink: 0, minWidth: "80px" }}>{step.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem", flexWrap: "wrap" }}>
                  <div style={{ width: "36px", height: "36px", background: GOLD_MID, border: `1px solid ${GOLD_BORDER}`, borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <step.Icon size={16} color={GOLD} strokeWidth={1.5} />
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1.4rem", fontWeight: "700" }}>{step.title}</div>
                  <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.15em", color: GOLD, background: GOLD_MID, padding: "4px 14px", borderRadius: "100px", fontWeight: "600" }}>{step.duration}</div>
                </div>
                <div style={{ ...sans, color: MUTED, lineHeight: "1.75", fontSize: "0.93rem" }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" style={{ padding: "110px 6%", background: BG2 }}>
        <div className="two-col" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7rem", alignItems: "center" }}>
          <div>
            <p style={{ ...sans, fontSize: "0.7rem", letterSpacing: "0.22em", color: GOLD, marginBottom: "1.2rem", fontWeight: "600" }}>ENTERPRISE SECURITY</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(2.2rem,4vw,3.2rem)", fontWeight: "700", marginBottom: "1.5rem", lineHeight: "1.08" }}>
              Secured with<br /><em style={{ color: GOLD, fontStyle: "italic" }}>NVIDIA NemoClaw</em>
            </h2>
            <p style={{ ...sans, color: MUTED, lineHeight: "1.75", marginBottom: "2.5rem", fontSize: "0.93rem" }}>
              Most OpenClaw deployments have security gaps — exposed credentials, no audit trail, no sandbox. Every LocalClaw deployment ships with NVIDIA's NemoClaw guardrails baked in from day one.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                "Credentials never exposed — Composio OAuth middleware handles all tokens",
                "Docker sandboxing prevents arbitrary code execution",
                "Firewall hardening and exec allowlists configured from day one",
                "Read-only permissions by default — access expands as trust builds",
                "Instant kill switch to revoke any integration immediately",
                "Full audit trail on every agent action",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "0.9rem", alignItems: "flex-start" }}>
                  <CheckCircle size={15} color={GOLD} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ ...sans, color: MUTED, fontSize: "0.88rem", lineHeight: "1.55" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ background: GOLD_MID, border: `1px solid ${GOLD_BORDER}`, padding: "2.2rem", borderRadius: "2px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <Eye size={16} color={GOLD} strokeWidth={1.5} />
                <span style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.18em", color: GOLD, fontWeight: "600" }}>ALREADY RUNNING OPENCLAW?</span>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: "700", marginBottom: "0.8rem", fontSize: "1.25rem" }}>We will audit your setup.</div>
              <div style={{ ...sans, color: DIM, fontSize: "0.87rem", lineHeight: "1.65" }}>Most self-installs have security gaps. We audit your existing deployment, add NemoClaw guardrails, harden your firewall, and migrate you to managed care.</div>
            </div>
            <div style={{ background: GOLD_MID, border: `1px solid ${GOLD_BORDER}`, padding: "2.2rem", borderRadius: "2px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <CheckCircle size={16} color={GOLD} strokeWidth={1.5} />
                <span style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.18em", color: GOLD, fontWeight: "600" }}>100% SATISFACTION</span>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontWeight: "700", marginBottom: "0.8rem", fontSize: "1.25rem" }}>Guaranteed or refunded.</div>
              <div style={{ ...sans, color: DIM, fontSize: "0.87rem", lineHeight: "1.65" }}>If you are not happy with your agent deployment, we will refund you — no questions asked. We are here to build, not to nickel and dime.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "110px 6%" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...sans, fontSize: "0.7rem", letterSpacing: "0.22em", color: GOLD, marginBottom: "1.2rem", fontWeight: "600", textAlign: "center" }}>PLANS & PRICING</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(2.2rem,4.5vw,3.2rem)", fontWeight: "700", marginBottom: "1rem", textAlign: "center", lineHeight: "1.08" }}>Choose your deployment.</h2>
          <p style={{ ...sans, color: MUTED, textAlign: "center", marginBottom: "4.5rem", fontSize: "0.93rem" }}>One-time setup fee. Monthly retainer keeps your agent tuned, updated, and running.</p>

          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: GOLD_BORDER }}>
            {[
              {
                name: "Starter Agent", tag: "SOLO OPERATORS", setup: "$997", monthly: "$149/mo",
                desc: "One agent for one operator. Email triage, calendar management, daily briefings via Telegram.",
                features: ["1 Executive Agent", "Email + Calendar integration", "Daily morning briefing", "Telegram interface", "NemoClaw security layer", "14-day hypercare", "Dedicated Slack channel"],
                highlight: false
              },
              {
                name: "Business Engine", tag: "MOST POPULAR", setup: "$1,997", monthly: "$299/mo",
                desc: "Two to three agents for your core team — Owner, Sales, and Ops running in parallel with shared context.",
                features: ["2–3 Executive Agents", "CRM + Email + Calendar", "Sales follow-up automation", "Slack + WhatsApp interface", "NemoClaw security layer", "14-day hypercare", "Priority support channel"],
                highlight: true
              },
              {
                name: "Full Stack", tag: "ENTERPRISE", setup: "$3,500", monthly: "$499/mo",
                desc: "Full agent deployment for multi-location businesses, law firms, clinics, and growing teams.",
                features: ["5+ Executive Agents", "Full integration stack", "Custom workflow engineering", "KPI dashboard setup", "NemoClaw enterprise layer", "30-day hypercare", "Dedicated account manager"],
                highlight: false
              }
            ].map((plan, i) => (
              <div key={i} style={{ background: plan.highlight ? "#100E06" : BG2, padding: "3rem 2.5rem", position: "relative", borderTop: `2px solid ${plan.highlight ? GOLD : "transparent"}` }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%) translateY(-50%)", background: GOLD, color: BG, ...sans, fontSize: "0.62rem", letterSpacing: "0.18em", fontWeight: "700", padding: "4px 16px", whiteSpace: "nowrap" }}>MOST POPULAR</div>
                )}
                <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.18em", color: GOLD, marginBottom: "0.8rem", fontWeight: "600" }}>{plan.tag}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "1.6rem", fontWeight: "700", marginBottom: "0.5rem" }}>{plan.name}</div>
                <div style={{ marginBottom: "1.8rem" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "2.8rem", fontWeight: "700", color: GOLD }}>{plan.setup}</span>
                  <span style={{ ...sans, color: DIM, fontSize: "0.85rem" }}> setup + {plan.monthly}</span>
                </div>
                <div style={{ ...sans, color: MUTED, fontSize: "0.88rem", lineHeight: "1.65", marginBottom: "2rem", paddingBottom: "2rem", borderBottom: `1px solid ${BORDER}` }}>{plan.desc}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", marginBottom: "2.5rem" }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
                      <CheckCircle size={14} color={GOLD} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ ...sans, color: MUTED, fontSize: "0.87rem" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#book" className={plan.highlight ? "btn-primary" : "btn-secondary"} style={{ display: "block", textAlign: "center", width: "100%" }}>
                  {plan.highlight ? "GET STARTED" : "BOOK A CALL"}
                </a>
              </div>
            ))}
          </div>
          <p style={{ ...sans, textAlign: "center", color: DIM, fontSize: "0.8rem", marginTop: "2rem" }}>Additional agents: +$1,500 each. VPS hosting ~$5–10/mo (we handle setup). 100% satisfaction guarantee.</p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "90px 6%", background: BG2 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ ...sans, fontSize: "0.7rem", letterSpacing: "0.22em", color: GOLD, marginBottom: "1.2rem", fontWeight: "600", textAlign: "center" }}>CLIENT RESULTS</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: "700", marginBottom: "4rem", textAlign: "center" }}>Results, not vanity metrics.</h2>

          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: GOLD_BORDER }}>
            {[
              { quote: "My agent handles my inbox before I wake up. By 9am I already know exactly what needs my attention. It feels like having an EA that works overnight.", name: "DANIEL K.", title: "Real Estate Broker" },
              { quote: "We deployed the Business Engine for our clinic. Appointment follow-ups run automatically. Our no-show rate dropped noticeably in the first two weeks.", name: "AMARA T.", title: "Clinic Director" },
              { quote: "The NemoClaw security layer was the deciding factor. Our CISO reviewed the setup and approved it same day. That never happens with other vendors.", name: "SELENA M.", title: "Managing Partner, Law Firm" },
              { quote: "Setup was same day. I was chatting with my agent on Telegram by evening. The ROI was clear within the first week of automated lead follow-ups.", name: "IBRAHIM O.", title: "Agency Founder" },
              { quote: "LocalClaw gave us an operating layer we did not know we needed. Our team runs leaner and responds to clients faster than we ever did manually.", name: "NAOMI A.", title: "Operations Director" },
              { quote: "I was skeptical about AI agents for our restaurant group. Three months in, our supplier communications are fully automated. I have not missed a single renewal.", name: "VICTOR E.", title: "Restaurant Group Owner" },
            ].map((t, i) => (
              <div key={i} style={{ background: BG, padding: "2.8rem 2.5rem" }}>
                <div style={{ display: "flex", gap: "3px", marginBottom: "1.5rem" }}>
                  {[...Array(5)].map((_, j) => (
                    <div key={j} style={{ width: "11px", height: "11px", background: GOLD, clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }} />
                  ))}
                </div>
                <div style={{ ...sans, color: "#D4C5B0", fontStyle: "italic", lineHeight: "1.75", marginBottom: "1.8rem", fontSize: "0.92rem" }}>"{t.quote}"</div>
                <div style={{ ...sans, fontWeight: "700", fontSize: "0.78rem", letterSpacing: "0.12em", color: CREAM }}>{t.name}</div>
                <div style={{ ...sans, color: DIM, fontSize: "0.75rem", marginTop: "0.25rem" }}>{t.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="book" style={{ padding: "130px 6%", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "900px", height: "900px", background: "radial-gradient(circle, rgba(201,146,42,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ ...sans, fontSize: "0.7rem", letterSpacing: "0.22em", color: GOLD, marginBottom: "1.5rem", fontWeight: "600" }}>GET STARTED TODAY</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(2.8rem,7vw,5.5rem)", fontWeight: "700", marginBottom: "1.5rem", lineHeight: "1.02" }}>Your agent is<br /><em style={{ color: GOLD, fontStyle: "italic" }}>ready to deploy.</em></h2>
          <p style={{ ...sans, color: MUTED, maxWidth: "480px", margin: "0 auto 3.5rem", lineHeight: "1.75", fontSize: "0.98rem" }}>Book a free 15-minute strategy call. We scope your deployment and you go live same day.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://twitter.com/Th3Alch3mist_" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: "0.9rem", padding: "18px 44px" }}>BOOK A FREE CALL</a>
            <a href="https://twitter.com/Th3Alch3mist_" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: "0.9rem", padding: "18px 44px" }}>DM @Th3Alch3mist_</a>
          </div>
          <p style={{ ...sans, color: DIM, fontSize: "0.8rem", marginTop: "2rem" }}>We schedule across all time zones. Can not find a slot? DM us on X.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "3rem 6%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src={ICON_URL} alt="LocalClaw" style={{ height: "28px", width: "28px", objectFit: "contain" }} />
          <img src={LOGOTYPE_URL} alt="LocalClaw" style={{ height: "18px", objectFit: "contain", filter: "brightness(0.8)" }} />
        </div>
        <div style={{ ...sans, color: DIM, fontSize: "0.78rem" }}>Powered by OpenClaw + NVIDIA NemoClaw</div>
        <a href="https://twitter.com/Th3Alch3mist_" target="_blank" rel="noopener noreferrer" style={{ ...sans, color: GOLD, fontSize: "0.78rem", textDecoration: "none" }}>@Th3Alch3mist_ on X</a>
      </footer>

    </div>
  );
}
