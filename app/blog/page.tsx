"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS, formatDate } from "./blogData";
import { ArrowRight, Clock, Tag, Menu, X, ChevronRight } from "lucide-react";

const GOLD = "#C9922A";
const GOLD_MID = "rgba(201,146,42,0.08)";
const GOLD_BORDER = "rgba(201,146,42,0.22)";
const CREAM = "#F5F0E8";
const MUTED = "#A89880";
const DIM = "#7A6E62";
const BG = "#0A0A0A";
const BORDER = "rgba(245,240,232,0.06)";

const sans = { fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" };
const display = { fontFamily: "'Cormorant Garamond',Georgia,serif" };

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

const CATEGORIES = ["ALL", ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered =
    activeCategory === "ALL"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory);

  const featured = BLOG_POSTS[0];
  const rest = filtered.filter((p) => p.slug !== featured.slug || activeCategory !== "ALL");

  return (
    <div style={{ ...sans, background: BG, color: CREAM, minHeight: "100vh" }}>
      {/* ── NAV ── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          background: "rgba(10,10,10,0.97)", borderBottom: `1px solid ${GOLD_BORDER}`,
          padding: "0 5%", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: "68px", backdropFilter: "blur(14px)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <ClawIcon size={32} color={GOLD} />
          <span className="lc-logo-text">LocalClaw</span>
        </Link>
        <div className="nav-desktop">
          <Link href="/#what" className="nav-link">WHAT IT DOES</Link>
          <Link href="/#how" className="nav-link">HOW IT WORKS</Link>
          <Link href="/#pricing" className="nav-link">PRICING</Link>
          <Link href="/blog" className="nav-link" style={{ color: GOLD }}>BLOG</Link>
          <Link href="/intake" className="btn-primary" style={{ padding: "10px 20px", fontSize: "0.75rem" }}>BOOK A CALL</Link>
        </div>
        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen((o) => !o)}
          style={{ background: "none", border: "none", cursor: "pointer", color: CREAM, padding: "8px", display: "none" }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`mobile-menu ${mobileOpen ? "open" : ""}`}
        style={{
          position: "fixed", top: "68px", left: 0, right: 0, zIndex: 190,
          background: "rgba(10,10,10,0.99)", borderBottom: `1px solid ${GOLD_BORDER}`,
          flexDirection: "column", padding: "1.5rem 5%", gap: "1.2rem",
          backdropFilter: "blur(14px)",
        }}
      >
        {[
          { href: "/#what", label: "WHAT IT DOES" },
          { href: "/#how", label: "HOW IT WORKS" },
          { href: "/#pricing", label: "PRICING" },
          { href: "/blog", label: "BLOG" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="nav-link"
            onClick={() => setMobileOpen(false)}
            style={{ fontSize: "0.9rem", padding: "0.4rem 0", borderBottom: `1px solid ${BORDER}`, display: "block" }}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/intake"
          className="btn-primary"
          onClick={() => setMobileOpen(false)}
          style={{ textAlign: "center", marginTop: "0.5rem" }}
        >
          BOOK A CALL
        </Link>
      </div>

      {/* ── HERO ── */}
      <section
        style={{
          paddingTop: "140px", paddingBottom: "60px", padding: "140px 6% 60px",
          position: "relative", overflow: "hidden", textAlign: "center",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute", top: "10%", right: "-8%", width: "600px", height: "600px",
            background: "radial-gradient(circle, rgba(201,146,42,0.04) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "0%", left: "-5%", width: "400px", height: "400px",
            background: "radial-gradient(circle, rgba(201,146,42,0.03) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Breadcrumb */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "6px", marginBottom: "2rem",
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(-10px)",
            transition: "all 0.6s ease",
          }}
        >
          <Link href="/" style={{ ...sans, fontSize: "0.72rem", color: DIM, textDecoration: "none", letterSpacing: "0.1em" }}>
            HOME
          </Link>
          <ChevronRight size={12} color={DIM} />
          <span style={{ ...sans, fontSize: "0.72rem", color: GOLD, letterSpacing: "0.1em" }}>BLOG</span>
        </div>

        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: GOLD_MID, border: `1px solid ${GOLD_BORDER}`,
            borderRadius: "100px", padding: "6px 18px", marginBottom: "1.8rem",
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(-20px)",
            transition: "all 0.7s ease 0.1s",
          }}
        >
          <div style={{ width: 5, height: 5, background: GOLD, borderRadius: "50%" }} />
          <span style={{ fontSize: "0.68rem", letterSpacing: "0.2em", color: GOLD, fontWeight: 600 }}>
            INSIGHTS & STRATEGIES
          </span>
        </div>

        <h1
          style={{
            ...display, fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.08,
            fontWeight: 700, marginBottom: "1.2rem", letterSpacing: "-0.02em",
            maxWidth: "800px", margin: "0 auto 1.2rem",
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease 0.2s",
          }}
        >
          AI Automation Insights<br />
          <em className="shimmer-text" style={{ fontStyle: "italic" }}>for Local Businesses</em>
        </h1>

        <p
          style={{
            fontSize: "1rem", color: MUTED, maxWidth: "560px",
            margin: "0 auto", lineHeight: 1.8,
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.8s ease 0.3s",
          }}
        >
          Expert guides, industry trends, and actionable playbooks to help you
          automate operations, close more leads, and outperform your competition with AI.
        </p>
      </section>

      {/* ── CATEGORY FILTER ── */}
      <section style={{ padding: "0 6% 3rem" }}>
        <div
          style={{
            maxWidth: "1100px", margin: "0 auto",
            display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center",
            opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.4s",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...sans,
                background: activeCategory === cat ? GOLD : "transparent",
                color: activeCategory === cat ? BG : DIM,
                border: `1px solid ${activeCategory === cat ? GOLD : GOLD_BORDER}`,
                borderRadius: "100px",
                padding: "8px 20px",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURED POST (only show on ALL) ── */}
      {activeCategory === "ALL" && (
        <section style={{ padding: "0 6% 4rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Link
              href={`/blog/${featured.slug}`}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div
                className="card-hover"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 0,
                  border: `1px solid ${GOLD_BORDER}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "rgba(13,13,13,0.8)",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(30px)",
                  transition: "all 0.9s ease 0.5s, border-color 0.35s, box-shadow 0.4s",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    position: "relative",
                    minHeight: "400px",
                    background: `url(${featured.image}) center/cover no-repeat`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute", top: "20px", left: "20px",
                      background: GOLD, color: BG,
                      padding: "5px 14px", borderRadius: "100px",
                      fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em",
                    }}
                  >
                    FEATURED
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                    <span
                      style={{
                        fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em",
                        color: GOLD, background: GOLD_MID, padding: "4px 12px",
                        borderRadius: "100px", border: `1px solid ${GOLD_BORDER}`,
                      }}
                    >
                      {featured.category}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: DIM, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={12} /> {featured.readTime}
                    </span>
                  </div>

                  <h2 style={{ ...display, fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "1rem" }}>
                    {featured.headline}
                  </h2>

                  <p style={{ fontSize: "0.88rem", color: MUTED, lineHeight: 1.7, marginBottom: "1.5rem" }}>
                    {featured.description}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: CREAM }}>{featured.author}</span>
                      <span style={{ fontSize: "0.72rem", color: DIM, marginLeft: "8px" }}>{formatDate(featured.date)}</span>
                    </div>
                    <span
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        color: GOLD, fontSize: "0.78rem", fontWeight: 600,
                      }}
                    >
                      Read Article <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── POST GRID ── */}
      <section style={{ padding: "0 6% 6rem" }}>
        <div
          style={{
            maxWidth: "1100px", margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          {(activeCategory === "ALL" ? BLOG_POSTS.slice(1) : filtered).map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <article
                className="card-hover"
                style={{
                  border: `1px solid ${GOLD_BORDER}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "rgba(13,13,13,0.8)",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.7s ease ${0.3 + i * 0.1}s, border-color 0.35s, box-shadow 0.4s`,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    height: "220px",
                    background: `url(${post.image}) center/cover no-repeat`,
                    position: "relative",
                  }}
                >
                  {/* Gradient overlay */}
                  <div
                    style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, height: "60px",
                      background: "linear-gradient(transparent, rgba(13,13,13,0.9))",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute", top: "14px", left: "14px",
                      fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.15em",
                      color: GOLD, background: "rgba(10,10,10,0.85)",
                      padding: "4px 12px", borderRadius: "100px",
                      border: `1px solid ${GOLD_BORDER}`, backdropFilter: "blur(8px)",
                    }}
                  >
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.68rem", color: DIM, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={11} /> {post.readTime}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: DIM }}>{formatDate(post.date)}</span>
                  </div>

                  <h3
                    style={{
                      ...display, fontSize: "1.25rem", fontWeight: 700,
                      lineHeight: 1.25, marginBottom: "0.7rem",
                    }}
                  >
                    {post.headline}
                  </h3>

                  <p style={{ fontSize: "0.82rem", color: MUTED, lineHeight: 1.65, marginBottom: "1.2rem", flex: 1 }}>
                    {post.description}
                  </p>

                  <div
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      color: GOLD, fontSize: "0.75rem", fontWeight: 600,
                      borderTop: `1px solid ${BORDER}`, paddingTop: "1rem",
                    }}
                  >
                    Read Article <ArrowRight size={13} />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section style={{ padding: "0 6% 6rem" }}>
        <div
          style={{
            maxWidth: "800px", margin: "0 auto", textAlign: "center",
            background: GOLD_MID, border: `1px solid ${GOLD_BORDER}`,
            borderRadius: "16px", padding: "4rem 3rem",
            position: "relative", overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute", top: "-50%", right: "-20%",
              width: "400px", height: "400px",
              background: "radial-gradient(circle, rgba(201,146,42,0.06) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2
              style={{
                ...display, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                fontWeight: 700, marginBottom: "1rem", lineHeight: 1.15,
              }}
            >
              Ready to Automate<br />
              <em style={{ fontStyle: "italic", color: GOLD }}>Your Business?</em>
            </h2>
            <p style={{ fontSize: "0.9rem", color: MUTED, lineHeight: 1.7, marginBottom: "2rem", maxWidth: "480px", margin: "0 auto 2rem" }}>
              Stop spending hours on repetitive tasks. Deploy your AI agent in under 24 hours
              and reclaim 60+ hours every month.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/intake?plan=discovery"
                className="btn-primary"
                style={{ padding: "16px 36px", fontSize: "0.82rem" }}
              >
                START WITH $97 DEPOSIT
              </Link>
              <Link
                href="/#pricing"
                className="btn-secondary"
                style={{ padding: "16px 36px", fontSize: "0.82rem" }}
              >
                VIEW PRICING
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: `1px solid ${BORDER}`, padding: "2.8rem 6%",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "1.2rem",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <ClawIcon size={28} color={GOLD} />
          <span className="lc-logo-text" style={{ fontSize: "1.4rem" }}>LocalClaw</span>
        </Link>
        <div style={{ color: DIM, fontSize: "0.77rem" }}>Powered by OpenClaw + NVIDIA NemoClaw</div>
        <a
          href="https://twitter.com/Th3Alch3mist_"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: GOLD, fontSize: "0.77rem", textDecoration: "none" }}
        >
          @Th3Alch3mist_ on X
        </a>
      </footer>

      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <style>{`
        @media (max-width: 768px) {
          .featured-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
