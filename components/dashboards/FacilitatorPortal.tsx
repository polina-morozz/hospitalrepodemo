import { useState, ChangeEvent } from "react";
import C from "@/lib/tokens";
import useIsMobile from "@/lib/hooks/useIsMobile";

// ─── DATA ─────────────────────────────────────────────────────────────────────
interface FacilLead {
  id: number; date: string; name: string; email: string; phone: string;
  procedure: string; country: string; status: string; age: number;
  gender: string; location: string;
}

const FACIL_LEADS: FacilLead[] = [
  { id:1,  date:"Mar 12", name:"James W.",    email:"james.w@gmail.com",    phone:"+1 212-555-0101", procedure:"Hair Transplant",        country:"Turkey",      status:"New",        age:34, gender:"Male",   location:"New York, NY" },
  { id:2,  date:"Mar 12", name:"Anika S.",    email:"anika.s@outlook.com",  phone:"+1 310-555-0202", procedure:"Dental Implants",         country:"Poland",      status:"Contacted",  age:52, gender:"Female", location:"Los Angeles, CA" },
  { id:3,  date:"Mar 11", name:"Robert L.",   email:"r.lee@yahoo.com",      phone:"+1 646-555-0303", procedure:"Knee Replacement",        country:"Germany",     status:"Converted",  age:61, gender:"Male",   location:"New York, NY" },
  { id:4,  date:"Mar 11", name:"Maria D.",    email:"maria.d@gmail.com",    phone:"+44 7700-900404", procedure:"IVF",                     country:"Spain",       status:"New",        age:38, gender:"Female", location:"London, UK" },
  { id:5,  date:"Mar 10", name:"Chen H.",     email:"chen.h@gmail.com",     phone:"+1 713-555-0505", procedure:"Rhinoplasty",             country:"Turkey",      status:"Contacted",  age:29, gender:"Male",   location:"Houston, TX" },
  { id:6,  date:"Mar 10", name:"Fatima A.",   email:"fatima.a@icloud.com",  phone:"+1 212-555-0606", procedure:"Cancer Treatment",        country:"South Korea", status:"Converted",  age:47, gender:"Female", location:"New York, NY" },
  { id:7,  date:"Mar 09", name:"David M.",    email:"david.m@gmail.com",    phone:"+1 780-555-0707", procedure:"Bariatric Surgery",       country:"Germany",     status:"New",        age:44, gender:"Male",   location:"Edmonton, CA" },
  { id:8,  date:"Mar 09", name:"Sofia R.",    email:"sofia.r@hotmail.com",  phone:"+1 212-555-0808", procedure:"LASIK",                   country:"Spain",       status:"Closed",     age:31, gender:"Female", location:"New York, NY" },
  { id:9,  date:"Mar 08", name:"Omar K.",     email:"omar.k@gmail.com",     phone:"+61 400-555-909", procedure:"Cardiac Surgery",         country:"India",       status:"Converted",  age:58, gender:"Male",   location:"Sydney, AU" },
  { id:10, date:"Mar 08", name:"Priya N.",    email:"priya.n@gmail.com",    phone:"+1 310-555-1010", procedure:"Hair Transplant",         country:"Turkey",      status:"Contacted",  age:27, gender:"Female", location:"Los Angeles, CA" },
  { id:11, date:"Mar 07", name:"Lucas F.",    email:"lucas.f@gmail.com",    phone:"+1 212-555-1111", procedure:"Dental Implants",         country:"Poland",      status:"New",        age:49, gender:"Male",   location:"New York, NY" },
  { id:12, date:"Mar 07", name:"Elena V.",    email:"elena.v@yahoo.com",    phone:"+1 905-555-1212", procedure:"Rhinoplasty",             country:"Turkey",      status:"Closed",     age:35, gender:"Female", location:"Mississauga, CA" },
  { id:13, date:"Mar 06", name:"Tom B.",      email:"tom.b@gmail.com",      phone:"+1 403-555-1313", procedure:"Orthopedics",             country:"Germany",     status:"Converted",  age:55, gender:"Male",   location:"Calgary, CA" },
  { id:14, date:"Mar 06", name:"Nina P.",     email:"nina.p@outlook.com",   phone:"+1 212-555-1414", procedure:"Stem Cell Therapy",       country:"South Korea", status:"Contacted",  age:42, gender:"Female", location:"New York, NY" },
  { id:15, date:"Mar 05", name:"Andre T.",    email:"andre.t@gmail.com",    phone:"+1 713-555-1515", procedure:"Hair Transplant",         country:"Turkey",      status:"New",        age:33, gender:"Male",   location:"Houston, TX" },
  { id:16, date:"Mar 05", name:"Jessica L.",  email:"jess.l@gmail.com",     phone:"+1 613-555-1616", procedure:"IVF",                     country:"Spain",       status:"Converted",  age:36, gender:"Female", location:"Ottawa, CA" },
  { id:17, date:"Mar 04", name:"Sam K.",      email:"sam.k@yahoo.com",      phone:"+1 212-555-1717", procedure:"Cardiac Surgery",         country:"Germany",     status:"Contacted",  age:64, gender:"Male",   location:"New York, NY" },
  { id:18, date:"Mar 04", name:"Yuki T.",     email:"yuki.t@gmail.com",     phone:"+44 7911-900181", procedure:"Cancer Treatment",        country:"South Korea", status:"New",        age:51, gender:"Female", location:"Manchester, UK" },
  { id:19, date:"Mar 03", name:"Marco B.",    email:"marco.b@gmail.com",    phone:"+1 310-555-1919", procedure:"Dental Implants",         country:"Poland",      status:"Converted",  age:46, gender:"Male",   location:"Los Angeles, CA" },
  { id:20, date:"Mar 03", name:"Aisha H.",    email:"aisha.h@outlook.com",  phone:"+1 212-555-2020", procedure:"Bariatric Surgery",       country:"Germany",     status:"Closed",     age:39, gender:"Female", location:"New York, NY" },
];

const FACIL_STATS = {
  totalLeads: 20, newLeads: 6, converted: 7, revenue: 14350,
  monthly: [
    { m:"Oct", leads:9,  conv:3 },
    { m:"Nov", leads:14, conv:5 },
    { m:"Dec", leads:11, conv:4 },
    { m:"Jan", leads:18, conv:7 },
    { m:"Feb", leads:16, conv:6 },
    { m:"Mar", leads:20, conv:7 },
  ],
};

const STATUS_COLORS: Record<string,{bg:string;color:string}> = {
  New:       { bg: C.blueLt,   color: C.blue   },
  Contacted: { bg: C.amberLt,  color: C.amber  },
  Converted: { bg: C.greenLt,  color: C.green  },
  Closed:    { bg: C.gray,     color: C.textSm },
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
function Badge({ children, color = C.teal, bg = C.tealLt }: { children: React.ReactNode; color?: string; bg?: string }) {
  return <span style={{ background:bg, color, fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20, letterSpacing:.4, whiteSpace:"nowrap" }}>{children}</span>;
}

// ─── OAUTH CONNECTIONS ────────────────────────────────────────────────────────
function OAuthConnections({ role }: { role: string }) {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [appleConnected, setAppleConnected] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [applePending, setApplePending] = useState(false);
  const accentColor = role === "facilitator" ? C.purple : C.teal;
  const handleGoogle = () => { setGooglePending(true); setTimeout(() => { setGoogleConnected(true); setGooglePending(false); }, 1200); };
  const handleApple = () => { setApplePending(true); setTimeout(() => { setAppleConnected(true); setApplePending(false); }, 1200); };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", border:`1.5px solid ${googleConnected?accentColor:C.border}`, borderRadius:22, background:googleConnected?`${accentColor}08`:C.white }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          <div>
            <div style={{ fontWeight:600, fontSize:13.5 }}>Google Account</div>
            <div style={{ fontSize:11.5, color:googleConnected?accentColor:C.textSm }}>{googleConnected ? "Connected" : "Not connected"}</div>
          </div>
        </div>
        <button onClick={googleConnected?()=>setGoogleConnected(false):handleGoogle}
          style={{ padding:"8px 18px", border:`1.5px solid ${googleConnected?C.border:accentColor}`, borderRadius:22, background:googleConnected?C.white:accentColor, color:googleConnected?C.textSm:"#fff", fontWeight:600, fontSize:12.5, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
          {googlePending?"Connecting…":googleConnected?"Disconnect":"Connect"}
        </button>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", border:`1.5px solid ${appleConnected?accentColor:C.border}`, borderRadius:22, background:appleConnected?`${accentColor}08`:C.white }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={C.text}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          <div>
            <div style={{ fontWeight:600, fontSize:13.5 }}>Apple Account</div>
            <div style={{ fontSize:11.5, color:appleConnected?accentColor:C.textSm }}>{appleConnected ? "Connected" : "Not connected"}</div>
          </div>
        </div>
        <button onClick={appleConnected?()=>setAppleConnected(false):handleApple}
          style={{ padding:"8px 18px", border:`1.5px solid ${appleConnected?C.border:accentColor}`, borderRadius:22, background:appleConnected?C.white:accentColor, color:appleConnected?C.textSm:"#fff", fontWeight:600, fontSize:12.5, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
          {applePending?"Connecting…":appleConnected?"Disconnect":"Connect"}
        </button>
      </div>
    </div>
  );
}

// ─── ACCOUNT TAB ──────────────────────────────────────────────────────────────
function AccountTab({ role }: { role: string }) {
  const [acc, setAcc] = useState({ firstName:"Mark", lastName:"Williams", email:"mark.w@globalcare.com", phone:"+1 310-555-1010" });
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showPwChange, setShowPwChange] = useState(false);
  const [pw, setPw] = useState({ current:"", newPw:"", confirm:"" });
  const [pwSaved, setPwSaved] = useState(false);
  const [saved, setSaved] = useState(false);
  const isMobile = useIsMobile();

  const handleEmailChange = () => {
    if (!newEmail.trim()||!newEmail.includes("@")) return;
    setEmailSent(true);
    setTimeout(()=>{setEmailSent(false);setShowEmailChange(false);setNewEmail("");},4000);
  };
  const handlePwChange = () => {
    if (!pw.current||!pw.newPw||pw.newPw!==pw.confirm) return;
    setPwSaved(true);
    setTimeout(()=>{setPwSaved(false);setShowPwChange(false);setPw({current:"",newPw:"",confirm:""});},3000);
  };

  return (
    <div style={{ maxWidth:600, margin:"0 auto", display:"grid", gap:16 }}>
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:18 }}>Account Information</h3>
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"0 20px" }}>
          {([["First Name","firstName"],["Last Name","lastName"]] as [string,string][]).map(([l,k])=>(
            <div key={k} style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>{l}</label>
              <input value={(acc as Record<string,string>)[k]} onChange={(e: ChangeEvent<HTMLInputElement>)=>setAcc(p=>({...p,[k]:e.target.value}))}
                style={{ width:"100%", padding:"9px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
                onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.purple;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>Phone</label>
          <input value={acc.phone} onChange={(e: ChangeEvent<HTMLInputElement>)=>setAcc(p=>({...p,phone:e.target.value}))}
            style={{ width:"100%", padding:"9px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
            onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.purple;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
        </div>
        <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"10px 28px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Save Changes</button>
        {saved && <span className="fade-up" style={{ marginLeft:10, color:C.green, fontWeight:600, fontSize:13 }}>✓ Saved!</span>}
      </div>

      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:14 }}>Email Address</h3>
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:showEmailChange?14:0 }}>
          <div style={{ flex:1, padding:"9px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, background:C.offWhite, color:C.textMd }}>{acc.email}</div>
          <button onClick={()=>setShowEmailChange(s=>!s)} style={{ background:"none", border:`1.5px solid ${C.border}`, borderRadius:22, padding:"9px 16px", fontSize:13, fontWeight:600, color:C.teal, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>Change</button>
        </div>
        {showEmailChange && (
          <div className="fade-up" style={{ background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:12, padding:16 }}>
            {emailSent ? (
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                <div><div style={{ fontWeight:700, fontSize:14, color:C.green }}>Verification link sent!</div><div style={{ fontSize:12, color:C.textSm }}>Check <strong>{newEmail}</strong> to confirm.</div></div>
              </div>
            ) : (
              <>
                <p style={{ fontSize:12.5, color:C.textSm, marginBottom:10 }}>We&apos;ll send a verification link to your new email.</p>
                <div style={{ display:"flex", gap:8 }}>
                  <input type="email" value={newEmail} onChange={(e: ChangeEvent<HTMLInputElement>)=>setNewEmail(e.target.value)} placeholder="new.email@example.com"
                    style={{ flex:1, padding:"9px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:13, outline:"none", fontFamily:"inherit" }}
                    onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
                  <button onClick={handleEmailChange} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"9px 18px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Send Link</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:showPwChange?14:0 }}>
          <h3 style={{ fontWeight:700, fontSize:16 }}>Password</h3>
          <button onClick={()=>setShowPwChange(s=>!s)} style={{ background:"none", border:`1.5px solid ${C.border}`, borderRadius:22, padding:"8px 16px", fontSize:13, fontWeight:600, color:C.teal, cursor:"pointer", fontFamily:"inherit" }}>{showPwChange?"Cancel":"Change Password"}</button>
        </div>
        {showPwChange && (
          <div className="fade-up">
            {pwSaved ? (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                <span style={{ fontWeight:700, fontSize:14, color:C.green }}>Password updated!</span>
              </div>
            ) : (
              <>
                {([["Current Password","current"],["New Password","newPw"],["Confirm New Password","confirm"]] as [string,string][]).map(([l,k])=>(
                  <div key={k} style={{ marginBottom:12 }}>
                    <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>{l}</label>
                    <input type="password" value={(pw as Record<string,string>)[k]} onChange={(e: ChangeEvent<HTMLInputElement>)=>setPw(p=>({...p,[k]:e.target.value}))} placeholder="••••••••"
                      style={{ width:"100%", padding:"9px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
                      onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
                  </div>
                ))}
                {pw.newPw && pw.confirm && pw.newPw!==pw.confirm && <p style={{ fontSize:12, color:C.red, marginBottom:8 }}>Passwords don&apos;t match</p>}
                <button onClick={handlePwChange} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"10px 28px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Update Password</button>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:6 }}>Connected Accounts</h3>
        <p style={{ color:C.textSm, fontSize:13, marginBottom:18, lineHeight:1.5 }}>
          After your account is approved by admin, you can connect your Google and Apple accounts for faster login.
        </p>
        <OAuthConnections role={role} />
      </div>
    </div>
  );
}

// ─── FACILITATOR PORTAL ───────────────────────────────────────────────────────
export default function FacilitatorPortal({ tab, setTab }: { tab: string; setTab: React.Dispatch<React.SetStateAction<string>> }) {
  const [leads, setLeads] = useState<FacilLead[]>(FACIL_LEADS);
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProc, setFilterProc] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<FacilLead | null>(null);
  const isMobile = useIsMobile();

  const allProcs = ["All", ...Array.from(new Set(FACIL_LEADS.map(l=>l.procedure)))];

  let visible = leads.filter(l =>
    (filterStatus === "All" || l.status === filterStatus) &&
    (filterProc === "All" || l.procedure === filterProc) &&
    (!search || l.name.toLowerCase().includes(search.toLowerCase()) || l.procedure.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase()))
  );

  const sortLeads = (key: string) => {
    if (key === sortKey) { setSortDir(d => d === "asc" ? "desc" : "asc"); }
    else { setSortKey(key); setSortDir("asc"); }
  };

  visible = [...visible].sort((a,b) => {
    const av = (a as Record<string,unknown>)[sortKey];
    const bv = (b as Record<string,unknown>)[sortKey];
    const aStr = typeof av === "string" ? av.toLowerCase() : av;
    const bStr = typeof bv === "string" ? bv.toLowerCase() : bv;
    if ((aStr as number|string) < (bStr as number|string)) return sortDir === "asc" ? -1 : 1;
    if ((aStr as number|string) > (bStr as number|string)) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const all = leads;
  const genderCount = { Male: all.filter(l=>l.gender==="Male").length, Female: all.filter(l=>l.gender==="Female").length };
  const ageGroups = [
    { label:"18–29", count: all.filter(l=>l.age>=18&&l.age<=29).length },
    { label:"30–39", count: all.filter(l=>l.age>=30&&l.age<=39).length },
    { label:"40–49", count: all.filter(l=>l.age>=40&&l.age<=49).length },
    { label:"50–59", count: all.filter(l=>l.age>=50&&l.age<=59).length },
    { label:"60+",   count: all.filter(l=>l.age>=60).length },
  ];
  const maxAge = Math.max(...ageGroups.map(g=>g.count));
  const procedureCounts = allProcs.slice(1).map(p=>({ label:p, count:all.filter(l=>l.procedure===p).length })).sort((a,b)=>b.count-a.count);
  const maxProc = Math.max(...procedureCounts.map(p=>p.count));
  const locationCounts = Object.entries(all.reduce((acc,l)=>{ acc[l.location]=(acc[l.location]||0)+1; return acc; },{} as Record<string,number>)).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxLoc = Math.max(...locationCounts.map(l=>l[1]));
  const countryCounts = Object.entries(all.reduce((acc,l)=>{ acc[l.country]=(acc[l.country]||0)+1; return acc; },{} as Record<string,number>)).sort((a,b)=>b[1]-a[1]);
  const maxCountry = Math.max(...countryCounts.map(c=>c[1]));
  const maxMonthly = Math.max(...FACIL_STATS.monthly.map(m=>m.leads));

  const SortBtn = ({ k, label }: { k: string; label: string }) => (
    <th onClick={()=>sortLeads(k)} style={{ padding:"10px 14px", textAlign:"left", fontWeight:700, color:C.textSm, fontSize:10.5, letterSpacing:.5, cursor:"pointer", whiteSpace:"nowrap", userSelect:"none" }}>
      {label.toUpperCase()} {sortKey===k ? (sortDir==="asc"?"↑":"↓") : <span style={{opacity:.3}}>↕</span>}
    </th>
  );

  return (
    <div style={{ maxWidth:1040, margin:"0 auto", padding:"24px 16px" }}>
      {tab!=="account" && (
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22, flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800 }}>Facilitator Dashboard</h1>
            <p style={{ color:C.textSm, fontSize:13, marginTop:2 }}>MedTravel Facilitators · Partner</p>
          </div>
        </div>
      )}

      {tab==="overview"&&(
        <>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fit, minmax(150px,1fr))", gap:10, marginBottom:18 }}>
            {([
              ["Total Leads", FACIL_STATS.totalLeads, "All time"],
              ["New",         FACIL_STATS.newLeads,   "Uncontacted"],
              ["Converted",   FACIL_STATS.converted,  "This month"],
              ["Conv. Rate",  Math.round(FACIL_STATS.converted/FACIL_STATS.totalLeads*100)+"%", "This month"],
            ] as [string,string|number,string][]).map(([l,v,s])=>(
              <div key={l} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px" }}>
                <div style={{ fontSize:28, fontWeight:800, color:C.text }}>{v}</div>
                <div style={{ fontWeight:600, fontSize:13, marginTop:2 }}>{l}</div>
                <div style={{ fontSize:11.5, color:C.textSm, marginTop:2 }}>{s}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit,minmax(260px,1fr))", gap:14, marginBottom:14 }}>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Lead Status</h3>
              {["New","Contacted","Converted","Closed"].map(s=>{
                const cnt = leads.filter(l=>l.status===s).length;
                const sc = STATUS_COLORS[s];
                return (
                  <div key={s} style={{ marginBottom:13 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                      <span style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ width:8, height:8, borderRadius:"50%", background:sc.color, display:"inline-block" }}/>
                        <span style={{ fontWeight:600 }}>{s}</span>
                      </span>
                      <span style={{ color:C.textSm }}>{cnt} lead{cnt!==1?"s":""}</span>
                    </div>
                    <div style={{ height:6, background:C.gray, borderRadius:4 }}>
                      <div style={{ height:6, background:sc.color, borderRadius:4, width:`${(cnt/leads.length)*100}%`, transition:"width .4s" }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Monthly Leads vs Conversions</h3>
              <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:90 }}>
                {FACIL_STATS.monthly.map(m=>(
                  <div key={m.m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                    <div style={{ width:"100%", display:"flex", gap:2, alignItems:"flex-end", height:68 }}>
                      <div style={{ flex:1, background:C.teal, borderRadius:"3px 3px 0 0", height:`${(m.leads/maxMonthly)*68}px`, opacity:.8 }}/>
                      <div style={{ flex:1, background:C.purple, borderRadius:"3px 3px 0 0", height:`${(m.conv/maxMonthly)*68}px`, opacity:.7 }}/>
                    </div>
                    <div style={{ fontSize:9.5, color:C.textSm }}>{m.m}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:14, marginTop:10 }}>
                <span style={{ fontSize:11, color:C.textSm, display:"flex", alignItems:"center", gap:5 }}><span style={{ width:10, height:10, borderRadius:2, background:C.teal, display:"inline-block" }}/> Leads</span>
                <span style={{ fontSize:11, color:C.textSm, display:"flex", alignItems:"center", gap:5 }}><span style={{ width:10, height:10, borderRadius:2, background:C.purple, display:"inline-block" }}/> Converted</span>
              </div>
            </div>
          </div>

          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ fontWeight:700, fontSize:14 }}>Recent Requests</h3>
              <button onClick={()=>setTab("leads")} style={{ background:"none", border:"none", color:C.teal, fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit" }}>View all</button>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:520 }}>
                <tbody>
                  {leads.slice(0,5).map(l=>(
                    <tr key={l.id} style={{ borderTop:`1px solid ${C.border}`, cursor:"pointer" }} onClick={()=>{ setSelectedLead(l); setTab("leads"); }}>
                      <td style={{ padding:"11px 18px", fontWeight:600 }}>{l.name}</td>
                      <td style={{ padding:"11px 14px", color:C.textSm }}>{l.procedure}</td>
                      <td style={{ padding:"11px 14px", color:C.textSm }}>{l.country}</td>
                      <td style={{ padding:"11px 14px" }}><Badge bg={STATUS_COLORS[l.status].bg} color={STATUS_COLORS[l.status].color}>{l.status}</Badge></td>
                      <td style={{ padding:"11px 18px", color:C.textSm, fontSize:12 }}>{l.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab==="leads"&&(
        <>
          <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
            <input value={search} onChange={(e: ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value)} placeholder="Search name, procedure, city…"
              style={{ flex:1, minWidth:180, padding:"9px 15px", border:`1.5px solid ${C.border}`, borderRadius:22, fontSize:13.5, outline:"none", fontFamily:"inherit" }}
              onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}}/>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
              style={{ padding:"9px 14px", border:`1.5px solid ${C.border}`, borderRadius:22, fontSize:13, fontFamily:"inherit", background:C.white, cursor:"pointer", outline:"none", minWidth:130 }}>
              {["All","New","Contacted","Converted","Closed"].map(s=><option key={s} value={s}>{s==="All"?"All Statuses":s}</option>)}
            </select>
            <select value={filterProc} onChange={e=>setFilterProc(e.target.value)}
              style={{ padding:"9px 14px", border:`1.5px solid ${C.border}`, borderRadius:22, fontSize:13, fontFamily:"inherit", background:C.white, cursor:"pointer", outline:"none", minWidth:180 }}>
              {allProcs.map(p=><option key={p} value={p}>{p==="All"?"All Procedures":p}</option>)}
            </select>
          </div>
          <p style={{ fontSize:12.5, color:C.textSm, marginBottom:12 }}>{visible.length} request{visible.length!==1?"s":""}</p>

          {selectedLead && (
            <div className="fade-up" style={{ background:C.white, border:`2px solid ${C.purple}40`, borderRadius:14, padding:"18px 20px", marginBottom:16, position:"relative" }}>
              <button onClick={()=>setSelectedLead(null)} style={{ position:"absolute", top:14, right:14, background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.textSm, lineHeight:1 }}>×</button>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
                <h3 style={{ fontWeight:800, fontSize:15 }}>{selectedLead.name}</h3>
                <Badge bg={STATUS_COLORS[selectedLead.status].bg} color={STATUS_COLORS[selectedLead.status].color}>{selectedLead.status}</Badge>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))", gap:10, marginBottom:16 }}>
                {([["Procedure",selectedLead.procedure],["Destination",selectedLead.country],["Location",selectedLead.location],["Age",String(selectedLead.age)],["Gender",selectedLead.gender],["Email",selectedLead.email],["Phone",selectedLead.phone],["Date",selectedLead.date]] as [string,string][]).map(([k,v])=>(
                  <div key={k}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textSm, letterSpacing:.5, marginBottom:3 }}>{k.toUpperCase()}</div>
                    <div style={{ fontSize:13.5, fontWeight:500 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                <span style={{ fontSize:11, fontWeight:700, color:C.textSm, letterSpacing:.4 }}>STATUS</span>
                {["New","Contacted","Converted","Closed"].map(s=>(
                  <button key={s} onClick={()=>{ setLeads(ls=>ls.map(l=>l.id===selectedLead.id?{...l,status:s}:l)); setSelectedLead(prev=>prev?{...prev,status:s}:prev); }}
                    style={{ padding:"6px 14px", border:`1.5px solid ${selectedLead.status===s?STATUS_COLORS[s].color:C.border}`, borderRadius:18, background:selectedLead.status===s?STATUS_COLORS[s].bg:C.white, color:selectedLead.status===s?STATUS_COLORS[s].color:C.textSm, fontSize:12, fontWeight:selectedLead.status===s?700:400, cursor:"pointer", fontFamily:"inherit", transition:"all .12s" }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:700 }}>
              <thead>
                <tr style={{ background:C.gray }}>
                  <SortBtn k="date"      label="Date"/>
                  <SortBtn k="name"      label="Name"/>
                  <SortBtn k="procedure" label="Procedure"/>
                  <SortBtn k="country"   label="Destination"/>
                  <SortBtn k="location"  label="Location"/>
                  <SortBtn k="age"       label="Age"/>
                  <SortBtn k="gender"    label="Gender"/>
                  <SortBtn k="status"    label="Status"/>
                </tr>
              </thead>
              <tbody>
                {visible.map(l=>(
                  <tr key={l.id} onClick={()=>setSelectedLead(l)}
                    style={{ borderTop:`1px solid ${C.border}`, cursor:"pointer", background:selectedLead?.id===l.id?C.purpleLt:"transparent", transition:"background .1s" }}
                    onMouseEnter={e=>{ if(selectedLead?.id!==l.id) (e.currentTarget as HTMLTableRowElement).style.background=C.offWhite; }}
                    onMouseLeave={e=>{ if(selectedLead?.id!==l.id) (e.currentTarget as HTMLTableRowElement).style.background="transparent"; }}>
                    <td style={{ padding:"11px 14px", color:C.textSm, whiteSpace:"nowrap" }}>{l.date}</td>
                    <td style={{ padding:"11px 14px", fontWeight:600, whiteSpace:"nowrap" }}>{l.name}</td>
                    <td style={{ padding:"11px 14px" }}>{l.procedure}</td>
                    <td style={{ padding:"11px 14px", color:C.textSm }}>{l.country}</td>
                    <td style={{ padding:"11px 14px", color:C.textSm, whiteSpace:"nowrap" }}>{l.location}</td>
                    <td style={{ padding:"11px 14px", color:C.textSm, textAlign:"center" }}>{l.age}</td>
                    <td style={{ padding:"11px 14px", color:C.textSm }}>{l.gender}</td>
                    <td style={{ padding:"11px 18px" }}><Badge bg={STATUS_COLORS[l.status].bg} color={STATUS_COLORS[l.status].color}>{l.status}</Badge></td>
                  </tr>
                ))}
                {visible.length===0&&<tr><td colSpan={8} style={{ padding:"40px", textAlign:"center", color:C.textSm }}>No leads match filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab==="analytics"&&(
        <div style={{ display:"grid", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>Gender Distribution</h3>
              <div style={{ display:"flex", gap:16, alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                {([["Male",genderCount.Male,C.teal],["Female",genderCount.Female,C.purple]] as [string,number,string][]).map(([g,cnt,col])=>(
                  <div key={g} style={{ textAlign:"center" }}>
                    <div style={{ width:80, height:80, borderRadius:"50%", background:`conic-gradient(${col} 0% ${Math.round(cnt/all.length*100)}%, ${C.gray} ${Math.round(cnt/all.length*100)}% 100%)`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", position:"relative" }}>
                      <div style={{ width:54, height:54, borderRadius:"50%", background:C.white, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontSize:16, fontWeight:800, color:col }}>{Math.round(cnt/all.length*100)}%</span>
                      </div>
                    </div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{g}</div>
                    <div style={{ fontSize:12, color:C.textSm }}>{cnt} leads</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Age Groups</h3>
              {ageGroups.map(g=>(
                <div key={g.label} style={{ marginBottom:11 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ fontWeight:600 }}>{g.label}</span>
                    <span style={{ color:C.textSm }}>{g.count} lead{g.count!==1?"s":""}</span>
                  </div>
                  <div style={{ height:7, background:C.gray, borderRadius:4 }}>
                    <div style={{ height:7, background:`linear-gradient(90deg, ${C.teal}, ${C.purple})`, borderRadius:4, width:`${maxAge?Math.round(g.count/maxAge*100):0}%`, transition:"width .4s" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Top Locations</h3>
              {locationCounts.map(([loc,cnt])=>(
                <div key={loc} style={{ marginBottom:11 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ fontWeight:600 }}>{loc}</span>
                    <span style={{ color:C.textSm }}>{cnt}</span>
                  </div>
                  <div style={{ height:7, background:C.gray, borderRadius:4 }}>
                    <div style={{ height:7, background:C.teal, borderRadius:4, width:`${Math.round(cnt/maxLoc*100)}%`, transition:"width .4s" }}/>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Requested Destinations</h3>
              {countryCounts.map(([country,cnt])=>(
                <div key={country} style={{ marginBottom:11 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ fontWeight:600 }}>{country}</span>
                    <span style={{ color:C.textSm }}>{cnt}</span>
                  </div>
                  <div style={{ height:7, background:C.gray, borderRadius:4 }}>
                    <div style={{ height:7, background:C.purple, borderRadius:4, width:`${Math.round(cnt/maxCountry*100)}%`, transition:"width .4s" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
            <h3 style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Procedures Requested</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:10 }}>
              {procedureCounts.map(p=>(
                <div key={p.label} style={{ marginBottom:4 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ fontWeight:600 }}>{p.label}</span>
                    <span style={{ color:C.textSm }}>{p.count}</span>
                  </div>
                  <div style={{ height:7, background:C.gray, borderRadius:4 }}>
                    <div style={{ height:7, background:`linear-gradient(90deg,${C.purple},${C.teal})`, borderRadius:4, width:`${Math.round(p.count/maxProc*100)}%`, transition:"width .4s" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==="account"&&<AccountTab role="facilitator" />}
    </div>
  );
}
