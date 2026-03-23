import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LocalClaw — AI Agents for Local Businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #080704 0%, #111009 40%, #0D0B07 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,146,42,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-50px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,146,42,0.08) 0%, transparent 60%)",
            display: "flex",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #C9922A, #E8C06A, #C9922A)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            padding: "0 80px",
          }}
        >
          {/* Claw icon */}
          <svg width="80" height="80" viewBox="0 0 40 40" fill="none">
            <path d="M10 6 C10 6, 7 14, 9 24 C10 30, 14 34, 16 36" stroke="#C9922A" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M18 4 C18 4, 16 13, 18 23 C19.5 29.5, 22 33, 23 36" stroke="#C9922A" strokeWidth="3.2" strokeLinecap="round" fill="none"/>
            <path d="M26 6 C26 6, 25 15, 27 24 C28.5 30, 30 33, 30 36" stroke="#C9922A" strokeWidth="2.6" strokeLinecap="round" fill="none"/>
            <path d="M10 6 C11 3, 14 2, 15 4" stroke="#C9922A" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            <path d="M18 4 C19 1, 22 1, 22 3" stroke="#C9922A" strokeWidth="2.4" strokeLinecap="round" fill="none"/>
            <path d="M26 6 C27 3, 30 3, 29 5" stroke="#C9922A" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>

          {/* Brand name */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#F5EED8",
              letterSpacing: "-2px",
              lineHeight: 1,
              display: "flex",
            }}
          >
            LocalClaw
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "#C9922A",
              textAlign: "center",
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            AI Agents for Local Businesses
          </div>

          {/* Features row */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "16px",
            }}
          >
            {["Lead Capture", "Appointment Booking", "Social Media", "24/7 Automation"].map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#9A8F7E",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#C9922A",
                    display: "flex",
                  }}
                />
                {f}
              </div>
            ))}
          </div>

          {/* URL */}
          <div
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#635C50",
              letterSpacing: "3px",
              marginTop: "24px",
              display: "flex",
            }}
          >
            LOCALCLAWAGENTS.COM
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, rgba(201,146,42,0.3), transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
