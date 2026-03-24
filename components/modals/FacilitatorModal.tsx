import { useState, useEffect, ChangeEvent } from "react";
import C from "@/lib/tokens";
import FieldInput from "@/components/ui/FieldInput";
import type { IntlClinic } from "@/lib/data/intlClinics";

// ─── FacilitatorModal ─────────────────────────────────────────────────────────
interface FacilitatorModalProps {
  onClose: () => void;
  clinic?: IntlClinic;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  procedure: string;
  country: string;
  clinicName: string;
  message: string;
}

// TODO(backend): POST /api/facilitators/contact — req.body: { name, email, phone, procedure, country, clinicId, message }
export default function FacilitatorModal({ onClose, clinic }: FacilitatorModalProps) {
  const hasClinic = !!clinic;
  const [f, setF] = useState<FormState>({
    name:"", email:"", phone:"",
    procedure: "",
    country: hasClinic ? `${clinic!.country} — ${clinic!.city}` : "",
    clinicName: hasClinic ? clinic!.name : "",
    message:""
  });
  const [selectedProcs, setSelectedProcs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const toggleProc = (p: string) => setSelectedProcs(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev, p]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }} style={{ position:"fixed", inset:0, background:"rgba(10,20,30,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600, padding:16, backdropFilter:"blur(3px)" }}>
      <div className="fade-up" style={{ background:C.white, borderRadius:20, width:"100%", maxWidth:500, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 60px rgba(0,0,0,.22)" }}>
        <div style={{ padding:"22px 24px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:C.white, zIndex:10, borderRadius:"20px 20px 0 0" }}>
          <div>
            <h2 style={{ fontWeight:800, fontSize:18 }}>Talk to a Facilitator</h2>
            <p style={{ color:C.textSm, fontSize:12.5, marginTop:3 }}>Our medical coordinators will reach out within 24 hours.</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:24, lineHeight:1, padding:4 }}>×</button>
        </div>
        <div style={{ padding:"22px 24px" }}>
          {done ? (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
              </div>
              <h3 style={{ fontWeight:800, fontSize:19, marginBottom:10 }}>Request Sent!</h3>
              <p style={{ color:C.textSm, fontSize:14, lineHeight:1.6 }}>Thank you! A medical coordinator will reach out to you within 24 hours.</p>
              <button className="btn-primary" onClick={onClose} style={{ marginTop:24, background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"11px 32px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Close</button>
            </div>
          ) : (
            <>
              {hasClinic && clinic && (
                <div style={{ background:C.tealLt, border:`1px solid ${C.teal}25`, borderRadius:12, padding:"14px 16px", marginBottom:18, display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:C.teal, flexShrink:0, border:`1px solid ${C.teal}20` }}>{clinic.image}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13.5, color:C.text }}>{clinic.name}</div>
                    <div style={{ fontSize:12, color:C.textSm }}>{clinic.city}, {clinic.country} {clinic.flag}</div>
                  </div>
                </div>
              )}

              <FieldInput label="Full Name *" type="text" value={f.name} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,name:e.target.value}))} placeholder="Your full name" />
              <FieldInput label="Email *" type="email" value={f.email} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,email:e.target.value}))} placeholder="you@example.com" />
              <FieldInput label="Phone Number" type="tel" value={f.phone} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,phone:e.target.value}))} placeholder="+1 212-555-0000" />

              {hasClinic && clinic ? (
                <>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Clinic</label>
                    <div style={{ padding:"10px 13px", border:`1.5px solid ${C.borderLt}`, borderRadius:9, fontSize:14, background:C.offWhite, color:C.textMd }}>{clinic.name}</div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Country</label>
                    <div style={{ padding:"10px 13px", border:`1.5px solid ${C.borderLt}`, borderRadius:9, fontSize:14, background:C.offWhite, color:C.textMd }}>{clinic.city}, {clinic.country}</div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:8 }}>Procedure(s) *</label>
                    <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                      {(clinic.procedures||[]).map(p => {
                        const active = selectedProcs.includes(p);
                        return (
                          <button key={p} onClick={()=>toggleProc(p)} style={{ padding:"7px 14px", border:`1.5px solid ${active?C.teal:C.border}`, borderRadius:20, background:active?C.tealLt:C.white, color:active?C.teal:C.textMd, fontSize:13, fontWeight:active?700:400, cursor:"pointer", fontFamily:"inherit", transition:"all .15s", display:"flex", alignItems:"center", gap:5 }}>
                            {active && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                            {p}
                          </button>
                        );
                      })}
                    </div>
                    {selectedProcs.length === 0 && <p style={{ fontSize:11, color:C.textSm, marginTop:6 }}>Select one or more procedures</p>}
                  </div>
                </>
              ) : (
                <>
                  <FieldInput label="Procedure *" type="text" value={f.procedure} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,procedure:e.target.value}))} placeholder="e.g. Hair transplant, Dental implants, Knee replacement" />
                  <FieldInput label="Preferred country or region (optional)" type="text" value={f.country} onChange={(e: ChangeEvent<HTMLInputElement>)=>setF(p=>({...p,country:e.target.value}))} placeholder="e.g. Turkey, Southeast Asia, Europe" />
                </>
              )}

              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Short message (optional)</label>
                <textarea value={f.message} onChange={e=>setF(p=>({...p,message:e.target.value}))} placeholder="Any additional details or questions…" rows={3}
                  style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:14, outline:"none", fontFamily:"inherit", resize:"vertical", color:C.text }}
                  onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
              </div>
              <button className="btn-primary" onClick={()=>setDone(true)} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Send Request</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
