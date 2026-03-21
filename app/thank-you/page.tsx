"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";

// Brand tokens
const BG      = "#080704";
const BG2     = "#0D0B07";
const GOLD    = "#C9922A";
const CREAM   = "#F5EED8";
const MUTED   = "#9A8F7E";
const DIM     = "#635C50";
const BORDER  = "rgba(201,146,42,0.14)";

const display: React.CSSProperties = { fontFamily:"'Cormorant Garamond', Georgia, serif" };
const sans: React.CSSProperties    = { fontFamily:"'Inter', system-ui, sans-serif" };

// Animated check-mark SVG
function AnimatedCheck() {
  return (
    <svg viewBox="0 0 80 80" width={80} height={80} style={{ display:"block" }}>
      <circle
        cx={40} cy={40} r={36}
        fill="none"
        stroke={GOLD}
        strokeWidth={2}
        strokeOpacity={0.25}
      />
      <circle
        cx={40} cy={40} r={36}
        fill="none"
        stroke={GOLD}
        strokeWidth={2}
        strokeDasharray={226}
        strokeDashoffset={226}
        strokeLinecap="round"
        style={{ animation:"draw-circle 0.7s ease forwards 0.2s" }}
      />
      <polyline
        points="25,42 36,53 56,30"
        fill="none"
        stroke={GOLD}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={50}
        strokeDashoffset={50}
        style={{ animation:"draw-check 0.4s ease forwards 0.85s" }}
      />
    </svg>
  );
}

const STEPS = [
  {
    num: "01",
    title: "Check your email",
    desc: "A confirmation receipt from Stripe is on its way. It confirms your $97 deposit and holds your spot.",
  },
  {
    num: "02",
    title: "We'll reach out within 2 hours",
    desc: "A member of the LocalClaw team will contact you to schedule your 20-minute discovery call.",
  },
  {
    num: "03",
    title: "Go live in under 24 hours",
    desc: "After the call we handle everything — VPS setup, agent configuration, integrations. You just show up.",
  },
];

export default function ThankYouPage() {
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stagger-in the steps on mount
    const items = stepsRef.current?.querySelectorAll<HTMLDivElement>("[data-step]");
    if (!items) return;
    items.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 600 + i * 160);
    });
  }, []);

  return (
    <>
      <style>{`
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .ty-hero { animation: fade-up 0.65s ease both; }
        .ty-badge { animation: fade-up 0.5s ease both; }
      `}</style>

      <div style={{ minHeight:"100vh", background:BG, color:CREAM, display:"flex", flexDirection:"column" }}>

        {/* ── NAV ── */}
        <nav style={{ padding:"1.6rem 6%", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${BORDER}` }}>
          <Link href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:"8px" }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill={GOLD} fillOpacity={0.15} stroke={GOLD} strokeWidth={1.5}/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={GOLD} strokeWidth={1.5} strokeLinecap="round"/>
              <path d="M9 9h.01M15 9h.01" stroke={GOLD} strokeWidth={2} strokeLinecap="round"/>
            </svg>
            <span style={{ ...display, fontSize:"1.3rem", color:CREAM, fontWeight:"600" }}>LocalClaw</span>
          </Link>
          <Link href="/" style={{ ...sans, color:DIM, fontSize:"0.78rem", textDecoration:"none", letterSpacing:"0.1em" }}>
            ← BACK TO HOME
          </Link>
        </nav>

        {/* ── MAIN ── */}
        <main style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 6%", textAlign:"center" }}>

          {/* Glow orb behind check */}
          <div style={{ position:"relative", marginBottom:"2.4rem" }}>
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"200px", height:"200px", background:"radial-gradient(circle, rgba(201,146,42,0.18) 0%, transparent 65%)", pointerEvents:"none" }} />
            <div className="ty-badge" style={{ animationDelay:"0s" }}>
              <AnimatedCheck />
            </div>
          </div>

          <p className="ty-badge" style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.24em", color:GOLD, marginBottom:"1rem", fontWeight:"600", animationDelay:"0.15s" }}>
            PAYMENT CONFIRMED
          </p>

          <h1 className="ty-hero" style={{ ...display, fontSize:"clamp(2.4rem,6vw,4.2rem)", fontWeight:"700", lineHeight:"1.05", marginBottom:"1.2rem", animationDelay:"0.25s" }}>
            You're in.<br />
            <em style={{ fontStyle:"italic", color:GOLD }}>Your spot is reserved.</em>
          </h1>

          <p className="ty-hero" style={{ ...sans, color:MUTED, maxWidth:"480px", margin:"0 auto 1rem", lineHeight:"1.82", fontSize:"0.95rem", animationDelay:"0.35s" }}>
            Your $97 deposit has been received and will be credited in full to your setup fee. Here's exactly what happens next.
          </p>

          {/* ── NEXT STEPS ── */}
          <div ref={stepsRef} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:"1px", background:BORDER, maxWidth:"860px", width:"100%", margin:"4rem auto", borderRadius:"2px", overflow:"hidden" }}>
            {STEPS.map((s, i) => (
              <div data-step key={i} style={{ background:BG2, padding:"2.4rem 2rem", textAlign:"left" }}>
                <div style={{ ...sans, fontSize:"0.62rem", letterSpacing:"0.2em", color:GOLD, fontWeight:"700", marginBottom:"1.2rem" }}>{s.num}</div>
                <div style={{ ...display, fontSize:"1.25rem", fontWeight:"700", marginBottom:"0.8rem", lineHeight:"1.2", color:CREAM }}>{s.title}</div>
                <div style={{ ...sans, color:MUTED, fontSize:"0.86rem", lineHeight:"1.7" }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* ── CONTACT NUDGE ── */}
          <div style={{ background:"rgba(201,146,42,0.06)", border:`1px solid ${BORDER}`, borderRadius:"2px", padding:"2rem 2.8rem", maxWidth:"520px", width:"100%", marginBottom:"3rem" }}>
            <p style={{ ...sans, color:MUTED, fontSize:"0.87rem", lineHeight:"1.75", margin:0 }}>
              We usually reach out within <strong style={{ color:CREAM }}>2 hours</strong> during business hours. If you haven't heard from us by then, DM us directly on X at{" "}
              <a href="https://twitter.com/Th3Alch3mist_" target="_blank" rel="noopener noreferrer" style={{ color:GOLD, textDecoration:"none" }}>@Th3Alch3mist_</a>
              {" "}and we'll get you sorted immediately.
            </p>
          </div>

          <Link
            href="/"
            style={{ ...sans, color:DIM, fontSize:"0.78rem", textDecoration:"none", letterSpacing:"0.1em", padding:"10px 0" }}
          >
            ← Return to LocalClaw home
          </Link>
        </main>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop:`1px solid ${BORDER}`, padding:"1.8rem 6%", display:"flex", justifyContent:"center", alignItems:"center" }}>
          <span style={{ ...sans, color:DIM, fontSize:"0.74rem" }}>Powered by OpenClaw + NVIDIA NemoClaw · &copy; {new Date().getFullYear()} LocalClaw</span>
        </footer>

      </div>
    </>
  );
}
