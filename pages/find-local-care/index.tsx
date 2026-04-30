import { useState, useRef, useEffect, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import C from "@/lib/tokens";
import { useApp } from "@/lib/context/AppContext";
import useIsMobile from "@/lib/hooks/useIsMobile";
import Footer from "@/components/layout/Footer";

// ─── FIND LOCAL CARE PAGE ─────────────────────────────────────────────────────

// ─── INTERFACES ───────────────────────────────────────────────────────────────
interface Provider {
  id: number;
  type: "doctor" | "clinic";
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  distance: number;
  city: string;
  address: string;
  hours: string;
  phone: string;
  image: string;
  photo: string;
  tags: string[];
  contracted: boolean;
  hasCalendar: boolean;
  amenities: string[];
}

interface InsuranceCarrier {
  name: string;
  plans: string[];
}

interface Specialty {
  name: string;
  icon: string;
  desc: string;
  top: string;
  tint: string;
  tintText: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface ProviderCardProps {
  provider: Provider;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  isLoggedIn: boolean;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PROVIDERS: Provider[] = [
  { id:1, type:"doctor", name:"Dr. Sarah Mitchell", specialty:"Family Medicine", rating:4.8, reviews:312, distance:0.8, city:"New York", address:"120 E 36th St", hours:"Mon–Fri 9–5", phone:"+1 212-555-0192", image:"SM", photo:"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face", tags:["Family Medicine","Preventive Care"], contracted:true, hasCalendar:true, amenities:["Wheelchair Accessible","Wi-Fi","Parking"] },
  { id:2, type:"doctor", name:"Dr. James Okafor", specialty:"Cardiology", rating:4.9, reviews:187, distance:1.2, city:"New York", address:"340 E 72nd St", hours:"Tue–Sat 10–6", phone:"+1 212-555-0234", image:"JO", photo:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face", tags:["Cardiology","Internal Medicine"], contracted:true, hasCalendar:true, amenities:["Wheelchair Accessible","Parking"] },
  { id:3, type:"doctor", name:"Dr. Marcus Webb", specialty:"Neurology", rating:4.7, reviews:298, distance:2.1, city:"Los Angeles", address:"8635 W 3rd St, Ste 200", hours:"Mon–Thu 8–4", phone:"+1 310-555-0311", image:"MW", photo:"https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face", tags:["Neurology","Headache & Migraine"], contracted:true, hasCalendar:true, amenities:["Wheelchair Accessible","Parking"] },
  { id:4, type:"clinic", name:"Glow Medical Spa", specialty:"Medical Aesthetics", rating:4.6, reviews:530, distance:1.5, city:"Miami", address:"1395 Brickell Ave, Ste 800", hours:"Daily 10–7", phone:"+1 305-555-0445", image:"GM", photo:"https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=150&h=150&fit=crop&crop=face", tags:["Botox","Injectables","Skin Care"], contracted:true, hasCalendar:true, amenities:["Wi-Fi","Parking","Wheelchair Accessible","Private Rooms"] },
  { id:5, type:"doctor", name:"Dr. Amir Patel", specialty:"Orthopedics", rating:4.5, reviews:203, distance:3.4, city:"Chicago", address:"680 N Lake Shore Dr", hours:"Mon–Fri 8–3", phone:"+1 312-555-0678", image:"AP", photo:"https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face", tags:["Orthopedics","Sports Medicine"], contracted:true, hasCalendar:false, amenities:["Parking","Wheelchair Accessible"] },
  { id:6, type:"doctor", name:"Dr. Priya Sharma", specialty:"Cardiology", rating:4.3, reviews:156, distance:4.2, city:"Houston", address:"6624 Fannin St", hours:"MWF 9–4", phone:"+1 713-555-0789", image:"PS", photo:"https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=150&h=150&fit=crop&crop=face", tags:["Cardiology","Echocardiography"], contracted:false, hasCalendar:false, amenities:[] },
  { id:7, type:"clinic", name:"CityHealth Clinic", specialty:"Family Medicine", rating:4.2, reviews:89, distance:5.1, city:"Los Angeles", address:"4835 Van Nuys Blvd, Ste 105", hours:"Daily 8–8", phone:"+1 818-555-0890", image:"CH", photo:"https://images.unsplash.com/photo-1666214280557-091e285b2bba?w=150&h=150&fit=crop&crop=face", tags:["Family Medicine","Walk-in"], contracted:false, hasCalendar:false, amenities:[] },
];

const INSURANCE_CARRIERS: InsuranceCarrier[] = [
  { name:"Aetna", plans:["Aetna Choice POS II","Aetna HMO","Aetna PPO","Aetna Medicare Advantage"] },
  { name:"BlueCross BlueShield", plans:["BCBS PPO","BCBS HMO","BCBS Blue Card","BCBS Federal","BCBS Medicare Supplement"] },
  { name:"Cigna", plans:["Cigna PPO","Cigna HMO","Cigna Open Access Plus","Cigna EPO","Cigna Medicare Advantage"] },
  { name:"UnitedHealthcare", plans:["UHC Choice Plus","UHC Navigate","UHC Options PPO","UHC Medicare Advantage"] },
  { name:"Medicare", plans:["Medicare Part A","Medicare Part B","Medicare Advantage","Medigap"] },
  { name:"Humana", plans:["Humana PPO","Humana HMO","Humana Gold Plus","Humana Medicare Advantage"] },
  { name:"Kaiser Permanente", plans:["Kaiser HMO","Kaiser Medicare"] },
  { name:"Medicaid", plans:["Medicaid Managed Care","Medicaid Fee-for-Service"] },
  { name:"Anthem", plans:["Anthem PPO","Anthem HMO","Anthem Blue Access"] },
  { name:"Oscar Health", plans:["Oscar PPO","Oscar EPO"] },
  { name:"Tricare", plans:["Tricare Prime","Tricare Select","Tricare for Life"] },
];

const ALL_CITIES = ["New York","Los Angeles","Chicago","Houston","Miami"];

const SPECIALTY_CHIPS = [
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>, name:"Acupuncturist",    count:"142" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, name:"Family Doctor",     count:"680" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, name:"Cardiologist",      count:"540" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M12 2C8 2 5 5 5 8c0 3.5 3 6 4 8h6c1-2 4-4.5 4-8 0-3-3-6-7-6z"/><path d="M9 17v2a3 3 0 0 0 6 0v-2"/></svg>, name:"Dentist",           count:"820" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="8" r="5"/><path d="M3 21c0-4.4 4-8 9-8s9 3.6 9 8"/></svg>, name:"Dermatologist",     count:"380" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>, name:"Orthopedist",       count:"290" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>, name:"Pediatrician",      count:"445" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>, name:"Psychiatrist",      count:"320" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>, name:"OB-GYN",            count:"265" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/></svg>, name:"Ophthalmologist",   count:"175" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>, name:"Urgent Care",       count:"195" },
];

const PROCEDURE_CHIPS = [
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, name:"Annual Physical",   count:"1.2k" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>, name:"Flu Shot",          count:"2.1k" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>, name:"Blood Test",        count:"1.8k" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M12 2C8 2 5 5 5 8c0 3.5 3 6 4 8h6c1-2 4-4.5 4-8 0-3-3-6-7-6z"/><path d="M9 17v2a3 3 0 0 0 6 0v-2"/></svg>, name:"Teeth Cleaning",    count:"940" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="3"/><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/></svg>, name:"Eye Exam",          count:"760" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="8" r="5"/><path d="M3 21c0-4.4 4-8 9-8s9 3.6 9 8"/></svg>, name:"Skin Check",        count:"890" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>, name:"MRI Scan",          count:"430" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, name:"Echocardiogram",    count:"285" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>, name:"Knee Replacement",  count:"180" },
  { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><circle cx="12" cy="12" r="10"/><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" fill="#46c4d9" stroke="none"/></svg>, name:"Colonoscopy",       count:"310" },
];

// ─── SEO LINK GRID DATA ───────────────────────────────────────────────────────
const TOP_CITIES = ["New York","Los Angeles","Chicago","Houston","Miami"];

const SEO_SPECIALTIES: { label:string; slug:string; cityPages:Record<string,string> }[] = [
  { label:"Addiction Medicine Specialist", slug:"addiction-medicine-specialist", cityPages:{"New York":"new-york-ny","Los Angeles":"los-angeles-ca"} },
  { label:"Acupuncturist",   slug:"acupuncturist",   cityPages:{} },
  { label:"Cardiologist",    slug:"cardiologist",    cityPages:{} },
  { label:"Dentist",         slug:"dentist",         cityPages:{} },
  { label:"Dermatologist",   slug:"dermatologist",   cityPages:{} },
  { label:"Family Doctor",   slug:"family-doctor",   cityPages:{} },
  { label:"Neurologist",     slug:"neurologist",     cityPages:{} },
  { label:"OB-GYN",          slug:"ob-gyn",          cityPages:{} },
  { label:"Ophthalmologist", slug:"ophthalmologist", cityPages:{} },
  { label:"Orthopedist",     slug:"orthopedist",     cityPages:{} },
  { label:"Pediatrician",    slug:"pediatrician",    cityPages:{} },
  { label:"Psychiatrist",    slug:"psychiatrist",    cityPages:{} },
  { label:"Urgent Care",     slug:"urgent-care",     cityPages:{} },
];

const SEO_PROCEDURES = [
  "Annual Physical","Blood Test","Colonoscopy","Echocardiogram",
  "Eye Exam","Flu Shot","Hip Replacement","Knee Replacement",
  "MRI Scan","Skin Check","Teeth Cleaning","Wisdom Tooth Removal",
];

// ─── SEO LINK GRID ────────────────────────────────────────────────────────────
const CITY_META: Record<string, { short: string; color: string }> = {
  "New York":    { short:"NY",  color:"#0a3d6b" },
  "Los Angeles": { short:"LA",  color:"#c0622a" },
  "Chicago":     { short:"CHI", color:"#1a5c36" },
  "Houston":     { short:"HOU", color:"#6b2d8e" },
  "Miami":       { short:"MIA", color:"#0e7a6e" },
};

function SeoLinkGrid({ onProcedureClick }: { onProcedureClick?: (proc: string) => void }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<"specialty"|"procedure">("specialty");
  const [selectedCity, setSelectedCity] = useState("All");

  const items = tab === "specialty" ? SEO_SPECIALTIES : SEO_PROCEDURES.map(p => ({ label:p, slug:p, cityPages:{} as Record<string,string> }));

  const handleClick = (item: typeof items[0]) => {
    const label = "label" in item ? item.label : item as unknown as string;
    if (tab === "specialty") {
      const sp = item as typeof SEO_SPECIALTIES[0];
      if (selectedCity !== "All" && sp.cityPages[selectedCity]) {
        router.push(`/find-local-care/${sp.slug}/${sp.cityPages[selectedCity]}`);
      } else {
        router.push(`/find-local-care/${sp.slug}`);
      }
    } else {
      if (onProcedureClick) onProcedureClick(label as string);
      else router.push("/find-local-care");
    }
  };

  const PinIcon = ({ color = C.teal }: { color?: string }) => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
      <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/>
    </svg>
  );

  return (
    <section style={{ padding:isMobile?"40px 0 32px":"52px 0 44px", borderTop:`1px solid ${C.borderLt}`, marginTop:isMobile?32:48 }}>

      {/* Header row */}
      <div style={{ display:"flex", alignItems:isMobile?"flex-start":"center", justifyContent:"space-between", flexDirection:isMobile?"column":"row" as const, gap:14, marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:C.blue, marginBottom:6 }}>
            Explore by Location
          </div>
          <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:isMobile?20:24, fontWeight:700, color:"#071e34", margin:0, letterSpacing:"-0.02em" }}>
            Find Care Near You
          </h2>
        </div>
        <div style={{ display:"flex", gap:0, background:"#f0f4f6", borderRadius:10, padding:3, flexShrink:0 }}>
          {(["specialty","procedure"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:"7px 18px", border:"none", borderRadius:8, background:tab===t?"#fff":"transparent", fontWeight:tab===t?700:400, fontSize:12.5, cursor:"pointer", color:tab===t?"#071e34":C.textSm, boxShadow:tab===t?"0 1px 4px rgba(0,0,0,.08)":"none", fontFamily:"inherit", transition:"all .15s", whiteSpace:"nowrap" as const }}>
              By {t === "specialty" ? "Specialty" : "Procedure"}
            </button>
          ))}
        </div>
      </div>

      {/* City selector */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" as const, marginBottom:24 }}>
        {["All", ...TOP_CITIES].map(city => {
          const selected = selectedCity === city;
          const meta = city !== "All" ? CITY_META[city] : null;
          return (
            <button key={city} onClick={() => setSelectedCity(city)}
              style={{
                display:"flex", alignItems:"center", gap:6,
                padding:"7px 14px",
                border:`1.5px solid ${selected ? C.teal : C.borderLt}`,
                borderRadius:22,
                background: selected ? C.tealLt : "#fff",
                color: selected ? C.teal : C.textMd,
                fontSize:12.5, fontWeight:selected?700:500,
                cursor:"pointer", fontFamily:"inherit",
                transition:"all .15s",
                whiteSpace:"nowrap" as const,
              }}
              onMouseEnter={e => { if (!selected) { (e.currentTarget as HTMLButtonElement).style.borderColor=C.teal; (e.currentTarget as HTMLButtonElement).style.color=C.teal; }}}
              onMouseLeave={e => { if (!selected) { (e.currentTarget as HTMLButtonElement).style.borderColor=C.borderLt; (e.currentTarget as HTMLButtonElement).style.color=C.textMd; }}}>
              {city === "All"
                ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={selected?C.teal:C.textMd} strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                : <PinIcon color={selected ? C.teal : C.textMd} />
              }
              {city === "All" ? "All Cities" : city}
              {meta && (
                <span style={{ fontSize:10, fontWeight:700, padding:"1px 6px", borderRadius:8, background:selected?`${C.teal}20`:"#f0f4f6", color:selected?C.teal:C.textSm, letterSpacing:"0.04em" }}>
                  {meta.short}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Specialty / Procedure grid */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(auto-fill, minmax(180px, 1fr))", gap:10 }}>
        {items.map(item => {
          const label = "label" in item ? item.label : item as unknown as string;
          const chip = SPECIALTY_CHIPS.find(c => c.name.toLowerCase() === label.toLowerCase());
          const procChip = PROCEDURE_CHIPS.find(c => c.name.toLowerCase() === label.toLowerCase());
          const iconEl = chip?.icon ?? procChip?.icon;
          const count = chip?.count ?? procChip?.count;

          return (
            <button key={label} onClick={() => handleClick(item)}
              style={{
                display:"flex", alignItems:"center", gap:10,
                padding:"12px 14px",
                background:"#fff",
                border:`1px solid ${C.borderLt}`,
                borderRadius:12,
                cursor:"pointer", fontFamily:"inherit",
                textAlign:"left" as const,
                transition:"all .15s",
              }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor=C.teal; b.style.background=C.tealLt; b.style.boxShadow=`0 2px 10px rgba(70,196,217,.12)`; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor=C.borderLt; b.style.background="#fff"; b.style.boxShadow="none"; }}>
              {iconEl && (
                <div style={{ width:28, height:28, borderRadius:8, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {iconEl}
                </div>
              )}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:600, color:"#071e34", lineHeight:1.3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>{label}</div>
                <div style={{ fontSize:11, color:C.textSm, marginTop:2 }}>
                  {selectedCity === "All" ? (count ? `${count} providers` : "View all") : `in ${selectedCity}`}
                </div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5" style={{ flexShrink:0 }}><polyline points="9,18 15,12 9,6"/></svg>
            </button>
          );
        })}
      </div>

    </section>
  );
}

// ─── PROVIDER CARD ────────────────────────────────────────────────────────────
function ProviderCard({ provider, bookmarks, toggleBookmark, isLoggedIn }: ProviderCardProps) {
  const router = useRouter();
  const [imgErr, setImgErr] = useState(false);
  const isBookmarked = bookmarks.includes(provider.id);
  const isDoctor = provider.type === "doctor";

  return (
    <div className="card" onClick={() => router.push(`/providers/${provider.id}`)}
      style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,.05)", display:"flex", gap:14, alignItems:"flex-start", position:"relative", transition:"box-shadow .15s, border-color .15s" }}
      onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow="0 6px 24px rgba(16,117,173,0.12)";(e.currentTarget as HTMLDivElement).style.borderColor=C.teal;}}
      onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow="0 1px 4px rgba(0,0,0,.05)";(e.currentTarget as HTMLDivElement).style.borderColor=C.border;}}>

      {/* Bookmark */}
      <button onClick={e=>{e.stopPropagation();if(!isLoggedIn){router.push("/signup");return;}toggleBookmark(provider.id);}}
        style={{ position:"absolute", top:14, right:14, background:"none", border:"none", cursor:"pointer", padding:4 }}
        title={isLoggedIn?(isBookmarked?"Remove bookmark":"Bookmark"):"Sign up to bookmark"}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked?C.teal:"none"} stroke={isBookmarked?C.teal:C.textSm} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      {/* Photo */}
      <div style={{ width:56, height:56, borderRadius:isDoctor?14:10, overflow:"hidden", flexShrink:0, border:`1px solid ${C.borderLt}`, display:"flex", alignItems:"center", justifyContent:"center", background:C.tealLt, fontWeight:800, fontSize:16, color:C.teal }}>
        {provider.photo && !imgErr
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={provider.photo} alt={provider.name} onError={()=>setImgErr(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          : provider.image}
      </div>

      <div style={{ flex:1, minWidth:0, paddingRight:24 }}>
        {/* Type badge + name */}
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2, flexWrap:"wrap" }}>
          <span style={{ display:"inline-block", background: isDoctor ? "rgba(70,196,217,0.10)" : "rgba(16,117,173,0.08)", color: isDoctor ? C.teal : C.blue, fontSize:9.5, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" as const, padding:"2px 8px", borderRadius:100, border:`1px solid ${isDoctor?"rgba(70,196,217,0.25)":"rgba(16,117,173,0.2)"}` }}>
            {isDoctor ? "Doctor" : "Clinic"}
          </span>
          {provider.contracted && (
            <span style={{ display:"inline-flex", alignItems:"center", gap:3, background:C.tealLt, color:C.teal, fontSize:9.5, fontWeight:700, padding:"2px 8px", borderRadius:100, border:`1px solid rgba(70,196,217,0.3)` }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
              Verified Partner
            </span>
          )}
        </div>
        <div style={{ fontWeight:700, fontSize:14.5, marginBottom:3, color:C.text }}>{provider.name}</div>
        <div style={{ color:C.textSm, fontSize:12.5, marginBottom:6 }}>{provider.specialty}</div>

        {/* Rating + meta */}
        <div style={{ display:"flex", gap:8, alignItems:"center", fontSize:12, color:C.textSm, marginBottom:8, flexWrap:"wrap" }}>
          <span style={{ display:"flex", alignItems:"center", gap:3 }}>
            {[1,2,3,4,5].map(s=><span key={s} style={{ color:s<=Math.round(provider.rating)?"#f0c840":C.grayMd, fontSize:11 }}>★</span>)}
            <strong style={{ color:C.text, fontSize:12, fontWeight:700, marginLeft:2 }}>{provider.rating}</strong>
          </span>
          <span>· {provider.reviews} reviews</span>
          <span>· {provider.distance}km</span>
          <span>· {provider.city}</span>
        </div>

        {/* Tags */}
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:8 }}>
          {provider.tags.map(t => <span key={t} style={{ background:C.tealLt, color:C.teal, fontSize:10.5, fontWeight:600, padding:"3px 10px", borderRadius:100, border:`1px solid rgba(70,196,217,0.25)` }}>{t}</span>)}
        </div>

        {/* Address + hours */}
        <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:C.textSm, marginBottom:10 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
          {provider.address} · {provider.hours}
        </div>

        {/* Amenities */}
        {(provider.amenities||[]).length > 0 && (
          <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:10 }}>
            {provider.amenities.map(a => <span key={a} style={{ background:C.blueLt, color:C.blue, fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20 }}>{a}</span>)}
          </div>
        )}

        {/* Book Appointment button — only for contracted providers */}
        {provider.contracted && (
          <button onClick={e=>{e.stopPropagation();router.push(`/providers/${provider.id}`);}}
            style={{ padding:"8px 22px", border:"none", borderRadius:20, background:C.teal, color:"#fff", fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit", display:"inline-flex", alignItems:"center", gap:6, transition:"opacity .15s" }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.opacity="0.88"}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.opacity="1"}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Book Appointment
          </button>
        )}
      </div>
    </div>
  );
}

// ─── PAGE COMPONENT ───────────────────────────────────────────────────────────
export default function FindLocalCarePage() {
  const router = useRouter();
  const { bookmarks, toggleBookmark, isLoggedIn } = useApp();
  const isMobile = useIsMobile();

  const [searchQuery,   setSearchQuery]   = useState("");
  const [specialty,     setSpecialty]     = useState("All");
  const [city,          setCity]          = useState("All");
  const [minRating,     setMinRating]     = useState(0);
  const [sortBy,        setSortBy]        = useState("rating");
  const [viewTab,       setViewTab]       = useState("all");
  const [heroSpecialty, setHeroSpecialty] = useState("All");
  const [heroInsurance, setHeroInsurance] = useState("All");
  const [heroRating,    setHeroRating]    = useState("Any");
  const [heroLocation,  setHeroLocation]  = useState("");
  const [showResults,   setShowResults]   = useState(false);
  const [filterInsurance, setFilterInsurance] = useState("All");
  const [filterAmenities, setFilterAmenities] = useState<string[]>([]);
  const [heroInsExp,   setHeroInsExp]   = useState<string|null>(null);
  const [filterInsExp, setFilterInsExp] = useState<string|null>(null);
  const [aiMode,        setAiMode]        = useState(false);
  const [aiQuery,       setAiQuery]       = useState("");
  const [openDropdown,  setOpenDropdown]  = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setOpenDropdown(null);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleHeroSearch = () => {
    if (heroSpecialty !== "All") setSpecialty(heroSpecialty);
    if (heroLocation.trim()) {
      const matchedCity = ALL_CITIES.find(c => heroLocation.toLowerCase().includes(c.toLowerCase()));
      if (matchedCity) setCity(matchedCity);
    }
    if (heroRating !== "Any") setMinRating(parseFloat(heroRating));
    setShowResults(true);
  };

  const applyFilters = (list: Provider[]): Provider[] => {
    let out = list.filter(p =>
      (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.specialty.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (city === "All" || p.city === city) &&
      p.rating >= minRating &&
      (specialty === "All" || p.specialty === specialty || p.tags.includes(specialty)) &&
      (filterInsurance === "All" || (p as any).insurance === filterInsurance || p.contracted) &&
      filterAmenities.every(a => (p.amenities || []).includes(a))
    );
    if (viewTab === "bookmarked") out = out.filter(p => bookmarks.includes(p.id));
    if (sortBy === "rating")   out = [...out].sort((a, b) => b.rating - a.rating);
    if (sortBy === "distance") out = [...out].sort((a, b) => a.distance - b.distance);
    if (sortBy === "reviews")  out = [...out].sort((a, b) => b.reviews - a.reviews);
    return [...out.filter(p => p.contracted), ...out.filter(p => !p.contracted)];
  };

  const filtered = applyFilters(PROVIDERS);

  const SPECIALTIES = ["All","Acupuncture","Cardiology","Dentistry","Dermatology","Family Medicine","Ophthalmology","Orthopedics","Psychiatry","Pediatrics","Urgent Care","Gastroenterology","OB-GYN","Medical Aesthetics"];
  const RATINGS = [{ val:"Any", label:"Any Rating" },{ val:"4", label:"4+ Stars" },{ val:"4.5", label:"4.5+ Stars" }];

  return (
    <>
      <Head>
        <title>Find Local Doctors, Specialists & Clinics | Hospital.com</title>
        <meta name="description" content="Browse verified doctors, specialists, and clinics near you. Filter by specialty, insurance, and location. Book appointments online." />
        <meta property="og:title" content="Find Local Doctors, Specialists & Clinics | Hospital.com" />
        <link rel="canonical" href="https://www.hospital.com/find-local-care" />
      </Head>

      <div>
        {/* ─── HERO ─────────────────────────────────────────────────────────── */}
        <div style={{
          background: "#f0fafe",
          padding: isMobile ? "72px 20px 64px" : "50px 24px 80px",
          position: "relative", overflow: "hidden",
        }}>
          {/* CSS grid lines */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            backgroundImage:"linear-gradient(rgba(16,117,173,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,117,173,0.06) 1px, transparent 1px)",
            backgroundSize:"60px 60px",
          }}/>
          {/* Radial gradients */}
          <div style={{
            position:"absolute", inset:0, pointerEvents:"none",
            background:`radial-gradient(ellipse 65% 70% at -5% 55%, rgba(70,196,217,0.22) 0%, transparent 55%),
              radial-gradient(ellipse 55% 65% at 105% 30%, rgba(18,117,173,0.14) 0%, transparent 55%)`,
          }}/>

          <div style={{ maxWidth:1200, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>

            {/* TRUSTED badge */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8,
              background:"rgba(70,196,217,0.10)", border:"1px solid rgba(70,196,217,0.30)",
              color:"#1275ad", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const,
              padding:"6px 16px", borderRadius:100, marginBottom:28, fontFamily:"Outfit, sans-serif",
            }}>
              🌐 Trusted Healthcare, Simplified
            </div>

            {/* H1 */}
            <h1 style={{
              fontFamily:"Outfit, sans-serif",
              fontSize: isMobile ? 32 : "clamp(2.6rem, 5.5vw, 4.5rem)",
              fontWeight: 900,
              color: "#071e34",
              lineHeight: 1.06,
              marginBottom: 20,
              letterSpacing: "-0.03em",
            }}>
              Find{" "}
              <em style={{ fontStyle:"italic", color:"#46c4d9" }}>local care</em>
              {" "}that <br />
fits your life
            </h1>

            <p style={{
              color: "#3A4A5C",
              fontSize: isMobile ? 15 : 17,
              maxWidth: 480,
              margin: "0 auto 32px",
              lineHeight: 1.7,
              fontWeight: 400,
            }}>
              Search thousands of verified doctors, specialists,
              and clinics near you with powerful filters.
            </p>

            {/* ─── SEARCH TOGGLE ──────────────────────────────────────────── */}
            <div style={{
              display:"inline-flex", alignItems:"center",
              background:"rgba(255,255,255,0.8)", border:"1.5px solid #D6E4EA",
              borderRadius:100, padding:4, marginBottom:16,
            }}>
              <button onClick={() => setAiMode(false)}
                style={{
                  padding:"8px 20px", borderRadius:100,
                  fontFamily:"Outfit, sans-serif", fontSize:13, fontWeight:600,
                  cursor:"pointer", border:"none",
                  background: !aiMode ? "#071e34" : "transparent",
                  color: !aiMode ? "white" : "#7a8fa0",
                  transition:"all .2s", display:"flex", alignItems:"center", gap:6,
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="17" y1="17" x2="22" y2="22"/></svg>
                Classic Search
              </button>
              <button onClick={() => setAiMode(true)}
                style={{
                  padding:"8px 20px", borderRadius:100,
                  fontFamily:"Outfit, sans-serif", fontSize:13, fontWeight:600,
                  cursor:"pointer", border:"none",
                  background: aiMode ? "#071e34" : "transparent",
                  color: aiMode ? "white" : "#7a8fa0",
                  transition:"all .2s", display:"flex", alignItems:"center", gap:6,
                }}>
                ✦ AI Search
              </button>
            </div>

            {/* ─── SEARCH PANEL ───────────────────────────────────────────── */}
            <div style={{ width:"100%", maxWidth:980, margin:"0 auto" }}>

              {/* Classic search */}
              {!aiMode && (
                <div style={{
                  background:"white",
                  padding: isMobile ? "7px" : "7px 7px 7px 10px",
                  boxShadow:"0 8px 48px rgba(16,117,173,0.13), 0 0 0 1px rgba(16,117,173,0.08)",
                  display:"flex", alignItems:"center",
                  flexDirection: isMobile ? "column" : "row",
                  borderRadius: isMobile ? 20 : 100,
                }}>

                  {/* 1 — SPECIALTY */}
                  <div onMouseDown={e=>e.stopPropagation()} style={{
                    flex:1, display:"flex", alignItems:"center", gap:12, padding:"12px 22px",
                    borderRight: isMobile ? "none" : "1px solid #D6E4EA",
                    borderBottom: isMobile ? "1px solid #D6E4EA" : "none",
                    position:"relative" as const,
                    width: isMobile ? "100%" : "auto",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1275ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ textAlign:"left",fontFamily:"Outfit, sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" as const, color:"#7a8fa0", marginBottom:3 }}>Specialty / Procedure</div>
                      <div onClick={() => setOpenDropdown(openDropdown==="specialty" ? null : "specialty")}
                        style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
                        <span style={{ fontSize:14, fontWeight:500, color:heroSpecialty==="All"?"#a8bfcc":"#0E1C26", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>
                          {heroSpecialty==="All" ? "e.g. Dentist, Cardiology…" : heroSpecialty}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7a8fa0" strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .2s", transform:openDropdown==="specialty"?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
                      </div>
                      {openDropdown==="specialty" && (
                        <div style={{ position:"absolute" as const, top:"calc(100% + 8px)", left:0, minWidth:180, background:"#fff", borderRadius:16, boxShadow:"0 16px 48px rgba(0,0,0,.13)", border:"1.5px solid #D6E4EA", zIndex:1000, overflow:"hidden" as const, animation:"dropFade .18s ease" }}>
                          <div className="dd-scroll" style={{ padding:"8px 0", maxHeight:280, overflowY:"auto" as const }}>
                            {SPECIALTIES.map(opt => (
                              <div key={opt} className="dd-opt" onClick={() => { setHeroSpecialty(opt); setOpenDropdown(null); }}
                                style={{ padding:"9px 16px", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:8, color:heroSpecialty===opt?"#46c4d9":"#0E1C26", fontWeight:heroSpecialty===opt?700:400, background:heroSpecialty===opt?"rgba(70,196,217,.08)":"transparent" }}>
                                {heroSpecialty===opt && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                                {opt==="All" ? "All Specialties" : opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2 — LOCATION */}
                  <div style={{
                    flex:1, display:"flex", alignItems:"center", gap:12, padding:"12px 22px",
                    borderRight: isMobile ? "none" : "1px solid #D6E4EA",
                    borderBottom: isMobile ? "1px solid #D6E4EA" : "none",
                    width: isMobile ? "100%" : "auto",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1275ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <div style={{ flex:1 }}>
                      <div style={{textAlign:"left", fontFamily:"Outfit, sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" as const, color:"#7a8fa0", marginBottom:3 }}>Location</div>
                      <input value={heroLocation} onChange={e=>setHeroLocation(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleHeroSearch()}
                        placeholder="City, ZIP"
                        style={{ border:"none", outline:"none", fontSize:14, fontWeight:500, color:heroLocation?"#0E1C26":"#a8bfcc", fontFamily:"inherit", background:"transparent", width:"100%" }}/>
                    </div>
                  </div>

                  {/* 3 — INSURANCE */}
                  <div onMouseDown={e=>e.stopPropagation()} style={{
                    flex:1, display:"flex", alignItems:"center", gap:12, padding:"12px 22px",
                    borderRight: isMobile ? "none" : "1px solid #D6E4EA",
                    borderBottom: isMobile ? "1px solid #D6E4EA" : "none",
                    position:"relative" as const,
                    width: isMobile ? "100%" : "auto",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1275ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ textAlign:"left",fontFamily:"Outfit, sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" as const, color:"#7a8fa0", marginBottom:3 }}>Insurance (Optional)</div>
                      <div onClick={() => setOpenDropdown(openDropdown==="insurance" ? null : "insurance")}
                        style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
                        <span style={{ fontSize:14, fontWeight:500, color:heroInsurance==="All"?"#a8bfcc":"#0E1C26", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const }}>
                          {heroInsurance==="All" ? "Select your plan…" : heroInsurance}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7a8fa0" strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .2s", transform:openDropdown==="insurance"?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
                      </div>
                      {openDropdown==="insurance" && (
                        <div style={{ position:"absolute" as const, top:"calc(100% + 8px)", left:0, minWidth:200, background:"#fff", borderRadius:16, boxShadow:"0 16px 48px rgba(0,0,0,.13)", border:"1.5px solid #D6E4EA", zIndex:1000, overflow:"hidden" as const, animation:"dropFade .18s ease" }}>
                          <div className="dd-scroll" style={{ padding:"8px 0", maxHeight:300, overflowY:"auto" as const }}>
                            <div className="dd-opt" onClick={() => { setHeroInsurance("All"); setHeroInsExp(null); setOpenDropdown(null); }}
                              style={{ padding:"9px 16px", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:8, color:heroInsurance==="All"?"#46c4d9":"#0E1C26", fontWeight:heroInsurance==="All"?700:400, background:heroInsurance==="All"?"rgba(70,196,217,.08)":"transparent" }}>
                              {heroInsurance==="All" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                              Any Insurance
                            </div>
                            {INSURANCE_CARRIERS.map(c => {
                              const carrierActive = heroInsurance===c.name || c.plans.includes(heroInsurance);
                              const expanded = heroInsExp===c.name;
                              return (
                                <div key={c.name}>
                                  <div onClick={() => setHeroInsExp(expanded ? null : c.name)}
                                    style={{ padding:"9px 16px", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, color:carrierActive?"#46c4d9":"#0E1C26", fontWeight:600, background:carrierActive?"rgba(70,196,217,.06)":"transparent" }}>
                                    <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                                      {carrierActive && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                                      {c.name}
                                    </span>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7a8fa0" strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .15s", transform:expanded?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
                                  </div>
                                  {expanded && c.plans.map(plan => (
                                    <div key={plan} className="dd-opt" onClick={() => { setHeroInsurance(plan); setOpenDropdown(null); }}
                                      style={{ padding:"8px 16px 8px 32px", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", gap:8, color:heroInsurance===plan?"#46c4d9":"#7a8fa0", fontWeight:heroInsurance===plan?700:400, background:heroInsurance===plan?"rgba(70,196,217,.08)":"transparent" }}>
                                      {heroInsurance===plan && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                                      {plan}
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4 — MIN RATING */}
                  <div onMouseDown={e=>e.stopPropagation()} style={{
                    display:"flex", alignItems:"center", gap:12, padding:"12px 22px",
                    position:"relative" as const,
                    width: isMobile ? "100%" : "auto",
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1275ad" strokeWidth="1.8" style={{ flexShrink:0 }}>
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                    <div style={{ minWidth:0 }}>
                      <div style={{textAlign:"left", fontFamily:"Outfit, sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" as const, color:"#7a8fa0", marginBottom:3 }}>Min Rating</div>
                      <div onClick={() => setOpenDropdown(openDropdown==="rating" ? null : "rating")}
                        style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
                        <span style={{ fontSize:14, fontWeight:500, color:heroRating==="Any"?"#a8bfcc":"#0E1C26", whiteSpace:"nowrap" as const }}>
                          {RATINGS.find(r=>r.val===heroRating)?.label ?? "Any Rating"}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7a8fa0" strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .2s", transform:openDropdown==="rating"?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
                      </div>
                      {openDropdown==="rating" && (
                        <div style={{ position:"absolute" as const, top:"calc(100% + 8px)", left:0, minWidth:140, background:"#fff", borderRadius:16, boxShadow:"0 16px 48px rgba(0,0,0,.13)", border:"1.5px solid #D6E4EA", zIndex:1000, overflow:"hidden" as const, animation:"dropFade .18s ease" }}>
                          <div className="dd-scroll" style={{ padding:"8px 0" }}>
                            {RATINGS.map(r => (
                              <div key={r.val} className="dd-opt" onClick={() => { setHeroRating(r.val); setOpenDropdown(null); }}
                                style={{ padding:"9px 16px", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:8, color:heroRating===r.val?"#46c4d9":"#0E1C26", fontWeight:heroRating===r.val?700:400, background:heroRating===r.val?"rgba(70,196,217,.08)":"transparent" }}>
                                {heroRating===r.val && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                                {r.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Find Providers button */}
                  <button onClick={handleHeroSearch}
                    style={{
                      background:"#46c4d9", color:"white", border:"none",
                      borderRadius: isMobile ? 12 : 100, padding:"14px 28px",
                      fontFamily:"Outfit, sans-serif", fontSize:14, fontWeight:700, cursor:"pointer",
                      display:"flex", alignItems:"center", gap:8, flexShrink:0, whiteSpace:"nowrap" as const,
                      width: isMobile ? "100%" : "auto", justifyContent:"center",
                      transition:"opacity .2s", marginTop: isMobile ? 4 : 0,
                    }}
                    onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.opacity="0.88"}
                    onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.opacity="1"}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="17" y1="17" x2="22" y2="22"/></svg>
                    Find Providers
                  </button>
                </div>
              )}

              {/* AI Search */}
              {aiMode && (
                <div style={{ background:"white", borderRadius:24, padding:"20px 24px", boxShadow:"0 8px 48px rgba(16,117,173,0.13), 0 0 0 1px rgba(16,117,173,0.08)" }}>
                  <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#1275ad", marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                    ✦ Describe what you&apos;re looking for in plain language
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
                    <textarea value={aiQuery} onChange={e=>setAiQuery(e.target.value)} autoFocus
                      onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); handleHeroSearch(); } }}
                      placeholder="e.g. I need a cardiologist near downtown who accepts Aetna and has availability this week…"
                      rows={2}
                      style={{ flex:1, border:"1.5px solid #D6E4EA", borderRadius:12, padding:"14px 18px", fontFamily:"inherit", fontSize:14, color:"#0E1C26", resize:"none", outline:"none", lineHeight:1.55, minHeight:56, boxSizing:"border-box" as const, transition:"border-color .2s" }}
                      onFocus={e=>e.target.style.borderColor="#46c4d9"}
                      onBlur={e=>e.target.style.borderColor="#D6E4EA"} />
                    <button onClick={handleHeroSearch}
                      style={{ background:"linear-gradient(135deg,#46c4d9,#1275ad)", color:"white", border:"none", borderRadius:12, padding:"14px 22px", fontFamily:"Outfit, sans-serif", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:7, whiteSpace:"nowrap" as const, transition:"opacity .2s" }}>
                      ✦ Search with AI
                    </button>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:12 }}>
                    {["Cardiologist near downtown","Family doctor accepting new patients","Dentist open on weekends","Dermatologist with 4.5+ stars"].map(s => (
                      <span key={s} onClick={()=>setAiQuery(s)}
                        style={{ fontSize:12, color:"#1275ad", background:"rgba(18,117,173,0.06)", border:"1px solid rgba(18,117,173,0.15)", borderRadius:100, padding:"5px 13px", cursor:"pointer", fontWeight:500, transition:"all .18s" }}
                        onMouseEnter={e=>{(e.currentTarget as HTMLSpanElement).style.background="#1275ad";(e.currentTarget as HTMLSpanElement).style.color="white";}}
                        onMouseLeave={e=>{(e.currentTarget as HTMLSpanElement).style.background="rgba(18,117,173,0.06)";(e.currentTarget as HTMLSpanElement).style.color="#1275ad";}}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div style={{ display:"flex", gap:isMobile?24:40, justifyContent:"center", flexWrap:"wrap", alignItems:"center", marginTop:36 }}>
              {[{n:"1,000+",l:"Insurance plans"},{n:"1.6M+",l:"Providers"},{n:"10M+",l:"Reviews analyzed"}].map((s,i,arr) => (
                <div key={s.n} style={{ display:"flex", alignItems:"center", gap:isMobile?24:40 }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontFamily:"Outfit, sans-serif", fontWeight:800, fontSize:isMobile?22:26, color:"#071e34", lineHeight:1, letterSpacing:"-0.03em" }}>{s.n}</div>
                    <div style={{ fontSize:11.5, color:"#7a8fa0", marginTop:4, fontWeight:500 }}>{s.l}</div>
                  </div>
                  {i < arr.length-1 && !isMobile && <div style={{ width:1, height:36, background:"#D6E4EA" }}/>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── TOP CLINICS ──────────────────────────────────────────────────── */}
        {!showResults && (
          <div style={{ background:"#fff", padding:isMobile?"64px 16px":"88px 48px", borderBottom:"1px solid #EEF3F5" }}>
            <div style={{ maxWidth:1200, margin:"0 auto" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:12 }}>
                <div>
                  <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:C.blue, marginBottom:8 }}>Top-Rated Local Providers</div>
                  <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:isMobile?22:32, fontWeight:700, margin:0, color:"#071e34", letterSpacing:"-0.02em" }}>
                    Highly-rated{" "}
                    <em style={{ fontStyle:"italic", color:C.blue }}>clinics</em>
                    {" "}near you
                  </h2>
                </div>
                <button onClick={() => setShowResults(true)}
                  style={{ background:"#46c4d9", color:"#fff", border:"none", borderRadius:999, padding:"12px 28px", fontWeight:800, fontSize:13.5, cursor:"pointer", fontFamily:"inherit", flexShrink:0, letterSpacing:"0.4px", transition:"background .15s" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="#1275ad")}
                  onMouseLeave={e=>(e.currentTarget.style.background="#46c4d9")}>
                  View All Clinics
                </button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)", gap:18 }}>
                {[...PROVIDERS].sort((a,b)=>b.rating-a.rating).slice(0,4).map(p => (
                  <div key={p.id} onClick={()=>router.push(`/providers/${p.id}`)}
                    style={{ background:"#fff", border:"1px solid #D6E4EA", borderRadius:14, overflow:"hidden", cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,.06)", transition:"transform .15s, box-shadow .15s" }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)";(e.currentTarget as HTMLDivElement).style.boxShadow="0 8px 28px rgba(0,0,0,.12)";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.boxShadow="0 2px 10px rgba(0,0,0,.06)";}}>
                    <div style={{ height:140, background:"linear-gradient(135deg, #D4EFF7 0%, #E5F7FB 100%)", overflow:"hidden", position:"relative" }}>
                      {p.photo
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={p.photo} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                        : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ width:60, height:60, borderRadius:14, background:"#46c4d9", color:"#fff", fontWeight:800, fontSize:22, display:"flex", alignItems:"center", justifyContent:"center" }}>{p.image}</div></div>}
                      {p.contracted && (
                        <div style={{ position:"absolute", top:10, right:10, background:"#46c4d9", borderRadius:20, padding:"3px 9px", fontSize:10.5, fontWeight:700, color:"#fff" }}>Verified</div>
                      )}
                    </div>
                    <div style={{ padding:"14px 16px 16px" }}>
                      <div style={{ fontWeight:700, fontSize:13.5, marginBottom:6, color:"#0E1C26", lineHeight:1.3 }}>{p.name}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:3, marginBottom:8 }}>
                        {[1,2,3,4,5].map(star => (
                          <svg key={star} width="11" height="11" viewBox="0 0 24 24" fill={star <= Math.round(p.rating) ? "#f0c840" : "#D6E4EA"} stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                        ))}
                        <span style={{ fontSize:11.5, fontWeight:700, color:"#0E1C26", marginLeft:3 }}>{p.rating}</span>
                        <span style={{ fontSize:11, color:"#7a8fa0" }}>({p.reviews})</span>
                      </div>
                      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
                        {p.tags.slice(0,2).map(t => <span key={t} style={{ background:"rgba(18,117,173,0.07)", color:C.blue, fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:10, border:"1px solid rgba(18,117,173,0.15)" }}>{t}</span>)}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11.5, color:"#7a8fa0" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="2.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                        {p.city}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <div style={{ maxWidth:1200, margin:"0 auto", padding:isMobile?"64px 16px":"88px 48px 0" }}>

          {/* ── SPECIALTIES & PROCEDURES (always visible unless showing results) ── */}
          {!showResults && (
            <>
              {/* TWO-COLUMN CHIP GRID */}
              <div style={{ marginBottom:56 }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1px 1fr",
                  gap: isMobile ? 40 : 0,
                  alignItems: "start",
                }}>
                  {/* LEFT: Specialties */}
                  <div style={{ paddingRight: isMobile ? 0 : 48, margin: "0px 0px 45px" }}>
                    <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:C.blue, marginBottom:8 }}>
                      Browse by Specialty
                    </div>
                    <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:isMobile?20:26, fontWeight:700, marginBottom:24, color:"#071e34", lineHeight:1.2, letterSpacing:"-0.02em" }}>
                      Most popular{" "}
                      <em style={{ fontStyle:"italic", color:C.blue }}>specialties</em>
                    </h2>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
                      {SPECIALTY_CHIPS.map(chip => (
                        <button
                          key={chip.name}
                          onClick={() => { router.push(`/find-local-care/${chip.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`); }}
                          style={{
                            display:"flex", alignItems:"center", gap:7,
                            padding:"8px 14px", borderRadius:100,
                            border:`1.5px solid ${C.borderLt}`, background:"white",
                            cursor:"pointer", fontFamily:"inherit",
                            fontSize:13, fontWeight:600, color:C.text, transition:"all .2s",
                          }}
                          onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background=C.teal;b.style.color="white";b.style.borderColor=C.teal;const s=b.querySelector("svg");if(s)s.setAttribute("stroke","white");}}
                          onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background="white";b.style.color=C.text;b.style.borderColor=C.borderLt;const s=b.querySelector("svg");if(s)s.setAttribute("stroke","#46c4d9");}}>
                          {chip.icon}
                          {chip.name}
                          <span style={{ fontSize:11, fontWeight:600, background:"rgba(0,0,0,0.07)", padding:"2px 8px", borderRadius:100 }}>{chip.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vertical divider */}
                  {!isMobile && <div style={{ background:"#D6E4EA", alignSelf:"stretch" }}/>}

                  {/* RIGHT: Procedures */}
                  <div style={{ paddingLeft: isMobile ? 0 : 48, margin: "0px 0px 20px" }}>
                    <div style={{ fontFamily:"Outfit, sans-serif", fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:C.blue, marginBottom:8 }}>
                      Browse by Procedure
                    </div>
                    <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:isMobile?20:26, fontWeight:700, marginBottom:24, color:"#071e34", lineHeight:1.2, letterSpacing:"-0.02em" }}>
                      Most popular{" "}
                      <em style={{ fontStyle:"italic", color:C.blue }}>procedures</em>
                    </h2>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
                      {PROCEDURE_CHIPS.map(chip => (
                        <button
                          key={chip.name}
                          onClick={() => { setSearchQuery(chip.name); setShowResults(true); }}
                          style={{
                            display:"flex", alignItems:"center", gap:7,
                            padding:"8px 14px", borderRadius:100,
                            border:`1.5px solid ${C.borderLt}`, background:"white",
                            cursor:"pointer", fontFamily:"inherit",
                            fontSize:13, fontWeight:600, color:C.text, transition:"all .2s",
                          }}
                          onMouseEnter={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background=C.teal;b.style.color="white";b.style.borderColor=C.teal;const s=b.querySelector("svg");if(s)s.setAttribute("stroke","white");}}
                          onMouseLeave={e=>{const b=e.currentTarget as HTMLButtonElement;b.style.background="white";b.style.color=C.text;b.style.borderColor=C.borderLt;const s=b.querySelector("svg");if(s)s.setAttribute("stroke","#46c4d9");}}>
                          {chip.icon}
                          {chip.name}
                          <span style={{ fontSize:11, fontWeight:600, background:"rgba(0,0,0,0.07)", padding:"2px 8px", borderRadius:100 }}>{chip.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <SeoLinkGrid onProcedureClick={(proc) => { setSearchQuery(proc); setShowResults(true); }} />

              {/* ─── WHY US DARK SECTION ────────────────────────────────────── */}
              <section style={{
                background: "#071e34",
                padding: isMobile ? "64px 24px" : "88px 56px",
                marginBottom: "20px",
                overflow: "hidden",
                position: "relative",
                width: "100vw",
                left: "50%",
                transform: "translateX(-50%)",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                  pointerEvents: "none",
                }}/>
                <div style={{ position:"relative", textAlign:"center" }}>
                  <div style={{ fontFamily:"Outfit, sans-serif", fontSize:16, fontWeight:700, letterSpacing:"0.14em", color:C.teal, textTransform:"uppercase" as const, marginBottom:8 }}>
                    Why Hospital.com
                  </div>
                  <h2 style={{ fontFamily:"Outfit, sans-serif", fontSize:isMobile?24:34, fontWeight:700, color:"#fff", margin:"0 auto 40px", lineHeight:1.1, maxWidth:1040, letterSpacing:"-0.03em" }}>
                    Everything you need to find{" "}
                    <em style={{ fontStyle:"italic", color:C.teal }}>better care</em>
                  </h2>
                  <div style={{ marginBottom:52 }}>
                    <div style={{ fontSize:isMobile?56:76, fontWeight:900, color:"#fff", lineHeight:1, letterSpacing:"-2px" }}>1
                      <span style={{color:"#46c4d9"}}>M+</span>
                    </div>
                    <div style={{ fontSize:15.5, color:"rgba(255, 255, 255, 0.6)", marginTop:8, fontWeight:500 }}>
                      patients found care through Hospital.com last year
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:isMobile?"column":"row", alignItems:"stretch", maxWidth:1200, margin:"0 auto" }}>
                    {[
                      { icon:<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="9,12 11,14 15,10"/></svg>, title:"Verified Providers", desc:"Every provider is credentialed and background-checked." },
                      { icon:<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>, title:"Smarter Reviews", desc:"Smart, unified and summarized reviews." },
                      { icon:<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12h2m0 0V9m0 3v3" strokeLinecap="round"/><path d="M14 9h1a2 2 0 0 1 0 4h-1" strokeLinecap="round"/></svg>, title:"AI Navigator", desc:"Describe symptoms, get matched to the right specialist instantly." },
                      { icon:<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="9,12 11,14 15,10"/></svg>, title:"Other Benefit", desc:"Seamless booking with no calls or callbacks required." },
                    ].map((card, i) => (
                      <>
                        {i > 0 && !isMobile && (
                          <div key={`div-${i}`} style={{ width:1, background:"rgba(255,255,255,.15)", flexShrink:0, alignSelf:"stretch" }}/>
                        )}
                        <div key={card.title} style={{
                          flex:1, padding:isMobile?"22px 16px 20px":"36px 32px 32px",
                          display:"flex", flexDirection:"column" as const, alignItems:"center", textAlign:"center" as const, gap:14,
                          borderBottom: isMobile && i < 3 ? "1px solid rgba(255,255,255,.15)" : "none",
                        }}>
                          <div>{card.icon}</div>
                          <div style={{ fontSize:17, fontWeight:800, color:"#fff" }}>{card.title}</div>
                          <p style={{ fontSize:12.5, color:"rgba(255,255,255,.5)", lineHeight:1.65, margin:0 }}>{card.desc}</p>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* ── RESULTS ── */}
          {showResults && (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:8 }}>
                <div>
                  <h2 style={{ fontSize:22, fontWeight:800, margin:0, color:"#0E1C26" }}>Doctors & Specialists</h2>
                  <p style={{ color:"#7a8fa0", fontSize:13.5, margin:"4px 0 0" }}>Filter by specialty, location, or insurance to narrow your results</p>
                </div>
                <button onClick={() => setShowResults(false)}
                  style={{ background:"#F0F3F5", color:"#7a8fa0", border:"none", borderRadius:22, padding:"8px 18px", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
                  Back
                </button>
              </div>

              {/* Inline filters */}
              <div style={{ background:"#fff", border:"1px solid #D6E4EA", borderRadius:16, padding:"18px 20px", marginBottom:20, boxShadow:"0 1px 8px rgba(0,0,0,.04)" }}>
                {/* Row 1: search + button */}
                <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
                  <div style={{ flex:2, minWidth:180, display:"flex", alignItems:"center", gap:8, background:"#F0F3F5", borderRadius:22, padding:"9px 16px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a8fa0" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Doctor name, specialty, or condition…"
                      style={{ flex:1, border:"none", outline:"none", fontSize:13.5, fontFamily:"inherit", background:"transparent", color:"#0E1C26" }}/>
                  </div>
                  <button onClick={handleHeroSearch}
                    style={{ background:"#46c4d9", color:"#fff", border:"none", borderRadius:22, padding:"9px 24px", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit", transition:"background .15s" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="#1275ad")}
                    onMouseLeave={e=>(e.currentTarget.style.background="#46c4d9")}>
                    Search
                  </button>
                </div>

                {/* Row 2: custom dropdowns + rating */}
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginBottom:12 }}>

                  {/* Specialty */}
                  <div onMouseDown={e=>e.stopPropagation()} style={{ position:"relative" as const }}>
                    <div onClick={() => setOpenDropdown(openDropdown==="fs"?null:"fs")}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", border:`1.5px solid ${openDropdown==="fs"?"#46c4d9":"#D6E4EA"}`, borderRadius:22, fontSize:12, color: specialty==="All"?"#7a8fa0":"#0E1C26", background:"#fff", cursor:"pointer", fontWeight:500, userSelect:"none" as const, whiteSpace:"nowrap" as const, transition:"border-color .15s" }}>
                      {specialty==="All"?"All Specialties":specialty}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7a8fa0" strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .2s", transform: openDropdown==="fs"?"rotate(180deg)":"rotate(0deg)" }}><polyline points="6,9 12,15 18,9"/></svg>
                    </div>
                    {openDropdown==="fs" && (
                      <div style={{ position:"absolute" as const, top:"calc(100% + 6px)", left:0, minWidth:155, background:"#fff", borderRadius:16, boxShadow:"0 16px 48px rgba(0,0,0,.13)", border:"1.5px solid #D6E4EA", zIndex:1000, overflow:"hidden" as const, animation:"dropFade .18s ease" }}>
                        <div className="dd-scroll" style={{ padding:"8px 0", maxHeight:260, overflowY:"auto" as const }}>
                          {["All","Acupuncture","Cardiology","Dentistry","Dermatology","Ophthalmology","Orthopedics","Psychiatry","Pediatrics","Family Medicine","Urgent Care","Gastroenterology","OB-GYN","Medical Aesthetics"].map(s => (
                            <div key={s} className="dd-opt" onClick={() => { setSpecialty(s); setOpenDropdown(null); }}
                              style={{ padding:"8px 16px", fontSize:9, cursor:"pointer", display:"flex", alignItems:"center", gap:8,
                                color: specialty===s?"#46c4d9":"#0E1C26", fontWeight: specialty===s?700:400,
                                background: specialty===s?"rgba(70,196,217,.08)":"transparent" }}>
                              {specialty===s && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                              {s==="All"?"All Specialties":s}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* City */}
                  <div onMouseDown={e=>e.stopPropagation()} style={{ position:"relative" as const }}>
                    <div onClick={() => setOpenDropdown(openDropdown==="fc"?null:"fc")}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", border:`1.5px solid ${openDropdown==="fc"?"#46c4d9":"#D6E4EA"}`, borderRadius:22, fontSize:12, color: city==="All"?"#7a8fa0":"#0E1C26", background:"#fff", cursor:"pointer", fontWeight:500, userSelect:"none" as const, whiteSpace:"nowrap" as const, transition:"border-color .15s" }}>
                      {city==="All"?"All Cities":city}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7a8fa0" strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .2s", transform: openDropdown==="fc"?"rotate(180deg)":"rotate(0deg)" }}><polyline points="6,9 12,15 18,9"/></svg>
                    </div>
                    {openDropdown==="fc" && (
                      <div style={{ position:"absolute" as const, top:"calc(100% + 6px)", left:0, minWidth:160, background:"#fff", borderRadius:16, boxShadow:"0 16px 48px rgba(0,0,0,.13)", border:"1.5px solid #D6E4EA", zIndex:1000, overflow:"hidden" as const, animation:"dropFade .18s ease" }}>
                        <div className="dd-scroll" style={{ padding:"8px 0" }}>
                          {["All",...ALL_CITIES].map(c => (
                            <div key={c} className="dd-opt" onClick={() => { setCity(c); setOpenDropdown(null); }}
                              style={{ padding:"8px 16px", fontSize:9, cursor:"pointer", display:"flex", alignItems:"center", gap:8,
                                color: city===c?"#46c4d9":"#0E1C26", fontWeight: city===c?700:400,
                                background: city===c?"rgba(70,196,217,.08)":"transparent" }}>
                              {city===c && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                              {c==="All"?"All Cities":c}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Insurance (nested) */}
                  <div onMouseDown={e=>e.stopPropagation()} style={{ position:"relative" as const }}>
                    <div onClick={() => setOpenDropdown(openDropdown==="fi"?null:"fi")}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", border:`1.5px solid ${openDropdown==="fi"?"#46c4d9":"#D6E4EA"}`, borderRadius:22, fontSize:12, color: filterInsurance==="All"?"#7a8fa0":"#0E1C26", background:"#fff", cursor:"pointer", fontWeight:500, userSelect:"none" as const, whiteSpace:"nowrap" as const, transition:"border-color .15s" }}>
                      {filterInsurance==="All"?"All Insurance":filterInsurance}
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7a8fa0" strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .2s", transform: openDropdown==="fi"?"rotate(180deg)":"rotate(0deg)" }}><polyline points="6,9 12,15 18,9"/></svg>
                    </div>
                    {openDropdown==="fi" && (
                      <div style={{ position:"absolute" as const, top:"calc(100% + 6px)", left:0, minWidth:185, background:"#fff", borderRadius:16, boxShadow:"0 16px 48px rgba(0,0,0,.13)", border:"1.5px solid #D6E4EA", zIndex:1000, overflow:"hidden" as const, animation:"dropFade .18s ease" }}>
                        <div className="dd-scroll" style={{ padding:"8px 0", maxHeight:300, overflowY:"auto" as const }}>
                          <div className="dd-opt" onClick={() => { setFilterInsurance("All"); setFilterInsExp(null); setOpenDropdown(null); }}
                            style={{ padding:"8px 16px", fontSize:9, cursor:"pointer", display:"flex", alignItems:"center", gap:8,
                              color: filterInsurance==="All"?"#46c4d9":"#0E1C26", fontWeight: filterInsurance==="All"?700:400,
                              background: filterInsurance==="All"?"rgba(70,196,217,.08)":"transparent" }}>
                            {filterInsurance==="All" && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                            Any Insurance
                          </div>
                          {INSURANCE_CARRIERS.map(c => {
                            const carrierActive = filterInsurance===c.name || c.plans.includes(filterInsurance);
                            const expanded = filterInsExp === c.name;
                            return (
                              <div key={c.name}>
                                <div onClick={() => setFilterInsExp(expanded ? null : c.name)}
                                  style={{ padding:"8px 16px", fontSize:9, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8,
                                    color: carrierActive?"#46c4d9":"#0E1C26", fontWeight:600,
                                    background: carrierActive?"rgba(70,196,217,.06)":"transparent" }}>
                                  <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                                    {carrierActive && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                                    {c.name}
                                  </span>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7a8fa0" strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .15s", transform: expanded?"rotate(180deg)":"rotate(0deg)" }}><polyline points="6,9 12,15 18,9"/></svg>
                                </div>
                                {expanded && c.plans.map(plan => (
                                  <div key={plan} className="dd-opt" onClick={() => { setFilterInsurance(plan); setOpenDropdown(null); }}
                                    style={{ padding:"7px 16px 7px 30px", fontSize:9, cursor:"pointer", display:"flex", alignItems:"center", gap:8,
                                      color: filterInsurance===plan?"#46c4d9":"#7a8fa0", fontWeight: filterInsurance===plan?700:400,
                                      background: filterInsurance===plan?"rgba(70,196,217,.08)":"transparent" }}>
                                    {filterInsurance===plan && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#46c4d9" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                                    {plan}
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                    <span style={{ fontSize:10.5, fontWeight:700, color:"#7a8fa0", whiteSpace:"nowrap" as const }}>RATING</span>
                    {[{l:"Any",v:0},{l:"4+",v:4},{l:"4.5+",v:4.5}].map(r => (
                      <button key={r.l} onClick={() => setMinRating(r.v)}
                        style={{ padding:"5px 12px", border:`1.5px solid ${minRating===r.v?"#46c4d9":"#D6E4EA"}`, borderRadius:20, background:minRating===r.v?"rgba(70,196,217,.1)":"#fff", color:minRating===r.v?"#46c4d9":"#7a8fa0", fontSize:12, cursor:"pointer", fontWeight:minRating===r.v?700:400, fontFamily:"inherit" }}>
                        {r.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 3: amenity checkboxes */}
                <div style={{ display:"flex", gap:16, flexWrap:"wrap", alignItems:"center", paddingTop:10, borderTop:"1px solid #EAF1F4" }}>
                  <span style={{ fontSize:10.5, fontWeight:700, color:"#7a8fa0", whiteSpace:"nowrap" as const }}>AMENITIES</span>
                  {["Wheelchair Accessible","Parking","Wi-Fi","Private Rooms"].map(a => {
                    const checked = filterAmenities.includes(a);
                    return (
                      <label key={a} onClick={() => setFilterAmenities(prev => checked ? prev.filter(x=>x!==a) : [...prev, a])}
                        style={{ display:"flex", alignItems:"center", gap:7, cursor:"pointer", userSelect:"none" as const }}>
                        <div style={{
                          width:16, height:16, borderRadius:5,
                          border:`1.5px solid ${checked?"#46c4d9":"#D6E4EA"}`,
                          background: checked?"#46c4d9":"#fff",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          flexShrink:0, transition:"all .15s",
                        }}>
                          {checked && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"><polyline points="20,6 9,17 4,12"/></svg>}
                        </div>
                        <span style={{ fontSize:12.5, color: checked?"#0E1C26":"#7a8fa0", fontWeight: checked?600:400 }}>{a}</span>
                      </label>
                    );
                  })}
                  {filterAmenities.length > 0 && (
                    <button onClick={() => setFilterAmenities([])}
                      style={{ fontSize:11.5, color:"#7a8fa0", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", padding:0, textDecoration:"underline" }}>
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
                <div style={{ display:"flex", gap:3, background:"#F0F3F5", borderRadius:11, padding:3 }}>
                  {[{key:"all",label:"All Providers"},{key:"bookmarked",label:`Bookmarked (${bookmarks.length})`}].map(t => (
                    <button key={t.key} onClick={() => { if(t.key==="bookmarked"&&!isLoggedIn){router.push("/signup");return;} setViewTab(t.key); }}
                      style={{ padding:"7px 18px", border:"none", borderRadius:9, background:viewTab===t.key?"#fff":"transparent", fontWeight:viewTab===t.key?700:400, fontSize:13, cursor:"pointer", color:viewTab===t.key?"#0E1C26":"#7a8fa0", boxShadow:viewTab===t.key?"0 1px 4px rgba(0,0,0,.08)":"none", whiteSpace:"nowrap" as const, fontFamily:"inherit" }}>
                      {t.label}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize:12.5, color:"#7a8fa0" }}>{filtered.length} provider{filtered.length!==1?"s":""} found</span>
              </div>

              <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                {/* Provider list */}
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:14, minWidth:0 }}>
                  {filtered.map(p => <ProviderCard key={p.id} provider={p} bookmarks={bookmarks} toggleBookmark={toggleBookmark} isLoggedIn={isLoggedIn}/>)}
                  {filtered.length === 0 && (
                    <div style={{ textAlign:"center", padding:48, color:"#7a8fa0", background:"#F0F3F5", borderRadius:14 }}>
                      No providers found. Try adjusting your search or filters.
                    </div>
                  )}
                </div>

                {/* Demo map panel */}
                {!isMobile && (
                  <div style={{ width:420, flexShrink:0, position:"sticky", top:80, borderRadius:20, overflow:"hidden", border:"1px solid #D6E4EA", boxShadow:"0 4px 24px rgba(0,0,0,.08)", height:600 }}>
                    {/* Map background */}
                    <div style={{ position:"relative", width:"100%", height:"100%", background:"#e8f0e8" }}>
                      {/* Street grid */}
                      <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }} viewBox="0 0 420 600" preserveAspectRatio="none">
                        {/* Horizontal streets */}
                        {[80,160,240,320,420,500].map(y => <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="#fff" strokeWidth="10" opacity="0.7"/>)}
                        {[130,210,290,370,460].map(y => <line key={y+1000} x1="0" y1={y} x2="420" y2={y} stroke="#fff" strokeWidth="5" opacity="0.5"/>)}
                        {/* Vertical streets */}
                        {[70,140,210,280,350].map(x => <line key={x} x1={x} y1="0" x2={x} y2="600" stroke="#fff" strokeWidth="10" opacity="0.7"/>)}
                        {[105,175,245,315,385].map(x => <line key={x+1000} x1={x} y1="0" x2={x} y2="600" stroke="#fff" strokeWidth="5" opacity="0.5"/>)}
                        {/* Park block */}
                        <rect x="145" y="165" width="120" height="90" rx="4" fill="#c8dfc8" opacity="0.8"/>
                        {/* Water */}
                        <rect x="280" y="320" width="140" height="80" rx="4" fill="#b8d4e8" opacity="0.6"/>
                        {/* Building blocks */}
                        {[[15,20,50,55],[85,20,50,55],[155,20,50,55],[225,20,50,55],[295,20,50,55],[365,20,50,55],
                          [15,95,50,60],[85,95,50,60],[225,95,50,60],[295,95,50,60],[365,95,50,60],
                          [15,175,50,55],[85,175,50,55],[280,175,50,55],[350,175,50,55],
                          [15,265,50,55],[85,265,50,55],[155,265,50,55],[225,265,50,55],
                          [15,345,50,55],[85,345,50,55],[155,345,50,55],[225,345,50,55],
                          [15,425,50,55],[85,425,50,55],[155,425,50,55],[225,425,50,55],[295,425,50,55],[365,425,50,55],
                          [15,505,50,55],[85,505,50,55],[155,505,50,55],[225,505,50,55],[295,505,50,55],[365,505,50,55],
                        ].map(([x,y,w,h],i) => <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#d4d8cc" opacity="0.7"/>)}
                      </svg>
                      {/* Provider pins */}
                      {filtered.slice(0,7).map((p, i) => {
                        const positions = [[90,110],[200,80],[310,200],[130,300],[260,340],[60,420],[350,130]];
                        const [px, py] = positions[i] || [200,300];
                        return (
                          <div key={p.id} style={{ position:"absolute", left:px, top:py, transform:"translate(-50%,-100%)", cursor:"pointer", zIndex:10 }}>
                            <div style={{ background:p.contracted?"#46c4d9":"#1275ad", color:"#fff", borderRadius:"12px 12px 12px 2px", padding:"5px 9px", fontSize:11, fontWeight:700, whiteSpace:"nowrap", boxShadow:"0 3px 10px rgba(0,0,0,.2)", border:"2px solid #fff" }}>
                              {p.name.split(" ").slice(-1)[0]}
                              <div style={{ fontSize:10, fontWeight:600, opacity:0.9 }}>⭐ {p.rating}</div>
                            </div>
                          </div>
                        );
                      })}
                      {/* Map controls */}
                      <div style={{ position:"absolute", bottom:16, right:16, display:"flex", flexDirection:"column", gap:4 }}>
                        {["+","−"].map(c => (
                          <button key={c} style={{ width:32, height:32, background:"#fff", border:"1px solid #D6E4EA", borderRadius:8, fontWeight:700, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px rgba(0,0,0,.1)", fontFamily:"inherit" }}>{c}</button>
                        ))}
                      </div>
                      {/* Attribution */}
                      <div style={{ position:"absolute", bottom:8, left:12, fontSize:10, color:"#7a8fa0", background:"rgba(255,255,255,.8)", padding:"2px 6px", borderRadius:4 }}>Demo map</div>
                    </div>
                  </div>
                )}
              </div>

              <SeoLinkGrid onProcedureClick={(proc) => setSearchQuery(proc)} />
            </>
          )}
        </div>

        {/* ─── PROVIDER CTA (only in browse mode) ───────────────────────────── */}
        {!showResults && (
          <div style={{ padding:isMobile?"0 16px 40px":"0", margin:"0 auto" }}>
            <div style={{ borderRadius:20, padding:isMobile?"0 28px 48px":"0px 56px 50px", position:"relative", overflow:"hidden", textAlign:"center" }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize:"24px 24px", pointerEvents:"none" }}/>
              <div style={{ position:"relative", maxWidth:600, margin:"0 auto" }}>
                <div style={{ display:"inline-flex", alignItems:"center", borderRadius:20, padding:"40px 15px 18px", fontSize:14, fontWeight:800, color:"#46c4d9", letterSpacing:"1px", textTransform:"uppercase" as const, marginBottom:20, marginTop:0 }}>
                  FOR PROVIDERS
                </div>
                <h3 style={{ color:"#13527a", fontSize:isMobile?26:36, fontWeight:900, marginBottom:14, lineHeight:1.25 }}>
                  Grow your practice.<br/>
                  Reach patients who{" "}
                  <span style={{ color:"#46c4d9", textDecoration:"underline", textDecorationColor:"#46c4d9" }}>need you.</span>
                </h3>
                <p style={{ color:"#13527a", fontSize:isMobile?13.5:16, margin:"0 auto 32px", lineHeight:1.8, maxWidth:660 }}>
                  Join thousands of verified providers using Hospital.com — get discovered,
                  fill your calendar, and build lasting patient relationships, all in one place.
                </p>
                <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
                  <button onClick={() => router.push("/become-provider")}
                    style={{ background:"#46c4d9", color:"#fff", border:"none", borderRadius:50, padding:"14px 34px", fontWeight:800, fontSize:14, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 20px rgba(70,196,217,.4)", transition:"background .15s, transform .15s" }}
                    onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background="#1275ad"; (e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)"; }}
                    onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background="#46c4d9"; (e.currentTarget as HTMLButtonElement).style.transform="translateY(0)"; }}>
                    Join Hospital.com
                  </button>
                  <button onClick={() => router.push("/become-provider")}
                    style={{ background:"transparent", color:"#46c4d9", border:"1.5px solid #46c4d9", borderRadius:50, padding:"14px 28px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", transition:"background .15s, color .15s, transform .15s" }}
                    onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background="#46c4d9"; (e.currentTarget as HTMLButtonElement).style.color="#fff"; (e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)"; }}
                    onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background="transparent"; (e.currentTarget as HTMLButtonElement).style.color="#46c4d9"; (e.currentTarget as HTMLButtonElement).style.transform="translateY(0)"; }}>
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ height:48 }}/>
        <Footer />
      </div>
    </>
  );
}