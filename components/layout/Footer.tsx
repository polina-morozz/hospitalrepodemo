import { useState } from "react";
import { useRouter } from "next/router";
import C from "@/lib/tokens";
import useIsMobile from "@/lib/hooks/useIsMobile";

// ─── FOOTER ───────────────────────────────────────────────────────────────────
export default function Footer() {
  const [showContact, setShowContact] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  return (
    <>
      {showContact && (
        <div onClick={e=>{if(e.target===e.currentTarget)setShowContact(false);}} style={{ position:"fixed", inset:0, background:"rgba(10,20,30,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600, padding:16, backdropFilter:"blur(3px)" }}>
          <div className="fade-up" style={{ background:C.white, borderRadius:20, padding:"32px 28px", maxWidth:400, width:"100%", boxShadow:"0 24px 60px rgba(0,0,0,.2)", textAlign:"center" }}>
            <div style={{ width:52, height:52, borderRadius:14, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={C.teal} stroke="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z"/></svg>
            </div>
            <h3 style={{ fontWeight:800, fontSize:20, marginBottom:12 }}>Contact Us</h3>
            <div style={{ fontSize:14, color:C.textMd, marginBottom:8 }}><strong>Phone:</strong> +1 (855) 962-0100</div>
            <div style={{ fontSize:14, color:C.textMd, marginBottom:8 }}><strong>Email:</strong> support@hospital.com</div>
            <div style={{ fontSize:14, color:C.textMd, marginBottom:20 }}><strong>Address:</strong> 350 Fifth Avenue, Suite 4820, New York, NY 10118</div>
            <div style={{ display:"flex", gap:8 }}>
              <a href="tel:+18559620100" className="btn-primary" style={{ flex:1, background:C.teal, color:"#fff", border:"none", borderRadius:12, padding:"12px", fontWeight:700, fontSize:14, textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:6, cursor:"pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z"/></svg>
                Call Now
              </a>
              <button onClick={()=>setShowContact(false)} style={{ flex:1, background:C.white, color:C.textMd, border:`1.5px solid ${C.border}`, borderRadius:12, padding:"12px", fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ background:"#0E1C26", padding:isMobile?"32px 16px":"48px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4, 1fr)", gap:isMobile?24:40, marginBottom:32 }}>
            <div>
              <div style={{ marginBottom:14 }}><span style={{ fontSize:18, fontWeight:800 }}><span style={{ color:C.teal }}>Hospital</span><span style={{ color:C.teal }}>.com</span></span></div>
              <p style={{ fontSize:12.5, color:"#7A8FA0", lineHeight:1.6 }}>AI-powered healthcare platform connecting patients with trusted providers worldwide.</p>
              <button onClick={()=>setShowContact(true)} style={{ marginTop:14, background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"9px 20px", fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z"/></svg>
                Contact Us
              </button>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#fff", marginBottom:12 }}>For Patients</div>
              {["AI Health Assistant","Find Local Care","Global Health Services","Browse Specialties","Insurance Plans"].map(l=>(
                <div key={l} style={{ fontSize:12.5, color:"#7A8FA0", padding:"4px 0", cursor:"pointer" }} onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.color=C.teal} onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.color="#7A8FA0"}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#fff", marginBottom:12 }}>For Providers</div>
              {["Become a Partner","List Your Practice","Provider Dashboard","Facilitator Portal","Help Center"].map(l=>(
                <div key={l} onClick={l==="Become a Partner"?()=>router.push("/become-provider"):undefined} style={{ fontSize:12.5, color:"#7A8FA0", padding:"4px 0", cursor:"pointer" }} onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.color=C.teal} onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.color="#7A8FA0"}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#fff", marginBottom:12 }}>Company</div>
              {["About Us","Careers","Press","Blog"].map(l=>(
                <div key={l} style={{ fontSize:12.5, color:"#7A8FA0", padding:"4px 0", cursor:"pointer" }} onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.color=C.teal} onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.color="#7A8FA0"}>{l}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid #1a3a4a", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {["Privacy Policy","Terms of Service","Cookie Policy","Accessibility"].map(l=>(
                <span key={l} style={{ fontSize:12, color:"#7A8FA0", cursor:"pointer" }}>{l}</span>
              ))}
            </div>
            <div style={{ fontSize:11.5, color:"#546A7B" }}>© 2026 Hospital.com. All rights reserved.</div>
          </div>
        </div>
      </div>
    </>
  );
}
