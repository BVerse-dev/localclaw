"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

// ── Brand tokens (identical to main site) ─────────────────────────────────────
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

// ── Replace with your Calendly URL when ready ─────────────────────────────────
const CALENDLY_URL = "#calendly"; // TODO: Replace with https://calendly.com/your-link

// ── ClawIcon (same as main page) ──────────────────────────────────────────────
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

// ── Checkmark icon ────────────────────────────────────────────────────────────
function Check({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Form field styles ─────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  ...sans,
  width:"100%",
  background: BG2,
  border:`1px solid ${BORDER}`,
  borderRadius:"2px",
  padding:"14px 18px",
  color: CREAM,
  fontSize:"0.9rem",
  outline:"none",
  transition:"border-color 0.3s, box-shadow 0.3s",
  boxSizing:"border-box",
};

const labelStyle: React.CSSProperties = {
  ...sans,
  display:"block",
  fontSize:"0.72rem",
  letterSpacing:"0.16em",
  fontWeight:"600",
  color: MUTED,
  marginBottom:"0.6rem",
};

const AUTOMATION_OPTIONS = [
  "Email triage & inbox management",
  "Calendar management & scheduling",
  "CRM & lead follow-up",
  "Sales pipeline automation",
  "Daily briefings & reporting",
  "Client communication (WhatsApp, Telegram)",
  "Document processing & filing",
  "Social media monitoring",
  "Appointment reminders & follow-ups",
  "Custom workflow (describe below)",
];

const BUDGET_OPTIONS = [
  { label: "Starter — $997 setup + $149/mo", value: "starter" },
  { label: "Business Engine — $1,997 setup + $299/mo", value: "business" },
  { label: "Full Stack — $3,500 setup + $499/mo", value: "fullstack" },
  { label: "Not sure yet — help me decide", value: "unsure" },
];

const TEAM_OPTIONS = [
  "Just me (solopreneur)",
  "2–5 people",
  "6–15 people",
  "16–50 people",
  "50+ people",
];

// ─────────────────────────────────────────────────────────────────────────────
export default function IntakePage() {
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [automations, setAutomations] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // Nav shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stagger form sections on mount
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLDivElement>("[data-form-section]");
    sections.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.55s cubic-bezier(.22,1,.36,1), transform 0.55s cubic-bezier(.22,1,.36,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 300 + i * 120);
    });
  }, []);

  const toggleAutomation = (opt: string) => {
    setAutomations(prev =>
      prev.includes(opt) ? prev.filter(a => a !== opt) : [...prev, opt]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send form data to your backend / email service / webhook
    // For now, log and redirect to Calendly
    const formData = new FormData(formRef.current!);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      business: formData.get("business"),
      industry: formData.get("industry"),
      teamSize: formData.get("teamSize"),
      budget: formData.get("budget"),
      automations,
      details: formData.get("details"),
    };
    console.log("Intake form submission:", data);

    // TODO: Send to your backend/webhook (e.g. Zapier, Make, or API route)
    // fetch("/api/intake", { method: "POST", body: JSON.stringify(data) });

    setSubmitted(true);

    // Redirect to Calendly after a brief confirmation
    setTimeout(() => {
      if (CALENDLY_URL !== "#calendly") {
        window.location.href = CALENDLY_URL;
      }
    }, 2500);
  };

  return (
    <>
      <style>{`
        @keyframes intake-fade-up {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes intake-orb-drift {
          0%,100% { transform:translate(-50%,-50%) scale(1); }
          50%     { transform:translate(-50%,-50%) scale(1.12); }
        }
        .intake-in { animation: intake-fade-up 0.7s cubic-bezier(.22,1,.36,1) both; }

        .intake-input:focus {
          border-color: ${GOLD} !important;
          box-shadow: 0 0 0 2px rgba(201,146,42,0.12) !important;
        }
        .intake-input::placeholder {
          color: ${DIM};
          font-size: 0.85rem;
        }

        .intake-checkbox {
          cursor: pointer;
          padding: 10px 16px;
          border: 1px solid ${BORDER};
          border-radius: 2px;
          background: ${BG2};
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
          user-select: none;
        }
        .intake-checkbox:hover {
          border-color: rgba(201,146,42,0.4);
          background: rgba(201,146,42,0.04);
        }
        .intake-checkbox.active {
          border-color: ${GOLD};
          background: rgba(201,146,42,0.08);
        }

        .intake-radio {
          cursor: pointer;
          padding: 12px 18px;
          border: 1px solid ${BORDER};
          border-radius: 2px;
          background: ${BG2};
          transition: border-color 0.25s, background 0.25s;
          user-select: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .intake-radio:hover {
          border-color: rgba(201,146,42,0.4);
          background: rgba(201,146,42,0.04);
        }
        .intake-radio.active {
          border-color: ${GOLD};
          background: rgba(201,146,42,0.08);
        }

        .intake-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23635C50' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 42px;
        }

        .intake-back-link {
          color: ${DIM};
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: color 0.25s;
        }
        .intake-back-link:hover { color: ${CREAM}; }

        .intake-submit {
          width: 100%;
          background: ${GOLD};
          color: ${BG} !important;
          padding: 16px 28px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s;
        }
        .intake-submit:hover {
          opacity: 0.92;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201,146,42,0.3), 0 0 0 1px rgba(201,146,42,0.2);
        }
        .intake-submit:active { transform: translateY(0) scale(0.98); }
        .intake-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `}</style>

      <div style={{ minHeight:"100vh", background:BG, color:CREAM, display:"flex", flexDirection:"column" }}>

        {/* ── FIXED NAV — exact match to main page ── */}
        <nav style={{
          position:"fixed", top:0, left:0, right:0, zIndex:200,
          background:"rgba(8,7,4,0.97)",
          borderBottom:`1px solid ${scrolled ? GOLD_BORDER : "rgba(201,146,42,0.08)"}`,
          padding:"0 5%",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          height:"68px",
          backdropFilter:"blur(14px)",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
          transition:"border-color 0.3s, box-shadow 0.3s",
        }}>
          <Link href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:"10px" }}>
            <ClawIcon size={32} color={GOLD} />
            <span className="lc-logo-text">LocalClaw</span>
          </Link>
          <Link href="/" className="intake-back-link">← BACK TO HOME</Link>
        </nav>

        {/* ── MAIN ── */}
        <main style={{ flex:1, paddingTop:"68px", display:"flex", flexDirection:"column", alignItems:"center", position:"relative", overflow:"hidden" }}>

          {/* Ambient orbs */}
          <div style={{ position:"absolute", top:"12%", left:"50%", width:"700px", height:"700px", background:"radial-gradient(circle, rgba(201,146,42,0.05) 0%, transparent 65%)", pointerEvents:"none", animation:"intake-orb-drift 10s ease-in-out infinite", transform:"translate(-50%,-50%)" }} />
          <div style={{ position:"absolute", top:"55%", right:"-8%", width:"400px", height:"400px", background:"radial-gradient(circle, rgba(201,146,42,0.03) 0%, transparent 60%)", pointerEvents:"none" }} />

          <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:"680px", padding:"70px 6% 100px", margin:"0 auto" }}>

            {/* ── HEADER ── */}
            <div className="intake-in" style={{ textAlign:"center", marginBottom:"3.5rem", animationDelay:"0s" }}>
              <p style={{ ...sans, fontSize:"0.63rem", letterSpacing:"0.28em", color:GOLD, fontWeight:"700", marginBottom:"1.1rem" }}>
                DISCOVERY INTAKE
              </p>
              <h1 style={{ ...display, fontSize:"clamp(2.2rem,5.5vw,3.5rem)", fontWeight:"700", lineHeight:"1.06", marginBottom:"1.2rem" }}>
                Tell us about<br />
                <em style={{ fontStyle:"italic", color:GOLD }}>your business.</em>
              </h1>
              <p style={{ ...sans, color:MUTED, maxWidth:"480px", margin:"0 auto", lineHeight:"1.82", fontSize:"0.93rem" }}>
                Fill out this quick form so we can prepare for your call. Takes about 2 minutes. No commitment, no credit card.
              </p>
            </div>

            {/* ── FORM or SUCCESS ── */}
            {submitted ? (
              <div className="intake-in" style={{ textAlign:"center", padding:"60px 2rem" }}>
                <div style={{ position:"relative", display:"inline-block", marginBottom:"2rem" }}>
                  <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"180px", height:"180px", background:"radial-gradient(circle, rgba(201,146,42,0.14) 0%, transparent 65%)", pointerEvents:"none", borderRadius:"50%" }} />
                  <svg viewBox="0 0 80 80" width={80} height={80} style={{ display:"block", position:"relative" }}>
                    <circle cx={40} cy={40} r={36} fill="none" stroke={GOLD} strokeWidth={1.5} strokeOpacity={0.25}/>
                    <polyline points="25,42 36,53 56,30" fill="none" stroke={GOLD} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 style={{ ...display, fontSize:"2.2rem", fontWeight:"700", marginBottom:"1rem" }}>
                  We've got your details.
                </h2>
                <p style={{ ...sans, color:MUTED, fontSize:"0.94rem", lineHeight:"1.8", maxWidth:"400px", margin:"0 auto 1.5rem" }}>
                  {CALENDLY_URL !== "#calendly"
                    ? "Redirecting you to pick a call time..."
                    : "We'll reach out within 2 hours to schedule your discovery call."}
                </p>
                <Link href="/" className="intake-back-link" style={{ fontSize:"0.82rem" }}>← Return to LocalClaw home</Link>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"2.4rem" }}>

                {/* ── Section 1: About You ── */}
                <div data-form-section>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", marginBottom:"1.8rem" }}>
                    <div style={{ width:28, height:28, background:GOLD_MID, border:`1px solid ${BORDER}`, borderRadius:"2px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ ...sans, fontSize:"0.7rem", fontWeight:"700", color:GOLD }}>01</span>
                    </div>
                    <span style={{ ...display, fontSize:"1.15rem", fontWeight:"700", color:CREAM }}>About You</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                    <div>
                      <label style={labelStyle}>FULL NAME *</label>
                      <input name="name" required placeholder="John Smith" className="intake-input" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>EMAIL ADDRESS *</label>
                      <input name="email" type="email" required placeholder="john@company.com" className="intake-input" style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginTop:"1rem" }}>
                    <div>
                      <label style={labelStyle}>BUSINESS NAME *</label>
                      <input name="business" required placeholder="Acme Corp" className="intake-input" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>INDUSTRY</label>
                      <select name="industry" className="intake-input intake-select" style={{ ...inputStyle, cursor:"pointer" }}>
                        <option value="" style={{ background:BG2 }}>Select your industry</option>
                        {["Real Estate","Legal / Law Firm","Healthcare / Clinic","Marketing / Agency","E-Commerce / Retail","Restaurant / Hospitality","Consulting","Finance / Accounting","Construction / Trades","Technology / SaaS","Education","Other"].map(opt => (
                          <option key={opt} value={opt} style={{ background:BG2 }}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── Section 2: Your Team ── */}
                <div data-form-section>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", marginBottom:"1.8rem" }}>
                    <div style={{ width:28, height:28, background:GOLD_MID, border:`1px solid ${BORDER}`, borderRadius:"2px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ ...sans, fontSize:"0.7rem", fontWeight:"700", color:GOLD }}>02</span>
                    </div>
                    <span style={{ ...display, fontSize:"1.15rem", fontWeight:"700", color:CREAM }}>Your Team</span>
                  </div>
                  <label style={labelStyle}>TEAM SIZE</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"0.6rem" }}>
                    {TEAM_OPTIONS.map(opt => (
                      <label key={opt} className="intake-checkbox" style={{ ...sans, fontSize:"0.82rem", color:MUTED, display:"flex", alignItems:"center", gap:"0.5rem" }}>
                        <input type="radio" name="teamSize" value={opt} style={{ display:"none" }}
                          onChange={() => {
                            document.querySelectorAll<HTMLLabelElement>('[name="teamSize"]').forEach(el => {
                              const label = el.closest('.intake-checkbox');
                              if (label) label.classList.remove('active');
                            });
                          }}
                        />
                        <span
                          onClick={(e) => {
                            const parent = (e.target as HTMLElement).closest('.intake-checkbox');
                            document.querySelectorAll('.intake-checkbox').forEach(el => {
                              if (el.querySelector('[name="teamSize"]')) el.classList.remove('active');
                            });
                            parent?.classList.add('active');
                            const radio = parent?.querySelector('input') as HTMLInputElement;
                            if (radio) radio.checked = true;
                          }}
                          style={{ pointerEvents:"none" }}
                        >
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ── Section 3: What to Automate ── */}
                <div data-form-section>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", marginBottom:"1rem" }}>
                    <div style={{ width:28, height:28, background:GOLD_MID, border:`1px solid ${BORDER}`, borderRadius:"2px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ ...sans, fontSize:"0.7rem", fontWeight:"700", color:GOLD }}>03</span>
                    </div>
                    <span style={{ ...display, fontSize:"1.15rem", fontWeight:"700", color:CREAM }}>What Would You Like to Automate?</span>
                  </div>
                  <p style={{ ...sans, color:DIM, fontSize:"0.8rem", marginBottom:"1.2rem" }}>Select all that apply.</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
                    {AUTOMATION_OPTIONS.map(opt => (
                      <div
                        key={opt}
                        className={`intake-checkbox${automations.includes(opt) ? " active" : ""}`}
                        onClick={() => toggleAutomation(opt)}
                        style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}
                      >
                        <div style={{
                          width:16, height:16, borderRadius:"2px", flexShrink:0,
                          border: automations.includes(opt) ? `1.5px solid ${GOLD}` : `1.5px solid ${DIM}`,
                          background: automations.includes(opt) ? "rgba(201,146,42,0.15)" : "transparent",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          transition:"all 0.2s",
                        }}>
                          {automations.includes(opt) && <Check size={10} />}
                        </div>
                        <span style={{ ...sans, fontSize:"0.82rem", color: automations.includes(opt) ? CREAM : MUTED }}>
                          {opt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Section 4: Budget & Details ── */}
                <div data-form-section>
                  <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", marginBottom:"1.8rem" }}>
                    <div style={{ width:28, height:28, background:GOLD_MID, border:`1px solid ${BORDER}`, borderRadius:"2px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ ...sans, fontSize:"0.7rem", fontWeight:"700", color:GOLD }}>04</span>
                    </div>
                    <span style={{ ...display, fontSize:"1.15rem", fontWeight:"700", color:CREAM }}>Budget & Goals</span>
                  </div>

                  <label style={labelStyle}>WHICH PLAN INTERESTS YOU?</label>
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem", marginBottom:"1.6rem" }}>
                    {BUDGET_OPTIONS.map(opt => (
                      <label
                        key={opt.value}
                        className="intake-radio"
                        onClick={(e) => {
                          document.querySelectorAll('.intake-radio').forEach(el => el.classList.remove('active'));
                          (e.currentTarget as HTMLElement).classList.add('active');
                        }}
                      >
                        <input type="radio" name="budget" value={opt.value} style={{ display:"none" }} />
                        <div style={{
                          width:16, height:16, borderRadius:"50%", flexShrink:0,
                          border:`1.5px solid ${DIM}`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          transition:"all 0.2s",
                        }}>
                          <div className="intake-radio-dot" style={{
                            width:0, height:0, borderRadius:"50%", background:GOLD,
                            transition:"all 0.2s",
                          }} />
                        </div>
                        <span style={{ ...sans, fontSize:"0.85rem", color:MUTED }}>{opt.label}</span>
                      </label>
                    ))}
                  </div>

                  <label style={labelStyle}>ANYTHING ELSE WE SHOULD KNOW?</label>
                  <textarea
                    name="details"
                    rows={4}
                    placeholder="Tell us about your biggest pain points, specific workflows you want automated, or any questions you have..."
                    className="intake-input"
                    style={{ ...inputStyle, resize:"vertical", lineHeight:"1.7" }}
                  />
                </div>

                {/* ── Submit ── */}
                <div data-form-section style={{ paddingTop:"0.5rem" }}>
                  <button type="submit" className="intake-submit">
                    SUBMIT & SCHEDULE YOUR CALL →
                  </button>
                  <div style={{ display:"flex", justifyContent:"center", gap:"2rem", flexWrap:"wrap", marginTop:"1.6rem" }}>
                    {["No commitment required", "We respond within 2 hours", "100% confidential"].map((t,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.45rem" }}>
                        <Check size={12} />
                        <span style={{ ...sans, color:DIM, fontSize:"0.77rem" }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </form>
            )}
          </div>
        </main>

        {/* ── FOOTER — matching main page ── */}
        <footer style={{
          borderTop:`1px solid ${BORDER}`,
          padding:"2.4rem 6%",
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          flexWrap:"wrap",
          gap:"1rem",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <ClawIcon size={26} color={GOLD} />
            <span className="lc-logo-text" style={{ fontSize:"1.3rem" }}>LocalClaw</span>
          </div>
          <div style={{ ...sans, color:DIM, fontSize:"0.76rem" }}>Powered by OpenClaw + NVIDIA NemoClaw</div>
          <a href="https://twitter.com/Th3Alch3mist_" target="_blank" rel="noopener noreferrer" style={{ ...sans, color:GOLD, fontSize:"0.76rem", textDecoration:"none" }}>
            @Th3Alch3mist_ on X
          </a>
        </footer>

      </div>
    </>
  );
}
