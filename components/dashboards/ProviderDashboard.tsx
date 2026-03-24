import { useState, useRef, useEffect, ChangeEvent } from "react";
import C from "@/lib/tokens";
import useIsMobile from "@/lib/hooks/useIsMobile";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ALL_TIMES = ["8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];
const BOOKED = ["9:00","10:30","14:00"];

const MOCK_STATS = {
  totalLeads:142, visits:89, calls:31, bookings:22, pendingInvoice:1200,
  monthly:[{m:"Oct",v:18},{m:"Nov",v:24},{m:"Dec",v:19},{m:"Jan",v:31},{m:"Feb",v:28},{m:"Mar",v:22}],
  leads:[
    {date:"Mar 6",type:"Booking",user:"A.K.",status:"Confirmed",amount:50},
    {date:"Mar 6",type:"Call",user:"M.R.",status:"Confirmed",amount:25},
    {date:"Mar 5",type:"Website Visit",user:"S.T.",status:"Confirmed",amount:1},
    {date:"Mar 5",type:"Booking",user:"L.P.",status:"Pending",amount:50},
    {date:"Mar 4",type:"Call",user:"D.V.",status:"Confirmed",amount:25},
  ]
};

interface CalEvent {
  id: number;
  date: string;
  time: string;
  patient: string;
  reason: string;
  status: string;
  color: string;
  visitApproved: boolean;
  _newTime?: string;
}

const INIT_EVENTS: CalEvent[] = [
  { id:1, date:"2026-03-06", time:"9:00",  patient:"Alex K.",  reason:"Annual checkup",  status:"confirmed", color:C.teal,  visitApproved:false },
  { id:2, date:"2026-03-06", time:"10:30", patient:"Maria R.", reason:"Follow-up",        status:"confirmed", color:C.teal,  visitApproved:false },
  { id:3, date:"2026-03-06", time:"13:00", patient:"Sam T.",   reason:"Consultation",     status:"pending",   color:C.amber, visitApproved:false },
  { id:4, date:"2026-03-06", time:"15:00", patient:"Lisa P.",  reason:"New patient",      status:"pending",   color:C.amber, visitApproved:false },
  { id:5, date:"2026-03-09", time:"9:30",  patient:"John M.",  reason:"Skin treatment",   status:"confirmed", color:C.teal,  visitApproved:false },
  { id:6, date:"2026-03-09", time:"11:00", patient:"Sara B.",  reason:"Botox session",    status:"confirmed", color:C.teal,  visitApproved:false },
  { id:7, date:"2026-03-10", time:"10:00", patient:"Tom W.",   reason:"Check-up",         status:"pending",   color:C.amber, visitApproved:false },
  { id:8, date:"2026-03-11", time:"14:00", patient:"Nina S.",  reason:"Consultation",     status:"confirmed", color:C.teal,  visitApproved:false },
  { id:9, date:"2026-03-12", time:"9:00",  patient:"Paul D.",  reason:"Injectables",      status:"pending",   color:C.amber, visitApproved:false },
  { id:10,date:"2026-03-13", time:"16:00", patient:"Amy C.",   reason:"Follow-up",        status:"confirmed", color:C.teal,  visitApproved:false },
];

const INSURANCE_CARRIERS = [
  { name:"Aetna", color:"#7B2D8E" },
  { name:"BlueCross BlueShield", color:"#0073CF" },
  { name:"Cigna", color:"#E87722" },
  { name:"UnitedHealthcare", color:"#002677" },
  { name:"Medicare", color:"#00548E" },
  { name:"Humana", color:"#39B54A" },
  { name:"Kaiser Permanente", color:"#006BA6" },
  { name:"Medicaid", color:"#5C7A29" },
  { name:"Anthem", color:"#0033A0" },
  { name:"Oscar Health", color:"#FF6600" },
  { name:"Tricare", color:"#003F72" },
  { name:"Molina", color:"#8DC63F" },
];

// ─── BADGE ────────────────────────────────────────────────────────────────────
function Badge({ children, color = C.teal, bg = C.tealLt }: { children: React.ReactNode; color?: string; bg?: string }) {
  return <span style={{ background:bg, color, fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20, letterSpacing:.4, whiteSpace:"nowrap" }}>{children}</span>;
}

// ─── DEMO CALENDAR ────────────────────────────────────────────────────────────
function DemoCalendar({ events, setEvents }: { events: CalEvent[]; setEvents: React.Dispatch<React.SetStateAction<CalEvent[]>> }) {
  const [currentMonth, setCurrentMonth] = useState({ y:2026, m:2 });
  const [selectedDay, setSelectedDay] = useState("2026-03-06");
  const [rescheduleTarget, setRescheduleTarget] = useState<CalEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CalEvent | null>(null);

  const daysInMonth = new Date(currentMonth.y, currentMonth.m+1, 0).getDate();
  const firstDow = new Date(currentMonth.y, currentMonth.m, 1).getDay();
  const monthName = new Date(currentMonth.y, currentMonth.m, 1).toLocaleDateString("en",{month:"long",year:"numeric"});

  const pad = (n: number) => String(n).padStart(2,"0");
  const dateStr = (d: number) => `${currentMonth.y}-${pad(currentMonth.m+1)}-${pad(d)}`;
  const eventsForDay = (d: number) => events.filter(e=>e.date===dateStr(d));
  const selectedEvents = events.filter(e=>e.date===selectedDay);

  const prevMonth = () => setCurrentMonth(({y,m})=>m===0?{y:y-1,m:11}:{y,m:m-1});
  const nextMonth = () => setCurrentMonth(({y,m})=>m===11?{y:y+1,m:0}:{y,m:m+1});

  const handleDelete = (id: number) => { setEvents(e=>e.filter(ev=>ev.id!==id)); setDeleteTarget(null); };
  const handleReschedule = (id: number, newTime: string) => { setEvents(e=>e.map(ev=>ev.id===id?{...ev,time:newTime}:ev)); setRescheduleTarget(null); };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <button onClick={prevMonth} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, width:28, height:28, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.textSm }}>‹</button>
          <span style={{ fontWeight:700, fontSize:14 }}>{monthName}</span>
          <button onClick={nextMonth} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, width:28, height:28, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.textSm }}>›</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:2, marginBottom:6 }}>
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{ textAlign:"center", fontSize:10.5, fontWeight:700, color:C.textSm, padding:"4px 0" }}>{d}</div>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:2 }}>
          {Array(firstDow).fill(null).map((_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:daysInMonth},(_,i)=>{
            const d=i+1; const ds=dateStr(d); const evs=eventsForDay(d); const sel=selectedDay===ds;
            return (
              <div key={d} onClick={()=>setSelectedDay(ds)} style={{ textAlign:"center", padding:"4px 2px", borderRadius:6, background:sel?C.tealLt:"transparent", position:"relative", cursor:"pointer" }}>
                <span style={{ fontSize:12, fontWeight:sel?700:400, color:sel?C.teal:C.text }}>{d}</span>
                {evs.length>0&&<div style={{ display:"flex", justifyContent:"center", gap:1, marginTop:1 }}>{evs.slice(0,3).map((_,ei)=><div key={ei} style={{ width:4, height:4, borderRadius:"50%", background:C.teal }}/>)}</div>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px" }}>
        <h3 style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>
          {new Date(selectedDay+"T12:00").toLocaleDateString("en",{weekday:"long",month:"long",day:"numeric"})}
        </h3>
        {selectedEvents.length===0?(
          <div style={{ textAlign:"center", padding:"30px 0", color:C.textSm, fontSize:13 }}>No appointments</div>
        ):(
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {selectedEvents.map(ev=>(
              <div key={ev.id} style={{ border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px", borderLeft:`3px solid ${ev.color}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{ev.time} — {ev.patient}</div>
                    <div style={{ fontSize:12, color:C.textSm, marginTop:2 }}>{ev.reason}</div>
                  </div>
                  <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                    {ev.visitApproved && <Badge bg={C.greenLt} color={C.green}>Visit Approved</Badge>}
                    <Badge bg={ev.status==="confirmed"?C.tealLt:C.amberLt} color={ev.status==="confirmed"?C.teal:C.amber}>{ev.status}</Badge>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {ev.status !== "confirmed" && (!ev.visitApproved ? (
                    <button onClick={e=>{e.stopPropagation();setEvents(es=>es.map(e2=>e2.id===ev.id?{...e2,visitApproved:true,status:"confirmed",color:C.teal}:e2));}}
                      style={{ flex:1, background:C.green, border:"none", borderRadius:7, padding:"6px", fontSize:11.5, cursor:"pointer", color:"#fff", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:"inherit" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                      Approve Visit
                    </button>
                  ) : (
                    <button onClick={e=>{e.stopPropagation();setEvents(es=>es.map(e2=>e2.id===ev.id?{...e2,visitApproved:false}:e2));}}
                      style={{ flex:1, background:C.white, border:`1px solid ${C.green}`, borderRadius:7, padding:"6px", fontSize:11.5, cursor:"pointer", color:C.green, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:"inherit" }}>
                      Approved ✓
                    </button>
                  ))}
                  <button onClick={e=>{e.stopPropagation();setRescheduleTarget(ev);}} style={{ flex:1, background:C.white, border:`1px solid ${C.border}`, borderRadius:7, padding:"5px", fontSize:11.5, cursor:"pointer", color:C.textMd, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:"inherit" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23,4 23,10 17,10"/><path d="M20.49,15a9,9,0,1,1-2.12-9.36L23,10"/></svg>
                    Reschedule
                  </button>
                  <button onClick={e=>{e.stopPropagation();setDeleteTarget(ev);}} style={{ flex:1, background:C.white, border:`1px solid ${C.redBd}`, borderRadius:7, padding:"5px", fontSize:11.5, cursor:"pointer", color:C.red, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:"inherit" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/></svg>
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {rescheduleTarget&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:14 }}>
          <div style={{ background:C.white,borderRadius:16,padding:"24px 22px",width:"100%",maxWidth:380 }}>
            <h3 style={{ fontWeight:800,fontSize:17,marginBottom:4 }}>Reschedule</h3>
            <p style={{ color:C.textSm,fontSize:13,marginBottom:16 }}>{rescheduleTarget.patient} — {rescheduleTarget.reason}</p>
            <div style={{ display:"flex",gap:7,flexWrap:"wrap",marginBottom:20 }}>
              {ALL_TIMES.map(t=><button key={t} onClick={()=>setRescheduleTarget((r: CalEvent | null)=>r?{...r,_newTime:t}:r)} style={{ padding:"6px 13px",border:`1.5px solid ${rescheduleTarget._newTime===t?C.teal:C.border}`,borderRadius:18,background:rescheduleTarget._newTime===t?C.tealLt:C.white,color:rescheduleTarget._newTime===t?C.teal:C.textSm,fontSize:12,cursor:"pointer",fontWeight:rescheduleTarget._newTime===t?700:400,fontFamily:"inherit" }}>{t}</button>)}
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={()=>setRescheduleTarget(null)} style={{ flex:1,background:C.gray,color:C.text,border:"none",borderRadius:10,padding:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
              <button onClick={()=>handleReschedule(rescheduleTarget.id, rescheduleTarget._newTime||rescheduleTarget.time)} style={{ flex:1,background:C.teal,color:"#fff",border:"none",borderRadius:10,padding:"11px",fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Save</button>
            </div>
          </div>
        </div>
      )}
      {deleteTarget&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:14 }}>
          <div style={{ background:C.white,borderRadius:16,padding:"28px 22px",width:"100%",maxWidth:340,textAlign:"center" }}>
            <div style={{ width:48,height:48,borderRadius:"50%",background:C.redLt,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/></svg>
            </div>
            <h3 style={{ fontWeight:800,fontSize:17,marginBottom:7 }}>Cancel appointment?</h3>
            <p style={{ color:C.textSm,fontSize:13,marginBottom:22 }}><strong>{deleteTarget.patient}</strong> at <strong>{deleteTarget.time}</strong> will be removed.</p>
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={()=>setDeleteTarget(null)} style={{ flex:1,background:C.gray,color:C.text,border:"none",borderRadius:10,padding:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Keep</button>
              <button onClick={()=>handleDelete(deleteTarget.id)} style={{ flex:1,background:C.red,color:"#fff",border:"none",borderRadius:10,padding:"11px",fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Cancel It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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

// ─── PAYMENT METHOD CARD ──────────────────────────────────────────────────────
function PaymentMethodCard() {
  const [card, setCard] = useState({ number:"•••• •••• •••• 4242", name:"Jessica Chen", expiry:"12/27", brand:"Visa" });
  const [editing, setEditing] = useState(false);
  const [editCard, setEditCard] = useState({ number:"", name:"", expiry:"", cvc:"" });
  const [cardSaved, setCardSaved] = useState(false);

  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h3 style={{ fontWeight:700, fontSize:16 }}>Payment Method</h3>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11.5, color:C.textSm }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Secured by Stripe
        </div>
      </div>
      {!editing ? (
        <>
          <div style={{ background:`linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`, borderRadius:14, padding:"20px 22px", color:"#fff", marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:600, opacity:.6 }}>{card.brand}</div>
              <svg width="32" height="20" viewBox="0 0 32 20"><rect width="32" height="20" rx="3" fill="#fff" fillOpacity=".15"/><circle cx="12" cy="10" r="6" fill="#EB001B" fillOpacity=".8"/><circle cx="20" cy="10" r="6" fill="#F79E1B" fillOpacity=".8"/></svg>
            </div>
            <div style={{ fontSize:18, fontWeight:700, letterSpacing:2, marginBottom:16 }}>{card.number}</div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div><div style={{ fontSize:9, opacity:.5, marginBottom:2 }}>CARD HOLDER</div><div style={{ fontSize:12, fontWeight:600 }}>{card.name}</div></div>
              <div><div style={{ fontSize:9, opacity:.5, marginBottom:2 }}>EXPIRES</div><div style={{ fontSize:12, fontWeight:600 }}>{card.expiry}</div></div>
            </div>
          </div>
          <button onClick={()=>{setEditing(true);setEditCard({number:"",name:card.name,expiry:"",cvc:""});}} style={{ background:"none", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"9px 20px", fontSize:13, fontWeight:600, color:C.teal, cursor:"pointer", fontFamily:"inherit" }}>Update Card</button>
        </>
      ) : (
        <div className="fade-up">
          {cardSaved ? (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"16px 0" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
              <span style={{ fontWeight:700, fontSize:14, color:C.green }}>Card updated successfully!</span>
            </div>
          ) : (
            <>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>Card Number</label>
                <input value={editCard.number} onChange={(e: ChangeEvent<HTMLInputElement>)=>setEditCard(p=>({...p,number:e.target.value}))} placeholder="1234 5678 9012 3456"
                  style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit", letterSpacing:1 }}
                  onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>Name on Card</label>
                <input value={editCard.name} onChange={(e: ChangeEvent<HTMLInputElement>)=>setEditCard(p=>({...p,name:e.target.value}))} placeholder="John Doe"
                  style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
                  onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>Expiry</label>
                  <input value={editCard.expiry} onChange={(e: ChangeEvent<HTMLInputElement>)=>setEditCard(p=>({...p,expiry:e.target.value}))} placeholder="MM/YY"
                    style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
                    onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>CVC</label>
                  <input value={editCard.cvc} onChange={(e: ChangeEvent<HTMLInputElement>)=>setEditCard(p=>({...p,cvc:e.target.value}))} placeholder="123" type="password" maxLength={4}
                    style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
                    onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>{setCardSaved(true);setTimeout(()=>{setCardSaved(false);setEditing(false);setCard(c=>({...c,number:"•••• •••• •••• "+editCard.number.slice(-4),name:editCard.name||c.name,expiry:editCard.expiry||c.expiry}));},2000);}}
                  style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"10px 24px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Save Card</button>
                <button onClick={()=>setEditing(false)} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 20px", fontWeight:600, fontSize:13, color:C.textSm, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ACCOUNT TAB ──────────────────────────────────────────────────────────────
function AccountTab({ role }: { role: string }) {
  const [acc, setAcc] = useState({ firstName:"Jessica", lastName:"Chen", email:"jessica.chen@glowmedspa.com", phone:"+1 305-555-0445" });
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
                onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>Phone</label>
          <input value={acc.phone} onChange={(e: ChangeEvent<HTMLInputElement>)=>setAcc(p=>({...p,phone:e.target.value}))}
            style={{ width:"100%", padding:"9px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
            onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
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

      {role==="provider" && <PaymentMethodCard />}
    </div>
  );
}

// ─── PROVIDER DASHBOARD ───────────────────────────────────────────────────────
export default function ProviderDashboard({ tab, setTab }: { tab: string; setTab: React.Dispatch<React.SetStateAction<string>> }) {
  const [events, setEvents] = useState<CalEvent[]>(INIT_EVENTS);
  const isMobile = useIsMobile();
  const maxV = Math.max(...MOCK_STATS.monthly.map(m=>m.v));

  function LeadsTab() {
    const [leads] = useState(MOCK_STATS.leads);
    return (
      <div style={{ display:"grid", gap:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:14 }}>
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:C.textSm, letterSpacing:.5, marginBottom:6 }}>OUTSTANDING BALANCE</div>
                <div style={{ fontSize:28, fontWeight:800, color:C.text }}>$1,200.00</div>
              </div>
              <div style={{ background:C.amberLt, borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, color:C.amber }}>Due Apr 1</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ flex:1, background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"10px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Pay Now
              </button>
              <button style={{ padding:"10px 16px", background:C.white, border:`1.5px solid ${C.border}`, borderRadius:10, fontWeight:600, fontSize:13, color:C.textSm, cursor:"pointer", fontFamily:"inherit" }}>View Invoice</button>
            </div>
          </div>
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textSm, letterSpacing:.5, marginBottom:6 }}>BILLING SUMMARY</div>
            <div style={{ display:"grid", gap:8 }}>
              {([["This Month","$475.00","18 leads"],["Last Month","$725.00","29 leads"],["Total Spent","$3,850.00","All time"]] as [string,string,string][]).map(([l,v,s])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.borderLt}` }}>
                  <div><div style={{ fontSize:13, fontWeight:600 }}>{l}</div><div style={{ fontSize:11, color:C.textSm }}>{s}</div></div>
                  <div style={{ fontSize:15, fontWeight:800 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:12, fontSize:11.5, color:C.textSm }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="1.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/></svg>
              Payments powered by Stripe
            </div>
          </div>
        </div>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:480 }}>
            <thead>
              <tr style={{ background:C.gray }}>
                {["Date","Lead Type","User","Status","Amount"].map(h=><th key={h} style={{ padding:"11px 16px",textAlign:"left",fontWeight:700,color:C.textSm,fontSize:10.5,letterSpacing:.5,whiteSpace:"nowrap" }}>{h.toUpperCase()}</th>)}
              </tr>
            </thead>
            <tbody>
              {leads.map((l,i)=>(
                <tr key={i} style={{ borderTop:`1px solid ${C.border}` }}>
                  <td style={{ padding:"11px 16px",color:C.textSm }}>{l.date}</td>
                  <td style={{ padding:"11px 16px",fontWeight:600 }}>{l.type}</td>
                  <td style={{ padding:"11px 16px",color:C.textSm }}>{l.user}</td>
                  <td style={{ padding:"11px 16px" }}><Badge bg={l.status==="Confirmed"?C.tealLt:C.amberLt} color={l.status==="Confirmed"?C.teal:C.amber}>{l.status}</Badge></td>
                  <td style={{ padding:"11px 16px",fontWeight:700 }}>${l.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function ProfileTab() {
    interface Clinic {
      id: number; name: string; specialty: string; address: string; city: string;
      phone: string; hours: string; email: string; website: string; insurances: string[];
      avatar: string | null; status: string;
    }
    const [clinics, setClinics] = useState<Clinic[]>([
      { id:1, name:"Glow Medical Spa — Miami", specialty:"Medical Aesthetics", address:"1395 Brickell Ave, Ste 800", city:"Miami, FL", phone:"+1 305-555-0445", hours:"Daily 10am–7pm", email:"miami@glowmedspa.com", website:"glowmedspa.com", insurances:["Aetna","Cigna","UnitedHealthcare"], avatar:null, status:"Active" },
      { id:2, name:"Glow Medical Spa — NYC", specialty:"Medical Aesthetics", address:"110 E 55th St, Ste 12", city:"New York, NY", phone:"+1 212-555-0446", hours:"Mon–Sat 9am–6pm", email:"nyc@glowmedspa.com", website:"glowmedspa.com", insurances:["Aetna","BlueCross BlueShield"], avatar:null, status:"Pending" },
      { id:3, name:"Glow Dermatology", specialty:"Dermatology", address:"4200 W Cypress St", city:"Tampa, FL", phone:"+1 813-555-0447", hours:"Mon–Fri 8am–5pm", email:"tampa@glowderm.com", website:"glowderm.com", insurances:["Humana","Medicare","Cigna"], avatar:null, status:"Active" },
    ]);
    const [expandedClinic, setExpandedClinic] = useState<number | null>(null);
    const [profileSaved, setProfileSaved] = useState(false);
    const [insPickerFor, setInsPickerFor] = useState<number | null>(null);
    const [insSearch, setInsSearch] = useState("");
    const insRef = useRef<HTMLDivElement>(null);
    const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

    useEffect(() => {
      const handler = (e: MouseEvent) => { if (insRef.current && !insRef.current.contains(e.target as Node)) setInsPickerFor(null); };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const updateClinic = (id: number, field: string, value: string | null) => setClinics(prev=>prev.map(c=>c.id===id?{...c,[field]:value}:c));
    const toggleIns = (clinicId: number, ins: string) => setClinics(prev=>prev.map(c=>c.id===clinicId?{...c,insurances:c.insurances.includes(ins)?c.insurances.filter(i=>i!==ins):[...c.insurances,ins]}:c));
    const removeIns = (clinicId: number, ins: string) => setClinics(prev=>prev.map(c=>c.id===clinicId?{...c,insurances:c.insurances.filter(i=>i!==ins)}:c));
    const addClinic = () => {
      const id = Date.now();
      setClinics(prev=>[...prev,{ id, name:"New Clinic", specialty:"", address:"", city:"", phone:"", hours:"", email:"", website:"", insurances:[], avatar:null, status:"Pending" }]);
      setExpandedClinic(id);
    };
    const removeClinic = (id: number) => { setClinics(prev=>prev.filter(c=>c.id!==id)); if(expandedClinic===id) setExpandedClinic(null); };

    const handleAvatar = (clinicId: number, e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => updateClinic(clinicId, "avatar", (ev.target?.result as string) || null);
        reader.readAsDataURL(file);
      }
    };

    return (
      <div style={{ display:"grid", gap:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div>
            <h3 style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>My Clinics</h3>
            <p style={{ color:C.textSm, fontSize:13 }}>{clinics.length} location{clinics.length!==1?"s":""} registered</p>
          </div>
          <button onClick={addClinic} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 20px", background:C.teal, color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Clinic
          </button>
        </div>

        {clinics.map(clinic => (
          <div key={clinic.id} style={{ background:C.white, border:`1px solid ${expandedClinic===clinic.id?C.teal+"40":C.border}`, borderRadius:14, overflow:"hidden", transition:"border-color .15s" }}>
            <button onClick={()=>setExpandedClinic(expandedClinic===clinic.id?null:clinic.id)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:14, padding:"18px 22px", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:clinic.avatar?"transparent":C.tealLt, border:`1px solid ${C.borderLt}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:C.teal, flexShrink:0, overflow:"hidden" }}>
                {clinic.avatar ? <img src={clinic.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : clinic.name.split(" ").map(w=>w[0]).slice(0,2).join("")}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14.5, marginBottom:2 }}>{clinic.name}</div>
                <div style={{ fontSize:12.5, color:C.textSm }}>{clinic.address}{clinic.city?`, ${clinic.city}`:""}</div>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
                {clinic.status==="Pending" && <Badge bg={C.amberLt} color={C.amber}>Pending</Badge>}
                {clinic.status==="Active" && <Badge bg={C.greenLt} color={C.green}>Active</Badge>}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5" style={{ transition:"transform .2s", transform:expandedClinic===clinic.id?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
              </div>
            </button>

            {expandedClinic===clinic.id && (
              <div className="fade-up" style={{ padding:"0 22px 22px", borderTop:`1px solid ${C.borderLt}` }}>
                <div style={{ display:"flex", gap:14, alignItems:"center", padding:"18px 0 14px" }}>
                  <div onClick={()=>fileRefs.current[clinic.id]?.click()} style={{ width:64, height:64, borderRadius:16, background:clinic.avatar?"transparent":C.tealLt, border:`2px dashed ${clinic.avatar?C.teal:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden", flexShrink:0 }}>
                    {clinic.avatar ? <img src={clinic.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>}
                  </div>
                  <input ref={el=>{fileRefs.current[clinic.id]=el;}} type="file" accept="image/*" onChange={e=>handleAvatar(clinic.id,e)} style={{ display:"none" }} />
                  <div>
                    <div style={{ fontWeight:600, fontSize:13 }}>Clinic Photo</div>
                    <div style={{ fontSize:11.5, color:C.textSm }}>Click to upload</div>
                    {clinic.avatar && <button onClick={()=>updateClinic(clinic.id,"avatar",null)} style={{ background:"none", border:"none", color:C.red, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", padding:0, marginTop:2 }}>Remove</button>}
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"0 16px" }}>
                  {([["Clinic Name","name"],["Specialty","specialty"],["Address","address"],["City / State","city"],["Phone","phone"],["Hours","hours"],["Email","email"],["Website","website"]] as [string,string][]).map(([l,k])=>(
                    <div key={l} style={{ marginBottom:12 }}>
                      <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>{l}</label>
                      <input value={(clinic as unknown as Record<string,string>)[k]} onChange={(e: ChangeEvent<HTMLInputElement>)=>updateClinic(clinic.id,k,e.target.value)}
                        style={{ width:"100%", padding:"8px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:13, outline:"none", fontFamily:"inherit" }}
                        onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:8, marginBottom:16 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:8 }}>ACCEPTED INSURANCES</label>
                  {clinic.insurances.length>0 && (
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
                      {clinic.insurances.map(ins=>{
                        const cr = INSURANCE_CARRIERS.find(c=>c.name===ins);
                        return (
                          <span key={ins} style={{ display:"inline-flex", alignItems:"center", gap:4, background:C.tealLt, border:`1px solid ${C.teal}25`, borderRadius:16, padding:"3px 6px 3px 10px", fontSize:11.5, fontWeight:600, color:C.teal }}>
                            {cr && <div style={{ width:14, height:14, borderRadius:4, background:cr.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:6, color:"#fff" }}>{cr.name.slice(0,2)}</div>}
                            {ins}
                            <button onClick={()=>removeIns(clinic.id,ins)} style={{ background:"none", border:"none", color:C.teal, fontSize:13, cursor:"pointer", padding:"0 1px", fontWeight:700, lineHeight:1 }}>×</button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <div ref={insPickerFor===clinic.id?insRef:undefined} style={{ position:"relative", display:"inline-block" }}>
                    <button onClick={()=>{setInsPickerFor(insPickerFor===clinic.id?null:clinic.id);setInsSearch("");}}
                      style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", border:`1.5px solid ${insPickerFor===clinic.id?C.teal:C.border}`, borderRadius:10, background:insPickerFor===clinic.id?C.tealLt:C.white, color:insPickerFor===clinic.id?C.teal:C.textSm, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add
                    </button>
                    {insPickerFor===clinic.id && (
                      <div className="fade-up" style={{ position:"absolute", bottom:"calc(100% + 6px)", left:0, width:280, background:C.white, border:`1px solid ${C.border}`, borderRadius:14, boxShadow:"0 10px 36px rgba(0,0,0,.13)", zIndex:50, maxHeight:300, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                        <div style={{ padding:"8px 10px", borderBottom:`1px solid ${C.borderLt}` }}>
                          <input value={insSearch} onChange={(e: ChangeEvent<HTMLInputElement>)=>setInsSearch(e.target.value)} placeholder="Search…" autoFocus
                            style={{ width:"100%", padding:"7px 10px", border:`1.5px solid ${C.border}`, borderRadius:8, fontSize:12, outline:"none", fontFamily:"inherit" }}
                            onFocus={e=>{(e.target as HTMLInputElement).style.borderColor=C.teal;}} onBlur={e=>{(e.target as HTMLInputElement).style.borderColor=C.border;}} />
                        </div>
                        <div style={{ overflowY:"auto", flex:1, padding:4 }}>
                          {INSURANCE_CARRIERS.filter(c=>!insSearch||c.name.toLowerCase().includes(insSearch.toLowerCase())).map(cr=>{
                            const sel = clinic.insurances.includes(cr.name);
                            return (
                              <button key={cr.name} onClick={()=>toggleIns(clinic.id,cr.name)}
                                style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"7px 10px", border:"none", borderRadius:8, background:sel?C.tealLt:"transparent", cursor:"pointer", fontFamily:"inherit", textAlign:"left", fontSize:12.5, fontWeight:sel?700:500, color:sel?C.teal:C.text }}
                                onMouseEnter={e=>{if(!sel)(e.currentTarget as HTMLButtonElement).style.background=C.gray;}} onMouseLeave={e=>{if(!sel)(e.currentTarget as HTMLButtonElement).style.background="transparent";}}>
                                <div style={{ width:12, height:12, borderRadius:3, border:`2px solid ${sel?C.teal:C.border}`, background:sel?C.teal:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                  {sel && <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><polyline points="20,6 9,17 4,12"/></svg>}
                                </div>
                                <div style={{ width:18, height:18, borderRadius:5, background:cr.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:7, color:"#fff", flexShrink:0 }}>{cr.name.slice(0,2)}</div>
                                {cr.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center", paddingTop:8, borderTop:`1px solid ${C.borderLt}` }}>
                  <button onClick={()=>{setProfileSaved(true);setTimeout(()=>setProfileSaved(false),3000);}} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"9px 24px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Save</button>
                  <button onClick={()=>removeClinic(clinic.id)} style={{ background:"none", border:`1.5px solid ${C.red}30`, borderRadius:10, padding:"9px 18px", fontWeight:600, fontSize:13, color:C.red, cursor:"pointer", fontFamily:"inherit" }}>Remove Clinic</button>
                  {profileSaved && <span className="fade-up" style={{ color:C.green, fontWeight:600, fontSize:12 }}>✓ Saved!</span>}
                </div>
              </div>
            )}
          </div>
        ))}
        <p style={{ fontSize:11.5, color:C.textSm }}>All edits require admin approval before going live.</p>
      </div>
    );
  }

  function PortalTab() {
    const [workDays, setWorkDays] = useState<Record<string,boolean>>({ Mon:true, Tue:true, Wed:true, Thu:true, Fri:true, Sat:false, Sun:false });
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [apptLength, setApptLength] = useState(30);
    const [portalSaved, setPortalSaved] = useState(false);
    const [editsPending, setEditsPending] = useState(false);
    const [bookingMode, setBookingMode] = useState("calendar");

    const toggleDay = (d: string) => setWorkDays(prev=>({...prev,[d]:!prev[d]}));
    const handleSave = () => { setPortalSaved(true); setEditsPending(true); setTimeout(()=>setPortalSaved(false),3000); };

    return (
      <div style={{ display:"grid", gap:16 }}>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <div>
              <h3 style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Scheduling & Availability</h3>
              <p style={{ color:C.textSm, fontSize:12.5 }}>Set your working days, hours, and appointment duration. Patients will only see available slots based on these settings.</p>
            </div>
            {editsPending && <Badge bg={C.amberLt} color={C.amber}>Pending admin review</Badge>}
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:10, letterSpacing:.3 }}>WORKING DAYS</label>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
                <button key={d} onClick={()=>toggleDay(d)}
                  style={{ width:52, padding:"10px 0", border:`1.5px solid ${workDays[d]?C.teal:C.border}`, borderRadius:10, background:workDays[d]?C.tealLt:C.white, color:workDays[d]?C.teal:C.textSm, fontSize:13, fontWeight:workDays[d]?700:500, cursor:"pointer", fontFamily:"inherit", transition:"all .15s", textAlign:"center" }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:10, letterSpacing:.3 }}>WORKING HOURS</label>
            <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:11, color:C.textSm, marginBottom:4 }}>Start</div>
                <select value={startTime} onChange={e=>setStartTime(e.target.value)}
                  style={{ padding:"9px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", color:C.text, background:C.white, cursor:"pointer", outline:"none", minWidth:100 }}>
                  {["07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00"].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <span style={{ color:C.textSm, fontWeight:600, marginTop:18 }}>to</span>
              <div>
                <div style={{ fontSize:11, color:C.textSm, marginBottom:4 }}>End</div>
                <select value={endTime} onChange={e=>setEndTime(e.target.value)}
                  style={{ padding:"9px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", color:C.text, background:C.white, cursor:"pointer", outline:"none", minWidth:100 }}>
                  {["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:10, letterSpacing:.3 }}>APPOINTMENT LENGTH</label>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {[15,20,30,45,60,90].map(m=>(
                <button key={m} onClick={()=>setApptLength(m)}
                  style={{ padding:"9px 18px", border:`1.5px solid ${apptLength===m?C.teal:C.border}`, borderRadius:10, background:apptLength===m?C.tealLt:C.white, color:apptLength===m?C.teal:C.textSm, fontSize:13, fontWeight:apptLength===m?700:500, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
                  {m} min
                </button>
              ))}
            </div>
          </div>

          <div style={{ background:C.offWhite, borderRadius:12, padding:"14px 18px", marginBottom:18, border:`1px solid ${C.borderLt}` }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.textSm, marginBottom:8, letterSpacing:.3 }}>CURRENT SCHEDULE SUMMARY</div>
            <div style={{ fontSize:13.5, color:C.text, lineHeight:1.8 }}>
              <strong>Days:</strong> {Object.entries(workDays).filter(([,v])=>v).map(([d])=>d).join(", ") || "None selected"}<br/>
              <strong>Hours:</strong> {startTime} – {endTime}<br/>
              <strong>Appointment:</strong> {apptLength} minutes per session
            </div>
          </div>

          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button onClick={handleSave} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"11px 28px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Save Schedule</button>
            {portalSaved && <span style={{ color:C.green, fontSize:12.5, fontWeight:600 }}>✓ Saved — pending admin review</span>}
          </div>
        </div>

        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
          <h3 style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Calendar Integration</h3>
          <p style={{ color:C.textSm, fontSize:12.5, marginBottom:18 }}>Connect your calendar so patients can book directly into your available slots.</p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {[
              { name:"Google Calendar", connected:true, color:"#4285F4" },
              { name:"Microsoft Outlook", connected:false, color:"#0078D4" },
            ].map(cal=>(
              <div key={cal.name} style={{ flex:1, minWidth:200, border:`1.5px solid ${cal.connected?C.green:C.border}`, borderRadius:12, padding:"16px 18px", display:"flex", alignItems:"center", gap:12, background:cal.connected?C.greenLt:C.white }}>
                <div style={{ width:36, height:36, borderRadius:10, background:cal.color+"18", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontWeight:800, fontSize:14, color:cal.color }}>{cal.name.charAt(0)}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13 }}>{cal.name}</div>
                  <div style={{ fontSize:11.5, color:cal.connected?C.green:C.textSm }}>{cal.connected?"Connected":"Not connected"}</div>
                </div>
                <button style={{ padding:"6px 14px", border:`1.5px solid ${cal.connected?C.green:C.teal}`, borderRadius:8, background:cal.connected?C.white:C.tealLt, color:cal.connected?C.green:C.teal, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  {cal.connected?"Disconnect":"Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
          <h3 style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Booking Mode</h3>
          <p style={{ color:C.textSm, fontSize:12.5, marginBottom:18 }}>Choose how patients can schedule visits with you.</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {[
              { mode:"calendar", label:"Calendar Booking", desc:"Patients pick a date & time slot",
                icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
              { mode:"request", label:"Request Only", desc:"Patients submit a request, you confirm",
                icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
              { mode:"walkin", label:"Walk-in Only", desc:"No online booking — walk-in patients only",
                icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="2"/><path d="M10 22V18L7 15V11a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4l-3 3v4"/></svg> },
            ].map(opt=>{
              const active = bookingMode===opt.mode;
              return (
                <button key={opt.mode} onClick={()=>setBookingMode(opt.mode)} style={{ flex:1, minWidth:160, padding:"18px 16px", border:`2px solid ${active?C.teal:C.border}`, borderRadius:14, background:active?C.tealLt:C.white, cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:"all .18s" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:active?C.white:C.gray, display:"flex", alignItems:"center", justifyContent:"center", color:active?C.teal:C.textSm, marginBottom:10 }}>{opt.icon}</div>
                  <div style={{ fontWeight:700, fontSize:13.5, color:active?C.teal:C.text, marginBottom:4 }}>{opt.label}</div>
                  <div style={{ fontSize:11.5, color:C.textSm, lineHeight:1.5 }}>{opt.desc}</div>
                  {active && <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:5, color:C.teal, fontSize:11.5, fontWeight:700 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                    Active
                  </div>}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ background:C.amberLt, border:`1px solid #FDE68A`, borderRadius:12, padding:"14px 18px", display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"#FDE68A", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2.5"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:"#92400E", marginBottom:3 }}>All changes require admin approval</div>
            <div style={{ fontSize:12.5, color:"#78350F", lineHeight:1.6 }}>Schedule changes, profile edits, and booking mode updates will be reviewed by the Hospital.com team before going live. You&apos;ll receive an email notification once approved.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:980, margin:"0 auto", padding:"24px 16px" }}>
      {tab!=="account" && (
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22, flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800 }}>Provider Dashboard</h1>
            <p style={{ color:C.textSm, fontSize:13, marginTop:2 }}>Glow Medical Spa · Partner</p>
          </div>
        </div>
      )}

      {tab==="overview"&&(
        <>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fit, minmax(150px, 1fr))", gap:10, marginBottom:16 }}>
            {([["Total Leads",MOCK_STATS.totalLeads,"All time"],["Visits",MOCK_STATS.visits,"This month"],["Calls",MOCK_STATS.calls,"This month"],["Bookings",MOCK_STATS.bookings,"This month"]] as [string,number,string][]).map(([l,v,s])=>(
              <div key={l} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px" }}>
                <div style={{ fontSize:28, fontWeight:800, color:C.text }}>{v}</div>
                <div style={{ fontWeight:600, fontSize:13, marginTop:2 }}>{l}</div>
                <div style={{ fontSize:11.5, color:C.textSm, marginTop:2 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit, minmax(260px, 1fr))", gap:14 }}>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Monthly Lead Volume</h3>
              <div style={{ display:"flex", gap:8, alignItems:"flex-end", height:100 }}>
                {MOCK_STATS.monthly.map(m=>(
                  <div key={m.m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                    <div style={{ fontSize:10, color:C.textSm }}>{m.v}</div>
                    <div style={{ width:"100%", background:C.teal, borderRadius:"4px 4px 0 0", height:`${(m.v/maxV)*68}px`, opacity:.85 }}/>
                    <div style={{ fontSize:10, color:C.textSm }}>{m.m}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Lead Breakdown</h3>
              {([["Visits",MOCK_STATS.visits,"$1–2"],["Calls",MOCK_STATS.calls,"$25"],["Bookings",MOCK_STATS.bookings,"$50"]] as [string,number,string][]).map(([l,v,p])=>(
                <div key={l} style={{ marginBottom:13 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                    <span style={{ fontWeight:600 }}>{l}</span>
                    <span style={{ color:C.textSm }}>{v} · {p} each</span>
                  </div>
                  <div style={{ height:6, background:C.gray, borderRadius:4 }}>
                    <div style={{ height:6, background:C.teal, borderRadius:4, width:`${(v/MOCK_STATS.totalLeads)*100}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {tab==="leads"&&<LeadsTab/>}
      {tab==="calendar"&&<DemoCalendar events={events} setEvents={setEvents}/>}
      {tab==="portal"&&<PortalTab/>}
      {tab==="profile"&&<ProfileTab/>}
      {tab==="account"&&<AccountTab role="provider" />}
    </div>
  );
}
