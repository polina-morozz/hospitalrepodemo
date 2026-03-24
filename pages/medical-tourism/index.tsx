import { useState, ChangeEvent } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import C from "@/lib/tokens";
import useIsMobile from "@/lib/hooks/useIsMobile";
import Footer from "@/components/layout/Footer";
import FacilitatorModal from "@/components/modals/FacilitatorModal";

// ─── GLOBAL HEALTH SERVICES / MEDICAL TOURISM PAGE ────────────────────────────
// TODO(backend): GET /api/medical-tourism?country=&procedure=&search= — returns clinic list
// TODO(backend): POST /api/medical-tourism/consultation — free consultation form submission

// ─── INTERFACES ───────────────────────────────────────────────────────────────
interface IntlClinic {
  id: number;
  name: string;
  country: string;
  city: string;
  flag: string;
  procedures: string[];
  description: string;
  image: string;
  rating: number;
  reviews: number;
}

interface HowStep {
  num: string;
  title: string;
  desc: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (SelectOption | string)[];
  minWidth?: number;
}

interface FieldInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

interface FormData {
  phone: string;
  contactMethod: string;
  name: string;
  description: string;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const INTL_CLINICS: IntlClinic[] = [
  { id:101, name:"Estetik International", country:"Turkey", city:"Istanbul", flag:"🇹🇷", procedures:["Hair Transplant","Rhinoplasty","Liposuction","Dental Veneers"], description:"One of Turkey's largest accredited medical aesthetic centers, recognized internationally for hair restoration and cosmetic surgery with over 20 years of experience.", image:"EI", rating:4.8, reviews:1240 },
  { id:102, name:"Bumrungrad International", country:"Thailand", city:"Bangkok", flag:"🇹🇭", procedures:["Cardiac Surgery","Orthopedics","Oncology","General Surgery"], description:"A JCI-accredited hospital recognized among Asia's leading medical centers, treating over 1.1 million patients annually including 520,000 international patients.", image:"BI", rating:4.9, reviews:3100 },
  { id:103, name:"Charité – Universitätsmedizin", country:"Germany", city:"Berlin", flag:"🇩🇪", procedures:["Neurology","Cancer Treatment","Cardiac Surgery","Rare Diseases"], description:"Germany's largest university hospital and one of Europe's most prestigious medical institutions, offering cutting-edge diagnostics and specialist treatments.", image:"CH", rating:4.9, reviews:890 },
  { id:104, name:"Apollo Hospitals", country:"India", city:"Chennai", flag:"🇮🇳", procedures:["Cardiac Surgery","Bone Marrow Transplant","Liver Transplant","Orthopedics"], description:"India's largest healthcare group, JCI-accredited, providing world-class tertiary care at significantly lower costs than Western countries.", image:"AH", rating:4.7, reviews:2700 },
  { id:105, name:"Quirónsalud Barcelona", country:"Spain", city:"Barcelona", flag:"🇪🇸", procedures:["IVF","Dental Implants","Orthopedics","Ophthalmology"], description:"Spain's leading private hospital group offering fertility treatments, dental care, and surgical procedures with multilingual staff across 50+ centers.", image:"QB", rating:4.6, reviews:640 },
  { id:106, name:"Samsung Medical Center", country:"South Korea", city:"Seoul", flag:"🇰🇷", procedures:["Cancer Treatment","Robotic Surgery","Cardiology","Stem Cell Therapy"], description:"One of Asia's top-ranked hospitals known for advanced robotic surgery and cancer treatment programs, consistently ranked among the world's best.", image:"SM", rating:4.9, reviews:1870 },
  { id:107, name:"Medicover Dental Warsaw", country:"Poland", city:"Warsaw", flag:"🇵🇱", procedures:["Dental Implants","Veneers","Full Mouth Rehabilitation","Orthodontics"], description:"Premium dental care clinic offering European-standard treatments at 40–60% lower cost than the UK, US, or Canada, with English-speaking staff.", image:"MD", rating:4.7, reviews:520 },
  { id:108, name:"Clinique des Cèdres", country:"France", city:"Toulouse", flag:"🇫🇷", procedures:["Bariatric Surgery","Cardiac Surgery","Orthopedics","Neurosurgery"], description:"Internationally recognized French private hospital offering specialist surgeries with state-of-the-art facilities and post-operative rehabilitation programs.", image:"CC", rating:4.8, reviews:390 },
];

const CLINIC_GRADIENTS: string[] = [
  "linear-gradient(135deg,#0a4a5a,#1a7a8a)",
  "linear-gradient(135deg,#4a1a0a,#8a4a1a)",
  "linear-gradient(135deg,#1a1a4a,#2a2a8a)",
  "linear-gradient(135deg,#2a0a0a,#5a1a1a)",
  "linear-gradient(135deg,#1a4a1a,#2a8a3a)",
  "linear-gradient(135deg,#3a1a4a,#6a2a8a)",
  "linear-gradient(135deg,#0a3a4a,#1a6a7a)",
  "linear-gradient(135deg,#4a3a0a,#8a6a1a)",
];

const HOW_STEPS: HowStep[] = [
  { num:"1", title:"Submit a Request", desc:"Tell us about the procedure you need and your preferences." },
  { num:"2", title:"We Review Your Case", desc:"Our medical coordinators study your request and identify the best options." },
  { num:"3", title:"Get Matched", desc:"We recommend the best hospital and specialist for your case." },
  { num:"4", title:"Plan Your Trip", desc:"We help arrange your treatment program, travel, and accommodation." },
  { num:"5", title:"24/7 Support", desc:"Our coordinator stays in touch throughout your entire treatment." },
  { num:"6", title:"Aftercare", desc:"We follow your recovery and stay connected even after you return home." },
];

const CERTIFICATIONS: string[] = ["ISO","JCI","ESMO","OECI","EFQM","DKG","ADA","ISAPS"];
const GLOBAL_SPECIALTIES: string[] = ["Plastic Surgery","Dental","Cardiac Surgery","Orthopedics","Ophthalmology","Oncology","Fertility / IVF","Hair Transplant","Neurology","Bariatric Surgery","Dermatology","Urology"];
const GLOBAL_PROCEDURES: string[] = ["Hair Transplant","Rhinoplasty","Dental Implants","Liposuction","LASIK","IVF","Knee Replacement","Cardiac Surgery","Veneers","Bariatric Surgery","Facelift","Stem Cell Therapy"];

// ─── SELECT COMPONENT ─────────────────────────────────────────────────────────
function Select({ value, onChange, options, minWidth }: SelectProps) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => (typeof o === "string" ? o : o.value) === value);
  const label = current ? (typeof current === "string" ? current : current.label) : "Select…";
  return (
    <div style={{ position:"relative", minWidth: minWidth || 120 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, padding:"8px 12px 8px 14px", border:`1.5px solid ${open?C.teal:C.border}`, borderRadius:22, background:open?C.tealLt:C.white, cursor:"pointer", fontSize:13, fontWeight:500, color:open?C.teal:C.textMd, fontFamily:"inherit", transition:"all .15s", whiteSpace:"nowrap" }}>
        <span>{label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .18s", transform:open?"rotate(180deg)":"rotate(0deg)" }}><polyline points="6,9 12,15 18,9"/></svg>
      </button>
      {open && (
        <div className="fade-up" style={{ position:"absolute", top:"calc(100% + 6px)", left:0, minWidth:"100%", background:C.white, border:`1px solid ${C.border}`, borderRadius:16, boxShadow:"0 12px 36px rgba(0,0,0,.12)", zIndex:999, overflow:"hidden", padding:"6px" }}>
          {options.map(o => {
            const val = typeof o === "string" ? o : o.value;
            const lbl = typeof o === "string" ? o : o.label;
            const selected = val === value;
            return (
              <button key={val} onClick={() => { onChange(val); setOpen(false); }}
                style={{ display:"flex", alignItems:"center", gap:8, width:"100%", textAlign:"left", padding:"10px 14px", background:selected?C.tealLt:"transparent", color:selected?C.teal:C.text, fontWeight:selected?700:500, fontSize:13, border:"none", borderRadius:11, cursor:"pointer", fontFamily:"inherit" }}
                onMouseEnter={e=>{if(!selected) (e.currentTarget as HTMLButtonElement).style.background=C.gray;}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=selected?C.tealLt:"transparent";}}>
                {selected && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                {lbl}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── FIELD INPUT COMPONENT ────────────────────────────────────────────────────
function FieldInput({ label, type = "text", value, onChange, placeholder }: FieldInputProps) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:14, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
        onFocus={e => (e.target as HTMLInputElement).style.borderColor = C.teal} onBlur={e => (e.target as HTMLInputElement).style.borderColor = C.border} />
    </div>
  );
}

// ─── PAGE COMPONENT ───────────────────────────────────────────────────────────
export default function MedicalTourismPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [country, setCountry] = useState("All");
  const [procedure, setProcedure] = useState("All");
  const [search, setSearch] = useState("");
  const [facilitatorModal, setFacilitatorModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<IntlClinic | null>(null);
  const [formData, setFormData] = useState<FormData>({ phone:"", contactMethod:"", name:"", description:"" });
  const [formSent, setFormSent] = useState(false);

  const allCountries = ["All", ...Array.from(new Set(INTL_CLINICS.map(c => c.country)))];
  const allProcedures = ["All", ...Array.from(new Set(INTL_CLINICS.flatMap(c => c.procedures)))];

  const filtered = INTL_CLINICS.filter(c =>
    (country === "All" || c.country === country) &&
    (procedure === "All" || c.procedures.includes(procedure)) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()) || c.procedures.some(p => p.toLowerCase().includes(search.toLowerCase())))
  );

  const handleSubmit = () => {
    // TODO(backend): POST /api/medical-tourism/consultation with formData
    setFormSent(true);
  };

  return (
    <>
      <Head>
        <title>Global Health Services – Medical Tourism | Hospital.com</title>
        <meta name="description" content="Connect with certified international clinics. Save 40–80% on procedures abroad with Hospital.com's vetted global network." />
        <meta property="og:title" content="Global Health Services | Hospital.com" />
        <link rel="canonical" href="https://www.hospital.com/medical-tourism" />
      </Head>

      <div style={{ minHeight:"calc(100vh - 58px)", background:C.white }}>
        {/* HERO */}
        <div style={{ background:"linear-gradient(135deg,#0E1C26 0%,#1a3a4a 100%)", padding:isMobile?"48px 20px":"80px 40px", textAlign:"center", color:"#fff" }}>
          <h1 style={{ fontSize:isMobile?26:42, fontWeight:800, marginBottom:14, letterSpacing:"-.5px" }}>
            World-Class Treatment <span style={{ color:C.teal }}>Abroad</span>
          </h1>
          <p style={{ color:"#94A3B8", fontSize:isMobile?14:17, maxWidth:560, margin:"0 auto", lineHeight:1.6 }}>
            Connect with certified clinics worldwide. Save 40–80% on procedures with our vetted global network.
          </p>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ padding:isMobile?"36px 16px":"60px 16px", background:C.offWhite }}>
          <div style={{ maxWidth:1000, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <h2 style={{ fontSize:isMobile?20:26, fontWeight:800, letterSpacing:"-.3px", marginBottom:6 }}>How Does It Work?</h2>
              <p style={{ color:C.textSm, fontSize:isMobile?13:15 }}>Our team guides you through every step of your medical journey</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3, 1fr)", gap:16 }}>
              {HOW_STEPS.map(s => (
                <div key={s.num} style={{ background:C.white, borderRadius:16, padding:"24px 20px", display:"flex", gap:14, alignItems:"flex-start", boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, color:C.teal, flexShrink:0 }}>{s.num}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:5 }}>{s.title}</div>
                    <div style={{ color:C.textSm, fontSize:13, lineHeight:1.6 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FREE SERVICE CTA */}
        <div style={{ padding:isMobile?"32px 16px":"48px 16px", background:C.tealBg }}>
          <div style={{ maxWidth:800, margin:"0 auto", display:"flex", alignItems:isMobile?"stretch":"center", gap:24, flexDirection:isMobile?"column":"row" }}>
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:isMobile?20:26, fontWeight:800, marginBottom:10 }}>Hospital.com service is <span style={{ color:C.teal }}>absolutely free.</span></h2>
              <p style={{ color:C.textSm, fontSize:14, lineHeight:1.65, marginBottom:18 }}>You pay the same rates for treatment as in the clinic&apos;s original price list. We earn from the clinic — not from you.</p>
              <button className="btn-primary" onClick={() => setFacilitatorModal(true)}
                style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"12px 28px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>
                Find a Solution
              </button>
            </div>
            <div style={{ width:isMobile?"100%":200, height:isMobile?140:180, borderRadius:18, background:"linear-gradient(135deg,#0E1C26,#1a3a4a)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
        </div>

        {/* CONSULTATION FORM */}
        <div style={{ padding:isMobile?"36px 16px":"60px 16px", background:C.white }}>
          <div style={{ maxWidth:500, margin:"0 auto", background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:20, padding:"28px 24px" }}>
            <h3 style={{ fontWeight:800, fontSize:18, textAlign:"center", marginBottom:6 }}>Get a Free Consultation</h3>
            <p style={{ color:C.textSm, fontSize:13, textAlign:"center", marginBottom:20 }}>Fill out the form and our coordinator will contact you within 24 hours.</p>
            {formSent ? (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ width:48, height:48, borderRadius:"50%", background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                </div>
                <div style={{ fontWeight:700, fontSize:16 }}>Request Sent!</div>
                <p style={{ color:C.textSm, fontSize:13, marginTop:6 }}>We&apos;ll be in touch within 24 hours.</p>
              </div>
            ) : (
              <>
                <FieldInput label="Phone Number" type="tel" value={formData.phone} onChange={(e: ChangeEvent<HTMLInputElement>)=>setFormData(p=>({...p,phone:e.target.value}))} placeholder="+1 000-000-0000" />
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Best way to contact you</label>
                  <Select value={formData.contactMethod||"select"} onChange={v=>setFormData(p=>({...p,contactMethod:v==="select"?"":v}))} minWidth={0}
                    options={[{value:"select",label:"Select…"},{value:"phone",label:"Phone"},{value:"email",label:"Email"},{value:"whatsapp",label:"WhatsApp"}]}/>
                </div>
                <FieldInput label="Your Name" value={formData.name} onChange={(e: ChangeEvent<HTMLInputElement>)=>setFormData(p=>({...p,name:e.target.value}))} placeholder="Enter your name" />
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Short Description</label>
                  <textarea value={formData.description} onChange={(e: ChangeEvent<HTMLTextAreaElement>)=>setFormData(p=>({...p,description:e.target.value}))} placeholder="Describe your medical needs…" rows={3}
                    style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:14, outline:"none", fontFamily:"inherit", resize:"vertical", color:C.text, boxSizing:"border-box" }}
                    onFocus={e=>(e.target as HTMLTextAreaElement).style.borderColor=C.teal} onBlur={e=>(e.target as HTMLTextAreaElement).style.borderColor=C.border}/>
                </div>
                <button className="btn-primary" onClick={handleSubmit}
                  style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:28, padding:"13px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>
                  Book Appointment
                </button>
              </>
            )}
          </div>
        </div>

        {/* TOP-RATED HOSPITALS */}
        <div style={{ padding:isMobile?"32px 16px":"52px 16px", background:C.offWhite }}>
          <div style={{ maxWidth:1000, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <h2 style={{ fontSize:isMobile?20:26, fontWeight:800, marginBottom:6 }}>Top-Rated Hospitals & Clinics</h2>
              <p style={{ color:C.textSm, fontSize:isMobile?13:15 }}>We only feature certified and accredited medical institutions</p>
            </div>

            {/* Certifications */}
            <div style={{ display:"flex", gap:isMobile?8:14, justifyContent:"center", flexWrap:"wrap", marginBottom:20 }}>
              {CERTIFICATIONS.map(cert => (
                <div key={cert} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:60 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 6px", fontWeight:800, fontSize:10, color:C.teal }}>{cert.slice(0,2)}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.textMd }}>{cert}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
              <div style={{ flex:1, minWidth:200 }}>
                <input value={search} onChange={(e: ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value)} placeholder="Search clinics, countries, procedures…"
                  style={{ width:"100%", padding:"9px 16px", border:`1.5px solid ${C.border}`, borderRadius:22, fontSize:13.5, outline:"none", fontFamily:"inherit", background:C.white, transition:"border-color .2s", boxSizing:"border-box" }}
                  onFocus={e=>(e.target as HTMLInputElement).style.borderColor=C.teal} onBlur={e=>(e.target as HTMLInputElement).style.borderColor=C.border}/>
              </div>
              <Select value={country} onChange={setCountry} minWidth={160} options={allCountries.map(c=>({value:c,label:c==="All"?"All Countries":c}))}/>
              <Select value={procedure} onChange={setProcedure} minWidth={160} options={allProcedures.map(p=>({value:p,label:p==="All"?"All Procedures":p}))}/>
            </div>

            {/* Clinic grid */}
            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(4, 1fr)", gap:isMobile?10:16 }}>
              {filtered.slice(0, 8).map((clinic, idx) => (
                <div key={clinic.id} className="card"
                  style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}
                  onClick={() => router.push(`/medical-tourism/${clinic.id}`)}>
                  {isMobile ? (
                    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 14px 0" }}>
                      <div style={{ width:48, height:48, borderRadius:12, background:CLINIC_GRADIENTS[idx%CLINIC_GRADIENTS.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"rgba(255,255,255,.4)", flexShrink:0 }}>{clinic.image}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:13.5 }}>{clinic.name}</div>
                        <div style={{ fontSize:11.5, color:C.textSm }}>{clinic.city}, {clinic.country} · {clinic.flag}</div>
                      </div>
                      <span style={{ background:C.tealLt, color:C.teal, fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20, flexShrink:0 }}>★ {clinic.rating}</span>
                    </div>
                  ) : (
                    <div style={{ height:100, background:CLINIC_GRADIENTS[idx%CLINIC_GRADIENTS.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:800, color:"rgba(255,255,255,.25)" }}>{clinic.image}</div>
                  )}
                  <div style={{ padding:isMobile?"10px 14px 14px":"14px" }}>
                    {!isMobile && (
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                        <div style={{ fontWeight:700, fontSize:13.5, lineHeight:1.3, flex:1, marginRight:6 }}>{clinic.name}</div>
                        <span style={{ background:C.tealLt, color:C.teal, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, flexShrink:0 }}>★ {clinic.rating}</span>
                      </div>
                    )}
                    {!isMobile && <div style={{ fontSize:11.5, color:C.textSm, marginBottom:10 }}>{clinic.city}, {clinic.country} {clinic.flag}</div>}
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:isMobile?10:12 }}>
                      {clinic.procedures.slice(0, 2).map(p => (
                        <span key={p} style={{ background:C.tealLt, color:C.teal, fontSize:isMobile?10:9, padding:"2px 8px", borderRadius:18, fontWeight:600 }}>{p}</span>
                      ))}
                      {clinic.procedures.length > 2 && <span style={{ background:C.gray, color:C.textSm, fontSize:isMobile?10:9, padding:"2px 8px", borderRadius:18, fontWeight:600 }}>+{clinic.procedures.length-2}</span>}
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      <button className="btn-primary" onClick={e=>{e.stopPropagation();router.push(`/medical-tourism/${clinic.id}`);}}
                        style={{ flex:1, padding:"8px", background:C.teal, color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                        View Clinic
                      </button>
                      <button onClick={e=>{e.stopPropagation();setSelectedClinic(clinic);setFacilitatorModal(true);}}
                        style={{ padding:"8px 10px", background:C.white, color:C.textSm, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
                        Get Help
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ gridColumn:"1/-1", textAlign:"center", padding:48, color:C.textSm, background:C.gray, borderRadius:14 }}>No clinics found. Try adjusting your search or filters.</div>
              )}
            </div>
          </div>
        </div>

        {/* POPULAR SPECIALTIES & PROCEDURES */}
        <div style={{ padding:isMobile?"28px 16px":"52px 16px", background:C.offWhite }}>
          <div style={{ maxWidth:960, margin:"0 auto", display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1px 1fr", gap:isMobile?24:40 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:isMobile?16:18, marginBottom:14 }}>Popular Specialties</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"4px 20px" }}>
                {GLOBAL_SPECIALTIES.map(s => (
                  <span key={s} style={{ fontSize:13, color:C.teal, cursor:"pointer", padding:"5px 0", fontWeight:500 }}
                    onMouseEnter={e=>(e.currentTarget as HTMLSpanElement).style.textDecoration="underline"}
                    onMouseLeave={e=>(e.currentTarget as HTMLSpanElement).style.textDecoration="none"}>{s}</span>
                ))}
              </div>
            </div>
            {!isMobile && <div style={{ background:C.border, width:1 }}/>}
            <div>
              <div style={{ fontWeight:700, fontSize:isMobile?16:18, marginBottom:14 }}>Popular Procedures</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"4px 20px" }}>
                {GLOBAL_PROCEDURES.map(p => (
                  <span key={p} style={{ fontSize:13, color:C.teal, cursor:"pointer", padding:"5px 0", fontWeight:500 }}
                    onMouseEnter={e=>(e.currentTarget as HTMLSpanElement).style.textDecoration="underline"}
                    onMouseLeave={e=>(e.currentTarget as HTMLSpanElement).style.textDecoration="none"}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div style={{ background:`linear-gradient(135deg, ${C.purple}15, ${C.tealLt})`, padding:isMobile?"40px 16px":"60px 16px", textAlign:"center" }}>
          <h2 style={{ fontSize:isMobile?20:28, fontWeight:800, marginBottom:12 }}>Ready to Explore Your Options?</h2>
          <p style={{ color:C.textSm, fontSize:isMobile?13:15, maxWidth:500, margin:"0 auto 24px" }}>Talk to our medical coordinators for personalized guidance on clinics, procedures, and travel planning.</p>
          <button className="btn-primary" onClick={() => setFacilitatorModal(true)}
            style={{ background:C.teal, color:"#fff", border:"none", borderRadius:28, padding:"14px 36px", fontWeight:700, fontSize:16, cursor:"pointer", fontFamily:"inherit" }}>
            Talk to a Facilitator
          </button>
        </div>

        <Footer />
      </div>

      {facilitatorModal && <FacilitatorModal onClose={() => { setFacilitatorModal(false); setSelectedClinic(null); }} clinic={selectedClinic} />}
    </>
  );
}
