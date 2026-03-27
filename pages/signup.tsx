import { useState, ChangeEvent, ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import C from "@/lib/tokens";
import { useApp } from "@/lib/context/AppContext";
import FieldInput from "@/components/ui/FieldInput";
import useIsMobile from "@/lib/hooks/useIsMobile";

// ─── SocialBtn ────────────────────────────────────────────────────────────────
interface SocialBtnProps {
  letter: string;
  label: string;
}
function SocialBtn({ letter, label }: SocialBtnProps) {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"10px 16px", border:`1.5px solid ${h?C.teal:C.border}`, borderRadius:10, background:h?C.tealLt:C.white, cursor:"pointer", fontSize:14, fontWeight:500, color:C.text, transition:"all .15s", marginBottom:9, fontFamily:"inherit" }}>
      <span style={{ width:24, height:24, borderRadius:6, background:C.gray, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:C.textSm, flexShrink:0 }}>{letter}</span>
      {label}
    </button>
  );
}

// ─── RoleSelector ─────────────────────────────────────────────────────────────
interface RoleSelectorProps {
  role: string;
  setRole: (role: string) => void;
}
function RoleSelector({ role, setRole }: RoleSelectorProps) {
  const isMobile = useIsMobile();
  const roles: { val: string; label: string; desc: string; icon: ReactNode; color: string; bg: string }[] = [
    { val:"patient", label:"Patient", desc:"Find care & book appointments", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>, color:C.teal, bg:C.tealLt },
    { val:"provider", label:"Provider", desc:"List your clinic & manage leads", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>, color:C.teal, bg:C.tealLt },
    { val:"facilitator", label:"Facilitator", desc:"Manage international patient leads", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color:C.purple, bg:C.purpleLt },
  ];

  // Mobile: compact pill buttons (same as login page)
  if (isMobile) {
    return (
      <div style={{ display:"flex", gap:8, marginBottom:22 }}>
        {roles.map(r => (
          <button key={r.val} onClick={()=>setRole(r.val)}
            style={{ flex:1, padding:"10px 4px", border:`2px solid ${role===r.val?r.color:C.border}`, borderRadius:50, background:role===r.val?r.bg:C.white, cursor:"pointer", fontFamily:"inherit", transition:"all .18s", fontSize:12, fontWeight:700, color:role===r.val?r.color:C.textMd, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <span style={{ color:role===r.val?r.color:C.textSm, display:"flex" }}>{r.icon}</span>
            {r.label}
          </button>
        ))}
      </div>
    );
  }

  // Desktop: fancy vertical cards
  return (
    <div style={{ display:"flex", gap:10, marginBottom:22 }}>
      {roles.map(r => (
        <button key={r.val} onClick={()=>setRole(r.val)} style={{ flex:1, padding:"16px 10px 14px", border:`2px solid ${role===r.val?r.color:C.border}`, borderRadius:14, background:role===r.val?r.bg:C.white, cursor:"pointer", fontFamily:"inherit", transition:"all .18s", display:"flex", flexDirection:"column", alignItems:"center", gap:8, textAlign:"center" }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:role===r.val?C.white:C.gray, display:"flex", alignItems:"center", justifyContent:"center", color:role===r.val?r.color:C.textSm, transition:"all .18s" }}>
            {r.icon}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:role===r.val?r.color:C.text, marginBottom:3 }}>{r.label}</div>
            <div style={{ fontSize:10.5, color:C.textSm, lineHeight:1.4 }}>{r.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── SIGNUP PAGE ──────────────────────────────────────────────────────────────
// TODO(backend): POST /api/auth/signup — req.body: { name, email, password, role, ...roleFields }
// Provider/Facilitator signups go to pending-approval state.
export default function SignupPage() {
  const router = useRouter();
  const { setIsLoggedIn } = useApp();
  const isMobile = useIsMobile();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("patient");
  const [f, setF] = useState({ name:"", email:"", pw:"" });
  const [show, setShow] = useState(false);
  const [pf, setPf] = useState({ clinicName:"", specialty:"", location:"", email:"", phone:"" });
  const [ff, setFf] = useState({ orgName:"", name:"", email:"", phone:"", comments:"" });
  const [providerDone, setProviderDone] = useState(false);
  const [facilitatorDone, setFacilitatorDone] = useState(false);

  if (step === 0) {
    return (
      <>
        <Head><title>Create Account | Hospital.com</title><meta name="robots" content="noindex"/></Head>
        <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding: isMobile ? "20px 12px" : "32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
          <div className="fade-up" style={{ width:"100%", maxWidth:480, background:C.white, borderRadius:22, padding: isMobile ? "28px 18px" : "36px 28px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
            <div style={{ textAlign:"center", marginBottom:26 }}>
              <h1 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:6 }}>Create your account</h1>
              <p style={{ color:C.textSm, fontSize:13.5 }}>Who are you signing up as?</p>
            </div>
            <RoleSelector role={role} setRole={setRole}/>
            <button className="btn-primary" onClick={()=>setStep(1)} style={{ width:"100%", background:role==="facilitator"?C.purple:C.teal, color:"#fff", border:"none", borderRadius:50, padding:"14px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>
              Continue as {role==="patient"?"Patient":role==="provider"?"Provider":"Facilitator"}
            </button>
            <p style={{ textAlign:"center", fontSize:13, color:C.textSm, marginTop:16 }}>Already have an account?{" "}<button onClick={()=>router.push("/login")} style={{ background:"none", border:"none", color:C.teal, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Sign In</button></p>
          </div>
        </div>
      </>
    );
  }

  if ((role==="provider"&&providerDone)||(role==="facilitator"&&facilitatorDone)) {
    return (
      <>
        <Head><title>Application Submitted | Hospital.com</title><meta name="robots" content="noindex"/></Head>
        <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding: isMobile ? "20px 12px" : "32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
          <div className="fade-up" style={{ width:"100%", maxWidth:460, background:C.white, borderRadius:20, padding: isMobile ? "28px 18px" : "40px 34px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)", textAlign:"center" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:role==="facilitator"?C.purpleLt:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={role==="facilitator"?C.purple:C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
            </div>
            <h2 style={{ fontSize:21, fontWeight:800, marginBottom:10 }}>Application Submitted!</h2>
            <p style={{ color:C.textSm, fontSize:14, lineHeight:1.6, marginBottom:22 }}>Thank you for your interest in joining Hospital.com as a {role}. Our admin team will review your application and notify you once approved.</p>
            <div style={{ background:C.amberLt, border:`1px solid #FDE68A`, borderRadius:12, padding:"13px 16px", marginBottom:24, textAlign:"left" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#92400E", marginBottom:4 }}>Pending Admin Review</div>
              <div style={{ fontSize:13, color:"#78350F" }}>You will be notified by email once your account is approved. This typically takes 1–2 business days.</div>
            </div>
            <button className="btn-primary" onClick={()=>router.push("/")} style={{ background:role==="facilitator"?C.purple:C.teal, color:"#fff", border:"none", borderRadius:50, padding:"11px 32px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Back to Home</button>
          </div>
        </div>
      </>
    );
  }

  if (role==="facilitator") {
    return (
      <>
        <Head><title>Facilitator Registration | Hospital.com</title><meta name="robots" content="noindex"/></Head>
        <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding: isMobile ? "20px 12px" : "32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
          <div className="fade-up" style={{ width:"100%", maxWidth:460, background:C.white, borderRadius:20, padding: isMobile ? "28px 18px" : "36px 30px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
            <button onClick={()=>setStep(0)} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:13, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:20, padding:0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>Back
            </button>
            <div style={{ textAlign:"center", marginBottom:22 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Facilitator Registration</h2>
              <p style={{ color:C.textSm, fontSize:13 }}>Tell us about your organization</p>
            </div>
            <FieldInput label="Organization Name *" type="text" value={ff.orgName} onChange={(e: ChangeEvent<HTMLInputElement>)=>setFf(p=>({...p,orgName:e.target.value}))} placeholder="e.g. MedTravel Facilitators" />
            <FieldInput label="Your Name *" type="text" value={ff.name} onChange={(e: ChangeEvent<HTMLInputElement>)=>setFf(p=>({...p,name:e.target.value}))} placeholder="Full name" />
            <FieldInput label="Email *" type="email" value={ff.email} onChange={(e: ChangeEvent<HTMLInputElement>)=>setFf(p=>({...p,email:e.target.value}))} placeholder="org@example.com" />
            <FieldInput label="Phone *" type="tel" value={ff.phone} onChange={(e: ChangeEvent<HTMLInputElement>)=>setFf(p=>({...p,phone:e.target.value}))} placeholder="+1 000-000-0000" />
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Comments / Additional Info</label>
              <textarea value={ff.comments} onChange={e=>setFf(p=>({...p,comments:e.target.value}))} placeholder="Tell us about your services, countries you operate in, types of patients you work with…" rows={4}
                style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:14, outline:"none", fontFamily:"inherit", resize:"vertical" }} />
            </div>
            <div style={{ background:C.purpleLt, border:`1px solid ${C.purple}30`, borderRadius:10, padding:"11px 14px", marginBottom:16, fontSize:12.5, color:C.purple }}>
              Facilitator accounts require admin approval before going live.
            </div>
            <button className="btn-primary" onClick={()=>setFacilitatorDone(true)} style={{ width:"100%", background:C.purple, color:"#fff", border:"none", borderRadius:50, padding:"13px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Submit for Review</button>
          </div>
        </div>
      </>
    );
  }

  if (role === "provider") {
    return (
      <>
        <Head><title>Provider Registration | Hospital.com</title><meta name="robots" content="noindex"/></Head>
        <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding: isMobile ? "20px 12px" : "32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
          <div className="fade-up" style={{ width:"100%", maxWidth:460, background:C.white, borderRadius:20, padding: isMobile ? "28px 18px" : "36px 30px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
            <button onClick={()=>setStep(0)} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:13, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:20, padding:0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>Back
            </button>
            <div style={{ textAlign:"center", marginBottom:22 }}>
              <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Provider Registration</h2>
              <p style={{ color:C.textSm, fontSize:13 }}>Submit your details for admin review</p>
            </div>
            <FieldInput label="Clinic / Practice Name *" type="text" value={pf.clinicName} onChange={(e: ChangeEvent<HTMLInputElement>)=>setPf(p=>({...p,clinicName:e.target.value}))} placeholder="e.g. Sunshine Medical Clinic" />
            <FieldInput label="Specialty *" type="text" value={pf.specialty} onChange={(e: ChangeEvent<HTMLInputElement>)=>setPf(p=>({...p,specialty:e.target.value}))} placeholder="e.g. Cardiology, Family Medicine" />
            <FieldInput label="Location / City *" type="text" value={pf.location} onChange={(e: ChangeEvent<HTMLInputElement>)=>setPf(p=>({...p,location:e.target.value}))} placeholder="e.g. New York, NY" />
            <FieldInput label="Email *" type="email" value={pf.email} onChange={(e: ChangeEvent<HTMLInputElement>)=>setPf(p=>({...p,email:e.target.value}))} placeholder="clinic@example.com" />
            <FieldInput label="Phone" type="tel" value={pf.phone} onChange={(e: ChangeEvent<HTMLInputElement>)=>setPf(p=>({...p,phone:e.target.value}))} placeholder="+1 212-555-0000" />
            <div style={{ background:C.amberLt, border:`1px solid #FDE68A`, borderRadius:10, padding:"11px 14px", marginBottom:16, fontSize:12.5, color:"#92400E" }}>
              Provider accounts require admin approval before going live.
            </div>
            <button className="btn-primary" onClick={()=>setProviderDone(true)} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:50, padding:"13px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Submit for Review</button>
          </div>
        </div>
      </>
    );
  }

  // Patient form
  return (
    <>
      <Head><title>Create Account | Hospital.com</title><meta name="robots" content="noindex"/></Head>
      <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding: isMobile ? "20px 12px" : "32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:400, background:C.white, borderRadius:20, padding: isMobile ? "28px 18px" : "36px 30px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
          <button onClick={()=>setStep(0)} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:13, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:20, padding:0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>Back
          </button>
          <div style={{ textAlign:"center", marginBottom:22 }}>
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Create your account</h2>
            <p style={{ color:C.textSm, fontSize:13 }}>Join thousands of patients finding better care</p>
          </div>
          <SocialBtn letter="G" label="Sign up with Google" />
          <SocialBtn letter="A" label="Sign up with Apple" />
          <div style={{ display:"flex", alignItems:"center", gap:10, margin:"14px 0" }}>
            <div style={{ flex:1, height:1, background:C.border }}/><span style={{ fontSize:11, color:C.textSm, fontWeight:600, whiteSpace:"nowrap" }}>or with email</span><div style={{ flex:1, height:1, background:C.border }}/>
          </div>
          <FieldInput label="Full Name *" type="text" value={f.name} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,name:e.target.value}))} placeholder="Your full name" />
          <FieldInput label="Email *" type="email" value={f.email} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,email:e.target.value}))} placeholder="you@example.com" />
          <FieldInput label="Password *" type={show?"text":"password"} value={f.pw} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,pw:e.target.value}))} placeholder="Create a password"
            right={<button onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:11, color:C.textSm, fontWeight:700, fontFamily:"inherit" }}>{show?"Hide":"Show"}</button>} />
          <button className="btn-primary" onClick={()=>{ setIsLoggedIn(true); router.push("/"); }} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:50, padding:"13px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Create Account</button>
          <p style={{ textAlign:"center", fontSize:13, color:C.textSm, marginTop:16 }}>Already have an account?{" "}<button onClick={()=>router.push("/login")} style={{ background:"none", border:"none", color:C.teal, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Sign In</button></p>
        </div>
      </div>
    </>
  );
}
