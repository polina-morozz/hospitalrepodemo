import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import C from "@/lib/tokens";

// ─── FLOATING VIEW SWITCHER (prototype-only FAB) ──────────────────────────────
interface FloatingViewSwitcherProps {
  showUserProfile: boolean;
  setShowUserProfile: React.Dispatch<React.SetStateAction<boolean>>;
  isProviderView: boolean;
  setIsProviderView: React.Dispatch<React.SetStateAction<boolean>>;
  isFacilitatorView: boolean;
  setIsFacilitatorView: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FloatingViewSwitcher({
  showUserProfile, setShowUserProfile,
  isProviderView, setIsProviderView,
  isFacilitatorView, setIsFacilitatorView,
}: FloatingViewSwitcherProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = showUserProfile ? "user" : isProviderView ? "provider" : isFacilitatorView ? "facilitator" : null;

  return (
    <div ref={ref} style={{ position:"fixed", bottom:24, right:24, zIndex:500 }}>
      {open && (
        <div className="fade-up" style={{ position:"absolute", bottom:"calc(100% + 10px)", right:0, width:220, background:C.white, border:`1px solid ${C.border}`, borderRadius:16, boxShadow:"0 12px 40px rgba(0,0,0,.15)", padding:8, display:"flex", flexDirection:"column", gap:4 }}>
          <div style={{ padding:"6px 12px", fontSize:11, fontWeight:700, color:C.textSm, letterSpacing:".5px" }}>SWITCH VIEW</div>

          <button onClick={()=>{setShowUserProfile(true);setIsProviderView(false);setIsFacilitatorView(false);setOpen(false);router.push("/profile");}}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:"none", borderRadius:12, background:active==="user"?"#FFF3E0":"transparent", cursor:"pointer", fontFamily:"inherit", width:"100%", textAlign:"left", transition:"background .12s" }}
            onMouseEnter={e=>{if(active!=="user")(e.currentTarget as HTMLButtonElement).style.background=C.gray;}}
            onMouseLeave={e=>{if(active!=="user")(e.currentTarget as HTMLButtonElement).style.background="transparent";}}>
            <div style={{ width:32, height:32, borderRadius:10, background:active==="user"?"#E87722":"#FFF3E0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active==="user"?"#fff":"#E87722"} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:active==="user"?"#E87722":C.text }}>My Profile</div>
              <div style={{ fontSize:10.5, color:C.textSm }}>Personal settings</div>
            </div>
          </button>

          <button onClick={()=>{setIsProviderView(v=>!v);setIsFacilitatorView(false);setShowUserProfile(false);setOpen(false);}}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:"none", borderRadius:12, background:active==="provider"?C.tealLt:"transparent", cursor:"pointer", fontFamily:"inherit", width:"100%", textAlign:"left", transition:"background .12s" }}
            onMouseEnter={e=>{if(active!=="provider")(e.currentTarget as HTMLButtonElement).style.background=C.gray;}}
            onMouseLeave={e=>{if(active!=="provider")(e.currentTarget as HTMLButtonElement).style.background="transparent";}}>
            <div style={{ width:32, height:32, borderRadius:10, background:active==="provider"?C.teal:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active==="provider"?"#fff":C.teal} strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:active==="provider"?C.teal:C.text }}>Provider Dashboard</div>
              <div style={{ fontSize:10.5, color:C.textSm }}>Manage your practice</div>
            </div>
          </button>

          <button onClick={()=>{setIsFacilitatorView(v=>!v);setIsProviderView(false);setShowUserProfile(false);setOpen(false);}}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:"none", borderRadius:12, background:active==="facilitator"?C.purpleLt:"transparent", cursor:"pointer", fontFamily:"inherit", width:"100%", textAlign:"left", transition:"background .12s" }}
            onMouseEnter={e=>{if(active!=="facilitator")(e.currentTarget as HTMLButtonElement).style.background=C.gray;}}
            onMouseLeave={e=>{if(active!=="facilitator")(e.currentTarget as HTMLButtonElement).style.background="transparent";}}>
            <div style={{ width:32, height:32, borderRadius:10, background:active==="facilitator"?C.purple:C.purpleLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active==="facilitator"?"#fff":C.purple} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:active==="facilitator"?C.purple:C.text }}>Facilitator Portal</div>
              <div style={{ fontSize:10.5, color:C.textSm }}>Manage leads &amp; clients</div>
            </div>
          </button>

          {active && (
            <button onClick={()=>{setShowUserProfile(false);setIsProviderView(false);setIsFacilitatorView(false);setOpen(false);}}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:"none", borderRadius:12, background:"transparent", cursor:"pointer", fontFamily:"inherit", width:"100%", textAlign:"left", borderTop:`1px solid ${C.borderLt}`, marginTop:2, paddingTop:12 }}
              onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background=C.gray}
              onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background="transparent"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>
              <span style={{ fontWeight:600, fontSize:13, color:C.textSm }}>Back to Patient View</span>
            </button>
          )}
        </div>
      )}

      <button onClick={()=>setOpen(o=>!o)}
        style={{ width:48, height:48, borderRadius:16, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", boxShadow:"0 4px 20px rgba(0,0,0,.15)",
          background: active==="user" ? "linear-gradient(135deg, #E87722, #FFB347)" :
                     active==="provider" ? `linear-gradient(135deg, ${C.teal}, #1275ad)` :
                     active==="facilitator" ? `linear-gradient(135deg, ${C.purple}, #9B6DD7)` :
                     C.white,
        }}>
        {active ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            {active==="user" && <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}
            {active==="provider" && <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>}
            {active==="facilitator" && <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>}
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2">
            <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
          </svg>
        )}
      </button>
    </div>
  );
}
