import { useState, type ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useIsMobile from "@/lib/hooks/useIsMobile";
import Footer from "@/components/layout/Footer";

const PROVIDERS = [
  { id:901, name:"Dr. Michael Torres", rating:4.8, reviews:247, address:"8635 W 3rd St, Ste 320, Los Angeles", photo:"https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face", image:"MT", tags:["Opioid Use Disorder","Buprenorphine","MOUD"], contracted:true, available:true },
  { id:902, name:"Dr. Jennifer Kim", rating:4.7, reviews:189, address:"1450 10th St, Ste 200, Santa Monica", photo:"https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=150&h=150&fit=crop&crop=face", image:"JK", tags:["Alcohol Use Disorder","Mental Health","Telehealth"], contracted:true, available:true },
  { id:903, name:"Westside Recovery Center", rating:4.5, reviews:312, address:"2001 Santa Monica Blvd, Los Angeles", photo:"https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=150&h=150&fit=crop&crop=face", image:"WR", tags:["Outpatient Rehab","MOUD","Harm Reduction"], contracted:false, available:false },
];

const FAQS = [
  { q:"What does an Addiction Medicine Specialist do?", a:"An Addiction Medicine Specialist diagnoses and treats substance use disorders through FDA-approved medications and behavioral health coordination. They prescribe buprenorphine, naltrexone, and methadone for opioid and alcohol use disorders, manage medically supervised withdrawal, and develop personalized treatment plans that address both the physical and behavioral dimensions of addiction. They also treat medical complications of substance use and coordinate care with counselors, psychiatrists, and social workers." },
  { q:"How do I choose the right Addiction Medicine Specialist in Los Angeles?", a:"Start by confirming the physician holds board certification through the American Board of Preventive Medicine (ABPM) or the American Board of Addiction Medicine (ABAM). Check whether they accept your insurance, including Medi-Cal or Medicare. If you have a co-occurring psychiatric condition, look for integrated behavioral health services. Providers listed on Hospital.com are sourced from public licensing directories — confirm details directly with the office." },
  { q:"Is what I share with an Addiction Medicine Specialist confidential?", a:"Yes. Addiction medicine records are protected by standard HIPAA rules and by 42 CFR Part 2, which restricts disclosure of substance use disorder treatment records more strictly than general medical records. Your physician cannot share your treatment information with law enforcement, employers, or family members without written consent, with narrow exceptions for emergencies." },
  { q:"How much does an Addiction Medicine Specialist cost in Los Angeles?", a:"An initial consultation at a private practice typically ranges from $200 to $500 without insurance. Follow-up visits are generally $100 to $250. Medi-Cal covers addiction medicine visits and MOUD with no cost-sharing for most eligible members. Community health centers and county-funded programs offer sliding-scale or no-cost services for uninsured patients. Contact LA County SAPC at 1-800-854-7771 for options." },
  { q:"Does Medi-Cal cover Addiction Medicine Specialist services in Los Angeles?", a:"Yes. Medi-Cal covers addiction medicine services through the Drug Medi-Cal Organized Delivery System (DMC-ODS), including assessments, outpatient counseling, residential treatment, medically supervised detoxification, and MOUD. Since 2023, Medi-Cal no longer requires prior authorization for most buprenorphine medications. LA Care Health Plan and Health Net contract with multiple addiction medicine providers across the city." },
  { q:"Can I see an Addiction Medicine Specialist in Los Angeles over telehealth?", a:"Yes. Several addiction medicine practices in Los Angeles offer telehealth visits for initial consultations, medication management, and behavioral health coordination. Following regulatory changes, prescribing buprenorphine via telehealth without a prior in-person visit became permissible under federal rules. Confirm telehealth availability and your insurer's coverage policy with the specific practice before scheduling." },
];

function AccordionItem({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border:`1px solid ${open?"rgba(50,204,224,.35)":"#e8eef2"}`, borderRadius:12, overflow:"hidden", background:"#fff", transition:"border-color .2s" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:"100%", display:"flex", alignItems:"center", padding:"13px 18px", background:"none", border:"none", cursor:"pointer", fontFamily:"Outfit, sans-serif", gap:12, textAlign:"left" as const }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#32cce0" strokeWidth="2.5" style={{ flexShrink:0 }}><polyline points="20,6 9,17 4,12"/></svg>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:13.5, color:"#071e34" }}>{title}</div>
          <div style={{ fontSize:11.5, color:"#7a8fa0", marginTop:2 }}>{subtitle}</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={open?"#1075ad":"#5a7085"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, transition:"transform .2s", transform:open?"rotate(180deg)":"none" }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && <div style={{ padding:"0 18px 16px 46px", fontSize:13, color:"#5a7085", lineHeight:1.7, borderTop:"1px solid #f0f4f6" }}>{children}</div>}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:"1px solid #e8eef2" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 0", background:"none", border:"none", cursor:"pointer", fontFamily:"Outfit, sans-serif", fontWeight:600, fontSize:14, color:open?"#1075ad":"#071e34", textAlign:"left" as const, gap:12, transition:"color .2s" }}>
        {q}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={open?"#1075ad":"#5a7085"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, transition:"transform .22s", transform:open?"rotate(180deg)":"none" }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && <div style={{ paddingBottom:18, fontSize:13.5, color:"#5a7085", lineHeight:1.7 }}>{a}</div>}
    </div>
  );
}

function ProviderCard({ p, router }: { p: typeof PROVIDERS[0]; router: ReturnType<typeof useRouter> }) {
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={() => router.push(`/providers/${p.id}`)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background:"#fff", border:`1.5px solid ${hovered?"#32cce0":"#e8eef2"}`, borderRadius:14, padding:"18px 20px", cursor:"pointer", display:"flex", gap:14, alignItems:"flex-start", boxShadow:hovered?"0 8px 32px rgba(16,117,173,.12)":"0 1px 4px rgba(0,0,0,.05)", transition:"all .2s", position:"relative" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#32cce0,#1075ad)", transform:hovered?"scaleX(1)":"scaleX(0)", transformOrigin:"left", transition:"transform .3s", borderRadius:"14px 14px 0 0" }}/>
      <div style={{ width:52, height:52, borderRadius:"50%", overflow:"hidden", flexShrink:0, background:"linear-gradient(135deg,#eef9fc,#c8edf7)", border:"2px solid #cce4f0", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:15, color:"#1075ad" }}>
        {p.photo && !imgErr
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={p.photo} alt={p.name} onError={() => setImgErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          : p.image}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:2 }}>
          <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:15, color:"#071e34" }}>{p.name}</div>
          {p.contracted && <span style={{ fontSize:9.5, fontWeight:700, background:"rgba(50,204,224,.1)", border:"1px solid rgba(50,204,224,.3)", color:"#1075ad", padding:"3px 8px", borderRadius:100, whiteSpace:"nowrap" as const, flexShrink:0 }}>✓ Verified</span>}
        </div>
        <div style={{ fontSize:12, color:"#5a7085", marginBottom:8 }}>Addiction Medicine · Los Angeles, CA</div>
        <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, marginBottom:8 }}>
          <span style={{ color:"#f0c840" }}>{[1,2,3,4,5].map(s => <span key={s}>{s <= Math.round(p.rating)?"★":"☆"}</span>)}</span>
          <strong style={{ color:"#071e34" }}>{p.rating}</strong>
          <span style={{ color:"#5a7085" }}>({p.reviews} reviews)</span>
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" as const, marginBottom:10 }}>
          {p.tags.map(t => <span key={t} style={{ fontSize:10.5, fontWeight:600, color:"#1075ad", background:"rgba(16,117,173,.07)", padding:"3px 9px", borderRadius:100, border:"1px solid rgba(16,117,173,.15)" }}>{t}</span>)}
        </div>
        <div style={{ fontSize:11.5, color:"#5a7085", marginBottom:12 }}>{p.address}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:11.5, color:"#16a96a", fontWeight:600 }}>● {p.available?"Available Today":"Call to schedule"}</span>
          <button onClick={e => { e.stopPropagation(); router.push(`/providers/${p.id}`); }} style={{ fontFamily:"Outfit, sans-serif", fontSize:13, fontWeight:700, color:"#fff", background:"#1075ad", padding:"7px 16px", border:"none", borderRadius:8, cursor:"pointer", transition:"background .18s" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background="#0b5e8c"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background="#1075ad"}>
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LAAddictionMedicinePage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <>
      <Head>
        <title>Addiction Medicine Specialists in Los Angeles, CA | Hospital.com</title>
        <meta name="description" content="Find board-certified addiction medicine specialists in Los Angeles, CA. Compare providers, read patient reviews, and book appointments. Medi-Cal, Medicare, and private insurance accepted." />
        <link rel="canonical" href="https://www.hospital.com/find-local-care/addiction-medicine-specialist/los-angeles-ca" />
      </Head>

      {/* Nav */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:isMobile?"0 20px":"0 48px", height:68, background:"rgba(7,30,52,.96)", backdropFilter:"blur(8px)", borderBottom:"1px solid rgba(50,204,224,.1)" }}>
        <button onClick={() => router.push("/")} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"Outfit, sans-serif", fontSize:20, fontWeight:700, color:"#fff", padding:0 }}>
          hospital<span style={{ color:"#32cce0" }}>.com</span>
        </button>
        {!isMobile && (
          <div style={{ display:"flex", gap:28, alignItems:"center" }}>
            <button onClick={() => router.push("/find-local-care")} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:14, fontWeight:500, color:"rgba(255,255,255,.7)", padding:0 }}>Find Local Care</button>
            <button onClick={() => router.push("/find-local-care")} style={{ background:"#32cce0", color:"#071e34", border:"none", padding:"9px 20px", borderRadius:8, fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:14, cursor:"pointer" }}>Search Providers</button>
          </div>
        )}
      </nav>

      <div style={{ paddingTop:68 }}>
        {/* Hero */}
        <section style={{ background:"#f0fafe", padding:isMobile?"48px 20px 40px":"64px 48px 56px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"linear-gradient(rgba(16,117,173,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,117,173,.05) 1px, transparent 1px)", backgroundSize:"60px 60px" }}/>
          <div style={{ position:"absolute", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse 60% 65% at -5% 50%, rgba(50,204,224,.2) 0%, transparent 55%)" }}/>
          <div style={{ maxWidth:1200, margin:"0 auto", position:"relative" }}>
            {/* Breadcrumb */}
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#5a7085", marginBottom:20, flexWrap:"wrap" as const }}>
              <button onClick={() => router.push("/find-local-care")} style={{ background:"none", border:"none", cursor:"pointer", color:"#1075ad", fontFamily:"inherit", fontSize:12, padding:0 }}>Find Local Care</button>
              <span>/</span>
              <button onClick={() => router.push("/find-local-care/acupuncturist")} style={{ background:"none", border:"none", cursor:"pointer", color:"#1075ad", fontFamily:"inherit", fontSize:12, padding:0 }}>Addiction Medicine</button>
              <span>/</span>
              <span style={{ color:"#071e34", fontWeight:600 }}>Los Angeles, CA</span>
            </div>

            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(50,204,224,.12)", border:"1px solid rgba(50,204,224,.35)", color:"#1075ad", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, padding:"6px 16px", borderRadius:100, marginBottom:20, fontFamily:"Outfit, sans-serif" }}>
              Los Angeles, CA
            </div>
            <h1 style={{ fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize:isMobile?28:50, color:"#071e34", lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:16, maxWidth:760 }}>
              Addiction Medicine Specialists<br/>in{" "}
              <em style={{ fontStyle:"italic", color:"#32cce0" }}>Los Angeles, CA</em>
            </h1>
            <p style={{ color:"#5a7085", fontSize:isMobile?14:16, maxWidth:560, lineHeight:1.7, marginBottom:16 }}>
              Compare board-certified addiction medicine specialists in Los Angeles. Read patient reviews, check insurance coverage, and book appointments.
            </p>
            <div style={{ fontSize:11.5, color:"#7a8fa0" }}>
              Reviewed by Hospital.com editorial team · Last updated April 2026
            </div>
          </div>
        </section>

        {/* Crisis strip — always visible */}
        <div style={{ background:"#fff5f4", borderBottom:"1.5px solid rgba(192,57,43,.16)", padding:isMobile?"11px 20px":"10px 48px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", gap:isMobile?10:24, flexWrap:"wrap" as const }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
              <div style={{ width:20, height:20, borderRadius:"50%", background:"#c0392b", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <span style={{ fontWeight:800, fontSize:13, color:"#c0392b", fontFamily:"Outfit, sans-serif" }}>In crisis?</span>
            </div>
            <a href="tel:988" style={{ fontSize:13, color:"#3a4a5c", textDecoration:"none" }}>Call or text <strong style={{ color:"#071e34" }}>988</strong></a>
            {!isMobile && <span style={{ color:"#d0d8e0" }}>·</span>}
            <a href="tel:18006624357" style={{ fontSize:13, color:"#3a4a5c", textDecoration:"none" }}>SAMHSA: <strong style={{ color:"#071e34" }}>1-800-662-4357</strong></a>
            {!isMobile && <span style={{ color:"#d0d8e0" }}>·</span>}
            <a href="tel:18008547771" style={{ fontSize:13, color:"#3a4a5c", textDecoration:"none" }}>LA County SAPC: <strong style={{ color:"#071e34" }}>1-800-854-7771</strong></a>
            {!isMobile && <span style={{ fontSize:11.5, color:"#7a8fa0", marginLeft:"auto" }}>Free · Confidential · 24/7</span>}
          </div>
        </div>

        {/* Main layout */}
        <div style={{ maxWidth:1200, margin:"0 auto", padding:isMobile?"32px 20px":"56px 48px", display:"flex", gap:isMobile?0:48, alignItems:"flex-start", flexDirection:isMobile?"column":"row" as const }}>

          {/* Left: content */}
          <div style={{ flex:1, minWidth:0 }}>

            {/* What they treat */}
            <section style={{ marginBottom:48 }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?22:28, color:"#071e34", marginBottom:16, letterSpacing:"-0.02em" }}>
                What an Addiction Medicine Specialist Treats
              </h2>
              <p style={{ fontSize:15, color:"#3a4a5c", lineHeight:1.8, marginBottom:16 }}>
                An Addiction Medicine Specialist is a physician who has completed fellowship training and board certification specifically in the diagnosis and treatment of substance use disorders (SUDs). These disorders involve compulsive use of alcohol, opioids (including heroin, fentanyl, and prescription painkillers), stimulants, benzodiazepines, cannabis, and nicotine, despite harmful consequences.
              </p>
              <div style={{ display:"flex", flexDirection:"column" as const, gap:10, marginTop:4 }}>
                {[
                  { title:"What they manage", desc:"Supervised withdrawal, MOUD for opioids and alcohol, relapse prevention, and care coordination with mental health and social services. ASAM classifies addiction as a chronic brain disease requiring sustained medical management." },
                  { title:"How they differ from other providers", desc:"Unlike Addiction Psychiatrists (focused on co-occurring psychiatric illness) or Primary Care Physicians (who handle mild to moderate cases), Addiction Medicine Specialists hold specific MOUD prescribing authority and manage medically complex, severe SUDs." },
                ].map(c => (
                  <div key={c.title} style={{ padding:"14px 18px", background:"#f0fafe", borderRadius:12, borderLeft:"3px solid #1075ad" }}>
                    <div style={{ fontWeight:700, fontSize:13, color:"#071e34", marginBottom:4 }}>{c.title}</div>
                    <div style={{ fontSize:13, color:"#5a7085", lineHeight:1.65 }}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Conditions */}
            <section style={{ marginBottom:48 }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?20:24, color:"#071e34", marginBottom:16, letterSpacing:"-0.02em" }}>
                Conditions Commonly Treated
              </h2>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"10px 24px" }}>
                {[
                  "Opioid use disorder (OUD) — heroin, fentanyl, prescription opioids",
                  "Alcohol use disorder (AUD) — moderate to severe dependence",
                  "Stimulant use disorder — methamphetamine, cocaine",
                  "Benzodiazepine and sedative-hypnotic dependence",
                  "Nicotine use disorder and tobacco dependence",
                  "Cannabis use disorder",
                  "Polysubstance use",
                  "Co-occurring chronic pain with substance use",
                ].map(c => (
                  <div key={c} style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"10px 14px", background:"#f8fbfc", borderRadius:10, border:"1px solid #e8eef2", fontSize:13.5, color:"#3a4a5c", lineHeight:1.5 }}>
                    <span style={{ color:"#1075ad", fontWeight:700, flexShrink:0, marginTop:1 }}>·</span>
                    {c}
                  </div>
                ))}
              </div>
            </section>

            {/* Treatments */}
            <section style={{ marginBottom:48 }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?20:24, color:"#071e34", marginBottom:16, letterSpacing:"-0.02em" }}>
                Treatments and Medications
              </h2>
              <p style={{ fontSize:13.5, color:"#5a7085", lineHeight:1.7, marginBottom:14 }}>
                According to NIDA, combining medication with behavioral treatment produces better outcomes than either approach alone. Click any treatment to learn more.
              </p>
              <div style={{ display:"flex", flexDirection:"column" as const, gap:8 }}>
                {[
                  { name:"Buprenorphine (Suboxone, Sublocade)", tag:"Opioid Use Disorder · MOUD", desc:"Partial opioid agonist that reduces cravings and withdrawal symptoms. Extended-release injectable (Sublocade) is given monthly in-office. Prescribing now allowed via telehealth without a prior in-person visit." },
                  { name:"Methadone", tag:"Opioid Use Disorder · OTP", desc:"Full opioid agonist dispensed through federally licensed opioid treatment programs (OTPs). Patients typically attend a clinic daily for observed dosing, with take-home doses available after a stabilization period." },
                  { name:"Naltrexone (Vivitrol)", tag:"Opioids · Alcohol", desc:"Opioid antagonist available as a daily tablet or monthly injection. Blocks the rewarding effects of opioids and significantly reduces alcohol cravings. Requires full opioid detox before starting." },
                  { name:"Naloxone (Narcan)", tag:"Overdose Reversal", desc:"Emergency overdose reversal medication prescribed to patients and household members as part of harm reduction. Available at many LA pharmacies without a prescription under California law." },
                  { name:"Acamprosate & Disulfiram", tag:"Alcohol Use Disorder", desc:"Acamprosate reduces post-acute withdrawal discomfort and is used for maintenance after detox. Disulfiram creates an aversion reaction to alcohol as a behavioral deterrent." },
                  { name:"CBT & Motivational Interviewing", tag:"Behavioral Therapy", desc:"Cognitive Behavioral Therapy (CBT) and Motivational Interviewing (MI) are coordinated alongside medications for comprehensive, evidence-based treatment." },
                ].map(t => <AccordionItem key={t.name} title={t.name} subtitle={t.tag}>{t.desc}</AccordionItem>)}
              </div>
            </section>

            {/* When to see */}
            <section style={{ marginBottom:48 }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?20:24, color:"#071e34", marginBottom:16, letterSpacing:"-0.02em" }}>
                When to See an Addiction Medicine Specialist in Los Angeles
              </h2>
              <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
                {[
                  "You experience physical withdrawal symptoms (sweating, tremors, nausea, or seizures) when trying to stop alcohol or benzodiazepines — which can be life-threatening without supervision.",
                  "You have attempted to stop using opioids multiple times and continue to relapse. MOUD significantly reduces relapse and overdose risk.",
                  "You are using opioids daily or near-daily, especially illicit fentanyl or heroin, which carries acute overdose risk.",
                  "You were recently discharged from an emergency department after a non-fatal overdose.",
                  "Substance use is causing medical complications such as alcohol-related liver disease, endocarditis, or cardiac complications from stimulant use.",
                  "Your primary care physician is not trained to prescribe buprenorphine or manage medically complex withdrawal.",
                ].map((item, i) => (
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", fontSize:14, color:"#3a4a5c", lineHeight:1.6 }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:"rgba(50,204,224,.12)", border:"1px solid rgba(50,204,224,.3)", color:"#1075ad", fontSize:11, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>{i+1}</div>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* What to expect */}
            <section style={{ marginBottom:48 }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?20:24, color:"#071e34", marginBottom:16, letterSpacing:"-0.02em" }}>
                What to Expect at Your First Appointment
              </h2>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr", gap:14 }}>
                {[
                  { step:1, title:"History & Screening", desc:"45–60 min visit covering substance use history, prior treatment attempts, withdrawal experiences, overdose history, and current medications." },
                  { step:2, title:"Assessment & Tests", desc:"Validated tools such as AUDIT or DAST-10. Blood work may be ordered to assess liver function, viral hepatitis status, and overall health." },
                  { step:3, title:"Treatment Plan", desc:"A personalized plan is built on the same day. Buprenorphine induction may start at the first visit. Several LA clinics offer same-day MOUD appointments." },
                ].map(s => (
                  <div key={s.step} style={{ padding:"18px 16px", background:"#fff", border:"1px solid #e8eef2", borderRadius:14, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(50,204,224,.12)", border:"1px solid rgba(50,204,224,.3)", color:"#1075ad", fontSize:13, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>{s.step}</div>
                    <div style={{ fontWeight:700, fontSize:13.5, color:"#071e34", marginBottom:7 }}>{s.title}</div>
                    <div style={{ fontSize:13, color:"#5a7085", lineHeight:1.65 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Local section */}
            <section style={{ marginBottom:48 }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?20:24, color:"#071e34", marginBottom:16, letterSpacing:"-0.02em" }}>
                Addiction Medicine in Los Angeles: What You Should Know
              </h2>
              <p style={{ fontSize:15, color:"#3a4a5c", lineHeight:1.8, marginBottom:14 }}>
                Los Angeles County operates one of the largest publicly funded substance use systems in the country, with providers across all major neighborhoods and multiple options for uninsured patients.
              </p>
              <div style={{ display:"flex", flexDirection:"column" as const, gap:10, marginBottom:16 }}>
                {[
                  { name:"UCLA Health Addiction Medicine Clinics", detail:"Board-certified specialists at Encino, Hollywood, Santa Monica, and Westwood. Services include MOUD and co-occurring mental health care. Phone: 310-319-4700." },
                  { name:"Kaiser Permanente Los Angeles Medical Center", detail:"Addiction Medicine department at 1505 N. Edgemont Street. Walk-in hours Mon–Fri 8:30am–4pm, Sat 9am–1pm for Kaiser members." },
                  { name:"Cedars-Sinai & USC Keck Medicine", detail:"Both incorporate addiction medicine within broader internal medicine and psychiatry departments, with referral pathways." },
                ].map(loc => (
                  <div key={loc.name} style={{ padding:"14px 18px", background:"#f0fafe", border:"1px solid rgba(50,204,224,.2)", borderRadius:12 }}>
                    <div style={{ fontWeight:700, fontSize:13.5, color:"#1075ad", marginBottom:4 }}>{loc.name}</div>
                    <div style={{ fontSize:13, color:"#5a7085", lineHeight:1.6 }}>{loc.detail}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column" as const, gap:8, marginBottom:4 }}>
                <div style={{ fontWeight:700, fontSize:13, color:"#071e34", marginBottom:4 }}>Coverage &amp; Insurance</div>
                {[
                  { label:"Medi-Cal", detail:"Covered under DMC-ODS. No prior authorization required for most buprenorphine since 2023. LA Care Health Plan and Health Net both contract with multiple LA providers." },
                  { label:"Medicare", detail:"Part B covers addiction medicine visits. Part D covers MOUD medications including buprenorphine and naltrexone." },
                  { label:"Private insurance", detail:"Most major carriers including Aetna, Cigna, and UnitedHealthcare cover addiction medicine and MOUD. Verify specific plan coverage before booking." },
                  { label:"Uninsured", detail:"Contact LA County SAPC at 1-800-854-7771. County-funded programs offer sliding-scale or no-cost services." },
                ].map(c => (
                  <div key={c.label} style={{ display:"flex", gap:12, padding:"11px 16px", background:"#fff", border:"1px solid #e8eef2", borderRadius:10, fontSize:13 }}>
                    <div style={{ fontWeight:700, color:"#1075ad", minWidth:100, flexShrink:0 }}>{c.label}</div>
                    <div style={{ color:"#5a7085", lineHeight:1.6 }}>{c.detail}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16, padding:"14px 20px", background:"rgba(50,204,224,.07)", borderRadius:12, border:"1px solid rgba(50,204,224,.2)" }}>
                <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:14, color:"#071e34", marginBottom:4 }}>Hospital.com in Los Angeles</div>
                <div style={{ fontSize:13, color:"#5a7085" }}>Hospital.com lists over <strong>80 Addiction Medicine Specialist providers</strong> currently in Los Angeles, aggregated from public listings and licensing directories. Several providers offer Spanish-language services and specialize in serving justice-involved individuals, people experiencing homelessness, and patients with co-occurring chronic pain.</div>
              </div>
            </section>

            {/* Providers */}
            <section style={{ marginBottom:48 }}>
              <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"#1075ad", marginBottom:8 }}>Featured Providers</div>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?20:24, color:"#071e34", marginBottom:20, letterSpacing:"-0.02em" }}>
                Addiction Medicine Specialists Near You
              </h2>
              <div style={{ display:"flex", flexDirection:"column" as const, gap:14 }}>
                {PROVIDERS.map(p => <ProviderCard key={p.id} p={p} router={router}/>)}
              </div>
              <div style={{ marginTop:18, textAlign:"center" as const }}>
                <button onClick={() => router.push("/find-local-care")} style={{ fontFamily:"Outfit, sans-serif", fontSize:14, fontWeight:700, color:"#1075ad", background:"none", border:"1.5px solid #1075ad", borderRadius:10, padding:"11px 28px", cursor:"pointer", transition:"all .2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background="#1075ad"; (e.currentTarget as HTMLButtonElement).style.color="#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background="none"; (e.currentTarget as HTMLButtonElement).style.color="#1075ad"; }}>
                  View all Los Angeles providers
                </button>
              </div>
            </section>

            {/* FAQ */}
            <section style={{ marginBottom:48 }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?20:24, color:"#071e34", marginBottom:4, letterSpacing:"-0.02em" }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize:13.5, color:"#7a8fa0", marginBottom:24 }}>About addiction medicine specialists in Los Angeles</p>
              <div style={{ border:"1px solid #e8eef2", borderRadius:14, padding:"0 24px", background:"#fff" }}>
                {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a}/>)}
              </div>
            </section>

            {/* Crisis resources */}
            <section style={{ marginBottom:48 }}>
              <div style={{ background:"linear-gradient(135deg,rgba(220,50,50,.06),rgba(220,50,50,.03))", border:"1.5px solid rgba(220,50,50,.2)", borderRadius:16, padding:"24px 28px" }}>
                <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize:16, color:"#c0392b", marginBottom:12 }}>Crisis Resources &amp; Safety Information</div>
                <p style={{ fontSize:14, color:"#5a7085", lineHeight:1.7, marginBottom:14 }}>If you or someone you love is in crisis, call or text <strong>988</strong> for the Suicide and Crisis Lifeline. For substance use specifically, SAMHSA&apos;s National Helpline is available at <strong>1-800-662-4357 (HELP)</strong>. Both services are free, confidential, and available 24/7.</p>
                <p style={{ fontSize:14, color:"#5a7085", lineHeight:1.7 }}>For local Los Angeles resources, contact <strong>LA County SAPC at 1-800-854-7771</strong>. This line can connect you with publicly funded treatment regardless of ability to pay.</p>
              </div>
            </section>

            {/* Sources */}
            <section>
              <AccordionItem title="Sources & Citations" subtitle="4 references">
                <div style={{ display:"flex", flexDirection:"column" as const, gap:8, paddingTop:4 }}>
                  {[
                    "Definition of Addiction. American Society of Addiction Medicine (ASAM). asam.org",
                    "What Are the Treatments for Drug Addiction? National Institute on Drug Abuse (NIDA). nida.nih.gov",
                    "Drug Medi-Cal Organized Delivery System (DMC-ODS). California DHCS. dhcs.ca.gov",
                    "SAMHSA National Helpline. samhsa.gov/find-help/national-helpline",
                  ].map((s, i) => (
                    <div key={i} style={{ fontSize:12, color:"#7a8fa0", lineHeight:1.6 }}>{i+1}. {s}</div>
                  ))}
                </div>
              </AccordionItem>
            </section>
          </div>

          {/* Right: sidebar */}
          {!isMobile && (
            <div style={{ width:300, flexShrink:0, position:"sticky", top:88 }}>

              {/* Stats card */}
              <div style={{ background:"#fff", border:"1px solid #e8eef2", borderRadius:16, padding:"22px 20px", marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
                <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:13, color:"#071e34", marginBottom:16 }}>Hospital.com in Los Angeles</div>
                {[
                  { n:"80+", l:"Addiction Medicine Specialists" },
                  { n:"Medi-Cal", l:"Coverage available" },
                  { n:"Same-day", l:"Appointments available" },
                  { n:"Telehealth", l:"Options available" },
                ].map(s => (
                  <div key={s.n} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #f0f4f6", fontSize:13 }}>
                    <span style={{ color:"#5a7085" }}>{s.l}</span>
                    <span style={{ fontWeight:700, color:"#1075ad" }}>{s.n}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ background:"linear-gradient(135deg,#071e34,#1075ad)", borderRadius:16, padding:"24px 20px", marginBottom:16, textAlign:"center" as const }}>
                <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize:17, color:"#fff", marginBottom:8, lineHeight:1.3 }}>Find a Specialist Today</div>
                <p style={{ fontSize:12.5, color:"rgba(255,255,255,.7)", marginBottom:18, lineHeight:1.6 }}>Search verified providers, check insurance, and book online.</p>
                <button onClick={() => router.push("/find-local-care")} style={{ width:"100%", background:"#32cce0", color:"#071e34", border:"none", borderRadius:10, padding:"12px 0", fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", transition:"background .15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background="#5cdaea"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background="#32cce0"}>
                  Search Providers
                </button>
              </div>

              {/* Local resources */}
              <div style={{ background:"rgba(220,50,50,.04)", border:"1.5px solid rgba(220,50,50,.15)", borderRadius:16, padding:"18px 20px" }}>
                <div style={{ fontWeight:700, fontSize:13, color:"#c0392b", marginBottom:12 }}>Crisis Lines</div>
                {[
                  { name:"988 Lifeline", detail:"Call or text 988 · 24/7" },
                  { name:"SAMHSA Helpline", detail:"1-800-662-4357 · 24/7" },
                  { name:"LA County SAPC", detail:"1-800-854-7771 · 24/7" },
                ].map(r => (
                  <div key={r.name} style={{ marginBottom:10 }}>
                    <div style={{ fontWeight:700, fontSize:12.5, color:"#071e34" }}>{r.name}</div>
                    <div style={{ fontSize:12, color:"#7a8fa0" }}>{r.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile crisis box */}
      {isMobile && (
        <div style={{ margin:"0 20px 32px", background:"rgba(220,50,50,.04)", border:"1.5px solid rgba(220,50,50,.15)", borderRadius:16, padding:"18px 20px" }}>
          <div style={{ fontWeight:700, fontSize:13, color:"#c0392b", marginBottom:12 }}>Crisis Lines</div>
          {[{ name:"988 Lifeline", detail:"24/7" },{ name:"SAMHSA: 1-800-662-4357", detail:"24/7" },{ name:"LA County SAPC: 1-800-854-7771", detail:"24/7" }].map(r => (
            <div key={r.name} style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#071e34", marginBottom:8 }}>
              <span style={{ fontWeight:600 }}>{r.name}</span>
              <span style={{ color:"#7a8fa0" }}>{r.detail}</span>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </>
  );
}
