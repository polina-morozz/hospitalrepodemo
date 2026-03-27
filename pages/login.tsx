import { useState, ChangeEvent } from "react";
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

// ─── LOGIN PAGE ────────────────────────────────────────────────────────────────
// TODO(backend): replace mock login with POST /api/auth/login — req.body: { email, password, role }
// Response: { token, user: { id, name, email, role } }
// Store token in httpOnly cookie via Set-Cookie header.
export default function LoginPage() {
  const router = useRouter();
  const { setIsLoggedIn } = useApp();
  const isMobile = useIsMobile();
  const [role, setRole] = useState("patient");
  const [f, setF] = useState({ email:"", pw:"" });
  const [show, setShow] = useState(false);

  const handleLogin = () => {
    // TODO(backend): replace with real auth call
    setIsLoggedIn(true);
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>Sign In | Hospital.com</title>
        <meta name="description" content="Sign in to your Hospital.com account to book appointments, manage your health records, and access your dashboard." />
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding: isMobile ? "20px 12px" : "32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:440, background:C.white, borderRadius:20, padding: isMobile ? "28px 18px" : "36px 30px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <h1 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>Sign In</h1>
            <p style={{ color:C.textSm, fontSize:13 }}>Sign in to your Hospital.com account</p>
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:22 }}>
            {[{val:"patient",label:"Patient"},{val:"provider",label:"Provider"},{val:"facilitator",label:"Facilitator"}].map(r=>(
              <button key={r.val} onClick={()=>setRole(r.val)} style={{ flex:1, padding: isMobile ? "9px 4px" : "10px 8px", border:`2px solid ${role===r.val?(r.val==="facilitator"?C.purple:C.teal):C.border}`, borderRadius:50, background:role===r.val?(r.val==="facilitator"?C.purpleLt:C.tealLt):C.white, cursor:"pointer", fontFamily:"inherit", transition:"all .18s", fontSize: isMobile ? 12 : 13, fontWeight:700, color:role===r.val?(r.val==="facilitator"?C.purple:C.teal):C.textMd }}>
                {r.label}
              </button>
            ))}
          </div>
          {role==="patient" && (
            <>
              <SocialBtn letter="G" label="Continue with Google" />
              <SocialBtn letter="A" label="Continue with Apple" />
              <div style={{ display:"flex", alignItems:"center", gap:10, margin:"14px 0" }}>
                <div style={{ flex:1, height:1, background:C.border }}/><span style={{ fontSize:11, color:C.textSm, fontWeight:600, whiteSpace:"nowrap" }}>or with email</span><div style={{ flex:1, height:1, background:C.border }}/>
              </div>
            </>
          )}
          <FieldInput label="Email" type="email" value={f.email} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,email:e.target.value}))} placeholder="you@example.com" />
          <FieldInput label="Password" type={show?"text":"password"} value={f.pw} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,pw:e.target.value}))} placeholder="••••••••"
            hint={<button onClick={()=>{}} style={{ background:"none", border:"none", fontSize:12, color:C.teal, cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>Forgot?</button>}
            right={<button onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:11, color:C.textSm, fontWeight:700, fontFamily:"inherit" }}>{show?"Hide":"Show"}</button>} />
          <button className="btn-primary" onClick={handleLogin} style={{ width:"100%", background:role==="facilitator"?C.purple:C.teal, color:"#fff", border:"none", borderRadius:50, padding:"13px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Sign In as {role==="patient"?"Patient":role==="provider"?"Provider":"Facilitator"}</button>
          <p style={{ textAlign:"center", fontSize:13, color:C.textSm, marginTop:18 }}>No account?{" "}<button onClick={()=>router.push("/signup")} style={{ background:"none", border:"none", color:C.teal, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Sign Up</button></p>
        </div>
      </div>
    </>
  );
}
