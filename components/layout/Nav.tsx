import { useState } from "react";
import { useRouter } from "next/router";
import C from "@/lib/tokens";
import { useApp } from "@/lib/context/AppContext";

// ─── NAV ──────────────────────────────────────────────────────────────────────
// In the Next.js migration, Nav is the global top navigation bar.
// The "view mode" (patient / provider / facilitator) is handled via the
// FloatingViewSwitcher FAB and the AppContext, which sets isProviderView /
// isFacilitatorView. Tab state within dashboards is managed locally on each
// dashboard page and passed down.

interface NavProps {
  isProviderView: boolean;
  setIsProviderView: React.Dispatch<React.SetStateAction<boolean>>;
  isFacilitatorView: boolean;
  setIsFacilitatorView: React.Dispatch<React.SetStateAction<boolean>>;
  showUserProfile: boolean;
  setShowUserProfile: React.Dispatch<React.SetStateAction<boolean>>;
  providerTab: string;
  setProviderTab: React.Dispatch<React.SetStateAction<string>>;
  facilitatorTab: string;
  setFacilitatorTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function Nav({
  isProviderView, setIsProviderView,
  isFacilitatorView, setIsFacilitatorView,
  showUserProfile, setShowUserProfile,
  providerTab, setProviderTab,
  facilitatorTab, setFacilitatorTab,
}: NavProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useApp();

  const patientLinks: { label: string; href: string; tab?: undefined }[] = [
    { label:"AI Health Assistant", href:"/ai-assistant" },
    { label:"Find Local Care", href:"/find-local-care" },
    { label:"Global Health Services", href:"/medical-tourism" },
  ];
  const providerLinks: { label: string; tab: string; href?: undefined }[] = [
    { label:"Overview", tab:"overview" },
    { label:"Leads", tab:"leads" },
    { label:"Calendar", tab:"calendar" },
    { label:"Portal", tab:"portal" },
    { label:"My Clinics", tab:"profile" },
    { label:"Account", tab:"account" },
  ];
  const facilitatorLinks: { label: string; tab: string; href?: undefined }[] = [
    { label:"Overview", tab:"overview" },
    { label:"Leads", tab:"leads" },
    { label:"Analytics", tab:"analytics" },
    { label:"Account", tab:"account" },
  ];

  type NavLink = { label: string; href?: string; tab?: string };
  const activeLinks: NavLink[] = isProviderView ? providerLinks : isFacilitatorView ? facilitatorLinks : patientLinks;
  const accentColor = isProviderView ? C.teal : isFacilitatorView ? C.purple : C.teal;

  const handleLogoClick = () => {
    if (isProviderView || isFacilitatorView || showUserProfile) {
      setIsProviderView(false);
      setIsFacilitatorView(false);
      setShowUserProfile(false);
    } else {
      router.push("/");
    }
    setOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProviderView(false);
    setIsFacilitatorView(false);
    setShowUserProfile(false);
    setOpen(false);
  };

  return (
    <>
      <nav style={{ height:58, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", background:"rgba(255,255,255,0.92)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:200 }}>
        <div onClick={handleLogoClick} style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", userSelect:"none", minWidth:140 }}>
          <span style={{ fontSize:17, fontWeight:800, letterSpacing:"-.3px" }}>
            <span style={{ color:C.teal }}>hospital</span><span style={{ color:"#13527a", fontWeight:500, fontSize:14 }}>.com</span>
          </span>
          {(isProviderView || isFacilitatorView) && (
            <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:6, marginLeft:4, background:isProviderView?C.tealLt:C.purpleLt, color:isProviderView?C.teal:C.purple }}>
              {isProviderView ? "Provider" : "Facilitator"}
            </span>
          )}
        </div>

        <ul className="nav-desktop" style={{ display:"flex", gap:isProviderView||isFacilitatorView?8:28, listStyle:"none", position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
          {activeLinks.map(l => {
            if (l.href) {
              return (
                <li key={l.label}>
                  <button className="nav-link" onClick={() => { router.push(l.href!); setShowUserProfile(false); }}>
                    {l.label}
                  </button>
                </li>
              );
            }
            const isActive = isProviderView ? providerTab===l.tab : facilitatorTab===l.tab;
            return (
              <li key={l.label}>
                <button
                  onClick={() => { isProviderView ? setProviderTab(l.tab!) : setFacilitatorTab(l.tab!); }}
                  style={{ padding:"8px 16px", background:isActive?`${accentColor}12`:"none", border:"none", borderRadius:10, fontWeight:isActive?700:500, fontSize:13.5, color:isActive?accentColor:C.textSm, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}
                  onMouseEnter={e=>{if(!isActive)(e.currentTarget as HTMLButtonElement).style.color=accentColor;}}
                  onMouseLeave={e=>{if(!isActive)(e.currentTarget as HTMLButtonElement).style.color=C.textSm;}}
                >
                  {l.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="nav-desktop" style={{ display:"flex", gap:8, alignItems:"center" }}>
          {(isProviderView || isFacilitatorView || showUserProfile) ? (
            <button onClick={handleLogout} style={{ padding:"7px 18px", border:`1.5px solid ${C.border}`, borderRadius:22, background:C.white, color:C.textSm, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log Out
            </button>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => router.push("/login")} style={{ padding:"7px 18px", border:`1.5px solid ${C.border}`, borderRadius:22, background:C.white, color:C.textMd, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Login</button>
              <button className="btn-primary" onClick={() => router.push("/signup")} style={{ padding:"7px 18px", border:"none", borderRadius:22, background:C.teal, color:"#fff", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Sign Up</button>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setOpen(o=>!o)} style={{ display:"none", flexDirection:"column", gap:5, background:"none", border:"none", cursor:"pointer", padding:4 }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ width:20, height:2, background:C.text, borderRadius:2, display:"block", transition:"all .2s",
              transform: open ? (i===0?"rotate(45deg) translate(5px,5px)":i===2?"rotate(-45deg) translate(5px,-5px)":"none") : "none",
              opacity: open && i===1 ? 0 : 1 }} />
          ))}
        </button>
      </nav>

      {open && (
        <div className="mobile-menu-panel fade-up" style={{ position:"fixed", top:58, left:0, right:0, background:C.white, borderBottom:`1px solid ${C.border}`, zIndex:199, padding:"12px 20px 20px", boxShadow:"0 8px 24px rgba(0,0,0,.1)" }}>
          {activeLinks.map(l => (
            <button key={l.label} onClick={() => {
              if (l.href) { router.push(l.href); setShowUserProfile(false); }
              else if (isProviderView && l.tab) setProviderTab(l.tab);
              else if (isFacilitatorView && l.tab) setFacilitatorTab(l.tab);
              setOpen(false);
            }} style={{ display:"block", width:"100%", textAlign:"left", padding:"13px 0", background:"none", border:"none", borderBottom:`1px solid ${C.borderLt}`, fontSize:15, fontWeight:500, color:C.text, cursor:"pointer", fontFamily:"inherit" }}>
              {l.label}
            </button>
          ))}
          {(isProviderView || isFacilitatorView || showUserProfile) ? (
            <button onClick={handleLogout} style={{ marginTop:16, width:"100%", padding:"11px", border:`1.5px solid ${C.border}`, borderRadius:22, background:C.white, color:C.textSm, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log Out
            </button>
          ) : (
            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <button onClick={() => { router.push("/login"); setOpen(false); }} style={{ flex:1, padding:"11px", border:`1.5px solid ${C.border}`, borderRadius:22, background:C.white, color:C.textMd, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Login</button>
              <button onClick={() => { router.push("/signup"); setOpen(false); }} style={{ flex:1, padding:"11px", border:"none", borderRadius:22, background:C.teal, color:"#fff", fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Sign Up</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
