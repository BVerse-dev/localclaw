"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── Brand tokens (identical to LocalClawClient) ───────────────────────────────
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

// ── Exact ClawIcon from main page ─────────────────────────────────────────────
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

// ── Animated check SVG ────────────────────────────────────────────────────────
function AnimatedCheck() {
  return (
    <svg viewBox="0 0 96 96" width={96} height={96} style={{ display:"block" }}>
      {/* Static dim ring */}
      <circle cx={48} cy={48} r={44} fill="none" stroke={GOLD} strokeWidth={1} strokeOpacity={0.15}/>
      {/* Animated drawing ring */}
      <circle
        cx={48} cy={48} r={44}
        fill="none" stroke={GOLD} strokeWidth={1.5}
        strokeDasharray={276} strokeDashoffset={276}
        strokeLinecap="round"
        style={{ animation:"ty-draw-circle 0.8s cubic-bezier(.4,0,.2,1) forwards 0.2s" }}
      />
      {/* Animated check */}
      <polyline
        points="28,50 42,64 68,36"
        fill="none" stroke={GOLD} strokeWidth={3.5}
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={60} strokeDashoffset={60}
        style={{ animation:"ty-draw-check 0.45s cubic-bezier(.4,0,.2,1) forwards 0.95s" }}
      />
    </svg>
  );
}

// ── Next-step cards ───────────────────────────────────────────────────────────
const STEPS = [
  {
    num:   "01",
    title: "Check your email",
    desc:  "A Stripe receipt is on its way confirming your $97 deposit. Your spot is officially held.",
  },
  {
    num:   "02",
    title: "We reach out within 2 hours",
    desc:  "The LocalClaw team will contact you to schedule your 20-minute scoping call — at your convenience.",
  },
  {
    num:   "03",
    title: "Live in under 24 hours",
    desc:  "After the call we handle everything — VPS setup, agent config, integrations. You just show up.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function ThankYouPage() {
  const stepsRef   = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Nav shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stagger-in the step cards
  useEffect(() => {
    const items = stepsRef.current?.querySelectorAll<HTMLDivElement>("[data-step]");
    if (!items) return;
    items.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 680 + i * 150);
    });
  }, []);

  return (
    <>
      <style>{`
        @keyframes ty-draw-circle { to { stroke-dashoffset: 0; } }
        @keyframes ty-draw-check  { to { stroke-dashoffset: 0; } }
        @keyframes ty-fade-up {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes ty-orb-drift {
          0%,100% { transform:translate(-50%,-50%) scale(1); }
          50%      { transform:translate(-50%,-50%) scale(1.12); }
        }
        .ty-in { animation: ty-fade-up 0.7s cubic-bezier(.22,1,.36,1) both; }
        .ty-step-hover {
          transition: border-color 0.3s, background 0.35s, transform 0.4s cubic-bezier(.22,1,.36,1) !important;
        }
        .ty-step-hover:hover {
          border-color: rgba(201,146,42,0.35) !important;
          background: rgba(201,146,42,0.05) !important;
          transform: translateY(-3px) !important;
        }
        .ty-back-link {
          color: ${DIM};
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: color 0.25s;
        }
        .ty-back-link:hover { color: ${CREAM}; }
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
          <Link href="/" className="ty-back-link">← BACK TO HOME</Link>
        </nav>

        {/* ── MAIN CONTENT — offset for fixed nav ── */}
        <main style={{ flex:1, paddingTop:"68px", display:"flex", flexDirection:"column", alignItems:"center", position:"relative", overflow:"hidden" }}>

          {/* Ambient orbs */}
          <div style={{ position:"absolute", top:"20%", left:"50%", width:"700px", height:"700px", background:"radial-gradient(circle, rgba(201,146,42,0.06) 0%, transparent 65%)", pointerEvents:"none", animation:"ty-orb-drift 9s ease-in-out infinite", transform:"translate(-50%,-50%)" }} />
          <div style={{ position:"absolute", top:"60%", right:"-10%", width:"400px", height:"400px", background:"radial-gradient(circle, rgba(201,146,42,0.04) 0%, transparent 60%)", pointerEvents:"none" }} />

          <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"80px 6% 100px", maxWidth:"1140px", width:"100%", margin:"0 auto" }}>

            {/* Animated check */}
            <div className="ty-in" style={{ marginBottom:"2rem", animationDelay:"0s", position:"relative" }}>
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"220px", height:"220px", background:"radial-gradient(circle, rgba(201,146,42,0.14) 0%, transparent 65%)", pointerEvents:"none", borderRadius:"50%" }} />
              <AnimatedCheck />
            </div>

            {/* Eyebrow */}
            <p className="ty-in" style={{ ...sans, fontSize:"0.63rem", letterSpacing:"0.28em", color:GOLD, fontWeight:"700", marginBottom:"1.1rem", animationDelay:"0.15s" }}>
              PAYMENT CONFIRMED
            </p>

            {/* Headline */}
            <h1 className="ty-in" style={{ ...display, fontSize:"clamp(2.8rem,7vw,5rem)", fontWeight:"700", lineHeight:"1.04", marginBottom:"1.4rem", animationDelay:"0.25s" }}>
              You're in.{" "}
              <em style={{ fontStyle:"italic", color:GOLD }}>Your spot<br />is reserved.</em>
            </h1>

            {/* Sub */}
            <p className="ty-in" style={{ ...sans, color:MUTED, maxWidth:"480px", lineHeight:"1.85", fontSize:"0.96rem", marginBottom:"0.8rem", animationDelay:"0.35s" }}>
              Your $97 deposit has been received and is credited in full toward your setup fee. Here's exactly what happens next.
            </p>

            {/* Divider */}
            <div className="ty-in" style={{ width:"48px", height:"1px", background:GOLD, opacity:0.4, margin:"1.8rem auto 3.5rem", animationDelay:"0.4s" }} />

            {/* ── NEXT STEPS ── */}
            <div
              ref={stepsRef}
              style={{
                display:"grid",
                gridTemplateColumns:"repeat(3,1fr)",
                gap:"1px",
                background:GOLD_BORDER,
                width:"100%",
                overflow:"hidden",
                marginBottom:"3.5rem",
              }}
            >
              {STEPS.map((s, i) => (
                <div
                  data-step
                  key={i}
                  className="ty-step-hover"
                  style={{
                    background: BG2,
                    padding:"2.6rem 2.6rem",
                    textAlign:"left",
                    borderTop:`2px solid ${i === 1 ? GOLD : "transparent"}`,
                  }}
                >
                  <div style={{ ...sans, fontSize:"0.6rem", letterSpacing:"0.22em", color:GOLD, fontWeight:"700", marginBottom:"1.4rem" }}>
                    {s.num}
                  </div>
                  <div style={{ ...display, fontSize:"1.2rem", fontWeight:"700", lineHeight:"1.18", color:CREAM, marginBottom:"0.9rem", whiteSpace:"nowrap" }}>
                    {s.title}
                  </div>
                  <div style={{ ...sans, color:MUTED, fontSize:"0.86rem", lineHeight:"1.78" }}>
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* ── CONTACT NUDGE ── */}
            <div
              className="ty-in"
              style={{
                background: GOLD_MID,
                border:`1px solid ${BORDER}`,
                padding:"2.2rem 3rem",
                maxWidth:"560px",
                width:"100%",
                marginBottom:"3.5rem",
                animationDelay:"0.5s",
                textAlign:"left",
              }}
            >
              <p style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.2em", color:GOLD, fontWeight:"600", marginBottom:"0.9rem" }}>
                NEED TO REACH US?
              </p>
              <p style={{ ...sans, color:MUTED, fontSize:"0.88rem", lineHeight:"1.8", margin:0 }}>
                We typically follow up within <strong style={{ color:CREAM, fontWeight:"600" }}>2 hours</strong> during business hours.
                If you haven't heard from us, DM us on X at{" "}
                <a
                  href="https://twitter.com/Th3Alch3mist_"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color:GOLD, textDecoration:"none", fontWeight:"500" }}
                >
                  @Th3Alch3mist_
                </a>
                {" "}— we'll get you sorted immediately.
              </p>
            </div>

            {/* Back link */}
            <Link href="/" className="ty-back-link">← Return to LocalClaw home</Link>

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
          <a
            href="https://twitter.com/Th3Alch3mist_"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...sans, color:GOLD, fontSize:"0.76rem", textDecoration:"none" }}
          >
            @Th3Alch3mist_ on X
          </a>
        </footer>

      </div>
    </>
  );
}
