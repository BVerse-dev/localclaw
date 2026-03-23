"use client";
// build: 2026-03-21-v4
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
const DashboardPlayer = dynamic(() => import("./DashboardPlayer"), { ssr: false });
import {
  Mail, Calendar, Zap, MessageSquare, BarChart2, Shield,
  MapPin, Home, Activity, Scale, Coffee, TrendingUp, Briefcase, Wrench,
  CheckCircle, Users, Lock, Eye, RefreshCw, Building2, Menu, X,
  Phone, Megaphone, Gift
} from "lucide-react";

// ── Stripe Payment Links ─────────────────────────────────────────────────────
const STRIPE = {
  DISCOVERY:          "https://buy.stripe.com/dRm28tc1s3t0gUnaBI0sU02", // $97 discovery deposit
  STARTER_FULL:       "https://buy.stripe.com/5kQ14p2qSd3AeMf1180sU04", // Starter setup $997
  STARTER_MONTHLY:    "https://buy.stripe.com/6oUdRbd5we7E6fJ25c0sU01", // Starter monthly $149/mo
  BUSINESS_FULL:      "https://buy.stripe.com/aFa00l7Lce7EavZfW20sU05", // Business setup $1,997
  BUSINESS_MONTHLY:   "https://buy.stripe.com/7sY6oJ5D4fbI6fJ25c0sU06", // Business monthly $299/mo
  ENTERPRISE:         "https://buy.stripe.com/4gM9AV4z0d3AgUn7pw0sU07", // Full Stack setup $3,500
  ENTERPRISE_MONTHLY: "https://buy.stripe.com/cNi3cx8Pg0gO1Zt5ho0sU08", // Full Stack monthly $499/mo
};
// ─────────────────────────────────────────────────────────────────────────────

// v2 ── Brand logos via jsDelivr simple-icons (reliable CDN) ──
const SI = (name) => `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${name}.svg`;

const INTEGRATIONS = [
  { name: "Gmail",           src: SI("gmail"),          invert: false, color: "#EA4335" },
  { name: "Google Calendar", src: SI("googlecalendar"), invert: false, color: "#4285F4" },
  { name: "Outlook",         src: SI("microsoftoutlook"),invert: false, color: "#0078D4" },
  { name: "Slack",           src: SI("slack"),          invert: false, color: "#E01E5A" },
  { name: "WhatsApp",        src: SI("whatsapp"),       invert: false, color: "#25D366" },
  { name: "Notion",          src: SI("notion"),         invert: true,  color: "#ffffff" },
  { name: "Google Drive",    src: SI("googledrive"),    invert: false, color: "#4285F4" },
  { name: "Zoom",            src: SI("zoom"),           invert: false, color: "#2D8CFF" },
  { name: "HubSpot",         src: SI("hubspot"),        invert: false, color: "#FF7A59" },
  { name: "GitHub",          src: SI("github"),         invert: true,  color: "#ffffff" },
  { name: "Google Sheets",   src: SI("googlesheets"),   invert: false, color: "#34A853" },
  { name: "Telegram",        src: SI("telegram"),       invert: false, color: "#26A5E4" },
];

const GOLD        = "#C9922A";
const GOLD_MID    = "rgba(201,146,42,0.08)";
const GOLD_BORDER = "rgba(201,146,42,0.22)";
const GOLD_DIM    = "rgba(201,146,42,0.12)";
const CREAM       = "#F5F0E8";
const MUTED       = "#A89880";
const DIM         = "#7A6E62";
const BG          = "#0A0A0A";
const BG2         = "#0D0D0D";
const BORDER      = "rgba(245,240,232,0.06)";
const GREEN       = "#22C55E";

const sans    = { fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" };
const display = { fontFamily: "'Cormorant Garamond',Georgia,serif" };



// ── Claw SVG icon (inline, no image dependency) ──
function ClawIcon({ size = 36, color = GOLD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Three curved claw slash marks */}
      <path d="M10 6 C10 6, 7 14, 9 24 C10 30, 14 34, 16 36" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M18 4 C18 4, 16 13, 18 23 C19.5 29.5, 22 33, 23 36" stroke={color} strokeWidth="3.2" strokeLinecap="round" fill="none"/>
      <path d="M26 6 C26 6, 25 15, 27 24 C28.5 30, 30 33, 30 36" stroke={color} strokeWidth="2.6" strokeLinecap="round" fill="none"/>
      {/* Top claw tips - small curves suggesting curved talons */}
      <path d="M10 6 C11 3, 14 2, 15 4" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M18 4 C19 1, 22 1, 22 3" stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none"/>
      <path d="M26 6 C27 3, 30 3, 29 5" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export default function LocalClaw() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Load GSAP + ScrollTrigger from CDN
    const loadGSAP = () => {
      return new Promise((resolve) => {
        if (window.gsap && window.ScrollTrigger) { resolve(); return; }
        const s1 = document.createElement("script");
        s1.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
        s1.onload = () => {
          const s2 = document.createElement("script");
          s2.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";
          s2.onload = resolve;
          document.head.appendChild(s2);
        };
        document.head.appendChild(s1);
      });
    };

    loadGSAP().then(() => {
      const { gsap } = window;
      const { ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);

      // ── HERO: premium staggered entrance ──
      const heroTL = gsap.timeline({ defaults: { ease: "power4.out" } });

      heroTL
        .fromTo("[data-hero-badge]",
          { opacity: 0, y: -24, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8 }, 0.1)
        .fromTo("[data-hero-h1]",
          { opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" },
          { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 1.1 }, 0.25)
        .fromTo("[data-hero-sub]",
          { opacity: 0, y: 28, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, 0.45)
        .fromTo("[data-hero-btns]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8 }, 0.6)
        .fromTo("[data-hero-connects]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.85 }, 0.75)
        .fromTo("[data-hero-trust]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8 }, 0.9)
        .fromTo("[data-hero-dashboard]",
          { opacity: 0, x: 80, scale: 0.92, rotateY: 8 },
          { opacity: 1, x: 0, scale: 1, rotateY: 0, duration: 1.3, ease: "power3.out" }, 0.35);

      // ── HERO PARALLAX: background orbs move on scroll ──
      gsap.to(".hero-orb-1", {
        y: -120,
        scrollTrigger: { trigger: "[data-hero-h1]", start: "top top", end: "bottom top", scrub: 1.5 }
      });
      gsap.to(".hero-orb-2", {
        y: -80,
        scrollTrigger: { trigger: "[data-hero-h1]", start: "top top", end: "bottom top", scrub: 2 }
      });

      // ── STATS BAR: stagger + counter animation ──
      gsap.fromTo("[data-stat]",
        { opacity: 0, y: 32, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.2)", stagger: 0.12,
          scrollTrigger: { trigger: "[data-stats-bar]", start: "top 85%", once: true }
        }
      );

      // ── WHAT IT DOES: heading with clip reveal ──
      gsap.fromTo("[data-what-head]",
        { opacity: 0, y: 36, clipPath: "inset(0 0 100% 0)" },
        { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "power4.out",
          scrollTrigger: { trigger: "[data-what-head]", start: "top 88%", once: true }
        }
      );

      // ── Big 3 revenue cards: staggered with scale ──
      gsap.fromTo("[data-big3-card]",
        { opacity: 0, y: 50, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "back.out(1.1)", stagger: 0.15,
          scrollTrigger: { trigger: "[data-big3]", start: "top 82%", once: true }
        }
      );

      // ── Separator line with premium width anim ──
      gsap.fromTo("[data-separator]",
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1, duration: 1.2, ease: "power2.inOut",
          scrollTrigger: { trigger: "[data-separator]", start: "top 90%", once: true }
        }
      );

      // ── Supporting 6 agent cards: stagger with blur ──
      gsap.fromTo("[data-agent-card]",
        { opacity: 0, y: 40, filter: "blur(4px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: "[data-agents-grid]", start: "top 82%", once: true }
        }
      );

      // ── Bottom CTA strip ──
      gsap.fromTo("[data-bottom-cta]",
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: "[data-bottom-cta]", start: "top 88%", once: true }
        }
      );

      // ── WHO IT'S FOR section ──
      gsap.fromTo("[data-for-head]",
        { opacity: 0, y: 32, clipPath: "inset(0 0 100% 0)" },
        { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.85, ease: "power4.out",
          scrollTrigger: { trigger: "[data-for-head]", start: "top 88%", once: true }
        }
      );
      gsap.fromTo("[data-for-card]",
        { opacity: 0, y: 36, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "back.out(1.1)", stagger: 0.06,
          scrollTrigger: { trigger: "[data-for-grid]", start: "top 82%", once: true }
        }
      );

      // ── HOW IT WORKS steps: slide + clip reveal ──
      gsap.fromTo("[data-step]",
        { opacity: 0, x: -50, clipPath: "inset(0 100% 0 0)" },
        {
          opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power4.out", stagger: 0.18,
          scrollTrigger: { trigger: "[data-steps]", start: "top 82%", once: true }
        }
      );

      // ── SECURITY section: premium slide-in ──
      gsap.fromTo("[data-security-left]",
        { opacity: 0, x: -50, filter: "blur(4px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, ease: "power4.out",
          scrollTrigger: { trigger: "[data-security]", start: "top 80%", once: true }
        }
      );
      gsap.fromTo("[data-security-right]",
        { opacity: 0, x: 50, filter: "blur(4px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, ease: "power4.out", delay: 0.12,
          scrollTrigger: { trigger: "[data-security]", start: "top 80%", once: true }
        }
      );

      // ── PRICING cards: staggered spring ──
      gsap.fromTo("[data-pricing-card]",
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "back.out(1.2)", stagger: 0.14,
          scrollTrigger: { trigger: "[data-pricing]", start: "top 82%", once: true }
        }
      );

      // ── TESTIMONIALS: stagger with subtle rotation ──
      gsap.fromTo("[data-testimonial]",
        { opacity: 0, y: 36, rotateX: 8 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: "[data-testimonials]", start: "top 82%", once: true }
        }
      );

      // ── CTA SECTION: dramatic entrance ──
      gsap.fromTo("[data-cta-head]",
        { opacity: 0, y: 44, scale: 0.95, clipPath: "inset(0 0 100% 0)" },
        { opacity: 1, y: 0, scale: 1, clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power4.out",
          scrollTrigger: { trigger: "[data-cta]", start: "top 82%", once: true }
        }
      );
      gsap.fromTo("[data-cta-sub]",
        { opacity: 0, y: 24, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out", delay: 0.18,
          scrollTrigger: { trigger: "[data-cta]", start: "top 82%", once: true }
        }
      );
      gsap.fromTo("[data-cta-btn]",
        { opacity: 0, y: 20, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.7)", delay: 0.32,
          scrollTrigger: { trigger: "[data-cta]", start: "top 82%", once: true }
        }
      );

      // ── NAV: background opacity on scroll ──
      ScrollTrigger.create({
        start: "top -80",
        onUpdate: (self) => {
          const nav = document.querySelector("nav");
          if (nav) {
            const scrolled = self.direction === 1 ? true : window.scrollY > 80;
            nav.style.borderBottomColor = scrolled ? "rgba(201,146,42,0.22)" : "rgba(201,146,42,0.08)";
            nav.style.boxShadow = scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none";
          }
        }
      });
    });

    return () => {
      // cleanup: remove ScrollTrigger instances if component unmounts
      if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div style={{ fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif", background:BG, color:CREAM, minHeight:"100vh", overflowX:"hidden" }}>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, background:"rgba(10,10,10,0.97)", borderBottom:`1px solid ${GOLD_BORDER}`, padding:"0 5%", display:"flex", alignItems:"center", justifyContent:"space-between", height:"68px", backdropFilter:"blur(14px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <ClawIcon size={32} color={GOLD} />
          <span className="lc-logo-text">LocalClaw</span>
        </div>
        <div className="nav-desktop">
          <a href="#what" className="nav-link">WHAT IT DOES</a>
          <a href="#how" className="nav-link">HOW IT WORKS</a>
          <a href="#pricing" className="nav-link">PRICING</a>
          <a href="#security" className="nav-link">SECURITY</a>
          <a href="/blog" className="nav-link">BLOG</a>
          <a href="/playbook" className="nav-link">PLAYBOOK</a>
          <a href="/intake" className="btn-primary" style={{ padding:"10px 20px", fontSize:"0.75rem" }}>BOOK A CALL</a>
        </div>
        <button className="nav-mobile-toggle" onClick={() => setMobileOpen(o => !o)} style={{ background:"none", border:"none", cursor:"pointer", color:CREAM, padding:"8px", display:"none" }}>
          {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`} style={{ position:"fixed", top:"68px", left:0, right:0, zIndex:190, background:"rgba(10,10,10,0.99)", borderBottom:`1px solid ${GOLD_BORDER}`, flexDirection:"column", padding:"1.5rem 5%", gap:"1.2rem", backdropFilter:"blur(14px)" }}>
        {["#what","#how","#pricing","#security","/blog","/playbook"].map((href, i) => (
          <a key={i} href={href} className="nav-link" onClick={() => setMobileOpen(false)} style={{ fontSize:"0.9rem", padding:"0.4rem 0", borderBottom:`1px solid ${BORDER}`, display:"block" }}>
            {["WHAT IT DOES","HOW IT WORKS","PRICING","SECURITY","BLOG","PLAYBOOK"][i]}
          </a>
        ))}
        <a href="/intake" className="btn-primary" onClick={() => setMobileOpen(false)} style={{ textAlign:"center", marginTop:"0.5rem" }}>BOOK A CALL</a>
      </div>

      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"150px 6% 90px", position:"relative", overflow:"hidden" }}>
        <div className="hero-orb-1" style={{ position:"absolute", top:"10%", right:"-5%", width:"700px", height:"700px", background:"radial-gradient(circle, rgba(201,146,42,0.05) 0%, transparent 65%)", pointerEvents:"none" }} />
        <div className="hero-orb-2" style={{ position:"absolute", bottom:"5%", left:"-5%", width:"500px", height:"500px", background:"radial-gradient(circle, rgba(201,146,42,0.03) 0%, transparent 65%)", pointerEvents:"none" }} />
        <div className="hero-orb-2" style={{ position:"absolute", top:"40%", left:"30%", width:"400px", height:"400px", background:"radial-gradient(circle, rgba(201,146,42,0.02) 0%, transparent 60%)", pointerEvents:"none" }} />

        <div className="hero-layout" style={{ maxWidth:"1200px", margin:"0 auto", width:"100%", position:"relative", zIndex:1 }}>

          {/* Left — copy */}
          <div>
            <div data-hero-badge style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:GOLD_MID, border:`1px solid ${GOLD_BORDER}`, borderRadius:"100px", padding:"6px 18px", marginBottom:"2.2rem" }}>
              <div style={{ width:5, height:5, background:GOLD, borderRadius:"50%" }} />
              <span style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.2em", color:GOLD, fontWeight:"600" }}>LOCALCLAW AGENT ENGINE</span>
            </div>

            <h1 data-hero-h1 style={{ ...display, fontSize:"clamp(2.6rem,5.5vw,5rem)", lineHeight:"1.04", fontWeight:"700", marginBottom:"1.8rem", letterSpacing:"-0.02em" }}>
              We deploy AI agents<br />
              <em className="shimmer-text" style={{ fontStyle:"italic" }}>for local businesses</em><br />
              that never sleep.
            </h1>

            <p data-hero-sub style={{ ...sans, fontSize:"1rem", color:MUTED, maxWidth:"500px", lineHeight:"1.8", marginBottom:"2.8rem", fontWeight:"400" }}>
              LocalClaw combines OpenClaw's autonomous agent framework with NVIDIA NemoClaw enterprise security — deployed and managed for your business. No technical knowledge required.
            </p>

            <div data-hero-btns className="cta-btns" style={{ display:"flex", gap:"1rem", flexWrap:"wrap", alignItems:"center", marginBottom:"3rem" }}>
              <a href="/intake?plan=discovery" className="btn-primary" style={{ padding:"16px 32px" }}>START WITH $97 DEPOSIT</a>
              <a href="#how" className="btn-secondary" style={{ padding:"16px 32px" }}>SEE HOW IT WORKS</a>
            </div>

            {/* Connects To */}
            <div data-hero-connects className="connects-strip" style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"2.8rem" }}>
              <span style={{ ...sans, fontSize:"0.63rem", letterSpacing:"0.2em", color:DIM, fontWeight:"600", whiteSpace:"nowrap" }}>CONNECTS TO</span>
              <div style={{ display:"flex", alignItems:"center" }}>
                {INTEGRATIONS.map((app, i) => (
                  <div key={i} className="int-icon" title={app.name}
                    style={{ marginLeft: i===0 ? 0 : "-9px", zIndex:INTEGRATIONS.length - i }}>
                    <img src={app.src} alt={app.name}
                      style={{ filter: app.invert ? "invert(1) brightness(1.2)" : `brightness(0) saturate(100%) invert(1)`, opacity: app.invert ? 0.9 : 1 }} />
                  </div>
                ))}
                <div style={{ marginLeft:"-9px", zIndex:0, height:"36px", minWidth:"68px", borderRadius:"100px", background:"rgba(255,255,255,0.07)", border:"1.5px solid rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 12px" }}>
                  <span style={{ ...sans, fontSize:"0.7rem", fontWeight:"700", color:CREAM }}>+10,000</span>
                </div>
              </div>
            </div>

            {/* Trust tags */}
            <div data-hero-trust className="hero-trust" style={{ display:"flex", gap:"2.5rem", flexWrap:"wrap" }}>
              {[["OpenClaw Powered","Open-source agent framework"],["NVIDIA NemoClaw","Enterprise security layer"],["Same-Day Live","In under 24 hours"]].map(([t,s],i) => (
                <div key={i}>
                  <div style={{ ...sans, fontSize:"0.84rem", fontWeight:"600", color:CREAM, marginBottom:"0.18rem" }}>{t}</div>
                  <div style={{ ...sans, fontSize:"0.74rem", color:DIM }}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — dashboard */}
          <div data-hero-dashboard className="dashboard-col">
            <div className="dashboard-glow" style={{ borderRadius:"12px" }}>
              <DashboardPlayer />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background:GOLD_MID, borderTop:`1px solid ${GOLD_BORDER}`, borderBottom:`1px solid ${GOLD_BORDER}`, padding:"2.2rem 6%" }}>
        <div data-stats-bar className="stats-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem", maxWidth:"960px", margin:"0 auto", textAlign:"center" }}>
          {[["24 Hours","SETUP WINDOW"],["NemoClaw™","SECURITY LAYER"],["24 / 7","AGENT UPTIME"],["Telegram","INTERFACE"]].map(([val,label],i) => (
            <div data-stat key={i}>
              <div style={{ ...display, fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:"700", color:GOLD, marginBottom:"0.25rem" }}>{val}</div>
              <div style={{ ...sans, fontSize:"0.63rem", letterSpacing:"0.18em", color:DIM }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT IT DOES ── */}
      <section id="what" style={{ padding:"100px 6%", background:BG }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div data-what-head><p style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.22em", color:GOLD, marginBottom:"1rem", fontWeight:"600" }}>WHAT YOUR AGENT DOES</p></div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"2rem", marginBottom:"4rem" }}>
            <div>
              <h2 style={{ ...display, fontSize:"clamp(2rem,4.5vw,3.3rem)", fontWeight:"700", lineHeight:"1.1" }}>Not another chatbot.<br /><em style={{ color:GOLD, fontStyle:"italic" }}>A full operating system</em><br />for your business.</h2>
            </div>
            <p style={{ ...sans, color:MUTED, maxWidth:"360px", lineHeight:"1.78", fontSize:"0.93rem" }}>Nine specialised agents working in parallel — handling your inbox, closing leads, making calls, posting content, and marketing your brand 24 hours a day.</p>
          </div>

          {/* BIG 3 — Revenue agents */}
          <div data-big3 className="features-big" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", background:GOLD_BORDER, marginBottom:"1px" }}>
            {[
              {
                Icon: Gift,
                tag: "LEAD MAGNET AGENT",
                color: "#A855F7",
                title: "Capture & Qualify Leads 24/7",
                desc: "Deploys lead magnets, captures visitor info, qualifies prospects against your criteria, and routes hot leads directly to you on Telegram — while you sleep.",
                bullets: ["Free resource delivery automation","Lead scoring & qualification","Instant Telegram alerts for hot leads","CRM auto-population"],
              },
              {
                Icon: Phone,
                tag: "CALLING AGENT",
                color: "#22C55E",
                title: "AI That Calls Your Leads",
                desc: "Makes outbound calls to new leads, handles inbound enquiries, books appointments directly into your calendar, and logs every conversation automatically.",
                bullets: ["Outbound follow-up calls","Inbound call handling","Auto-book to your calendar","Call summaries to Telegram"],
              },
              {
                Icon: Megaphone,
                tag: "SOCIAL & MARKETING AGENT",
                color: "#3B82F6",
                title: "Posts, Markets & Drives Conversions",
                desc: "Creates and schedules content across Instagram, TikTok, X, and LinkedIn. Runs targeted campaigns, responds to DMs, and tracks what converts — all on autopilot.",
                bullets: ["Daily content creation & posting","DM responses & engagement","Ad campaign monitoring","Conversion tracking & reporting"],
              },
            ].map(({ Icon, tag, color, title, desc, bullets }, i) => (
              <div data-big3-card key={i} style={{ background:"#0E0C08", padding:"2.8rem 2.4rem", borderTop:`3px solid ${color}`, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, right:0, width:"130px", height:"130px", background:`radial-gradient(circle at top right, ${color}15 0%, transparent 70%)`, pointerEvents:"none" }} />
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"1.6rem" }}>
                  <div style={{ width:44, height:44, borderRadius:"8px", background:`${color}18`, border:`1px solid ${color}35`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon size={20} color={color} strokeWidth={1.5} />
                  </div>
                  <span style={{ ...sans, fontSize:"0.62rem", letterSpacing:"0.18em", color:color, fontWeight:"700" }}>{tag}</span>
                </div>
                <div style={{ ...display, fontSize:"1.3rem", fontWeight:"700", marginBottom:"1rem", lineHeight:"1.2", color:CREAM }}>{title}</div>
                <div style={{ ...sans, color:MUTED, fontSize:"0.87rem", lineHeight:"1.7", marginBottom:"1.6rem" }}>{desc}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                  {bullets.map((b, j) => (
                    <div key={j} style={{ display:"flex", gap:"0.7rem", alignItems:"center" }}>
                      <div style={{ width:5, height:5, borderRadius:"50%", background:color, flexShrink:0 }} />
                      <span style={{ ...sans, fontSize:"0.82rem", color:MUTED }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Gold separator between the two grids ── */}
          <div data-separator style={{ height:"2px", background:`linear-gradient(90deg, transparent 0%, ${GOLD_BORDER} 10%, ${GOLD} 50%, ${GOLD_BORDER} 90%, transparent 100%)`, margin:"0" }} />

          {/* Supporting 6 agents */}
          <div data-agents-grid className="features-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", background:GOLD_BORDER }}>
            {[
              { Icon:Mail,          time:"Every 30 min",  title:"Inbox Triage",        desc:"Scans your email, flags urgent messages, drafts replies for review — never miss a lead or client query again." },
              { Icon:Calendar,      time:"9:00 AM Daily", title:"Morning Briefing",    desc:"Sends a Telegram summary of today's meetings, attendee backgrounds, priorities, and action items before your day starts." },
              { Icon:Zap,           time:"On Demand",     title:"Instant Actions",     desc:"Running 10 min late — your agent emails the next meeting and reschedules. Talk to it like a human assistant." },
              { Icon:MessageSquare, time:"Ongoing",       title:"Comms Monitor",       desc:"Watches Slack, WhatsApp, and CRM threads. Surfaces what matters and filters what doesn't." },
              { Icon:BarChart2,     time:"Weekly",        title:"Performance Reports", desc:"Automated KPI summaries to Telegram — campaign results, lead counts, follow-up status, and action items." },
              { Icon:Shield,        time:"Always",        title:"NemoClaw Security",   desc:"NVIDIA's enterprise guardrails run on every agent action. Your credentials never leave your infrastructure." },
            ].map(({ Icon,time,title,desc },i) => (
              <div data-agent-card key={i} style={{ background:BG2, padding:"2.2rem 2rem" }}>
                <div style={{ width:38, height:38, background:GOLD_MID, border:`1px solid ${GOLD_BORDER}`, borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.2rem" }}>
                  <Icon size={16} color={GOLD} strokeWidth={1.5} />
                </div>
                <div style={{ ...sans, fontSize:"0.63rem", letterSpacing:"0.18em", color:GOLD, marginBottom:"0.45rem", fontWeight:"600" }}>{time}</div>
                <div style={{ ...display, fontWeight:"700", marginBottom:"0.6rem", fontSize:"1.18rem" }}>{title}</div>
                <div style={{ ...sans, color:DIM, fontSize:"0.86rem", lineHeight:"1.65" }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <div data-bottom-cta style={{ marginTop:"1px", background:"linear-gradient(135deg, rgba(201,146,42,0.07) 0%, rgba(201,146,42,0.03) 100%)", border:`1px solid ${GOLD_BORDER}`, borderTop:"none", padding:"2rem 2.4rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <div style={{ ...display, fontSize:"1.15rem", fontWeight:"700", marginBottom:"0.3rem" }}>Every agent, fully managed by us.</div>
              <div style={{ ...sans, color:DIM, fontSize:"0.85rem" }}>You pick which agents you need. We deploy, tune, and maintain them.</div>
            </div>
            <a href="#pricing" className="btn-primary" style={{ padding:"12px 28px", fontSize:"0.8rem" }}>SEE PRICING</a>
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ padding:"90px 6%", background:BG2 }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <p style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.22em", color:GOLD, marginBottom:"1rem", fontWeight:"600" }}>BUILT FOR</p>
          <h2 data-for-head style={{ ...display, fontSize:"clamp(2rem,4.5vw,3.2rem)", fontWeight:"700", marginBottom:"3.5rem", lineHeight:"1.08" }}>Any business that needs leverage.</h2>
          <div data-for-grid className="for-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", background:GOLD_BORDER }}>
            {[
              { Icon:MapPin,     label:"Local Businesses",         desc:"Any business, any size, any industry. If you operate locally, your agent works harder than your competition's team." },
              { Icon:Home,       label:"Realtors & Brokers",       desc:"Lead follow-up, listing updates, client briefings, and appointment scheduling — all automated." },
              { Icon:Activity,   label:"Clinics & Practices",      desc:"Appointment triage, patient communications, staff coordination, and supplier follow-ups streamlined." },
              { Icon:Scale,      label:"Law Firms",                desc:"Case tracking, client follow-up, document summaries, and deadline alerts managed autonomously." },
              { Icon:Coffee,     label:"Restaurants & Hospitality",desc:"Reservation management, supplier comms, daily ops reports, and promotion scheduling automated." },
              { Icon:Building2,  label:"Property Managers",        desc:"Tenant communications, maintenance triage, lease renewals, and contractor coordination automated." },
              { Icon:TrendingUp, label:"Agencies & Studios",       desc:"Client reporting, project management, billing follow-ups, and creative workflows running in parallel." },
              { Icon:Briefcase,  label:"Investors & VCs",          desc:"Deal flow tracking, portfolio updates, LP communications, and meeting prep — all on autopilot." },
              { Icon:Wrench,     label:"Contractors & Trades",     desc:"Quote follow-ups, job scheduling, supplier coordination, and invoice reminders — zero manual overhead." },
            ].map(({ Icon,label,desc },i) => (
              <div data-for-card key={i} className="card-hover" style={{ background:BG, padding:"2rem 1.8rem", border:"1px solid transparent", cursor:"default" }}>
                <div style={{ width:36, height:36, background:GOLD_MID, border:`1px solid ${GOLD_BORDER}`, borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1.1rem" }}>
                  <Icon size={15} color={GOLD} strokeWidth={1.5} />
                </div>
                <div style={{ ...display, fontWeight:"700", marginBottom:"0.5rem", fontSize:"1.1rem" }}>{label}</div>
                <div style={{ ...sans, color:DIM, fontSize:"0.84rem", lineHeight:"1.6" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding:"100px 6%" }}>
        <div style={{ maxWidth:"840px", margin:"0 auto" }}>
          <p style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.22em", color:GOLD, marginBottom:"1rem", fontWeight:"600" }}>THE PROCESS</p>
          <h2 style={{ ...display, fontSize:"clamp(2rem,4.5vw,3.2rem)", fontWeight:"700", marginBottom:"4rem", lineHeight:"1.08" }}>Go live same day.<br />No technical knowledge needed.</h2>
          <div data-steps>
          {[
            { num:"01", Icon:Users,     title:"Kickoff Call",    duration:"20–45 min",   desc:"We map your integrations — email, calendar, CRM, Slack — identify your highest-leverage workflows, and plan your agent configuration. You tell us what to automate. We handle everything else." },
            { num:"02", Icon:Lock,      title:"Deploy & Secure", duration:"Same Day",    desc:"We provision your infrastructure, install OpenClaw, layer NVIDIA NemoClaw guardrails, configure Composio OAuth middleware, and wire every integration. Docker sandboxing and firewall hardening included." },
            { num:"03", Icon:RefreshCw, title:"14-Day Hypercare",duration:"Full Support",desc:"You get a dedicated Slack channel with direct access to our team. We tune workflows, expand permissions as trust builds, fix edge cases, and make sure your agent earns its keep from day one." },
          ].map((step,i) => (
            <div data-step key={i} className="step-row" style={{ display:"flex", gap:"3rem", padding:"3rem 0", borderBottom: i<2 ? `1px solid ${BORDER}` : "none", alignItems:"flex-start" }}>
              <div style={{ ...display, fontSize:"clamp(3rem,6vw,5rem)", fontWeight:"700", color:GOLD_DIM, lineHeight:"1", flexShrink:0, minWidth:"72px" }}>{step.num}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.9rem", marginBottom:"1rem", flexWrap:"wrap" }}>
                  <div style={{ width:34, height:34, background:GOLD_MID, border:`1px solid ${GOLD_BORDER}`, borderRadius:"3px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <step.Icon size={15} color={GOLD} strokeWidth={1.5} />
                  </div>
                  <div style={{ ...display, fontSize:"1.35rem", fontWeight:"700" }}>{step.title}</div>
                  <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.15em", color:GOLD, background:GOLD_MID, padding:"4px 12px", borderRadius:"100px", fontWeight:"600" }}>{step.duration}</div>
                </div>
                <div style={{ ...sans, color:MUTED, lineHeight:"1.78", fontSize:"0.92rem" }}>{step.desc}</div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY ── */}
      <section id="security" style={{ padding:"100px 6%", background:BG2 }}>
        <div data-security className="security-grid" style={{ maxWidth:"1100px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6rem", alignItems:"center" }}>
          <div>
            <p style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.22em", color:GOLD, marginBottom:"1rem", fontWeight:"600" }}>ENTERPRISE SECURITY</p>
            <h2 data-security-left style={{ ...display, fontSize:"clamp(2rem,4vw,3.2rem)", fontWeight:"700", marginBottom:"1.4rem", lineHeight:"1.08" }}>
              Secured with<br /><em style={{ color:GOLD, fontStyle:"italic" }}>NVIDIA NemoClaw</em>
            </h2>
            <p style={{ ...sans, color:MUTED, lineHeight:"1.78", marginBottom:"2.2rem", fontSize:"0.92rem" }}>
              Most OpenClaw deployments have security gaps — exposed credentials, no audit trail, no sandbox. Every LocalClaw deployment ships with NVIDIA's NemoClaw guardrails baked in from day one.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.9rem" }}>
              {["Credentials never exposed — Composio OAuth middleware handles all tokens","Docker sandboxing prevents arbitrary code execution","Firewall hardening and exec allowlists configured from day one","Read-only permissions by default — access expands as trust builds","Instant kill switch to revoke any integration immediately","Full audit trail on every agent action"].map((item,i) => (
                <div key={i} style={{ display:"flex", gap:"0.85rem", alignItems:"flex-start" }}>
                  <CheckCircle size={14} color={GOLD} strokeWidth={1.5} style={{ flexShrink:0, marginTop:"3px" }} />
                  <span style={{ ...sans, color:MUTED, fontSize:"0.87rem", lineHeight:"1.55" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div data-security-right style={{ display:"flex", flexDirection:"column", gap:"1.4rem" }}>
            {[
              { Icon:Eye,         tag:"ALREADY RUNNING OPENCLAW?", title:"We will audit your setup.",  body:"Most self-installs have security gaps. We audit your existing deployment, add NemoClaw guardrails, harden your firewall, and migrate you to managed care." },
              { Icon:CheckCircle, tag:"100% SATISFACTION",          title:"Guaranteed or refunded.",    body:"If you are not happy with your agent deployment, we will refund you — no questions asked. We are here to build, not to nickel and dime." },
            ].map(({ Icon,tag,title,body },i) => (
              <div key={i} style={{ background:GOLD_MID, border:`1px solid ${GOLD_BORDER}`, padding:"2rem", borderRadius:"2px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"9px", marginBottom:"0.9rem" }}>
                  <Icon size={15} color={GOLD} strokeWidth={1.5} />
                  <span style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:GOLD, fontWeight:"600" }}>{tag}</span>
                </div>
                <div style={{ ...display, fontWeight:"700", marginBottom:"0.7rem", fontSize:"1.2rem" }}>{title}</div>
                <div style={{ ...sans, color:DIM, fontSize:"0.86rem", lineHeight:"1.65" }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding:"100px 6%" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <p style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.22em", color:GOLD, marginBottom:"1rem", fontWeight:"600", textAlign:"center" }}>PLANS & PRICING</p>
          <h2 style={{ ...display, fontSize:"clamp(2rem,4.5vw,3.2rem)", fontWeight:"700", marginBottom:"0.8rem", textAlign:"center", lineHeight:"1.08" }}>Choose your deployment.</h2>
          <p style={{ ...sans, color:MUTED, textAlign:"center", marginBottom:"4rem", fontSize:"0.92rem" }}>One-time setup fee. Monthly retainer keeps your agent tuned, updated, and running.</p>
          <div data-pricing className="pricing-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", background:GOLD_BORDER }}>
            {[
              { name:"Starter Agent",  tag:"SOLO OPERATORS", setup:"$997",   monthly:"$149/mo", highlight:false, desc:"One agent for one operator. Email triage, calendar management, daily briefings via Telegram.", features:["1 Executive Agent","Email + Calendar integration","Daily morning briefing","Telegram interface","NemoClaw security layer","14-day hypercare","Dedicated Slack channel"] },
              { name:"Business Engine",tag:"MOST POPULAR",   setup:"$1,997", monthly:"$299/mo", highlight:true,  desc:"Two to three agents for your core team — Owner, Sales, and Ops running in parallel with shared context.", features:["2–3 Executive Agents","CRM + Email + Calendar","Sales follow-up automation","Slack + WhatsApp interface","NemoClaw security layer","14-day hypercare","Priority support channel"] },
              { name:"Full Stack",     tag:"ENTERPRISE",     setup:"$3,500", monthly:"$499/mo", highlight:false, desc:"Full agent deployment for multi-location businesses, law firms, clinics, and growing teams.", features:["5+ Executive Agents","Full integration stack","Custom workflow engineering","KPI dashboard setup","NemoClaw enterprise layer","30-day hypercare","Dedicated account manager"] },
            ].map((plan,i) => (
              <div data-pricing-card key={i} style={{ background: plan.highlight ? "#100E06" : BG2, padding:"2.8rem 2.2rem", position:"relative", borderTop:`2px solid ${plan.highlight ? GOLD : "transparent"}` }}>
                {plan.highlight && <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%) translateY(-50%)", background:GOLD, color:BG, ...sans, fontSize:"0.6rem", letterSpacing:"0.18em", fontWeight:"700", padding:"4px 14px", whiteSpace:"nowrap" }}>MOST POPULAR</div>}
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.18em", color:GOLD, marginBottom:"0.7rem", fontWeight:"600" }}>{plan.tag}</div>
                <div style={{ ...display, fontSize:"1.5rem", fontWeight:"700", marginBottom:"0.5rem" }}>{plan.name}</div>
                <div style={{ marginBottom:"1.6rem" }}>
                  <span style={{ ...display, fontSize:"2.5rem", fontWeight:"700", color:GOLD }}>{plan.setup}</span>
                  <span style={{ ...sans, color:DIM, fontSize:"0.83rem" }}> setup + {plan.monthly}</span>
                </div>
                <div style={{ ...sans, color:MUTED, fontSize:"0.87rem", lineHeight:"1.65", marginBottom:"1.8rem", paddingBottom:"1.8rem", borderBottom:`1px solid ${BORDER}` }}>{plan.desc}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.85rem", marginBottom:"2.2rem" }}>
                  {plan.features.map((f,j) => (
                    <div key={j} style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start" }}>
                      <CheckCircle size={13} color={GOLD} strokeWidth={1.5} style={{ flexShrink:0, marginTop:"3px" }} />
                      <span style={{ ...sans, color:MUTED, fontSize:"0.86rem" }}>{f}</span>
                    </div>
                  ))}
                </div>
                {/* Dual-path CTAs */}
                <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                  <a
                    href={`/intake?plan=${plan.tag === "SOLO OPERATORS" ? "starter" : plan.tag === "MOST POPULAR" ? "business" : "fullstack"}`}
                    className={plan.highlight ? "btn-primary" : "btn-secondary"}
                    style={{ display:"block", textAlign:"center" }}
                  >
                    BOOK DISCOVERY CALL · $97
                  </a>
                  <a
                    href={`/intake?plan=${plan.tag === "SOLO OPERATORS" ? "starter" : plan.tag === "MOST POPULAR" ? "business" : "fullstack"}`}
                    style={{ ...sans, display:"block", textAlign:"center", color:DIM, fontSize:"0.77rem", textDecoration:"none", padding:"0.35rem 0", letterSpacing:"0.04em", transition:"color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD}
                    onMouseLeave={e => e.currentTarget.style.color = DIM}
                  >
                    Ready to go? Pay {plan.setup} + {plan.monthly} upfront →
                  </a>
                </div>
              </div>
            ))}
          </div>
          {/* Trust strip */}
          <div style={{ display:"flex", justifyContent:"center", gap:"2.5rem", flexWrap:"wrap", marginTop:"2.2rem", paddingTop:"2rem", borderTop:`1px solid ${BORDER}` }}>
            {[
              "$97 deposit credited to your setup fee",
              "30-day satisfaction guarantee",
              "Cancel before kickoff — full refund",
              "Additional agents +$850 each",
            ].map((t,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <CheckCircle size={13} color={GOLD} strokeWidth={2} style={{ flexShrink:0 }} />
                <span style={{ ...sans, color:DIM, fontSize:"0.79rem" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding:"90px 6%", background:BG2 }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <p style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.22em", color:GOLD, marginBottom:"1rem", fontWeight:"600", textAlign:"center" }}>CLIENT RESULTS</p>
          <h2 style={{ ...display, fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:"700", marginBottom:"3.5rem", textAlign:"center" }}>Results, not vanity metrics.</h2>
          <div data-testimonials className="testimonials-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1px", background:GOLD_BORDER }}>
            {[
              { quote:"My agent handles my inbox before I wake up. By 9am I know exactly what needs attention. It feels like an EA that works overnight.", name:"DANIEL K.", title:"Real Estate Broker" },
              { quote:"We deployed the Business Engine for our clinic. Appointment follow-ups run automatically. Our no-show rate dropped in the first two weeks.", name:"AMARA T.", title:"Clinic Director" },
              { quote:"The NemoClaw security layer was the deciding factor. Our CISO reviewed and approved it same day. That never happens with other vendors.", name:"SELENA M.", title:"Managing Partner, Law Firm" },
              { quote:"Setup was same day. I was chatting with my agent on Telegram by evening. ROI was clear within the first week of automated lead follow-ups.", name:"IBRAHIM O.", title:"Agency Founder" },
              { quote:"LocalClaw gave us an operating layer we did not know we needed. Our team runs leaner and responds faster than we ever did manually.", name:"NAOMI A.", title:"Operations Director" },
              { quote:"Three months in, our supplier communications are fully automated. I have not missed a single renewal since we deployed.", name:"VICTOR E.", title:"Restaurant Group Owner" },
            ].map((t,i) => (
              <div data-testimonial key={i} style={{ background:BG, padding:"2.5rem 2.2rem" }}>
                <div style={{ display:"flex", gap:"3px", marginBottom:"1.4rem" }}>
                  {[...Array(5)].map((_,j) => (
                    <div key={j} style={{ width:10, height:10, background:GOLD, clipPath:"polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)" }} />
                  ))}
                </div>
                <div style={{ ...sans, color:"#D4C5B0", fontStyle:"italic", lineHeight:"1.78", marginBottom:"1.6rem", fontSize:"0.91rem" }}>"{t.quote}"</div>
                <div style={{ ...sans, fontWeight:"700", fontSize:"0.76rem", letterSpacing:"0.12em", color:CREAM }}>{t.name}</div>
                <div style={{ ...sans, color:DIM, fontSize:"0.74rem", marginTop:"0.2rem" }}>{t.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="book" data-cta style={{ padding:"120px 6%", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div className="hero-orb-1" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"900px", height:"900px", background:"radial-gradient(circle, rgba(201,146,42,0.07) 0%, transparent 60%)", pointerEvents:"none" }} />
        <div className="hero-orb-2" style={{ position:"absolute", top:"30%", right:"10%", width:"400px", height:"400px", background:"radial-gradient(circle, rgba(201,146,42,0.04) 0%, transparent 60%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <p style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.22em", color:GOLD, marginBottom:"1.4rem", fontWeight:"600" }}>GET STARTED TODAY</p>
          <h2 data-cta-head style={{ ...display, fontSize:"clamp(2.5rem,7vw,5.5rem)", fontWeight:"700", marginBottom:"1.4rem", lineHeight:"1.04" }}>
            Your agent is<br /><em className="shimmer-text" style={{ fontStyle:"italic" }}>ready to deploy.</em>
          </h2>
          <p data-cta-sub style={{ ...sans, color:MUTED, maxWidth:"500px", margin:"0 auto 1.2rem", lineHeight:"1.78", fontSize:"0.96rem" }}>
            Reserve your spot with a $97 discovery deposit. We scope your deployment on a 15-minute call and go live within 24 hours.
          </p>
          <p style={{ ...sans, color:DIM, maxWidth:"420px", margin:"0 auto 2.8rem", lineHeight:"1.7", fontSize:"0.83rem" }}>
            Your $97 is credited in full toward your setup fee. If we're not the right fit, you get it back — no questions asked.
          </p>
          <div data-cta-btn className="cta-btns" style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
            <a href="/intake?plan=discovery" className="btn-primary" style={{ fontSize:"0.88rem", padding:"17px 42px" }}>CLAIM YOUR SPOT · $97</a>
            <a href="https://twitter.com/Th3Alch3mist_" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize:"0.88rem", padding:"17px 42px" }}>QUESTIONS? DM US</a>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:"2rem", flexWrap:"wrap", marginTop:"2rem" }}>
            {["$97 credited to setup fee", "30-day money-back guarantee", "Live in under 24 hours"].map((t,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.45rem" }}>
                <CheckCircle size={12} color={GOLD} strokeWidth={2} />
                <span style={{ ...sans, color:DIM, fontSize:"0.77rem" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grain Overlay ── */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${BORDER}`, padding:"2.8rem 6%", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1.2rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <ClawIcon size={28} color={GOLD} />
          <span className="lc-logo-text" style={{ fontSize:"1.4rem" }}>LocalClaw</span>
        </div>
        <div style={{ ...sans, color:DIM, fontSize:"0.77rem" }}>Powered by OpenClaw + NVIDIA NemoClaw</div>
        <a href="https://twitter.com/Th3Alch3mist_" target="_blank" rel="noopener noreferrer" style={{ ...sans, color:GOLD, fontSize:"0.77rem", textDecoration:"none" }}>@Th3Alch3mist_ on X</a>
      </footer>

    </div>
  );
}
