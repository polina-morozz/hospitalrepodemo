import { useState, ChangeEvent } from "react";
import Head from "next/head";
import C from "@/lib/tokens";
import useIsMobile from "@/lib/hooks/useIsMobile";

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [profile, setProfile] = useState({ firstName:"John", lastName:"Doe", email:"john.doe@gmail.com", phone:"+1 212-555-0100", dob:"1990-05-15", insurance:"Aetna" });
  const [saved, setSaved] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const isMobile = useIsMobile();

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false), 3000); };
  const handleEmailChange = () => {
    if (!newEmail.trim() || !newEmail.includes("@")) return;
    setEmailSent(true);
    setTimeout(()=>{ setEmailSent(false); setShowEmailChange(false); setNewEmail(""); }, 4000);
  };

  const Field = ({ label, field, type = "text" }: { label: string; field: string; type?: string }) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>{label}</label>
      <input type={type} value={(profile as Record<string,string>)[field]} onChange={(e: ChangeEvent<HTMLInputElement>)=>setProfile(p=>({...p,[field]:e.target.value}))}
        style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit", transition:"border-color .15s" }}
        onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
    </div>
  );

  return (
    <>
      <Head><title>My Profile — Hospital.com</title></Head>
      <div style={{ minHeight:"calc(100vh - 58px)", background:C.offWhite }}>
        <div style={{ maxWidth:680, margin:"0 auto", padding:isMobile?"24px 16px 48px":"40px 24px 60px" }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
            <div style={{ width:64, height:64, borderRadius:18, background:"linear-gradient(135deg, #E87722, #FFB347)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:22, color:"#fff" }}>
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <div>
              <h1 style={{ fontSize:isMobile?20:26, fontWeight:800, margin:0 }}>My Profile</h1>
              <p style={{ color:C.textSm, fontSize:13.5, marginTop:2 }}>Manage your personal information</p>
            </div>
          </div>

          {/* Personal Info */}
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
            <h2 style={{ fontWeight:700, fontSize:16, marginBottom:18 }}>Personal Information</h2>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"0 20px" }}>
              <Field label="First Name" field="firstName" />
              <Field label="Last Name" field="lastName" />
            </div>
            <Field label="Date of Birth" field="dob" type="date" />
          </div>

          {/* Contact */}
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
            <h2 style={{ fontWeight:700, fontSize:16, marginBottom:18 }}>Contact Details</h2>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Email</label>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ flex:1, padding:"10px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, background:C.offWhite, color:C.textMd }}>{profile.email}</div>
                <button onClick={()=>setShowEmailChange(s=>!s)} style={{ background:"none", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 16px", fontSize:13, fontWeight:600, color:C.teal, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>Change</button>
              </div>
              {showEmailChange && (
                <div className="fade-up" style={{ marginTop:10, background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px" }}>
                  {emailSent ? (
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:C.green }}>Verification link sent!</div>
                        <div style={{ fontSize:12.5, color:C.textSm, marginTop:2 }}>Check <strong>{newEmail}</strong> and click the link to confirm your new email address.</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize:12.5, color:C.textSm, marginBottom:10 }}>Enter your new email. We&apos;ll send a verification link to confirm the change.</p>
                      <div style={{ display:"flex", gap:8 }}>
                        <input type="email" value={newEmail} onChange={(e: ChangeEvent<HTMLInputElement>)=>setNewEmail(e.target.value)} placeholder="new.email@example.com"
                          style={{ flex:1, padding:"9px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
                          onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
                        <button onClick={handleEmailChange} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"9px 20px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>Send Link</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <Field label="Phone Number" field="phone" type="tel" />
          </div>

          {/* Save */}
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <button onClick={handleSave} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:12, padding:"13px 36px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Save Changes</button>
            {saved && <span className="fade-up" style={{ color:C.green, fontWeight:600, fontSize:14 }}>✓ Profile saved!</span>}
          </div>
        </div>
      </div>
    </>
  );
}
