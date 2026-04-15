import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import C from "@/lib/tokens";
import PROVIDERS, { Provider } from "@/lib/data/providers";
import useIsMobile from "@/lib/hooks/useIsMobile";
import Footer from "@/components/layout/Footer";

// ─── SPECIALTY PAGE ────────────────────────────────────────────────────────────

// Slug → display name mapping
const SPECIALTY_MAP: Record<string, string> = {
  "family-doctor":     "Family Medicine",
  "cardiologist":      "Cardiology",
  "dentist":           "Dentistry",
  "dermatologist":     "Dermatology",
  "orthopedist":       "Orthopedics",
  "pediatrician":      "Pediatrics",
  "psychiatrist":      "Psychiatry",
  "ob-gyn":            "OB-GYN",
  "ophthalmologist":   "Ophthalmology",
  "urgent-care":       "Urgent Care",
  "neurologist":       "Neurology",
  "medical-aesthetics":"Medical Aesthetics",
  "chiropractor":      "Chiropractic",
  "acupuncturist":     "Acupuncture",
};

// Singular provider name (used in "Why Use... to find a X?" and CTA)
const SPECIALTY_SINGULAR: Record<string, string> = {
  "Family Medicine":      "Family Doctor",
  "Cardiology":           "Cardiologist",
  "Dermatology":          "Dermatologist",
  "Orthopedics":          "Orthopedist",
  "Pediatrics":           "Pediatrician",
  "Psychiatry":           "Psychiatrist",
  "OB-GYN":              "OB-GYN",
  "Ophthalmology":        "Ophthalmologist",
  "Urgent Care":          "Urgent Care Clinic",
  "Neurology":            "Neurologist",
  "Medical Aesthetics":   "Medical Aesthetics Provider",
  "Chiropractic":         "Chiropractor",
  "Dentistry":            "Dentist",
  "Acupuncture":          "Acupuncturist",
};

// Plural label for headings
const SPECIALTY_LABEL: Record<string, string> = {
  "Family Medicine":      "Family Doctors",
  "Cardiology":           "Cardiologists",
  "Dermatology":          "Dermatologists",
  "Orthopedics":          "Orthopedists",
  "Pediatrics":           "Pediatricians",
  "Psychiatry":           "Psychiatrists",
  "OB-GYN":              "OB-GYNs",
  "Ophthalmology":        "Ophthalmologists",
  "Urgent Care":          "Urgent Care Clinics",
  "Neurology":            "Neurologists",
  "Medical Aesthetics":   "Medical Aesthetics Providers",
  "Chiropractic":         "Chiropractors",
  "Acupuncture":          "Acupuncturists",
};

function slugToDisplay(slug: string): string {
  return SPECIALTY_MAP[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function specialtyLabel(name: string): string {
  return SPECIALTY_LABEL[name] || name + " Providers";
}
function matchesSpecialty(p: Provider, specialty: string): boolean {
  const s = specialty.toLowerCase();
  return (
    p.specialty.toLowerCase().includes(s) ||
    p.tags.some(t => t.toLowerCase().includes(s)) ||
    (s === "family medicine" && p.specialty.toLowerCase().includes("family")) ||
    (s === "cardiology"     && p.specialty.toLowerCase().includes("cardio")) ||
    (s === "dermatology"    && p.specialty.toLowerCase().includes("derm")) ||
    (s === "orthopedics"    && p.specialty.toLowerCase().includes("ortho")) ||
    (s === "medical aesthetics" && (p.specialty.toLowerCase().includes("aesthetic")))
  );
}

// ─── PER-SPECIALTY CONTENT ────────────────────────────────────────────────────
interface SpecialtyContent {
  about?: string[];
  whenToSee?: string[];
  conditions?: string[];
  facts?: string[];
  costs?: string[];
  faqs?: { q: string; a: string }[];
  howItWorks?: string;
  types?: string;
  credentials?: { region: string; body: string }[];
  evidenceBase?: string[];
  relatedSpecialties?: string[];
  sources?: string[];
}

const SPECIALTY_DATA: Record<string, SpecialtyContent> = {
  "Acupuncture": {
    about: [
      "Acupuncture is a regulated health practice involving the insertion of thin, sterile needles into specific points on the body to stimulate the nervous system, reduce inflammation, and promote the body's natural healing responses. Rooted in a 2,500-year tradition of Traditional Chinese Medicine (TCM), it has become one of the most extensively researched non-pharmacological therapies in modern medicine.",
      "In the United States, acupuncture is typically practiced by board-certified practitioners who hold a valid state license. Certification is most commonly granted through the National Certification Commission for Acupuncture and Oriental Medicine (NCCAOM). In Canada, five provinces regulate acupuncture by law, and practitioners in those provinces use the protected title of Registered Acupuncturist (R.Ac).",
      "One finding that surprises many patients: acupuncture produces measurable neurobiological effects. Neuroimaging studies show it activates the same brain regions involved in opioid-mediated analgesia, which is why it is increasingly integrated into hospital pain management programs as a non-opioid alternative, not merely an add-on.",
    ],
    whenToSee: [
      "Chronic back, neck, or joint pain that has not responded to standard treatment",
      "Migraines, tension headaches, or recurring headaches",
      "Anxiety, depression, or insomnia affecting daily function",
      "Fertility support or menopausal symptom management",
      "Nausea from chemotherapy, surgery, or pregnancy",
      "Cancer-related fatigue or side effects from treatment",
    ],
    conditions: [
      "Chronic back and neck pain",
      "Migraines and tension headaches",
      "Knee osteoarthritis",
      "Anxiety and insomnia",
      "Female infertility support",
      "Cancer-related fatigue",
      "Nausea from pregnancy, surgery, or chemotherapy",
      "Menopausal hot flashes",
    ],
    facts: [
      "NCCAOM-certified in 44 US states; 5 Canadian provinces regulate R.Ac title by law",
      "Training: 3–4 year master's or doctoral programs with 500+ supervised clinical hours",
      "First visit: 30–45 min intake + 20–40 min needling; 6–20 needle points per session",
      "Chronic conditions typically require 6–12 sessions; acute issues may resolve in 3–6",
      "Medicare covers acupuncture for chronic low back pain; most PPO plans include partial coverage",
    ],
    costs: [
      "Initial visit (includes full TCM diagnosis): $100 – $200",
      "Follow-up sessions: $60 – $120 per visit",
      "Medicare (chronic low back pain): partially covered",
      "Most employer extended health plans: $300 – $1,000/year for acupuncture",
    ],
    howItWorks: "Needles are placed at anatomically defined acupuncture points — over 360 are recognized in classical TCM — triggering local tissue responses and signaling cascades along peripheral nerves. Modern research has identified several mechanisms: activation of A-delta and C-fibre sensory neurons, release of endorphins and adenosine at needle sites, and modulation of the hypothalamic-pituitary axis.",
    types: "Traditional body acupuncture is the most common form. Electroacupuncture passes a mild electrical current between needles to amplify stimulation and is often used for musculoskeletal pain. Auricular acupuncture targets points on the outer ear and is used in smoking cessation and addiction recovery programs. Some acupuncturists also combine TCM herbal medicine and cupping therapy into integrated treatment plans.",
    credentials: [
      {
        region: "United States",
        body: "Most states require candidates to pass board exams administered by the NCCAOM, which confers the Diplomate of Acupuncture (Dipl. Ac.) designation. California operates its own licensing board using the titles Licensed Acupuncturist (L.Ac.) or Certified Acupuncturist (C.Ac.). Training programs are 3–4 years at the master's level; many states now recognize doctoral-level programs (DACM). We encourage patients to verify credentials at nccaom.org before booking.",
      },
      {
        region: "Canada",
        body: "Five provinces regulate acupuncture by law — Ontario, British Columbia, Alberta, Quebec, and Newfoundland and Labrador. Candidates must complete a 3–4 year post-secondary program, log a minimum of 500 hours of supervised clinical contact, and pass Pan-Canadian examinations before using the protected title of Registered Acupuncturist (R.Ac). Verify at your provincial college's public register — e.g. ctcmpao.on.ca in Ontario.",
      },
    ],
    evidenceBase: [
      "The volume and quality of acupuncture research has expanded substantially over the past decade. A 2025 systematic review published in Integrative Medicine Research analyzed 862 systematic reviews and meta-analyses covering 184 medical conditions between 2017 and 2022. The review found evidence of positive effect for ten conditions — including chronic pain, knee osteoarthritis, migraines, and cancer-related fatigue — with potential positive effect across 82 additional indications.",
      "A separate global scientometric analysis tracking 9,340 acupuncture publications from 1980 to 2023 found publication volume growing at roughly six times the rate seen before 2013, driven by research collaboration across more than 60 countries. Harvard University held the highest centrality score in pain-specific acupuncture research globally.",
      "These figures do not mean acupuncture works for every condition. Evidence quality remains variable and for some indications only low-certainty conclusions are available. Honest clinical conversations about realistic outcomes are something Hospital.com encourages patients to have with any provider they book.",
    ],
    relatedSpecialties: [
      "Naturopathic Doctors",
      "Physiotherapists",
      "Registered Massage Therapists",
      "Chiropractors",
      "Pain Management Clinics",
      "Fertility Specialists",
      "Mental Health & Anxiety",
    ],
    sources: [
      "Gressak M et al. \"The state of evidence in acupuncture: A review of metaanalyses and systematic reviews of acupuncture evidence (update 2017 to 2022).\" Integrative Medicine Research, February 2025.",
      "Oztekin C, Oztekin A. \"Global trends in acupuncture research: A scientometric analysis from 1980 to 2023.\" Medicine, September 2024. PMC11383717.",
      "National Certification Commission for Acupuncture and Oriental Medicine (NCCAOM). Certification and state licensing requirements. nccaom.org",
      "College of Traditional Chinese Medicine Practitioners and Acupuncturists of Ontario (CTCMPAO). General Class Registration Requirements. ctcmpao.on.ca",
      "Canadian Alliance of Regulatory Bodies of Traditional Chinese Medicine Practitioners and Acupuncturists (CARB-TCMPA). \"TCM regulation in Canada.\" Chinese Medicine and Acupuncture Association of Canada.",
    ],
    faqs: [
      { q: "Does acupuncture hurt?", a: "Most patients experience mild pressure or a brief pinch at insertion — significantly less discomfort than a blood draw. The classic \"de qi\" sensation (a dull ache or warmth) is considered therapeutically meaningful in TCM. Acupuncture needles are much finer than hypodermic needles, typically 0.20 to 0.25mm in diameter." },
      { q: "Is acupuncture covered by insurance in the US and Canada?", a: "In the United States, many PPO plans, Medicare Advantage plans, and traditional Medicare (for chronic low back pain) provide partial coverage. The VA also covers acupuncture for veterans at many facilities. In Canada, provincial health plans do not cover acupuncture, but most employer extended health benefit plans include partial coverage under their paramedical or complementary health sections." },
      { q: "How many sessions will I need?", a: "Acute conditions may respond in 3 to 6 sessions. Chronic pain, fertility support, and mental health applications typically require a course of 8 to 12 sessions. Most licensed acupuncturists will reassess progress at the 4 to 6 session mark and adjust the plan accordingly." },
      { q: "Is acupuncture safe during pregnancy?", a: "Acupuncture is used during pregnancy for nausea, back pain, and breech presentation support, but certain points are contraindicated at specific stages. Always confirm with your OB or midwife before starting treatment, and ensure your acupuncturist has documented experience with prenatal care." },
      { q: "What is the difference between a licensed acupuncturist and other practitioners offering acupuncture?", a: "In regulated US states and Canadian provinces, only practitioners who have passed the relevant licensing examinations can use protected titles like L.Ac, Dipl. Ac., or R.Ac. Physiotherapists, naturopathic doctors, and chiropractors may perform acupuncture within their scope of practice but typically with fewer acupuncture-specific training hours." },
      { q: "How do I find an acupuncturist on Hospital.com?", a: "Enter your city or zip/postal code in the search bar, then filter by specialty such as fertility, pain management, or anxiety. Each provider profile shows credentials, clinic location, languages spoken, and available appointment times. You can book directly through Hospital.com with no phone call required." },
    ],
  },
};

// ─── PROVIDER CARD ─────────────────────────────────────────────────────────────
function ProviderCard({ provider }: { provider: Provider }) {
  const router = useRouter();
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => router.push(`/providers/${provider.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? "#32cce0" : "#e8eef2"}`,
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hovered ? "0 8px 40px rgba(16,117,173,0.16)" : "none",
        transform: hovered ? "translateY(-3px)" : "none",
        transition: "all .22s",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top gradient line (on hover) */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg, #32cce0, #1075ad)",
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: "transform .3s ease",
      }} />

      {/* Top section */}
      <div style={{ padding: "22px 20px 16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
        {/* Circular avatar */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg, #eef9fc, #c8edf7)",
          border: "2px solid #cce4f0",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, overflow: "hidden",
        }}>
          {provider.photo && !imgErr
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={provider.photo} alt={provider.name} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          }
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#071e34", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {provider.name}
          </div>
          <div style={{ fontSize: 12, color: "#5a7085", marginBottom: 7 }}>{provider.specialty}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#112233" }}>
            <span style={{ color: "#f0c840", letterSpacing: -1 }}>
              {[1,2,3,4,5].map(s => <span key={s}>{s <= Math.round(provider.rating) ? "★" : "☆"}</span>)}
            </span>
            <span>{provider.rating}</span>
            <span style={{ color: "#5a7085", fontWeight: 400 }}>({provider.reviews} reviews)</span>
          </div>
        </div>

        {/* Verified badge */}
        {provider.contracted && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: "rgba(50,204,224,0.1)", border: "1px solid rgba(50,204,224,0.3)",
            color: "#1075ad", fontFamily: "Outfit, sans-serif",
            fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em",
            textTransform: "uppercase" as const, padding: "3px 8px", borderRadius: 100,
            flexShrink: 0,
          }}>
            ✓ Verified
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid #e8eef2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#5a7085", marginBottom: 8 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5a7085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          {provider.city} · {provider.distance}km away
        </div>
        <div style={{ fontSize: 12, color: "#16a96a", fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a96a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          {provider.contracted ? "Verified Partner · Accepting new patients" : "Accepting new patients"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {provider.tags.slice(0, 3).map(t => (
            <span key={t} style={{
              fontFamily: "Outfit, sans-serif", fontSize: 10.5, fontWeight: 600,
              color: "#1075ad", background: "rgba(16,117,173,0.07)",
              padding: "3px 9px", borderRadius: 100, border: "1px solid rgba(16,117,173,0.15)",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #e8eef2", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <span style={{ fontSize: 11.5, color: "#16a96a", fontWeight: 600 }}>
          ● {provider.hasCalendar ? "Available Today" : "Call to schedule"}
        </span>
        <button
          onClick={e => { e.stopPropagation(); router.push(`/providers/${provider.id}`); }}
          style={{
            fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 700,
            color: "#fff", background: "#1075ad",
            padding: "8px 16px", border: "none", borderRadius: 8,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            transition: "background .18s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#0b5e8c"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#1075ad"}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

// ─── FAQ ITEM ──────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e8eef2" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 0", background: "none", border: "none", cursor: "pointer",
          fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14,
          color: open ? "#1075ad" : "#071e34", textAlign: "left" as const, gap: 12,
          transition: "color .2s",
        }}
      >
        {q}
        <svg
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke={open ? "#1075ad" : "#5a7085"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: "transform .22s", transform: open ? "rotate(180deg)" : "none" }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{ paddingBottom: 18, fontSize: 13.5, color: "#5a7085", lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function SpecialtyPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { specialty: slugParam } = router.query;

  const slug = Array.isArray(slugParam) ? slugParam[0] : (slugParam ?? "");
  const specialtyName = slugToDisplay(slug);
  const title = specialtyLabel(specialtyName);
  const singular = SPECIALTY_SINGULAR[specialtyName] || specialtyName;
  const content = SPECIALTY_DATA[specialtyName];

  // ─── Filters ──────────────────────────────────────────────────────────────
  const [searchQuery,    setSearchQuery]    = useState("");
  const [locationInput,  setLocationInput]  = useState("");
  const [insuranceInput, setInsuranceInput] = useState("");
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterAvail,    setFilterAvail]    = useState(false);
  const [filterIns,      setFilterIns]      = useState(false);
  const [filterPrice,    setFilterPrice]    = useState(false);
  const [aiMode,         setAiMode]         = useState(false);
  const [aiQuery,        setAiQuery]        = useState("");
  const [minRating,      setMinRating]      = useState(0);
  const [heroRating,     setHeroRating]     = useState("Any");
  const [openDropdown,   setOpenDropdown]   = useState<string | null>(null);

  const RATINGS = [{ val:"Any", label:"Any Rating" },{ val:"4", label:"4+ Stars" },{ val:"4.5", label:"4.5+ Stars" }];

  useEffect(() => {
    const handler = () => setOpenDropdown(null);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Base set
  const baseProviders = PROVIDERS.filter(p => !p.parentClinicId && matchesSpecialty(p, specialtyName));

  const filtered = baseProviders.filter(p => {
    if (filterVerified && !p.contracted) return false;
    if (filterAvail    && !p.hasCalendar) return false;
    if (insuranceInput.trim() && !p.contracted) return false;
    if (p.rating < minRating) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.specialty.toLowerCase().includes(q) &&
          !p.city.toLowerCase().includes(q) && !p.tags.some(t => t.toLowerCase().includes(q))) return false;
    }
    if (locationInput.trim()) {
      const loc = locationInput.trim().toLowerCase();
      if (!p.city.toLowerCase().includes(loc) && !p.address.toLowerCase().includes(loc)) return false;
    }
    return true;
  });
  const sorted = [...filtered.filter(p => p.contracted), ...filtered.filter(p => !p.contracted)];

  type Chip = "insurance" | "price" | "available" | "verified";
  const chipActive = (k: Chip) => ({ insurance: filterIns, price: filterPrice, available: filterAvail, verified: filterVerified }[k]);
  const toggleChip = (k: Chip) => {
    if (k === "insurance") setFilterIns(v => !v);
    if (k === "price")     setFilterPrice(v => !v);
    if (k === "available") setFilterAvail(v => !v);
    if (k === "verified")  setFilterVerified(v => !v);
  };

  const CHIPS: { k: Chip; label: string; icon: React.ReactNode }[] = [
    { k: "insurance", label: "Insurance",    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { k: "price",     label: "Price Range",  icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { k: "available", label: "Availability", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { k: "verified",  label: "Verified Only", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  ];

  if (!slug) return null;

  // ─── Shared section styles ─────────────────────────────────────────────────
  const sectionLabel = (text: string) => (
    <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#1075ad", marginBottom: 10 }}>{text}</div>
  );
  const sectionTitle = (node: React.ReactNode) => (
    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 30, color: "#071e34", letterSpacing: "-0.02em", lineHeight: 1.15, maxWidth: 580 }}>{node}</div>
  );
  const sectionHeader = (label: string, title: React.ReactNode, btnText?: string, btnAction?: () => void) => (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
      <div>{sectionLabel(label)}{sectionTitle(title)}</div>
      {btnText && (
        <button onClick={btnAction}
          style={{ fontFamily: "Outfit, sans-serif", fontSize: 13.5, fontWeight: 600, color: "#1075ad", display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", border: "1.5px solid #1075ad", borderRadius: 8, background: "none", cursor: "pointer", whiteSpace: "nowrap" as const, transition: "all .2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#1075ad"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "#1075ad"; }}
        >{btnText}</button>
      )}
    </div>
  );

  return (
    <>
      <Head>
        <title>Find {title} Near You | Hospital.com</title>
        <meta name="description" content={`Browse verified ${title.toLowerCase()}, read real patient reviews, and book appointments online.`} />
      </Head>

      {/* ─── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "0 24px" : "0 48px", height: 68,
        borderBottom: "1px solid rgba(50,204,224,0.08)",
      }}>
        <button onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", padding: 0 }}>
          hospital<span style={{ color: "#32cce0" }}>.com</span>
        </button>
        {!isMobile && (
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["Find Local Care", "Global Health Services", "For Providers"].map((lbl, i) => (
              <button key={lbl} onClick={() => i === 0 ? router.push("/find-local-care") : undefined}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: i === 0 ? "#32cce0" : "rgba(255,255,255,0.65)", padding: 0, transition: "color .2s" }}
                onMouseEnter={e => { if (i !== 0) (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={e => { if (i !== 0) (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)"; }}
              >{lbl}</button>
            ))}
            <button onClick={() => router.push("/find-local-care")}
              style={{ background: "#32cce0", color: "#071e34", border: "none", padding: "9px 20px", borderRadius: 8, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background .15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#5cdaea"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#32cce0"}
            >Book Now</button>
          </div>
        )}
      </nav>


      {/* ─── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{
        background: "#f0fafe",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: isMobile ? "60px 24px 50px" : "80px 24px 70px",
        position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        {/* Radial gradient blobs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 65% 70% at -5% 55%, rgba(50,204,224,0.25) 0%, transparent 55%), radial-gradient(ellipse 55% 65% at 105% 30%, rgba(16,117,173,0.16) 0%, transparent 55%), radial-gradient(ellipse 40% 50% at 100% 90%, rgba(50,204,224,0.1) 0%, transparent 50%)",
        }} />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(16,117,173,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,117,173,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div style={{ position: "relative", width: "100%", maxWidth: 900 }}>
          {/* Label pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(50,204,224,0.12)", border: "1px solid rgba(50,204,224,0.35)", color: "#1075ad", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "6px 16px", borderRadius: 100, marginBottom: 24 }}>
            Find Local Care · Specialties
          </div>

          <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: isMobile ? 32 : 54, color: "#071e34", lineHeight: 1.07, letterSpacing: "-0.03em", maxWidth: 820, margin: "0 auto", marginBottom: 16 }}>
            Find Trusted <em style={{ fontStyle: "italic", color: "#32cce0" }}>{title}</em> Near You
          </h1>
          <p style={{ color: "#5a7085", fontSize: isMobile ? 14 : 16, fontWeight: 400, margin: "0 auto 36px", maxWidth: 520, lineHeight: 1.7 }}>
            Compare verified {title.toLowerCase()}, read real patient reviews, and choose the right care — with confidence.
          </p>

          {/* Search mode toggle */}
          <div style={{ display:"inline-flex", background:"#e4f4f8", borderRadius:100, padding:4, marginBottom:16, gap:2 }}>
            <button onClick={() => setAiMode(false)}
              style={{ padding:"8px 20px", borderRadius:100, fontFamily:"Outfit, sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", border:"none", background:!aiMode?"#071e34":"transparent", color:!aiMode?"white":"#5a7085", transition:"all .2s", display:"flex", alignItems:"center", gap:6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="17" y1="17" x2="22" y2="22"/></svg>
              Classic Search
            </button>
            <button onClick={() => setAiMode(true)}
              style={{ padding:"8px 20px", borderRadius:100, fontFamily:"Outfit, sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", border:"none", background:aiMode?"#071e34":"transparent", color:aiMode?"white":"#5a7085", transition:"all .2s", display:"flex", alignItems:"center", gap:6 }}>
              ✦ AI Search
            </button>
          </div>

          {/* Classic search card */}
          {!aiMode && (
          <div style={{
            width: "100%", maxWidth: 900, background: "#fff", borderRadius: isMobile ? 20 : 100,
            padding: isMobile ? 10 : "7px 7px 7px 10px", margin: "0 auto 14px",
            boxShadow: "0 8px 48px rgba(16,117,173,0.13), 0 0 0 1px rgba(16,117,173,0.08)",
            display: "flex", alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
          }}>
            {/* Location */}
            <div style={{
              flex: 1, display: "flex", alignItems: "flex-start", gap: 12,
              padding: "12px 22px",
              borderRight: isMobile ? "none" : "1px solid #D6E4EA",
              borderBottom: isMobile ? "1px solid #D6E4EA" : "none",
              width: isMobile ? "100%" : "auto",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#eef9fc"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1275ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#7a8fa0", marginBottom: 3, textAlign: "left" }}>Location</div>
                <input value={locationInput} onChange={e => setLocationInput(e.target.value)} placeholder="City or auto-detect…"
                  style={{ border: "none", outline: "none", fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: locationInput ? "#0E1C26" : "#a8bfcc", background: "transparent", width: "100%", padding: 0 }} />
              </div>
            </div>

            {/* Insurance */}
            <div style={{
              flex: 1, display: "flex", alignItems: "flex-start", gap: 12,
              padding: "12px 22px",
              borderRight: isMobile ? "none" : "1px solid #D6E4EA",
              borderBottom: isMobile ? "1px solid #D6E4EA" : "none",
              width: isMobile ? "100%" : "auto",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#eef9fc"}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1275ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#7a8fa0", marginBottom: 3, textAlign: "left" }}>Insurance (Optional)</div>
                <input value={insuranceInput} onChange={e => setInsuranceInput(e.target.value)} placeholder="Select plan…"
                  style={{ border: "none", outline: "none", fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: insuranceInput ? "#0E1C26" : "#a8bfcc", background: "transparent", width: "100%", padding: 0 }} />
              </div>
            </div>

            {/* Min Rating */}
            <div onMouseDown={e => e.stopPropagation()} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "12px 22px",
              position: "relative" as const,
              borderBottom: isMobile ? "1px solid #D6E4EA" : "none",
              width: isMobile ? "100%" : "auto",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1275ad" strokeWidth="1.8" style={{ flexShrink: 0, marginTop: 2 }}>
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#7a8fa0", marginBottom: 3, textAlign: "left" }}>Min Rating</div>
                <div onClick={() => setOpenDropdown(openDropdown === "rating" ? null : "rating")}
                  style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: heroRating === "Any" ? "#a8bfcc" : "#0E1C26", whiteSpace: "nowrap" as const }}>
                    {RATINGS.find(r => r.val === heroRating)?.label ?? "Any Rating"}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7a8fa0" strokeWidth="2.5" style={{ flexShrink: 0, transition: "transform .2s", transform: openDropdown === "rating" ? "rotate(180deg)" : "none" }}><polyline points="6,9 12,15 18,9"/></svg>
                </div>
                {openDropdown === "rating" && (
                  <div style={{ position: "absolute" as const, top: "calc(100% + 8px)", left: 0, minWidth: 140, background: "#fff", borderRadius: 16, boxShadow: "0 16px 48px rgba(0,0,0,.13)", border: "1.5px solid #D6E4EA", zIndex: 1000, overflow: "hidden" as const, animation: "dropFade .18s ease" }}>
                    <div className="dd-scroll" style={{ padding: "8px 0" }}>
                      {RATINGS.map(r => (
                        <div key={r.val} className="dd-opt" onClick={() => { setHeroRating(r.val); setMinRating(r.val === "Any" ? 0 : parseFloat(r.val)); setOpenDropdown(null); }}
                          style={{ padding: "9px 16px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: heroRating === r.val ? "#46c4d9" : "#0E1C26", fontWeight: heroRating === r.val ? 700 : 400, background: heroRating === r.val ? "rgba(70,196,217,.08)" : "transparent" }}>
                          {heroRating === r.val && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                          {r.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              style={{ background: "#46c4d9", color: "#fff", border: "none", borderRadius: isMobile ? 12 : 100, padding: isMobile ? "14px" : "14px 28px", fontFamily: "Outfit, sans-serif", fontSize: 14.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexShrink: 0, whiteSpace: "nowrap" as const, transition: "opacity .2s", width: isMobile ? "100%" : "auto", marginTop: isMobile ? 4 : 0 }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="17" y1="17" x2="22" y2="22"/></svg>
              Search
            </button>
          </div>
          )}

          {/* AI search panel */}
          {aiMode && (
          <div style={{ width:"100%", maxWidth:900, background:"white", borderRadius:24, padding:"20px 24px", margin:"0 auto 14px", boxShadow:"0 8px 48px rgba(16,117,173,0.13), 0 0 0 1px rgba(16,117,173,0.08)" }}>
            <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#1275ad", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
              ✦ Describe what you&apos;re looking for in plain language
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
              <textarea value={aiQuery} onChange={e=>setAiQuery(e.target.value)} autoFocus
                placeholder={`e.g. I need a ${singular.toLowerCase()} near downtown who accepts Aetna and has availability this week…`}
                rows={2}
                style={{ flex:1, border:"1.5px solid #D6E4EA", borderRadius:12, padding:"14px 18px", fontFamily:"inherit", fontSize:14, color:"#0E1C26", resize:"none", outline:"none", lineHeight:1.55, minHeight:56, boxSizing:"border-box" as const, transition:"border-color .2s" }}
                onFocus={e=>e.target.style.borderColor="#46c4d9"}
                onBlur={e=>e.target.style.borderColor="#D6E4EA"}
                onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); document.getElementById("providers-section")?.scrollIntoView({ behavior:"smooth" }); } }} />
              <button
                style={{ background:"linear-gradient(135deg,#46c4d9,#1275ad)", color:"white", border:"none", borderRadius:12, padding:"14px 22px", fontFamily:"Outfit, sans-serif", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, whiteSpace:"nowrap" as const, transition:"opacity .2s" }}
                onClick={() => document.getElementById("providers-section")?.scrollIntoView({ behavior:"smooth" })}>
                ✦ Search with AI
              </button>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:12 }}>
              {[
                `${singular} near downtown`,
                `${singular} accepting new patients`,
                `${singular} open on weekends`,
                `${singular} with 4.5+ stars`,
              ].map(s => (
                <span key={s} onClick={()=>setAiQuery(s)}
                  style={{ fontSize:12, color:"#1275ad", background:"rgba(18,117,173,0.06)", border:"1px solid rgba(18,117,173,0.15)", borderRadius:100, padding:"5px 13px", cursor:"pointer", fontWeight:500, transition:"all .18s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLSpanElement).style.background="#1275ad";(e.currentTarget as HTMLSpanElement).style.color="white";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLSpanElement).style.background="rgba(18,117,173,0.06)";(e.currentTarget as HTMLSpanElement).style.color="#1275ad";}}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          )}

          {/* Filter chips */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 14, marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: "#5a7085", fontWeight: 500 }}>Filter by:</span>
            {CHIPS.map(chip => {
              const active = chipActive(chip.k);
              return (
                <button key={chip.k} onClick={() => toggleChip(chip.k)}
                  style={{
                    fontSize: 13, fontWeight: 500, color: active ? "#1075ad" : "#112233",
                    background: active ? "rgba(50,204,224,0.07)" : "#fff",
                    border: `1px solid ${active ? "#32cce0" : "#cce4f0"}`,
                    borderRadius: 100, padding: "6px 14px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5,
                    fontFamily: "inherit", transition: "all .18s",
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.borderColor = "#32cce0"; (e.currentTarget as HTMLButtonElement).style.color = "#1075ad"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(50,204,224,0.07)"; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.borderColor = "#cce4f0"; (e.currentTarget as HTMLButtonElement).style.color = "#112233"; (e.currentTarget as HTMLButtonElement).style.background = "#fff"; } }}
                >
                  {chip.icon}{chip.label}
                </button>
              );
            })}
          </div>

          {/* Trust notes */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 14 : 20, flexWrap: "wrap" }}>
            {[
              { svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a96a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, text: "Verified providers" },
              { svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a96a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, text: "Real patient reviews" },
              { svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a96a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6l11 6 11-6"/><path d="M1 12l11 6 11-6"/><path d="M1 18l11 6 11-6"/></svg>, text: "Transparent information" },
            ].map(item => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#5a7085", fontWeight: 500 }}>
                {item.svg}{item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 2. TOP-RATED PROVIDERS ──────────────────────────────────────────── */}
      <section id="providers-section" style={{ background: "#f4f9fc", padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          {sectionHeader(
            "Social Proof",
            <>{`Top-Rated `}<em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>{title}</em>{` Near You`}</>,
            `View All ${title}`,
          )}

          {sorted.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(270px, 1fr))", gap: 20 }}>
              {sorted.map(p => <ProviderCard key={p.id} provider={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 14, border: "1.5px solid #e8eef2" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cce4f0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 14 }}><circle cx="11" cy="11" r="7"/><line x1="17" y1="17" x2="22" y2="22"/></svg>
              <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 18, fontWeight: 700, color: "#5a7085", marginBottom: 8 }}>No providers found</div>
              <div style={{ fontSize: 14, color: "#5a7085", marginBottom: 20 }}>Try adjusting your search or clearing filters.</div>
              <button onClick={() => { setSearchQuery(""); setLocationInput(""); setInsuranceInput(""); setFilterVerified(false); setFilterAvail(false); setFilterIns(false); setFilterPrice(false); }}
                style={{ padding: "10px 24px", background: "#32cce0", color: "#fff", border: "none", borderRadius: 8, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── 3. BROWSE BY LOCATION ───────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          {sectionHeader(
            "Browse by Area",
            <>{`Find ${title} by `}<em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>Location</em></>,
            "View All Locations",
          )}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {[
              { city: "New York",   count: "560" },
              { city: "Los Angeles",count: "480" },
              { city: "Chicago",    count: "290" },
              { city: "Miami",      count: "210" },
              { city: "Houston",    count: "187" },
              { city: "Boston",     count: "144" },
              { city: "Seattle",    count: "132" },
              { city: "Dallas",     count: "98"  },
            ].map(({ city, count }) => (
              <button key={city} onClick={() => { setLocationInput(city); document.getElementById("providers-section")?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "16px 18px", background: "#f4f9fc", border: "1.5px solid #e8eef2", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", transition: "all .18s" }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "#32cce0"; el.style.background = "#eef9fc"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 4px 24px rgba(16,117,173,0.09)"; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "#e8eef2"; el.style.background = "#f4f9fc"; el.style.transform = "none"; el.style.boxShadow = "none"; }}
              >
                <div>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14, color: "#071e34" }}>{city}</div>
                  <div style={{ fontSize: 12, color: "#5a7085", marginTop: 2 }}>{count}+ {title.toLowerCase()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. COMMON PROCEDURES ────────────────────────────────────────────── */}
      <section style={{ background: "#f4f9fc", padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          {sectionHeader(
            "Services & Procedures",
            <>Common <em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>{specialtyName}</em> Services</>,
            "Browse All Procedures",
          )}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, name: "Annual Physical", desc: "Comprehensive health check-up and screening" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/></svg>, name: "Initial Assessment", desc: "Comprehensive evaluation and personalized treatment plan" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>, name: "Follow-up Visit", desc: "Ongoing care and treatment monitoring" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/></svg>, name: "Diagnostic Imaging", desc: "Advanced imaging to identify and diagnose conditions" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, name: "Treatment Plan", desc: "Customized care plan tailored to your needs" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, name: "Preventive Care", desc: "Proactive health management and wellness screenings" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>, name: "Consultation", desc: "Expert advice and second opinions" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/></svg>, name: "Lab & Blood Tests", desc: "Comprehensive laboratory analysis and testing" },
            ].map(proc => (
              <div key={proc.name}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", background: "#fff", border: "1.5px solid #e8eef2", borderRadius: 12, cursor: "pointer", transition: "all .2s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#1075ad"; el.style.boxShadow = "0 4px 24px rgba(16,117,173,0.09)"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#e8eef2"; el.style.boxShadow = "none"; el.style.transform = "none"; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eef9fc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {proc.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14, color: "#071e34", marginBottom: 2 }}>{proc.name}</div>
                  <div style={{ fontSize: 12, color: "#5a7085", lineHeight: 1.4 }}>{proc.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. INSURANCE ────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          {sectionHeader(
            "Insurance & Coverage",
            <>Find {title} That Accept <em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>Your Insurance</em></>,
            "All Insurance Plans",
          )}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { abbr: "SL",  name: "Sun Life",         color: "#0369a1" },
              { abbr: "MN",  name: "Manulife",          color: "#15803d" },
              { abbr: "BC",  name: "Blue Cross",        color: "#1a56db" },
              { abbr: "GWL", name: "Great-West Life",   color: "#9333ea" },
              { abbr: "EMP", name: "Empire Life",       color: "#b45309" },
              { abbr: "IAF", name: "iA Financial",      color: "#0f766e" },
              { abbr: "SSQ", name: "SSQ Insurance",     color: "#b91c1c" },
              { abbr: "DEJ", name: "Desjardins",        color: "#1d4ed8" },
            ].map(ins => (
              <div key={ins.name}
                onClick={() => { setInsuranceInput(ins.name); document.getElementById("providers-section")?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "#f4f9fc", border: "1.5px solid #e8eef2", borderRadius: 10, cursor: "pointer", transition: "all .18s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#32cce0"; el.style.background = "#eef9fc"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 4px 24px rgba(16,117,173,0.09)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#e8eef2"; el.style.background = "#f4f9fc"; el.style.transform = "none"; el.style.boxShadow = "none"; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: ins.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 12, color: "#fff", flexShrink: 0 }}>
                  {ins.abbr}
                </div>
                <div>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 13.5, color: "#071e34" }}>{ins.name}</div>
                  <div style={{ fontSize: 11.5, color: "#5a7085", marginTop: 1 }}>200+ {title.toLowerCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. WHY HOSPITAL.COM ─────────────────────────────────────────────── */}
      <section style={{ background: "#071e34", padding: isMobile ? "60px 24px" : "80px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(50,204,224,0.08) 0%, transparent 60%)" }} />
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#32cce0", marginBottom: 10 }}>Why Us</div>
            <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 34, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, maxWidth: "100%" }}>
              Why Use Hospital.com to Find a <em style={{ fontStyle: "italic", color: "#1075ad" }}>{singular}</em>?
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)", gap: 0 }}>
            {[
              { svg: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#32cce0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, title: "Verified Providers", desc: "Every provider is credentialed and background-checked before listing." },
              { svg: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#32cce0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, title: "Real Patient Reviews", desc: "Aggregated from multiple sources — unfiltered, verified, and honest." },
              { svg: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#32cce0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6l11 6 11-6"/><path d="M1 12l11 6 11-6"/></svg>, title: "Transparent Information", desc: "Credentials, services, and pricing — clearly laid out before you book." },
              { svg: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#32cce0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, title: "Easy Comparison", desc: "Compare providers side-by-side by rating, location, and availability." },
              { svg: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#32cce0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, title: "Insurance Compatible", desc: "Filter by your plan to avoid surprise out-of-pocket costs at the door." },
            ].map((b, i) => (
              <div key={b.title} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: isMobile ? "0 12px" : "0 24px", position: "relative", borderLeft: !isMobile && i > 0 ? "1px solid rgba(50,204,224,0.14)" : "none" }}>
                <div style={{ marginBottom: 20 }}>{b.svg}</div>
                <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 8 }}>{b.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.6, maxWidth: 170 }}>{b.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 52, flexWrap: "wrap" }}>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #32cce0, #1075ad)", color: "#fff", padding: "14px 28px", border: "none", borderRadius: 10, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14.5, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
            >Find a {singular}</button>
            <button style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", color: "#fff", padding: "14px 28px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14.5, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"}
            >How It Works</button>
          </div>
        </div>
      </section>

      {/* ─── 7. EDUCATIONAL CONTENT ──────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            {sectionLabel("About This Specialty")}
            {sectionTitle(<>About <em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>{specialtyName} Care</em></>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 60, alignItems: "start" }}>
            {/* Body */}
            <div>
              {content?.about
                ? content.about.map((para, i) => (
                    <p key={i} style={{ fontSize: 14.5, lineHeight: 1.8, color: "#5a7085", marginBottom: 16 }}>{para}</p>
                  ))
                : <>
                    <p style={{ fontSize: 14.5, lineHeight: 1.8, color: "#5a7085", marginBottom: 16 }}>
                      {specialtyName} is a specialized area of healthcare focused on the diagnosis, treatment, and prevention of related disorders. Providers use evidence-based approaches to restore proper function, relieve symptoms, and improve quality of life.
                    </p>
                    <p style={{ fontSize: 14.5, lineHeight: 1.8, color: "#5a7085", marginBottom: 16 }}>
                      {specialtyName} care is covered by most private insurance plans and is one of the most widely accessed healthcare specialties.
                    </p>
                  </>
              }

              {content?.howItWorks && (
                <>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#071e34", margin: "24px 0 12px" }}>How {specialtyName.toLowerCase()} works</div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.8, color: "#5a7085", marginBottom: 8 }}>{content.howItWorks}</p>
                </>
              )}

              {content?.types && (
                <>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#071e34", margin: "24px 0 12px" }}>Types you may encounter</div>
                  <p style={{ fontSize: 14.5, lineHeight: 1.8, color: "#5a7085", marginBottom: 8 }}>{content.types}</p>
                </>
              )}

              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#071e34", margin: "24px 0 12px" }}>When should you see {content ? "an" : "a"} {singular.toLowerCase()}?</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {(content?.whenToSee ?? [
                  `Persistent symptoms that don't resolve on their own`,
                  `Recurring or worsening conditions`,
                  `Following an injury or medical event`,
                  `Preventive care and routine health maintenance`,
                  `Second opinion on a diagnosis or treatment plan`,
                  `Specialized evaluation or procedure`,
                ]).map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#5a7085", lineHeight: 1.6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#32cce0", flexShrink: 0, marginTop: 7 }} />
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#071e34", margin: "24px 0 12px" }}>How to choose the right provider</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Check their credentials and board certification",
                  "Read verified patient reviews to understand their communication style",
                  "Confirm they treat your specific condition",
                  "Verify their insurance compatibility before booking",
                  "Look for providers who offer a thorough initial assessment",
                ].map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#5a7085", lineHeight: 1.6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#32cce0", flexShrink: 0, marginTop: 7 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Aside cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
                  title: "Quick facts",
                  items: content?.facts ?? ["Covered by most private health plans", "No referral needed in most cases", "Average session: 30–60 minutes", "First visit typically includes full assessment", "Most conditions improve within 4–8 sessions"],
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
                  title: "Common conditions treated",
                  items: content?.conditions ?? ["Acute and chronic pain", "Injury recovery and rehabilitation", "Preventive care and wellness", "Chronic disease management", "Post-surgical care", "Diagnostic evaluation"],
                },
                {
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                  title: "Average costs",
                  items: content?.costs ?? ["Initial visit: $100 – $300", "Follow-up sessions: $60 – $150", "Most plans cover $300–$1,500/year", "Many providers offer payment plans"],
                },
              ].map(card => (
                <div key={card.title} style={{ background: "#f4f9fc", border: "1px solid #e8eef2", borderRadius: 12, padding: 20 }}>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14, color: "#071e34", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    {card.icon}{card.title}
                  </div>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                    {card.items.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#5a7085", lineHeight: 1.5 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#1075ad", flexShrink: 0, marginTop: 7 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7b. CREDENTIALS (acupuncture + any specialty with credential data) ── */}
      {content?.credentials && (
        <section style={{ background: "#f4f9fc", padding: isMobile ? "60px 24px" : "80px 48px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ marginBottom: 44 }}>
              {sectionLabel("Licensing & Credentials")}
              {sectionTitle(<>What <em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>&#8220;Licensed {singular}&#8221;</em> Means</>)}
            </div>
            <p style={{ fontSize: 14.5, lineHeight: 1.8, color: "#5a7085", marginBottom: 32, maxWidth: 760 }}>
              Licensing requirements vary by jurisdiction, but both the United States and Canada maintain rigorous credentialing standards for practitioners using protected titles.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
              {content.credentials.map(cred => (
                <div key={cred.region} style={{ background: "#fff", border: "1.5px solid #cce4f0", borderRadius: 14, padding: "24px 28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #eef9fc, #c8edf7)", border: "1px solid #cce4f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: "#071e34" }}>{cred.region}</div>
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "#5a7085" }}>{cred.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 7c. EVIDENCE BASE (acupuncture + any specialty with evidence data) ── */}
      {content?.evidenceBase && (
        <section style={{ background: "#fff", padding: isMobile ? "60px 24px" : "80px 48px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ marginBottom: 44 }}>
              {sectionLabel("Research & Evidence")}
              {sectionTitle(<>The Evidence <em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>Base</em></>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 56, alignItems: "start" }}>
              <div>
                {content.evidenceBase.map((para, i) => (
                  <p key={i} style={{ fontSize: 14.5, lineHeight: 1.85, color: "#5a7085", marginBottom: 18 }}>{para}</p>
                ))}
              </div>
              {content.sources && (
                <div style={{ background: "#f4f9fc", border: "1px solid #e8eef2", borderRadius: 14, padding: "24px 24px" }}>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 13, color: "#071e34", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    Sources &amp; Citations
                  </div>
                  <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, paddingLeft: 0 }}>
                    {content.sources.map((src, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, fontSize: 12, color: "#5a7085", lineHeight: 1.6 }}>
                        <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, color: "#1075ad", flexShrink: 0, fontSize: 11 }}>{i + 1}.</span>
                        {src}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── 8. FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "#f4f9fc", padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ marginBottom: 44 }}>
            {sectionLabel("Common Questions")}
            {sectionTitle(<>Frequently Asked <em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>Questions</em></>)}
          </div>
          {content?.faqs
            ? (() => {
                const mid = Math.ceil(content.faqs!.length / 2);
                const left = content.faqs!.slice(0, mid);
                const right = content.faqs!.slice(mid);
                return (
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0 40px" }}>
                    <div>{left.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}</div>
                    <div>{right.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}</div>
                  </div>
                );
              })()
            : (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0 40px" }}>
                <div>
                  <FaqItem q={`How much does a ${singular.toLowerCase()} visit cost?`} a="Costs typically range from $60–$300 per session depending on your location and provider. Initial visits are usually higher due to the comprehensive assessment. Most private plans cover a portion of the cost." />
                  <FaqItem q="Do I need a referral?" a="In most cases, no referral is required — you can book directly. Some insurance plans may request a referral for reimbursement purposes, so it's worth checking your plan beforehand." />
                  <FaqItem q="Is this specialty covered by insurance?" a="Yes — most employer-sponsored health plans include coverage for this specialty. Use Hospital.com's insurance filter to find in-network providers instantly and avoid surprise costs." />
                </div>
                <div>
                  <FaqItem q="How do I choose the best provider?" a="Look for a licensed and board-certified provider, read verified patient reviews, confirm they treat your condition, and verify they accept your insurance plan. A thorough initial assessment is a strong positive sign." />
                  <FaqItem q="How many visits will I need?" a="It depends on your condition. Acute issues may resolve in a few sessions while chronic or complex conditions may require ongoing care. Your provider will outline a plan after your first assessment." />
                  <FaqItem q="Are Hospital.com providers verified?" a="Yes — every provider on Hospital.com has been credentialed and background-checked. Verified Partners display a teal badge and have passed additional quality checks." />
                </div>
              </div>
            )
          }
        </div>
      </section>

      {/* ─── 9. PROVIDER CTA ─────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(160deg, #eaf8fc 0%, #f0f9ff 40%, #e8f4fb 100%)", borderTop: "1px solid #e8eef2", padding: isMobile ? "64px 24px" : "88px 48px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #32cce0, #1075ad)" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#1075ad", fontFamily: "Outfit, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 16, background: "rgba(16,117,173,0.07)", border: "1px solid rgba(16,117,173,0.15)", padding: "5px 14px", borderRadius: 100 }}>
            For {specialtyName} Providers
          </div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: isMobile ? 26 : 38, color: "#071e34", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 14 }}>
            Are You a {singular}? <em style={{ fontStyle: "italic", color: "#1075ad" }}>Join Hospital.com.</em>
          </h2>
          <p style={{ color: "#5a7085", fontSize: 15.5, lineHeight: 1.75, maxWidth: 520, marginBottom: 32 }}>
            Connect with new patients, grow your practice visibility, and build trust through a verified profile — all in one place. Thousands of providers already trust Hospital.com.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => router.push("/become-provider")} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #1075ad, #0b5e8c)", color: "#fff", padding: "14px 28px", border: "none", borderRadius: 10, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14.5, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              Join as a Provider
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 8, color: "#1075ad", padding: "14px 24px", border: "1.5px solid #1075ad", borderRadius: 10, background: "none", fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14.5, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#1075ad"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "#1075ad"; }}
            >Learn More</button>
          </div>
        </div>
      </section>

      {/* ─── 10. SEO FOOTER NAV ──────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderTop: "1px solid #e8eef2", padding: isMobile ? "48px 24px" : "56px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 40 }}>
            {[
              { heading: "Related Specialties", links: content?.relatedSpecialties ?? ["Physiotherapists", "Massage Therapists", "Orthopedic Surgeons", "Sports Medicine Doctors", "Neurologists", "General Practitioners", "Osteopaths"] },
              { heading: "Related Procedures", links: ["Annual Physical", "Blood Test", "Diagnostic Imaging", "Initial Assessment", "Treatment Plan", "Follow-up Visit", "Consultation"] },
              { heading: "Nearby Locations", links: [`${title} in New York`, `${title} in Los Angeles`, `${title} in Chicago`, `${title} in Miami`, `${title} in Houston`, `${title} in Boston`, `${title} in Seattle`] },
              { heading: "Popular Insurance", links: ["Sun Life Providers", "Manulife Providers", "Blue Cross Providers", "Great-West Life Providers", "Desjardins Providers", "Empire Life Providers", "iA Financial Providers"] },
            ].map(col => (
              <div key={col.heading}>
                <h4 style={{ fontFamily: "Outfit, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#071e34", marginBottom: 16, paddingBottom: 10, borderBottom: "2px solid #32cce0", display: "inline-block" }}>{col.heading}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {col.links.map(link => (
                    <li key={link}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: "#5a7085", padding: 0, textAlign: "left" as const, transition: "color .18s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#1075ad"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#5a7085"}
                      >{link}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
