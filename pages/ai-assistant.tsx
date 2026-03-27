import { useState, useRef, useEffect, ChangeEvent, ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import C from "@/lib/tokens";
import { useApp } from "@/lib/context/AppContext";
import useIsMobile from "@/lib/hooks/useIsMobile";
import FacilitatorModal from "@/components/modals/FacilitatorModal";

// ─── AI ASSISTANT PAGE ─────────────────────────────────────────────────────────
// TODO(backend): POST /api/ai/chat — req.body: { message, history }
// Response: { response, providers: [...], clinics: [...], emergency: bool, showFacilitatorCTA: bool }

// ─── INTERFACES ───────────────────────────────────────────────────────────────
interface Provider {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  distance: number;
  city: string;
  address: string;
  phone?: string;
  image: string;
  photo: string;
  tags: string[];
  contracted: boolean;
}

interface IntlClinic {
  id: number;
  name: string;
  country: string;
  city: string;
  flag: string;
  procedures: string[];
  image: string;
  rating: number;
  reviews: number;
}

interface ChatResponse {
  trigger: string[];
  matchTags: string[];
  response: string;
  providers?: boolean;
  emergency?: boolean;
  facilitator?: boolean;
  showFacilitatorCTA?: boolean;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  providers?: Provider[];
  clinics?: IntlClinic[];
  emergency?: boolean;
  showIntlCTA?: boolean;
}

interface ChatHistoryEntry {
  id: number;
  title: string;
  messages: ChatMessage[];
  timestamp: string;
}

interface ChatSidebarProps {
  chatHistory: ChatHistoryEntry[];
  activeChatId: number | null;
  onSelectChat: (id: number) => void;
  onNewChat: () => void;
  onDeleteChat: (id: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface ProviderMiniCardProps {
  provider: Provider;
  onOpen: (p: Provider) => void;
}

interface ClinicMiniCardProps {
  clinic: IntlClinic;
  onContact: () => void;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PROVIDERS: Provider[] = [
  { id:1, name:"Dr. Sarah Mitchell", specialty:"Family Medicine", rating:4.8, reviews:312, distance:0.8, city:"New York", address:"120 E 36th St", image:"SM", photo:"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face", tags:["Family Medicine","Preventive Care"], contracted:true },
  { id:2, name:"Dr. James Okafor", specialty:"Cardiology", rating:4.9, reviews:187, distance:1.2, city:"New York", address:"340 E 72nd St", image:"JO", photo:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face", tags:["Cardiology","Internal Medicine"], contracted:true },
  { id:3, name:"Dr. Elena Vasquez", specialty:"Dermatology", rating:4.7, reviews:421, distance:2.1, city:"Los Angeles", address:"8635 W 3rd St, Ste 200", image:"EV", photo:"https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=150&h=150&fit=crop&crop=face", tags:["Dermatology","Cosmetic"], contracted:false },
  { id:4, name:"Glow Medical Spa", specialty:"Medical Aesthetics", rating:4.6, reviews:530, distance:1.5, city:"Miami", address:"1395 Brickell Ave, Ste 800", image:"GM", photo:"https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=150&h=150&fit=crop&crop=face", tags:["Botox","Injectables","Skin Care"], contracted:true },
  { id:5, name:"Dr. Amir Patel", specialty:"Orthopedics", rating:4.5, reviews:203, distance:3.4, city:"Chicago", address:"680 N Lake Shore Dr", image:"AP", photo:"https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face", tags:["Orthopedics","Sports Medicine"], contracted:true },
  { id:6, name:"Dr. Priya Sharma", specialty:"Cardiology", rating:4.3, reviews:156, distance:4.2, city:"Houston", address:"6624 Fannin St", image:"PS", photo:"https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=150&h=150&fit=crop&crop=face", tags:["Cardiology","Echocardiography"], contracted:false },
  { id:7, name:"CityHealth Clinic", specialty:"Family Medicine", rating:4.2, reviews:89, distance:5.1, city:"Los Angeles", address:"4835 Van Nuys Blvd, Ste 105", image:"CH", photo:"https://images.unsplash.com/photo-1666214280557-091e285b2bba?w=150&h=150&fit=crop&crop=face", tags:["Family Medicine","Walk-in"], contracted:false },
];

const INTL_CLINICS: IntlClinic[] = [
  { id:101, name:"Estetik International", country:"Turkey", city:"Istanbul", flag:"🇹🇷", procedures:["Hair Transplant","Rhinoplasty","Liposuction","Dental Veneers"], image:"EI", rating:4.8, reviews:1240 },
  { id:102, name:"Bumrungrad International", country:"Thailand", city:"Bangkok", flag:"🇹🇭", procedures:["Cardiac Surgery","Orthopedics","Oncology","General Surgery"], image:"BI", rating:4.9, reviews:3100 },
  { id:103, name:"Charité – Universitätsmedizin", country:"Germany", city:"Berlin", flag:"🇩🇪", procedures:["Neurology","Cancer Treatment","Cardiac Surgery","Rare Diseases"], image:"CH", rating:4.9, reviews:890 },
  { id:104, name:"Apollo Hospitals", country:"India", city:"Chennai", flag:"🇮🇳", procedures:["Cardiac Surgery","Bone Marrow Transplant","Liver Transplant","Orthopedics"], image:"AH", rating:4.7, reviews:2700 },
  { id:105, name:"Quirónsalud Barcelona", country:"Spain", city:"Barcelona", flag:"🇪🇸", procedures:["IVF","Dental Implants","Orthopedics","Ophthalmology"], image:"QB", rating:4.6, reviews:640 },
  { id:106, name:"Samsung Medical Center", country:"South Korea", city:"Seoul", flag:"🇰🇷", procedures:["Cancer Treatment","Robotic Surgery","Cardiology","Stem Cell Therapy"], image:"SM", rating:4.9, reviews:1870 },
  { id:107, name:"Medicover Dental Warsaw", country:"Poland", city:"Warsaw", flag:"🇵🇱", procedures:["Dental Implants","Veneers","Full Mouth Rehabilitation","Orthodontics"], image:"MD", rating:4.7, reviews:520 },
  { id:108, name:"Clinique des Cèdres", country:"France", city:"Toulouse", flag:"🇫🇷", procedures:["Bariatric Surgery","Cardiac Surgery","Orthopedics","Neurosurgery"], image:"CC", rating:4.8, reviews:390 },
];

const CHAT_RESPONSES: ChatResponse[] = [
  { trigger:["headache","head","migraine"], matchTags:["Family Medicine","Preventive Care"], response:"Based on your symptoms, this could be a tension headache or migraine.\n\n- Rest in a quiet, dark room\n- Drink at least 2 glasses of water\n- Ibuprofen or acetaminophen may help\n- Cold or warm compress on forehead\n\nIf headache is sudden, severe, or accompanied by fever or stiff neck — seek emergency care immediately.\n\nHere are providers who can help:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["chest","heart attack","shortness of breath"], matchTags:["Cardiology","Internal Medicine"], response:"IMPORTANT — Chest pain or difficulty breathing may indicate a serious condition.\n\nIf you have severe chest pain, shortness of breath, or pain in your arm or jaw — call 911 immediately.\n\nDo not wait. Please seek care now.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true, emergency:true },
  { trigger:["cold","flu","fever","cough","sore throat"], matchTags:["Family Medicine","Walk-in","Preventive Care"], response:"Your symptoms suggest a common cold or flu.\n\n- Rest as much as possible\n- Warm liquids like broth or tea\n- Honey and lemon for sore throat\n- Saline nasal rinse for congestion\n- Fever above 39.5°C — see a doctor\n\nHere are providers who can help:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["hair transplant","turkey","abroad","medical tourism","surgery abroad","treatment abroad","dental abroad","find care abroad","international","overseas"], matchTags:[], response:"Here are top-rated international clinics that match your needs. Click on a clinic name to see full details, or talk to a medical coordinator who will guide you through the entire process — from choosing a clinic to travel arrangements.\n\nAll listed clinics are vetted and accredited.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true, facilitator:true, showFacilitatorCTA:true },
  { trigger:["cardiologist","cardiology","heart doctor"], matchTags:["Cardiology","Internal Medicine","Echocardiography"], response:"Cardiology specialists diagnose and treat heart and vascular conditions. Consider their subspecialty, hospital affiliations, and new patient wait times.\n\nHere are cardiologists near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["dermatologist","skin","acne","rash","eczema"], matchTags:["Dermatology","Cosmetic","Skin Care"], response:"A dermatologist can evaluate skin conditions properly. In the meantime: avoid touching the area, keep it clean, and protect from sun exposure.\n\nHere are dermatologists near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["dentist","teeth","dental","tooth","cavity"], matchTags:["Family Medicine","Walk-in"], response:"A dentist can help with tooth pain, cavities, cleanings, and other oral health issues. Regular check-ups every 6 months are recommended.\n\nHere are providers who may help:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["botox","filler","inject","aestheti","cosmetic","med spa"], matchTags:["Botox","Injectables","Skin Care","Medical Aesthetics","Cosmetic"], response:"Medical aesthetics procedures like Botox and fillers should only be performed by licensed professionals. Always verify credentials and look at reviews before booking.\n\nHere are top-rated providers near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["knee","joint","bone","orthop","sport","back pain","spine","shoulder"], matchTags:["Orthopedics","Sports Medicine"], response:"Orthopedic issues can range from acute injuries to chronic conditions. Early evaluation leads to better outcomes.\n\nHere are orthopedic specialists near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
];

const DEFAULT_RESPONSE: ChatResponse = { trigger: [], response:"I recommend consulting a healthcare professional for proper evaluation.\n\n- Monitor your symptoms\n- Stay hydrated and rest\n\nWould you like help finding a specialist?\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true, matchTags:[] };

function getResponse(input: string): ChatResponse {
  const lower = input.toLowerCase();
  for (const r of CHAT_RESPONSES) {
    if (r.trigger.some(t => lower.includes(t))) return r;
  }
  return DEFAULT_RESPONSE;
}

function matchProviders(text: string, resp: ChatResponse): Provider[] {
  const lower = text.toLowerCase();
  const tags = resp.matchTags || [];
  if (tags.length > 0) {
    const matched = PROVIDERS.filter(p =>
      p.tags.some(t => tags.some(mt => t.toLowerCase().includes(mt.toLowerCase()) || mt.toLowerCase().includes(t.toLowerCase()))) ||
      tags.some(mt => p.specialty.toLowerCase().includes(mt.toLowerCase()))
    );
    if (matched.length > 0) {
      return [...matched.filter(p => p.contracted), ...matched.filter(p => !p.contracted)]
        .sort((a, b) => b.rating - a.rating).slice(0, 3);
    }
  }
  const queryMatched = PROVIDERS.filter(p =>
    p.tags.some(t => lower.includes(t.toLowerCase())) ||
    lower.includes(p.specialty.toLowerCase())
  );
  if (queryMatched.length > 0) {
    return [...queryMatched.filter(p => p.contracted), ...queryMatched.filter(p => !p.contracted)]
      .sort((a, b) => b.rating - a.rating).slice(0, 3);
  }
  return PROVIDERS.filter(p => p.contracted).sort((a, b) => b.rating - a.rating).slice(0, 3);
}

function isInternationalQuery(input: string): boolean {
  const lower = input.toLowerCase();
  const intlKeywords = ["abroad","turkey","thailand","india","germany","poland","spain","korea","international","overseas","medical tourism","find care abroad","cheapest","hair transplant","surgery abroad","treatment abroad","dental abroad"];
  return intlKeywords.some(k => lower.includes(k));
}

// ─── CHAT SIDEBAR ─────────────────────────────────────────────────────────────
function ChatSidebar({ chatHistory, activeChatId, onSelectChat, onNewChat, onDeleteChat, isOpen, onClose }: ChatSidebarProps) {
  const isMobile = useIsMobile();
  return (
    <>
      {isOpen && isMobile && (
        <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.35)", zIndex:499 }}/>
      )}
      <div className={isOpen ? "slide-in-left" : ""}
        style={{
          width: isMobile ? "min(300px, 85vw)" : 300,
          background: C.white,
          borderRight: isMobile ? "none" : `1px solid ${C.border}`,
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          flexShrink: 0,
          height: isMobile ? "100vh" : "100%",
          position: isMobile ? "fixed" : "relative",
          left: 0, top: 0, bottom: 0,
          zIndex: isMobile ? 500 : 1,
          boxShadow: isMobile ? "4px 0 24px rgba(0,0,0,.16)" : "none",
          borderRadius: isMobile ? "0 20px 20px 0" : 0,
        }}>
        <div style={{ padding:"16px 18px", borderBottom:`1px solid ${C.borderLt}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {isMobile && <span style={{ fontSize:14, fontWeight:800, letterSpacing:"-.2px" }}><span style={{ color:C.teal }}>Hospital</span><span style={{ color:"#047598" }}>.com</span></span>}
            {isMobile && <span style={{ width:1, height:16, background:C.border, display:"inline-block" }}/>}
            <span style={{ fontWeight:700, fontSize:14.5, color:C.text }}>Chats</span>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={onNewChat} title="New chat"
              style={{ width:32, height:32, borderRadius:10, border:`1.5px solid ${C.border}`, background:C.offWhite, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.teal;(e.currentTarget as HTMLButtonElement).style.background=C.tealLt;}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.border;(e.currentTarget as HTMLButtonElement).style.background=C.offWhite;}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            {isMobile && (
              <button onClick={onClose} style={{ width:32, height:32, borderRadius:10, border:`1.5px solid ${C.border}`, background:C.offWhite, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"8px 10px" }}>
          {chatHistory.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 16px", color:C.textSm }}>
              <div style={{ width:44, height:44, borderRadius:14, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:C.textMd, marginBottom:4 }}>No conversations yet</div>
              <div style={{ fontSize:12 }}>Start a new chat to get started!</div>
            </div>
          ) : chatHistory.map(chat => (
            <div key={chat.id} className="chat-history-item" onClick={() => onSelectChat(chat.id)}
              style={{ padding:"11px 14px", borderRadius:12, cursor:"pointer", background:chat.id===activeChatId?C.tealLt:"transparent", border:chat.id===activeChatId?`1.5px solid ${C.teal}30`:"1.5px solid transparent", marginBottom:4, display:"flex", alignItems:"flex-start", gap:10 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={chat.id===activeChatId?C.teal:C.textSm} strokeWidth="2" style={{ flexShrink:0, marginTop:2 }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:chat.id===activeChatId?700:500, color:chat.id===activeChatId?C.teal:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {chat.title}
                </div>
                <div style={{ fontSize:10.5, color:C.textSm, marginTop:2 }}>
                  {chat.messages.length - 1} message{chat.messages.length - 1 !== 1 ? "s" : ""} · {chat.timestamp}
                </div>
              </div>
              <button onClick={e=>{e.stopPropagation();onDeleteChat(chat.id);}} title="Delete chat"
                style={{ background:"none", border:"none", cursor:"pointer", padding:2, opacity:.4, transition:"opacity .15s", flexShrink:0 }}
                onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.opacity="1"} onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.opacity=".4"}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M9,6V4h6v2"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── PROVIDER MINI-CARD ───────────────────────────────────────────────────────
function ProviderMiniCard({ provider, onOpen }: ProviderMiniCardProps) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="card" onClick={() => onOpen(provider)}
      style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"12px 14px", cursor:"pointer", display:"flex", gap:12, alignItems:"flex-start", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
      <div style={{ width:42, height:42, borderRadius:12, overflow:"hidden", flexShrink:0, border:`1px solid ${C.borderLt}`, display:"flex", alignItems:"center", justifyContent:"center", background:C.tealLt, fontWeight:800, fontSize:13, color:C.teal }}>
        {provider.photo && !imgErr
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={provider.photo} alt={provider.name} onError={()=>setImgErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          : provider.image}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:700, fontSize:13.5, color:C.teal, marginBottom:2 }}>{provider.name}</div>
        <div style={{ color:C.textSm, fontSize:12, marginBottom:4 }}>{provider.specialty} · {provider.city}</div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <span style={{ color:C.amber, fontSize:12, fontWeight:600 }}>★ {provider.rating}</span>
          <span style={{ fontSize:11.5, color:C.textSm }}>({provider.reviews} reviews)</span>
          {provider.contracted && <span style={{ background:C.tealLt, color:C.teal, fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:8 }}>Verified</span>}
        </div>
      </div>
    </div>
  );
}

// ─── PROVIDER MODAL ───────────────────────────────────────────────────────────
function ProviderModal({ provider, onClose }: { provider: Provider; onClose: () => void }) {
  const router = useRouter();
  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, background:"rgba(10,20,30,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, padding:"16px", backdropFilter:"blur(3px)" }}>
      <div className="fade-up" style={{ background:C.white, borderRadius:20, width:"100%", maxWidth:560, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 60px rgba(0,0,0,.22)" }}>

        {/* Header */}
        <div style={{ background:`linear-gradient(110deg, ${C.tealLt}, ${C.tealBg})`, padding:"22px 22px 18px", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
            <div style={{ width:60, height:60, borderRadius:14, overflow:"hidden", flexShrink:0, border:`2px solid ${C.tealLt}`, display:"flex", alignItems:"center", justifyContent:"center", background:C.white, fontWeight:800, fontSize:18, color:C.teal }}>
              {provider.photo && !imgErr
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={provider.photo} alt={provider.name} onError={() => setImgErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                : provider.image}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              {/* Clickable name → provider page */}
              <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:2 }}>
                <h2
                  onClick={() => router.push(`/providers/${provider.id}`)}
                  style={{ fontSize:19, fontWeight:800, margin:0, color:C.text, cursor:"pointer", textDecoration:"underline", textDecorationColor:C.teal }}>
                  {provider.name}
                </h2>
                {provider.contracted && (
                  <span style={{ background:C.tealLt, color:C.teal, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:8 }}>Verified</span>
                )}
              </div>
              <p style={{ color:C.textSm, fontSize:13, margin:"2px 0 6px" }}>{provider.specialty}</p>
              <div style={{ display:"flex", gap:14, flexWrap:"wrap", fontSize:12.5 }}>
                <span style={{ color:C.amber }}>★ <strong>{provider.rating}</strong> <span style={{ color:C.textSm }}>({provider.reviews})</span></span>
                <span style={{ color:C.textSm }}>{provider.address}</span>
                <span style={{ color:C.textSm }}>{provider.city}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:22, lineHeight:1, padding:4, flexShrink:0 }}>×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:"20px 22px" }}>
          {/* Action buttons */}
          <div style={{ display:"flex", gap:9, marginBottom:22, flexWrap:"wrap" }}>
            <button onClick={() => router.push(`/providers/${provider.id}`)}
              style={{ flex:1, minWidth:110, background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"10px", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit" }}>
              View Full Profile
            </button>
            {provider.contracted && (
              <button onClick={() => router.push(`/providers/${provider.id}`)}
                style={{ flex:1, minWidth:110, background:C.white, color:C.teal, border:`2px solid ${C.teal}`, borderRadius:10, padding:"10px", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit" }}>
                Book Appointment
              </button>
            )}
            <a href={`tel:${provider.phone || ""}`}
              style={{ flex:1, minWidth:80, background:C.white, color:C.textMd, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px", fontWeight:600, fontSize:13.5, cursor:"pointer", textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
              Call
            </a>
          </div>

          {/* Specialties + AI review summary */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:18 }}>
            <div>
              <h3 style={{ fontSize:13.5, fontWeight:700, marginBottom:9 }}>Specialties</h3>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                {provider.tags?.map(t => <span key={t} style={{ background:C.tealLt, color:C.teal, fontSize:12, padding:"3px 10px", borderRadius:18, fontWeight:600 }}>{t}</span>)}
              </div>
              <div style={{ fontSize:12, color:C.textSm }}>{provider.city} · {provider.distance < 10 ? `${provider.distance} km away` : "Global"}</div>
            </div>
            <div>
              <h3 style={{ fontSize:13.5, fontWeight:700, marginBottom:9 }}>AI Review Summary</h3>
              <div style={{ background:C.greenLt, borderRadius:12, padding:13, marginBottom:9 }}>
                <div style={{ color:C.green, fontWeight:700, fontSize:11.5, marginBottom:3 }}>✓ What patients love</div>
                <p style={{ color:C.textMd, fontSize:12.5, lineHeight:1.6, margin:0 }}>Highly professional, thorough explanations and personalized care.</p>
              </div>
              <div style={{ background:C.amberLt, borderRadius:12, padding:13 }}>
                <div style={{ color:C.amber, fontWeight:700, fontSize:11.5, marginBottom:3 }}>△ Things to know</div>
                <p style={{ color:C.textMd, fontSize:12.5, lineHeight:1.6, margin:0 }}>Wait times longer during peak hours. Limited parking nearby.</p>
              </div>
            </div>
          </div>

          {/* Footer link */}
          <div style={{ marginTop:20, paddingTop:16, borderTop:`1px solid ${C.borderLt}`, textAlign:"center" }}>
            <button onClick={() => router.push(`/providers/${provider.id}`)}
              style={{ background:"none", border:"none", color:C.teal, fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:6 }}>
              See full profile, reviews &amp; availability
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CLINIC MINI-CARD ─────────────────────────────────────────────────────────
function ClinicMiniCard({ clinic, onContact }: ClinicMiniCardProps) {
  const router = useRouter();
  return (
    <div className="card" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", cursor:"pointer", display:"flex", gap:12, alignItems:"flex-start", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}
      onClick={() => router.push(`/medical-tourism/${clinic.id}`)}>
      <div style={{ width:44, height:44, borderRadius:12, background:C.purpleLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, color:C.purple, flexShrink:0 }}>{clinic.image}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
          <span style={{ fontWeight:700, fontSize:13.5, color:C.teal }}>{clinic.name}</span>
          <span style={{ fontSize:11, color:C.textSm }}>{clinic.flag}</span>
        </div>
        <div style={{ color:C.textSm, fontSize:12, marginBottom:4 }}>{clinic.city}, {clinic.country}</div>
        <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:6 }}>
          <span style={{ color:C.amber, fontSize:12, fontWeight:600 }}>★ {clinic.rating}</span>
          <span style={{ fontSize:11.5, color:C.textSm }}>({clinic.reviews} reviews)</span>
        </div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {clinic.procedures.slice(0, 3).map(p => (
            <span key={p} style={{ background:C.tealLt, color:C.teal, fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:8 }}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN CHAT PAGE ───────────────────────────────────────────────────────────
export default function AiAssistantPage() {
  const { initialQuery, setInitialQuery, isLoggedIn, toggleBookmark, bookmarks } = useApp();
  const isMobile = useIsMobile();
  const router = useRouter();

  const WELCOME_MSG: ChatMessage = { role:"assistant", text:"Hi! I'm your AI health assistant. Ask me about symptoms, health concerns, or finding a provider.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:[] };

  const [chatHistory, setChatHistory] = useState<ChatHistoryEntry[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [msgs, setMsgs] = useState<ChatMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [facilitatorModal, setFacilitatorModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const AiAvatar = () => (
    <div style={{ width:38, height:38, borderRadius:14, background:`linear-gradient(135deg, ${C.tealLt}, ${C.tealBg})`, border:`1.5px solid ${C.teal}25`, flexShrink:0, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:C.teal }}>
      AI
    </div>
  );

  const saveCurrent = (currentMsgs: ChatMessage[], currentId: number | null) => {
    if (!currentId || currentMsgs.length <= 1) return;
    const firstUserMsg = currentMsgs.find(m => m.role === "user");
    const title = firstUserMsg ? (firstUserMsg.text.length > 40 ? firstUserMsg.text.slice(0, 40) + "…" : firstUserMsg.text) : "New chat";
    const timestamp = new Date().toLocaleDateString("en", { month:"short", day:"numeric" });
    setChatHistory(prev => {
      const existing = prev.findIndex(c => c.id === currentId);
      const updated: ChatHistoryEntry = { id: currentId, title, messages: currentMsgs, timestamp };
      if (existing >= 0) { const copy = [...prev]; copy[existing] = updated; return copy; }
      return [updated, ...prev];
    });
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    let chatId = activeChatId;
    if (!chatId) { chatId = Date.now(); setActiveChatId(chatId); }

    const newMsgs: ChatMessage[] = [...msgs, { role:"user", text }];
    setMsgs(newMsgs);
    setInput("");
    setLoading(true);

    // TODO(backend): replace with POST /api/ai/chat
    const resp = getResponse(text);
    const showIntlCTA = isInternationalQuery(text) || resp.showFacilitatorCTA;

    setTimeout(() => {
      const isIntl = isInternationalQuery(text) || resp.facilitator;
      const providers = resp.providers && !isIntl ? matchProviders(text, resp) : [];
      let finalClinics: IntlClinic[] = [];
      if (isIntl) {
        const lower = text.toLowerCase();
        const byProcedure = INTL_CLINICS.filter(c => c.procedures.some(p => lower.includes(p.toLowerCase())));
        const byCountry = INTL_CLINICS.filter(c => lower.includes(c.country.toLowerCase()));
        finalClinics = byProcedure.length > 0 ? byProcedure.slice(0, 3) :
                       byCountry.length > 0 ? byCountry.slice(0, 3) :
                       [...INTL_CLINICS].sort((a, b) => b.rating - a.rating).slice(0, 3);
      }
      const finalMsgs: ChatMessage[] = [...newMsgs, { role:"assistant", text:resp.response, providers, clinics:finalClinics, emergency:resp.emergency, showIntlCTA }];
      setMsgs(finalMsgs);
      setLoading(false);
      saveCurrent(finalMsgs, chatId);
    }, 900);
  };

  const handleNewChat = () => {
    saveCurrent(msgs, activeChatId);
    setActiveChatId(null);
    setMsgs([WELCOME_MSG]);
    if (isMobile) setSidebarOpen(false);
  };

  const handleSelectChat = (id: number) => {
    saveCurrent(msgs, activeChatId);
    const chat = chatHistory.find(c => c.id === id);
    if (chat) { setActiveChatId(chat.id); setMsgs(chat.messages); }
    if (isMobile) setSidebarOpen(false);
  };

  const handleDeleteChat = (id: number) => {
    setChatHistory(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) { setActiveChatId(null); setMsgs([WELCOME_MSG]); }
  };

  useEffect(() => {
    if (initialQuery) { send(initialQuery); setInitialQuery(""); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs]);

  return (
    <>
      <Head>
        <title>AI Health Assistant | Hospital.com</title>
        <meta name="description" content="Ask Hospital.com's AI health assistant about symptoms, providers, and care options near you." />
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ display:"flex", height:"calc(100vh - 58px)", background:C.white }}>
        <ChatSidebar
          chatHistory={chatHistory}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div style={{ flex:1, display:"flex", flexDirection:"column", width:"100%", minWidth:0 }}>
          {/* Header */}
          <div style={{ padding:isMobile?"10px 14px":"14px 20px", background:C.white, display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${C.borderLt}` }}>
            <button onClick={() => setSidebarOpen(o => !o)} title="Toggle chat history"
              style={{ width:isMobile?34:38, height:isMobile?34:38, borderRadius:10, border:`1.5px solid ${sidebarOpen?C.teal:C.border}`, background:sidebarOpen?C.tealLt:C.offWhite, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sidebarOpen?C.teal:C.textSm} strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </button>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {activeChatId ? (chatHistory.find(c => c.id === activeChatId)?.title || "Chat") : "New Chat"}
              </div>
              {!isMobile && <div style={{ fontSize:11.5, color:C.textSm, marginTop:1 }}>AI Health Assistant</div>}
            </div>
            <button onClick={handleNewChat} title="New chat"
              style={{ width:isMobile?34:38, height:isMobile?34:38, borderRadius:10, border:`1.5px solid ${C.border}`, background:C.offWhite, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.teal;(e.currentTarget as HTMLButtonElement).style.background=C.tealLt;}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor=C.border;(e.currentTarget as HTMLButtonElement).style.background=C.offWhite;}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:isMobile?"16px 14px":"28px 0", background:C.offWhite }}>
            <div style={{ maxWidth:820, margin:"0 auto", padding:isMobile?0:"0 24px" }}>
              {msgs.map((msg, i) => (
                <div key={i} style={{ marginBottom:20 }}>
                  <div style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", gap:10, alignItems:"flex-end" }}>
                    {msg.role === "assistant" && <AiAvatar />}
                    <div style={{
                      maxWidth:isMobile?"85%":"70%",
                      background:msg.role==="user"?`linear-gradient(135deg, ${C.teal}, ${C.tealDk})`:msg.emergency?C.redLt:C.white,
                      color:msg.role==="user"?"#fff":msg.emergency?C.red:C.text,
                      borderRadius:msg.role==="user"?"20px 20px 4px 20px":"20px 20px 20px 4px",
                      padding:isMobile?"13px 16px":"15px 22px",
                      fontSize:isMobile?13.5:14, lineHeight:1.75,
                      border:msg.emergency?`1px solid ${C.redBd}`:msg.role==="assistant"?`1px solid ${C.border}`:"none",
                      whiteSpace:"pre-wrap",
                      boxShadow:msg.role==="user"?"0 3px 14px rgba(90,202,214,.22)":"0 1px 6px rgba(0,0,0,.04)",
                    }}>{msg.text}</div>
                  </div>

                  {(msg.providers?.length ?? 0) > 0 && (
                    <div style={{ marginTop:12, marginLeft:isMobile?0:48 }}>
                      <p style={{ fontSize:10, color:C.textSm, marginBottom:8, fontWeight:700, letterSpacing:.6 }}>SUGGESTED PROVIDERS</p>
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {msg.providers!.map(p => <ProviderMiniCard key={p.id} provider={p} onOpen={setSelectedProvider} />)}
                      </div>
                    </div>
                  )}

                  {(msg.clinics?.length ?? 0) > 0 && (
                    <div style={{ marginTop:12, marginLeft:isMobile?0:48 }}>
                      <p style={{ fontSize:10, color:C.textSm, marginBottom:8, fontWeight:700, letterSpacing:.6 }}>RECOMMENDED CLINICS</p>
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {msg.clinics!.map(clinic => <ClinicMiniCard key={clinic.id} clinic={clinic} onContact={() => setFacilitatorModal(true)} />)}
                      </div>
                    </div>
                  )}

                  {msg.role === "assistant" && msg.showIntlCTA && (
                    <div className="fade-up" style={{ marginTop:12, marginLeft:isMobile?0:48, background:`linear-gradient(120deg, ${C.purpleLt}, ${C.tealLt})`, border:`1px solid ${C.teal}30`, borderRadius:16, padding:"16px 18px", display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                      <div style={{ flex:1, minWidth: isMobile ? 0 : 180 }}>
                        <div style={{ fontWeight:700, fontSize:13, marginBottom:3, color:C.text }}>Looking for care outside your country?</div>
                        <div style={{ fontSize:12.5, color:C.textMd }}>We can connect you with a medical coordinator who specializes in international care.</div>
                      </div>
                      <button className="btn-primary" onClick={() => setFacilitatorModal(true)}
                        style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"9px 18px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
                        Talk to a Facilitator
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
                  <AiAvatar />
                  <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"20px 20px 20px 4px", padding:"15px 22px", display:"flex", gap:6, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:C.teal, animation:"bounce 1s infinite", animationDelay:`${i * .18}s` }}/>)}
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>
          </div>

          {/* Input */}
          <div style={{ padding:isMobile?"12px 14px":"18px 24px", background:C.white, borderTop:`1px solid ${C.borderLt}` }}>
            <div style={{ maxWidth:820, margin:"0 auto" }}>
              <div style={{ display:"flex", gap:10, background:C.offWhite, borderRadius:22, padding:"6px 6px 6px 20px", alignItems:"center", border:`1.5px solid ${C.border}`, transition:"border-color .2s, box-shadow .2s" }}>
                <input value={input} onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send(input)}
                  placeholder="Describe symptoms or ask a question…"
                  style={{ flex:1, border:"none", background:"transparent", outline:"none", fontSize:14.5, fontFamily:"inherit", minWidth:0, color:C.text, padding:"6px 0" }}/>
                <button onClick={() => send(input)}
                  style={{ background:C.teal, border:"none", borderRadius:18, padding:"11px 24px", color:"#fff", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", transition:"background .15s" }}
                  onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background=C.tealDk}
                  onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background=C.teal}>
                  Send
                </button>
              </div>
              <p style={{ fontSize:10.5, color:C.textSm, textAlign:"center", marginTop:10 }}>For informational purposes only. Not a substitute for professional medical advice.</p>
            </div>
          </div>
        </div>
      </div>

      {facilitatorModal && <FacilitatorModal onClose={() => setFacilitatorModal(false)} />}
      {selectedProvider && <ProviderModal provider={selectedProvider} onClose={() => setSelectedProvider(null)} />}
    </>
  );
}
