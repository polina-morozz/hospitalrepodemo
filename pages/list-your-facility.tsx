import { useState, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import C from "@/lib/tokens";
import useIsMobile from "@/lib/hooks/useIsMobile";
import Footer from "@/components/layout/Footer";
import FieldInput from "@/components/ui/FieldInput";

// ─── LIST YOUR FACILITY PAGE ───────────────────────────────────────────────────
// TODO(backend): POST /api/facilities/apply — req.body: { facilityName, city, country, accreditation, specialties, contactName, email, phone, website, type }

interface FacilityForm {
  facilityName: string;
  city: string;
  country: string;
  accreditation: string;
  specialties: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  type: string;
}

interface Faq { q: string; a: string; }

const navy = "#071e34";

export default function ListYourFacilityPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [f, setF] = useState<FacilityForm>({
    facilityName:"", city:"", country:"", accreditation:"",
    specialties:"", contactName:"", email:"", phone:"", website:"", type:"",
  });
  const [done, setDone] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqs: Faq[] = [
    { q:"What accreditations are required to be listed?", a:"We accept facilities holding internationally recognised accreditations such as JCI, ISO 9001, TEMOS, DNV GL, HAS, or equivalent national standards. Our team reviews each application individually." },
    { q:"Is there a cost to list my facility?", a:"Creating a basic listing is free. We also offer premium placement and a pay-per-lead model for facilities looking to receive high-intent patient inquiries directly." },
    { q:"How long does the verification process take?", a:"Typically 3–5 business days. Our team verifies your accreditation documents, licensing, and contact details before your facility goes live." },
    { q:"Can medical tourism facilitators apply, not just hospitals?", a:"Yes. Both hospitals/clinics and independent medical tourism facilitators (coordinators) can apply. Select the appropriate type in the application form." },
    { q:"How do patients contact my facility?", a:"Patients send free treatment quote requests through Hospital.com. Your dedicated inbox and lead dashboard will capture each inquiry with procedure details, budget, and timeline." },
    { q:"Can I manage multiple facilities under one account?", a:"Yes. Our provider dashboard supports multi-facility management under a single login, with separate analytics and lead tracking for each location." },
  ];

  if (done) return (
    <>
      <Head><title>Application Received | Hospital.com</title></Head>
      <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, #f0fafe 55%, #e3f2fa)` }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:500, background:"white", borderRadius:20, padding:"48px 40px", boxShadow:"0 12px 60px rgba(16,117,173,0.12)", textAlign:"center" }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
          </div>
          <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:C.blue, marginBottom:12 }}>Application Received</div>
          <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:24, fontWeight:800, color:navy, marginBottom:12 }}>Welcome to the Network</h2>
          <p style={{ color:C.textSm, fontSize:14.5, lineHeight:1.7, marginBottom:28 }}>
            Thank you for applying. Our Global Health Services team will review your accreditation documents and get back to you within <strong style={{ color:navy }}>3–5 business days</strong>.
          </p>
          <button className="btn-primary" onClick={()=>router.push("/medical-tourism")}
            style={{ background:C.teal, color:"#fff", border:"none", borderRadius:28, padding:"13px 36px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>
            Back to Global Health Services
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>List Your Facility | Hospital.com Global Health Services</title>
        <meta name="description" content="List your internationally accredited clinic or hospital on Hospital.com and reach patients from 80+ countries seeking world-class care abroad." />
        <meta property="og:title" content="List Your Facility | Hospital.com" />
        <link rel="canonical" href="https://www.hospital.com/list-your-facility" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight:"calc(100vh - 58px)", background:"white" }}>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <div style={{
          background:"#f0fafe", padding:isMobile?"72px 20px 64px":"110px 24px 88px",
          position:"relative", overflow:"hidden",
        }}>
          {/* Grid lines */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage:"linear-gradient(rgba(16,117,173,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,117,173,0.06) 1px, transparent 1px)",
            backgroundSize:"60px 60px" }}/>
          {/* Radial gradients */}
          <div style={{ position:"absolute", inset:0, pointerEvents:"none",
            background:`radial-gradient(ellipse 60% 65% at -5% 55%, rgba(70,196,217,0.20) 0%, transparent 55%),
              radial-gradient(ellipse 50% 60% at 105% 30%, rgba(18,117,173,0.12) 0%, transparent 55%)` }}/>

          <div className="fade-up" style={{ maxWidth:760, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(18,117,173,0.08)", border:"1px solid rgba(18,117,173,0.18)",
              color:C.blue, fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase",
              padding:"6px 16px", borderRadius:100, marginBottom:28, fontFamily:"Outfit, sans-serif" }}>
              🏥 For Hospitals, Clinics &amp; Facilitators
            </div>

            <h1 style={{ fontFamily:"Outfit, sans-serif", fontWeight:800,
              fontSize:isMobile?30:"clamp(2.4rem, 5vw, 4rem)",
              color:navy, lineHeight:1.06, letterSpacing:"-0.03em", marginBottom:20 }}>
              Reach international patients{" "}
              <em style={{ fontStyle:"italic", color:C.teal }}>who need you</em>
            </h1>

            <p style={{ color:C.textMd, fontSize:isMobile?15:17, maxWidth:520, margin:"0 auto 36px", lineHeight:1.7 }}>
              Join 1,669+ certified facilities listed on Hospital.com Global Health Services — the platform patients from 80+ countries trust to find world-class care abroad.
            </p>

            <button className="btn-primary"
              onClick={()=>document.getElementById("facility-form")?.scrollIntoView({behavior:"smooth"})}
              style={{ background:C.teal, color:"#fff", border:"none", borderRadius:28,
                padding:isMobile?"14px 28px":"16px 44px", fontFamily:"Outfit, sans-serif",
                fontWeight:700, fontSize:isMobile?15:17, cursor:"pointer" }}>
              Apply to List Your Facility
            </button>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", alignItems:"center", gap:isMobile?24:48, flexWrap:"wrap",
            justifyContent:"center", marginTop:52, position:"relative", zIndex:1 }}>
            {[
              { num:"1,669+", label:"Certified Facilities Listed" },
              { num:"80+",    label:"Countries Covered" },
              { num:"500K+",  label:"Annual Patient Inquiries" },
              { num:"$0",     label:"Upfront Listing Fee" },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap:isMobile?24:48 }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize:isMobile?22:28, color:navy, lineHeight:1, letterSpacing:"-0.03em" }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize:11, color:C.textSm, marginTop:4, fontWeight:500 }}>{s.label}</div>
                </div>
                {i < arr.length-1 && !isMobile && <div style={{ width:1, height:36, background:C.border }}/>}
              </div>
            ))}
          </div>
        </div>

        {/* ── WHY LIST ──────────────────────────────────────────────────────── */}
        <div style={{ padding:isMobile?"64px 20px":"88px 48px", background:C.offWhite }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <div style={{ marginBottom:isMobile?40:56, textAlign:"center" }}>
              <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:C.blue, marginBottom:8 }}>Why Hospital.com</div>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?24:32, color:navy, letterSpacing:"-0.02em" }}>
                Everything a facility needs to{" "}
                <em style={{ fontStyle:"italic", color:C.blue }}>grow internationally</em>
              </h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3, 1fr)", gap:isMobile?16:24 }}>
              {[
                { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
                  title:"Global Patient Reach", desc:"Your facility is discoverable by high-intent patients from North America, Europe, Australia, and beyond — actively comparing international treatment options." },
                { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
                  title:"Transparent Quote System", desc:"Patients submit detailed treatment requests. You receive structured, pre-qualified leads with procedure, budget, and travel timeline included." },
                { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 12 2a8 8 0 0 0-8 8.2c0 7.3 8 11.8 8 11.8z"/><polyline points="9 12 11 14 15 10"/></svg>,
                  title:"Verified Accreditation Badge", desc:"JCI, ISO 9001, TEMOS, and other accreditations are displayed prominently on your profile, building immediate trust with international patients." },
                { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
                  title:"AI-Powered Matching", desc:"Our AI assistant matches patients to your facility based on procedure, destination preference, budget, and accreditation — not just keyword search." },
                { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
                  title:"Lead Audit Dashboard", desc:"Track every inquiry, quote sent, and conversion in your dedicated dashboard — with full transparency shared between your team and our coordinators." },
                { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
                  title:"Coordinator Network", desc:"Our network of medical tourism facilitators can act as your patient liaisons — handling travel, accommodation, and communication so your team focuses on care." },
              ].map(b => (
                <div key={b.title} style={{ background:"white", border:`1.5px solid ${C.borderLt}`, borderRadius:16, padding:"28px 26px" }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:C.blueLt, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>{b.icon}</div>
                  <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:15, color:navy, marginBottom:8 }}>{b.title}</div>
                  <div style={{ color:C.textSm, fontSize:13, lineHeight:1.65 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <div style={{ padding:isMobile?"64px 20px":"88px 48px", background:"white" }}>
          <div style={{ maxWidth:1000, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:isMobile?40:56 }}>
              <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:C.blue, marginBottom:8 }}>Simple Process</div>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?24:32, color:navy, letterSpacing:"-0.02em" }}>
                From application to{" "}
                <em style={{ fontStyle:"italic", color:C.blue }}>live listing</em>{" "}in days
              </h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4, 1fr)", gap:isMobile?24:0, position:"relative" }}>
              {!isMobile && (
                <div style={{ position:"absolute", top:36, left:"calc(12.5% + 28px)", right:"calc(12.5% + 28px)", height:2,
                  background:`linear-gradient(90deg, ${C.teal}, ${C.blue})`, zIndex:0 }} />
              )}
              {[
                { num:"1", title:"Submit Application", desc:"Fill in your facility details, accreditation type, specialties, and contact information." },
                { num:"2", title:"Document Verification", desc:"Our team verifies your accreditation certificates and licensing within 3–5 business days." },
                { num:"3", title:"Profile Goes Live", desc:"Your facility page is published with your procedures, pricing range, and verified badge." },
                { num:"4", title:"Receive Patient Inquiries", desc:"Qualified patients submit treatment requests directly to your inbox and lead dashboard." },
              ].map(step => (
                <div key={step.num} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:isMobile?0:"0 28px", position:"relative", zIndex:1 }}>
                  <div style={{ width:72, height:72, borderRadius:"50%", background:"white",
                    border:`2px solid ${C.teal}`, display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize:22, color:C.blue,
                    marginBottom:24, boxShadow:`0 0 0 6px rgba(70,196,217,0.1)` }}>
                    {step.num}
                  </div>
                  <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:15, color:navy, marginBottom:10 }}>{step.title}</div>
                  <div style={{ fontSize:13, color:C.textSm, lineHeight:1.65, maxWidth:200 }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ACCREDITATION CALLOUT ─────────────────────────────────────────── */}
        <div style={{ padding:isMobile?"0 20px 64px":"0 48px 88px", background:"white" }}>
          <div style={{ maxWidth:1000, margin:"0 auto",
            background:`linear-gradient(135deg, rgba(18,117,173,0.05), rgba(70,196,217,0.06))`,
            border:`1.5px solid rgba(70,196,217,0.25)`, borderRadius:16, padding:"28px 32px",
            display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
            <div style={{ width:52, height:52, background:"white", borderRadius:"50%",
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 2px 12px rgba(18,117,173,0.12)`, flexShrink:0 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 12 2a8 8 0 0 0-8 8.2c0 7.3 8 11.8 8 11.8z"/><polyline points="9 12 11 14 15 10"/></svg>
            </div>
            <div style={{ flex:1 }}>
              <h4 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:15, color:navy, marginBottom:4 }}>We Only List Accredited Facilities</h4>
              <p style={{ fontSize:13, color:C.textSm, lineHeight:1.55, maxWidth:580 }}>Every facility on Hospital.com Global Health Services has been independently verified for internationally recognised accreditation. We do not list uncertified providers.</p>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["✓ JCI","✓ ISO 9001","✓ TEMOS","✓ DNV GL","✓ HAS"].map(b => (
                <div key={b} style={{ background:"white", border:`1px solid ${C.border}`, borderRadius:8,
                  padding:"6px 12px", fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700,
                  color:navy, display:"flex", alignItems:"center", gap:4 }}>{b}</div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PRICING TIERS ─────────────────────────────────────────────────── */}
        <div style={{ padding:isMobile?"64px 20px":"88px 48px", background:C.offWhite }}>
          <div style={{ maxWidth:900, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:isMobile?40:52 }}>
              <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:C.blue, marginBottom:8 }}>Membership Tiers</div>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?24:32, color:navy, letterSpacing:"-0.02em" }}>
                Plans that grow{" "}
                <em style={{ fontStyle:"italic", color:C.blue }}>with your practice</em>
              </h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3, 1fr)", gap:20 }}>
              {[
                { tier:"Free",
                  price:"$0", period:"forever",
                  badge:null,
                  features:["Basic facility listing","Verified accreditation badge","Procedure & pricing display","Patient inquiry form","Standard search placement"],
                  cta:"Apply Free", primary:false },
                { tier:"Professional",
                  price:"~$100–200", period:"per year",
                  badge:"Most Popular",
                  features:["Everything in Free","Priority search placement","Enhanced profile with photos","Featured in destination pages","Monthly performance report","Dedicated account contact"],
                  cta:"Apply & Upgrade", primary:true },
                { tier:"Pay-per-Lead",
                  price:"Custom", period:"per qualified lead",
                  badge:null,
                  features:["No upfront commitment","Pay only for verified inquiries","Full lead audit dashboard","Shared with coordinators","Scales with your capacity"],
                  cta:"Talk to Us", primary:false },
              ].map(plan => (
                <div key={plan.tier} style={{
                  background:plan.primary?navy:"white",
                  border:`1.5px solid ${plan.primary?navy:C.borderLt}`,
                  borderRadius:16, padding:"32px 28px", position:"relative",
                  boxShadow:plan.primary?"0 12px 40px rgba(7,30,52,0.18)":"none",
                }}>
                  {plan.badge && (
                    <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)",
                      background:C.teal, color:"white", fontSize:11, fontWeight:700, padding:"4px 14px",
                      borderRadius:100, fontFamily:"Outfit, sans-serif", letterSpacing:"0.08em",
                      textTransform:"uppercase", whiteSpace:"nowrap" }}>
                      {plan.badge}
                    </div>
                  )}
                  <div style={{ fontFamily:"Outfit, sans-serif", fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:plan.primary?C.teal:C.blue, marginBottom:8 }}>{plan.tier}</div>
                  <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize:28, color:plan.primary?"white":navy, lineHeight:1, marginBottom:4 }}>{plan.price}</div>
                  <div style={{ fontSize:12, color:plan.primary?"rgba(255,255,255,0.45)":C.textSm, marginBottom:24 }}>{plan.period}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
                    {plan.features.map(feat => (
                      <div key={feat} style={{ display:"flex", alignItems:"flex-start", gap:9 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.primary?C.teal:C.blue} strokeWidth="2.5" style={{ flexShrink:0, marginTop:1 }}><polyline points="20,6 9,17 4,12"/></svg>
                        <span style={{ fontSize:13, color:plan.primary?"rgba(255,255,255,0.75)":C.textMd, lineHeight:1.4 }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={()=>document.getElementById("facility-form")?.scrollIntoView({behavior:"smooth"})}
                    style={{ width:"100%", padding:"12px", borderRadius:10,
                      background:plan.primary?C.teal:"transparent",
                      color:plan.primary?"white":C.blue,
                      border:plan.primary?"none":`1.5px solid ${C.blue}`,
                      fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:14, cursor:"pointer",
                      transition:"all .2s" }}
                    onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.opacity="0.85";b.style.transform="translateY(-1px)";}}
                    onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.opacity="1";b.style.transform="none";}}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <div style={{ padding:isMobile?"64px 20px":"88px 48px", background:"white" }}>
          <div style={{ maxWidth:680, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:40 }}>
              <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:C.blue, marginBottom:8 }}>FAQ</div>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?22:28, color:navy, letterSpacing:"-0.02em" }}>Common questions</h2>
            </div>
            {faqs.map((faq,i) => (
              <div key={i} style={{ borderBottom:`1px solid ${C.borderLt}` }}>
                <button onClick={()=>setFaqOpen(faqOpen===i?null:i)}
                  style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
                    padding:"18px 4px", background:"none", border:"none", cursor:"pointer",
                    fontFamily:"inherit", textAlign:"left" }}>
                  <span style={{ fontFamily:"Outfit, sans-serif", fontWeight:600, fontSize:14.5, color:navy, paddingRight:16 }}>{faq.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5"
                    style={{ flexShrink:0, transition:"transform .2s", transform:faqOpen===i?"rotate(180deg)":"none" }}>
                    <polyline points="6,9 12,15 18,9"/>
                  </svg>
                </button>
                {faqOpen===i && (
                  <div className="fade-up" style={{ padding:"0 4px 18px", color:C.textSm, fontSize:13.5, lineHeight:1.7 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── APPLICATION FORM ──────────────────────────────────────────────── */}
        <div id="facility-form" style={{ padding:isMobile?"64px 20px":"88px 48px", background:C.offWhite }}>
          <div style={{ maxWidth:580, margin:"0 auto" }}>
            <div style={{ background:"white", border:`1px solid ${C.borderLt}`, borderRadius:20,
              padding:isMobile?"28px 20px":"44px 40px",
              boxShadow:"0 8px 48px rgba(16,117,173,0.10)" }}>
              <div style={{ textAlign:"center", marginBottom:28 }}>
                <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:C.blue, marginBottom:10 }}>Apply Now</div>
                <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:22, fontWeight:800, color:navy, marginBottom:8 }}>List Your Facility</h2>
                <p style={{ color:C.textSm, fontSize:13, lineHeight:1.6 }}>Submit your details and our Global Health Services team will be in touch within 3–5 business days.</p>
              </div>

              {/* Facility Type */}
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, color:C.text, marginBottom:6 }}>Facility Type *</label>
                <div style={{ display:"flex", gap:8 }}>
                  {["Hospital / Clinic","Medical Tourism Facilitator"].map(t => (
                    <button key={t} onClick={()=>setF(p=>({...p,type:t}))}
                      style={{ flex:1, padding:"10px 12px", borderRadius:10, fontSize:12.5, fontWeight:600,
                        border:`1.5px solid ${f.type===t?C.teal:C.border}`,
                        background:f.type===t?C.tealLt:"white",
                        color:f.type===t?C.teal:C.textMd, cursor:"pointer", fontFamily:"inherit",
                        transition:"all .15s", textAlign:"center" as const }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <FieldInput label="Facility / Organisation Name *" type="text" value={f.facilityName}
                onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,facilityName:e.target.value}))}
                placeholder="e.g. Apollo Hospitals, Estetik International" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <FieldInput label="City *" type="text" value={f.city}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,city:e.target.value}))}
                  placeholder="e.g. Istanbul" />
                <FieldInput label="Country *" type="text" value={f.country}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,country:e.target.value}))}
                  placeholder="e.g. Turkey" />
              </div>
              <FieldInput label="Accreditation(s) *" type="text" value={f.accreditation}
                onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,accreditation:e.target.value}))}
                placeholder="e.g. JCI, ISO 9001, TEMOS" />
              <FieldInput label="Specialties / Procedures Offered *" type="text" value={f.specialties}
                onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,specialties:e.target.value}))}
                placeholder="e.g. Cardiac Surgery, Hair Transplant, IVF" />
              <FieldInput label="Contact Name *" type="text" value={f.contactName}
                onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,contactName:e.target.value}))}
                placeholder="Your full name" />
              <FieldInput label="Email *" type="email" value={f.email}
                onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,email:e.target.value}))}
                placeholder="contact@yourfacility.com" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <FieldInput label="Phone" type="tel" value={f.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,phone:e.target.value}))}
                  placeholder="+90 212-555-0000" />
                <FieldInput label="Website" type="url" value={f.website}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,website:e.target.value}))}
                  placeholder="https://yourfacility.com" />
              </div>

              <button className="btn-primary"
                onClick={()=>{ if(f.facilityName&&f.country&&f.email) setDone(true); }}
                style={{ width:"100%", background:C.teal, color:"#fff", border:"none",
                  borderRadius:28, padding:"14px", fontFamily:"Outfit, sans-serif",
                  fontWeight:700, fontSize:15, cursor:"pointer", marginTop:8 }}>
                Submit Application
              </button>
              <p style={{ textAlign:"center", fontSize:11.5, color:C.textSm, marginTop:14, lineHeight:1.55 }}>
                By submitting you agree to our Terms of Service and Privacy Policy. Hospital.com does not charge patients for using the platform.
              </p>
            </div>
          </div>
        </div>

        {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
        <div style={{ background:navy, padding:isMobile?"64px 20px":"88px 48px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, pointerEvents:"none",
            background:`radial-gradient(ellipse 60% 80% at 20% 50%, rgba(70,196,217,0.09) 0%, transparent 60%),
              radial-gradient(ellipse 50% 70% at 80% 50%, rgba(18,117,173,0.10) 0%, transparent 60%)` }}/>
          <div style={{ position:"relative" }}>
            <h2 style={{ fontFamily:"Outfit, sans-serif", color:"white", fontSize:isMobile?24:34,
              fontWeight:800, marginBottom:14, letterSpacing:"-0.03em", lineHeight:1.1 }}>
              Ready to reach international patients?
            </h2>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:isMobile?14:16, marginBottom:32,
              maxWidth:460, margin:"0 auto 32px", lineHeight:1.7 }}>
              Join a network patients in 80+ countries trust when searching for world-class care abroad.
            </p>
            <button className="btn-primary"
              onClick={()=>document.getElementById("facility-form")?.scrollIntoView({behavior:"smooth"})}
              style={{ background:C.teal, color:"#fff", border:"none", borderRadius:28,
                padding:"15px 44px", fontFamily:"Outfit, sans-serif",
                fontWeight:700, fontSize:17, cursor:"pointer" }}>
              Apply to List Your Facility
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
