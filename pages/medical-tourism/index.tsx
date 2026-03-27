import { useState, useRef, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import C from "@/lib/tokens";
import useIsMobile from "@/lib/hooks/useIsMobile";
import Footer from "@/components/layout/Footer";
import FacilitatorModal from "@/components/modals/FacilitatorModal";
import INTL_CLINICS from "@/lib/data/intlClinics";
import type { IntlClinic } from "@/lib/data/intlClinics";

// ─── GLOBAL HEALTH SERVICES PAGE ──────────────────────────────────────────────
// TODO(backend): GET /api/medical-tourism?country=&procedure=&search= — returns clinic list
// TODO(backend): POST /api/medical-tourism/quote — free treatment quotes form

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const CLINIC_GRADIENTS: string[] = [
  "linear-gradient(135deg,#0a4a5a,#1a7a8a)",
  "linear-gradient(135deg,#4a1a0a,#8a4a1a)",
  "linear-gradient(135deg,#1a1a4a,#2a2a8a)",
  "linear-gradient(135deg,#2a0a0a,#5a1a1a)",
  "linear-gradient(135deg,#1a4a1a,#2a8a3a)",
  "linear-gradient(135deg,#3a1a4a,#6a2a8a)",
  "linear-gradient(135deg,#0a3a4a,#1a6a7a)",
  "linear-gradient(135deg,#4a3a0a,#8a6a1a)",
];

const PRICE_FROM: Record<number, string> = {
  101:"$900", 102:"$1,800", 103:"$4,200", 104:"$1,200",
  105:"$2,400", 106:"$2,900", 107:"$1,100", 108:"$3,600",
};

const ACCREDITATION: Record<number, string> = {
  101:"JCI · ISO 9001", 102:"JCI · TEMOS", 103:"ISO 9001 · DNV GL",
  104:"JCI · NABH", 105:"ISO 9001 · JCI", 106:"JCI · ISO 9001",
  107:"ISO 9001", 108:"HAS · ISO 9001",
};

interface Doctor {
  name: string; specialty: string; hospital: string; country: string;
  rating: number; reviews: number; exp: number; cases: string; langs: string;
  initials: string; photo: string;
}

const DOCTORS: Doctor[] = [
  { name:"Dr. Stefan Müller", specialty:"Cardiac Surgeon", hospital:"Charité – Universitätsmedizin", country:"Germany 🇩🇪", rating:4.9, reviews:342, exp:24, cases:"1,400+ surgeries", langs:"🇩🇪 🇬🇧", initials:"SM", photo:"https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=700&fit=crop&crop=top&q=85" },
  { name:"Dr. Aisha Karim", specialty:"Oncologist", hospital:"Samsung Medical Center", country:"South Korea 🇰🇷", rating:5.0, reviews:511, exp:18, cases:"2,000+ cases", langs:"🇰🇷 🇬🇧 🇫🇷", initials:"AK", photo:"https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&h=700&fit=crop&crop=top&q=85" },
  { name:"Dr. Mehmet Yilmaz", specialty:"Hair Transplant Surgeon", hospital:"Estetik International", country:"Turkey 🇹🇷", rating:4.8, reviews:798, exp:15, cases:"5,000+ patients", langs:"🇹🇷 🇬🇧 🇩🇪", initials:"MY", photo:"https://images.unsplash.com/photo-1612531386530-97286d463dab?w=600&h=700&fit=crop&crop=top&q=85" },
  { name:"Dr. Priya Sharma", specialty:"Fertility Specialist & IVF", hospital:"Apollo Hospitals", country:"India 🇮🇳", rating:4.9, reviews:627, exp:20, cases:"3,200+ cycles", langs:"🇮🇳 🇬🇧", initials:"PS", photo:"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=700&fit=crop&crop=top&q=85" },
];

interface Testimonial {
  stars: number; text: string; initials: string;
  name: string; procedure: string; country: string; from: string;
}

const TESTIMONIALS: Testimonial[] = [
  { stars:5, text:"\"I saved over $28,000 on my hip replacement compared to quotes I received at home. The hospital was immaculate, the surgeon was exceptional, and hospital.com's coordinator handled everything — flights, accommodation, even translation.\"", initials:"MR", name:"Michael R.", procedure:"Hip Replacement", country:"Munich, Germany", from:"From Canada" },
  { stars:5, text:"\"After two failed IVF attempts locally, we tried Dr. Sharma at Apollo. We now have a healthy baby girl. hospital.com made the entire journey — from consultation to aftercare — feel manageable and safe.\"", initials:"SL", name:"Sandra & James L.", procedure:"IVF Treatment", country:"New Delhi, India", from:"From Australia" },
  { stars:5, text:"\"I was nervous about travelling for cancer treatment, but the team was world-class. The transparent pricing meant no surprises. I knew exactly what I'd pay before I boarded the plane.\"", initials:"DK", name:"David K.", procedure:"Oncology", country:"Tel Aviv, Israel", from:"From the UK" },
];

const GHS_SPECIALTY_CHIPS = [
  { name:"Cardiology",      count:"284", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { name:"Oncology",        count:"318", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg> },
  { name:"Orthopedics",     count:"421", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg> },
  { name:"Fertility & IVF", count:"196", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg> },
  { name:"Neurology",       count:"163", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
  { name:"Plastic Surgery", count:"537", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg> },
  { name:"Dental Tourism",  count:"742", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M12 2C8 2 5 5 5 8c0 3.5 3 6 4 8h6c1-2 4-4.5 4-8 0-3-3-6-7-6z"/><path d="M9 17v2a3 3 0 0 0 6 0v-2"/></svg> },
  { name:"Ophthalmology",   count:"218", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/></svg> },
  { name:"Bariatric Surgery",count:"289",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M3 6h18M3 12h18M3 18h18"/></svg> },
  { name:"Endocrinology",   count:"144", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg> },
];

const GHS_PROCEDURE_CHIPS = [
  { name:"Coronary Bypass",   count:"92",  icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
  { name:"Hip Replacement",   count:"310", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
  { name:"LASIK Eye Surgery",  count:"480", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/></svg> },
  { name:"IVF Treatment",     count:"174", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/></svg> },
  { name:"Gastric Sleeve",    count:"265", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/></svg> },
  { name:"Dental Implants",   count:"690", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M12 2C8 2 5 5 5 8c0 3.5 3 6 4 8h6c1-2 4-4.5 4-8 0-3-3-6-7-6z"/><path d="M9 17v2a3 3 0 0 0 6 0v-2"/></svg> },
  { name:"Rhinoplasty",       count:"422", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="8" r="5"/><path d="M3 21c0-4.4 4-8 9-8s9 3.6 9 8"/></svg> },
  { name:"Knee Replacement",  count:"298", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg> },
  { name:"Stem Cell Therapy", count:"87",  icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4"  r="1.5"/><circle cx="12" cy="20" r="1.5"/><circle cx="4"  cy="12" r="1.5"/><circle cx="20" cy="12" r="1.5"/></svg> },
  { name:"Hair Transplant",   count:"514", icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
];

interface SelectOption { value: string; label: string; }
interface SelectProps {
  value: string; onChange: (v: string) => void;
  options: (SelectOption | string)[]; minWidth?: number;
}

function Select({ value, onChange, options, minWidth }: SelectProps) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => (typeof o === "string" ? o : o.value) === value);
  const label = current ? (typeof current === "string" ? current : current.label) : "Select…";
  return (
    <div style={{ position:"relative", minWidth: minWidth || 120 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, padding:"8px 12px 8px 14px", border:`1.5px solid ${open?C.teal:C.border}`, borderRadius:22, background:open?C.tealLt:C.white, cursor:"pointer", fontSize:13, fontWeight:500, color:open?C.teal:C.textMd, fontFamily:"inherit", transition:"all .15s", whiteSpace:"nowrap" }}>
        <span>{label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .18s", transform:open?"rotate(180deg)":"rotate(0deg)" }}><polyline points="6,9 12,15 18,9"/></svg>
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, minWidth:"100%", background:C.white, border:`1px solid ${C.border}`, borderRadius:16, boxShadow:"0 12px 36px rgba(0,0,0,.12)", zIndex:999, overflow:"hidden", padding:6 }}>
          {options.map(o => {
            const val = typeof o === "string" ? o : o.value;
            const lbl = typeof o === "string" ? o : o.label;
            const sel = val === value;
            return (
              <button key={val} onClick={() => { onChange(val); setOpen(false); }}
                style={{ display:"flex", alignItems:"center", gap:8, width:"100%", textAlign:"left", padding:"10px 14px", background:sel?C.tealLt:"transparent", color:sel?C.teal:C.text, fontWeight:sel?700:500, fontSize:13, border:"none", borderRadius:11, cursor:"pointer", fontFamily:"inherit" }}
                onMouseEnter={e=>{if(!sel)(e.currentTarget as HTMLButtonElement).style.background=C.gray;}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=sel?C.tealLt:"transparent";}}>
                {sel && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                {lbl}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default function GlobalHealthServicesPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const clinicsRef = useRef<HTMLDivElement>(null);

  // Search state
  const [searchMode, setSearchMode] = useState<"classic"|"ai">("classic");
  const [heroTreatment, setHeroTreatment] = useState("");
  const [heroCountry, setHeroCountry] = useState("");
  const [heroBudget, setHeroBudget] = useState("");
  const [aiQuery, setAiQuery] = useState("");

  // Clinic filter state (drives the results grid)
  const [country, setCountry] = useState("All");
  const [procedure, setProcedure] = useState("All");
  const [search, setSearch] = useState("");

  // Modal
  const [facilitatorModal, setFacilitatorModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<IntlClinic | null>(null);

  const allCountries = ["All", ...Array.from(new Set(INTL_CLINICS.map(c => c.country)))];
  const allProcedures = ["All", ...Array.from(new Set(INTL_CLINICS.flatMap(c => c.procedures)))];

  const filtered = INTL_CLINICS.filter(c =>
    (country === "All" || c.country === country) &&
    (procedure === "All" || c.procedures.includes(procedure)) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.procedures.some(p => p.toLowerCase().includes(search.toLowerCase())))
  );

  function handleHeroSearch() {
    if (heroCountry) setCountry(heroCountry);
    if (heroTreatment) setSearch(heroTreatment);
    clinicsRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
  }

  function handleDestinationChip(countryName: string) {
    setHeroCountry(countryName);
    setCountry(countryName);
    clinicsRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
  }

  const navy = "#071e34";
  const brandCyan = C.teal;
  const brandBlue = C.blue;

  return (
    <>
      <Head>
        <title>Global Health Services – Medical Tourism | Hospital.com</title>
        <meta name="description" content="Connect with certified international clinics. Save 40–80% on procedures abroad with Hospital.com's vetted global network." />
        <meta property="og:title" content="Global Health Services | Hospital.com" />
        <link rel="canonical" href="https://www.hospital.com/medical-tourism" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight:"calc(100vh - 58px)", background:C.white, fontFamily:"'DM Sans', sans-serif" }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section style={{
          minHeight: isMobile ? "auto" : "100vh",
          background: "#f0fafe",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          padding: isMobile ? "80px 20px 60px" : "50px 24px 80px",
          position:"relative", overflow:"hidden",
        }}>
          {/* Grid lines */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage:`linear-gradient(rgba(16,117,173,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,117,173,0.06) 1px, transparent 1px)`,
            backgroundSize:"60px 60px" }} />
          {/* Gradients */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none",
            background:`radial-gradient(ellipse 65% 70% at -5% 55%, rgba(70,196,217,0.22) 0%, transparent 55%),
              radial-gradient(ellipse 55% 65% at 105% 30%, rgba(18,117,173,0.14) 0%, transparent 55%)` }} />

          {/* Label */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(70,196,217,0.10)", border:`1px solid rgba(70,196,217,0.30)`,
            color:brandBlue, fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
            padding:"6px 16px", borderRadius:100, marginBottom:28, fontFamily:"Outfit, sans-serif",
            position:"relative", zIndex:1 }}>
            🌐 Global Health Services
          </div>

          {/* Heading */}
          <h1 style={{ fontFamily:"Outfit, sans-serif", fontWeight:800,
            fontSize: isMobile ? 32 : "clamp(2.6rem, 5.5vw, 4.5rem)",
            color:navy, textAlign:"center", lineHeight:1.06, letterSpacing:"-0.03em",
            maxWidth:860, marginBottom:20, position:"relative", zIndex:1 }}>
            World-class care,<br />

            <em style={{ fontStyle:"italic", color:brandCyan }}>anywhere</em>{" "}you need it
          </h1>

          <p style={{ color:C.textMd, fontSize: isMobile ? 15 : 17, fontWeight:400,
            textAlign:"center", maxWidth:640, lineHeight:1.65,
            position:"relative", zIndex:1, marginBottom:32 }}>
            Connect with internationally certified hospitals and specialists across 80+ countries. Transparent pricing, verified credentials, no surprises.
          </p>

          {/* Search Toggle */}
          <div style={{ display:"flex", alignItems:"center",
            background:"rgba(255,255,255,0.8)", border:`1.5px solid ${C.border}`,
            borderRadius:100, padding:4, marginBottom:16,
            position:"relative", zIndex:2 }}>
            <button onClick={() => setSearchMode("classic")}
              style={{ padding:"8px 20px", borderRadius:100, fontFamily:"Outfit, sans-serif",
                fontSize:13, fontWeight:600, cursor:"pointer", border:"none",
                background: searchMode==="classic" ? navy : "transparent",
                color: searchMode==="classic" ? "white" : C.textMd,
                transition:"all .2s", display:"flex", alignItems:"center", gap:6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="17" y1="17" x2="22" y2="22"/></svg>
              Classic Search
            </button>
            <button onClick={() => setSearchMode("ai")}
              style={{ padding:"8px 20px", borderRadius:100, fontFamily:"Outfit, sans-serif",
                fontSize:13, fontWeight:600, cursor:"pointer", border:"none",
                background: searchMode==="ai" ? navy : "transparent",
                color: searchMode==="ai" ? "white" : C.textMd,
                transition:"all .2s", display:"flex", alignItems:"center", gap:6 }}>
              ✦ AI Search
            </button>
          </div>

          {/* Search Panel */}
          <div style={{ width:"100%", maxWidth:960, position:"relative", zIndex:2 }}>

            {/* Classic Search */}
            {searchMode === "classic" && (
              <div style={{ background:"white", padding:"7px 7px 7px 10px",
                boxShadow:"0 8px 48px rgba(16,117,173,0.13), 0 0 0 1px rgba(16,117,173,0.08)",
                display:"flex", alignItems:"center",
                flexDirection: isMobile ? "column" : "row",
                borderRadius: isMobile ? 20 : 100 }}>
                {/* Treatment field */}
                <div style={{ flex:1, display:"flex", alignItems:"center", gap:12, padding:"12px 22px",
                  borderRight: isMobile ? "none" : `1px solid ${C.border}`,
                  borderBottom: isMobile ? `1px solid ${C.border}` : "none",
                  cursor:"pointer", borderRadius: isMobile ? 12 : 0, width: isMobile ? "100%" : "auto" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={brandBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="17" y1="17" x2="22" y2="22"/></svg>
                  <div style={{ display:"flex", flexDirection:"column", gap:2, flex:1 }}>
                    <span style={{ fontFamily:"Outfit, sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textSm }}>Treatment / Specialty</span>
                    <input value={heroTreatment} onChange={e=>setHeroTreatment(e.target.value)}
                      placeholder="e.g. Cardiac Surgery, IVF…"
                      style={{ border:"none", outline:"none", fontSize:14, fontWeight:500, color:heroTreatment?C.text:C.grayMd, fontFamily:"inherit", background:"transparent", width:"100%" }} />
                  </div>
                </div>
                {/* Country field */}
                <div style={{ flex:1, display:"flex", alignItems:"center", gap:12, padding:"12px 22px",
                  borderRight: isMobile ? "none" : `1px solid ${C.border}`,
                  borderBottom: isMobile ? `1px solid ${C.border}` : "none",
                  cursor:"pointer", borderRadius: isMobile ? 12 : 0, width: isMobile ? "100%" : "auto" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={brandBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <div style={{ display:"flex", flexDirection:"column", gap:2, flex:1 }}>
                    <span style={{ fontFamily:"Outfit, sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textSm }}>Destination Country</span>
                    <input value={heroCountry} onChange={e=>setHeroCountry(e.target.value)}
                      placeholder="Any country…"
                      style={{ border:"none", outline:"none", fontSize:14, fontWeight:500, color:heroCountry?C.text:C.grayMd, fontFamily:"inherit", background:"transparent", width:"100%" }} />
                  </div>
                </div>
                {/* Budget field */}
                <div style={{ flex:1, display:"flex", alignItems:"center", gap:12, padding:"12px 22px",
                  cursor:"pointer", borderRadius: isMobile ? 12 : 0, width: isMobile ? "100%" : "auto" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={brandBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  <div style={{ display:"flex", flexDirection:"column", gap:2, flex:1 }}>
                    <span style={{ fontFamily:"Outfit, sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:C.textSm }}>Budget (USD, optional)</span>
                    <input value={heroBudget} onChange={e=>setHeroBudget(e.target.value)}
                      placeholder="Select range…"
                      style={{ border:"none", outline:"none", fontSize:14, fontWeight:500, color:heroBudget?C.text:C.grayMd, fontFamily:"inherit", background:"transparent", width:"100%" }} />
                  </div>
                </div>
                <button onClick={handleHeroSearch}
                  style={{ background:brandCyan, color:"white", border:"none",
                    borderRadius: isMobile ? 12 : 100, padding:"14px 28px",
                    fontFamily:"Outfit, sans-serif", fontSize:14, fontWeight:700, cursor:"pointer",
                    display:"flex", alignItems:"center", gap:8, flexShrink:0, whiteSpace:"nowrap",
                    width: isMobile ? "100%" : "auto", justifyContent:"center",
                    transition:"opacity .2s" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="17" y1="17" x2="22" y2="22"/></svg>
                  Find Clinics
                </button>
              </div>
            )}

            {/* AI Search */}
            {searchMode === "ai" && (
              <div style={{ background:"white", borderRadius:24, padding:"20px 24px",
                boxShadow:"0 8px 48px rgba(16,117,173,0.13), 0 0 0 1px rgba(16,117,173,0.08)" }}>
                <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700,
                  letterSpacing:"0.1em", textTransform:"uppercase", color:brandBlue,
                  marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                  ✦ Describe what you&apos;re looking for in plain language
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
                  <textarea value={aiQuery} onChange={e=>setAiQuery(e.target.value)}
                    placeholder="e.g. I need hip replacement surgery in Europe, my budget is around $12,000 and I'd like to travel in June…"
                    rows={2}
                    style={{ flex:1, border:`1.5px solid ${C.border}`, borderRadius:12, padding:"14px 18px",
                      fontFamily:"'DM Sans', sans-serif", fontSize:14, color:C.text, resize:"none",
                      outline:"none", lineHeight:1.55, transition:"border-color .2s", minHeight:56,
                      boxSizing:"border-box" as const }}
                    onFocus={e=>e.target.style.borderColor=brandCyan}
                    onBlur={e=>e.target.style.borderColor=C.border} />
                  <button onClick={handleHeroSearch}
                    style={{ background:`linear-gradient(135deg, ${brandCyan}, ${brandBlue})`,
                      color:"white", border:"none", borderRadius:12, padding:"14px 22px",
                      fontFamily:"Outfit, sans-serif", fontSize:14, fontWeight:700, cursor:"pointer",
                      display:"flex", alignItems:"center", gap:7, whiteSpace:"nowrap",
                      transition:"opacity .2s" }}>
                    ✦ Search with AI
                  </button>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:12 }}>
                  {["Heart bypass in Germany","IVF treatment in Spain","Knee replacement in Thailand","Cancer treatment in Israel","Dental implants in Hungary"].map(s => (
                    <span key={s} onClick={()=>setAiQuery(s)}
                      style={{ fontSize:12, color:brandBlue, background:"rgba(18,117,173,0.06)",
                        border:"1px solid rgba(18,117,173,0.15)", borderRadius:100,
                        padding:"5px 13px", cursor:"pointer", transition:"all .18s", fontWeight:500 }}
                      onMouseEnter={e=>(e.currentTarget as HTMLSpanElement).style.background=brandBlue+(","+"color:white").split(",")[0]}
                      onMouseLeave={e=>(e.currentTarget as HTMLSpanElement).style.background="rgba(18,117,173,0.06)"}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Popular Destinations */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:20, flexWrap:"wrap",
            justifyContent:"center", position:"relative", zIndex:1 }}>
            <span style={{ fontSize:13, color:C.textSm, fontWeight:500 }}>Popular destinations:</span>
            {[{flag:"🇩🇪",label:"Germany",value:"Germany"},{flag:"🇹🇭",label:"Thailand",value:"Thailand"},{flag:"🇮🇱",label:"Israel"},{flag:"🇹🇷",label:"Turkey",value:"Turkey"},{flag:"🇪🇸",label:"Spain",value:"Spain"},{flag:"🇮🇳",label:"India",value:"India"}].map(d => (
              <button key={d.label} onClick={()=>handleDestinationChip(d.value||d.label)}
                style={{ fontSize:13, fontWeight:500, color:C.text, background:"white",
                  border:`1px solid ${C.border}`, borderRadius:100, padding:"6px 14px",
                  cursor:"pointer", transition:"all .18s", fontFamily:"inherit" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=brandCyan;(e.currentTarget as HTMLButtonElement).style.color=brandBlue;}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.border;(e.currentTarget as HTMLButtonElement).style.color=C.text;}}>
                {d.flag} {d.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display:"flex", alignItems:"center", gap: isMobile ? 24 : 40,
            flexWrap:"wrap", justifyContent:"center", marginTop:36,
            position:"relative", zIndex:1 }}>
            {[
              { num:"1,669", sup:"+", label:"Certified Clinics Worldwide" },
              { num:"80", sup:"+", label:"Countries Covered" },
              { num:"97", sup:"%", label:"Patient Satisfaction" },
              { num:"$0", sup:"", label:"Platform Fees to Patients" },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap: isMobile ? 24 : 40 }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
                  <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize: isMobile ? 24 : 28, color:navy, lineHeight:1, letterSpacing:"-0.03em" }}>
                    {s.num}<sup style={{ fontSize:"0.55em", color:brandCyan, fontWeight:800 }}>{s.sup}</sup>
                  </div>
                  <div style={{ fontSize:11, color:C.textSm, marginTop:4, fontWeight:500 }}>{s.label}</div>
                </div>
                {i < arr.length - 1 && !isMobile && <div style={{ width:1, height:36, background:C.border }} />}
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section style={{ background:C.offWhite, padding: isMobile ? "64px 20px" : "88px 48px" }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <div style={{ marginBottom: isMobile ? 40 : 56 }}>
              <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:brandBlue, marginBottom:8 }}>Simple Process</div>
              <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize: isMobile ? 24 : 32, color:navy, letterSpacing:"-0.02em", lineHeight:1.15 }}>
                How <em style={{ fontStyle:"italic", color:brandBlue }}>Global Health Services</em> works
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 24 : 0, position:"relative" }}>
              {!isMobile && (
                <div style={{ position:"absolute", top:36, left:"calc(12.5% + 28px)", right:"calc(12.5% + 28px)", height:2,
                  background:`linear-gradient(90deg, ${brandCyan}, ${brandBlue})`, zIndex:0 }} />
              )}
              {[
                { num:"1", title:"Describe Your Needs", desc:"Tell us your diagnosis, desired treatment, and destination — or let our AI guide you." },
                { num:"2", title:"Receive Matched Offers", desc:"Get personalized treatment plans and transparent price quotes from certified clinics within 24 hours." },
                { num:"3", title:"Book with Confidence", desc:"Your dedicated medical coordinator handles appointments, travel logistics, and pre-departure preparation." },
                { num:"4", title:"Get Treated & Return", desc:"Receive world-class care abroad. We stay with you after — arranging follow-up care at home when you return." },
              ].map(step => (
                <div key={step.num} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding: isMobile ? 0 : "0 28px", position:"relative", zIndex:1 }}>
                  <div style={{ width:72, height:72, borderRadius:"50%", background:"white",
                    border:`2px solid ${brandCyan}`, display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize:22, color:brandBlue,
                    marginBottom:24, boxShadow:`0 0 0 6px rgba(70,196,217,0.1)` }}>
                    {step.num}
                  </div>
                  <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:15, color:navy, marginBottom:10 }}>{step.title}</div>
                  <div style={{ fontSize:13, color:C.textSm, lineHeight:1.65, maxWidth:200 }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA #1 — GET FREE TREATMENT QUOTES ───────────────────────────── */}
        <section style={{ background:navy, padding: isMobile ? "64px 20px" : "80px 48px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, pointerEvents:"none",
            background:`radial-gradient(ellipse 70% 90% at 15% 50%, rgba(70,196,217,0.10) 0%, transparent 60%),
              radial-gradient(ellipse 50% 70% at 85% 50%, rgba(18,117,173,0.12) 0%, transparent 60%)` }} />
          <div style={{ maxWidth:1160, margin:"0 auto", display:"flex", alignItems:"center",
            justifyContent:"space-between", gap:48, flexWrap:"wrap", position:"relative" }}>
            <div style={{ flex:1, minWidth:280 }}>
              <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:brandCyan, marginBottom:14 }}>Free &amp; Non-Binding</div>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize: isMobile ? 24 : "clamp(1.9rem, 3vw, 2.6rem)", color:"white", lineHeight:1.1, letterSpacing:"-0.03em", marginBottom:16 }}>
                Get personalized treatment quotes<br/>from <em style={{ color:brandCyan, fontStyle:"italic" }}> certified clinics</em> {" "}worldwide
              </h2>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize: isMobile ? 14 : 16, lineHeight:1.7, maxWidth:480 }}>
                Submit your medical case once. Our team matches you with the best-fit clinics and sends you detailed, itemized quotes — with no obligation to book and no fees to you.
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:18, flexWrap:"wrap", marginTop:20 }}>
                {[
                  { icon:"check", text:"No fees charged to patients" },
                  { icon:"lock", text:"Medical data stays private" },
                  { icon:"clock", text:"Response within 24 hours" },
                ].map(item => (
                  <div key={item.text} style={{ display:"flex", alignItems:"center", gap:6, color:"rgba(255,255,255,0.5)", fontSize:12 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={brandCyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {item.icon==="check" && <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}
                      {item.icon==="lock" && <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}
                      {item.icon==="clock" && <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
                    </svg>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14, alignItems:"flex-start", flexShrink:0 }}>
              <button onClick={() => { setSelectedClinic(null); setFacilitatorModal(true); }}
                style={{ background:brandCyan, color:navy, padding:"16px 32px", borderRadius:11,
                  fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize:15, cursor:"pointer",
                  border:"none", display:"flex", alignItems:"center", gap:9, transition:"all .2s",
                  whiteSpace:"nowrap" }}
                onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.opacity="0.88"}
                onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.opacity="1"}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
                Get Free Treatment Quotes
              </button>
              <button onClick={() => { setSelectedClinic(null); setFacilitatorModal(true); }}
                style={{ color:"rgba(255,255,255,0.6)", fontSize:13, fontWeight:500,
                  background:"none", border:"none", cursor:"pointer", display:"flex",
                  alignItems:"center", gap:6, paddingLeft:4, transition:"color .2s", fontFamily:"inherit" }}
                onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.color="white"}
                onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.color="rgba(255,255,255,0.6)"}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                How does pricing work?
              </button>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", maxWidth:280, lineHeight:1.5 }}>
                By submitting a quote request, you agree to our Terms of Service and Privacy Policy. hospital.com does not collect payment on behalf of clinics.
              </p>
            </div>
          </div>
        </section>

        {/* ── TOP HOSPITALS / CLINICS ───────────────────────────────────────── */}
        <section ref={clinicsRef} style={{ background:C.offWhite, padding: isMobile ? "64px 20px" : "88px 48px" }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:40, flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:brandBlue, marginBottom:8 }}>Top-Rated International Hospitals</div>
                <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize: isMobile ? 22 : 30, color:navy, letterSpacing:"-0.02em" }}>
                  Certified facilities trusted by <em style={{ fontStyle:"italic", color:brandBlue }}>patients worldwide</em>
                </div>
              </div>
            </div>

            {/* Certified callout */}
            <div style={{ background:`linear-gradient(135deg, rgba(18,117,173,0.06), rgba(70,196,217,0.06))`,
              border:`1.5px solid rgba(70,196,217,0.25)`, borderRadius:16, padding:"24px 28px",
              marginBottom:32, display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
              <div style={{ width:52, height:52, background:"white", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 2px 12px rgba(18,117,173,0.12)`, flexShrink:0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={brandBlue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 12 2a8 8 0 0 0-8 8.2c0 7.3 8 11.8 8 11.8z"/><polyline points="9 12 11 14 15 10"/></svg>
              </div>
              <div style={{ flex:1 }}>
                <h4 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:15, color:navy, marginBottom:4 }}>Only Certified Clinics &amp; Hospitals Listed</h4>
                <p style={{ fontSize:13, color:C.textSm, lineHeight:1.55, maxWidth:600 }}>Every facility on hospital.com has been independently vetted for international accreditation, licensing, and patient safety standards. We do not list uncertified providers.</p>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {["✓ JCI Accredited","✓ ISO 9001","✓ TEMOS","✓ DNV GL"].map(b => (
                  <div key={b} style={{ background:"white", border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 12px", fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, color:navy, display:"flex", alignItems:"center", gap:4 }}>{b}</div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
              <div style={{ flex:1, minWidth:200 }}>
                <input value={search} onChange={(e: ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value)}
                  placeholder="Search clinics, countries, procedures…"
                  style={{ width:"100%", padding:"9px 16px", border:`1.5px solid ${C.border}`, borderRadius:22, fontSize:13.5, outline:"none", fontFamily:"inherit", background:C.white, transition:"border-color .2s", boxSizing:"border-box" as const }}
                  onFocus={e=>(e.target as HTMLInputElement).style.borderColor=C.teal}
                  onBlur={e=>(e.target as HTMLInputElement).style.borderColor=C.border} />
              </div>
              <Select value={country} onChange={setCountry} minWidth={160} options={allCountries.map(c=>({value:c,label:c==="All"?"All Countries":c}))} />
              <Select value={procedure} onChange={setProcedure} minWidth={160} options={allProcedures.map(p=>({value:p,label:p==="All"?"All Procedures":p}))} />
            </div>

            {/* Cards */}
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: isMobile ? 12 : 20 }}>
              {filtered.slice(0, 8).map((clinic, idx) => (
                <div key={clinic.id}
                  style={{ border:`1.5px solid ${C.border}`, borderRadius:14, background:"white", overflow:"hidden", cursor:"pointer", transition:"all .22s" }}
                  onClick={() => router.push(`/medical-tourism/${clinic.id}`)}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow="0 8px 40px rgba(16,117,173,0.16)";(e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)";(e.currentTarget as HTMLDivElement).style.borderColor=brandCyan;}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow="none";(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.borderColor=C.border;}}>
                  {/* Photo */}
                  <div style={{ height:isMobile?0:160, overflow:"hidden", position:"relative",
                    display: isMobile ? "none" : "block" }}>
                    <img src={clinic.photo} alt={clinic.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                    <div style={{ position:"absolute", top:12, left:12, background:"rgba(7,30,52,0.82)", backdropFilter:"blur(8px)",
                      border:`1px solid rgba(70,196,217,0.35)`, borderRadius:100,
                      padding:"4px 10px", fontFamily:"Outfit, sans-serif", fontSize:10, fontWeight:700,
                      color:brandCyan, letterSpacing:"0.07em", textTransform:"uppercase" as const,
                      display:"flex", alignItems:"center", gap:5 }}>
                      ✓ {ACCREDITATION[clinic.id]?.split("·")[0].trim() || "Certified"}
                    </div>
                  </div>
                  <div style={{ padding: isMobile ? "14px" : "18px 20px 20px" }}>
                    {isMobile && (
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                        <div style={{ width:48, height:48, borderRadius:12, overflow:"hidden", flexShrink:0 }}><img src={clinic.photo} alt={clinic.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} /></div>
                        <div>
                          <div style={{ fontWeight:700, fontSize:13.5, color:navy }}>{clinic.name}</div>
                          <div style={{ fontSize:11.5, color:C.textSm }}>{clinic.city}, {clinic.country} · {clinic.flag}</div>
                        </div>
                      </div>
                    )}
                    {!isMobile && (
                      <>
                        <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:15, color:navy, marginBottom:4 }}>{clinic.name}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, marginBottom:8 }}>
                          <span style={{ color:"#f0c840" }}>★</span> {clinic.rating}
                          <span style={{ color:C.textSm, fontWeight:400 }}>({clinic.reviews.toLocaleString()} reviews)</span>
                        </div>
                      </>
                    )}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 }}>
                      {clinic.procedures.slice(0, 3).map(p => (
                        <span key={p} style={{ fontFamily:"Outfit, sans-serif", fontSize:10, fontWeight:600, color:brandBlue, background:"rgba(18,117,173,0.07)", padding:"3px 9px", borderRadius:100, border:"1px solid rgba(18,117,173,0.15)" }}>{p}</span>
                      ))}
                    </div>
                    {!isMobile && (
                      <div style={{ fontSize:12, color:C.textSm, display:"flex", alignItems:"center", gap:5, marginBottom:10 }}>
                        📍 {clinic.city}, {clinic.country} {clinic.flag}
                      </div>
                    )}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:10, borderTop:`1px solid ${C.borderLt}`, marginTop:8 }}>
                      <div style={{ fontSize:11, fontWeight:600, color:brandBlue }}>✓ {ACCREDITATION[clinic.id]}</div>
                      <div style={{ fontSize:12, color:C.textSm }}>From <strong style={{ color:navy, fontFamily:"Outfit, sans-serif", fontWeight:700 }}>{PRICE_FROM[clinic.id]}</strong></div>
                    </div>
                    <div style={{ display:"flex", gap:8, marginTop:14 }}>
                      <button className="btn-primary" onClick={e=>{e.stopPropagation();router.push(`/medical-tourism/${clinic.id}`);}}
                        style={{ flex:1, padding:"9px", background:brandCyan, color:"white", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                        View Clinic
                      </button>
                      <button onClick={e=>{e.stopPropagation();setSelectedClinic(clinic);setFacilitatorModal(true);}}
                        style={{ padding:"9px 12px", background:"white", color:C.textSm, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
                        Get Help
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:48, color:C.textSm, background:C.gray, borderRadius:14 }}>
                  No clinics found. Try adjusting your search or filters.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── SPECIALTIES + PROCEDURES ─────────────────────────────────────── */}
        <section style={{ background:"white", padding:0 }}>
          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
            {[
              { label:"Browse by Specialty", titleEm:"specialties", chips: GHS_SPECIALTY_CHIPS },
              { label:"Browse by Procedure", titleEm:"procedures", chips: GHS_PROCEDURE_CHIPS },
            ].map((col, i) => (
              <div key={col.label} style={{ padding: isMobile ? "48px 20px" : "88px 56px", borderRight: (!isMobile && i===0) ? `1px solid #e0e6ea` : "none", borderBottom: (isMobile && i===0) ? `1px solid #e0e6ea` : "none" }}>
                <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:brandBlue, marginBottom:8 }}>{col.label}</div>
                <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize: isMobile ? 22 : 28, color:navy, letterSpacing:"-0.02em", marginBottom:28 }}>
                  Popular <em style={{ fontStyle:"italic", color:brandBlue }}>{col.titleEm}</em> abroad
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                  {col.chips.map(item => (
                    <button key={item.name}
                      onClick={() => { setProcedure(item.name); clinicsRef.current?.scrollIntoView({ behavior:"smooth" }); }}
                      style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px",
                        borderRadius:100, border:`1.5px solid ${C.borderLt}`, background:"white",
                        fontFamily:"inherit", fontSize:13, fontWeight:600, cursor:"pointer",
                        color:C.text, transition:"all .2s" }}
                      onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background=brandCyan;b.style.color="white";b.style.borderColor=brandCyan;const s=b.querySelector("svg");if(s)s.setAttribute("stroke","white");}}
                      onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background="white";b.style.color=C.text;b.style.borderColor=C.borderLt;const s=b.querySelector("svg");if(s)s.setAttribute("stroke","#46c4d9");}}>
                      {item.icon}
                      {item.name}
                      <span style={{ fontSize:11, fontWeight:600, background:"rgba(0,0,0,0.07)", padding:"2px 8px", borderRadius:100 }}>{item.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOP DOCTORS ──────────────────────────────────────────────────── */}
        <section style={{ background:C.offWhite, padding: isMobile ? "64px 20px" : "88px 48px" }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:40, flexWrap:"wrap", gap:16 }}>
              <div>
                <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:brandBlue, marginBottom:8 }}>International Specialists</div>
                <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize: isMobile ? 22 : 30, color:navy, letterSpacing:"-0.02em" }}>
                  Top-rated <em style={{ fontStyle:"italic", color:brandBlue }}>doctors</em> &amp; specialists
                </div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 12 : 20 }}>
              {DOCTORS.map(doc => (
                <div key={doc.name}
                  style={{ border:`1.5px solid ${C.border}`, borderRadius:14, background:"white", overflow:"hidden", cursor:"pointer", transition:"all .22s" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow="0 8px 40px rgba(16,117,173,0.16)";(e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)";(e.currentTarget as HTMLDivElement).style.borderColor=brandCyan;}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow="none";(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.borderColor=C.border;}}>
                  {/* Avatar */}
                  <div style={{ height: isMobile ? 100 : 180, overflow:"hidden", position:"relative" }}>
                    <img src={doc.photo} alt={doc.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top", display:"block" }} />
                    <div style={{ position:"absolute", bottom:10, right:10, background:"white", border:`1px solid rgba(70,196,217,0.4)`, borderRadius:100, padding:"3px 8px", fontSize:10, fontWeight:700, color:brandBlue, display:"flex", alignItems:"center", gap:3 }}>
                      ✓ Verified
                    </div>
                  </div>
                  <div style={{ padding: isMobile ? "12px" : "18px 20px 20px" }}>
                    <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize: isMobile ? 13 : 15, color:navy, marginBottom:3 }}>{doc.name}</div>
                    <div style={{ fontSize:12, color:brandBlue, fontWeight:600, marginBottom:6 }}>{doc.specialty}</div>
                    {!isMobile && (
                      <div style={{ fontSize:12, color:C.textSm, display:"flex", alignItems:"center", gap:5, marginBottom:10 }}>
                        🏥 {doc.hospital}, {doc.country}
                      </div>
                    )}
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600, marginBottom:isMobile?0:10 }}>
                      <span style={{ color:"#f0c840" }}>★</span> {doc.rating}
                      <span style={{ color:C.textSm, fontWeight:400 }}>({doc.reviews})</span>
                    </div>
                    {!isMobile && (
                      <div style={{ display:"flex", gap:14, fontSize:12, color:C.textSm, paddingTop:10, borderTop:`1px solid ${C.borderLt}` }}>
                        <span><strong style={{ color:navy, fontFamily:"Outfit, sans-serif" }}>{doc.exp}</strong> yrs exp.</span>
                        <span><strong style={{ color:navy, fontFamily:"Outfit, sans-serif" }}>{doc.cases}</strong></span>
                        <span>{doc.langs}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
        <section style={{ background:"white", padding: isMobile ? "64px 20px" : "72px 48px" }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <div style={{ marginBottom:40 }}>
              <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:brandBlue, marginBottom:8 }}>Patient Stories</div>
              <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize: isMobile ? 22 : 30, color:navy, letterSpacing:"-0.02em" }}>
                Real experiences from <em style={{ fontStyle:"italic", color:brandBlue }}>real patients</em>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap:20 }}>
              {TESTIMONIALS.map(t => (
                <div key={t.name} style={{ background:C.offWhite, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"28px 26px" }}>
                  <div style={{ color:"#f0c840", fontSize:14, letterSpacing:1, marginBottom:14 }}>{"★".repeat(t.stars)}</div>
                  <p style={{ fontSize:14, color:C.text, lineHeight:1.7, marginBottom:18, fontStyle:"italic" }}>{t.text}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg, ${brandCyan}, ${brandBlue})`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:14, color:"white", flexShrink:0 }}>
                      {t.initials}
                    </div>
                    <div>
                      <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:13, color:navy }}>{t.name}</div>
                      <div style={{ fontSize:12, color:C.textSm }}>{t.procedure} · {t.country} · {t.from}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY SECTION ──────────────────────────────────────────────────── */}
        <section style={{ background:navy, padding: isMobile ? "64px 20px" : "88px 48px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, pointerEvents:"none",
            background:`radial-gradient(ellipse 60% 80% at 80% 50%, rgba(70,196,217,0.08) 0%, transparent 60%)` }} />
          <div style={{ maxWidth:1160, margin:"0 auto", position:"relative" }}>
            <div style={{ textAlign:"center", marginBottom:64 }}>
              <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:brandCyan, marginBottom:10 }}>Why hospital.com Global</div>
              <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize: isMobile ? 24 : 34, color:"white", letterSpacing:"-0.02em", lineHeight:1.15, maxWidth:700, margin:"0 auto" }}>
                Everything you need for <em style={{ fontStyle:"italic", color:brandCyan }}>safe medical travel</em>
              </div>
              <div style={{ marginTop:32, textAlign:"center" }}>
                <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize: isMobile ? 48 : 60, color:"white", letterSpacing:"-0.04em", lineHeight:1 }}>
                  500<span style={{ color:brandCyan }}>K+</span>
                </div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,0.45)", marginTop:6 }}>patients connected to international care through hospital.com</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 32 : 0 }}>
              {[
                { title:"Certified Facilities Only", desc:"Every clinic meets international accreditation standards. We verify credentials before any listing goes live." },
                { title:"Transparent Pricing", desc:"Itemized cost breakdowns, guaranteed in writing. No hidden fees, no surprise bills after treatment." },
                { title:"Dedicated Coordinator", desc:"A personal medical coordinator guides you from first query through treatment and home recovery." },
                { title:"Privacy & Data Security", desc:"Your medical records are encrypted and never shared without explicit consent. HIPAA and GDPR compliant." },
              ].map((b, i) => (
                <div key={b.title} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding: isMobile ? 0 : "0 36px", position:"relative",
                  borderLeft: (!isMobile && i>0) ? "1px solid rgba(70,196,217,0.15)" : "none" }}>
                  <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(70,196,217,0.1)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={brandCyan} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      {i===0 && <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}
                      {i===1 && <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>}
                      {i===2 && <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}
                      {i===3 && <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}
                    </svg>
                  </div>
                  <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:15, color:"white", marginBottom:10 }}>{b.title}</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.65, maxWidth:220 }}>{b.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", justifyContent:"center", gap:14, marginTop:56, flexWrap:"wrap" }}>
              <button onClick={() => { setSelectedClinic(null); setFacilitatorModal(true); }}
                style={{ display:"flex", alignItems:"center", gap:8, background:`linear-gradient(135deg, ${brandCyan}, ${brandBlue})`, color:"white", padding:"14px 28px", borderRadius:10, fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:14, border:"none", cursor:"pointer", transition:"all .2s" }}
                onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.opacity="0.88";b.style.transform="translateY(-1px)";b.style.boxShadow=`0 6px 20px rgba(70,196,217,0.35)`;}}
                onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.opacity="1";b.style.transform="none";b.style.boxShadow="none";}}>
                Start My Medical Journey
              </button>
              <button style={{ display:"flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.06)", color:"white", padding:"14px 28px", borderRadius:10, fontFamily:"Outfit, sans-serif", fontWeight:600, fontSize:14, border:"1px solid rgba(255,255,255,0.12)", cursor:"pointer", transition:"all .2s" }}
                onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background="rgba(255,255,255,0.14)";b.style.borderColor="rgba(255,255,255,0.28)";b.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background="rgba(255,255,255,0.06)";b.style.borderColor="rgba(255,255,255,0.12)";b.style.transform="none";}}>
                Read Patient Guides
              </button>
            </div>
          </div>
        </section>

        {/* ── PARTNER / PROVIDER CTA ───────────────────────────────────────── */}
        <section style={{ background:`linear-gradient(160deg, #eaf8fc 0%, #f0f9ff 40%, #e8f4fb 100%)`, borderTop:`1px solid ${C.borderLt}`, padding: isMobile ? "72px 20px" : "100px 48px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:`linear-gradient(90deg, ${brandCyan}, ${brandBlue})` }} />
          <div style={{ maxWidth:680, margin:"0 auto", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, color:brandBlue, fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:16, background:"rgba(18,117,173,0.07)", border:"1px solid rgba(18,117,173,0.15)", padding:"5px 14px", borderRadius:100 }}>
              For Hospitals &amp; Clinics
            </div>
            <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize: isMobile ? 26 : "clamp(2rem, 3.5vw, 2.8rem)", color:navy, lineHeight:1.1, letterSpacing:"-0.03em", marginBottom:16 }}>
              Reach international patients who need <em style={{ fontStyle:"italic", color:brandBlue }}>you</em>.
            </h2>
            <p style={{ color:C.textSm, fontSize: isMobile ? 14 : 16, lineHeight:1.75, maxWidth:520, marginBottom:36 }}>
              Join the network of 1,669+ certified facilities already listed on hospital.com Global Health Services — get discovered by patients across 80+ countries actively seeking your expertise.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
              <button onClick={() => router.push("/list-your-facility")}
                style={{ background:`linear-gradient(135deg, ${brandBlue}, #0b5e8c)`, color:"white", padding:"15px 30px", borderRadius:10, fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:15, border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8, transition:"all .2s" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                List Your Facility
              </button>
              <button style={{ color:brandBlue, padding:"15px 26px", borderRadius:10, fontFamily:"Outfit, sans-serif", fontWeight:600, fontSize:15, border:`1.5px solid ${brandBlue}`, background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", gap:8, transition:"all .2s" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=brandBlue;(e.currentTarget as HTMLButtonElement).style.color="white";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="transparent";(e.currentTarget as HTMLButtonElement).style.color=brandBlue;}}>
                View Partnership Details
              </button>
            </div>
            <p style={{ marginTop:24, fontSize:12, color:C.textSm, maxWidth:480, lineHeight:1.55 }}>
              Listing is subject to accreditation review. hospital.com reserves the right to decline or remove facilities that do not meet our verified certification standards.
            </p>
          </div>
        </section>

        {/* ── LEGAL DISCLAIMER ─────────────────────────────────────────────── */}
        <div style={{ background:"#f8fbfd", borderTop:`1px solid ${C.borderLt}`, padding: isMobile ? "18px 20px" : "18px 48px", fontSize:12, color:C.textSm, lineHeight:1.65, textAlign:"center" }}>
          <p style={{ maxWidth:1100, margin:"0 auto" }}>
            <strong>Disclaimer:</strong> hospital.com is an information and referral platform, not a medical provider. Price estimates are indicative and subject to individual assessment. All payments are made directly between patients and providers — hospital.com does not hold or process funds. Medical travel carries inherent risks; we strongly recommend comprehensive travel and medical insurance.
          </p>
        </div>

        <Footer />
      </div>

      {facilitatorModal && (
        <FacilitatorModal
          onClose={() => { setFacilitatorModal(false); setSelectedClinic(null); }}
          clinic={selectedClinic ?? undefined}
        />
      )}
    </>
  );
}
