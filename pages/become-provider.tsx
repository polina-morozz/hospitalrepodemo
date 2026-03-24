import { useState, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import C from "@/lib/tokens";
import useIsMobile from "@/lib/hooks/useIsMobile";
import Footer from "@/components/layout/Footer";
import FieldInput from "@/components/ui/FieldInput";

interface ProviderForm {
  clinicName: string;
  contactName: string;
  email: string;
  phone: string;
  specialty: string;
  country: string;
}

interface Faq {
  q: string;
  a: string;
}

// ─── BECOME A PROVIDER PAGE ────────────────────────────────────────────────────────────
// TODO(backend): POST /api/providers/apply — req.body: { clinicName, contactName, email, phone, specialty, country }
export default function BecomeProviderPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [f, setF] = useState<ProviderForm>({ clinicName:"", contactName:"", email:"", phone:"", specialty:"", country:"" });
  const [done, setDone] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqs: Faq[] = [
    { q:"How much does it cost to join?", a:"Creating a provider profile on Hospital.com is free. We offer premium features for enhanced visibility and lead generation." },
    { q:"How long does verification take?", a:"Typically 1–2 business days. Our team reviews your credentials and clinic information to ensure quality for patients." },
    { q:"What kind of providers can join?", a:"We welcome all licensed healthcare providers — from individual practitioners to large hospital systems, as well as medical tourism facilitators." },
    { q:"How will I receive patient inquiries?", a:"You'll receive inquiries directly to your email and dashboard. Patients can also book appointments through your profile if you enable the calendar feature." },
    { q:"Can I join from outside North America?", a:"Yes! Our Global Health Services section is open to certified clinics and providers worldwide." },
  ];

  if (done) return (
    <>
      <Head><title>Application Received | Hospital.com</title></Head>
      <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:480, background:C.white, borderRadius:20, padding:"44px 36px", boxShadow:"0 8px 40px rgba(11,191,191,.1)", textAlign:"center" }}>
          <div style={{ width:60, height:60, borderRadius:"50%", background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
          </div>
          <h2 style={{ fontSize:22, fontWeight:800, marginBottom:10 }}>Application Received!</h2>
          <p style={{ color:C.textSm, fontSize:14.5, lineHeight:1.65 }}>Thank you! Our team will review your application and get back to you within 2 business days.</p>
          <button className="btn-primary" onClick={()=>router.push("/")} style={{ marginTop:28, background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"12px 36px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Back to Home</button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>Become a Provider | Hospital.com</title>
        <meta name="description" content="Join Hospital.com's network of verified healthcare providers. Reach thousands of patients searching for care in your specialty." />
        <meta property="og:title" content="Become a Provider | Hospital.com" />
        <link rel="canonical" href="https://www.hospital.com/become-provider" />
      </Head>
      <div style={{ minHeight:"calc(100vh - 58px)", background:C.white }}>
        {/* HERO */}
        <div style={{ background:`linear-gradient(160deg, ${C.white} 40%, ${C.tealBg} 100%)`, padding:isMobile?"48px 16px 56px":"80px 16px 90px", textAlign:"center" }}>
          <div className="fade-up" style={{ maxWidth:720, margin:"0 auto" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:C.tealLt, border:`1px solid ${C.teal}30`, borderRadius:20, padding:"5px 14px", marginBottom:20 }}>
              <span style={{ fontSize:12, fontWeight:700, color:C.teal }}>FOR HEALTHCARE PROVIDERS</span>
            </div>
            <h1 style={{ fontSize:isMobile?26:42, fontWeight:800, letterSpacing:"-.5px", marginBottom:14, lineHeight:1.2 }}>Become a Provider on <span style={{ color:C.teal }}>Hospital.com</span></h1>
            <p style={{ color:C.textSm, fontSize:isMobile?14:18, maxWidth:540, margin:"0 auto 32px", lineHeight:1.6 }}>Connect with patients searching for trusted healthcare providers worldwide.</p>
            <button className="btn-primary" onClick={()=>document.getElementById("provider-form")?.scrollIntoView({behavior:"smooth"})} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:28, padding:isMobile?"14px 28px":"16px 40px", fontWeight:700, fontSize:isMobile?15:17, cursor:"pointer", fontFamily:"inherit" }}>Become a Provider</button>
          </div>
        </div>

        {/* STATS */}
        <div style={{ padding:isMobile?"32px 16px":"48px 16px", background:C.offWhite, borderTop:`1px solid ${C.borderLt}` }}>
          <div style={{ maxWidth:700, margin:"0 auto", display:"flex", gap:isMobile?12:24, justifyContent:"center", flexWrap:"wrap" }}>
            {[{ num:"20+", label:"Provider Countries" },{ num:"50K+", label:"Monthly Healthcare Searches" },{ num:"1,000+", label:"Global Provider Network" }].map(s=>(
              <div key={s.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:isMobile?"18px 20px":"24px 32px", textAlign:"center", flex:isMobile?"1 1 140px":"1", boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                <div style={{ fontSize:isMobile?24:32, fontWeight:800, color:C.teal, marginBottom:4 }}>{s.num}</div>
                <div style={{ fontSize:isMobile?11:13, fontWeight:600, color:C.textSm }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* WHY JOIN */}
        <div style={{ padding:isMobile?"36px 16px":"60px 16px" }}>
          <div style={{ maxWidth:960, margin:"0 auto", textAlign:"center" }}>
            <h2 style={{ fontSize:isMobile?22:30, fontWeight:800, marginBottom:8 }}>Why Join Hospital.com?</h2>
            <p style={{ color:C.textSm, fontSize:isMobile?13:15, marginBottom:32 }}>Everything you need to grow your practice and reach more patients.</p>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(4, 1fr)", gap:16 }}>
              {[
                { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title:"Reach New Patients", desc:"Get discovered by patients actively searching for your specialty." },
                { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title:"AI-Powered Discovery", desc:"Our AI assistant recommends you to patients based on their needs." },
                { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>, title:"Build Trust with Reviews", desc:"Collect verified patient reviews to build credibility." },
                { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, title:"Global Visibility", desc:"Reach patients worldwide through our international network." },
              ].map(b=>(
                <div key={b.title} style={{ background:C.offWhite, borderRadius:16, padding:"28px 20px", textAlign:"center" }}>
                  <div style={{ width:52, height:52, borderRadius:14, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>{b.icon}</div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>{b.title}</div>
                  <div style={{ color:C.textSm, fontSize:13, lineHeight:1.6 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ padding:isMobile?"36px 16px":"60px 16px", background:C.tealBg }}>
          <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
            <h2 style={{ fontSize:isMobile?22:30, fontWeight:800, marginBottom:8 }}>How It Works</h2>
            <p style={{ color:C.textSm, fontSize:isMobile?13:15, marginBottom:32 }}>Get started in three simple steps.</p>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3, 1fr)", gap:16 }}>
              {[
                { num:"1", title:"Create Your Profile", desc:"Sign up and fill in your practice details, specialties, and credentials." },
                { num:"2", title:"Get Verified", desc:"Our team reviews and verifies your clinic within 1–2 business days." },
                { num:"3", title:"Start Receiving Patients", desc:"Once approved, patients can find you, read reviews, and book appointments." },
              ].map(s=>(
                <div key={s.num} style={{ background:C.white, borderRadius:16, padding:"28px 20px", textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:C.teal, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18, color:"#fff", margin:"0 auto 14px" }}>{s.num}</div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>{s.title}</div>
                  <div style={{ color:C.textSm, fontSize:13, lineHeight:1.6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ padding:isMobile?"36px 16px":"60px 16px" }}>
          <div style={{ maxWidth:640, margin:"0 auto" }}>
            <h2 style={{ fontSize:isMobile?22:28, fontWeight:800, textAlign:"center", marginBottom:28 }}>Frequently Asked Questions</h2>
            {faqs.map((faq,i)=>(
              <div key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
                <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 4px", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                  <span style={{ fontWeight:600, fontSize:14.5, color:C.text }}>{faq.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .2s", transform:faqOpen===i?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
                </button>
                {faqOpen===i && <div className="fade-up" style={{ padding:"0 4px 16px", color:C.textSm, fontSize:13.5, lineHeight:1.65 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* SIGNUP FORM */}
        <div id="provider-form" style={{ padding:isMobile?"36px 16px":"60px 16px", background:C.offWhite }}>
          <div style={{ maxWidth:540, margin:"0 auto" }}>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"36px 30px", boxShadow:"0 4px 20px rgba(11,191,191,.09)" }}>
              <h2 style={{ fontSize:20, fontWeight:800, marginBottom:6, textAlign:"center" }}>Become a Provider</h2>
              <p style={{ color:C.textSm, fontSize:13, marginBottom:24, textAlign:"center" }}>Fill in your details and our team will be in touch.</p>
              <FieldInput label="Clinic / Provider Name *" type="text" value={f.clinicName} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,clinicName:e.target.value}))} placeholder="e.g. Sunshine Medical Clinic" />
              <FieldInput label="Country *" type="text" value={f.country} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,country:e.target.value}))} placeholder="e.g. United States, Canada, Turkey" />
              <FieldInput label="Specialty *" type="text" value={f.specialty} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,specialty:e.target.value}))} placeholder="e.g. Cardiology, Dental, Plastic Surgery" />
              <FieldInput label="Email *" type="email" value={f.email} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,email:e.target.value}))} placeholder="you@clinic.com" />
              <FieldInput label="Phone" type="tel" value={f.phone} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,phone:e.target.value}))} placeholder="+1 212-555-0000" />
              <button className="btn-primary" onClick={()=>setDone(true)} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:28, padding:"14px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Become a Provider</button>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div style={{ background:"linear-gradient(135deg,#0E1C26,#1a3a4a)", padding:isMobile?"44px 16px":"72px 16px", textAlign:"center" }}>
          <h2 style={{ color:"#fff", fontSize:isMobile?22:32, fontWeight:800, marginBottom:12, letterSpacing:"-.3px" }}>Start Connecting with Patients Worldwide</h2>
          <p style={{ color:"#94A3B8", fontSize:isMobile?13:16, marginBottom:28, maxWidth:480, margin:"0 auto 28px" }}>Join Hospital.com&apos;s growing network and let patients find you.</p>
          <button className="btn-primary" onClick={()=>document.getElementById("provider-form")?.scrollIntoView({behavior:"smooth"})} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:28, padding:"15px 40px", fontWeight:700, fontSize:17, cursor:"pointer", fontFamily:"inherit" }}>Become a Provider</button>
        </div>
        <Footer />
      </div>
    </>
  );
}
