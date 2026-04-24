import { useState, type ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useIsMobile from "@/lib/hooks/useIsMobile";
import Footer from "@/components/layout/Footer";

const PROVIDERS = [
  { id:911, name:"Dr. David Chen", rating:4.9, reviews:318, address:"240 E 38th St, Ste 1200, Murray Hill, New York", photo:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face", image:"DC", tags:["Opioid Use Disorder","Buprenorphine","MOUD"], contracted:true, available:true },
  { id:912, name:"Dr. Rachel Goldman", rating:4.8, reviews:204, address:"1305 York Ave, Ste 500, Upper East Side, New York", photo:"https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=150&h=150&fit=crop&crop=face", image:"RG", tags:["Alcohol Use Disorder","Co-occurring Disorders","CBT"], contracted:true, available:true },
  { id:913, name:"Columbia Recovery Services", rating:4.6, reviews:421, address:"630 W 168th St, Washington Heights, New York", photo:"https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=150&h=150&fit=crop&crop=face", image:"CR", tags:["Residential","MOUD","Harm Reduction"], contracted:false, available:false },
];

const FAQS = [
  { q:"What does an Addiction Medicine Specialist do?", a:"An Addiction Medicine Specialist diagnoses and treats substance use disorders through FDA-approved medications and behavioral health coordination. They prescribe buprenorphine, naltrexone, and methadone for opioid and alcohol use disorders, manage medically supervised withdrawal, and develop personalized treatment plans that address both the physical and behavioral dimensions of addiction. They also treat medical complications of substance use and coordinate care with counselors, psychiatrists, and social workers." },
  { q:"How do I choose the right Addiction Medicine Specialist in New York?", a:"Start by confirming the physician holds board certification through the American Board of Preventive Medicine (ABPM) or the American Board of Addiction Medicine (ABAM). Check whether they accept your insurance, including NY Medicaid or Medicare. If you have a co-occurring psychiatric condition, look for integrated behavioral health services. Providers listed on Hospital.com are sourced from public licensing directories and the NY OASAS provider directory — confirm details directly with the office before scheduling." },
  { q:"Is what I share with an Addiction Medicine Specialist confidential?", a:"Yes. Addiction medicine records are protected by standard HIPAA rules and by 42 CFR Part 2, which restricts disclosure of substance use disorder treatment records more strictly than general medical records. Your physician cannot share your treatment information with law enforcement, employers, or family members without written consent, with narrow exceptions for emergencies." },
  { q:"How much does an Addiction Medicine Specialist cost in New York?", a:"An initial consultation at a private practice in New York typically ranges from $250 to $600 without insurance. Follow-up visits are generally $125 to $300. NY Medicaid covers addiction medicine visits and MOUD with no or minimal cost-sharing for eligible members. NYC Health+Hospitals locations offer sliding-scale fees for uninsured patients. Contact NYC Well at 1-888-NYC-WELL (692-9355) to be connected with treatment options." },
  { q:"Does NY Medicaid cover Addiction Medicine Specialist services?", a:"Yes. New York Medicaid covers addiction medicine services broadly, including assessments, outpatient counseling, residential treatment, medically supervised detoxification, and MOUD. Since 2023, prior authorization requirements for buprenorphine have been significantly reduced. Providers licensed through the NY Office of Addiction Services and Supports (OASAS) bill Medicaid directly. Major Medicaid managed care plans in New York — including Fidelis, MetroPlus, and HealthFirst — contract with addiction medicine providers across the five boroughs." },
  { q:"Can I see an Addiction Medicine Specialist in New York over telehealth?", a:"Yes. Many addiction medicine practices in New York offer telehealth for initial consultations, medication management, and follow-up visits. Following federal regulatory changes, buprenorphine can be prescribed via telehealth without a prior in-person visit in most cases. New York State also expanded telehealth coverage under Medicaid. Confirm telehealth availability and your insurer's reimbursement policy with the specific practice before scheduling." },
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
        <div style={{ fontSize:12, color:"#5a7085", marginBottom:8 }}>Addiction Medicine · New York, NY</div>
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

export default function NYAddictionMedicinePage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <>
      <Head>
        <title>Addiction Medicine Specialists in New York, NY | Hospital.com</title>
        <meta name="description" content="Find board-certified addiction medicine specialists in New York, NY. Compare providers, read patient reviews, and book appointments. NY Medicaid, Medicare, and private insurance accepted." />
        <link rel="canonical" href="https://www.hospital.com/find-local-care/addiction-medicine-specialist/new-york-ny" />
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
              <span style={{ color:"#071e34", fontWeight:600 }}>New York, NY</span>
            </div>

            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(50,204,224,.12)", border:"1px solid rgba(50,204,224,.35)", color:"#1075ad", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, padding:"6px 16px", borderRadius:100, marginBottom:20, fontFamily:"Outfit, sans-serif" }}>
              New York, NY
            </div>
            <h1 style={{ fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize:isMobile?28:50, color:"#071e34", lineHeight:1.08, letterSpacing:"-0.03em", marginBottom:16, maxWidth:760 }}>
              Addiction Medicine Specialists<br/>in{" "}
              <em style={{ fontStyle:"italic", color:"#32cce0" }}>New York, NY</em>
            </h1>
            <p style={{ color:"#5a7085", fontSize:isMobile?14:16, maxWidth:560, lineHeight:1.7, marginBottom:16 }}>
              Compare board-certified addiction medicine specialists in New York. Read patient reviews, check insurance coverage, and book appointments.
            </p>
            <div style={{ fontSize:11.5, color:"#7a8fa0" }}>
              Reviewed by Hospital.com editorial team · Last updated April 2026
            </div>
          </div>
        </section>

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
                  { name:"Methadone", tag:"Opioid Use Disorder · OTP", desc:"Full opioid agonist dispensed through federally licensed opioid treatment programs. New York has a dense network of licensed OTP clinics across all five boroughs, with take-home doses available after a stabilization period." },
                  { name:"Naltrexone (Vivitrol)", tag:"Opioids · Alcohol", desc:"Opioid antagonist available as a daily tablet or monthly injection. Blocks the rewarding effects of opioids and significantly reduces alcohol cravings. Requires full opioid detox before starting." },
                  { name:"Naloxone (Narcan)", tag:"Overdose Reversal", desc:"Emergency overdose reversal medication prescribed to patients and household members as part of harm reduction. Available at many NYC pharmacies without a prescription under New York law." },
                  { name:"Acamprosate & Disulfiram", tag:"Alcohol Use Disorder", desc:"Acamprosate reduces post-acute withdrawal discomfort and is used for maintenance after detox. Disulfiram creates an aversion reaction to alcohol as a behavioral deterrent." },
                  { name:"CBT & Motivational Interviewing", tag:"Behavioral Therapy", desc:"Cognitive Behavioral Therapy (CBT) and Motivational Interviewing (MI) are coordinated alongside medications for comprehensive, evidence-based treatment." },
                ].map(t => <AccordionItem key={t.name} title={t.name} subtitle={t.tag}>{t.desc}</AccordionItem>)}
              </div>
            </section>

            {/* When to see */}
            <section style={{ marginBottom:48 }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?20:24, color:"#071e34", marginBottom:16, letterSpacing:"-0.02em" }}>
                When to See an Addiction Medicine Specialist in New York
              </h2>
              <div style={{ display:"flex", flexDirection:"column" as const, gap:10 }}>
                {[
                  "You experience physical withdrawal symptoms (sweating, tremors, nausea, or seizures) when trying to stop alcohol or benzodiazepines — which can be life-threatening without medical supervision.",
                  "You have attempted to stop using opioids multiple times and continue to relapse. MOUD significantly reduces relapse and overdose risk.",
                  "You are using opioids daily or near-daily, especially illicit fentanyl or heroin, which carries acute overdose risk in New York's current drug supply.",
                  "You were recently discharged from an emergency department after a non-fatal overdose. NYC Health+Hospitals operates bridge programs at multiple locations specifically for this transition.",
                  "Substance use is causing medical complications such as alcohol-related liver disease, endocarditis from injection drug use, or cardiac complications from stimulant use.",
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
                  { step:3, title:"Treatment Plan", desc:"A personalized plan is built on the same day. Buprenorphine induction may start at the first visit. Many NYC practices offer same-day MOUD appointments." },
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
                Addiction Medicine in New York City: What You Should Know
              </h2>
              <p style={{ fontSize:15, color:"#3a4a5c", lineHeight:1.8, marginBottom:14 }}>
                New York City has one of the largest and most diverse addiction medicine provider networks in the country, spanning all five boroughs through major academic health systems, community health centers, and the NYC Health+Hospitals public system.
              </p>
              <div style={{ display:"flex", flexDirection:"column" as const, gap:10, marginBottom:16 }}>
                {[
                  { name:"NYU Langone Health — Addiction Psychiatry & Medicine", detail:"Board-certified addiction medicine and psychiatry specialists at multiple Manhattan and Brooklyn locations. MOUD, co-occurring mental health care, and telehealth available. Phone: 646-929-7800." },
                  { name:"Weill Cornell Medicine / NewYork-Presbyterian", detail:"Comprehensive addiction medicine program with specialists in Upper East Side and Westchester. Accepts most major insurances, including NY Medicaid. Referrals via 877-697-9355." },
                  { name:"Columbia University Irving Medical Center", detail:"Addiction psychiatry and medicine faculty practice in Washington Heights. Strong integration with Columbia recovery services and a harm reduction focus." },
                  { name:"Mount Sinai & Montefiore Health Systems", detail:"Both systems operate addiction medicine departments across Manhattan and the Bronx respectively, with robust Medicaid contracting and community health programs." },
                  { name:"NYC Health+Hospitals", detail:"The public hospital system operates Bellevue, Elmhurst, Lincoln, and other facilities with addiction medicine bridge programs available at emergency departments for walk-in patients." },
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
                  { label:"NY Medicaid", detail:"Covers MOUD, residential treatment, and outpatient counseling. Providers licensed through NY OASAS bill Medicaid directly. Fidelis, MetroPlus, and HealthFirst all contract with addiction medicine providers." },
                  { label:"Medicare", detail:"Part B covers addiction medicine visits. Part D covers MOUD medications including buprenorphine and naltrexone." },
                  { label:"Private insurance", detail:"Most major carriers including Aetna, Cigna, Empire BCBS, and UnitedHealthcare cover addiction medicine and MOUD. Verify specific plan coverage before booking." },
                  { label:"Uninsured", detail:"Call NYC Well at 1-888-NYC-WELL (692-9355), free and 24/7. NYC Health+Hospitals offers sliding-scale fees." },
                ].map(c => (
                  <div key={c.label} style={{ display:"flex", gap:12, padding:"11px 16px", background:"#fff", border:"1px solid #e8eef2", borderRadius:10, fontSize:13 }}>
                    <div style={{ fontWeight:700, color:"#1075ad", minWidth:100, flexShrink:0 }}>{c.label}</div>
                    <div style={{ color:"#5a7085", lineHeight:1.6 }}>{c.detail}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16, padding:"14px 20px", background:"rgba(50,204,224,.07)", borderRadius:12, border:"1px solid rgba(50,204,224,.2)" }}>
                <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:14, color:"#071e34", marginBottom:4 }}>Hospital.com in New York</div>
                <div style={{ fontSize:13, color:"#5a7085" }}>Hospital.com lists over <strong>400 addiction medicine specialist providers</strong> currently in New York, aggregated from public listings, OASAS licensing directories, and provider networks. Many providers offer multilingual services — including Spanish, Mandarin, Russian, and Haitian Creole — and specialize in serving specific populations including justice-involved individuals and people experiencing homelessness.</div>
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
                  View all New York providers
                </button>
              </div>
            </section>

            {/* FAQ */}
            <section style={{ marginBottom:48 }}>
              <h2 style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:isMobile?20:24, color:"#071e34", marginBottom:4, letterSpacing:"-0.02em" }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize:13.5, color:"#7a8fa0", marginBottom:24 }}>About addiction medicine specialists in New York</p>
              <div style={{ border:"1px solid #e8eef2", borderRadius:14, padding:"0 24px", background:"#fff" }}>
                {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a}/>)}
              </div>
            </section>

            {/* Crisis resources */}
            <section style={{ marginBottom:48 }}>
              <div style={{ background:"linear-gradient(135deg,rgba(220,50,50,.06),rgba(220,50,50,.03))", border:"1.5px solid rgba(220,50,50,.2)", borderRadius:16, padding:"24px 28px" }}>
                <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize:16, color:"#c0392b", marginBottom:12 }}>Crisis Resources &amp; Safety Information</div>
                <p style={{ fontSize:14, color:"#5a7085", lineHeight:1.7, marginBottom:14 }}>If you or someone you love is in crisis, call or text <strong>988</strong> for the Suicide and Crisis Lifeline. For substance use specifically, SAMHSA's National Helpline is available at <strong>1-800-662-4357 (HELP)</strong>. Both services are free, confidential, and available 24/7.</p>
                <p style={{ fontSize:14, color:"#5a7085", lineHeight:1.7 }}>For New York City resources, call <strong>NYC Well at 1-888-NYC-WELL (692-9355)</strong> — free, multilingual, 24/7. The <strong>NY OASAS provider directory</strong> at findaddictiontreatment.ny.gov lists licensed treatment providers by borough and county.</p>
              </div>
            </section>

            {/* Sources */}
            <section>
              <AccordionItem title="Sources & Citations" subtitle="5 references">
                <div style={{ display:"flex", flexDirection:"column" as const, gap:8, paddingTop:4 }}>
                  {[
                    "Definition of Addiction. American Society of Addiction Medicine (ASAM). asam.org",
                    "What Are the Treatments for Drug Addiction? National Institute on Drug Abuse (NIDA). nida.nih.gov",
                    "NY OASAS Find Addiction Treatment. findaddictiontreatment.ny.gov",
                    "SAMHSA National Helpline. samhsa.gov/find-help/national-helpline",
                    "NYC Well — Mental Health Support. nycwell.cityofnewyork.us",
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
                <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:700, fontSize:13, color:"#071e34", marginBottom:16 }}>Hospital.com in New York</div>
                {[
                  { n:"400+", l:"Addiction Medicine Specialists" },
                  { n:"NY Medicaid", l:"Coverage available" },
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
                  { name:"NYC Well", detail:"1-888-NYC-WELL · 24/7" },
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
          {[{ name:"988 Lifeline", detail:"24/7" },{ name:"SAMHSA: 1-800-662-4357", detail:"24/7" },{ name:"NYC Well: 1-888-NYC-WELL", detail:"24/7" }].map(r => (
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
