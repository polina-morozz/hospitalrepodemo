import PROVIDERS from "@/lib/data/providers";
import type { Provider } from "@/lib/data/providers";

// ─── AI CHAT LOGIC ────────────────────────────────────────────────────────────
export interface ChatResponse {
  trigger: string[];
  matchTags: string[];
  response: string;
  providers: boolean;
  emergency?: boolean;
  facilitator?: boolean;
  showFacilitatorCTA?: boolean;
}

export const CHAT_RESPONSES: ChatResponse[] = [
  { trigger:["headache","head","migraine"], matchTags:["Family Medicine","Preventive Care"], response:"Based on your symptoms, this could be a tension headache or migraine.\n\n- Rest in a quiet, dark room\n- Drink at least 2 glasses of water\n- Ibuprofen or acetaminophen may help\n- Cold or warm compress on forehead\n\nIf headache is sudden, severe, or accompanied by fever or stiff neck — seek emergency care immediately.\n\nHere are providers who can help:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["chest","heart","breathing","breath"], matchTags:["Cardiology","Internal Medicine","Echocardiography"], response:"IMPORTANT — Chest pain or difficulty breathing may indicate a serious condition.\n\nIf you have severe chest pain, shortness of breath, or pain in your arm or jaw — call 911 immediately.\n\nDo not wait. Please seek care now.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true, emergency:true },
  { trigger:["cold","flu","fever","cough","sore throat"], matchTags:["Family Medicine","Walk-in","Preventive Care"], response:"Your symptoms suggest a common cold or flu.\n\n- Rest as much as possible\n- Warm liquids like broth or tea\n- Honey and lemon for sore throat\n- Saline nasal rinse for congestion\n- Fever above 39.5°C — see a doctor\n\nHere are providers who can help:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["hair","transplant","turkey","abroad","facilitator","medical tourism","find care abroad","international","surgery abroad","treatment abroad","cheapest","knee replacement abroad","dental abroad"], matchTags:[], response:"Here are some top-rated international clinics that match your needs. You can click on a clinic name to see full details, or talk to a medical coordinator who will guide you through the entire process — from choosing a clinic to travel arrangements.\n\nAll clinics are accredited and vetted by Hospital.com.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true, facilitator:true, showFacilitatorCTA:true },
  { trigger:["cardiologist","cardiology","heart doctor"], matchTags:["Cardiology","Internal Medicine","Echocardiography"], response:"Cardiology specialists diagnose and treat heart and vascular conditions. Consider their subspecialty, hospital affiliations, and new patient wait times.\n\nHere are cardiologists near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["dermatologist","skin","acne","rash"], matchTags:["Dermatology","Cosmetic","Skin Care"], response:"A dermatologist can evaluate skin conditions properly. In the meantime: avoid touching the area, keep it clean, and protect from sun exposure.\n\nHere are dermatologists near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["dentist","teeth","dental","tooth","cavity"], matchTags:["Family Medicine","Walk-in"], response:"A dentist can help with tooth pain, cavities, cleanings, and other oral health issues. Regular check-ups every 6 months are recommended.\n\nHere are providers who may help:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["eye","vision","glasses","ophthalmol","optom"], matchTags:["Family Medicine","Preventive Care"], response:"An eye specialist can help with vision changes, eye pain, or routine eye exams. If you experience sudden vision loss, seek emergency care immediately.\n\nHere are providers who may help:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["botox","filler","inject","aestheti","cosmetic","med spa","medspa"], matchTags:["Botox","Injectables","Skin Care","Medical Aesthetics","Cosmetic"], response:"Medical aesthetics procedures like Botox and fillers should only be performed by licensed professionals. Always verify credentials and look at reviews before booking.\n\nHere are top-rated providers near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["knee","joint","bone","orthop","sport","back pain","spine","shoulder"], matchTags:["Orthopedics","Sports Medicine"], response:"Orthopedic issues can range from acute injuries to chronic conditions. Early evaluation leads to better outcomes.\n\nHere are orthopedic specialists near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
];

export const DEFAULT_RESPONSE: ChatResponse = { trigger:[], response:"I recommend consulting a healthcare professional for proper evaluation.\n\n- Monitor your symptoms\n- Stay hydrated and rest\n\nWould you like help finding a specialist?\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true, matchTags:[] };

export function getResponse(input: string): ChatResponse {
  const lower = input.toLowerCase();
  for (const r of CHAT_RESPONSES) { if (r.trigger.some(t => lower.includes(t))) return r; }
  return DEFAULT_RESPONSE;
}

export function matchProviders(text: string, resp: ChatResponse): Provider[] {
  const lower = text.toLowerCase();
  const tags = resp.matchTags || [];

  if (tags.length > 0) {
    const matched = PROVIDERS.filter(p =>
      p.tags.some(t => tags.some(mt => t.toLowerCase().includes(mt.toLowerCase()) || mt.toLowerCase().includes(t.toLowerCase()))) ||
      tags.some(mt => p.specialty.toLowerCase().includes(mt.toLowerCase()))
    );
    if (matched.length > 0) {
      return [...matched.filter(p=>p.contracted), ...matched.filter(p=>!p.contracted)]
        .sort((a,b)=>b.rating-a.rating)
        .slice(0, 3);
    }
  }

  const queryMatched = PROVIDERS.filter(p =>
    p.tags.some(t => lower.includes(t.toLowerCase())) ||
    lower.includes(p.specialty.toLowerCase())
  );
  if (queryMatched.length > 0) {
    return [...queryMatched.filter(p=>p.contracted), ...queryMatched.filter(p=>!p.contracted)]
      .sort((a,b)=>b.rating-a.rating)
      .slice(0, 3);
  }

  return PROVIDERS.filter(p => p.contracted).sort((a,b)=>b.rating-a.rating).slice(0, 3);
}

export function isInternationalQuery(input: string): boolean {
  const lower = input.toLowerCase();
  const intlKeywords = ["abroad","turkey","thailand","india","germany","poland","spain","korea","international","overseas","medical tourism","find care abroad","cheapest","hair transplant","surgery abroad","treatment abroad","dental abroad"];
  return intlKeywords.some(k => lower.includes(k));
}
