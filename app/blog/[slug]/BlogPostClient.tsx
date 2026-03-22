"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BlogPost, formatDate } from "../blogData";
import {
  ArrowLeft, ArrowRight, Clock, Tag, Share2, Menu, X,
  ChevronRight, Twitter, Linkedin, Link2, CheckCircle,
} from "lucide-react";

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

interface Props {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostClient({ post, relatedPosts }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shareUrl = `https://localclawagents.com/blog/${post.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render content paragraphs with markdown-like headings
  const renderContent = (blocks: string[]) => {
    return blocks.map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2
            key={i}
            style={{
              ...display, fontSize: "clamp(1.3rem, 2vw, 1.7rem)", fontWeight: 700,
              marginTop: "2.5rem", marginBottom: "1rem", lineHeight: 1.2,
              color: CREAM,
            }}
          >
            {block.replace("## ", "")}
          </h2>
        );
      }

      // Handle bold text within paragraphs
      const parts = block.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p
          key={i}
          style={{
            fontSize: "1rem", lineHeight: 1.85, color: MUTED,
            marginBottom: "1.4rem",
          }}
        >
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={j} style={{ color: CREAM, fontWeight: 600 }}>
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={j}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div style={{ ...sans, background: BG, color: CREAM, minHeight: "100vh" }}>
      {/* ── Reading Progress Bar ── */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, height: "3px", zIndex: 300,
          width: `${scrollProgress}%`,
          background: `linear-gradient(90deg, ${GOLD}, #E8C675)`,
          transition: "width 0.1s linear",
        }}
      />

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
          <Link href="/playbook" className="nav-link">PLAYBOOK</Link>
          <Link href="/intake" className="btn-primary" style={{ padding: "10px 20px", fontSize: "0.75rem" }}>
            BOOK A CALL
          </Link>
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
          { href: "/playbook", label: "PLAYBOOK" },
        ].map(({ href, label }) => (
          <Link
            key={href} href={href} className="nav-link"
            onClick={() => setMobileOpen(false)}
            style={{ fontSize: "0.9rem", padding: "0.4rem 0", borderBottom: `1px solid ${BORDER}`, display: "block" }}
          >
            {label}
          </Link>
        ))}
        <Link href="/intake" className="btn-primary" onClick={() => setMobileOpen(false)} style={{ textAlign: "center", marginTop: "0.5rem" }}>
          BOOK A CALL
        </Link>
      </div>

      {/* ── HERO HEADER ── */}
      <section
        style={{
          paddingTop: "120px", position: "relative", overflow: "hidden",
        }}
      >
        {/* Hero image */}
        <div
          style={{
            height: "clamp(250px, 40vw, 480px)", width: "100%",
            background: `linear-gradient(to bottom, transparent 40%, ${BG} 100%), url(${post.image}) center/cover no-repeat`,
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s ease",
          }}
        />

        {/* Content overlay */}
        <div
          style={{
            maxWidth: "780px", margin: "-80px auto 0", padding: "0 6%",
            position: "relative", zIndex: 2,
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.5rem",
              opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(-10px)",
              transition: "all 0.5s ease 0.2s",
            }}
          >
            <Link href="/" style={{ fontSize: "0.7rem", color: DIM, textDecoration: "none", letterSpacing: "0.1em" }}>
              HOME
            </Link>
            <ChevronRight size={11} color={DIM} />
            <Link href="/blog" style={{ fontSize: "0.7rem", color: DIM, textDecoration: "none", letterSpacing: "0.1em" }}>
              BLOG
            </Link>
            <ChevronRight size={11} color={DIM} />
            <span style={{ fontSize: "0.7rem", color: GOLD, letterSpacing: "0.1em" }}>{post.category}</span>
          </div>

          {/* Meta */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.2rem", flexWrap: "wrap",
              opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(-8px)",
              transition: "all 0.6s ease 0.3s",
            }}
          >
            <span
              style={{
                fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em",
                color: GOLD, background: GOLD_MID, padding: "4px 14px",
                borderRadius: "100px", border: `1px solid ${GOLD_BORDER}`,
              }}
            >
              {post.category}
            </span>
            <span style={{ fontSize: "0.72rem", color: DIM, display: "flex", alignItems: "center", gap: "4px" }}>
              <Clock size={12} /> {post.readTime}
            </span>
            <span style={{ fontSize: "0.72rem", color: DIM }}>
              {formatDate(post.date)}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              ...display, fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700, lineHeight: 1.1, marginBottom: "1.5rem",
              opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.8s ease 0.4s",
            }}
          >
            {post.headline}
          </h1>

          {/* Author + Share */}
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              paddingBottom: "2rem", borderBottom: `1px solid ${GOLD_BORDER}`,
              marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem",
              opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease 0.5s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${GOLD}, rgba(201,146,42,0.5))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", fontWeight: 700, color: BG,
                }}
              >
                {post.author[0]}
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>{post.author}</div>
                <div style={{ fontSize: "0.7rem", color: DIM }}>{post.authorRole}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  border: `1px solid ${GOLD_BORDER}`, background: GOLD_MID,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.3s",
                }}
                title="Share on X"
              >
                <Twitter size={14} color={MUTED} />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  border: `1px solid ${GOLD_BORDER}`, background: GOLD_MID,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.3s",
                }}
                title="Share on LinkedIn"
              >
                <Linkedin size={14} color={MUTED} />
              </a>
              <button
                onClick={copyLink}
                style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  border: `1px solid ${copied ? GOLD : GOLD_BORDER}`,
                  background: copied ? GOLD_MID : GOLD_MID,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.3s",
                }}
                title="Copy link"
              >
                {copied ? <CheckCircle size={14} color={GOLD} /> : <Link2 size={14} color={MUTED} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLE BODY ── */}
      <article style={{ maxWidth: "780px", margin: "0 auto", padding: "0 6% 4rem" }}>
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease 0.6s",
          }}
        >
          {renderContent(post.content)}
        </div>

        {/* Keywords / Tags */}
        <div
          style={{
            display: "flex", flexWrap: "wrap", gap: "8px",
            marginTop: "3rem", paddingTop: "2rem",
            borderTop: `1px solid ${GOLD_BORDER}`,
          }}
        >
          {post.keywords.map((kw) => (
            <span
              key={kw}
              style={{
                fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em",
                color: DIM, background: GOLD_MID,
                padding: "5px 14px", borderRadius: "100px",
                border: `1px solid ${GOLD_BORDER}`,
                display: "flex", alignItems: "center", gap: "5px",
              }}
            >
              <Tag size={10} /> {kw}
            </span>
          ))}
        </div>
      </article>

      {/* ── CTA SECTION ── */}
      <section style={{ padding: "0 6% 5rem" }}>
        <div
          style={{
            maxWidth: "780px", margin: "0 auto", textAlign: "center",
            background: `linear-gradient(135deg, rgba(201,146,42,0.08) 0%, rgba(201,146,42,0.02) 100%)`,
            border: `1px solid ${GOLD_BORDER}`, borderRadius: "16px",
            padding: "3.5rem 2.5rem", position: "relative", overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute", top: "-30%", right: "-15%",
              width: "300px", height: "300px",
              background: "radial-gradient(circle, rgba(201,146,42,0.06) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ ...display, fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 700, marginBottom: "0.8rem" }}>
              {post.cta.text}
            </h2>
            <p style={{ fontSize: "0.88rem", color: MUTED, lineHeight: 1.7, marginBottom: "1.8rem", maxWidth: "440px", margin: "0 auto 1.8rem" }}>
              {post.description}
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href={post.cta.href} className="btn-primary" style={{ padding: "16px 36px" }}>
                {post.cta.text.toUpperCase()}
              </Link>
              <Link href="/blog" className="btn-secondary" style={{ padding: "16px 36px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ArrowLeft size={14} /> BACK TO BLOG
                </span>
              </Link>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
              {["$97 credited to setup fee", "30-day money-back guarantee", "Live in under 24 hours"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <CheckCircle size={11} color={GOLD} strokeWidth={2} />
                  <span style={{ color: DIM, fontSize: "0.72rem" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED POSTS ── */}
      <section style={{ padding: "0 6% 5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h3
            style={{
              ...display, fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
              fontWeight: 700, marginBottom: "2rem", textAlign: "center",
            }}
          >
            Continue Reading
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {relatedPosts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="card-hover"
                  style={{
                    border: `1px solid ${GOLD_BORDER}`, borderRadius: "12px",
                    overflow: "hidden", background: "rgba(13,13,13,0.8)",
                    height: "100%", display: "flex", flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      height: "160px",
                      background: `url(${rp.image}) center/cover no-repeat`,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute", bottom: 0, left: 0, right: 0, height: "40px",
                        background: "linear-gradient(transparent, rgba(13,13,13,0.9))",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute", top: "10px", left: "10px",
                        fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.12em",
                        color: GOLD, background: "rgba(10,10,10,0.85)",
                        padding: "3px 10px", borderRadius: "100px",
                        border: `1px solid ${GOLD_BORDER}`,
                      }}
                    >
                      {rp.category}
                    </span>
                  </div>
                  <div style={{ padding: "1.2rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h4 style={{ ...display, fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.25, marginBottom: "0.5rem" }}>
                      {rp.headline}
                    </h4>
                    <p style={{ fontSize: "0.76rem", color: MUTED, lineHeight: 1.6, flex: 1 }}>
                      {rp.description.slice(0, 120)}...
                    </p>
                    <div
                      style={{
                        display: "flex", alignItems: "center", gap: "5px",
                        color: GOLD, fontSize: "0.72rem", fontWeight: 600,
                        marginTop: "0.8rem", paddingTop: "0.8rem",
                        borderTop: `1px solid ${BORDER}`,
                      }}
                    >
                      Read Article <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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

      {/* Grain */}
      <div className="grain-overlay" aria-hidden="true" />
    </div>
  );
}
