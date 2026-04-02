import { useState, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useIsMobile from "@/lib/hooks/useIsMobile";

// ─── BECOME A PROVIDER ────────────────────────────────────────────────────────

const T = {
  navy:       "#0a1628",
  navyMid:    "#155279",
  teal:       "#32cce0",
  tealLt:     "#5dd8e8",
  white:      "#ffffff",
  offWhite:   "#f8fafc",
  bgSection:  "#f1f5f9",
  bgBlue:     "#f0faff",
  border:     "#e2e8f0",
  borderMid:  "#cbd5e1",
  grayText:   "#64748b",
  textBody:   "#475569",
  textDark:   "#155279",
  textMid:    "#1e293b",
  gold:       "#d97706",
  goldBg:     "#fef3c7",
  green:      "#059669",
  greenBg:    "#d1fae5",
};

// ─── FAQ ITEM ──────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 0", width: "100%", background: "none", border: "none",
          cursor: "pointer", fontFamily: "Outfit, sans-serif", fontSize: 15,
          fontWeight: 600, color: open ? T.teal : T.textMid,
          textAlign: "left" as const, gap: 16, transition: "color .2s",
        }}
      >
        {q}
        <span style={{ fontSize: 20, color: T.teal, flexShrink: 0, transition: "transform .25s", transform: open ? "rotate(45deg)" : "none", display: "inline-block", lineHeight: 1 }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 20, color: T.textBody, fontSize: 14.5, lineHeight: 1.7 }}>{a}</div>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function BecomeProviderPage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [f, setF] = useState({ clinicName: "", contactName: "", email: "", phone: "", specialty: "", country: "" });
  const [done, setDone] = useState(false);

  const inputStyle = {
    background: T.offWhite, border: `1px solid ${T.border}`, borderRadius: 10,
    padding: "13px 16px", color: T.textMid, fontSize: 14.5,
    fontFamily: "inherit", outline: "none", width: "100%", appearance: "none" as const,
    transition: "border-color .2s, background .2s, box-shadow .2s",
  };
  const labelStyle = { fontSize: 13, fontWeight: 600 as const, color: T.textMid, marginBottom: 6, display: "block" as const };

  if (done) return (
    <>
      <Head><title>Application Received | Hospital.com</title></Head>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 32, background: T.bgSection }}>
        <div style={{ width: "100%", maxWidth: 480, background: T.white, borderRadius: 20, padding: "48px 40px", boxShadow: "0 8px 40px rgba(0,0,0,0.12)", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
          </div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 12, color: T.textMid }}>Application Received!</h2>
          <p style={{ color: T.grayText, fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>Thank you! Our team will review your application and get back to you within 24 hours.</p>
          <button onClick={() => router.push("/")}
            style={{ background: T.teal, color: "#fff", border: "none", borderRadius: 14, padding: "14px 36px", fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 32px rgba(50,204,224,0.35)", transition: "all .2s" }}>
            Back to Home
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>Become a Provider — Hospital.com</title>
        <meta name="description" content="Join Hospital.com's provider network. Get discovered by thousands of patients actively searching for your services — powered by AI." />
      </Head>

      {/* ─── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.border}`,
        padding: isMobile ? "0 20px" : "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        <button onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontSize: 20, fontWeight: 700, color: T.textDark, letterSpacing: "-0.02em", padding: 0 }}>
          hospital<span style={{ color: T.teal }}>.com</span>
        </button>
        {!isMobile && (
          <ul style={{ display: "flex", alignItems: "center", gap: 32, listStyle: "none" }}>
            {["AI Health Assistant", "Find Local Care", "Global Health Services"].map(lbl => (
              <li key={lbl}>
                <button onClick={() => lbl === "Find Local Care" ? router.push("/find-local-care") : undefined}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: T.grayText, padding: 0, transition: "color .2s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = T.textMid}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = T.grayText}
                >{lbl}</button>
              </li>
            ))}
            <li>
              <button onClick={() => document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" })}
                style={{ background: T.teal, color: "#fff", border: "none", padding: "9px 20px", borderRadius: 8, fontFamily: "inherit", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "background .2s, transform .15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = T.tealLt; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = T.teal; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
              >Become a Provider</button>
            </li>
          </ul>
        )}
        <button onClick={() => router.push("/login")}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: T.grayText, padding: 0 }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = T.textMid}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = T.grayText}
        >Login</button>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative", minHeight: isMobile ? "auto" : "92vh",
        display: "flex", alignItems: "center",
        padding: isMobile ? "60px 24px" : "80px 40px 60px",
        overflow: "hidden", background: "#f0fafe",
      }}>
        {/* Blobs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 65% 70% at -5% 55%, rgba(50,204,224,0.28) 0%, transparent 55%), radial-gradient(ellipse 55% 65% at 105% 30%, rgba(16,117,173,0.18) 0%, transparent 55%), radial-gradient(ellipse 40% 50% at 100% 90%, rgba(50,204,224,0.12) 0%, transparent 50%)" }} />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(16,117,173,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,117,173,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", width: "100%",
          display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 60, alignItems: "center" }}>

          {/* Left — content */}
          <div>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.25)", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 600, color: T.teal, marginBottom: 24, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
              <span style={{ width: 6, height: 6, background: T.teal, borderRadius: "50%", display: "inline-block" }} />
              Limited Promo — Save 67%
            </div>

            <h1 style={{ fontFamily: "Outfit, sans-serif", fontSize: isMobile ? 32 : 52, fontWeight: 800, lineHeight: 1.12, marginBottom: 20, letterSpacing: "-0.02em", color: T.textDark }}>
              Grow Your Practice with<br />
              <span style={{ color: T.teal }}>Patients Who Are<br />Searching for You</span>
            </h1>

            <p style={{ fontSize: isMobile ? 15 : 17.5, color: T.textBody, maxWidth: 480, marginBottom: 36, lineHeight: 1.7 }}>
              Join the Hospital.com provider network and get discovered by high-intent patients actively searching for your services — powered by AI.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
              <button onClick={() => document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" })}
                style={{ background: T.teal, color: "#fff", padding: "16px 36px", borderRadius: 14, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", boxShadow: "0 8px 32px rgba(50,204,224,0.35)", transition: "transform .2s, box-shadow .2s, background .2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.background = T.tealLt; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 40px rgba(50,204,224,0.45)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.background = T.teal; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(50,204,224,0.35)"; }}
              >Become a Provider</button>
              <button onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
                style={{ color: T.teal, padding: "16px 24px", borderRadius: 14, fontFamily: "inherit", fontWeight: 600, fontSize: 15, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "gap .2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.gap = "14px"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.gap = "8px"}
              >See How It Works</button>
            </div>

            {/* Trust row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex" }}>
                {[
                  { initials: "DR", bg: "linear-gradient(135deg,#6c63ff,#a78bfa)" },
                  { initials: "SK", bg: "linear-gradient(135deg,#0ea5e9,#06b6d4)" },
                  { initials: "MP", bg: "linear-gradient(135deg,#f472b6,#ec4899)" },
                  { initials: "JL", bg: "linear-gradient(135deg,#22c55e,#10b981)" },
                ].map((av, i) => (
                  <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid #fff", background: av.bg, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginRight: -10 }}>
                    {av.initials}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 13.5, color: T.grayText, marginLeft: 18 }}>
                <strong style={{ color: T.textDark }}>500+ providers</strong> already growing their practice
              </span>
            </div>
          </div>

          {/* Right — dashboard mockup */}
          {!isMobile && (
            <div style={{ position: "relative" }}>
              {/* Floating tag top */}
              <div style={{ position: "absolute", top: -20, right: -20, zIndex: 10, background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "13px 18px", fontSize: 15, fontWeight: 600, boxShadow: "0 8px 40px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" as const }}>
                <span style={{ fontSize: 20 }}>📈</span>+47% more patients this month
              </div>

              {/* Dashboard card */}
              <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 20, padding: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(50,204,224,0.08)", position: "relative" }}>
                {/* Top gradient line */}
                <div style={{ position: "absolute", top: -1, left: 30, right: 30, height: 2, background: `linear-gradient(90deg, transparent, ${T.teal}, transparent)`, borderRadius: 2 }} />

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, fontWeight: 600, color: T.textDark }}>Provider Dashboard</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.greenBg, border: "1px solid rgba(5,150,105,0.2)", borderRadius: 100, padding: "4px 12px", fontSize: 11.5, fontWeight: 600, color: T.green }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, display: "inline-block" }} />
                    Live
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Profile Views", val: "1,284", delta: "↑ 23% this week" },
                    { label: "Patient Leads", val: "47",    delta: "↑ 15 new" },
                    { label: "AI Impressions", val: "8.2K", delta: "↑ 61% ↗" },
                  ].map(s => (
                    <div key={s.label} style={{ background: T.offWhite, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, color: T.grayText, textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 4 }}>{s.label}</div>
                      <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 22, fontWeight: 700, color: T.textDark }}>{s.val}</div>
                      <div style={{ fontSize: 11.5, color: T.green, marginTop: 2 }}>{s.delta}</div>
                    </div>
                  ))}
                </div>

                {/* Bar chart */}
                <div style={{ background: T.offWhite, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 11.5, color: T.grayText, marginBottom: 12 }}>Patient Inquiries — Last 7 Days</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
                    {[35, 55, 42, 70, 60, 85, 100].map((h, i) => (
                      <div key={i} style={{ flex: 1, borderRadius: "4px 4px 0 0", height: `${h}%`, background: i === 6 ? T.teal : "rgba(50,204,224,0.3)" }} />
                    ))}
                  </div>
                </div>

                {/* Profile preview */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(50,204,224,0.05)", border: "1px solid rgba(50,204,224,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `linear-gradient(135deg, ${T.teal}, #06b6d4)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🦷</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, color: T.textDark }}>Dr. Sarah Chen, DDS</div>
                    <div style={{ fontSize: 12, color: T.grayText }}>General Dentistry · Toronto, ON</div>
                  </div>
                  <div style={{ background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.25)", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: T.teal, whiteSpace: "nowrap" as const }}>✓ Approved Provider</div>
                </div>
              </div>

              {/* Floating tag bottom */}
              <div style={{ position: "absolute", bottom: 30, left: -30, zIndex: 10, background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: "13px 18px", fontSize: 15, fontWeight: 600, boxShadow: "0 8px 40px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" as const }}>
                <svg width="22" height="22" viewBox="0 0 537.4 567.8" style={{ flexShrink: 0 }}>
                  <path fill="#32cce0" d="M458.5,187c-6.8,4.1-23.8,21-27.7,55.5v216.9c0,40.7-33,73.7-73.7,73.7H109.3c-40.7,0-73.7-33-73.7-73.7v-247.7c0-40.7,33-73.7,73.7-73.7h132.4c36.9-5.3,61.9-21.7,71.3-30.6,1.5-1.4.5-3.9-1.6-3.9H109.3C49.5,103.5,1.1,151.9,1.1,211.7v247.7c0,59.8,48.5,108.2,108.2,108.2h247.7c59.8,0,108.2-48.5,108.2-108.2v-247.8c0-9.1-.5-15.6-2.7-24.1-.4-1.5-2.8-1.4-4.1-.6h.1Z"/>
                  <path fill="#1075ad" d="M346.4,212.9h-43.4c-5.1,0-9.2,4.1-9.2,9.2v84c0,1.9-1.5,3.4-3.4,3.4h-114.5c-1.9,0-3.4-1.5-3.4-3.4v-84c0-5.1-4.1-9.2-9.2-9.2h-43.3c-5.1,0-9.2,4.1-9.2,9.2v226.6c0,5.1,4.1,9.2,9.2,9.2h43.4c5.1,0,9.2-4.1,9.2-9.2v-87.8c0-1.9,1.5-3.4,3.4-3.4h114.5c1.9,0,3.4,1.5,3.4,3.4v87.8c0,5.1,4.1,9.2,9.2,9.2h43.4c5.1,0,9.2-4.1,9.2-9.2v-226.6c0-5.1-4.1-9.2-9.2-9.2h-.1Z"/>
                </svg>
                Featured in AI results
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────────────────────── */}
      <div style={{ background: T.white, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "60px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 0 }}>
            {[
              { num: "50", suffix: "K+", desc: "Monthly healthcare searches" },
              { num: "30", suffix: "+",  desc: "Countries in our network" },
              { num: "500",suffix: "+",  desc: "Verified providers listed" },
              { num: "4.9", suffix: "★", desc: "Average provider satisfaction" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "20px 30px", borderRight: !isMobile && i < 3 ? `1px solid ${T.border}` : "none", borderBottom: isMobile && i < 2 ? `1px solid ${T.border}` : "none" }}>
                <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 42, fontWeight: 800, color: T.textDark, lineHeight: 1, marginBottom: 8 }}>
                  {s.num}<span style={{ color: T.teal }}>{s.suffix}</span>
                </div>
                <div style={{ fontSize: 14, color: T.grayText }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Logo pills */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 48, flexWrap: "wrap" }}>
            {["Dentists", "Dermatologists", "Chiropractors", "Physiotherapists", "Medical Spas", "Clinics"].map(label => (
              <div key={label} style={{ background: T.white, border: `1.5px solid ${T.teal}`, borderRadius: 100, padding: "8px 22px", fontSize: 13.5, fontWeight: 600, color: T.textBody, letterSpacing: "0.03em", boxShadow: "0 2px 8px rgba(50,204,224,0.12)" }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── WHY JOIN ────────────────────────────────────────────────────────── */}
      <section style={{ background: T.navyMid, padding: isMobile ? "70px 24px" : "90px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: T.teal, marginBottom: 12 }}>Why Providers Choose Us</div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: isMobile ? 26 : 40, fontWeight: 800, lineHeight: 1.18, letterSpacing: "-0.02em", marginBottom: 16, color: T.white }}>
            Everything You Need to<br />Attract &amp; Convert More Patients
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", maxWidth: 560, marginBottom: 0 }}>One annual membership. Six powerful tools to grow your practice.</p>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 20, marginTop: 52 }}>
            {[
              { icon: "🎯", iconBg: "rgba(50,204,224,0.08)",  title: "Patient Leads",           desc: "Get direct exposure to patients actively searching for your specific services in your area. Every visitor is a high-intent lead — not casual browsers." },
              { icon: "🤖", iconBg: "rgba(8,145,178,0.08)",   title: "Priority AI Discovery",  desc: "Approved providers receive priority placement in Hospital.com's AI-powered recommendations, putting you front and center when it matters most." },
              { icon: "🏅", iconBg: "rgba(217,119,6,0.08)",   title: "Approved Provider Badge", desc: "Receive an official badge you can proudly display on your website and advertising materials to instantly build trust with prospective patients." },
              { icon: "🔗", iconBg: "rgba(5,150,105,0.08)",   title: "Enhanced Profile & SEO", desc: "Boost your Google visibility with a do-follow link from hospital.com — a high-authority domain that improves your search ranking organically." },
              { icon: "🎬", iconBg: "rgba(139,92,246,0.08)",  title: "Branding & Media Upgrade",desc: "Make your profile stand out by adding before/after images, videos, clinic tours, and rich media that converts browsing patients into bookings." },
              { icon: "📊", iconBg: "rgba(236,72,153,0.08)",  title: "Performance Analytics", desc: "Track profile views, website clicks, patient inquiries, and AI impressions — all in one dashboard so you know exactly what's working." },
            ].map(card => (
              <WhyCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="how" style={{ background: T.bgBlue, padding: isMobile ? "70px 24px" : "90px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: T.teal, marginBottom: 12 }}>Getting Started</div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: isMobile ? 26 : 40, fontWeight: 800, lineHeight: 1.18, letterSpacing: "-0.02em", marginBottom: 16, color: T.textDark }}>Up and Running in Minutes</h2>
          <p style={{ fontSize: 16, color: T.textBody, margin: "0 auto", maxWidth: 480 }}>No contracts, no complexity. Start attracting patients within 24 hours.</p>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 0, marginTop: 60, position: "relative" }}>
            {/* Connecting line */}
            {!isMobile && (
              <div style={{ position: "absolute", top: 32, left: "10%", right: "10%", height: 2, background: `linear-gradient(90deg, transparent, ${T.teal}, #06b6d4, transparent)` }} />
            )}
            {[
              { num: "1", title: "Sign Up",           desc: "Complete our simple provider registration form — takes under 3 minutes." },
              { num: "2", title: "Build Your Profile", desc: "Add your specialties, photos, videos, and credentials to create a compelling profile." },
              { num: "3", title: "Get Verified",       desc: "Our team verifies your clinic and awards your Approved Provider badge within 24 hours." },
              { num: "4", title: "Receive Inquiries",  desc: "Patients find you through AI search and direct listings — leads start flowing in immediately." },
            ].map(step => (
              <div key={step.num} style={{ textAlign: "center", padding: "0 20px" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${T.teal}, #06b6d4)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Outfit, sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 auto 24px", boxShadow: "0 0 0 6px rgba(50,204,224,0.1)", position: "relative", zIndex: 1 }}>
                  {step.num}
                </div>
                <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 10, color: T.textDark }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: T.textBody, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNER CARDS ───────────────────────────────────────────────────── */}
      <section style={{ background: T.white, padding: isMobile ? "70px 24px" : "90px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: T.teal, marginBottom: 12 }}>Who It&apos;s For</div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: isMobile ? 26 : 40, fontWeight: 800, lineHeight: 1.18, letterSpacing: "-0.02em", marginBottom: 0, color: T.textDark }}>
            Built for Healthcare Professionals<br />Ready to Grow
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, marginTop: 52 }}>
            {[
              {
                featured: true, icon: "🏥",
                title: "Local Healthcare Providers",
                sub: "Healthcare professionals and clinics looking to reach patients in their local region and nearby areas.",
                tags: ["🦷 Dentists", "🦴 Chiropractors", "💪 Physiotherapists", "🌟 Dermatologists", "🏨 Clinics", "💆 Medical Spas", "👁️ Ophthalmologists", "🫀 Cardiologists"],
                cta: "Join as Local Provider",
              },
              {
                featured: false, icon: "✈️",
                title: "Medical Tourism Providers",
                sub: "Clinics and hospitals attracting international patients seeking high-quality, cost-effective care abroad.",
                tags: ["💉 Hair Transplants", "😁 Dental Tourism", "🏋️ Bariatric Surgery", "💊 Fertility Clinics", "🔬 Orthopedics", "🎨 Cosmetic Surgery", "👀 Eye Surgery", "❤️ Cardiac Care"],
                cta: "Join as Global Provider",
              },
            ].map(card => (
              <PartnerCard key={card.title} {...card} onCta={() => document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" })} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROFILE PREVIEW ─────────────────────────────────────────────────── */}
      <section style={{ background: T.bgBlue, padding: isMobile ? "70px 24px" : "90px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: T.teal, marginBottom: 12 }}>Your Profile on Hospital.com</div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: isMobile ? 26 : 40, fontWeight: 800, lineHeight: 1.18, letterSpacing: "-0.02em", marginBottom: 16, color: T.textDark }}>
            A Profile That Patients Trust<br />and Search Engines Love
          </h2>
          <p style={{ fontSize: 16, color: T.textBody, margin: "0 auto", maxWidth: 520 }}>
            See exactly what your premium provider listing looks like — designed to convert visitors into patients.
          </p>

          {/* Mock profile card */}
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 20, overflow: "hidden", maxWidth: 800, margin: "52px auto 0", boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
            {/* Cover */}
            <div style={{ height: 180, background: "linear-gradient(135deg, #dbeafe, #e0f2fe)", display: "flex", alignItems: "flex-end", padding: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(50,204,224,0.03) 20px, rgba(50,204,224,0.03) 21px)" }} />
              <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 10 }}>
                {["🦷", "🏥"].map(e => (
                  <div key={e} style={{ width: 80, height: 80, borderRadius: 10, background: "rgba(255,255,255,0.6)", border: "1px solid rgba(50,204,224,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{e}</div>
                ))}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "24px 28px 28px", background: T.white }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 16, background: `linear-gradient(135deg, ${T.teal}, #06b6d4)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, border: "3px solid #fff", marginTop: -52, position: "relative", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>🦷</div>
                  <div style={{ paddingLeft: 16 }}>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 4, color: T.textDark }}>Dr. Sarah Chen, DDS</div>
                    <div style={{ color: T.teal, fontSize: 14, marginBottom: 6 }}>General &amp; Cosmetic Dentistry</div>
                    <div style={{ color: T.grayText, fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}>📍 Toronto, Ontario, Canada</div>
                    <div style={{ marginTop: 8 }}>
                      <span style={{ color: T.gold, letterSpacing: 2, fontSize: 14 }}>★★★★★</span>
                      <span style={{ fontSize: 13, color: T.grayText, marginLeft: 6 }}>4.9 · 124 reviews</span>
                    </div>
                  </div>
                </div>
                <div style={{ background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.2)", borderRadius: 8, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: T.teal, flexShrink: 0 }}>
                  ✓ Approved Provider
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
                {[
                  { val: "1,284", label: "Profile Views" },
                  { val: "47",    label: "Leads This Month" },
                  { val: "8.2K",  label: "AI Impressions" },
                  { val: "98%",   label: "Response Rate" },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center", background: T.offWhite, border: `1px solid ${T.border}`, borderRadius: 10, padding: 12 }}>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 18, fontWeight: 700, color: T.textDark }}>{s.val}</div>
                    <div style={{ fontSize: 11.5, color: T.grayText, marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Teeth Whitening", "Invisalign", "Dental Implants", "Veneers", "Emergency Dental", "+8 more"].map(tag => (
                  <span key={tag} style={{ background: "rgba(50,204,224,0.07)", border: "1px solid rgba(50,204,224,0.15)", borderRadius: 100, padding: "5px 14px", fontSize: 13, color: T.teal }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─────────────────────────────────────────────────────────── */}
      <section style={{ background: T.navyMid, padding: isMobile ? "70px 24px" : "90px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: T.teal, marginBottom: 12 }}>Pricing</div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: isMobile ? 26 : 40, fontWeight: 800, lineHeight: 1.18, letterSpacing: "-0.02em", marginBottom: 16, color: T.white }}>
            One Simple Annual Fee.<br />No Hidden Costs.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", margin: "0 auto", maxWidth: 480 }}>Lock in founding member pricing before it goes up to $299/year.</p>

          <div style={{ maxWidth: 560, margin: "52px auto 0", background: T.white, border: "1px solid rgba(50,204,224,0.2)", borderRadius: 20, padding: isMobile ? "36px 24px" : 48, position: "relative", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
            {/* Top gradient line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${T.teal}, #06b6d4)` }} />
            {/* Promo ribbon */}
            <div style={{ position: "absolute", top: 16, right: -28, background: T.gold, color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 40px", transform: "rotate(35deg)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Promo</div>

            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: T.teal, marginBottom: 8 }}>Founding Member</div>
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 24, color: T.textDark }}>Provider Membership</div>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 4, marginBottom: 8 }}>
              <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 22, fontWeight: 700, marginTop: 12, color: T.textDark }}>$</div>
              <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 72, fontWeight: 800, lineHeight: 1, color: T.textDark }}>99</div>
              <div style={{ color: T.grayText, marginTop: 20 }}>/year</div>
            </div>
            <div style={{ fontSize: 14, color: T.grayText, marginBottom: 28 }}>Regular price: <s>$299/year</s> — Save $200 today</div>

            <ul style={{ listStyle: "none", textAlign: "left", marginBottom: 36 }}>
              {[
                "Patient leads from high-intent healthcare searches",
                "Priority placement in AI-powered recommendations",
                "Approved Provider badge for your website & ads",
                "Enhanced profile with do-follow SEO link",
                "Branding upgrade: images, video, clinic tour",
                "Performance analytics dashboard",
                "Global & local patient exposure",
                "24-hour profile verification",
              ].map(item => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}`, fontSize: 14.5, color: T.textBody }}>
                  <span style={{ color: T.teal, fontWeight: 700, fontSize: 17, flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <button onClick={() => document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" })}
              style={{ width: "100%", background: T.teal, color: "#fff", border: "none", borderRadius: 14, padding: 17, fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(50,204,224,0.35)", transition: "transform .2s, box-shadow .2s, background .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.background = T.tealLt; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.background = T.teal; }}
            >Get Started for $99/year</button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20, color: T.grayText, fontSize: 13 }}>
              🔒 Secure payment · Cancel anytime · No contracts
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: T.white, padding: isMobile ? "70px 24px" : "90px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: T.teal, marginBottom: 12 }}>FAQ</div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: isMobile ? 26 : 40, fontWeight: 800, lineHeight: 1.18, letterSpacing: "-0.02em", color: T.textDark }}>Common Questions</h2>
          <div style={{ maxWidth: 720, margin: "52px auto 0", textAlign: "left" }}>
            {[
              { q: "How long does it take to get my profile live?", a: "Once you complete the signup form and payment, our team will review and verify your clinic within 24 hours. You'll receive your Approved Provider badge and your profile will be live and discoverable by patients right away." },
              { q: "What types of healthcare providers can join?", a: "We welcome all licensed healthcare providers including dentists, chiropractors, physiotherapists, dermatologists, medical spas, clinics, and many more. Both local practitioners and international medical tourism providers are welcome." },
              { q: "Will this price stay at $99 forever?", a: "No — $99/year is a limited founding member promotion. The price will increase to $299/year once this promo ends. Providers who join now will lock in their $99 rate for as long as they remain active members." },
              { q: "How does the AI recommendation priority work?", a: "Hospital.com uses AI to match patients with providers based on their search queries. Approved providers receive elevated placement in these AI-driven recommendations, meaning your practice appears first when patients search for services you offer in your area." },
              { q: "What is the Approved Provider badge and how can I use it?", a: "Once verified, you'll receive a digital badge you can embed on your clinic's website, include in email signatures, and use in advertising materials. It signals to patients that you've been vetted by Hospital.com, boosting trust and conversion rates." },
              { q: "What does the do-follow link mean for my SEO?", a: "Hospital.com is a high-authority domain. A do-follow backlink from our platform directly signals to Google that your site is reputable, which improves your search engine ranking over time. This is one of the most valuable SEO assets available to local businesses." },
            ].map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
          </div>
        </div>
      </section>

      {/* ─── SIGNUP FORM ─────────────────────────────────────────────────────── */}
      <section id="signup" style={{ background: T.bgSection, padding: isMobile ? "70px 24px" : "90px 40px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", background: T.white, border: `1px solid ${T.border}`, borderRadius: 20, padding: isMobile ? "30px 24px" : 48, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: T.teal, marginBottom: 12 }}>Apply Now</div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: isMobile ? 22 : 30, fontWeight: 800, letterSpacing: "-0.02em", color: T.textDark, marginBottom: 8 }}>Start Your Provider Application</h2>
          <p style={{ color: T.textBody, fontSize: 15, marginBottom: 0 }}>Fill in your details and our team will be in touch within 24 hours.</p>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18, marginTop: 32 }}>
            {[
              { label: "Clinic / Provider Name *", key: "clinicName",   type: "text",  placeholder: "e.g. Sunshine Medical Clinic",       full: false },
              { label: "Contact Name *",            key: "contactName", type: "text",  placeholder: "e.g. Dr. Sarah Chen",                  full: false },
              { label: "Email Address *",           key: "email",       type: "email", placeholder: "you@clinic.com",                       full: false },
              { label: "Phone Number",              key: "phone",       type: "tel",   placeholder: "+1 212-555-0000",                      full: false },
              { label: "Country *",                 key: "country",     type: "text",  placeholder: "e.g. United States, Canada, Turkey",   full: false },
              { label: "Specialty *",               key: "specialty",   type: "text",  placeholder: "e.g. Cardiology, Dental, Aesthetics",  full: false },
            ].map(field => (
              <div key={field.key}>
                <label style={labelStyle}>{field.label}</label>
                <input
                  type={field.type}
                  value={f[field.key as keyof typeof f]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setF(p => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = T.teal; e.currentTarget.style.background = "rgba(50,204,224,0.03)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(50,204,224,0.1)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.offWhite; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            ))}
          </div>

          <button onClick={() => setDone(true)}
            style={{ width: "100%", marginTop: 24, background: T.teal, color: "#fff", border: "none", borderRadius: 14, padding: 17, fontFamily: "Outfit, sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(50,204,224,0.35)", transition: "transform .2s, background .2s, box-shadow .2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.background = T.tealLt; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 40px rgba(50,204,224,0.35)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.background = T.teal; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(50,204,224,0.35)"; }}
          >Submit Application</button>
          <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: T.grayText }}>Our team responds within 24 hours · No credit card required</p>
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", background: T.navyMid, borderTop: "1px solid rgba(50,204,224,0.2)", padding: isMobile ? "70px 24px" : "100px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -150, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>Don&apos;t Miss This</div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: isMobile ? 26 : 42, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", color: T.white, maxWidth: 640, margin: "0 auto 16px" }}>Start Connecting with Patients Worldwide</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, maxWidth: 480, margin: "0 auto 40px" }}>Join hundreds of providers already growing their practices on Hospital.com. This $99 founding price won&apos;t last.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: T.white, color: T.teal, padding: "16px 36px", borderRadius: 14, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", transition: "all .2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = T.offWhite}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = T.white}
            >Become a Provider</button>
          </div>
          <div style={{ marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Price increases to $299/year soon. Lock in your rate today.</div>
        </div>
      </div>

      {/* ─── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ background: T.navy, borderTop: "1px solid rgba(255,255,255,0.08)", padding: 40, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 18, color: T.white }}>
          hospital<span style={{ color: T.teal }}>.com</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy Policy", "Terms & Conditions", "Become a Provider"].map(lbl => (
            <button key={lbl} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13.5, color: "rgba(255,255,255,0.5)", padding: 0, transition: "color .2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = T.white}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)"}
            >{lbl}</button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>© 2026 Hospital.com · All rights reserved</div>
      </footer>
    </>
  );
}

// ─── WHY CARD ─────────────────────────────────────────────────────────────────
function WhyCard({ icon, iconBg, title, desc }: { icon: string; iconBg: string; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", border: `1px solid ${hovered ? "rgba(50,204,224,0.2)" : "#e2e8f0"}`,
        borderRadius: 20, padding: 28, position: "relative", overflow: "hidden",
        boxShadow: hovered ? "0 8px 40px rgba(0,0,0,0.12)" : "0 4px 24px rgba(0,0,0,0.08)",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all .25s",
      }}
    >
      {/* Top gradient line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #32cce0, #06b6d4)", opacity: hovered ? 1 : 0, transition: "opacity .25s" }} />
      <div style={{ width: 52, height: 52, borderRadius: 14, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 18 }}>{icon}</div>
      <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 10, color: "#155279" }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
}

// ─── PARTNER CARD ─────────────────────────────────────────────────────────────
function PartnerCard({ featured, icon, title, sub, tags, cta, onCta }: { featured: boolean; icon: string; title: string; sub: string; tags: string[]; cta: string; onCta: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: featured ? "linear-gradient(145deg, rgba(50,204,224,0.03), rgba(8,145,178,0.02))" : "#fff",
        border: `1px solid ${featured ? "rgba(50,204,224,0.25)" : "#e2e8f0"}`,
        borderRadius: 20, padding: 40, position: "relative", overflow: "hidden",
        boxShadow: hov ? "0 8px 40px rgba(0,0,0,0.12)" : "0 4px 24px rgba(0,0,0,0.08)",
        transform: hov ? "translateY(-4px)" : "none",
        transition: "all .25s",
      }}
    >
      {featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #32cce0, #06b6d4)" }} />}
      <div style={{ fontSize: 40, marginBottom: 20 }}>{icon}</div>
      <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 10, color: "#155279" }}>{title}</h3>
      <p style={{ color: "#475569", fontSize: 15, marginBottom: 24 }}>{sub}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
        {tags.map(t => (
          <span key={t} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 100, padding: "5px 14px", fontSize: 13, color: "#475569" }}>{t}</span>
        ))}
      </div>
      <button onClick={onCta}
        style={{ background: "#32cce0", color: "#fff", padding: "16px 36px", borderRadius: 14, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", boxShadow: "0 8px 32px rgba(50,204,224,0.35)", transition: "transform .2s, background .2s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.background = "#5dd8e8"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.background = "#32cce0"; }}
      >{cta}</button>
    </div>
  );
}
