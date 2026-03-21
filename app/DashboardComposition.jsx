"use client";
import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  AbsoluteFill,
  Easing,
} from "remotion";
import {
  Mail, Calendar, Zap, MessageSquare, BarChart2, Shield,
  Bell, Settings, ChevronUp, ChevronDown,
  BotMessageSquare, Wifi,
} from "lucide-react";

// ── Brand tokens ──
const GOLD = "#C9922A";
const CREAM = "#F5F0E8";
const MUTED = "#A89880";
const DIM = "#7A6E62";
const BG = "#0A0A0A";
const BG2 = "#0D0D0D";
const BORDER = "rgba(245,240,232,0.06)";
const GOLD_BORDER = "rgba(201,146,42,0.22)";
const GREEN = "#22C55E";
const AMBER = "#F59E0B";
const RED = "#EF4444";
const BLUE = "#3B82F6";
const sans = { fontFamily: "'Inter','Helvetica Neue',Arial,sans-serif" };
const display = { fontFamily: "'Cormorant Garamond',Georgia,serif" };

// ── Claw icon ──
function ClawIcon({ size = 20, color = GOLD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M10 6 C10 6, 7 14, 9 24 C10 30, 14 34, 16 36" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M18 4 C18 4, 16 13, 18 23 C19.5 29.5, 22 33, 23 36" stroke={color} strokeWidth="3.2" strokeLinecap="round" fill="none"/>
      <path d="M26 6 C26 6, 25 15, 27 24 C28.5 30, 30 33, 30 36" stroke={color} strokeWidth="2.6" strokeLinecap="round" fill="none"/>
      <path d="M10 6 C11 3, 14 2, 15 4" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M18 4 C19 1, 22 1, 22 3" stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none"/>
      <path d="M26 6 C27 3, 30 3, 29 5" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ── Animated status pill ──
function StatusPill({ active, frame, fps, delay = 0 }) {
  const progress = spring({ frame, fps, delay, config: { damping: 200 } });
  const scale = interpolate(progress, [0, 1], [0, 1]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", transform: `scale(${scale})` }}>
      <div style={{
        width: 6, height: 6, borderRadius: "50%",
        background: active ? GREEN : RED,
        boxShadow: active ? `0 0 6px ${GREEN}` : "none",
      }} />
      <span style={{ ...sans, fontSize: "0.65rem", color: active ? GREEN : RED, fontWeight: 600, letterSpacing: "0.08em" }}>
        {active ? "ACTIVE" : "OFFLINE"}
      </span>
    </div>
  );
}

// ── Animated sparkline ──
function AnimatedSparkline({ data, color = GOLD, frame, fps, delay = 0 }) {
  const progress = spring({ frame, fps, delay, config: { damping: 15, stiffness: 80 } });
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 28;

  const visibleCount = Math.ceil(interpolate(progress, [0, 1], [0, data.length], { extrapolateRight: "clamp" }));
  const visibleData = data.slice(0, visibleCount);

  const pts = visibleData.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {visibleData.length > 1 && (
        <polyline
          points={`0,${h} ${pts} ${(visibleData.length - 1) / (data.length - 1) * w},${h}`}
          fill={`url(#sg${color.replace("#", "")})`}
          stroke="none"
        />
      )}
      <defs>
        <linearGradient id={`sg${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Animated counter ──
function AnimatedCounter({ value, frame, fps, delay = 0 }) {
  const progress = spring({ frame, fps, delay, config: { damping: 200 } });
  const num = typeof value === "number"
    ? Math.round(interpolate(progress, [0, 1], [0, value], { extrapolateRight: "clamp" }))
    : value;
  return <>{num}</>;
}

// ── Main Dashboard Composition ──
export const DashboardAnimation = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Shell entrance
  const shellEntrance = spring({ frame, fps, config: { damping: 20, stiffness: 200 } });
  const shellScale = interpolate(shellEntrance, [0, 1], [0.92, 1]);
  const shellOpacity = interpolate(shellEntrance, [0, 1], [0, 1]);

  // Top bar
  const topBarSlide = spring({ frame, fps, delay: 4, config: { damping: 200 } });
  const topBarY = interpolate(topBarSlide, [0, 1], [-20, 0]);

  // Stats row entrance
  const statsEntrance = spring({ frame, fps, delay: 8, config: { damping: 15, stiffness: 120 } });

  const agents = [
    { name: "CEO Agent", role: "Email + Calendar", actions: 47, status: true, lastAction: "Drafted reply to J. Mensah", ago: "2m ago", color: GOLD },
    { name: "Sales Agent", role: "CRM + Outreach", actions: 31, status: true, lastAction: "Followed up with 3 leads", ago: "8m ago", color: BLUE },
    { name: "Ops Agent", role: "Slack + Suppliers", actions: 19, status: true, lastAction: "Summarised #team-updates", ago: "12m ago", color: GREEN },
    { name: "Finance Bot", role: "Invoices + Reports", actions: 8, status: false, lastAction: "Report sent to owner", ago: "3h ago", color: AMBER },
  ];

  const feed = [
    { icon: Mail, label: "Email triaged", detail: "Re: Partnership inquiry", time: "just now", color: GOLD },
    { icon: Calendar, label: "Meeting rescheduled", detail: "2pm → 3:30pm confirmed", time: "4m", color: BLUE },
    { icon: MessageSquare, label: "Slack thread summarised", detail: "#sales — 14 messages", time: "9m", color: GREEN },
    { icon: BarChart2, label: "Daily brief delivered", detail: "7 action items flagged", time: "1h", color: AMBER },
  ];

  const sparkData = [12, 18, 14, 22, 19, 28, 24, 31, 27, 34, 29, 38];

  const stats = [
    { label: "Active Agents", value: "3 / 4", delta: "+1", up: true, color: GREEN },
    { label: "Actions Today", value: 106, delta: "+12", up: true, color: GOLD },
    { label: "Emails Handled", value: 38, delta: "−2", up: false, color: MUTED },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
      }}>
        <div style={{
          background: "#0D0D0D",
          border: `1px solid ${GOLD_BORDER}`,
          borderRadius: "12px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "520px",
          boxShadow: `0 0 80px rgba(201,146,42,0.08), 0 0 0 1px rgba(201,146,42,0.1)`,
          transform: `scale(${shellScale})`,
          opacity: shellOpacity,
        }}>
          {/* Top bar */}
          <Sequence from={0} layout="none" premountFor={fps}>
            <div style={{
              background: BG, borderBottom: `1px solid ${BORDER}`,
              padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
              transform: `translateY(${topBarY}px)`,
              opacity: interpolate(topBarSlide, [0, 1], [0, 1]),
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ClawIcon size={20} color={GOLD} />
                <span style={{ ...sans, fontSize: "0.78rem", fontWeight: 600, color: CREAM, letterSpacing: "0.04em" }}>LocalClaw</span>
                <span style={{ ...sans, fontSize: "0.65rem", color: DIM }}>/ dashboard</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Wifi size={11} color={GREEN} />
                  <span style={{ ...sans, fontSize: "0.6rem", color: GREEN, fontWeight: 600 }}>LIVE</span>
                </div>
                <Bell size={13} color={DIM} />
                <Settings size={13} color={DIM} />
              </div>
            </div>
          </Sequence>

          {/* Stats row */}
          <Sequence from={0} layout="none" premountFor={fps}>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px",
              background: BORDER, borderBottom: `1px solid ${BORDER}`,
            }}>
              {stats.map((s, i) => {
                const stagger = 8 + i * 5;
                const entrance = spring({ frame, fps, delay: stagger, config: { damping: 20, stiffness: 200 } });
                const y = interpolate(entrance, [0, 1], [30, 0]);
                const o = interpolate(entrance, [0, 1], [0, 1]);
                return (
                  <div key={i} style={{
                    background: BG2, padding: "12px 14px",
                    transform: `translateY(${y}px)`, opacity: o,
                  }}>
                    <div style={{ ...sans, fontSize: "0.6rem", color: DIM, letterSpacing: "0.12em", marginBottom: "4px" }}>
                      {s.label.toUpperCase()}
                    </div>
                    <div style={{ ...sans, fontSize: "1.15rem", fontWeight: 700, color: s.color, lineHeight: 1 }}>
                      {typeof s.value === "number"
                        ? <AnimatedCounter value={s.value} frame={frame} fps={fps} delay={stagger + 8} />
                        : s.value}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "4px" }}>
                      {s.up ? <ChevronUp size={10} color={GREEN} /> : <ChevronDown size={10} color={RED} />}
                      <span style={{ ...sans, fontSize: "0.6rem", color: s.up ? GREEN : RED }}>{s.delta} today</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Sequence>

          {/* Agents list */}
          <Sequence from={0} layout="none" premountFor={fps}>
            <div style={{ padding: "14px 16px 0" }}>
              <div style={{ ...sans, fontSize: "0.62rem", letterSpacing: "0.15em", color: DIM, marginBottom: "10px" }}>
                AGENT STATUS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {agents.map((a, i) => {
                  const stagger = 18 + i * 6;
                  const entrance = spring({ frame, fps, delay: stagger, config: { damping: 15, stiffness: 120 } });
                  const x = interpolate(entrance, [0, 1], [60, 0]);
                  const o = interpolate(entrance, [0, 1], [0, 1]);

                  // Typing animation for lastAction
                  const typingDelay = stagger + 12;
                  const typingProgress = spring({ frame, fps, delay: typingDelay, config: { damping: 200 } });
                  const charsVisible = Math.floor(interpolate(typingProgress, [0, 1], [0, a.lastAction.length], { extrapolateRight: "clamp" }));

                  return (
                    <div key={i} style={{
                      background: "#111",
                      border: `1px solid ${a.status ? "rgba(201,146,42,0.12)" : BORDER}`,
                      borderRadius: "6px",
                      padding: "10px 12px",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px",
                      transform: `translateX(${x}px)`, opacity: o,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: `${a.color}18`, border: `1px solid ${a.color}40`,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <BotMessageSquare size={12} color={a.color} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ ...sans, fontSize: "0.75rem", fontWeight: 600, color: CREAM, marginBottom: "1px" }}>{a.name}</div>
                          <div style={{ ...sans, fontSize: "0.62rem", color: DIM, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {a.lastAction.slice(0, charsVisible)}
                            {charsVisible < a.lastAction.length && <span style={{ opacity: frame % 16 < 8 ? 1 : 0, color: GOLD }}>|</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                        <StatusPill active={a.status} frame={frame} fps={fps} delay={stagger + 8} />
                        <span style={{ ...sans, fontSize: "0.6rem", color: DIM }}>{a.ago}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Sequence>

          {/* Sparkline + activity */}
          <Sequence from={0} layout="none" premountFor={fps}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px",
              background: BORDER, margin: "14px 0 0", borderTop: `1px solid ${BORDER}`,
            }}>
              {/* Chart */}
              <div style={{ background: BG2, padding: "14px 16px" }}>
                <div style={{ ...sans, fontSize: "0.6rem", color: DIM, letterSpacing: "0.12em", marginBottom: "8px" }}>ACTIONS / HOUR</div>
                <AnimatedSparkline data={sparkData} color={GOLD} frame={frame} fps={fps} delay={42} />
                <div style={{ ...sans, fontSize: "0.62rem", color: MUTED, marginTop: "6px" }}>
                  <span style={{ color: GOLD, fontWeight: 700 }}>↑ 24%</span> vs yesterday
                </div>
              </div>

              {/* Live feed */}
              <div style={{ background: BG2, padding: "14px 16px" }}>
                <div style={{ ...sans, fontSize: "0.6rem", color: DIM, letterSpacing: "0.12em", marginBottom: "8px" }}>LIVE FEED</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  {feed.map((f, i) => {
                    const feedDelay = 48 + i * 6;
                    const entrance = spring({ frame, fps, delay: feedDelay, config: { damping: 20, stiffness: 200 } });
                    const feedY = interpolate(entrance, [0, 1], [15, 0]);
                    const feedO = interpolate(entrance, [0, 1], [0, 1]);
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        transform: `translateY(${feedY}px)`, opacity: feedO,
                      }}>
                        <f.icon size={9} color={f.color} strokeWidth={2} style={{ flexShrink: 0 }} />
                        <span style={{ ...sans, fontSize: "0.58rem", color: i === 0 ? CREAM : MUTED, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.label}</span>
                        <span style={{ ...sans, fontSize: "0.56rem", color: DIM, flexShrink: 0 }}>{f.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Sequence>

          {/* Morning brief banner */}
          <Sequence from={0} layout="none" premountFor={fps}>
            {(() => {
              const bannerDelay = 72;
              const bannerEntrance = spring({ frame, fps, delay: bannerDelay, config: { damping: 200 } });
              const bannerO = interpolate(bannerEntrance, [0, 1], [0, 1]);
              const bannerY = interpolate(bannerEntrance, [0, 1], [10, 0]);
              // Pulse the dot
              const pulsePhase = Math.sin((frame - bannerDelay) * 0.1) * 0.5 + 0.5;
              const dotGlow = interpolate(pulsePhase, [0, 1], [4, 8]);
              return (
                <div style={{
                  background: `linear-gradient(135deg, rgba(201,146,42,0.1) 0%, rgba(201,146,42,0.04) 100%)`,
                  borderTop: `1px solid ${GOLD_BORDER}`,
                  padding: "12px 16px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transform: `translateY(${bannerY}px)`, opacity: bannerO,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", background: GOLD,
                      boxShadow: `0 0 ${dotGlow}px ${GOLD}`,
                    }} />
                    <span style={{ ...sans, fontSize: "0.65rem", color: MUTED }}>Morning brief delivered to Telegram</span>
                  </div>
                  <span style={{ ...sans, fontSize: "0.6rem", color: GOLD, fontWeight: 600 }}>9:00 AM</span>
                </div>
              );
            })()}
          </Sequence>
        </div>
      </div>
    </AbsoluteFill>
  );
};
