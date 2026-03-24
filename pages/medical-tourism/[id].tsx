import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import C from "@/lib/tokens";
import INTL_CLINICS from "@/lib/data/intlClinics";
import type { IntlClinic } from "@/lib/data/intlClinics";
import useIsMobile from "@/lib/hooks/useIsMobile";
import FacilitatorModal from "@/components/modals/FacilitatorModal";
import { SealBadge } from "@/components/ui/Badge";
import Footer from "@/components/layout/Footer";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK_REVIEWS = [
  { name: "Michael R. (USA)", date: "February 20, 2026", text: "Incredible experience, saved thousands compared to my home country." },
  { name: "Sophie L. (France)", date: "January 15, 2026", text: "Professional staff, top-notch facilities. Highly recommended." },
  { name: "Ahmed K. (UAE)", date: "December 30, 2025", text: "The care I received was outstanding. Worth every penny." },
];

const WHY_CHOOSE = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "International Accreditation",
    desc: "JCI-accredited or equivalent international quality standards",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Multilingual Support",
    desc: "Dedicated international patient coordinators available 24/7",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "All-Inclusive Packages",
    desc: "Accommodation, transfers, and aftercare included in treatment packages",
  },
];

// ─── CLINIC DETAIL PAGE ───────────────────────────────────────────────────────
export default function ClinicDetailPage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const rawId = router.query.id;
  const numId = typeof rawId === "string" ? parseInt(rawId, 10) : NaN;
  const clinic: IntlClinic | undefined = INTL_CLINICS.find((c) => c.id === numId);

  const [showModal, setShowModal] = useState(false);

  // ── 404 state ──
  if (!clinic && !router.query.id) {
    return null; // still loading
  }

  if (!clinic) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.offWhite, padding: 24 }}>
        <Head><title>Clinic Not Found | Hospital.com</title></Head>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌐</div>
          <h1 style={{ fontWeight: 800, fontSize: 24, color: C.text, marginBottom: 10 }}>Clinic Not Found</h1>
          <p style={{ color: C.textSm, fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
            We couldn&apos;t find a clinic with that ID. It may have been removed or the link may be incorrect.
          </p>
          <button
            onClick={() => router.push("/medical-tourism")}
            style={{ background: C.teal, color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}
          >
            ← Browse Clinics
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head><title>{clinic.name} | Hospital.com</title></Head>

      {showModal && (
        <FacilitatorModal clinic={clinic} onClose={() => setShowModal(false)} />
      )}

      <div style={{ minHeight: "100vh", background: C.offWhite, fontFamily: "inherit" }}>

        {/* ── TOP NAV BAR ── */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, padding: isMobile ? "12px 16px" : "14px 32px", display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => router.push("/medical-tourism")}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "7px 14px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: 13.5, color: C.textMd }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6" /></svg>
            Back
          </button>
          <span style={{ fontWeight: 800, fontSize: 15, color: C.text, flex: 1 }}>
            <span style={{ color: C.teal }}>Hospital</span>.com
          </span>
        </div>

        {/* ── HERO SECTION ── */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: isMobile ? "24px 16px" : "36px 48px" }}>
          <div style={{ maxWidth: 1060, margin: "0 auto" }}>

            {/* Flag + name row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? 14 : 20, flexWrap: isMobile ? "wrap" : "nowrap" }}>
              <div style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>{clinic.flag}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                  <h1 style={{ fontWeight: 800, fontSize: 26, color: C.text, margin: 0 }}>{clinic.name}</h1>
                  <SealBadge />
                </div>
                <div style={{ fontSize: 15, color: C.textSm, marginBottom: 8 }}>
                  {clinic.city}, {clinic.country}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <span style={{ color: C.amber, fontSize: 15 }}>
                    {"★".repeat(Math.round(clinic.rating))}{"☆".repeat(5 - Math.round(clinic.rating))}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{clinic.rating}</span>
                  <span style={{ fontSize: 13, color: C.textSm }}>({clinic.reviews.toLocaleString()} international patients)</span>
                </div>
                <p style={{ fontSize: 14.5, color: C.textMd, margin: 0, lineHeight: 1.7, maxWidth: 680 }}>
                  {clinic.description}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── TWO-COLUMN BODY ── */}
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: isMobile ? "20px 16px" : "32px 48px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: isMobile ? 20 : 28 }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Procedures */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 24px" }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 14 }}>Procedures Offered</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {clinic.procedures.map((proc) => (
                  <span
                    key={proc}
                    style={{ background: C.tealLt, color: C.tealDk, fontSize: 13, fontWeight: 600, padding: "7px 15px", borderRadius: 20, border: `1px solid ${C.teal}25` }}
                  >
                    {proc}
                  </span>
                ))}
              </div>
            </div>

            {/* About */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 24px" }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 12 }}>About This Clinic</h2>
              <p style={{ fontSize: 14.5, color: C.textMd, lineHeight: 1.75, margin: 0 }}>
                {clinic.description} Our team of internationally trained specialists is committed to providing world-class care with the highest safety standards. The facility is equipped with the latest diagnostic and treatment technologies, ensuring optimal outcomes for every patient. We welcome international patients and provide comprehensive support throughout your healthcare journey, from initial consultation to post-treatment follow-up.
              </p>
            </div>

            {/* Why Choose Us */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 24px" }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 16 }}>Why Choose Us</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {WHY_CHOOSE.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingBottom: i < WHY_CHOOSE.length - 1 ? 16 : 0, borderBottom: i < WHY_CHOOSE.length - 1 ? `1px solid ${C.borderLt}` : "none" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: C.tealLt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14.5, color: C.text, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 13.5, color: C.textMd, lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Reviews */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 24px" }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 16 }}>Patient Reviews</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {MOCK_REVIEWS.map((review, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: i < MOCK_REVIEWS.length - 1 ? 16 : 0, borderBottom: i < MOCK_REVIEWS.length - 1 ? `1px solid ${C.borderLt}` : "none" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.teal}, ${C.tealDk})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#fff", flexShrink: 0 }}>
                      {review.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: C.text }}>{review.name}</span>
                        <span style={{ fontSize: 12, color: C.textSm }}>{review.date}</span>
                      </div>
                      <div style={{ color: C.amber, fontSize: 13, marginBottom: 5 }}>★★★★★</div>
                      <p style={{ fontSize: 14, color: C.textMd, margin: 0, lineHeight: 1.6 }}>{review.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Contact / coordinator card */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 20px", boxShadow: "0 4px 16px rgba(0,0,0,.06)" }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 4 }}>Talk to a Coordinator</h2>
              <p style={{ fontSize: 13, color: C.textSm, marginBottom: 20, lineHeight: 1.5 }}>
                Free consultation — no commitment required
              </p>
              <button
                onClick={() => setShowModal(true)}
                style={{ width: "100%", background: C.teal, color: "#fff", border: "none", borderRadius: 12, padding: "13px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                Get Free Quote
              </button>
              <button
                style={{ width: "100%", background: C.white, color: C.teal, border: `1.5px solid ${C.teal}`, borderRadius: 12, padding: "11px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
              >
                Contact Directly
              </button>
            </div>

            {/* Quick facts card */}
            <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 20px" }}>
              <h2 style={{ fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 16 }}>Quick Facts</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  {
                    label: "Location",
                    value: `${clinic.city}, ${clinic.country} ${clinic.flag}`,
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
                  },
                  {
                    label: "Rating",
                    value: `${clinic.rating} / 5.0`,
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill={C.amber} stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>,
                  },
                  {
                    label: "Reviews",
                    value: `${clinic.reviews.toLocaleString()} international patients`,
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
                  },
                  {
                    label: "Accreditation",
                    value: "Internationally Verified",
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
                  },
                  {
                    label: "Languages",
                    value: "English + 3 others",
                    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
                  },
                ].map((fact) => (
                  <div key={fact.label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: C.tealLt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      {fact.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textSm, textTransform: "uppercase", letterSpacing: .4, marginBottom: 2 }}>{fact.label}</div>
                      <div style={{ fontSize: 13.5, color: C.text, fontWeight: 500 }}>{fact.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        <Footer />
      </div>
    </>
  );
}
