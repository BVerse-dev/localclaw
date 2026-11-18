import Link from "next/link";
import { COMPANY, POLICY_EFFECTIVE, POLICY_VERSION, type PolicySection } from "@/lib/policy";

const GOLD = "#C9922A";
const CREAM = "#F5F0E8";
const MUTED = "#A89880";
const DIM = "#7A6E62";
const BORDER = "rgba(201,146,42,0.18)";
const sans = { fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" };
const display = { fontFamily: "'Cormorant Garamond',Georgia,serif" };

export default function LegalPage({
  eyebrow, title, intro, sections, highlight,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: PolicySection[];
  highlight?: string;
}) {
  return (
    <div style={{ background: "#0A0A0A", color: CREAM, minHeight: "100vh", ...sans }}>
      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: "0 16px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 860, margin: "0 auto" }}>
        <Link href="/" style={{ ...display, fontSize: "1.4rem", color: CREAM, textDecoration: "none", fontWeight: 700 }}>LocalClaw</Link>
        <div style={{ display: "flex", gap: "1.2rem", fontSize: "0.78rem" }}>
          <Link href="/terms" style={{ color: MUTED, textDecoration: "none" }}>Terms</Link>
          <Link href="/refund-policy" style={{ color: MUTED, textDecoration: "none" }}>Refund Policy</Link>
          <Link href="/privacy" style={{ color: MUTED, textDecoration: "none" }}>Privacy</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 16px 96px" }}>
        <p style={{ fontSize: "0.68rem", letterSpacing: "0.22em", color: GOLD, fontWeight: 600, marginBottom: "0.8rem" }}>{eyebrow}</p>
        <h1 style={{ ...display, fontSize: "clamp(2.2rem,6vw,3.4rem)", fontWeight: 700, lineHeight: 1.08, marginBottom: "1rem" }}>{title}</h1>
        <p style={{ color: DIM, fontSize: "0.8rem", marginBottom: "2rem" }}>
          Effective {POLICY_EFFECTIVE} · Version {POLICY_VERSION} · {COMPANY.legalName} (“{COMPANY.brand}”)
        </p>
        <p style={{ color: MUTED, lineHeight: 1.8, fontSize: "0.95rem", marginBottom: highlight ? "1.6rem" : "2.6rem" }}>{intro}</p>

        {highlight && (
          <div style={{ border: `1px solid ${BORDER}`, background: "rgba(201,146,42,0.07)", borderLeft: `3px solid ${GOLD}`, padding: "1.1rem 1.3rem", marginBottom: "2.6rem", fontSize: "0.92rem", lineHeight: 1.7, color: CREAM }}>
            {highlight}
          </div>
        )}

        {sections.map((s) => (
          <section key={s.heading} style={{ marginBottom: "2.2rem" }}>
            <h2 style={{ ...display, fontSize: "1.45rem", fontWeight: 700, marginBottom: "0.7rem", color: CREAM }}>{s.heading}</h2>
            {s.body.map((para, i) => (
              <p key={i} style={{ color: MUTED, lineHeight: 1.8, fontSize: "0.92rem", marginBottom: "0.8rem" }}>{para}</p>
            ))}
          </section>
        ))}

        <p style={{ color: DIM, fontSize: "0.82rem", borderTop: `1px solid ${BORDER}`, paddingTop: "1.4rem", marginTop: "3rem" }}>
          Questions? Email <a href={`mailto:${COMPANY.email}`} style={{ color: GOLD }}>{COMPANY.email}</a>.
        </p>
      </main>
    </div>
  );
}
