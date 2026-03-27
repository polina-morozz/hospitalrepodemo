import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import C from "@/lib/tokens";
import PROVIDERS from "@/lib/data/providers";
import type { Provider } from "@/lib/data/providers";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { useApp } from "@/lib/context/AppContext";
import { SealBadge } from "@/components/ui/Badge";
import ProviderAvatar from "@/components/providers/ProviderAvatar";
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
  { name:"Centene", color:"#E84B37", plans:["Ambetter","WellCare"] },
  { name:"Health Net", color:"#0067A0", plans:["Health Net PPO","Health Net HMO","Health Net Medi-Cal"] },
  { name:"Oscar Health", color:"#F05A7E", plans:["Oscar PPO","Oscar EPO"] },
  { name:"Tricare", color:"#003087", plans:["Tricare Prime","Tricare Select","Tricare for Life"] },
  { name:"Oxford", color:"#7B2D8E", plans:["Oxford Freedom","Oxford Liberty"] },
  { name:"Emblem Health", color:"#0073CF", plans:["GHI HMO","HIP HMO","EmblemHealth PPO"] },
  { name:"Highmark", color:"#00548E", plans:["Highmark PPO","Highmark Blue Shield"] },
  { name:"Independence Blue Cross", color:"#1A6FB5", plans:["Keystone HMO","Personal Choice PPO"] },
];

const DEMO_EXPERTISE = ["Lower Back Pain","Joint Stiffness","Sports Injury","Neck Pain","Headache","Knee Pain","Shoulder Pain","Sciatica"];

const DEMO_REVIEWS = [
  { id:1, author:"Emily R.", date:"Feb 28, 2026", rating:5, text:"Absolutely wonderful experience. The doctor was thorough, listened carefully, and explained everything clearly. Highly recommend to anyone looking for quality care.", waitRating:5, bedsideRating:5 },
  { id:2, author:"Michael T.", date:"Feb 14, 2026", rating:4, text:"Great doctor, very knowledgeable. The only downside was the wait time — about 25 minutes past my scheduled appointment. But the care itself was excellent.", waitRating:3, bedsideRating:5 },
  { id:3, author:"Sarah K.", date:"Jan 30, 2026", rating:5, text:"I've been coming here for over a year and it's consistently great. The staff is friendly, and the doctor remembers your history.", waitRating:4, bedsideRating:5 },
  { id:4, author:"James L.", date:"Jan 10, 2026", rating:4, text:"Very professional and knowledgeable. Would appreciate more flexible scheduling options though.", waitRating:4, bedsideRating:4 },
  { id:5, author:"Anna P.", date:"Dec 22, 2025", rating:5, text:"Best healthcare experience I've had in years. The doctor took time to understand my concerns and created a personalized treatment plan.", waitRating:5, bedsideRating:5 },
];

const PROFILE_SECTIONS = [
  { id:"highlights", label:"Highlights" },
  { id:"about",      label:"About" },
  { id:"insurances", label:"Insurances" },
  { id:"location",   label:"Location" },
  { id:"reviews",    label:"Reviews" },
  { id:"faqs",       label:"FAQs" },
];

const ALL_TIMES = ["8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];
const BOOKED   = ["9:00","10:30","14:00"];

const totalPlans = DEMO_INSURANCE_TOP.reduce((a, i) => a + i.plans.length, 0) + DEMO_INSURANCE_MORE.reduce((a, i) => a + i.plans.length, 0);

// ─── PROVIDER DETAIL PAGE ─────────────────────────────────────────────────────
export default function ProviderDetailPage() {
  const router   = useRouter();
  const isMobile = useIsMobile();
  const { bookmarks, toggleBookmark, isLoggedIn, setBookings } = useApp();

  const rawId   = router.query.id;
  const numId   = typeof rawId === "string" ? parseInt(rawId, 10) : NaN;
  const provider: Provider | undefined = PROVIDERS.find(p => p.id === numId);

  const scrollRef   = useRef<HTMLDivElement>(null);
  const [scrolledProv, setScrolledProv] = useState(false);
  const [activeSection, setActiveSection] = useState("highlights");

  const [form, setForm] = useState({ name:"", email:"", phone:"", reason:"", time:"" });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [done, setDone] = useState(false);

  const [showAllInsurance, setShowAllInsurance] = useState(false);

  const [reviews, setReviews] = useState(DEMO_REVIEWS);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [commentDone, setCommentDone] = useState(false);
  const [reviewSort, setReviewSort] = useState("newest");

  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const avgRating  = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
  const avgWait    = (reviews.reduce((a, r) => a + r.waitRating, 0) / reviews.length).toFixed(1);
  const avgBedside = (reviews.reduce((a, r) => a + r.bedsideRating, 0) / reviews.length).toFixed(1);
  const pct5Star   = Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100);

  const today = new Date();
  const days  = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return d;
  }).filter(d => d.getDay() !== 0 && d.getDay() !== 6);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolledProv(el.scrollTop > 80);
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
      id:           reviews.length + 1,
      author:       "You",
      date:         new Date().toLocaleDateString("en", { month:"short", day:"numeric", year:"numeric" }),
      rating:       commentRating,
      text:         commentText,
      waitRating:   commentRating,
      bedsideRating:commentRating,
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

  // ── Loading / 404 states ──
  if (!provider && !router.query.id) return null;

  if (!provider) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:C.offWhite, padding:24 }}>
        <Head><title>Provider Not Found | Hospital.com</title></Head>
        <div style={{ textAlign:"center", maxWidth:420 }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🏥</div>
          <h1 style={{ fontWeight:800, fontSize:24, color:C.text, marginBottom:10 }}>Provider Not Found</h1>
          <p style={{ color:C.textSm, fontSize:15, marginBottom:28, lineHeight:1.6 }}>
            We couldn&apos;t find a provider with that ID. They may have moved or been removed from the platform.
          </p>
          <button onClick={() => router.back()} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:12, padding:"12px 28px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const DEMO_SERVICES = provider.tags?.length ? provider.tags : ["General Consultation","Follow-up Visit","Preventive Care"];
  const DEMO_FAQS = [
    { q:`Is ${provider.name} accepting new patients?`, a:"Yes, this provider is currently accepting new patients. You can book an appointment directly through their profile." },
    { q:`What insurance does ${provider.name} accept?`, a:`${provider.name} accepts a wide range of insurance plans including Aetna, BlueCross BlueShield, Cigna, UnitedHealthcare, and more.` },
    { q:`What are ${provider.name}'s office hours?`, a:`Office hours are ${provider.hours}. We recommend booking in advance for the best availability.` },
    { q:"How do I prepare for my first visit?", a:"Please bring your insurance card, a valid photo ID, and any relevant medical records. Arrive 10 minutes early to complete paperwork." },
  ];

  const isBookmarked = bookmarks.includes(provider.id);

  return (
    <>
      <Head><title>{provider.name} | Hospital.com</title></Head>

      <div ref={scrollRef} style={{ maxHeight:"calc(100vh - 58px)", overflowY:"auto", fontFamily:"inherit" }}>

        {/* ── STICKY SECONDARY NAV ── */}
        {scrolledProv && (
          <div style={{ position:"sticky", top:0, zIndex:100, background:C.white, borderBottom:`1px solid ${C.border}`, padding: isMobile ? "0 12px" : "0 32px", display:"flex", alignItems:"center", gap:2, overflowX:"auto" }}>
            {PROFILE_SECTIONS.map(s => (
              <button key={s.id} onClick={() => scrollToSection(s.id)}
                style={{ padding:"12px 16px", background:"none", border:"none", borderBottom:`2px solid ${activeSection===s.id?C.teal:"transparent"}`, color:activeSection===s.id?C.teal:C.textSm, fontWeight:activeSection===s.id?700:500, fontSize:13, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", transition:"all .15s" }}>
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ maxWidth:1200, margin:"0 auto", padding:isMobile?"20px 16px 48px":"32px 32px 60px" }}>

          {/* Back */}
          <button onClick={() => router.back()}
            style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:13.5, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:22, padding:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
            Back
          </button>

          {/* ── TWO COLUMNS ── */}
          <div style={{ display:"flex", gap:28, alignItems:"flex-start", flexDirection:isMobile?"column":"row" }}>

            {/* ── LEFT COLUMN ── */}
            <div style={{ flex:1, minWidth:0 }}>

              {/* ── HEADER CARD ── */}
              <div id="highlights" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:isMobile?"20px":"28px 30px", marginBottom:20, boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
                <div style={{ display:"flex", gap:18, alignItems:"flex-start", flexWrap:"wrap" }}>
                  <ProviderAvatar provider={provider} size={80} radius={18} fontSize={24} />
                  <div style={{ flex:1, minWidth: isMobile ? 0 : 200 }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                      <h1 style={{ fontSize:isMobile?20:26, fontWeight:800, margin:0 }}>{provider.name}</h1>
                      {provider.contracted && <SealBadge />}
                    </div>
                    <div style={{ color:C.textSm, fontSize:14, marginBottom:6 }}>{provider.specialty}</div>
                    <div style={{ fontSize:13, color:C.textSm, marginBottom:8 }}>{provider.address}, {provider.city}</div>
                    <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:12 }}>
                      <span style={{ background:C.tealLt, color:C.teal, fontWeight:800, fontSize:16, padding:"4px 12px", borderRadius:10 }}>★ {avgRating}</span>
                      <span style={{ fontSize:13, color:C.textSm }}>({reviews.length} patient ratings)</span>
                    </div>
                    {/* AI Review Summary */}
                    <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                      <div style={{ flex:1, minWidth:160, background:C.greenLt, borderRadius:12, padding:"12px 14px" }}>
                        <div style={{ color:C.green, fontWeight:700, fontSize:12, marginBottom:5, display:"flex", alignItems:"center", gap:4 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                          What patients love
                        </div>
                        <p style={{ color:C.textMd, fontSize:12.5, lineHeight:1.55, margin:0 }}>Thorough explanations, personalized care, attentive approach, and clear communication.</p>
                      </div>
                      <div style={{ flex:1, minWidth:160, background:C.amberLt, borderRadius:12, padding:"12px 14px" }}>
                        <div style={{ color:C.amber, fontWeight:700, fontSize:12, marginBottom:5, display:"flex", alignItems:"center", gap:4 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                          Things to know
                        </div>
                        <p style={{ color:C.textMd, fontSize:12.5, lineHeight:1.55, margin:0 }}>Wait times may be longer during peak hours. Arrive 10 min early for new patients.</p>
                      </div>
                    </div>
                  </div>
                  {/* Bookmark */}
                  <button onClick={() => { if (!isLoggedIn) { router.push("/signup"); return; } toggleBookmark(provider.id); }}
                    style={{ background:"none", border:"none", cursor:"pointer", padding:4, flexShrink:0 }}
                    title={isLoggedIn ? (isBookmarked ? "Remove bookmark" : "Bookmark") : "Sign up to bookmark"}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isBookmarked?C.teal:"none"} stroke={isBookmarked?C.teal:C.textSm} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* ── HIGHLIGHTS ── */}
              <div className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                <h2 style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>Highlights</h2>
                <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:12 }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13 }}>Highly recommended</div>
                      <div style={{ fontSize:12, color:C.textSm }}>{pct5Star}% of patients gave 5 stars</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13 }}>Excellent wait time</div>
                      <div style={{ fontSize:12, color:C.textSm }}>96% waited less than 30 min</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13 }}>New patient appointments</div>
                      <div style={{ fontSize:12, color:C.textSm }}>Appointments available for new patients</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13 }}>In-network insurances</div>
                      <div style={{ fontSize:12, color:C.textSm }}>{DEMO_INSURANCE_TOP.slice(0,3).map(i=>i.name).join(", ")} (+{totalPlans - 3} more)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ABOUT ── */}
              <div id="about" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                <h2 style={{ fontWeight:800, fontSize:16, marginBottom:12 }}>About {provider.name}</h2>
                <p style={{ color:C.textMd, fontSize:14, lineHeight:1.75, marginBottom:16 }}>
                  {provider.name} is a highly rated {provider.specialty.toLowerCase()} specialist based in {provider.city}. With {provider.reviews}+ verified patient reviews and a {provider.rating} star rating, they are known for excellent patient care, thorough consultations, and a welcoming practice environment.
                </p>
                <h3 style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Areas of expertise</h3>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
                  {DEMO_EXPERTISE.map(e => (
                    <span key={e} style={{ background:C.tealLt, color:C.teal, fontSize:12, fontWeight:600, padding:"4px 12px", borderRadius:18 }}>{e}</span>
                  ))}
                </div>
                <h3 style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Education &amp; background</h3>
                <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:10 }}>
                  {[
                    { label:"Practice",  value:provider.name },
                    { label:"Specialty", value:provider.specialty },
                    { label:"Location",  value:`${provider.address}, ${provider.city}` },
                    { label:"Hours",     value:provider.hours },
                    { label:"Languages", value:"English" },
                  ].map(item => (
                    <div key={item.label} style={{ fontSize:13 }}>
                      <span style={{ color:C.textSm, fontWeight:600 }}>{item.label}: </span>
                      <span style={{ color:C.text }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── INSURANCES ── */}
              <div id="insurances" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                <h2 style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>In-network insurances</h2>
                <p style={{ fontSize:12.5, color:C.textSm, marginBottom:16 }}>99% of patients have successfully booked with these insurances</p>
                <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(200px, 1fr))", gap:10, marginBottom:16 }}>
                  {DEMO_INSURANCE_TOP.map(ins => (
                    <div key={ins.name} style={{ display:"flex", alignItems:"center", gap:8, background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 16px" }}>
                      <div style={{ width:28, height:28, borderRadius:8, background:ins.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, color:"#fff", flexShrink:0 }}>{ins.name.slice(0,2).toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{ins.name}</div>
                        <div style={{ fontSize:11, color:C.textSm }}>{ins.plans.length} plans</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowAllInsurance(!showAllInsurance)}
                  style={{ background:C.tealLt, border:`1px solid ${C.teal}30`, borderRadius:10, padding:"10px 18px", fontSize:13, fontWeight:700, color:C.teal, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:showAllInsurance?16:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" style={{ transition:"transform .2s", transform:showAllInsurance?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
                  {showAllInsurance ? "Hide all plans" : `View all ${totalPlans}+ plans`}
                </button>
                {showAllInsurance && (
                  <div className="fade-up">
                    {[...DEMO_INSURANCE_TOP, ...DEMO_INSURANCE_MORE].map(carrier => (
                      <div key={carrier.name} style={{ marginBottom:14 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                          <div style={{ width:24, height:24, borderRadius:6, background:carrier.color||C.teal, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:9, color:"#fff", flexShrink:0 }}>{carrier.name.slice(0,2).toUpperCase()}</div>
                          <span style={{ fontWeight:700, fontSize:13.5, color:C.text }}>{carrier.name}</span>
                        </div>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap", paddingLeft:32 }}>
                          {carrier.plans.map(plan => (
                            <span key={plan} style={{ background:C.offWhite, border:`1px solid ${C.borderLt}`, borderRadius:8, padding:"5px 12px", fontSize:12, color:C.textMd }}>{plan}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── LOCATION + MAP ── */}
              <div id="location" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                <h2 style={{ fontWeight:800, fontSize:16, marginBottom:14 }}>Office location</h2>
                <div style={{ background:C.gray, border:`2px dashed ${C.grayMd}`, borderRadius:14, height: isMobile ? 160 : 220, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, marginBottom:16 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.grayMd} strokeWidth="1.5">
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div style={{ fontWeight:700, fontSize:14, color:C.grayMd }}>Map</div>
                  <div style={{ fontSize:12, color:C.grayMd }}>Interactive map will be displayed here</div>
                </div>
                <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" style={{ flexShrink:0, marginTop:2 }}>
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{provider.address}</div>
                    <div style={{ fontSize:13, color:C.textSm, marginBottom:8 }}>{provider.city}</div>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.address+", "+provider.city)}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ color:C.teal, fontWeight:600, fontSize:13, textDecoration:"none" }}>
                      Get directions →
                    </a>
                  </div>
                </div>
              </div>

              {/* ── REVIEWS ── */}
              <div id="reviews" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                <h2 style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>Patient reviews</h2>
                {/* Rating summary */}
                <div style={{ display:"flex", gap:24, marginBottom:20, flexWrap:"wrap" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:32, fontWeight:800, color:C.teal }}>{avgRating}</div>
                    <div style={{ fontSize:12, color:C.textSm, fontWeight:600 }}>Overall rating</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:32, fontWeight:800, color:C.text }}>{avgWait}</div>
                    <div style={{ fontSize:12, color:C.textSm, fontWeight:600 }}>Wait time</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:32, fontWeight:800, color:C.text }}>{avgBedside}</div>
                    <div style={{ fontSize:12, color:C.textSm, fontWeight:600 }}>Bedside manner</div>
                  </div>
                </div>
                {/* Sort */}
                <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
                  {[{k:"newest",l:"Newest"},{k:"highest",l:"Highest rated"},{k:"lowest",l:"Lowest rated"}].map(s => (
                    <button key={s.k} onClick={() => setReviewSort(s.k)}
                      style={{ padding:"6px 14px", border:`1.5px solid ${reviewSort===s.k?C.teal:C.border}`, borderRadius:20, background:reviewSort===s.k?C.tealLt:C.white, color:reviewSort===s.k?C.teal:C.textSm, fontSize:12, fontWeight:reviewSort===s.k?700:400, cursor:"pointer", fontFamily:"inherit" }}>
                      {s.l}
                    </button>
                  ))}
                </div>
                {/* Review list */}
                {sortedReviews.map(r => (
                  <div key={r.id} style={{ borderBottom:`1px solid ${C.borderLt}`, paddingBottom:14, marginBottom:14 }}>
                    <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:6 }}>
                      <div style={{ display:"flex", gap:2 }}>
                        {[1,2,3,4,5].map(i => <span key={i} style={{ color:i<=r.rating?C.amber:C.grayMd, fontSize:14 }}>★</span>)}
                      </div>
                      <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{r.author}</span>
                      <span style={{ fontSize:11, color:C.textSm }}>· {r.date}</span>
                    </div>
                    <p style={{ fontSize:13.5, color:C.textMd, lineHeight:1.65, margin:0 }}>{r.text}</p>
                  </div>
                ))}
                {/* Write a review */}
                <div style={{ background:C.offWhite, borderRadius:12, padding:"16px 18px", marginTop:8 }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Write a review</div>
                  <div style={{ display:"flex", gap:4, marginBottom:10 }}>
                    {[1,2,3,4,5].map(i => (
                      <button key={i} onClick={() => setCommentRating(i)}
                        style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:i<=commentRating?C.amber:C.grayMd, transition:"color .1s" }}>★</button>
                    ))}
                  </div>
                  <textarea value={commentText} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
                    placeholder="Share your experience…" rows={3}
                    style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit", resize:"vertical", marginBottom:10, boxSizing:"border-box" }}
                    onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor=C.teal}
                    onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor=C.border}/>
                  <button onClick={handleComment} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"10px 24px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Submit Review</button>
                  {commentDone && <span className="fade-up" style={{ marginLeft:12, fontSize:13, color:C.green, fontWeight:600 }}>Review submitted!</span>}
                </div>
              </div>

              {/* ── FAQS ── */}
              <div id="faqs" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                <h2 style={{ fontWeight:800, fontSize:16, marginBottom:14 }}>Frequently asked questions</h2>
                {DEMO_FAQS.map((faq, i) => (
                  <div key={i} style={{ borderBottom:i<DEMO_FAQS.length-1?`1px solid ${C.borderLt}`:"none" }}>
                    <button onClick={() => setFaqOpen(faqOpen===i?null:i)}
                      style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                      <span style={{ fontWeight:600, fontSize:14, color:C.text, flex:1 }}>{faq.q}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .2s", transform:faqOpen===i?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
                    </button>
                    {faqOpen===i && <div className="fade-up" style={{ padding:"0 0 14px", color:C.textSm, fontSize:13.5, lineHeight:1.65 }}>{faq.a}</div>}
                  </div>
                ))}
              </div>

            </div>
            {/* ── END LEFT COLUMN ── */}

            {/* ── RIGHT COLUMN — Sidebar ── */}
            {!isMobile && (
              <div style={{ width:300, flexShrink:0, position:"sticky", top:56, alignSelf:"flex-start" }}>
                <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 20px", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>

                  {provider.contracted && provider.hasCalendar ? (
                    <>
                      <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Book an appointment</div>
                      <p style={{ fontSize:12, color:C.textSm, marginBottom:16 }}>Schedule online — free and easy</p>

                      {/* Services */}
                      <div style={{ fontSize:12, fontWeight:700, color:C.textSm, marginBottom:8 }}>SERVICES</div>
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:16 }}>
                        {DEMO_SERVICES.map(s => (
                          <span key={s} style={{ background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 10px", fontSize:11.5, color:C.textMd, fontWeight:500 }}>{s}</span>
                        ))}
                      </div>

                      {/* Date picker */}
                      <div style={{ fontSize:12, fontWeight:700, color:C.textSm, marginBottom:8 }}>SELECT DATE</div>
                      <div style={{ display:"flex", gap:4, overflowX:"auto", paddingBottom:4, marginBottom:12 }}>
                        {days.slice(0,5).map((d, i) => (
                          <button key={i} onClick={() => setSelectedDate(d)}
                            style={{ flexShrink:0, width:46, padding:"7px 0", border:`1.5px solid ${selectedDate?.toDateString()===d.toDateString()?C.teal:C.border}`, borderRadius:10, background:selectedDate?.toDateString()===d.toDateString()?C.tealLt:C.white, cursor:"pointer", textAlign:"center", fontFamily:"inherit" }}>
                            <div style={{ fontSize:9.5, color:C.textSm, fontWeight:700 }}>{d.toLocaleDateString("en",{weekday:"short"}).toUpperCase()}</div>
                            <div style={{ fontSize:15, fontWeight:800, color:selectedDate?.toDateString()===d.toDateString()?C.teal:C.text, marginTop:2 }}>{d.getDate()}</div>
                          </button>
                        ))}
                      </div>

                      {/* Time slots */}
                      {selectedDate && (
                        <>
                          <div style={{ fontSize:12, fontWeight:700, color:C.textSm, marginBottom:8 }}>SELECT TIME</div>
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

                      {/* Quick form */}
                      {selectedDate && form.time && !done && (
                        <>
                          {([["Name","name","text"],["Email","email","email"],["Phone","phone","tel"]] as [string,string,string][]).map(([l,k,tp]) => (
                            <input key={k} type={tp} value={(form as Record<string,string>)[k]}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(f => ({...f,[k]:e.target.value}))}
                              placeholder={l}
                              style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:13, outline:"none", fontFamily:"inherit", marginBottom:8, boxSizing:"border-box" }}
                              onFocus={e => (e.target as HTMLInputElement).style.borderColor=C.teal}
                              onBlur={e => (e.target as HTMLInputElement).style.borderColor=C.border}/>
                          ))}
                          <button onClick={handleBook} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Confirm Booking</button>
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
                        <button onClick={() => setSelectedDate(days[0])} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>View Availability</button>
                      )}
                    </>

                  ) : provider.contracted && !provider.hasCalendar ? (
                    <>
                      <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Request an Appointment</div>
                      <p style={{ fontSize:12, color:C.textSm, marginBottom:12 }}>This provider doesn&apos;t have online booking yet. Fill out the form and they&apos;ll get back to you.</p>
                      <div style={{ background:C.tealLt, border:`1px solid ${C.teal}25`, borderRadius:10, padding:"10px 12px", marginBottom:14, display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.teal, fontWeight:600 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                        Verified by Hospital.com
                      </div>
                      {!done ? (
                        <>
                          {([["Your Name","name","text"],["Email","email","email"],["Phone","phone","tel"]] as [string,string,string][]).map(([l,k,tp]) => (
                            <input key={k} type={tp} value={(form as Record<string,string>)[k]}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(f => ({...f,[k]:e.target.value}))}
                              placeholder={l}
                              style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:13, outline:"none", fontFamily:"inherit", marginBottom:8, boxSizing:"border-box" }}
                              onFocus={e => (e.target as HTMLInputElement).style.borderColor=C.teal}
                              onBlur={e => (e.target as HTMLInputElement).style.borderColor=C.border}/>
                          ))}
                          <textarea value={form.reason}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm(f => ({...f, reason:e.target.value}))}
                            placeholder="Describe your reason for visit or any questions…" rows={3}
                            style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:13, outline:"none", fontFamily:"inherit", resize:"vertical", marginBottom:10, boxSizing:"border-box" }}
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
                          <div style={{ fontSize:12, color:C.textSm, marginTop:4 }}>The provider will contact you at {form.email} to confirm your appointment.</div>
                        </div>
                      )}
                    </>

                  ) : (
                    <>
                      <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Contact this provider</div>
                      <p style={{ fontSize:12, color:C.textSm, marginBottom:16 }}>This provider is not yet a verified partner. Contact them directly.</p>
                    </>
                  )}

                  {/* Call + Website — always shown */}
                  <div style={{ borderTop:provider.contracted?`1px solid ${C.borderLt}`:"none", marginTop:provider.contracted?14:0, paddingTop:provider.contracted?14:0, display:"flex", gap:8 }}>
                    <a href={`tel:${provider.phone}`}
                      style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px", border:`2px solid ${C.teal}`, borderRadius:12, color:C.teal, fontWeight:700, fontSize:13.5, cursor:"pointer", textDecoration:"none", fontFamily:"inherit", background:C.white, transition:"all .15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background=C.tealLt}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background=C.white}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill={C.teal} stroke="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z"/></svg>
                      Call
                    </a>
                    <button style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px", border:`1.5px solid ${C.border}`, borderRadius:12, color:C.textMd, fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"inherit", background:C.white, transition:"all .15s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor=C.teal; (e.currentTarget as HTMLButtonElement).style.color=C.teal; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor=C.border; (e.currentTarget as HTMLButtonElement).style.color=C.textMd; }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Website
                    </button>
                  </div>

                </div>
              </div>
            )}
            {/* ── END RIGHT COLUMN ── */}

          </div>
        </div>

        <Footer />

        {/* Mobile: fixed bottom buttons */}
        {isMobile && provider.contracted && (
          <div style={{ position:"fixed", bottom:0, left:0, right:0, padding:"12px 16px", background:C.white, borderTop:`1px solid ${C.border}`, zIndex:50 }}>
            <button onClick={() => scrollToSection("reviews")} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:14, padding:"14px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 20px rgba(11,191,191,.3)" }}>
              {provider.hasCalendar ? "Book Appointment" : "Request Appointment"}
            </button>
          </div>
        )}
        {isMobile && !provider.contracted && (
          <div style={{ position:"fixed", bottom:0, left:0, right:0, padding:"12px 16px", background:C.white, borderTop:`1px solid ${C.border}`, display:"flex", gap:8, zIndex:50 }}>
            <a href={`tel:${provider.phone}`} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"14px", background:C.teal, border:"none", borderRadius:14, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", textDecoration:"none", fontFamily:"inherit", boxShadow:"0 4px 20px rgba(11,191,191,.3)" }}>
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
