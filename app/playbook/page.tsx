"use client";
import React, { useEffect, useRef, useState } from "react";

export default function PlaybookPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".pb-nav-link");
    const onScroll = () => {
      let current = "";
      sections.forEach((s) => {
        const el = s as HTMLElement;
        if (window.scrollY >= el.offsetTop - 100) current = el.id;
      });
      navLinks.forEach((l) => {
        l.classList.remove("active");
        if (l.getAttribute("href") === "#" + current) l.classList.add("active");
      });
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <style>{`
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#0A0A0A;color:#F5F0E8;font-family:'Inter','Helvetica Neue',Arial,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
:root{
  --gold:#C9922A;--gold-dim:rgba(201,146,42,0.12);--gold-mid:rgba(201,146,42,0.08);
  --gold-border:rgba(201,146,42,0.22);--gold-glow:rgba(201,146,42,0.35);
  --cream:#F5F0E8;--muted:#A89880;--dim:#7A6E62;
  --bg:#0A0A0A;--bg2:#0D0D0D;--bg3:#111111;--bg4:#151515;
  --border:rgba(245,240,232,0.06);--border2:rgba(245,240,232,0.1);
  --green:#22C55E;--green-dim:rgba(34,197,94,0.12);
  --red:#EF4444;--blue:#3B82F6;--blue-dim:rgba(59,130,246,0.1);--amber:#F59E0B;
  --sans:'Inter','Helvetica Neue',Arial,sans-serif;
  --display:'Cormorant Garamond',Georgia,serif;
  --mono:'JetBrains Mono','Fira Code',monospace;
}
h1,h2,h3,h4{font-family:var(--display);font-weight:700;line-height:1.1;letter-spacing:-0.02em}
p{color:var(--muted);line-height:1.8}
a{color:var(--gold);text-decoration:none}
a:hover{text-decoration:underline}
strong{color:var(--cream);font-weight:600}
em{color:var(--gold);font-style:italic}
code{font-family:var(--mono);font-size:0.85em;background:rgba(201,146,42,0.1);color:var(--gold);padding:2px 7px;border-radius:4px;border:1px solid var(--gold-border)}
.pb-container{max-width:900px;margin:0 auto;padding:0 5%}
.pb-sidebar{position:fixed;top:0;left:0;height:100vh;width:255px;background:#0D0D0D;border-right:1px solid var(--border);overflow-y:auto;padding:2rem 0;z-index:100;transform:translateX(-100%);transition:transform 0.3s ease}
.pb-sidebar.open{transform:translateX(0)}
@media(min-width:1200px){.pb-sidebar{transform:translateX(0)}.pb-main-content{margin-left:255px}}
.pb-sidebar-logo{display:flex;align-items:center;gap:10px;padding:0 1.5rem 2rem;border-bottom:1px solid var(--border)}
.pb-sidebar-logo span{font-family:var(--display);font-size:1.3rem;color:var(--cream);font-weight:700}
.pb-nav-section{padding:1.5rem 1.5rem 0.5rem;font-family:var(--sans);font-size:0.6rem;letter-spacing:0.2em;color:var(--dim);font-weight:600}
.pb-nav-link{display:flex;align-items:center;gap:10px;padding:0.55rem 1.5rem;font-family:var(--sans);font-size:0.82rem;color:var(--muted);transition:all 0.2s;cursor:pointer;border-left:3px solid transparent;text-decoration:none}
.pb-nav-link:hover,.pb-nav-link.active{color:var(--gold);border-left-color:var(--gold);background:var(--gold-mid);text-decoration:none}
.pb-nav-num{font-family:var(--mono);font-size:0.7rem;color:var(--dim);min-width:20px}
.pb-mobile-header{display:flex;position:fixed;top:0;left:0;right:0;background:#0D0D0D;border-bottom:1px solid var(--border);padding:1rem 5%;z-index:200;align-items:center;justify-content:space-between}
@media(min-width:1200px){.pb-mobile-header{display:none}}
.pb-menu-btn{background:none;border:none;color:var(--cream);cursor:pointer;padding:4px}
.pb-cover{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:6rem 5%;position:relative;overflow:hidden;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(201,146,42,0.07) 0%,transparent 60%)}
.pb-cover-badge{display:inline-flex;align-items:center;gap:8px;background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:100px;padding:6px 18px;margin-bottom:2.5rem;font-family:var(--sans);font-size:0.65rem;letter-spacing:0.22em;color:var(--gold);font-weight:600}
.pb-cover-badge::before{content:'';width:5px;height:5px;background:var(--gold);border-radius:50%;animation:pb-pulse 2s infinite;display:inline-block}
@keyframes pb-pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.pb-cover h1{font-size:clamp(3rem,8vw,6.5rem);margin-bottom:1.5rem;max-width:800px}
.pb-cover-sub{font-family:var(--sans);font-size:1.05rem;color:var(--muted);max-width:540px;margin-bottom:3.5rem;line-height:1.8}
.pb-cover-meta{display:flex;gap:3rem;flex-wrap:wrap}
.pb-cover-meta-item{font-family:var(--sans);font-size:0.75rem}
.pb-cover-meta-item span{display:block;color:var(--dim);font-size:0.65rem;letter-spacing:0.15em;margin-bottom:3px}
.pb-cover-meta-item strong{color:var(--cream);font-weight:600}
.pb-cover-grid{position:absolute;top:0;left:0;right:0;bottom:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:60px 60px;opacity:0.4;pointer-events:none}
.pb-section{padding:6rem 5%;border-bottom:1px solid var(--border);position:relative}
.pb-section:last-child{border-bottom:none}
.pb-chapter-header{margin-bottom:3.5rem}
.pb-chapter-num{font-family:var(--mono);font-size:0.7rem;letter-spacing:0.2em;color:var(--gold);margin-bottom:1rem;display:block}
.pb-chapter-header h2{font-size:clamp(2rem,4vw,3.2rem);margin-bottom:1.2rem}
.pb-chapter-header p{font-size:1rem;max-width:650px;line-height:1.85}
.pb-chapter-divider{width:48px;height:2px;background:var(--gold);margin-bottom:2rem}
.pb-callout{border-radius:12px;padding:1.8rem 2rem;margin:2rem 0}
.pb-callout-info{background:var(--blue-dim);border:1px solid rgba(59,130,246,0.2)}
.pb-callout-warn{background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.22)}
.pb-callout-success{background:var(--green-dim);border:1px solid rgba(34,197,94,0.22)}
.pb-callout-gold{background:var(--gold-mid);border:1px solid var(--gold-border)}
.pb-callout-label{font-family:var(--sans);font-size:0.62rem;letter-spacing:0.2em;font-weight:700;margin-bottom:0.8rem}
.pb-callout-info .pb-callout-label{color:var(--blue)}
.pb-callout-warn .pb-callout-label{color:var(--amber)}
.pb-callout-success .pb-callout-label{color:var(--green)}
.pb-callout-gold .pb-callout-label{color:var(--gold)}
.pb-callout p{color:var(--muted);font-size:0.92rem;margin:0}
.pb-callout p+p{margin-top:0.6rem}
.pb-code-block{background:#0D0D0D;border:1px solid var(--border2);border-radius:10px;overflow:hidden;margin:1.8rem 0}
.pb-code-header{display:flex;align-items:center;justify-content:space-between;padding:0.85rem 1.4rem;background:#111;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:0.72rem;color:var(--dim)}
.pb-code-header .lang{color:var(--gold)}
.pb-code-dots{display:flex;gap:6px}
.pb-code-dots span{width:10px;height:10px;border-radius:50%}
.pb-code-dots span:nth-child(1){background:#EF4444}
.pb-code-dots span:nth-child(2){background:#F59E0B}
.pb-code-dots span:nth-child(3){background:#22C55E}
.pb-code-body{padding:1.4rem 1.6rem;overflow-x:auto}
.pb-code-body pre{font-family:var(--mono);font-size:0.84rem;color:#E2D9C8;line-height:1.7;white-space:pre}
.pb-cmd{color:var(--gold)}.pb-comment{color:var(--dim)}.pb-key{color:#7DD3FC}.pb-val{color:#86EFAC}
.pb-steps{list-style:none;margin:2rem 0}
.pb-step{display:flex;gap:1.5rem;margin-bottom:2.2rem;align-items:flex-start}
.pb-step-num{min-width:40px;height:40px;background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:0.8rem;color:var(--gold);font-weight:600;flex-shrink:0;margin-top:2px}
.pb-step-content h4{font-family:var(--sans);font-size:0.95rem;font-weight:600;color:var(--cream);margin-bottom:0.4rem}
.pb-step-content p{font-size:0.88rem;margin:0}
.pb-feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.2rem;margin:2.5rem 0}
.pb-feature-card{background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:1.8rem;transition:border-color 0.2s}
.pb-feature-card:hover{border-color:var(--gold-border)}
.pb-feature-icon{width:44px;height:44px;background:var(--gold-dim);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;margin-bottom:1.2rem}
.pb-feature-card h4{font-family:var(--sans);font-size:0.92rem;font-weight:600;color:var(--cream);margin-bottom:0.5rem}
.pb-feature-card p{font-size:0.84rem;margin:0;line-height:1.7}
.pb-table-wrap{overflow-x:auto;margin:2rem 0}
.pb-table-wrap table{width:100%;border-collapse:collapse;font-family:var(--sans);font-size:0.85rem}
.pb-table-wrap thead th{padding:1rem 1.2rem;text-align:left;color:var(--gold);font-weight:600;font-size:0.72rem;letter-spacing:0.12em;border-bottom:1px solid var(--gold-border);background:var(--gold-mid)}
.pb-table-wrap tbody td{padding:1rem 1.2rem;border-bottom:1px solid var(--border);color:var(--muted);vertical-align:top}
.pb-table-wrap tbody tr:last-child td{border-bottom:none}
.pb-table-wrap tbody tr:hover td{background:rgba(255,255,255,0.02)}
.pb-check{color:var(--green)}.pb-cross{color:var(--red)}.pb-warn-icon{color:var(--amber)}
.pb-arch-diagram{background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:2.5rem;margin:2rem 0;text-align:center}
.pb-arch-row{display:flex;align-items:center;justify-content:center;gap:1rem;flex-wrap:wrap;margin-bottom:1rem}
.pb-arch-box{background:var(--bg4);border:1px solid var(--border2);border-radius:8px;padding:0.7rem 1.2rem;font-family:var(--sans);font-size:0.78rem;color:var(--cream);font-weight:500;min-width:110px;text-align:center}
.pb-arch-box.gold{border-color:var(--gold-border);background:var(--gold-mid);color:var(--gold)}
.pb-arch-box.green{border-color:rgba(34,197,94,0.3);background:var(--green-dim);color:var(--green)}
.pb-arch-box.blue{border-color:rgba(59,130,246,0.3);background:var(--blue-dim);color:var(--blue)}
.pb-arch-arrow{color:var(--dim);font-size:1.2rem}
.pb-arch-label{font-family:var(--sans);font-size:0.65rem;letter-spacing:0.15em;color:var(--dim);margin-top:0.3rem}
.pb-policy-block{background:#060606;border:1px solid rgba(59,130,246,0.2);border-radius:10px;overflow:hidden;margin:2rem 0}
.pb-policy-header{background:rgba(59,130,246,0.08);border-bottom:1px solid rgba(59,130,246,0.15);padding:0.85rem 1.4rem;display:flex;align-items:center;gap:0.6rem;font-family:var(--mono);font-size:0.72rem;color:var(--blue)}
.pb-policy-body{padding:1.4rem 1.6rem}
.pb-policy-body pre{font-family:var(--mono);font-size:0.81rem;line-height:1.7;color:#E2D9C8;white-space:pre}
.pb-recipe-card{background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:2rem;margin-bottom:1.5rem;transition:border-color 0.2s}
.pb-recipe-card:hover{border-color:var(--gold-border)}
.pb-recipe-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.2rem;gap:1rem}
.pb-recipe-title{font-family:var(--sans);font-size:1rem;font-weight:700;color:var(--cream)}
.pb-recipe-tag{font-family:var(--sans);font-size:0.62rem;letter-spacing:0.15em;padding:4px 12px;border-radius:100px;font-weight:600;white-space:nowrap}
.pb-tag-inbox{background:var(--blue-dim);color:var(--blue);border:1px solid rgba(59,130,246,0.2)}
.pb-tag-appt{background:var(--green-dim);color:var(--green);border:1px solid rgba(34,197,94,0.2)}
.pb-tag-lead{background:var(--gold-dim);color:var(--gold);border:1px solid var(--gold-border)}
.pb-tag-social{background:rgba(168,85,247,0.1);color:#C084FC;border:1px solid rgba(168,85,247,0.2)}
.pb-tag-support{background:rgba(251,113,133,0.1);color:#FB7185;border:1px solid rgba(251,113,133,0.2)}
.pb-recipe-desc{font-size:0.88rem;margin-bottom:1.2rem}
.pb-recipe-soul{background:#0A0A0A;border:1px solid var(--border);border-radius:8px;padding:1.2rem 1.4rem}
.pb-recipe-soul-label{font-family:var(--mono);font-size:0.62rem;color:var(--dim);margin-bottom:0.6rem;letter-spacing:0.12em}
.pb-recipe-soul pre{font-family:var(--mono);font-size:0.78rem;color:#E2D9C8;line-height:1.65;white-space:pre-wrap}
.pb-soul-key{color:#7DD3FC}.pb-soul-val{color:#86EFAC}.pb-soul-str{color:var(--muted)}
.pb-checklist{list-style:none;margin:1.5rem 0}
.pb-checklist li{display:flex;align-items:flex-start;gap:0.8rem;padding:0.7rem 0;border-bottom:1px solid var(--border);font-family:var(--sans);font-size:0.88rem;color:var(--muted)}
.pb-checklist li:last-child{border-bottom:none}
.pb-checklist li::before{content:'\u2610';color:var(--gold);font-size:1rem;line-height:1;flex-shrink:0;margin-top:2px}
.pb-toc-grid{display:grid;gap:0.6rem;margin:2rem 0}
.pb-toc-row{display:flex;align-items:center;gap:1rem;padding:1rem 1.4rem;background:var(--bg3);border:1px solid var(--border);border-radius:10px;transition:border-color 0.2s;text-decoration:none}
.pb-toc-row:hover{border-color:var(--gold-border);text-decoration:none}
.pb-toc-row-num{font-family:var(--mono);font-size:0.7rem;color:var(--gold);min-width:28px}
.pb-toc-row-title{font-family:var(--sans);font-size:0.9rem;color:var(--cream);font-weight:500;flex:1}
.pb-toc-row-arrow{color:var(--dim);font-size:0.8rem}
.pb-trouble-item{border:1px solid var(--border);border-radius:10px;margin-bottom:1rem;overflow:hidden}
.pb-trouble-q{padding:1.2rem 1.6rem;background:var(--bg3);font-family:var(--sans);font-size:0.9rem;color:var(--cream);font-weight:600;display:flex;align-items:center;gap:0.8rem}
.pb-trouble-q::before{content:'?';width:24px;height:24px;background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:var(--gold);font-weight:700;flex-shrink:0}
.pb-trouble-a{padding:1.2rem 1.6rem;background:var(--bg2);font-size:0.87rem;border-top:1px solid var(--border)}
.pb-trouble-a p{margin:0}
.pb-channel-grid{display:flex;flex-wrap:wrap;gap:0.8rem;margin:1.5rem 0}
.pb-channel-pill{display:flex;align-items:center;gap:8px;padding:8px 16px;background:var(--bg3);border:1px solid var(--border);border-radius:100px;font-family:var(--sans);font-size:0.8rem;color:var(--muted);transition:border-color 0.2s}
.pb-channel-pill:hover{border-color:var(--gold-border);color:var(--gold)}
.pb-cta-section{background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(201,146,42,0.07) 0%,transparent 70%);border:1px solid var(--gold-border);border-radius:20px;padding:5rem 3rem;text-align:center;margin:4rem 0}
.pb-cta-section h2{font-size:clamp(2rem,5vw,3.5rem);margin-bottom:1.2rem}
.pb-cta-section p{font-size:0.96rem;max-width:480px;margin:0 auto 2.5rem}
.pb-btn-row{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.pb-btn-primary{background:var(--gold);color:#0A0A0A;font-family:var(--sans);font-size:0.82rem;font-weight:700;letter-spacing:0.12em;padding:16px 36px;border-radius:100px;transition:opacity 0.2s;text-decoration:none;display:inline-block}
.pb-btn-primary:hover{opacity:0.85;text-decoration:none}
.pb-btn-secondary{background:transparent;color:var(--cream);font-family:var(--sans);font-size:0.82rem;font-weight:600;letter-spacing:0.12em;padding:16px 36px;border-radius:100px;border:1px solid var(--border2);transition:border-color 0.2s;text-decoration:none;display:inline-block}
.pb-btn-secondary:hover{border-color:var(--gold-border);color:var(--gold);text-decoration:none}
.pb-playbook-footer{padding:3rem 5%;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
.pb-playbook-footer .pb-logo{display:flex;align-items:center;gap:10px;font-family:var(--display);font-size:1.2rem;color:var(--cream)}
.pb-playbook-footer p{font-size:0.75rem;margin:0}
@media(max-width:700px){
  .pb-cover h1{font-size:2.8rem}.pb-cover-meta{gap:1.5rem}
  .pb-feature-grid{grid-template-columns:1fr}.pb-section{padding:4rem 5%}
  .pb-arch-row{flex-direction:column}
}
      `}</style>

      {/* SIDEBAR */}
      <nav className={`pb-sidebar${sidebarOpen ? " open" : ""}`} ref={sidebarRef}>
        <div className="pb-sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 4C14 4 8 8 6 14C4 20 8 24 14 24" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/><path d="M14 4C14 4 20 8 22 14C24 20 20 24 14 24" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/><path d="M10 10C10 10 8 16 12 20" stroke="#C9922A" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 10C18 10 20 16 16 20" stroke="#C9922A" strokeWidth="1.5" strokeLinecap="round"/><circle cx="14" cy="14" r="2" fill="#C9922A"/></svg>
          <span>LocalClaw</span>
        </div>
        <div className="pb-nav-section">PLAYBOOK</div>
        <a className="pb-nav-link" href="#cover" onClick={closeSidebar}><span className="pb-nav-num">&mdash;</span>Cover</a>
        <a className="pb-nav-link" href="#toc" onClick={closeSidebar}><span className="pb-nav-num">&mdash;</span>Contents</a>
        <div className="pb-nav-section">FOUNDATIONS</div>
        <a className="pb-nav-link" href="#ch1" onClick={closeSidebar}><span className="pb-nav-num">01</span>Why AI Agents Now</a>
        <a className="pb-nav-link" href="#ch2" onClick={closeSidebar}><span className="pb-nav-num">02</span>What Is OpenClaw</a>
        <a className="pb-nav-link" href="#ch3" onClick={closeSidebar}><span className="pb-nav-num">03</span>What Is NemoClaw</a>
        <a className="pb-nav-link" href="#ch4" onClick={closeSidebar}><span className="pb-nav-num">04</span>The LocalClaw Stack</a>
        <div className="pb-nav-section">INSTALLATION</div>
        <a className="pb-nav-link" href="#ch5" onClick={closeSidebar}><span className="pb-nav-num">05</span>Pre-Install Checklist</a>
        <a className="pb-nav-link" href="#ch6" onClick={closeSidebar}><span className="pb-nav-num">06</span>Installing OpenClaw</a>
        <a className="pb-nav-link" href="#ch7" onClick={closeSidebar}><span className="pb-nav-num">07</span>First Onboarding</a>
        <a className="pb-nav-link" href="#ch8" onClick={closeSidebar}><span className="pb-nav-num">08</span>Installing NemoClaw</a>
        <a className="pb-nav-link" href="#ch9" onClick={closeSidebar}><span className="pb-nav-num">09</span>OpenShell Policies</a>
        <div className="pb-nav-section">GOING LIVE</div>
        <a className="pb-nav-link" href="#ch10" onClick={closeSidebar}><span className="pb-nav-num">10</span>Connecting Channels</a>
        <a className="pb-nav-link" href="#ch11" onClick={closeSidebar}><span className="pb-nav-num">11</span>Building Your Agent</a>
        <a className="pb-nav-link" href="#ch12" onClick={closeSidebar}><span className="pb-nav-num">12</span>Agent Recipes</a>
        <a className="pb-nav-link" href="#ch13" onClick={closeSidebar}><span className="pb-nav-num">13</span>Privacy Router</a>
        <div className="pb-nav-section">OPERATIONS</div>
        <a className="pb-nav-link" href="#ch14" onClick={closeSidebar}><span className="pb-nav-num">14</span>Monitoring &amp; Logs</a>
        <a className="pb-nav-link" href="#ch15" onClick={closeSidebar}><span className="pb-nav-num">15</span>Troubleshooting</a>
        <a className="pb-nav-link" href="#ch16" onClick={closeSidebar}><span className="pb-nav-num">16</span>What Comes Next</a>
      </nav>

      {/* MOBILE HEADER */}
      <div className="pb-mobile-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "#F5F0E8" }}>
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><path d="M14 4C14 4 8 8 6 14C4 20 8 24 14 24" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/><path d="M14 4C14 4 20 8 22 14C24 20 20 24 14 24" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/><path d="M10 10C10 10 8 16 12 20" stroke="#C9922A" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 10C18 10 20 16 16 20" stroke="#C9922A" strokeWidth="1.5" strokeLinecap="round"/><circle cx="14" cy="14" r="2" fill="#C9922A"/></svg>
          LocalClaw Playbook
        </div>
        <button className="pb-menu-btn" onClick={() => setSidebarOpen((o) => !o)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>

      <div className="pb-main-content">

        {/* COVER */}
        <section className="pb-cover" id="cover">
          <div className="pb-cover-grid"></div>
          <div className="pb-container" style={{ position: "relative", zIndex: 1 }}>
            <div className="pb-cover-badge">THE DEFINITIVE GUIDE &middot; 2026 EDITION</div>
            <h1>The LocalClaw<br /><em>Playbook</em></h1>
            <p className="pb-cover-sub">A step-by-step guide to deploying autonomous AI agents for your local business using OpenClaw and NVIDIA NemoClaw. No technical degree required.</p>
            <div className="pb-cover-meta">
              <div className="pb-cover-meta-item"><span>PUBLISHED BY</span><strong>LocalClaw &middot; @Th3Alch3mist_</strong></div>
              <div className="pb-cover-meta-item"><span>EDITION</span><strong>March 2026</strong></div>
              <div className="pb-cover-meta-item"><span>CHAPTERS</span><strong>16 &middot; Comprehensive</strong></div>
              <div className="pb-cover-meta-item"><span>LEVEL</span><strong>Beginner &rarr; Advanced</strong></div>
            </div>
          </div>
        </section>

        {/* TOC */}
        <section className="pb-section" id="toc">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">TABLE OF CONTENTS</span>
              <h2>What&apos;s Inside</h2>
              <div className="pb-chapter-divider"></div>
              <p>Everything you need — from understanding what AI agents are, to deploying a fully secured, multi-channel agent that works for your business 24 hours a day.</p>
            </div>
            <div className="pb-toc-grid">
              <a href="#ch1" className="pb-toc-row"><span className="pb-toc-row-num">01</span><span className="pb-toc-row-title">Why Local Businesses Need AI Agents Now</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch2" className="pb-toc-row"><span className="pb-toc-row-num">02</span><span className="pb-toc-row-title">What Is OpenClaw? The Agent Engine</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch3" className="pb-toc-row"><span className="pb-toc-row-num">03</span><span className="pb-toc-row-title">What Is NemoClaw? The Security Shield</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch4" className="pb-toc-row"><span className="pb-toc-row-num">04</span><span className="pb-toc-row-title">The LocalClaw Stack — How It All Fits Together</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch5" className="pb-toc-row"><span className="pb-toc-row-num">05</span><span className="pb-toc-row-title">Pre-Installation Checklist</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch6" className="pb-toc-row"><span className="pb-toc-row-num">06</span><span className="pb-toc-row-title">Installing OpenClaw on Mac, Windows &amp; Linux</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch7" className="pb-toc-row"><span className="pb-toc-row-num">07</span><span className="pb-toc-row-title">Running Your First Onboarding</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch8" className="pb-toc-row"><span className="pb-toc-row-num">08</span><span className="pb-toc-row-title">Installing the NemoClaw Security Layer</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch9" className="pb-toc-row"><span className="pb-toc-row-num">09</span><span className="pb-toc-row-title">OpenShell Policy Setup</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch10" className="pb-toc-row"><span className="pb-toc-row-num">10</span><span className="pb-toc-row-title">Connecting Your Channels</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch11" className="pb-toc-row"><span className="pb-toc-row-num">11</span><span className="pb-toc-row-title">Building Your First Business Agent</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch12" className="pb-toc-row"><span className="pb-toc-row-num">12</span><span className="pb-toc-row-title">Real-World Agent Recipes for Local Businesses</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch13" className="pb-toc-row"><span className="pb-toc-row-num">13</span><span className="pb-toc-row-title">The Privacy Router — Keeping Sensitive Data Local</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch14" className="pb-toc-row"><span className="pb-toc-row-num">14</span><span className="pb-toc-row-title">Monitoring &amp; Audit Logs</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch15" className="pb-toc-row"><span className="pb-toc-row-num">15</span><span className="pb-toc-row-title">Troubleshooting Common Issues</span><span className="pb-toc-row-arrow">&rarr;</span></a>
              <a href="#ch16" className="pb-toc-row"><span className="pb-toc-row-num">16</span><span className="pb-toc-row-title">What Comes Next — LocalClaw Managed Services</span><span className="pb-toc-row-arrow">&rarr;</span></a>
            </div>
          </div>
        </section>

        {/* CH1 */}
        <section className="pb-section" id="ch1">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 01</span>
              <h2>Why Local Businesses<br />Need AI Agents Now</h2>
              <div className="pb-chapter-divider"></div>
              <p>Your competitor three blocks away is about to deploy an AI agent that answers every lead in under 60 seconds, books appointments at 2am, and never takes a day off. Here&apos;s what that means for you.</p>
            </div>
            <div className="pb-callout pb-callout-gold">
              <div className="pb-callout-label">THE REALITY CHECK</div>
              <p>48% of small business inquiries go unanswered within the first hour. That&apos;s the hour where the customer decides who to call next.</p>
            </div>
            <p>The local business landscape has shifted permanently. The question is no longer <strong>&ldquo;should I use AI?&rdquo;</strong> — it&apos;s <strong>&ldquo;how fast can I deploy before my competitor does?&rdquo;</strong></p>
            <div className="pb-feature-grid" style={{ marginTop: "2rem" }}>
              <div className="pb-feature-card"><div className="pb-feature-icon">&#9200;</div><h4>24/7 Availability</h4><p>Customers contact businesses at all hours. An AI agent never sleeps, never misses a message, and responds in seconds — not hours.</p></div>
              <div className="pb-feature-card"><div className="pb-feature-icon">&#128172;</div><h4>Instant Lead Response</h4><p>Speed to lead is everything. Responding within 5 minutes increases conversion by 900% vs responding in 30 minutes.</p></div>
              <div className="pb-feature-card"><div className="pb-feature-icon">&#128197;</div><h4>Automated Booking</h4><p>No more back-and-forth. The agent checks your calendar, proposes slots, confirms the booking — fully automatically.</p></div>
              <div className="pb-feature-card"><div className="pb-feature-icon">&#128176;</div><h4>Lower Operating Cost</h4><p>A single AI agent handles what would normally require a part-time hire — at a fraction of the monthly cost.</p></div>
              <div className="pb-feature-card"><div className="pb-feature-icon">&#128241;</div><h4>Multi-Channel Presence</h4><p>One agent across WhatsApp, Gmail, Telegram, and Instagram DMs simultaneously. Stay present everywhere your customers are.</p></div>
              <div className="pb-feature-card"><div className="pb-feature-icon">&#128274;</div><h4>Enterprise Security</h4><p>With NemoClaw, your customer data stays protected. Policy-based controls ensure your agent does only what you allow.</p></div>
            </div>
            <div className="pb-callout pb-callout-info">
              <div className="pb-callout-label">WHO THIS PLAYBOOK IS FOR</div>
              <p>Local business owners, operations managers, and agency owners who want to deploy AI agents. You do not need to know how to code. Every step in this guide is designed for non-technical people.</p>
            </div>
          </div>
        </section>

        {/* CH2 */}
        <section className="pb-section" id="ch2">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 02</span>
              <h2>What Is OpenClaw?<br /><em>The Agent Engine</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>OpenClaw is an open-source, self-hosted gateway that connects your messaging apps — WhatsApp, Telegram, Gmail, Discord — to an always-available AI agent. Think of it as the engine under the hood.</p>
            </div>
            <div className="pb-arch-diagram">
              <div style={{ marginBottom: "2rem", fontFamily: "'Inter',sans-serif", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#7A6E62" }}>HOW OPENCLAW WORKS</div>
              <div className="pb-arch-row">
                <div className="pb-arch-box">WhatsApp</div>
                <div className="pb-arch-box">Telegram</div>
                <div className="pb-arch-box">Gmail</div>
                <div className="pb-arch-box">Discord</div>
              </div>
              <div className="pb-arch-row"><div className="pb-arch-arrow">&darr;</div></div>
              <div className="pb-arch-row"><div className="pb-arch-box gold">OpenClaw Gateway</div></div>
              <div className="pb-arch-row"><div className="pb-arch-arrow">&darr;</div></div>
              <div className="pb-arch-row">
                <div className="pb-arch-box blue">AI Model (GPT-4o / Claude)</div>
                <div className="pb-arch-box green">Your Agent (SOUL.md)</div>
              </div>
            </div>
            <div className="pb-feature-grid">
              <div className="pb-feature-card"><div className="pb-feature-icon">&#127760;</div><h4>Multi-Channel Gateway</h4><p>A single Gateway process serves WhatsApp, Telegram, Discord, and iMessage simultaneously from one install.</p></div>
              <div className="pb-feature-card"><div className="pb-feature-icon">&#129504;</div><h4>Persistent Memory</h4><p>Your agent remembers past conversations, customer names, preferences, and history — per session and across sessions.</p></div>
              <div className="pb-feature-card"><div className="pb-feature-icon">&#128295;</div><h4>Tool Use</h4><p>Agents can browse the web, read files, call APIs, book calendar slots, and execute code — not just chat.</p></div>
              <div className="pb-feature-card"><div className="pb-feature-icon">&#128256;</div><h4>Multi-Agent Routing</h4><p>Route different requests to specialized agents. One for bookings, one for support, one for sales — all coordinated.</p></div>
            </div>
            <div className="pb-callout pb-callout-success">
              <div className="pb-callout-label">OPEN SOURCE &middot; MIT LICENSE</div>
              <p>OpenClaw is free and open source. You own your data, your agent, and your infrastructure. No vendor lock-in. 329,000+ GitHub stars.</p>
            </div>
          </div>
        </section>

        {/* CH3 */}
        <section className="pb-section" id="ch3">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 03</span>
              <h2>What Is NemoClaw?<br /><em>The Security Shield</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>NemoClaw is NVIDIA&apos;s open-source security wrapper for OpenClaw. It adds a policy enforcement layer — called OpenShell — that controls exactly what your agent can see, do, and send.</p>
            </div>
            <div className="pb-callout pb-callout-warn">
              <div className="pb-callout-label">WHY THIS MATTERS</div>
              <p>When you give an AI agent access to your inbox, calendar, and files — you&apos;re giving it the same permissions as a full-time employee. Without NemoClaw, there are zero guardrails on what it accesses or where your data goes.</p>
            </div>
            <div className="pb-arch-diagram">
              <div style={{ marginBottom: "2rem", fontFamily: "'Inter',sans-serif", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#7A6E62" }}>NEMOCLAW SECURITY ARCHITECTURE</div>
              <div className="pb-arch-row"><div className="pb-arch-box">Agent Request</div></div>
              <div className="pb-arch-row"><div className="pb-arch-arrow">&darr;</div></div>
              <div className="pb-arch-row"><div className="pb-arch-box gold">OpenShell Policy Check</div></div>
              <div className="pb-arch-row">
                <div className="pb-arch-box green">&#10003; ALLOW + Audit Log</div>
                <div className="pb-arch-arrow" style={{ fontSize: "0.8rem" }}>or</div>
                <div className="pb-arch-box" style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#EF4444" }}>&#10007; DENY + Log</div>
              </div>
              <div className="pb-arch-row"><div className="pb-arch-arrow">&darr;</div></div>
              <div className="pb-arch-row">
                <div className="pb-arch-box blue">File System (scoped)</div>
                <div className="pb-arch-box blue">Local Nemotron</div>
                <div className="pb-arch-box" style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#EF4444" }}>.env BLOCKED</div>
              </div>
            </div>
            <div className="pb-table-wrap">
              <table>
                <thead><tr><th>FEATURE</th><th>RAW OPENCLAW</th><th>OPENCLAW + NEMOCLAW</th></tr></thead>
                <tbody>
                  <tr><td>Policy-based access control</td><td><span className="pb-cross">&#10007; None</span></td><td><span className="pb-check">&#10003; OpenShell enforced</span></td></tr>
                  <tr><td>File system scope limits</td><td><span className="pb-cross">&#10007; Full system access</span></td><td><span className="pb-check">&#10003; Directory-scoped per policy</span></td></tr>
                  <tr><td>Credential protection (.env)</td><td><span className="pb-cross">&#10007; High risk</span></td><td><span className="pb-warn-icon">&#9888; Reduced (not retroactive)</span></td></tr>
                  <tr><td>Data routing (local vs cloud)</td><td><span className="pb-cross">&#10007; Cloud by default</span></td><td><span className="pb-check">&#10003; Local Nemotron first</span></td></tr>
                  <tr><td>Prompt injection protection</td><td><span className="pb-cross">&#10007; None</span></td><td><span className="pb-check">&#10003; Agent scope limited</span></td></tr>
                  <tr><td>Audit logging</td><td><span className="pb-cross">&#10007; None by default</span></td><td><span className="pb-check">&#10003; Full agent action log</span></td></tr>
                  <tr><td>External API call controls</td><td><span className="pb-cross">&#10007; Unrestricted</span></td><td><span className="pb-check">&#10003; Allowlist via OpenShell</span></td></tr>
                  <tr><td>License</td><td>MIT</td><td>Apache 2.0</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CH4 */}
        <section className="pb-section" id="ch4">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 04</span>
              <h2>The LocalClaw Stack<br /><em>How It All Fits Together</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>LocalClaw combines OpenClaw (the engine) and NemoClaw (the shield) into a fully managed, secure agent deployment for your business. Here&apos;s the complete picture.</p>
            </div>
            <div className="pb-arch-diagram">
              <div style={{ marginBottom: "2.5rem", fontFamily: "'Inter',sans-serif", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#7A6E62" }}>THE COMPLETE LOCALCLAW STACK</div>
              <div className="pb-arch-row">
                <div className="pb-arch-box">WhatsApp</div><div className="pb-arch-box">Telegram</div>
                <div className="pb-arch-box">Gmail</div><div className="pb-arch-box">Calendar</div><div className="pb-arch-box">Instagram</div>
              </div>
              <div className="pb-arch-row"><div className="pb-arch-arrow">&darr; Customer messages arrive</div></div>
              <div className="pb-arch-row"><div className="pb-arch-box gold">OpenClaw Gateway (your server or VPS)</div></div>
              <div className="pb-arch-row"><div className="pb-arch-arrow">&darr; Policy check</div></div>
              <div className="pb-arch-row"><div className="pb-arch-box blue">NemoClaw / OpenShell Security Layer</div></div>
              <div className="pb-arch-row"><div className="pb-arch-arrow">&darr; Approved actions only</div></div>
              <div className="pb-arch-row"><div className="pb-arch-box green">Your Business Agent (SOUL.md)</div></div>
              <div className="pb-arch-row"><div className="pb-arch-arrow">&darr; Response + Logs</div></div>
              <div className="pb-arch-row"><div className="pb-arch-box gold">LocalClaw Dashboard &middot; Analytics &middot; Insights</div></div>
            </div>
            <div className="pb-callout pb-callout-gold">
              <div className="pb-callout-label">THE LOCALCLAW ADVANTAGE</div>
              <p>You don&apos;t have to manage any of this yourself. LocalClaw deploys, configures, and maintains the entire stack for you — same day. You get the dashboard, the agent, and the security without touching a single line of code.</p>
            </div>
          </div>
        </section>

        {/* CH5 */}
        <section className="pb-section" id="ch5">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 05</span>
              <h2>Pre-Installation<br /><em>Checklist</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>Before you install anything, run through this checklist. Most failures happen because of one skipped prerequisite.</p>
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>System Requirements</h3>
            <ul className="pb-checklist">
              <li><strong>Node.js 22 LTS or higher</strong> — Check with <code>node -v</code> in your terminal. Download at nodejs.org if needed.</li>
              <li><strong>npm 9 or higher</strong> — Comes bundled with Node. Check with <code>npm -v</code>.</li>
              <li><strong>4GB RAM minimum</strong> — 8GB recommended if you plan to run local Nemotron routing.</li>
              <li><strong>Stable internet connection</strong> — Required for initial install and cloud AI model calls.</li>
              <li><strong>Administrator / sudo access</strong> — Required to install the OpenClaw background daemon.</li>
            </ul>
            <h3 style={{ fontSize: "1.2rem", margin: "2rem 0 1rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>Accounts &amp; API Keys</h3>
            <ul className="pb-checklist">
              <li><strong>AI Provider API Key</strong> — Get one from OpenAI (platform.openai.com) or Anthropic (console.anthropic.com). GPT-4o or Claude 3.5 Sonnet recommended.</li>
              <li><strong>Google Account (recommended)</strong> — For Gmail and Google Calendar channel integration.</li>
              <li><strong>WhatsApp Business Number (optional)</strong> — Requires a Meta Business account and a dedicated phone number.</li>
              <li><strong>Telegram Account (optional)</strong> — Fastest channel to connect. 5 minutes via BotFather.</li>
            </ul>
            <h3 style={{ fontSize: "1.2rem", margin: "2rem 0 1rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>For 24/7 Deployment (Recommended)</h3>
            <ul className="pb-checklist">
              <li><strong>A VPS or Cloud Server</strong> — DigitalOcean Droplet, Hetzner Cloud, or Vultr. $6&ndash;$12/month keeps your agent running even when your laptop is off.</li>
              <li><strong>SSH Access to your server</strong> — You&apos;ll need the IP address and login credentials.</li>
              <li><strong>Domain name (optional)</strong> — For a clean webhook URL when connecting WhatsApp and Instagram channels.</li>
            </ul>
            <div className="pb-callout pb-callout-info">
              <div className="pb-callout-label">MANAGED OPTION</div>
              <p>If this checklist feels like a lot — that&apos;s exactly why LocalClaw exists. We handle every single item on this list as part of our deployment service. Book a free 15-minute call and your agent will be live today.</p>
            </div>
          </div>
        </section>

        {/* CH6 */}
        <section className="pb-section" id="ch6">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 06</span>
              <h2>Installing OpenClaw<br /><em>Mac &middot; Windows &middot; Linux</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>OpenClaw installs as a global npm package. One command, any operating system. The whole process takes under 2 minutes.</p>
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>Step 1 — Install OpenClaw globally</h3>
            <div className="pb-code-block">
              <div className="pb-code-header"><div className="pb-code-dots"><span></span><span></span><span></span></div><span className="lang">TERMINAL — all platforms</span></div>
              <div className="pb-code-body"><pre><span className="pb-cmd">npm install -g openclaw@latest</span></pre></div>
            </div>
            <h3 style={{ fontSize: "1.1rem", margin: "2rem 0 1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>Step 2 — Verify the install</h3>
            <div className="pb-code-block">
              <div className="pb-code-header"><div className="pb-code-dots"><span></span><span></span><span></span></div><span className="lang">TERMINAL</span></div>
              <div className="pb-code-body"><pre><span className="pb-cmd">openclaw --version</span>{"\n"}<span className="pb-comment"># Expected: openclaw/x.x.x node/v22.x.x linux/x64</span></pre></div>
            </div>
            <h3 style={{ fontSize: "1.1rem", margin: "2rem 0 1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>Step 3 — Preview the Dashboard</h3>
            <div className="pb-code-block">
              <div className="pb-code-header"><div className="pb-code-dots"><span></span><span></span><span></span></div><span className="lang">TERMINAL</span></div>
              <div className="pb-code-body"><pre><span className="pb-cmd">openclaw dashboard</span>{"\n"}<span className="pb-comment"># Opens http://127.0.0.1:18789/ in your browser</span></pre></div>
            </div>
            <div className="pb-callout pb-callout-warn">
              <div className="pb-callout-label">WINDOWS NOTE</div>
              <p>Run your terminal as Administrator on Windows. Right-click your terminal app and choose &ldquo;Run as administrator&rdquo; before running the install command. This is required for the global install and daemon setup.</p>
            </div>
            <div className="pb-callout pb-callout-info">
              <div className="pb-callout-label">ON A VPS / LINUX SERVER</div>
              <p>If you&apos;re SSH&apos;d into a remote server, run all commands as a non-root user with sudo privileges. Do not run as root directly — the daemon install needs a proper user context.</p>
            </div>
          </div>
        </section>

        {/* CH7 */}
        <section className="pb-section" id="ch7">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 07</span>
              <h2>Running Your First<br /><em>Onboarding</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>The <code>openclaw onboard</code> command walks you through the entire setup with a guided terminal wizard — AI provider, model selection, channels, and daemon installation. Takes about 5 minutes.</p>
            </div>
            <div className="pb-code-block">
              <div className="pb-code-header"><div className="pb-code-dots"><span></span><span></span><span></span></div><span className="lang">TERMINAL</span></div>
              <div className="pb-code-body"><pre><span className="pb-cmd">openclaw onboard --install-daemon</span></pre></div>
            </div>
            <h3 style={{ fontSize: "1.1rem", margin: "2.5rem 0 1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>What the wizard walks you through</h3>
            <ul className="pb-steps">
              <li className="pb-step">
                <div className="pb-step-num">1</div>
                <div className="pb-step-content"><h4>Choose your AI provider</h4><p>Select OpenAI, Anthropic, Mistral, or Groq. Paste your API key when prompted. Stored locally in <code>~/.openclaw/openclaw.json</code> — never sent anywhere else.</p></div>
              </li>
              <li className="pb-step">
                <div className="pb-step-num">2</div>
                <div className="pb-step-content"><h4>Select your model</h4><p>Recommended: <code>gpt-4o</code> or <code>claude-3-5-sonnet</code>. For cost-sensitive deployments, <code>gpt-4o-mini</code> handles routine tasks well at a much lower cost per token.</p></div>
              </li>
              <li className="pb-step">
                <div className="pb-step-num">3</div>
                <div className="pb-step-content"><h4>Choose channels to connect</h4><p>Select the channels you want. You can always add or remove channels later from the dashboard. Telegram is the fastest to connect — 5 minutes via BotFather.</p></div>
              </li>
              <li className="pb-step">
                <div className="pb-step-num">4</div>
                <div className="pb-step-content"><h4>Install the background daemon</h4><p>The <code>--install-daemon</code> flag installs OpenClaw as a system service. It starts automatically when your server boots — essential for 24/7 operation without manual restarts.</p></div>
              </li>
              <li className="pb-step">
                <div className="pb-step-num">5</div>
                <div className="pb-step-content"><h4>Open the Control Dashboard</h4><p>OpenClaw opens <code>http://127.0.0.1:18789/</code> in your browser. You&apos;ll see the Gateway status, connected channels, and live session feed. Your engine is running.</p></div>
              </li>
            </ul>
            <div className="pb-callout pb-callout-success">
              <div className="pb-callout-label">SUCCESS STATE</div>
              <p>When the dashboard shows a green <strong>&ldquo;Gateway: Running&rdquo;</strong> indicator — your agent engine is live. Do not connect live channels yet. Install NemoClaw security first (next chapter).</p>
            </div>
          </div>
        </section>

        {/* CH8 */}
        <section className="pb-section" id="ch8">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 08</span>
              <h2>Installing NemoClaw<br /><em>The Security Layer</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>NemoClaw wraps your OpenClaw install with NVIDIA&apos;s OpenShell policy engine. Install it before connecting any live channels. This is your agent&apos;s firewall.</p>
            </div>
            <div className="pb-callout pb-callout-warn">
              <div className="pb-callout-label">CRITICAL: DO THIS BEFORE CONNECTING CHANNELS</div>
              <p>Install NemoClaw before you connect WhatsApp, Gmail, or any live channel. Once real customer data flows through your agent, you want OpenShell policies active from day one — not as an afterthought.</p>
            </div>
            <h3 style={{ fontSize: "1.1rem", margin: "2rem 0 1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>Fresh Install (new OpenClaw setup)</h3>
            <div className="pb-code-block">
              <div className="pb-code-header"><div className="pb-code-dots"><span></span><span></span><span></span></div><span className="lang">TERMINAL — Mac / Linux</span></div>
              <div className="pb-code-body"><pre><span className="pb-comment"># Step 1: Download and install NemoClaw</span>{"\n"}<span className="pb-cmd">curl -fsSL https://nvidia.com/nemoclaw.sh | bash</span>{"\n\n"}<span className="pb-comment"># Step 2: Run interactive onboarding</span>{"\n"}<span className="pb-cmd">nemoclaw onboard</span>{"\n\n"}<span className="pb-comment"># Step 3: Confirm everything is active</span>{"\n"}<span className="pb-cmd">nemoclaw status</span></pre></div>
            </div>
            <h3 style={{ fontSize: "1.1rem", margin: "2rem 0 1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>Migrating an Existing OpenClaw Setup</h3>
            <div className="pb-code-block">
              <div className="pb-code-header"><div className="pb-code-dots"><span></span><span></span><span></span></div><span className="lang">TERMINAL</span></div>
              <div className="pb-code-body"><pre><span className="pb-comment"># Import your existing OpenClaw config automatically</span>{"\n"}<span className="pb-cmd">nemoclaw onboard --import-from=openclaw</span></pre></div>
            </div>
            <h3 style={{ fontSize: "1.1rem", margin: "2rem 0 1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>Enable Local AI Routing (NVIDIA GPU only)</h3>
            <div className="pb-code-block">
              <div className="pb-code-header"><div className="pb-code-dots"><span></span><span></span><span></span></div><span className="lang">TERMINAL — RTX GPU required</span></div>
              <div className="pb-code-body"><pre><span className="pb-comment"># Route sensitive workloads to on-device Nemotron model</span>{"\n"}<span className="pb-cmd">nemoclaw config set router.mode=local-first</span>{"\n\n"}<span className="pb-comment"># Verify routing mode</span>{"\n"}<span className="pb-cmd">nemoclaw config get router.mode</span></pre></div>
            </div>
            <div className="pb-callout pb-callout-success">
              <div className="pb-callout-label">VERIFICATION — WHAT TO LOOK FOR</div>
              <p><code>nemoclaw status</code> should show: <strong>OpenShell: active</strong> &middot; <strong>Policy: loaded</strong> &middot; <strong>Audit log: enabled</strong>. If all three are confirmed — your security layer is live and protecting your stack.</p>
            </div>
          </div>
        </section>

        {/* CH9 */}
        <section className="pb-section" id="ch9">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 09</span>
              <h2>OpenShell Policy Setup<br /><em>Protecting Your Business</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>OpenShell policies are YAML files that define the exact boundaries of what your agent is allowed to do. Every action your agent attempts is checked against this file before it executes. If it&apos;s not in the policy — it doesn&apos;t happen.</p>
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>The Starter Business Policy</h3>
            <p style={{ marginBottom: "1.5rem" }}>Save this as <code>~/.openclaw/openshell.yaml</code>. Customize the file paths and approved domains to match your business setup. This is a safe, restrictive baseline for any local business.</p>
            <div className="pb-policy-block">
              <div className="pb-policy-header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                ~/.openclaw/openshell.yaml — LocalClaw Starter Policy
              </div>
              <div className="pb-policy-body"><pre>{`version: "2026-03"
agent_id: "my-business-agent"

capabilities:

  file_system:
    allow:
      - "/home/user/business/contacts/**"   # CRM / customer data
      - "/home/user/business/bookings/**"   # Appointment files
      - "/tmp/agent-workspace"              # Temporary scratch space
    deny:
      - "**/.*"                             # ALL hidden files (.env, .ssh, etc.)
      - "/home/user/.ssh/**"               # SSH keys — explicit block
      - "/etc/passwd"                       # System credential files

  network:
    mode: "allowlist"
    allow_domains:
      - "api.openai.com"
      - "api.anthropic.com"
      - "calendar.googleapis.com"
      - "gmail.googleapis.com"
      - "api.telegram.org"
    deny_all_else: true

  local_routing:
    force_local_on_sensitive: true

logging:
  level: verbose
  destination: "/var/log/openshell/agent.log"`}</pre></div>
            </div>
            <div className="pb-callout pb-callout-gold">
              <div className="pb-callout-label">THE SINGLE MOST IMPORTANT LINE</div>
              <p>The <code>&quot;**/.*&quot;</code> deny pattern is your most powerful security rule. One wildcard blocks every hidden file on the system — your <code>.env</code>, <code>.ssh</code>, browser session files, cached credentials. Never remove it.</p>
            </div>
            <h3 style={{ fontSize: "1.1rem", margin: "2rem 0 1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>Reload Policy Without Restarting</h3>
            <div className="pb-code-block">
              <div className="pb-code-header"><div className="pb-code-dots"><span></span><span></span><span></span></div><span className="lang">TERMINAL</span></div>
              <div className="pb-code-body"><pre><span className="pb-comment"># Validate your policy file for YAML syntax errors</span>{"\n"}<span className="pb-cmd">nemoclaw policy validate</span>{"\n\n"}<span className="pb-comment"># Apply changes live — no daemon restart needed</span>{"\n"}<span className="pb-cmd">nemoclaw policy reload</span></pre></div>
            </div>
          </div>
        </section>

        {/* CH10 */}
        <section className="pb-section" id="ch10">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 10</span>
              <h2>Connecting Your<br /><em>Channels</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>OpenClaw supports every channel your customers use. Connect one or all of them — your agent handles them all through the same Gateway with a shared memory and context.</p>
            </div>
            <div className="pb-channel-grid">
              <div className="pb-channel-pill"><span>&#128172;</span> WhatsApp</div>
              <div className="pb-channel-pill"><span>&#9992;&#65039;</span> Telegram</div>
              <div className="pb-channel-pill"><span>&#128231;</span> Gmail</div>
              <div className="pb-channel-pill"><span>&#128197;</span> Google Calendar</div>
              <div className="pb-channel-pill"><span>&#128172;</span> Discord</div>
              <div className="pb-channel-pill"><span>&#128188;</span> Slack</div>
              <div className="pb-channel-pill"><span>&#127822;</span> iMessage</div>
              <div className="pb-channel-pill"><span>&#128248;</span> Instagram DMs</div>
            </div>
            <h3 style={{ fontSize: "1.1rem", margin: "2rem 0 1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>Telegram — Fastest Setup (5 Minutes)</h3>
            <ul className="pb-steps">
              <li className="pb-step"><div className="pb-step-num">1</div><div className="pb-step-content"><h4>Open Telegram and search for @BotFather</h4><p>BotFather is Telegram&apos;s official bot creation service. Start a chat with it — it&apos;s a verified blue-check account.</p></div></li>
              <li className="pb-step"><div className="pb-step-num">2</div><div className="pb-step-content"><h4>Send /newbot</h4><p>BotFather asks for a display name (e.g. &ldquo;Maya from Mike&apos;s Barbershop&rdquo;) and a username ending in <code>bot</code> (e.g. <code>@mikesbarbershop_bot</code>).</p></div></li>
              <li className="pb-step"><div className="pb-step-num">3</div><div className="pb-step-content"><h4>Copy the bot token</h4><p>BotFather gives you a token like <code>7845123456:AAFxxx...</code>. This is your channel key — treat it like a password.</p></div></li>
              <li className="pb-step"><div className="pb-step-num">4</div><div className="pb-step-content"><h4>Add token to OpenClaw</h4><p>Run <code>openclaw channels add telegram</code> and paste the token when prompted. Or add it directly in the dashboard under Channels &rarr; Telegram.</p></div></li>
              <li className="pb-step"><div className="pb-step-num">5</div><div className="pb-step-content"><h4>Send a test message</h4><p>Open your bot in Telegram and say &ldquo;Hello&rdquo;. You should get an agent response within 2&ndash;3 seconds.</p></div></li>
            </ul>
            <h3 style={{ fontSize: "1.1rem", margin: "2rem 0 1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>WhatsApp — Meta Business API</h3>
            <ul className="pb-steps">
              <li className="pb-step"><div className="pb-step-num">1</div><div className="pb-step-content"><h4>Create a Meta Business account</h4><p>Go to business.facebook.com and set up a free Business Account if you don&apos;t have one. Takes 3 minutes.</p></div></li>
              <li className="pb-step"><div className="pb-step-num">2</div><div className="pb-step-content"><h4>Set up WhatsApp Business API</h4><p>In Meta Business Suite &rarr; WhatsApp &rarr; Get Started. Register a dedicated phone number for your business agent.</p></div></li>
              <li className="pb-step"><div className="pb-step-num">3</div><div className="pb-step-content"><h4>Copy your credentials</h4><p>From the Meta Developer portal, copy your Phone Number ID, Business Account ID, and System User Access Token.</p></div></li>
              <li className="pb-step"><div className="pb-step-num">4</div><div className="pb-step-content"><h4>Connect via OpenClaw</h4><p>Run <code>openclaw channels add whatsapp</code> and paste your credentials. OpenClaw registers the webhook with Meta automatically.</p></div></li>
            </ul>
            <div className="pb-callout pb-callout-info">
              <div className="pb-callout-label">GMAIL + GOOGLE CALENDAR</div>
              <p>Run <code>openclaw channels add gmail</code>. You&apos;ll be redirected to Google OAuth — authorize access, and your agent can read inbound emails, draft replies, and manage calendar bookings immediately. Add <code>calendar.googleapis.com</code> and <code>gmail.googleapis.com</code> to your OpenShell allowlist first.</p>
            </div>
          </div>
        </section>

        {/* CH11 */}
        <section className="pb-section" id="ch11">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 11</span>
              <h2>Building Your First<br /><em>Business Agent</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>Every OpenClaw agent is defined by a <code>SOUL.md</code> file — a plain text document describing who your agent is, what it knows, and exactly how it should behave. No coding required. The more detailed, the better.</p>
            </div>
            <div className="pb-callout pb-callout-gold">
              <div className="pb-callout-label">WHAT IS SOUL.MD?</div>
              <p>Think of it as the job description, personality profile, and training manual for your AI employee — all in one document. You write it in plain English. OpenClaw reads it and your agent becomes that person.</p>
            </div>
            <h3 style={{ fontSize: "1.1rem", margin: "2rem 0 1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>The Complete SOUL.md Template</h3>
            <div className="pb-code-block">
              <div className="pb-code-header"><div className="pb-code-dots"><span></span><span></span><span></span></div><span className="lang">SOUL.md — Business Agent Starter Template</span></div>
              <div className="pb-code-body"><pre>{`# IDENTITY
Name: Maya
Business: Mike's Barbershop — Atlanta, GA
Role: Customer Service Agent & Booking Assistant
Tone: Friendly, warm, professional. Never robotic. Like a real person.
Language: English. Simple, clear sentences. No jargon.

# WHAT YOU KNOW
Services:
  - Haircut:             $35 · 45 minutes
  - Beard Trim:          $20 · 20 minutes
  - Haircut + Beard:     $50 · 60 minutes
  - Kids Cut (under 12): $25 · 30 minutes

Hours:   Monday–Saturday 9am–7pm · Sunday CLOSED
Address: 123 Main Street, Atlanta, GA 30301
Phone:   (404) 555-0192
Parking: Free street parking on Main Street

# HOW TO HANDLE REQUESTS
Booking request:
  Ask: which service? Preferred date and time?
  Check Google Calendar for open slots.
  Propose 2-3 options if requested slot is taken.
  Confirm: date, time, service, address, barber (if specified).
  Send reminder 24h before via same channel.

Pricing questions:
  Answer directly from the services list above.
  Never say "I'm not sure" — always give a clear answer.

Complaints:
  Acknowledge. Apologize genuinely. Offer a solution (discount or redo).
  Escalate to Mike if the customer is very upset or requests a refund.

New leads (first contact):
  Greet warmly. Ask what brings them in.
  Offer to book right away. Do not make them ask twice.

# CONVERSATION STYLE
Opening:  "Hey! Welcome to Mike's Barbershop. How can I help you today?"
Closing:  "See you soon at Mike's! \u{1F488}"
Keep responses: Short and conversational. 1-3 sentences per message.

# WHAT YOU NEVER DO
- Never promise a specific barber unless Mike confirms availability.
- Never discuss competitor pricing or badmouth other shops.
- Never share customer data, booking details, or contact info.
- Never make promises about wait times you can't verify.`}</pre></div>
            </div>
            <h3 style={{ fontSize: "1.1rem", margin: "2rem 0 1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>Register and Deploy Your Agent</h3>
            <div className="pb-code-block">
              <div className="pb-code-header"><div className="pb-code-dots"><span></span><span></span><span></span></div><span className="lang">TERMINAL</span></div>
              <div className="pb-code-body"><pre><span className="pb-comment"># Register the agent with OpenClaw</span>{"\n"}<span className="pb-cmd">openclaw agents add --soul ./SOUL.md --name &quot;maya&quot;</span>{"\n\n"}<span className="pb-comment"># Assign it to your connected channels</span>{"\n"}<span className="pb-cmd">openclaw agents assign maya --channels telegram,gmail</span>{"\n\n"}<span className="pb-comment"># Test it interactively in the terminal before going live</span>{"\n"}<span className="pb-cmd">openclaw chat --agent maya</span>{"\n\n"}<span className="pb-comment"># Check agent status</span>{"\n"}<span className="pb-cmd">openclaw agents list</span></pre></div>
            </div>
          </div>
        </section>

        {/* CH12 */}
        <section className="pb-section" id="ch12">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 12</span>
              <h2>Real-World Agent<br /><em>Recipes</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>Five ready-to-deploy agent templates for the most common local business use cases. Copy the SOUL.md core, fill in your business details, and go live in minutes.</p>
            </div>

            {/* Recipe 1: Inbox Manager */}
            <div className="pb-recipe-card">
              <div className="pb-recipe-header">
                <div>
                  <div className="pb-recipe-title">&#128231; Inbox Manager</div>
                  <p style={{ fontSize: "0.8rem", color: "#7A6E62", marginTop: "4px", fontFamily: "'Inter',sans-serif" }}>Triages every email, drafts replies, flags urgent messages for you</p>
                </div>
                <div className="pb-recipe-tag pb-tag-inbox">EMAIL</div>
              </div>
              <p className="pb-recipe-desc">Monitors your Gmail inbox and categorizes every incoming email — new lead, support request, complaint, or junk. Auto-replies to routine inquiries and queues complex ones for your review with a draft already written.</p>
              <div className="pb-recipe-soul">
                <div className="pb-recipe-soul-label">SOUL.md CORE</div>
                <pre><span className="pb-soul-key">Role:</span>           <span className="pb-soul-val">Email Triage &amp; Response Agent</span>{"\n"}<span className="pb-soul-key">Priority 1:</span>     <span className="pb-soul-str">New leads — reply within 2 min with intro + booking link</span>{"\n"}<span className="pb-soul-key">Priority 2:</span>     <span className="pb-soul-str">Support requests — acknowledge + estimated resolution time</span>{"\n"}<span className="pb-soul-key">Priority 3:</span>     <span className="pb-soul-str">Routine FAQ — auto-reply with direct answer</span>{"\n"}<span className="pb-soul-key">Flag for human:</span> <span className="pb-soul-str">Complaints, refunds, legal language, angry tone</span>{"\n"}<span className="pb-soul-key">Never:</span>          <span className="pb-soul-str">Send invoices, make refund promises, share customer data</span></pre>
              </div>
            </div>

            {/* Recipe 2: Appointment Booker */}
            <div className="pb-recipe-card">
              <div className="pb-recipe-header">
                <div>
                  <div className="pb-recipe-title">&#128197; Appointment Booker</div>
                  <p style={{ fontSize: "0.8rem", color: "#7A6E62", marginTop: "4px", fontFamily: "'Inter',sans-serif" }}>Books, reschedules, and confirms appointments via any channel</p>
                </div>
                <div className="pb-recipe-tag pb-tag-appt">BOOKING</div>
              </div>
              <p className="pb-recipe-desc">Reads your Google Calendar in real time, proposes available slots, collects customer details, creates the calendar event, and sends a confirmation message — all without any manual input from you.</p>
              <div className="pb-recipe-soul">
                <div className="pb-recipe-soul-label">SOUL.md CORE</div>
                <pre><span className="pb-soul-key">Role:</span>          <span className="pb-soul-val">Appointment Scheduling Agent</span>{"\n"}<span className="pb-soul-key">Tools:</span>         <span className="pb-soul-str">Google Calendar (read + write enabled)</span>{"\n"}<span className="pb-soul-key">Booking flow:</span>  <span className="pb-soul-str">Ask service type &rarr; check availability &rarr; propose 3 slots &rarr; confirm</span>{"\n"}<span className="pb-soul-key">Confirmation:</span>  <span className="pb-soul-str">Date, time, service, address, cancellation policy</span>{"\n"}<span className="pb-soul-key">Reminders:</span>    <span className="pb-soul-str">Send 24h before via same channel customer used to book</span>{"\n"}<span className="pb-soul-key">Reschedule:</span>   <span className="pb-soul-str">Accept if requested 4+ hours before the appointment</span>{"\n"}<span className="pb-soul-key">No-shows:</span>     <span className="pb-soul-str">Follow up 15 minutes after missed appointment time</span></pre>
              </div>
            </div>

            {/* Recipe 3: Lead Qualifier */}
            <div className="pb-recipe-card">
              <div className="pb-recipe-header">
                <div>
                  <div className="pb-recipe-title">&#127919; Lead Qualifier</div>
                  <p style={{ fontSize: "0.8rem", color: "#7A6E62", marginTop: "4px", fontFamily: "'Inter',sans-serif" }}>Scores inbound leads and routes hot ones to you instantly</p>
                </div>
                <div className="pb-recipe-tag pb-tag-lead">SALES</div>
              </div>
              <p className="pb-recipe-desc">When a new inquiry arrives on any channel, this agent asks 3&ndash;5 qualifying questions, scores the lead (hot/warm/cold), and either books them directly or sends you an instant Telegram alert with a full summary.</p>
              <div className="pb-recipe-soul">
                <div className="pb-recipe-soul-label">SOUL.md CORE</div>
                <pre><span className="pb-soul-key">Role:</span>         <span className="pb-soul-val">Lead Qualification &amp; Routing Agent</span>{"\n"}<span className="pb-soul-key">Questions:</span>   <span className="pb-soul-str">Budget range? Timeline? Specific service? Location? Heard of us how?</span>{"\n"}<span className="pb-soul-key">Hot lead:</span>    <span className="pb-soul-str">Ready to buy + budget fits &rarr; book immediately, alert owner</span>{"\n"}<span className="pb-soul-key">Warm lead:</span>  <span className="pb-soul-str">Interested, not urgent &rarr; add to follow-up, send useful content</span>{"\n"}<span className="pb-soul-key">Cold lead:</span>  <span className="pb-soul-str">Browsing &rarr; send FAQ + &ldquo;book when you&apos;re ready&rdquo; message</span>{"\n"}<span className="pb-soul-key">Owner alert:</span><span className="pb-soul-str">Telegram notification for every hot lead with full context</span></pre>
              </div>
            </div>

            {/* Recipe 4: Social Media Poster */}
            <div className="pb-recipe-card">
              <div className="pb-recipe-header">
                <div>
                  <div className="pb-recipe-title">&#128241; Social Media Poster</div>
                  <p style={{ fontSize: "0.8rem", color: "#7A6E62", marginTop: "4px", fontFamily: "'Inter',sans-serif" }}>Writes and schedules on-brand content for Instagram, Facebook &amp; X</p>
                </div>
                <div className="pb-recipe-tag pb-tag-social">CONTENT</div>
              </div>
              <p className="pb-recipe-desc">Generates on-brand posts, captions, and hashtag sets based on your business niche. Schedules them at optimal posting times and maintains a consistent content calendar with zero manual effort.</p>
              <div className="pb-recipe-soul">
                <div className="pb-recipe-soul-label">SOUL.md CORE</div>
                <pre><span className="pb-soul-key">Role:</span>         <span className="pb-soul-val">Social Media Content &amp; Scheduling Agent</span>{"\n"}<span className="pb-soul-key">Brand voice:</span> <span className="pb-soul-str">Professional, local, community-first. No slang. No politics.</span>{"\n"}<span className="pb-soul-key">Post types:</span>  <span className="pb-soul-str">Before/after, tips, promotions, testimonials, behind-the-scenes</span>{"\n"}<span className="pb-soul-key">Frequency:</span>   <span className="pb-soul-str">1 post/day Instagram &middot; 3 tweets/day &middot; 3x/week Facebook</span>{"\n"}<span className="pb-soul-key">CTA:</span>         <span className="pb-soul-str">Always include booking link or phone number at end of post</span>{"\n"}<span className="pb-soul-key">Hashtags:</span>    <span className="pb-soul-str">5&ndash;10 per post, mix of niche + local + broad</span>{"\n"}<span className="pb-soul-key">Never post:</span>  <span className="pb-soul-str">Politics, religion, competitor comparisons, unverified claims</span></pre>
              </div>
            </div>

            {/* Recipe 5: Customer Support Agent */}
            <div className="pb-recipe-card">
              <div className="pb-recipe-header">
                <div>
                  <div className="pb-recipe-title">&#127911; Customer Support Agent</div>
                  <p style={{ fontSize: "0.8rem", color: "#7A6E62", marginTop: "4px", fontFamily: "'Inter',sans-serif" }}>Handles FAQs, complaints, and follow-ups 24 hours a day</p>
                </div>
                <div className="pb-recipe-tag pb-tag-support">SUPPORT</div>
              </div>
              <p className="pb-recipe-desc">Answers every customer question using your business knowledge base. Handles complaints with empathy, resolves simple issues automatically, and escalates complex cases to you with full conversation context already attached.</p>
              <div className="pb-recipe-soul">
                <div className="pb-recipe-soul-label">SOUL.md CORE</div>
                <pre><span className="pb-soul-key">Role:</span>       <span className="pb-soul-val">Customer Support Agent</span>{"\n"}<span className="pb-soul-key">Tone:</span>       <span className="pb-soul-str">Empathetic, patient, solution-focused. Never defensive.</span>{"\n"}<span className="pb-soul-key">FAQs:</span>       <span className="pb-soul-str">Answer directly and confidently from your knowledge base</span>{"\n"}<span className="pb-soul-key">Complaints:</span> <span className="pb-soul-str">Acknowledge &rarr; apologize &rarr; offer solution &rarr; follow up in 24h</span>{"\n"}<span className="pb-soul-key">Escalate:</span>   <span className="pb-soul-str">Legal language, refunds over $100, third repeat complaint</span>{"\n"}<span className="pb-soul-key">CSAT:</span>       <span className="pb-soul-str">Ask for 1&ndash;5 star rating after every resolved issue</span>{"\n"}<span className="pb-soul-key">Log:</span>        <span className="pb-soul-str">Tag every conversation with type: FAQ / complaint / escalated</span></pre>
              </div>
            </div>
          </div>
        </section>

        {/* CH13 */}
        <section className="pb-section" id="ch13">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 13</span>
              <h2>The Privacy Router<br /><em>Keeping Sensitive Data Local</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>NemoClaw&apos;s Privacy Router evaluates every agent request and decides in real time whether to process it on a local NVIDIA Nemotron model or route it to a cloud AI. Your data never goes where it shouldn&apos;t.</p>
            </div>
            <div className="pb-arch-diagram">
              <div style={{ marginBottom: "2rem", fontFamily: "'Inter',sans-serif", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#7A6E62" }}>PRIVACY ROUTER DECISION LOGIC</div>
              <div className="pb-arch-row"><div className="pb-arch-box">Incoming Agent Request</div></div>
              <div className="pb-arch-row"><div className="pb-arch-arrow">&darr;</div></div>
              <div className="pb-arch-row"><div className="pb-arch-box gold">Privacy Router Analysis</div></div>
              <div className="pb-arch-row">
                <div style={{ textAlign: "center" }}>
                  <div className="pb-arch-box green" style={{ marginBottom: "0.4rem" }}>Contains PII / credentials / financials</div>
                  <div className="pb-arch-label">&rarr; Processed locally on Nemotron</div>
                </div>
                <div className="pb-arch-arrow" style={{ fontSize: "0.9rem", paddingTop: "8px" }}>or</div>
                <div style={{ textAlign: "center" }}>
                  <div className="pb-arch-box blue" style={{ marginBottom: "0.4rem" }}>General knowledge / content / planning</div>
                  <div className="pb-arch-label">&rarr; Cloud API (GPT-4o / Claude)</div>
                </div>
              </div>
            </div>
            <div className="pb-feature-grid">
              <div className="pb-feature-card">
                <div className="pb-feature-icon">&#128274;</div>
                <h4>What Stays Local</h4>
                <p>Customer names, phone numbers, emails, payment references, booking history, and any message containing personal details — all processed on-device.</p>
              </div>
              <div className="pb-feature-card">
                <div className="pb-feature-icon">&#9729;&#65039;</div>
                <h4>What Goes to Cloud</h4>
                <p>General content writing, knowledge lookups, planning tasks, and anything not containing sensitive data — handled by cloud models for best quality.</p>
              </div>
              <div className="pb-feature-card">
                <div className="pb-feature-icon">&#128737;&#65039;</div>
                <h4>No GPU? No Problem</h4>
                <p>Without an NVIDIA GPU, NemoClaw sanitizes prompts before cloud routing — stripping PII before the request leaves your machine.</p>
              </div>
              <div className="pb-feature-card">
                <div className="pb-feature-icon">&#128203;</div>
                <h4>Full Audit Trail</h4>
                <p>Every routing decision is logged — what was sent where, what was blocked, and which policy rule triggered. Full compliance visibility.</p>
              </div>
            </div>
            <div className="pb-callout pb-callout-success">
              <div className="pb-callout-label">GDPR &amp; DATA COMPLIANCE</div>
              <p>With local routing enabled, customer PII never leaves your server. This is a significant advantage for businesses in regulated environments or those serving customers in the EU.</p>
            </div>
          </div>
        </section>

        {/* CH14 */}
        <section className="pb-section" id="ch14">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 14</span>
              <h2>Monitoring<br /><em>&amp; Audit Logs</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>Every action your agent takes is logged. This is how you see what it&apos;s doing, catch problems early, and stay in complete control of an autonomous system running on your behalf.</p>
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1.2rem", fontFamily: "'Inter',sans-serif", color: "#F5F0E8", fontWeight: 600 }}>Viewing Live Logs</h3>
            <div className="pb-code-block">
              <div className="pb-code-header"><div className="pb-code-dots"><span></span><span></span><span></span></div><span className="lang">TERMINAL</span></div>
              <div className="pb-code-body"><pre><span className="pb-comment"># Watch the OpenShell audit log in real time</span>{"\n"}<span className="pb-cmd">tail -f /var/log/openshell/agent.log</span>{"\n\n"}<span className="pb-comment"># View OpenClaw session logs (last 100 entries)</span>{"\n"}<span className="pb-cmd">openclaw logs --tail 100</span>{"\n\n"}<span className="pb-comment"># Filter by specific channel</span>{"\n"}<span className="pb-cmd">openclaw logs --channel telegram --tail 50</span>{"\n"}<span className="pb-cmd">openclaw logs --channel gmail --tail 50</span>{"\n\n"}<span className="pb-comment"># Check overall health</span>{"\n"}<span className="pb-cmd">nemoclaw status</span>{"\n"}<span className="pb-cmd">openclaw agents list</span></pre></div>
            </div>
            <div className="pb-feature-grid">
              <div className="pb-feature-card"><div className="pb-feature-icon">&#128336;</div><h4>Timestamp</h4><p>Exact time of every agent action. Useful for debugging response delays and compliance reporting.</p></div>
              <div className="pb-feature-card"><div className="pb-feature-icon">&#128205;</div><h4>Action Type</h4><p>What the agent did — file read, API call, email sent, calendar checked, message replied.</p></div>
              <div className="pb-feature-card"><div className="pb-feature-icon">&#9989;</div><h4>Policy Result</h4><p>Whether OpenShell allowed or blocked the action, and which specific rule applied.</p></div>
              <div className="pb-feature-card"><div className="pb-feature-icon">&#128230;</div><h4>Data Routing</h4><p>Whether the request processed locally on Nemotron or went to a cloud model.</p></div>
            </div>
            <div className="pb-callout pb-callout-info">
              <div className="pb-callout-label">PRO TIP — SET UP LOG ALERTS</div>
              <p>Pipe your OpenShell log to a simple script that Telegrams you when it sees <code>DENY</code> events. If your agent is getting blocked repeatedly, it means your policy needs updating — or someone is probing it.</p>
            </div>
            <div className="pb-code-block">
              <div className="pb-code-header"><div className="pb-code-dots"><span></span><span></span><span></span></div><span className="lang">BASH — Simple DENY alert script</span></div>
              <div className="pb-code-body"><pre>{`#!/bin/bash
# Watch for DENY events and send a Telegram alert
tail -f /var/log/openshell/agent.log | grep --line-buffered "DENY" | while read line; do
  curl -s -X POST "https://api.telegram.org/bot\${BOT_TOKEN}/sendMessage" \\
    -d chat_id="\${YOUR_CHAT_ID}" \\
    -d text="OpenShell DENY: \${line}"
done`}</pre></div>
            </div>
          </div>
        </section>

        {/* CH15 */}
        <section className="pb-section" id="ch15">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 15</span>
              <h2>Troubleshooting<br /><em>Common Issues</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>The most common problems and their exact fixes. Most issues resolve in under 5 minutes. Run through these in order before reaching out for support.</p>
            </div>
            <div className="pb-trouble-item">
              <div className="pb-trouble-q">Agent isn&apos;t responding to messages</div>
              <div className="pb-trouble-a"><p>Run <code>openclaw status</code>. If it shows &ldquo;stopped&rdquo;, run <code>openclaw start</code>. If the daemon is running but messages aren&apos;t coming through, check your channel token — WhatsApp tokens expire if not refreshed. Run <code>openclaw channels refresh whatsapp</code>.</p></div>
            </div>
            <div className="pb-trouble-item">
              <div className="pb-trouble-q">nemoclaw status shows &ldquo;Policy: not loaded&rdquo;</div>
              <div className="pb-trouble-a"><p>Your <code>openshell.yaml</code> file has a syntax error. Run <code>nemoclaw policy validate</code> to find it. The most common cause is inconsistent indentation — YAML requires exact 2-space indentation throughout.</p></div>
            </div>
            <div className="pb-trouble-item">
              <div className="pb-trouble-q">Agent is blocked from a file it needs to access</div>
              <div className="pb-trouble-a"><p>Add the path to your <code>openshell.yaml</code> allow list under <code>capabilities.file_system.allow</code>. Save the file, then run <code>nemoclaw policy reload</code> — no restart needed. The change takes effect immediately.</p></div>
            </div>
            <div className="pb-trouble-item">
              <div className="pb-trouble-q">Google Calendar integration stops working</div>
              <div className="pb-trouble-a"><p>OAuth tokens expire every 7 days without refresh. Run <code>openclaw channels refresh gmail</code> to force a fresh token. Also confirm <code>calendar.googleapis.com</code> is in your OpenShell network allowlist — if it was added after initial NemoClaw setup, run <code>nemoclaw policy reload</code> after updating.</p></div>
            </div>
            <div className="pb-trouble-item">
              <div className="pb-trouble-q">Agent responses are slow (more than 5 seconds)</div>
              <div className="pb-trouble-a"><p>This is usually AI model latency, not an OpenClaw issue. Switch routine tasks to a faster model: set <code>gpt-4o-mini</code> or <code>claude-haiku</code> as default and reserve <code>gpt-4o</code> for complex queries. You can specify model per agent in the SOUL.md <code>model:</code> field.</p></div>
            </div>
            <div className="pb-trouble-item">
              <div className="pb-trouble-q">WhatsApp webhook verification failing</div>
              <div className="pb-trouble-a"><p>Meta requires a public HTTPS URL for webhook verification. If you&apos;re running locally, use ngrok: <code>ngrok http 18789</code>. Copy the HTTPS URL into your Meta Developer webhook field. For production, point a domain to your VPS and set up SSL with Let&apos;s Encrypt (free).</p></div>
            </div>
            <div className="pb-trouble-item">
              <div className="pb-trouble-q">Agent gives wrong information to customers</div>
              <div className="pb-trouble-a"><p>Update your SOUL.md knowledge base with the correct information. The more specific and explicit your SOUL.md is, the more accurate your agent becomes. After editing, run <code>openclaw agents reload maya</code> to apply changes without restarting the Gateway.</p></div>
            </div>
            <div className="pb-trouble-item">
              <div className="pb-trouble-q">OpenClaw daemon crashes on reboot</div>
              <div className="pb-trouble-a"><p>Re-run <code>openclaw onboard --install-daemon</code> to re-register the system service. On Linux, check the service status with <code>systemctl status openclaw</code> and view crash logs with <code>journalctl -u openclaw -n 50</code>.</p></div>
            </div>
            <div className="pb-callout pb-callout-info">
              <div className="pb-callout-label">STILL STUCK?</div>
              <p>DM <strong>@Th3Alch3mist_</strong> on X with your error message and the output of <code>nemoclaw status</code> + <code>openclaw logs --tail 20</code>. LocalClaw clients get priority support with same-day response.</p>
            </div>
          </div>
        </section>

        {/* CH16 */}
        <section className="pb-section" id="ch16">
          <div className="pb-container">
            <div className="pb-chapter-header">
              <span className="pb-chapter-num">CHAPTER 16</span>
              <h2>What Comes Next<br /><em>LocalClaw Managed Services</em></h2>
              <div className="pb-chapter-divider"></div>
              <p>You&apos;ve seen the full stack — from OpenClaw installation to a secured, multi-channel AI agent running for your business. The question now is: do you want to run this yourself, or have it done for you today?</p>
            </div>
            <div className="pb-feature-grid">
              <div className="pb-feature-card">
                <div className="pb-feature-icon">&#9889;</div>
                <h4>Starter</h4>
                <p style={{ color: "var(--gold)", fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.8rem" }}>$997 setup + $149/mo</p>
                <p>One agent deployed on the channel of your choice. Full OpenClaw + NemoClaw setup. Monthly support, tuning, and monitoring included.</p>
              </div>
              <div className="pb-feature-card" style={{ borderColor: "var(--gold-border)", background: "var(--gold-mid)" }}>
                <div className="pb-feature-icon">&#128640;</div>
                <h4>Business Engine</h4>
                <p style={{ color: "var(--gold)", fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.8rem" }}>$1,997 setup + $299/mo</p>
                <p>Multi-channel deployment across WhatsApp, Gmail &amp; Telegram. Three specialized agents. Advanced OpenShell policy. Weekly performance reports.</p>
              </div>
              <div className="pb-feature-card">
                <div className="pb-feature-icon">&#127970;</div>
                <h4>Full Stack</h4>
                <p style={{ color: "var(--gold)", fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.8rem" }}>$3,500 setup + $499/mo</p>
                <p>Dedicated VPS, all channels, custom agents per department, NemoClaw enterprise policies, priority support, and monthly strategy calls.</p>
              </div>
            </div>

            <div className="pb-cta-section">
              <h2>Your agent is<br /><em>ready to deploy.</em></h2>
              <p>Book a free 15-minute strategy call. We scope your deployment and you go live same day — no technical setup required on your end.</p>
              <div className="pb-btn-row">
                <a href="/intake?plan=discovery" className="pb-btn-primary">BOOK A FREE CALL</a>
                <a href="https://twitter.com/Th3Alch3mist_" target="_blank" rel="noopener noreferrer" className="pb-btn-secondary">DM @Th3Alch3mist_ on X</a>
              </div>
              <p style={{ fontSize: "0.78rem", marginTop: "1.5rem", color: "#7A6E62" }}>We schedule across all time zones. Most clients go live within 24 hours of their first call.</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pb-playbook-footer">
          <div className="pb-logo">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><path d="M14 4C14 4 8 8 6 14C4 20 8 24 14 24" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/><path d="M14 4C14 4 20 8 22 14C24 20 20 24 14 24" stroke="#C9922A" strokeWidth="2" strokeLinecap="round"/><path d="M10 10C10 10 8 16 12 20" stroke="#C9922A" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 10C18 10 20 16 16 20" stroke="#C9922A" strokeWidth="1.5" strokeLinecap="round"/><circle cx="14" cy="14" r="2" fill="#C9922A"/></svg>
            LocalClaw
          </div>
          <p>&copy; 2026 LocalClaw &middot; Powered by OpenClaw + NVIDIA NemoClaw</p>
          <a href="https://twitter.com/Th3Alch3mist_" style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.75rem", color: "#C9922A" }} target="_blank" rel="noopener noreferrer">@Th3Alch3mist_ on X</a>
        </footer>

      </div>{/* end pb-main-content */}
    </>
  );
}
