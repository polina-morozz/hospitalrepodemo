import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import C from "@/lib/tokens";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { useApp } from "@/lib/context/AppContext";

// ─── FEATURE ITEMS ────────────────────────────────────────────────────────────
const FEATURE_ITEMS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.6">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z"/>
        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z"/>
      </svg>
    ),
    title: "AI Health Assistant",
    sub: "Science-based guidance",
    href: "/ai-assistant",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.6">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="13" y2="17"/>
        <polyline points="9 9 10 9 11 9"/>
      </svg>
    ),
    title: "Provider Directory",
    sub: "Verified specialists",
    href: "/find-local-care",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.6">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: "Medical Tourism",
    sub: "Find care abroad",
    href: "/medical-tourism",
  },
];

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [q, setQ] = useState("");
  const isMobile = useIsMobile();
  const router = useRouter();
  const { setInitialQuery } = useApp();

  const send = (v?: string) => {
    const t = v || q;
    if (!t.trim()) return;
    setInitialQuery(t);
    router.push("/ai-assistant");
  };

  const suggestions = ["Laser hair removal near me", "Find a cardiologist", "Hair transplant clinics in Turkey"];

  return (
    <>
      <Head>
        <title>Hospital.com — AI-Powered Healthcare</title>
        <meta name="description" content="AI-powered healthcare platform connecting patients with trusted providers worldwide. Find local care, book appointments, and explore global health services." />
        <meta property="og:title" content="Hospital.com — AI-Powered Healthcare" />
        <meta property="og:description" content="Find trusted doctors, clinics, and global health services." />
        <link rel="canonical" href="https://www.hospital.com/" />
      </Head>

      <div style={{ height:"calc(100vh - 58px)", overflow:"hidden", display:"flex", flexDirection:"column", background:"#fff" }}>

        {/* ─── HERO ─────────────────────────────────────────────────────────── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:isMobile?"20px 20px 8px":"10px 20px 12px" }}>
          <div className="fade-up" style={{ textAlign:"center", maxWidth:680, width:"100%" }}>

            {/* Logo */}
            <div style={{ marginBottom:isMobile?6:8 }}>
              <span style={{ fontSize:isMobile?38:60, fontWeight:800, letterSpacing:"-1.5px", fontFamily:"'Outfit', sans-serif" }}>
                <span style={{ color:C.teal }}>hospital</span><span style={{ color:"#13527a", fontWeight:500, fontSize:isMobile?28:46 }}>.com</span>
              </span>
            </div>

            {/* Subtitle */}
            <p style={{ color:"#7a8fa0", fontSize:isMobile?13:17, marginBottom:isMobile?18:33, fontWeight:400, letterSpacing:"0.1px" }}>
              Your AI Healthcare Navigator
            </p>

            {/* Search bar */}
            <div style={{ position:"relative", marginBottom:10 }}>
              <input
                value={q}
                onChange={e=>setQ(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&send()}
                placeholder="Find doctors, compare treatments, explore medical options worldwide..."
                className="home-search-box"
                style={{ width:"100%", padding:isMobile?"12px 50px 12px 20px":"15px 58px 15px 26px", border:`1.5px solid ${C.border}`, borderRadius:40, fontSize:isMobile?13:15, outline:"none", boxSizing:"border-box", boxShadow:"0 4px 24px rgba(0,0,0,.07)", background:"#fff", fontFamily:"inherit", color:C.text }}
                onFocus={e=>{e.target.style.borderColor=C.teal; e.target.style.boxShadow=`0 4px 24px rgba(70,196,217,.15)`;}}
                onBlur={e=>{e.target.style.borderColor=C.border; e.target.style.boxShadow="0 4px 24px rgba(0,0,0,.07)";}}
              />
              <button onClick={()=>send()} style={{ position:"absolute", right:isMobile?8:10, top:"50%", transform:"translateY(-50%)", background:C.teal, border:"none", borderRadius:"50%", width:isMobile?34:38, height:isMobile?34:38, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"background .15s" }}
                onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background="#1275ad"}
                onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background=C.teal}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
              </button>
            </div>

            {/* Suggestion chips */}
            <div className="home-chips" style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:isMobile?20:35 }}>
              {suggestions.map(s=>(
                <button key={s} onClick={()=>send(s)}
                  style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:20, padding:isMobile?"5px 12px":"5px 14px", fontSize:isMobile?11:12.5, color:"#7a8fa0", cursor:"pointer", transition:"all .15s", fontFamily:"inherit" }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.teal;(e.currentTarget as HTMLButtonElement).style.color=C.teal;}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.border;(e.currentTarget as HTMLButtonElement).style.color="#7a8fa0";}}>
                  {s}
                </button>
              ))}
            </div>

            {/* Tagline */}
            <p style={{ color:"#13527a", fontSize:isMobile?12.5:14.5, fontWeight:600, marginBottom:isMobile?16:22, letterSpacing:"0.1px" }}>
              Connecting patients with verified healthcare providers worldwide
            </p>

            {/* Feature icons */}
            <div style={{ display:"flex", gap:isMobile?20:44, justifyContent:"center", flexWrap:"wrap" }}>
              {FEATURE_ITEMS.map(({icon,title,sub,href})=>(
                <button key={title} onClick={()=>router.push(href)}
                  style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:5, padding:"4px 10px", transition:"transform .15s" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)"}
                  onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.transform="none"}>
                  <div style={{ width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {icon}
                  </div>
                  <div style={{ fontWeight:600, fontSize:12, color:C.text }}>{title}</div>
                  <div style={{ fontSize:10.5, color:"#7a8fa0" }}>{sub}</div>
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
        <div style={{ padding:isMobile?"8px 20px":"8px 40px", background:"#efefef74", borderTop:"1px solid #E2E8ED", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <div style={{ display:"flex", gap:16, alignItems:"center" }}>
            <span style={{ fontSize:10.5, color:"#7a8fa0", cursor:"pointer" }} onMouseEnter={e=>(e.currentTarget as HTMLSpanElement).style.color=C.teal} onMouseLeave={e=>(e.currentTarget as HTMLSpanElement).style.color="#7a8fa0"}>Privacy Policy</span>
            <span style={{ fontSize:10.5, color:"#7a8fa0", cursor:"pointer" }} onMouseEnter={e=>(e.currentTarget as HTMLSpanElement).style.color=C.teal} onMouseLeave={e=>(e.currentTarget as HTMLSpanElement).style.color="#7a8fa0"}>Terms &amp; Conditions</span>
          </div>
          <button className="btn-primary" onClick={()=>router.push("/become-provider")} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:20, padding:"5px 16px", fontWeight:700, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>Become a Provider</button>
        </div>

      </div>
    </>
  );
}
