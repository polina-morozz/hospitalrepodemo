import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import C from "@/lib/tokens";
import PROVIDERS from "@/lib/data/providers";
import type { Provider } from "@/lib/data/providers";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { useApp } from "@/lib/context/AppContext";
import Footer from "@/components/layout/Footer";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const DEMO_INSURANCE_TOP = [
  { name:"Aetna", color:"#7B2D8E", plans:["Aetna Choice POS II","Aetna HMO","Aetna PPO","Aetna Medicare Advantage","Aetna Open Access"] },
  { name:"BlueCross BlueShield", color:"#0073CF", plans:["BCBS PPO","BCBS HMO","BCBS Blue Card","BCBS Federal","BCBS Medicare Supplement"] },
  { name:"Cigna", color:"#E87722", plans:["Cigna PPO","Cigna HMO","Cigna Open Access Plus","Cigna EPO","Cigna Medicare Advantage"] },
  { name:"UnitedHealthcare", color:"#002677", plans:["UHC Choice Plus","UHC Navigate","UHC Options PPO","UHC Medicare Advantage","UHC Dual Complete"] },
  { name:"Medicare", color:"#00548E", plans:["Medicare Part A","Medicare Part B","Medicare Advantage","Medicare Supplement (Medigap)"] },
  { name:"Humana", color:"#39B54A", plans:["Humana PPO","Humana HMO","Humana Gold Plus","Humana Medicare Advantage","Humana Dental"] },
];

const DEMO_INSURANCE_MORE = [
  { name:"Kaiser Permanente", color:C.teal, plans:["Kaiser HMO","Kaiser Medicare"] },
  { name:"Medicaid", color:C.blue, plans:["Medicaid Managed Care","Medicaid Fee-for-Service"] },
  { name:"Anthem", color:"#1A6FB5", plans:["Anthem PPO","Anthem HMO","Anthem Blue Access"] },
  { name:"Molina Healthcare", color:"#78C440", plans:["Molina Marketplace","Molina Medicaid"] },
  { name:"Oscar Health", color:"#F05A7E", plans:["Oscar PPO","Oscar EPO"] },
  { name:"Tricare", color:"#003087", plans:["Tricare Prime","Tricare Select","Tricare for Life"] },
];

const DEMO_EXPERTISE = ["Lower Back Pain","Joint Stiffness","Sports Injury","Neck Pain","Headache","Knee Pain","Shoulder Pain","Sciatica"];

const DEMO_REVIEWS = [
  { id:1, author:"Emily R.", date:"Feb 28, 2026", rating:5, text:"Absolutely wonderful experience. The doctor was thorough, listened carefully, and explained everything clearly. Highly recommend to anyone looking for quality care.", waitRating:5, bedsideRating:5 },
  { id:2, author:"Michael T.", date:"Feb 14, 2026", rating:4, text:"Great doctor, very knowledgeable. The only downside was the wait time — about 25 minutes past my scheduled appointment. But the care itself was excellent.", waitRating:3, bedsideRating:5 },
  { id:3, author:"Sarah K.", date:"Jan 30, 2026", rating:5, text:"I've been coming here for over a year and it's consistently great. The staff is friendly, and the doctor remembers your history.", waitRating:4, bedsideRating:5 },
  { id:4, author:"James L.", date:"Jan 10, 2026", rating:4, text:"Very professional and knowledgeable. Would appreciate more flexible scheduling options though.", waitRating:4, bedsideRating:4 },
  { id:5, author:"Anna P.", date:"Dec 22, 2025", rating:5, text:"Best healthcare experience I've had in years. The doctor took time to understand my concerns and created a personalized treatment plan.", waitRating:5, bedsideRating:5 },
];

const ALL_TIMES = ["8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];
const BOOKED   = ["9:00","10:30","14:00"];

const totalPlans = DEMO_INSURANCE_TOP.reduce((a, i) => a + i.plans.length, 0) + DEMO_INSURANCE_MORE.reduce((a, i) => a + i.plans.length, 0);

const FLAT_PLANS: string[] = [
  "Aetna","Blue Cross Blue Shield","Cigna","UnitedHealthcare","Humana","Anthem",
  "Kaiser Permanente","Oxford Health Plans","Medicare","Medicare Advantage",
  "Medicaid (select states)","Aetna HMO","Aetna PPO","BCBS PPO","BCBS HMO",
  "Cigna PPO","Cigna HMO","UHC Choice Plus","UHC Navigate","Humana Gold Plus",
  "Humana Medicare Advantage","Tricare Prime","Tricare Select","Oscar Health",
  "Molina Healthcare","Anthem PPO","Anthem HMO","Allianz Care","Bupa Global",
  "Aetna International","Cigna Global","Medicare Supplement (Medigap)",
];

const WEEK_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function parseHoursForDay(hoursStr: string, dayName: string): string {
  const h = hoursStr.toLowerCase();
  const day3 = dayName.slice(0,3).toLowerCase();
  const isWeekend = dayName === "Saturday" || dayName === "Sunday";
  const isWeekday = !isWeekend;
  const timeRange = hoursStr.replace(/^[\w–,\s]+\s/, "").replace(/^(daily|mon[–-]fri|mon[–-]sat|tue[–-]sat|mwf|mwf)\s+/i, "");

  if (h.includes("daily")) return timeRange;
  if (h.includes("mon") && h.includes("sat")) {
    if (dayName === "Sunday") return "Closed";
    return timeRange;
  }
  if ((h.includes("mon") && h.includes("fri")) || h.startsWith("mwf")) {
    if (!isWeekday) return "Closed";
    if (h.startsWith("mwf") && ["tuesday","thursday"].includes(dayName.toLowerCase())) return "Closed";
    return timeRange;
  }
  if (h.includes("tue") && h.includes("sat")) {
    if (dayName === "Monday" || dayName === "Sunday") return "Closed";
    return timeRange;
  }
  if (day3 === "mon" && h.includes("thu")) {
    if (["friday","saturday","sunday"].includes(dayName.toLowerCase())) return "Closed";
    return timeRange;
  }
  return timeRange || "By appointment";
}

// ─── PROVIDER DETAIL PAGE ─────────────────────────────────────────────────────
export default function ProviderDetailPage() {
  const router   = useRouter();
  const isMobile = useIsMobile();
  const { bookmarks, toggleBookmark, isLoggedIn, setBookings } = useApp();

  const rawId   = router.query.id;
  const numId   = typeof rawId === "string" ? parseInt(rawId, 10) : NaN;
  const provider: Provider | undefined = PROVIDERS.find(p => p.id === numId);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledProv, setScrolledProv] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  const [form, setForm] = useState({ name:"", email:"", phone:"", reason:"", time:"" });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [done, setDone] = useState(false);
  const [insSearch, setInsSearch] = useState("");

  const [reviews, setReviews] = useState(DEMO_REVIEWS);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [commentDone, setCommentDone] = useState(false);
  const [reviewSort, setReviewSort] = useState("newest");

  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [imgErr, setImgErr] = useState(false);

  const avgRating  = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
  const avgWait    = (reviews.reduce((a, r) => a + r.waitRating, 0) / reviews.length).toFixed(1);
  const avgBedside = (reviews.reduce((a, r) => a + r.bedsideRating, 0) / reviews.length).toFixed(1);

  const today = new Date();
  const days  = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return d;
  }).filter(d => d.getDay() !== 0 && d.getDay() !== 6);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolledProv(el.scrollTop > 100);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  }

  function handleBook() {
    if (!form.name || !form.email || !form.phone) return;
    setBookings((b: unknown[]) => [...b, {
      ...form,
      providerName: provider!.name,
      providerId:   provider!.id,
      providerObj:  provider,
      id:     Date.now(),
      status: provider!.hasCalendar ? "Confirmed" : "Pending",
      date:   selectedDate?.toDateString() || "TBD",
      type:   provider!.hasCalendar ? "booking" : "request",
    }]);
    setDone(true);
  }

  function handleComment() {
    if (!commentText.trim() || commentRating === 0) return;
    const newReview = {
      id:            reviews.length + 1,
      author:        "You",
      date:          new Date().toLocaleDateString("en", { month:"short", day:"numeric", year:"numeric" }),
      rating:        commentRating,
      text:          commentText,
      waitRating:    commentRating,
      bedsideRating: commentRating,
    };
    setReviews(r => [newReview, ...r]);
    setCommentText("");
    setCommentRating(0);
    setCommentDone(true);
    setTimeout(() => setCommentDone(false), 3000);
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === "newest")  return b.id - a.id;
    if (reviewSort === "highest") return b.rating - a.rating;
    if (reviewSort === "lowest")  return a.rating - b.rating;
    return 0;
  });

  if (!provider && !router.query.id) return null;

  if (!provider) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:C.offWhite, padding:24 }}>
        <Head><title>Provider Not Found | Hospital.com</title></Head>
        <div style={{ textAlign:"center", maxWidth:420 }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🏥</div>
          <h1 style={{ fontWeight:800, fontSize:24, color:C.text, marginBottom:10 }}>Provider Not Found</h1>
          <p style={{ color:C.textSm, fontSize:15, marginBottom:28, lineHeight:1.6 }}>
            We couldn&apos;t find a provider with that ID. They may have moved or been removed.
          </p>
          <button onClick={() => router.back()} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:12, padding:"12px 28px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const isDoctor = provider.type === "doctor";
  const parentClinic = provider.parentClinicId ? PROVIDERS.find(p => p.id === provider.parentClinicId) : null;
  const staffDoctors = !isDoctor ? PROVIDERS.filter(p => p.parentClinicId === provider.id) : [];

  const PROFILE_SECTIONS = [
    { id:"about",      label:"About" },
    { id:"gallery",    label:"Gallery" },
    ...(isDoctor
      ? [{ id:"education", label:"Education" }, { id:"specialties", label:"Specialties" }]
      : [{ id:"location", label:"Location" }, { id:"staff", label:"Physicians" }]
    ),
    { id:"features",   label:"Features" },
    { id:"awards",     label:"Awards" },
    { id:"languages",  label:"Languages" },
    { id:"insurances", label:"Insurance" },
    { id:"reviews",    label:"Reviews" },
    { id:"faqs",       label:"FAQs" },
  ];

  const profileStats = isDoctor
    ? [
        { num: `${provider.reviews}+`, label: "Patient reviews" },
        { num: `${provider.rating}`,   label: "Overall rating"  },
        { num: "10+",                  label: "Years experience" },
        { num: `${totalPlans}+`,       label: "Insurance plans"  },
      ]
    : [
        { num: `${provider.reviews}+`, label: "Patient reviews"  },
        { num: `${provider.rating}`,   label: "Overall rating"   },
        { num: `${provider.tags.length}`, label: "Specialties"   },
        { num: `${totalPlans}+`,       label: "Insurance plans"  },
      ];

  const DEMO_SERVICES = provider.tags?.length ? provider.tags : ["General Consultation","Follow-up Visit","Preventive Care"];

  const DEMO_DOCTOR_FEATURES = ["Telehealth Available","Accepting New Patients","Online Patient Portal","Electronic Health Records","Same-day Appointments","Multilingual Staff","Board Certified","Secure Messaging","Prescription Refills Online"];
  const DEMO_CLINIC_FEATURES = ["Telehealth Available","Accepting New Patients","Online Patient Portal","Electronic Health Records","Secure Messaging","Same-day Appointments","Prescription Refills Online","Wheelchair Accessible","Free Parking"];
  const featuresList = [
    ...(provider.amenities || []),
    ...(isDoctor ? DEMO_DOCTOR_FEATURES : DEMO_CLINIC_FEATURES).filter(f => !(provider.amenities || []).includes(f)),
  ].slice(0, 9);

  const DEMO_AWARDS = isDoctor
    ? [
        { name:"Top Doctor", org:"City Health Magazine · 2023 & 2024" },
        { name:"Patient's Choice Award", org:"Healthcare Quality Council · 2024" },
        { name:`Board Certification — ${provider.specialty}`, org:`American Board of ${provider.specialty}` },
        { name:"Hospital.com Verified Partner", org:"Hospital.com Partner Program · Active" },
      ]
    : [
        { name:"Top Clinic Award", org:"City Health Magazine · 2023 & 2024" },
        { name:"Excellence in Patient Experience", org:"Healthcare Quality Council · 2023" },
        { name:"Accreditation Gold Seal", org:"Accreditation Commission · Renewed 2023" },
        { name:"Hospital.com Verified Partner", org:"Hospital.com Partner Program · Active" },
      ];
  const DEMO_FAQS = [
    { q:`Is ${provider.name} accepting new patients?`, a:"Yes, this provider is currently accepting new patients. You can book an appointment directly through their profile." },
    { q:`What insurance does ${provider.name} accept?`, a:`${provider.name} accepts a wide range of insurance plans including Aetna, BlueCross BlueShield, Cigna, UnitedHealthcare, and more.` },
    { q:`What are the office hours?`, a:`Office hours are ${provider.hours}. We recommend booking in advance for the best availability.` },
    { q:"How do I prepare for my first visit?", a:"Please bring your insurance card, a valid photo ID, and any relevant medical records. Arrive 10 minutes early to complete paperwork." },
  ];

  const isBookmarked = bookmarks.includes(provider.id);

  const todayName = today.toLocaleDateString("en", { weekday: "long" });

  // ── Card background color for hero image ──
  const cardBg = "linear-gradient(135deg, #c8e6f5 0%, #a8d8ee 100%)";

  return (
    <>
      <Head><title>{provider.name} | Hospital.com</title></Head>

      <div ref={scrollRef} style={{ maxHeight:"calc(100vh - 58px)", overflowY:"auto", fontFamily:"inherit" }}>

        {/* ── STICKY SECTION NAV ──────────────────────────────────────────── */}
        {scrolledProv && (
          <div style={{ position:"sticky", top:0, zIndex:100, background:C.white, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", overflowX:"auto" }}>
            <div style={{ display:"flex", alignItems:"center", flex:1, padding: isMobile ? "0 12px" : "0 48px" }}>
              {PROFILE_SECTIONS.map(s => (
                <button key={s.id} onClick={() => scrollToSection(s.id)}
                  style={{ padding:"14px 18px", background:"none", border:"none", borderBottom:`2px solid ${activeSection===s.id?C.teal:"transparent"}`, color:activeSection===s.id?C.blue:C.textSm, fontWeight:activeSection===s.id?700:500, fontSize:13, cursor:"pointer", fontFamily:"Outfit, sans-serif", whiteSpace:"nowrap", transition:"all .15s" }}>
                  {s.label}
                </button>
              ))}
            </div>
            {!isMobile && (
              <div style={{ display:"flex", alignItems:"center", gap:10, paddingRight:48, flexShrink:0 }}>
                <button onClick={() => { if (!isLoggedIn) { router.push("/signup"); return; } toggleBookmark(provider.id); }}
                  style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, fontWeight:600, color:isBookmarked?C.blue:C.textSm, background:"transparent", border:`1.5px solid ${isBookmarked?C.teal:C.border}`, borderRadius:8, padding:"7px 14px", cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked?C.teal:"none"} stroke={isBookmarked?C.teal:C.textSm} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  {isBookmarked ? "Saved" : "Save"}
                </button>
                {provider.contracted && (
                  <button onClick={() => scrollToSection("about")}
                    style={{ background:C.teal, color:"white", border:"none", borderRadius:8, padding:"8px 16px", fontFamily:"Outfit, sans-serif", fontSize:13, fontWeight:700, cursor:"pointer", transition:"opacity .2s" }}
                    onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.opacity="0.88"}
                    onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.opacity="1"}>
                    Request Booking
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── BREADCRUMB ──────────────────────────────────────────────────── */}
        <div style={{ maxWidth:1200, margin:"0 auto", padding: isMobile ? "20px 16px 0" : "28px 48px 0", display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.textSm, flexWrap:"wrap" }}>
          <button onClick={() => router.back()} style={{ background:"none", border:"none", cursor:"pointer", color:C.blue, fontSize:13, fontWeight:600, fontFamily:"inherit", padding:0 }}>
            Find Local Care
          </button>
          <span style={{ color:C.borderLt }}>›</span>
          <span style={{ color:C.textSm }}>{isDoctor && !parentClinic ? "Doctors & Specialists" : "Clinics & Facilities"}</span>
          {parentClinic && (
            <>
              <span style={{ color:C.borderLt }}>›</span>
              <button onClick={() => router.push(`/providers/${parentClinic.id}`)} style={{ background:"none", border:"none", cursor:"pointer", color:C.blue, fontSize:13, fontWeight:600, fontFamily:"inherit", padding:0 }}>
                {parentClinic.name}
              </button>
            </>
          )}
          <span style={{ color:C.borderLt }}>›</span>
          <span style={{ color:C.textSm }}>{provider.specialty}</span>
          <span style={{ color:C.borderLt }}>›</span>
          <span style={{ color:C.text, fontWeight:600 }}>{provider.name}</span>
        </div>

        {/* ── HERO SECTION ────────────────────────────────────────────────── */}
        <div style={{ position:"relative", padding: isMobile ? "20px 0 0" : "28px 0 0" }}>
          {/* Radial gradient bg */}
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 80% at -5% 60%, rgba(70,196,217,0.14) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 105% 20%, rgba(16,117,173,0.10) 0%, transparent 55%)", pointerEvents:"none" }}/>

          <div style={{ maxWidth:1200, margin:"0 auto", padding: isMobile ? "0 16px" : "0 48px", position:"relative" }}>

            {/* Hero card */}
            <div className="fade-up" style={{ background:C.white, borderRadius:20, border:`1px solid ${C.borderLt}`, boxShadow:"0 4px 24px rgba(16,117,173,0.09)", overflow:"hidden" }}>

              {/* ── HOSPITAL.COM PARTNER TOP BAR ── */}
              {provider.contracted && (
                <div style={{ background:"linear-gradient(90deg, #32cce0 0%, #13527a 100%)", padding: isMobile ? "8px 20px" : "9px 40px", display:"flex", alignItems:"center", justifyContent:"center", gap:10, borderRadius:"20px 20px 0 0", overflow:"hidden" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:3, flexShrink:0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#f0c840" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="#f0c840" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#f0c840" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <span style={{ fontFamily:"Outfit, sans-serif", fontSize:12.5, fontWeight:800, color:"white", letterSpacing:"0.12em", textTransform:"uppercase" as const, whiteSpace:"nowrap" }}>Hospital.com Partner</span>
                </div>
              )}

              {/* ── HERO TOP ── */}
              <div style={{ padding: isMobile ? "24px 20px 20px" : "36px 40px", display:"flex", gap: isMobile ? 18 : 32, alignItems:"flex-start", borderBottom:`1px solid ${C.borderLt}`, position:"relative", flexWrap: isMobile ? "wrap" : "nowrap" }}>

                {/* Bookmark — top right */}
                <button onClick={() => { if (!isLoggedIn) { router.push("/signup"); return; } toggleBookmark(provider.id); }}
                  title={isLoggedIn ? (isBookmarked ? "Remove bookmark" : "Bookmark") : "Sign up to bookmark"}
                  style={{ position:"absolute", top:18, right:20, display:"flex", alignItems:"center", gap:7, fontSize:13, fontWeight:600, color:isBookmarked?C.blue:C.textSm, background:"transparent", border:`1.5px solid ${isBookmarked?C.teal:C.border}`, borderRadius:10, padding:"8px 15px", cursor:"pointer", transition:"all .2s", fontFamily:"inherit" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked?C.teal:"none"} stroke={isBookmarked?C.teal:C.textSm} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  {!isMobile && (isBookmarked ? "Saved" : "Save")}
                </button>

                {/* Photo */}
                <div style={{ position:"relative", flexShrink:0 }}>
                  <div style={{ width: isMobile ? 90 : 136, height: isMobile ? 90 : 136, borderRadius:20, background:cardBg, border:`3px solid ${C.border}`, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {provider.photo && !imgErr
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={provider.photo} alt={provider.name} onError={() => setImgErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                      : <span style={{ fontWeight:800, fontSize: isMobile ? 24 : 36, color:C.teal }}>{provider.image}</span>
                    }
                  </div>
                  {provider.contracted && (
                    <div style={{ position:"absolute", bottom:-8, right:-8, background:C.teal, color:"#fff", borderRadius:"50%", width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", border:"3px solid white" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                    </div>
                  )}
                </div>

                {/* Identity */}
                <div style={{ flex:1, minWidth:0, paddingTop: isMobile ? 0 : 6, paddingRight: isMobile ? 32 : (isDoctor ? 0 : 0) }}>

                  {/* Badge: specialty or "Clinic" */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:12 }}>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(70,196,217,0.10)", border:"1px solid rgba(70,196,217,0.30)", color:C.blue, fontSize:11.5, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" as const, padding:"5px 13px", borderRadius:100 }}>
                      {isDoctor ? provider.specialty : "Clinic"}
                    </div>
                    {parentClinic && (
                      <button onClick={() => router.push(`/providers/${parentClinic.id}`)}
                        style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(18,117,173,0.07)", border:"1px solid rgba(18,117,173,0.22)", color:C.blue, fontSize:11.5, fontWeight:600, padding:"5px 13px", borderRadius:100, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background="rgba(18,117,173,0.14)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="rgba(18,117,173,0.07)"; }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
                        Part of {parentClinic.name}
                      </button>
                    )}
                  </div>

                  {/* Name */}
                  <h1 style={{ fontFamily:"Outfit, sans-serif", fontSize: isMobile ? "1.5rem" : "2.2rem", fontWeight:800, color:"#071e34", letterSpacing:"-0.02em", lineHeight:1.1, marginBottom:6 }}>
                    {provider.name}
                  </h1>

                  {/* Credentials / tagline */}
                  <div style={{ fontSize:14.5, color:C.textSm, fontWeight:500, marginBottom:14 }}>
                    {isDoctor
                      ? `${provider.specialty} Specialist · Board Certified`
                      : `${provider.specialty} · Quality Care Since 2018`
                    }
                  </div>

                  {/* Meta row */}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:20, marginBottom:14 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:14, color:C.textSm, fontWeight:500 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                      <strong style={{ color:C.text, fontWeight:600 }}>{provider.address}, {provider.city}</strong>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:14, color:C.textSm, fontWeight:500 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <strong style={{ color:C.text, fontWeight:600 }}>{provider.hours}</strong>
                    </div>
                  </div>

                  {/* Rating row */}
                  <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:14 }}>
                    <div style={{ display:"flex", gap:2 }}>
                      {[1,2,3,4,5].map(s => <span key={s} style={{ color:s<=Math.round(provider.rating)?C.amber:C.grayMd, fontSize:17 }}>★</span>)}
                    </div>
                    <span style={{ fontFamily:"Outfit, sans-serif", fontSize:22, fontWeight:800, color:"#071e34", lineHeight:1 }}>{provider.rating}</span>
                    <span style={{ fontSize:14, color:C.textSm }}>({provider.reviews} reviews)</span>
                  </div>

                  {/* Languages */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:10.5, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" as const, color:C.textSm }}>Languages</span>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:13, fontWeight:600, color:C.text, background:C.gray, border:`1px solid ${C.borderLt}`, padding:"4px 12px", borderRadius:100 }}>🇺🇸 English</span>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:13, fontWeight:600, color:C.text, background:C.gray, border:`1px solid ${C.borderLt}`, padding:"4px 12px", borderRadius:100 }}>🌐 Spanish</span>
                  </div>

                  {/* Mobile action buttons */}
                  {isMobile && (
                    <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:18 }}>
                      {provider.contracted && (
                        <button onClick={() => scrollToSection("insurances")}
                          style={{ background:C.teal, color:"#fff", border:"none", borderRadius:12, padding:"13px 22px", fontFamily:"Outfit, sans-serif", fontSize:14.5, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          Book Appointment
                        </button>
                      )}
                      {provider.contracted && (
                        <button style={{ background:"transparent", color:C.blue, border:`1.5px solid ${C.blue}`, borderRadius:12, padding:"11px 22px", fontFamily:"Outfit, sans-serif", fontSize:14, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                          Schedule Consultation
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Desktop action column */}
                {!isMobile && (
                  <div style={{ display:"flex", flexDirection:"column", gap:10, flexShrink:0, minWidth:220, paddingTop:36 }}>
                    {provider.contracted && (
                      <button onClick={() => scrollToSection("insurances")}
                        style={{ background:C.teal, color:"#fff", border:"none", borderRadius:12, padding:"14px 22px", fontFamily:"Outfit, sans-serif", fontSize:15, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"opacity .2s, transform .15s" }}
                        onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.opacity="0.88";(e.currentTarget as HTMLButtonElement).style.transform="translateY(-1px)";}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.opacity="1";(e.currentTarget as HTMLButtonElement).style.transform="none";}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        Book Appointment
                      </button>
                    )}
                    {provider.contracted && (
                      <button style={{ background:"transparent", color:C.blue, border:`1.5px solid ${C.blue}`, borderRadius:12, padding:"12px 22px", fontFamily:"Outfit, sans-serif", fontSize:14, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all .2s" }}
                        onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=C.blue;(e.currentTarget as HTMLButtonElement).style.color="#fff";}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="transparent";(e.currentTarget as HTMLButtonElement).style.color=C.blue;}}>
                        Schedule Consultation
                      </button>
                    )}
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:12.5, fontWeight:600, borderRadius:8, padding:"7px 12px", color:C.blue, background:"rgba(16,117,173,0.06)", border:"1px solid rgba(16,117,173,0.15)" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                      Telehealth Available
                    </div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:12.5, fontWeight:600, borderRadius:8, padding:"7px 12px", color:C.green, background:C.greenLt, border:"1px solid rgba(34,197,94,0.2)" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
                      Accepting New Patients
                    </div>
                  </div>
                )}
              </div>

              {/* ── STATS BAR ── */}
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", borderTop:`1px solid ${C.borderLt}` }}>
                {profileStats.map((stat, i) => {
                  const isLastRow = isMobile ? i >= 2 : false;
                  const isLastCol = isMobile ? i % 2 === 1 : i === 3;
                  return (
                    <div key={i} style={{ padding:"20px 24px", textAlign:"center", borderRight:isLastCol ? "none" : `1px solid ${C.borderLt}`, borderBottom:isLastRow ? "none" : (isMobile && i < 2 ? `1px solid ${C.borderLt}` : "none") }}>
                      <div style={{ fontFamily:"Outfit, sans-serif", fontSize: isMobile ? 20 : 24, fontWeight:800, color:C.teal, lineHeight:1 }}>{stat.num}</div>
                      <div style={{ fontSize:12, color:C.textSm, fontWeight:500, marginTop:4 }}>{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ── MAIN BODY ────────────────────────────────────────────────────── */}
        <div style={{ maxWidth:1200, margin:"0 auto", padding: isMobile ? "20px 16px 80px" : "24px 48px 80px", display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap:24, alignItems:"start" }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* ── ABOUT ── */}
            <div id="about" className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M3 21c0-4.4 4-8 9-8s9 3.6 9 8"/></svg>
                </span>
                About {provider.name}
              </h2>
              <p style={{ fontSize:15, color:C.text, lineHeight:1.78, marginBottom:14 }}>
                {provider.name} is a highly rated {provider.specialty.toLowerCase()} {isDoctor ? "specialist" : "facility"} based in {provider.city}. With {provider.reviews}+ verified patient reviews and a {provider.rating}-star overall rating, {isDoctor ? "they are" : "it is"} known for exceptional patient care, thorough consultations, and a welcoming environment.
              </p>
              <p style={{ fontSize:15, color:C.text, lineHeight:1.78, marginBottom:20 }}>
                {isDoctor
                  ? `Patients consistently praise their clear communication, genuine attentiveness, and personalized treatment plans. ${provider.name} believes every patient deserves time, respect, and evidence-based care tailored to their unique needs.`
                  : `The team at ${provider.name} is dedicated to providing comprehensive, compassionate care to every patient. With state-of-the-art facilities and a patient-first philosophy, they make healthcare accessible and stress-free.`
                }
              </p>
              {/* Care philosophy */}
              <div style={{ background:C.tealBg, borderLeft:`3px solid ${C.teal}`, borderRadius:"0 10px 10px 0", padding:"16px 20px" }}>
                <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase" as const, color:C.blue, marginBottom:6 }}>
                  {isDoctor ? "Care Philosophy" : "Our Mission"}
                </div>
                <p style={{ fontSize:14, color:C.text, lineHeight:1.68, fontStyle:"italic", margin:0 }}>
                  {isDoctor
                    ? `"Every patient deserves to be heard, understood, and cared for as an individual. Medicine is not just science — it's a relationship built on trust."`
                    : `"We believe quality healthcare should be accessible, transparent, and built around you. Our team is here every step of the way."`
                  }
                </p>
              </div>
            </div>

            {/* ── QUICK INFO ── */}
            <div className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>
                </span>
                Quick Info
              </h2>
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:12 }}>
                {[
                  { label:"Practice",       value: provider.name },
                  { label:isDoctor?"Specialty":"Type", value: provider.specialty },
                  { label:"Location",       value: `${provider.address}, ${provider.city}` },
                  { label:"Hours",          value: provider.hours },
                  { label:"Phone",          value: provider.phone },
                  { label:"Status",         value: "Accepting New Patients", green: true },
                  ...(isDoctor ? [{ label:"Languages", value:"English, Spanish" }] : [{ label:"Wheelchair Access", value:(provider.amenities||[]).includes("Wheelchair Accessible") ? "Yes" : "N/A" }]),
                  { label:"Insurance",      value:`${totalPlans}+ plans accepted` },
                ].map(item => (
                  <div key={item.label} style={{ background:C.gray, border:`1px solid ${C.borderLt}`, borderRadius:10, padding:"14px 16px" }}>
                    <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase" as const, color:C.textSm, marginBottom:5 }}>{item.label}</div>
                    <div style={{ fontSize:14.5, fontWeight:600, color:(item as { green?: boolean }).green ? C.green : C.text }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── DOCTOR: EDUCATION ── */}
            {isDoctor && (
              <div id="education" className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
                <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  </span>
                  Education &amp; Background
                </h2>
                <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:14, marginBottom:24 }}>
                  {[
                    { label:"Medical School",  value:"Johns Hopkins School of Medicine" },
                    { label:"Residency",       value:`${provider.specialty} — Massachusetts General Hospital` },
                    { label:"Fellowship",      value:`Advanced ${provider.specialty} — Mayo Clinic` },
                    { label:"Board Certified", value:`American Board of ${provider.specialty}` },
                  ].map(item => (
                    <div key={item.label} style={{ background:C.gray, borderRadius:10, padding:"14px 16px", border:`1px solid ${C.borderLt}` }}>
                      <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase" as const, color:C.textSm, marginBottom:5 }}>{item.label}</div>
                      <div style={{ fontSize:14.5, fontWeight:600, color:C.text }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <h3 style={{ fontFamily:"Outfit, sans-serif", fontSize:14, fontWeight:700, color:"#071e34", marginBottom:12 }}>Certifications &amp; Awards</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {[
                    `Board Certification — American Board of ${provider.specialty}`,
                    "Patient's Choice Award — 2024",
                    "Top Doctor — City Health Magazine 2023 & 2024",
                    "Excellence in Patient Care Award",
                  ].map(cert => (
                    <div key={cert} style={{ display:"flex", alignItems:"center", gap:10, fontSize:14, color:C.textMd }}>
                      <div style={{ width:20, height:20, borderRadius:6, background:C.tealBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                      </div>
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── DOCTOR: SPECIALTIES & CONDITIONS ── */}
            {isDoctor && (
              <div id="specialties" className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
                <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M12 2C8 2 5 5 5 8c0 3.5 3 6 4 8h6c1-2 4-4.5 4-8 0-3-3-6-7-6z"/><path d="M9 17v2a3 3 0 0 0 6 0v-2"/></svg>
                  </span>
                  Specialties &amp; Conditions Treated
                </h2>
                <h3 style={{ fontFamily:"Outfit, sans-serif", fontSize:14, fontWeight:700, color:"#071e34", marginBottom:12 }}>Areas of Expertise</h3>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
                  {provider.tags.map(t => (
                    <span key={t} style={{ background:C.tealLt, color:C.teal, fontSize:13, fontWeight:600, padding:"6px 14px", borderRadius:100 }}>{t}</span>
                  ))}
                  {["Preventive Medicine","Health Screening","Chronic Disease Management"].map(t => (
                    <span key={t} style={{ background:C.tealLt, color:C.teal, fontSize:13, fontWeight:600, padding:"6px 14px", borderRadius:100 }}>{t}</span>
                  ))}
                </div>
                <h3 style={{ fontFamily:"Outfit, sans-serif", fontSize:14, fontWeight:700, color:"#071e34", marginBottom:12 }}>Conditions Treated</h3>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {DEMO_EXPERTISE.map(e => (
                    <span key={e} style={{ background:C.gray, color:C.textMd, fontSize:13, fontWeight:500, padding:"6px 14px", borderRadius:100, border:`1px solid ${C.borderLt}` }}>{e}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ── CLINIC: LOCATION ── */}
            {!isDoctor && (
              <div id="location" className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
                <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                  </span>
                  Office Location
                </h2>
                {/* Map placeholder */}
                <div style={{ background:C.gray, border:`2px dashed ${C.grayMd}`, borderRadius:14, height: isMobile ? 160 : 220, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, marginBottom:18 }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={C.grayMd} strokeWidth="1.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div style={{ fontWeight:700, fontSize:14, color:C.grayMd }}>Interactive Map</div>
                  <div style={{ fontSize:12, color:C.grayMd }}>Will be displayed here</div>
                </div>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" style={{ flexShrink:0, marginTop:2 }}><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{provider.address}</div>
                    <div style={{ fontSize:14, color:C.textSm, marginBottom:10 }}>{provider.city}</div>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.address + ", " + provider.city)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ color:C.teal, fontWeight:600, fontSize:13.5, textDecoration:"none" }}>
                      Get directions
                    </a>
                  </div>
                </div>
                {/* Amenities */}
                {(provider.amenities||[]).length > 0 && (
                  <div style={{ marginTop:18, paddingTop:18, borderTop:`1px solid ${C.borderLt}` }}>
                    <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" as const, color:C.textSm, marginBottom:12 }}>Amenities</div>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {provider.amenities.map(a => (
                        <span key={a} style={{ display:"flex", alignItems:"center", gap:5, background:C.tealLt, color:C.teal, fontSize:12.5, fontWeight:600, padding:"5px 12px", borderRadius:100 }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── GALLERY ── */}
            <div id="gallery" className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </span>
                Gallery
              </h2>
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr", gridTemplateRows: isMobile ? "auto" : "190px 150px", gap:10 }}>
                {/* Main photo */}
                <div style={{ gridColumn: isMobile ? "1 / 3" : "1 / 2", gridRow: isMobile ? undefined : "1 / 3", borderRadius:12, overflow:"hidden", background:"linear-gradient(135deg, #c8dff0, #9fc8e8)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:isMobile?150:0, position:"relative", cursor:"pointer" }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.2" style={{ opacity:0.4 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"9px 13px", fontFamily:"Outfit, sans-serif", fontSize:13, fontWeight:600, color:"#071e34", background:"rgba(255,255,255,0.88)", borderTop:"1px solid rgba(255,255,255,0.5)", backdropFilter:"blur(6px)" }}>
                    {isDoctor ? "Consultation Room" : "Reception & Waiting Area"}
                  </div>
                </div>
                {/* Video clip */}
                <div style={{ borderRadius:12, overflow:"hidden", background:"linear-gradient(135deg, #1a3a5c, #0f2740)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:120, position:"relative", cursor:"pointer" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="rgba(255,255,255,0.7)" stroke="none"/></svg>
                  <div style={{ position:"absolute", top:8, left:8, fontSize:9.5, fontWeight:700, letterSpacing:"0.08em", color:"white", background:"rgba(16,117,173,0.75)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:4, padding:"2px 6px" }}>▶ VIDEO</div>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"7px 10px", fontFamily:"Outfit, sans-serif", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.9)", background:"rgba(0,0,0,0.38)", borderTop:"1px solid rgba(255,255,255,0.1)" }}>
                    {isDoctor ? "Practice Tour · 1:48" : "Clinic Tour · 2:34"}
                  </div>
                </div>
                {/* Room photo */}
                <div style={{ borderRadius:12, overflow:"hidden", background:"linear-gradient(135deg, #d4eaf6, #bcdaf2)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:120, position:"relative", cursor:"pointer" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.2" style={{ opacity:0.4 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"7px 10px", fontFamily:"Outfit, sans-serif", fontSize:12, fontWeight:600, color:"#071e34", background:"rgba(255,255,255,0.88)", borderTop:"1px solid rgba(255,255,255,0.5)" }}>
                    {isDoctor ? "Exam Room" : "Treatment Suite"}
                  </div>
                </div>
                {/* Team photo */}
                <div style={{ borderRadius:12, overflow:"hidden", background:"linear-gradient(135deg, #e0f0f8, #c5e2f5)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:120, position:"relative", cursor:"pointer" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.2" style={{ opacity:0.4 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"7px 10px", fontFamily:"Outfit, sans-serif", fontSize:12, fontWeight:600, color:"#071e34", background:"rgba(255,255,255,0.88)", borderTop:"1px solid rgba(255,255,255,0.5)" }}>
                    {isDoctor ? "Meet the Team · 1:20" : "Our Staff · 2:05"}
                  </div>
                </div>
                {/* Lab photo */}
                <div style={{ borderRadius:12, overflow:"hidden", background:"linear-gradient(135deg, #cde8f7, #b0d8f0)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:120, position:"relative", cursor:"pointer" }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.2" style={{ opacity:0.4 }}><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"7px 10px", fontFamily:"Outfit, sans-serif", fontSize:12, fontWeight:600, color:"#071e34", background:"rgba(255,255,255,0.88)", borderTop:"1px solid rgba(255,255,255,0.5)" }}>
                    {isDoctor ? "Lab & Diagnostics" : "Imaging Suite"}
                  </div>
                </div>
              </div>
            </div>

            {/* ── FEATURES & AMENITIES ── */}
            <div id="features" className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </span>
                Features &amp; Amenities
              </h2>
              <p style={{ fontSize:14.5, color:C.textMd, lineHeight:1.78, marginBottom:20 }}>
                {isDoctor
                  ? `${provider.name}'s practice is designed to make every visit seamless and comfortable, with modern tools and a patient-first approach.`
                  : `${provider.name} is equipped with modern facilities to ensure a comfortable, efficient patient experience at every visit.`
                }
              </p>
              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap:10 }}>
                {featuresList.map(feature => (
                  <div key={feature} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"11px 14px", background:C.gray, borderRadius:9, border:`1px solid ${C.borderLt}` }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:C.greenLt, color:C.green, fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>✓</div>
                    <div style={{ fontSize:13.5, fontWeight:600, color:C.text, lineHeight:1.3 }}>{feature}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CLINIC: PHYSICIANS ON STAFF ── */}
            {!isDoctor && (
              <div id="staff" className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
                <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:16, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </span>
                  Physicians on Staff
                </h2>
                <p style={{ fontSize:14.5, color:C.textMd, lineHeight:1.78, marginBottom:18 }}>
                  All physicians are board-certified specialists with active hospital privileges. Individual profiles link to their Hospital.com pages.
                </p>
                <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:12 }}>
                  {staffDoctors.map(doc => (
                    <div key={doc.id} onClick={() => router.push(`/providers/${doc.id}`)}
                      style={{ display:"flex", alignItems:"center", gap:13, background:C.gray, border:`1px solid ${C.borderLt}`, borderRadius:11, padding:"13px 15px", cursor:"pointer", transition:"all .18s" }}
                      onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=C.teal;(e.currentTarget as HTMLDivElement).style.background=C.tealLt;}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=C.borderLt;(e.currentTarget as HTMLDivElement).style.background=C.gray;}}>
                      <div style={{ width:42, height:42, borderRadius:9, background:"linear-gradient(135deg, #c8e6f5, #a8d8ee)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                        {doc.photo
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={doc.photo} alt={doc.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                          : <span style={{ fontWeight:800, fontSize:13, color:C.teal }}>{doc.image}</span>
                        }
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:"#071e34" }}>{doc.name}</div>
                        <div style={{ fontSize:12.5, color:C.textSm, marginTop:2 }}>{doc.specialty}</div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.2" style={{ flexShrink:0, opacity:0.6 }}><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  ))}
                  {staffDoctors.length === 0 && (
                    <div style={{ gridColumn:"1/-1", padding:"20px", textAlign:"center", color:C.textSm, fontSize:13.5, background:C.gray, borderRadius:11, border:`1px solid ${C.borderLt}` }}>
                      No staff physicians listed yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── AWARDS & RECOGNITION ── */}
            <div id="awards" className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                </span>
                Awards &amp; Recognition
              </h2>
              <div style={{ display:"flex", flexDirection:"column" }}>
                {DEMO_AWARDS.map((award, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 0", borderBottom: i < DEMO_AWARDS.length - 1 ? `1px solid ${C.borderLt}` : "none" }}>
                    <div style={{ width:36, height:36, borderRadius:8, background:C.tealBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:C.teal }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize:14.5, fontWeight:600, color:C.text }}>{award.name}</div>
                      <div style={{ fontSize:12.5, color:C.textSm, marginTop:2 }}>{award.org}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── LANGUAGES SPOKEN ── */}
            <div id="languages" className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>
                </span>
                Languages Spoken
              </h2>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {["🇺🇸 English","🇪🇸 Spanish","🇫🇷 French","🌐 Mandarin"].map(lang => (
                  <span key={lang} style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:13.5, fontWeight:600, color:C.text, background:C.gray, border:`1px solid ${C.borderLt}`, padding:"7px 16px", borderRadius:100 }}>{lang}</span>
                ))}
              </div>
            </div>

            {/* ── INSURANCES ── */}
            <div id="insurances" className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </span>
                Insurance Accepted
              </h2>

              {/* Search bar */}
              <div style={{ display:"flex", alignItems:"center", gap:10, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 14px", background:C.gray, marginBottom:14, transition:"border-color .2s" }}
                onFocusCapture={e => (e.currentTarget as HTMLDivElement).style.borderColor=C.teal}
                onBlurCapture={e => (e.currentTarget as HTMLDivElement).style.borderColor=C.border}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.2" style={{ flexShrink:0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  value={insSearch}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setInsSearch(e.target.value)}
                  placeholder="Search your insurance plan…"
                  style={{ border:"none", background:"transparent", outline:"none", fontFamily:"inherit", fontSize:14, color:C.text, width:"100%" }}
                />
              </div>

              {/* Flat plan grid */}
              {(() => {
                const filtered = insSearch.trim()
                  ? FLAT_PLANS.filter(p => p.toLowerCase().includes(insSearch.toLowerCase()))
                  : FLAT_PLANS;
                const cols = isMobile ? 2 : 4;
                return filtered.length > 0 ? (
                  <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols}, 1fr)`, border:`1px solid ${C.borderLt}`, borderRadius:12, overflow:"hidden" }}>
                    {filtered.map((plan, i) => {
                      const isLastCol = (i + 1) % cols === 0;
                      const isLastRow = i >= filtered.length - (filtered.length % cols || cols);
                      return (
                        <div key={plan} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderBottom: isLastRow ? "none" : `1px solid ${C.borderLt}`, borderRight: isLastCol ? "none" : `1px solid ${C.borderLt}`, transition:"background .15s", cursor:"default" }}
                          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background=C.tealBg}
                          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background="transparent"}>
                          <div style={{ width:18, height:18, borderRadius:"50%", background:C.greenLt, color:C.green, fontSize:9.5, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>✓</div>
                          <span style={{ fontSize:13, fontWeight:500, color:C.text }}>{plan}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding:"24px", textAlign:"center", color:C.textSm, fontSize:13.5, background:C.gray, borderRadius:12, border:`1px solid ${C.borderLt}` }}>
                    No plans matched &ldquo;{insSearch}&rdquo;
                  </div>
                );
              })()}

              {/* Don't see your plan */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:12, fontSize:13, color:C.textSm, background:C.gray, border:`1px solid ${C.borderLt}`, borderRadius:10, padding:"12px 16px" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" style={{ flexShrink:0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Don&apos;t see your plan? Contact {isDoctor ? "the provider" : "the clinic"} directly to confirm coverage — they accept many additional plans not listed here.
              </div>
            </div>

            {/* ── REVIEWS ── */}
            <div id="reviews" className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                </span>
                Patient Reviews
              </h2>

              {/* Rating summary */}
              <div style={{ display:"flex", gap: isMobile ? 20 : 40, marginBottom:24, flexWrap:"wrap", padding:"20px 24px", background:C.gray, borderRadius:12, alignItems:"center" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"Outfit, sans-serif", fontSize:40, fontWeight:800, color:C.teal, lineHeight:1 }}>{avgRating}</div>
                  <div style={{ display:"flex", gap:2, justifyContent:"center", margin:"6px 0 4px" }}>
                    {[1,2,3,4,5].map(s => <span key={s} style={{ color:s<=Math.round(parseFloat(avgRating))?C.amber:C.grayMd, fontSize:14 }}>★</span>)}
                  </div>
                  <div style={{ fontSize:12, color:C.textSm, fontWeight:600 }}>Overall rating</div>
                </div>
                <div style={{ width:1, height:60, background:C.borderLt, flexShrink:0 }}/>
                <div style={{ display:"flex", gap: isMobile ? 20 : 32, flexWrap:"wrap" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"Outfit, sans-serif", fontSize:24, fontWeight:800, color:C.text }}>{avgWait}</div>
                    <div style={{ fontSize:12, color:C.textSm, fontWeight:600 }}>Wait time</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"Outfit, sans-serif", fontSize:24, fontWeight:800, color:C.text }}>{avgBedside}</div>
                    <div style={{ fontSize:12, color:C.textSm, fontWeight:600 }}>Bedside manner</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"Outfit, sans-serif", fontSize:24, fontWeight:800, color:C.text }}>{reviews.length}</div>
                    <div style={{ fontSize:12, color:C.textSm, fontWeight:600 }}>Total reviews</div>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
                {[{k:"newest",l:"Newest"},{k:"highest",l:"Highest rated"},{k:"lowest",l:"Lowest rated"}].map(s => (
                  <button key={s.k} onClick={() => setReviewSort(s.k)}
                    style={{ padding:"7px 16px", border:`1.5px solid ${reviewSort===s.k?C.teal:C.border}`, borderRadius:20, background:reviewSort===s.k?C.tealLt:C.white, color:reviewSort===s.k?C.teal:C.textSm, fontSize:13, fontWeight:reviewSort===s.k?700:400, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
                    {s.l}
                  </button>
                ))}
              </div>

              {/* Review list */}
              {sortedReviews.map(r => (
                <div key={r.id} style={{ borderBottom:`1px solid ${C.borderLt}`, paddingBottom:18, marginBottom:18 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8, flexWrap:"wrap" }}>
                    <div style={{ display:"flex", gap:2 }}>
                      {[1,2,3,4,5].map(i => <span key={i} style={{ color:i<=r.rating?C.amber:C.grayMd, fontSize:14 }}>★</span>)}
                    </div>
                    <span style={{ fontSize:13.5, fontWeight:700, color:C.text }}>{r.author}</span>
                    <span style={{ fontSize:12, color:C.textSm }}>· {r.date}</span>
                  </div>
                  <p style={{ fontSize:14, color:C.textMd, lineHeight:1.7, margin:0 }}>{r.text}</p>
                </div>
              ))}

              {/* Write a review */}
              <div style={{ background:C.offWhite, borderRadius:12, padding:"18px 20px", marginTop:8, border:`1px solid ${C.borderLt}` }}>
                <div style={{ fontWeight:700, fontSize:14.5, marginBottom:12 }}>Write a review</div>
                <div style={{ display:"flex", gap:4, marginBottom:12 }}>
                  {[1,2,3,4,5].map(i => (
                    <button key={i} onClick={() => setCommentRating(i)}
                      style={{ background:"none", border:"none", fontSize:24, cursor:"pointer", color:i<=commentRating?C.amber:C.grayMd, transition:"color .1s" }}>★</button>
                  ))}
                </div>
                <textarea value={commentText} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
                  placeholder="Share your experience…" rows={3}
                  style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit", resize:"vertical", marginBottom:12, boxSizing:"border-box" as const }}
                  onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor=C.teal}
                  onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor=C.border}/>
                <button onClick={handleComment}
                  style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"10px 26px", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit" }}>
                  Submit Review
                </button>
                {commentDone && <span className="fade-up" style={{ marginLeft:12, fontSize:13, color:C.green, fontWeight:600 }}>Review submitted!</span>}
              </div>
            </div>

            {/* ── FAQS ── */}
            <div id="faqs" className="fade-up" style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"32px 36px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:17, fontWeight:700, color:"#071e34", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:30, height:30, borderRadius:8, background:C.tealBg, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </span>
                Frequently Asked Questions
              </h2>
              {DEMO_FAQS.map((faq, i) => (
                <div key={i} style={{ borderBottom: i < DEMO_FAQS.length - 1 ? `1px solid ${C.borderLt}` : "none" }}>
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                    <span style={{ fontWeight:600, fontSize:14.5, color:C.text, flex:1, paddingRight:12 }}>{faq.q}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .2s", transform:faqOpen===i?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
                  </button>
                  {faqOpen === i && (
                    <div className="fade-up" style={{ padding:"0 0 16px", color:C.textSm, fontSize:14, lineHeight:1.7 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>

          </div>
          {/* ── END LEFT COLUMN ── */}

          {/* ── RIGHT SIDEBAR ── */}
          {!isMobile && (
            <div style={{ position:"sticky", top:56, alignSelf:"flex-start", display:"flex", flexDirection:"column", gap:16 }}>

              {/* ── PARTNER COMPACT BADGE (above booking card) ── */}
              {provider.contracted && (
                <div style={{ background:"linear-gradient(135deg, #fef9e4 0%, #fdf3c0 50%, #fef9e4 100%)", border:"1.5px solid #d4a017", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:10, boxShadow:"0 2px 8px rgba(180,130,0,0.13)", cursor:"pointer" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg, #d4a017, #f0c840)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 1px 6px rgba(180,130,0,0.3)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff8dc" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"Outfit, sans-serif", fontSize:12.5, fontWeight:800, color:"#7a4f00", letterSpacing:"0.03em", whiteSpace:"nowrap" }}>Hospital.com Partner</div>
                    <div style={{ fontSize:11.5, color:"#b8860b", fontWeight:600, whiteSpace:"nowrap" }}>Learn more</div>
                  </div>
                </div>
              )}

              {provider.contracted && provider.hasCalendar ? (
                <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, boxShadow:"0 2px 12px rgba(0,0,0,.06)", overflow:"hidden" }}>
                  <div style={{ background:"#071e34", padding:"18px 20px" }}>
                    <div style={{ fontWeight:800, fontSize:16, color:"#fff", marginBottom:2 }}>Book an Appointment</div>
                    <p style={{ fontSize:12, color:"rgba(255,255,255,0.6)", margin:0 }}>Schedule online — free and easy</p>
                  </div>
                  <div style={{ padding:"20px" }}>
                    {/* Services */}
                    <div style={{ fontSize:11, fontWeight:700, color:C.textSm, letterSpacing:"0.08em", textTransform:"uppercase" as const, marginBottom:8 }}>Services</div>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:16 }}>
                      {DEMO_SERVICES.map(s => (
                        <span key={s} style={{ background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 10px", fontSize:11.5, color:C.textMd, fontWeight:500 }}>{s}</span>
                      ))}
                    </div>

                    {/* Date picker */}
                    <div style={{ fontSize:11, fontWeight:700, color:C.textSm, letterSpacing:"0.08em", textTransform:"uppercase" as const, marginBottom:8 }}>Select Date</div>
                    <div style={{ display:"flex", gap:4, overflowX:"auto", paddingBottom:4, marginBottom:14 }}>
                      {days.slice(0,5).map((d, i) => (
                        <button key={i} onClick={() => setSelectedDate(d)}
                          style={{ flexShrink:0, width:48, padding:"8px 0", border:`1.5px solid ${selectedDate?.toDateString()===d.toDateString()?C.teal:C.border}`, borderRadius:10, background:selectedDate?.toDateString()===d.toDateString()?C.tealLt:C.white, cursor:"pointer", textAlign:"center", fontFamily:"inherit" }}>
                          <div style={{ fontSize:9.5, color:C.textSm, fontWeight:700 }}>{d.toLocaleDateString("en",{weekday:"short"}).toUpperCase()}</div>
                          <div style={{ fontSize:16, fontWeight:800, color:selectedDate?.toDateString()===d.toDateString()?C.teal:C.text, marginTop:2 }}>{d.getDate()}</div>
                        </button>
                      ))}
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                      <>
                        <div style={{ fontSize:11, fontWeight:700, color:C.textSm, letterSpacing:"0.08em", textTransform:"uppercase" as const, marginBottom:8 }}>Select Time</div>
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
                          {ALL_TIMES.slice(0,8).map(t => {
                            const taken = BOOKED.includes(t);
                            return (
                              <button key={t} onClick={() => !taken && setForm(f => ({...f, time:t}))} disabled={taken}
                                style={{ padding:"5px 11px", border:`1.5px solid ${form.time===t?C.teal:C.border}`, borderRadius:8, background:form.time===t?C.tealLt:taken?C.gray:C.white, color:form.time===t?C.teal:taken?"#bbb":C.textSm, fontSize:11.5, cursor:taken?"not-allowed":"pointer", fontWeight:form.time===t?700:400, fontFamily:"inherit", textDecoration:taken?"line-through":"none" }}>
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {/* Form */}
                    {selectedDate && form.time && !done && (
                      <>
                        {([["Name","name","text"],["Email","email","email"],["Phone","phone","tel"]] as [string,string,string][]).map(([l,k,tp]) => (
                          <input key={k} type={tp} value={(form as Record<string,string>)[k]}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(f => ({...f,[k]:e.target.value}))}
                            placeholder={l}
                            style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:13, outline:"none", fontFamily:"inherit", marginBottom:8, boxSizing:"border-box" as const }}
                            onFocus={e => (e.target as HTMLInputElement).style.borderColor=C.teal}
                            onBlur={e => (e.target as HTMLInputElement).style.borderColor=C.border}/>
                        ))}
                        <button onClick={handleBook}
                          style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>
                          Confirm Booking
                        </button>
                      </>
                    )}

                    {done && (
                      <div style={{ textAlign:"center", padding:"12px 0" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" style={{ marginBottom:6 }}><polyline points="20,6 9,17 4,12"/></svg>
                        <div style={{ fontWeight:700, fontSize:14, color:C.teal }}>Booked!</div>
                        <div style={{ fontSize:12, color:C.textSm }}>Confirmation sent to {form.email}</div>
                      </div>
                    )}

                    {!selectedDate && !done && (
                      <button onClick={() => setSelectedDate(days[0])}
                        style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>
                        View Availability
                      </button>
                    )}
                  </div>
                </div>

              ) : provider.contracted && !provider.hasCalendar ? (
                <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, boxShadow:"0 2px 12px rgba(0,0,0,.06)", overflow:"hidden" }}>
                  <div style={{ background:"#071e34", padding:"18px 20px" }}>
                    <div style={{ fontWeight:800, fontSize:16, color:"#fff", marginBottom:2 }}>Request an Appointment</div>
                    <p style={{ fontSize:12, color:"rgba(255,255,255,0.6)", margin:0 }}>Fill out the form and they&apos;ll get back to you</p>
                  </div>
                  <div style={{ padding:"20px" }}>
                    <div style={{ background:C.tealLt, border:`1px solid ${C.teal}25`, borderRadius:10, padding:"10px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:8, fontSize:12.5, color:C.teal, fontWeight:600 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                      Verified by Hospital.com
                    </div>
                    {!done ? (
                      <>
                        {([["Your Name","name","text"],["Email","email","email"],["Phone","phone","tel"]] as [string,string,string][]).map(([l,k,tp]) => (
                          <input key={k} type={tp} value={(form as Record<string,string>)[k]}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(f => ({...f,[k]:e.target.value}))}
                            placeholder={l}
                            style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:13, outline:"none", fontFamily:"inherit", marginBottom:8, boxSizing:"border-box" as const }}
                            onFocus={e => (e.target as HTMLInputElement).style.borderColor=C.teal}
                            onBlur={e => (e.target as HTMLInputElement).style.borderColor=C.border}/>
                        ))}
                        <textarea value={form.reason}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm(f => ({...f, reason:e.target.value}))}
                          placeholder="Describe your reason for visit…" rows={3}
                          style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:13, outline:"none", fontFamily:"inherit", resize:"vertical", marginBottom:10, boxSizing:"border-box" as const }}
                          onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor=C.teal}
                          onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor=C.border}/>
                        <button onClick={() => { if (form.name && form.email) { setBookings((b: unknown[]) => [...b, {...form, providerName:provider.name, providerId:provider.id, providerObj:provider, id:Date.now(), status:"Pending", date:"TBD", type:"request"}]); setDone(true); }}}
                          style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>
                          Request Appointment
                        </button>
                      </>
                    ) : (
                      <div style={{ textAlign:"center", padding:"12px 0" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" style={{ marginBottom:6 }}><polyline points="20,6 9,17 4,12"/></svg>
                        <div style={{ fontWeight:700, fontSize:14, color:C.teal }}>Request Sent!</div>
                        <div style={{ fontSize:12, color:C.textSm, marginTop:4 }}>The provider will contact you at {form.email}</div>
                      </div>
                    )}
                  </div>
                </div>

              ) : (
                <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 20px", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
                  <div style={{ fontWeight:800, fontSize:16, marginBottom:6 }}>Contact this provider</div>
                  <p style={{ fontSize:13, color:C.textSm, marginBottom:16, lineHeight:1.6 }}>This provider is not yet a contracted partner. Contact them directly to arrange care.</p>
                </div>
              )}

              {/* Call + Website — always shown */}
              <div style={{ display:"flex", gap:8 }}>
                <a href={`tel:${provider.phone}`}
                  style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px", border:`2px solid ${C.teal}`, borderRadius:12, color:C.teal, fontWeight:700, fontSize:13.5, cursor:"pointer", textDecoration:"none", fontFamily:"inherit", background:C.white, transition:"all .15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background=C.tealLt}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background=C.white}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={C.teal} stroke="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z"/></svg>
                  Call
                </a>
                <button style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px", border:`1.5px solid ${C.border}`, borderRadius:12, color:C.textMd, fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"inherit", background:C.white, transition:"all .15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor=C.teal; (e.currentTarget as HTMLButtonElement).style.color=C.teal; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor=C.border; (e.currentTarget as HTMLButtonElement).style.color=C.textMd; }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Website
                </button>
              </div>

              {/* ── SIDEBAR HOURS OF OPERATION ── */}
              {(() => {
                const HOURS_SCHEDULE = [
                  { day:"Monday",    time:"8:00 AM – 6:00 PM" },
                  { day:"Tuesday",   time:"8:00 AM – 6:00 PM" },
                  { day:"Wednesday", time:"8:00 AM – 6:00 PM" },
                  { day:"Thursday",  time:"8:00 AM – 7:00 PM" },
                  { day:"Friday",    time:"8:00 AM – 5:00 PM" },
                  { day:"Saturday",  time:"9:00 AM – 1:00 PM" },
                  { day:"Sunday",    time:"Closed" },
                ];
                return (
                  <div style={{ background:C.white, border:`1px solid ${C.borderLt}`, borderRadius:14, padding:"20px 22px", boxShadow:"0 1px 6px rgba(16,117,173,0.05)" }}>
                    <div style={{ fontFamily:"Outfit, sans-serif", fontSize:14.5, fontWeight:700, color:"#071e34", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Hours of Operation
                    </div>
                    <div style={{ display:"flex", flexDirection:"column" }}>
                      {HOURS_SCHEDULE.map(({ day, time }, i) => {
                        const isToday = day === "Monday";
                        const isClosed = time === "Closed";
                        const isLast = i === HOURS_SCHEDULE.length - 1;
                        return (
                          <div key={day} style={{
                            display:"flex", justifyContent:"space-between", alignItems:"center",
                            padding:"9px 0",
                            ...(isToday ? { background:C.tealBg, margin:"0 -4px", padding:"9px 4px", borderRadius:6 } : {}),
                            borderBottom: isToday || isLast ? "none" : `1px solid ${C.borderLt}`,
                            fontSize:12.5,
                          }}>
                            <span style={{ color:C.textSm, fontWeight:500 }}>
                              {day}
                              {isToday && (
                                <span style={{ fontSize:9.5, fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase" as const, color:C.blue, background:"rgba(50,204,224,0.12)", borderRadius:4, padding:"2px 6px", marginLeft:6 }}>Today</span>
                              )}
                            </span>
                            <span style={{ fontWeight:600, color:isClosed ? "#dc2626" : C.text }}>{time}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

            </div>
          )}
          {/* ── END RIGHT SIDEBAR ── */}

        </div>

        <Footer />

        {/* ── MOBILE FIXED BOTTOM ── */}
        {isMobile && provider.contracted && (
          <div style={{ position:"fixed", bottom:0, left:0, right:0, padding:"12px 16px", background:C.white, borderTop:`1px solid ${C.border}`, zIndex:50 }}>
            <button onClick={() => scrollToSection("insurances")}
              style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:14, padding:"14px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 20px rgba(70,196,217,.3)" }}>
              {provider.hasCalendar ? "Book Appointment" : "Request Appointment"}
            </button>
          </div>
        )}
        {isMobile && !provider.contracted && (
          <div style={{ position:"fixed", bottom:0, left:0, right:0, padding:"12px 16px", background:C.white, borderTop:`1px solid ${C.border}`, display:"flex", gap:8, zIndex:50 }}>
            <a href={`tel:${provider.phone}`}
              style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"14px", background:C.teal, border:"none", borderRadius:14, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", textDecoration:"none", fontFamily:"inherit" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z"/></svg>
              Call
            </a>
            <button style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"14px", background:C.white, border:`2px solid ${C.border}`, borderRadius:14, color:C.textMd, fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Website
            </button>
          </div>
        )}

      </div>
    </>
  );
}
