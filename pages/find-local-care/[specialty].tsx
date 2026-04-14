import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import C from "@/lib/tokens";
import PROVIDERS, { Provider } from "@/lib/data/providers";
import useIsMobile from "@/lib/hooks/useIsMobile";
import Footer from "@/components/layout/Footer";

// ─── SPECIALTY PAGE ────────────────────────────────────────────────────────────

// Slug → display name mapping
const SPECIALTY_MAP: Record<string, string> = {
  "family-doctor":     "Family Medicine",
  "cardiologist":      "Cardiology",
  "dentist":           "Dentistry",
  "dermatologist":     "Dermatology",
  "orthopedist":       "Orthopedics",
  "pediatrician":      "Pediatrics",
  "psychiatrist":      "Psychiatry",
  "ob-gyn":            "OB-GYN",
  "ophthalmologist":   "Ophthalmology",
  "urgent-care":       "Urgent Care",
  "neurologist":       "Neurology",
  "medical-aesthetics":"Medical Aesthetics",
  "chiropractor":      "Chiropractic",
  "acupuncturist":     "Acupuncture",
};

// Singular provider name
const SPECIALTY_SINGULAR: Record<string, string> = {
  "Family Medicine":      "Family Doctor",
  "Cardiology":           "Cardiologist",
  "Dermatology":          "Dermatologist",
  "Orthopedics":          "Orthopedist",
  "Pediatrics":           "Pediatrician",
  "Psychiatry":           "Psychiatrist",
  "OB-GYN":              "OB-GYN",
  "Ophthalmology":        "Ophthalmologist",
  "Urgent Care":          "Urgent Care Clinic",
  "Neurology":            "Neurologist",
  "Medical Aesthetics":   "Medical Aesthetics Provider",
  "Chiropractic":         "Chiropractor",
  "Dentistry":            "Dentist",
  "Acupuncture":          "Acupuncturist",
};

// Plural label for headings
const SPECIALTY_LABEL: Record<string, string> = {
  "Family Medicine":      "Family Doctors",
  "Cardiology":           "Cardiologists",
  "Dermatology":          "Dermatologists",
  "Orthopedics":          "Orthopedists",
  "Pediatrics":           "Pediatricians",
  "Psychiatry":           "Psychiatrists",
  "OB-GYN":              "OB-GYNs",
  "Ophthalmology":        "Ophthalmologists",
  "Urgent Care":          "Urgent Care Clinics",
  "Neurology":            "Neurologists",
  "Medical Aesthetics":   "Medical Aesthetics Providers",
  "Chiropractic":         "Chiropractors",
  "Acupuncture":          "Acupuncturists",
};

// ─── PER-SPECIALTY CONTENT ────────────────────────────────────────────────────
interface SpecialtyContent {
  about: [string, string];
  whenToSee: string[];
  conditions: string[];
  procedures: { name: string; desc: string }[];
  facts: string[];
  costs: string[];
  faqs: { q: string; a: string }[];
  stats?: { value: string; label: string }[];
  steps?: { num: string; title: string; time?: string; desc: string }[];
  credentials?: { region: string; body: string }[];
}

const SPECIALTY_DATA: Record<string, SpecialtyContent> = {
  "Acupuncture": {
    about: [
      "Acupuncture is a regulated health practice involving the insertion of thin, sterile needles into specific points on the body to stimulate the nervous system, reduce inflammation, and promote the body's natural healing responses. Rooted in a 2,500-year tradition of Traditional Chinese Medicine, it has become one of the most extensively researched non-pharmacological therapies in modern medicine — with over 13,000 clinical studies conducted across 60 countries.",
      "In the United States, acupuncturists are board-certified through the NCCAOM and licensed in 44 states. In Canada, five provinces regulate acupuncture by law under the protected title of Registered Acupuncturist (R.Ac). Neuroimaging studies show acupuncture activates the same brain regions involved in opioid-mediated analgesia, which is why it is increasingly integrated into hospital pain programs as a non-opioid alternative.",
    ],
    whenToSee: [
      "Chronic back, neck, or joint pain that has not responded to standard treatment",
      "Migraines, tension headaches, or recurring headaches",
      "Anxiety, depression, or insomnia affecting daily function",
      "Fertility support or menopausal symptom management",
      "Nausea from chemotherapy, surgery, or pregnancy",
      "Cancer-related fatigue or side effects from treatment",
    ],
    conditions: [
      "Chronic back and neck pain",
      "Migraines and tension headaches",
      "Knee osteoarthritis",
      "Anxiety and insomnia",
      "Female infertility support",
      "Cancer-related fatigue",
    ],
    procedures: [
      { name: "Traditional Body Acupuncture", desc: "Sterile needles placed at 360+ classical points to trigger healing responses along peripheral nerves" },
      { name: "Electroacupuncture", desc: "Mild electrical current between needles to amplify stimulation — commonly used for musculoskeletal pain" },
      { name: "Auricular Acupuncture", desc: "Targeting points on the outer ear; used in smoking cessation, addiction recovery, and anxiety programs" },
      { name: "Moxibustion", desc: "Heat therapy using burning mugwort applied near acupuncture points to stimulate circulation" },
      { name: "Cupping Therapy", desc: "Suction cups placed on the skin to improve blood flow and relieve muscle tension" },
      { name: "TCM Herbal Medicine", desc: "Customized herbal formulas prescribed alongside needling to address underlying constitutional patterns" },
      { name: "Initial TCM Diagnosis", desc: "Comprehensive intake including pulse and tongue assessment, health history review, and treatment goal-setting" },
      { name: "Pain Management Plan", desc: "Structured multi-session protocol for chronic pain with measurable milestones at the 4–6 session mark" },
    ],
    facts: [
      "NCCAOM-certified in 44 US states; 5 Canadian provinces regulate R.Ac title by law",
      "Training: 3–4 year master's or doctoral programs (DACM) with 500+ supervised clinical hours",
      "First visit: 30–45 min intake + 20–40 min needling; 6–20 points per session",
      "Chronic conditions typically require 6–12 sessions; acute issues may resolve in 3–6",
      "Medicare covers acupuncture for chronic low back pain; most PPO plans include partial coverage",
    ],
    costs: [
      "Initial visit: $100 – $200 (includes full TCM diagnosis)",
      "Follow-up sessions: $60 – $120 per visit",
      "Medicare (chronic low back pain): partially covered",
      "Most employer extended health plans include $300–$1,000/year for acupuncture",
    ],
    faqs: [
      { q: "Does acupuncture hurt?", a: "Most patients experience minimal discomfort — significantly less than a blood draw. Acupuncture needles are 0.20–0.25mm in diameter. A mild aching sensation called 'de qi' is considered a positive therapeutic response in TCM." },
      { q: "Is acupuncture covered by insurance in the US and Canada?", a: "In the US, many PPO plans, Medicare Advantage plans, and traditional Medicare (for chronic low back pain) provide partial coverage. The VA also covers acupuncture for veterans. In Canada, provincial health plans don't cover it, but most employer extended benefit plans include partial coverage under paramedical sections." },
      { q: "How many sessions will I need?", a: "Acute conditions may respond in 3–6 sessions. Chronic pain, fertility support, and mental health applications typically require 8–12 sessions. Most licensed acupuncturists reassess progress at the 4–6 session mark and adjust accordingly." },
      { q: "Is acupuncture safe during pregnancy?", a: "Acupuncture is used during pregnancy for nausea, back pain, and breech presentation support, but certain points are contraindicated at specific stages. Always confirm with your OB or midwife first, and ensure your acupuncturist has documented experience with prenatal care." },
      { q: "What is the difference between a licensed acupuncturist and other practitioners offering acupuncture?", a: "In regulated US states and Canadian provinces, only practitioners who have passed the relevant licensing exams can use protected titles like L.Ac, Dipl. Ac., or R.Ac. Physiotherapists and chiropractors may perform acupuncture within their scope but typically with fewer acupuncture-specific training hours." },
      { q: "How do I verify an acupuncturist's credentials?", a: "Verify credentials directly at nccaom.org (US) or through your provincial college's public register — for example ctcmpao.on.ca in Ontario. On Hospital.com, Verified badges confirm that credentials have been reviewed by our team." },
    ],
    stats: [
      { value: "13,000+", label: "Clinical studies on acupuncture conducted in 60 countries" },
      { value: "184",     label: "Medical conditions studied in peer-reviewed meta-analyses (2017–2022)" },
      { value: "2,189",   label: "Official clinical guideline recommendations for acupuncture worldwide" },
      { value: "44",      label: "US states with NCCAOM licensing for acupuncturists" },
    ],
    steps: [
      { num: "01", title: "Intake & Diagnosis", time: "30–45 min", desc: "Your acupuncturist reviews your health history, current symptoms, and goals. TCM diagnosis may include pulse and tongue assessment alongside a standard health intake." },
      { num: "02", title: "Needling", time: "20–40 min", desc: "Sterile, single-use needles are inserted at 6–20 points. Most patients feel minimal discomfort. A mild aching sensation called 'de qi' is considered a positive therapeutic response." },
      { num: "03", title: "Rest & Retention", desc: "Needles are retained for 15–30 minutes while you rest. Some practitioners add heat therapy (moxibustion) or electrical stimulation during this phase." },
      { num: "04", title: "Follow-up Plan", desc: "Chronic conditions typically require 6–12 sessions. Your acupuncturist will propose a treatment frequency and discuss measurable goals at the end of session one." },
    ],
    credentials: [
      { region: "United States", body: "Most states require candidates to pass board exams administered by the NCCAOM, which confers the Diplomate of Acupuncture (Dipl. Ac.) designation. California operates its own licensing board using the title Licensed Acupuncturist (L.Ac.) or Certified Acupuncturist (C.Ac.). Training programs are 3–4 years at the master's level; many states now recognize doctoral-level programs (DACM). Verify credentials at nccaom.org." },
      { region: "Canada", body: "Five provinces regulate acupuncture by law — Ontario, British Columbia, Alberta, Quebec, and Newfoundland and Labrador. Candidates must complete a 3–4 year post-secondary program, log a minimum of 500 hours of supervised clinical contact, and pass the Pan-Canadian examinations administered by CARB-TCMPA before using the protected title of Registered Acupuncturist (R.Ac). Verify at your provincial college's public register, e.g. ctcmpao.on.ca in Ontario." },
    ],
  },
  "Family Medicine": {
    about: [
      "Family medicine providers deliver comprehensive, continuous healthcare to patients of all ages — from newborns to seniors. They are trained to diagnose and treat a wide range of conditions, manage chronic diseases, provide preventive care, and coordinate referrals to specialists when needed.",
      "Your family doctor is typically your first point of contact with the healthcare system. They build long-term relationships with patients and their families, which allows for more personalized, context-aware care over time. Most private health plans and Medicare/Medicaid fully cover family medicine visits.",
    ],
    whenToSee: [
      "Annual physical exams and preventive health screenings",
      "New or worsening symptoms you haven't had diagnosed yet",
      "Chronic disease management — diabetes, hypertension, thyroid disorders",
      "Vaccinations and immunizations for all ages",
      "Mental health concerns including anxiety, depression, and stress",
      "Referrals to specialists and coordination of ongoing care",
    ],
    conditions: [
      "Hypertension and heart disease risk",
      "Type 2 diabetes management",
      "Respiratory infections and asthma",
      "Skin conditions and minor injuries",
      "Anxiety and depression",
      "Thyroid and hormonal disorders",
    ],
    procedures: [
      { name: "Annual Physical Exam", desc: "Comprehensive head-to-toe health check including vitals, labs, and personalized screening" },
      { name: "Preventive Screenings", desc: "Cancer screenings, cholesterol panels, blood pressure checks, and more" },
      { name: "Vaccinations & Immunizations", desc: "Flu shots, travel vaccines, shingles, pneumonia, COVID-19 boosters" },
      { name: "Chronic Disease Management", desc: "Ongoing care plans for diabetes, hypertension, asthma, and thyroid disorders" },
      { name: "Blood & Lab Tests", desc: "CBC, metabolic panel, A1C, lipid profile and other diagnostic bloodwork ordered in-office" },
      { name: "Mental Health Screening", desc: "PHQ-9 depression screening, GAD-7 anxiety assessment, and referrals to mental health specialists" },
      { name: "Minor Procedures", desc: "Wound care, skin tag removal, joint injections, ear cleaning, and suturing" },
      { name: "Specialist Referrals", desc: "Coordinated referrals to cardiologists, dermatologists, endocrinologists, and other specialists" },
    ],
    facts: [
      "No referral needed — book directly for most concerns",
      "Covers all ages: pediatric through geriatric care",
      "Typically the most cost-effective specialist for new or undifferentiated symptoms",
      "Can order labs, imaging, and specialist referrals in a single visit",
      "Most plans cover annual wellness visits at 100% with no copay",
    ],
    costs: [
      "Annual physical (in-network): often $0 copay under ACA-compliant plans",
      "New patient visit: $100 – $250",
      "Follow-up appointment: $60 – $130",
      "Direct Primary Care memberships: $50 – $100/month with unlimited visits",
    ],
    faqs: [
      { q: "How often should I see my family doctor?", a: "Most adults should have an annual wellness visit. If you have chronic conditions like diabetes or hypertension, your provider may recommend check-ins every 3–6 months. Children and seniors may need more frequent visits." },
      { q: "Do I need a referral to see a specialist?", a: "Your family doctor can refer you to specialists. HMO plans typically require a referral for coverage; PPO plans usually let you self-refer. Your family doctor will help coordinate your care regardless of plan type." },
      { q: "Can my family doctor treat mental health conditions?", a: "Yes — family doctors routinely screen for and manage anxiety, depression, and other common mental health conditions. For complex cases, they will refer you to a psychiatrist or psychologist while continuing to coordinate your overall care." },
      { q: "What should I bring to my first appointment?", a: "Bring a government-issued ID, your insurance card, a list of current medications and dosages, any prior medical records or test results, and a list of questions or symptoms you'd like to discuss." },
      { q: "Does my family doctor share records with specialists?", a: "Yes — with your consent, your family doctor can share records with any specialist you're referred to. Hospital.com provider profiles show which electronic health record (EHR) systems each practice uses." },
      { q: "Are Hospital.com family doctors accepting new patients?", a: "Each provider profile on Hospital.com shows real-time availability and whether they are accepting new patients. Verified Partners allow direct online booking with no phone call required." },
    ],
  },
  "Cardiology": {
    about: [
      "Cardiologists specialize in diagnosing and treating diseases of the heart and vascular system. They manage conditions ranging from hypertension and coronary artery disease to heart failure, arrhythmias, and congenital heart defects — using a combination of imaging, diagnostic tests, medications, and interventional procedures.",
      "Cardiology care is typically accessed through a referral from your primary care physician, though many cardiologists accept self-referrals from patients with known risk factors. Early evaluation is critical — many serious cardiac conditions are highly treatable when caught before they progress.",
    ],
    whenToSee: [
      "Chest pain, pressure, or tightness — especially during physical activity",
      "Shortness of breath at rest or with minimal exertion",
      "Heart palpitations, irregular heartbeat, or fluttering sensation",
      "Dizziness, fainting, or unexplained fatigue",
      "Strong family history of heart disease or sudden cardiac death",
      "High blood pressure or cholesterol that isn't responding to primary care management",
    ],
    conditions: [
      "Coronary artery disease",
      "Heart failure and cardiomyopathy",
      "Atrial fibrillation and arrhythmias",
      "Hypertension (high blood pressure)",
      "Valvular heart disease",
      "Peripheral artery disease",
    ],
    procedures: [
      { name: "Echocardiogram", desc: "Ultrasound imaging of the heart to assess structure, valves, and pumping function" },
      { name: "Stress Test (Exercise ECG)", desc: "Evaluates how your heart performs under controlled physical stress" },
      { name: "Holter Monitor", desc: "24–48 hour portable ECG to capture intermittent arrhythmias in daily life" },
      { name: "Cardiac Catheterization", desc: "Invasive diagnostic and interventional procedure to assess coronary artery blockages" },
      { name: "Coronary CT Angiography", desc: "Non-invasive imaging of coronary arteries to detect calcification and plaque" },
      { name: "Pacemaker Implantation", desc: "Device implantation to regulate abnormally slow or irregular heart rhythms" },
      { name: "Cardioversion", desc: "Electrical or pharmacological procedure to restore normal heart rhythm in AF patients" },
      { name: "Heart Failure Management", desc: "Structured medication optimization, fluid monitoring, and lifestyle counseling programs" },
    ],
    facts: [
      "Most cardiologists require a referral from a primary care physician for insurance coverage",
      "First appointment typically includes an ECG, blood pressure evaluation, and lipid panel review",
      "Subspecialties include interventional cardiology, electrophysiology, and heart failure",
      "ABIM board certification in Cardiovascular Disease is the standard US credentialing",
      "In Canada, cardiologists complete 5 years of internal medicine residency plus fellowship",
    ],
    costs: [
      "New patient consultation: $200 – $400",
      "Echocardiogram: $1,000 – $3,000 (often covered by insurance)",
      "Stress test: $200 – $500 with insurance adjustment",
      "Most plans cover cardiology visits with a specialist copay ($30–$60 in-network)",
    ],
    faqs: [
      { q: "When should I go to the ER vs. book a cardiology appointment?", a: "Go to the ER immediately for severe chest pain, sudden shortness of breath, pain radiating to your arm or jaw, or fainting. Book a cardiology appointment for persistent but non-emergency symptoms like palpitations, mild chest discomfort, or elevated blood pressure readings." },
      { q: "Do I need a referral to see a cardiologist?", a: "Most insurance plans require a referral from your primary care physician. If you are on a PPO plan, you may be able to self-refer. Contact your insurer or check your plan documents to confirm." },
      { q: "What happens at my first cardiology appointment?", a: "Your cardiologist will review your medical history, perform a physical exam, order baseline tests (ECG, blood work, possibly an echocardiogram), and discuss your risk factors before proposing a management plan." },
      { q: "Is cardiology covered by insurance?", a: "Yes — cardiology is covered by virtually all private health insurance plans and Medicare/Medicaid. Costs depend on your deductible, copay, and whether the provider is in-network." },
      { q: "Can I see a cardiologist for a second opinion?", a: "Absolutely — second opinions are common and often recommended before major cardiac procedures. Hospital.com makes it easy to find board-certified cardiologists who offer consultation appointments." },
      { q: "What is an interventional cardiologist?", a: "Interventional cardiologists perform catheter-based procedures such as angioplasty, stenting, and valve repair. Not all cardiologists are interventional — confirm the subspecialty on the provider's Hospital.com profile." },
    ],
  },
  "Dermatology": {
    about: [
      "Dermatologists diagnose and treat conditions of the skin, hair, and nails. They see patients for medical issues — rashes, acne, eczema, psoriasis, and skin cancers — as well as cosmetic concerns such as anti-aging treatments, laser procedures, and injectables. Medical dermatology and cosmetic dermatology often overlap in a single practice.",
      "Skin cancer is the most common cancer in North America, and early detection by a board-certified dermatologist is critical. Annual full-body skin exams are recommended for anyone with a history of sunburn, moles, or a family history of melanoma. Most plans cover medical dermatology visits; cosmetic procedures are typically out-of-pocket.",
    ],
    whenToSee: [
      "Changing, irregular, or new moles — use the ABCDE rule (Asymmetry, Border, Color, Diameter, Evolution)",
      "Persistent acne that hasn't responded to over-the-counter treatments",
      "Eczema, psoriasis, or chronic dry skin causing daily discomfort",
      "Hair loss (alopecia) or scalp conditions",
      "Rashes that spread, blister, or are accompanied by fever",
      "Annual skin cancer screening, especially with UV exposure history",
    ],
    conditions: [
      "Acne and rosacea",
      "Eczema and atopic dermatitis",
      "Psoriasis",
      "Melanoma and skin cancer",
      "Alopecia and hair loss",
      "Warts and molluscum",
    ],
    procedures: [
      { name: "Full-Body Skin Exam", desc: "Comprehensive annual screening to detect early-stage skin cancers and suspicious lesions" },
      { name: "Skin Biopsy", desc: "Removal of a small tissue sample for laboratory analysis and diagnosis" },
      { name: "Acne Treatment Plan", desc: "Prescription topicals, oral antibiotics, or isotretinoin protocols customized to skin type" },
      { name: "Mole Removal", desc: "Surgical excision or shave removal of benign or suspicious moles with pathology review" },
      { name: "Phototherapy (UV Light)", desc: "Controlled UV exposure used to treat psoriasis, eczema, and vitiligo" },
      { name: "Laser Skin Resurfacing", desc: "Ablative or non-ablative laser treatments for wrinkles, sun damage, and scarring" },
      { name: "Chemical Peel", desc: "Exfoliating acid treatments to improve skin texture, tone, and hyperpigmentation" },
      { name: "Patch Testing", desc: "Identification of contact allergens causing allergic dermatitis" },
    ],
    facts: [
      "Board certification through the American Board of Dermatology (ABD) requires 3+ years of residency",
      "Mohs surgery — offered by fellowship-trained dermatologists — has the highest cure rate for skin cancer",
      "Dermatology is one of the most competitive medical specialties; wait times for new patients can be long",
      "Teledermatology allows for photo-based consultations for many common skin concerns",
      "Most plans cover medical dermatology; cosmetic dermatology is generally not covered",
    ],
    costs: [
      "New patient consultation: $150 – $350",
      "Skin biopsy: $150 – $400 (often covered by insurance)",
      "Cosmetic Botox or filler: $300 – $800 out-of-pocket",
      "Mohs surgery: covered by most plans when medically indicated",
    ],
    faqs: [
      { q: "How often should I get a full-body skin exam?", a: "Once a year is recommended for most adults, especially those with fair skin, history of sunburn, many moles, or a personal or family history of skin cancer. Your dermatologist may recommend more frequent checks if risk factors are elevated." },
      { q: "Is a referral required to see a dermatologist?", a: "Many dermatologists accept self-referrals. HMO insurance plans may require a referral from your primary care physician, while PPO plans typically allow direct booking. Check your plan before scheduling." },
      { q: "What is the ABCDE rule for moles?", a: "Asymmetry, Border irregularity, Color variation, Diameter larger than 6mm (pencil eraser), and Evolution (any change in size, shape, or color). If a mole meets any of these criteria, see a dermatologist promptly." },
      { q: "Can a dermatologist treat hair loss?", a: "Yes — dermatologists treat androgenetic alopecia (pattern hair loss), alopecia areata, and scalp conditions. Treatments include topical minoxidil, oral finasteride, PRP injections, and low-level laser therapy." },
      { q: "Does insurance cover acne treatment?", a: "Medical acne treatment — topical and oral prescriptions — is typically covered by health insurance. Cosmetic procedures like laser resurfacing for acne scarring are usually not covered." },
      { q: "How do I prepare for a full-body skin exam?", a: "Remove nail polish so nails can be examined. Wear your hair down. Remove all jewelry. Arrive without makeup if possible. Your dermatologist will examine every area of skin, including the scalp and between toes." },
    ],
  },
  "Orthopedics": {
    about: [
      "Orthopedic surgeons and sports medicine physicians specialize in the musculoskeletal system — bones, joints, cartilage, tendons, ligaments, and muscles. They manage both acute injuries (fractures, ligament tears, dislocations) and chronic conditions (arthritis, degenerative disc disease, tendinopathy) using non-surgical and surgical approaches.",
      "Many orthopedic conditions respond well to conservative treatment — physical therapy, bracing, corticosteroid injections, and activity modification. Surgery is considered when conservative measures fail or the injury severity requires it. An accurate early diagnosis significantly improves long-term outcomes for most musculoskeletal conditions.",
    ],
    whenToSee: [
      "Joint pain, swelling, or stiffness that limits daily activities",
      "Sports or workplace injuries — sprains, fractures, or muscle tears",
      "Knee, hip, or shoulder pain that hasn't improved with rest and anti-inflammatories",
      "Back or neck pain radiating into arms or legs (possible nerve involvement)",
      "A previous fracture or injury that hasn't healed properly",
      "Considering joint replacement or other orthopedic surgery",
    ],
    conditions: [
      "Knee osteoarthritis and ACL tears",
      "Rotator cuff injuries",
      "Herniated discs and spinal stenosis",
      "Hip osteoarthritis",
      "Tennis and golfer's elbow",
      "Plantar fasciitis and foot disorders",
    ],
    procedures: [
      { name: "Joint Injection (Cortisone / Hyaluronic Acid)", desc: "Anti-inflammatory or lubricating injections into the knee, shoulder, or hip for pain relief" },
      { name: "Arthroscopy", desc: "Minimally invasive keyhole surgery to diagnose and repair joints, most commonly knee and shoulder" },
      { name: "ACL Reconstruction", desc: "Surgical repair of torn anterior cruciate ligament using graft tissue" },
      { name: "Total Knee Replacement", desc: "Resurfacing damaged knee joint with metal and plastic implants for end-stage arthritis" },
      { name: "Total Hip Replacement", desc: "Full prosthetic replacement of the hip joint to restore mobility and eliminate pain" },
      { name: "Spinal Fusion", desc: "Connecting vertebrae to stabilize the spine and relieve nerve compression" },
      { name: "Fracture Fixation", desc: "Surgical stabilization of complex fractures using plates, screws, rods, or external fixators" },
      { name: "PRP Therapy", desc: "Platelet-rich plasma injections to accelerate healing of tendons and soft tissue" },
    ],
    facts: [
      "Board certification through ABOS (American Board of Orthopaedic Surgery) requires 5-year residency",
      "Many orthopedists subspecialize: spine, sports medicine, hand, foot and ankle, or joint replacement",
      "Most non-emergency orthopedic conditions benefit from a trial of physical therapy first",
      "Imaging (X-ray, MRI, CT) is typically ordered before surgical decisions are made",
      "Canada: RCPSC Orthopedic Surgery certification requires 5 years of residency",
    ],
    costs: [
      "New patient consultation: $150 – $350",
      "Cortisone joint injection: $100 – $300 (often covered by insurance)",
      "Knee arthroscopy: $5,000 – $15,000 (insurance coverage varies significantly)",
      "Total knee or hip replacement: covered by most major insurance plans and Medicare",
    ],
    faqs: [
      { q: "When should I see an orthopedist vs. a physiotherapist?", a: "Start with a physiotherapist for most acute soft-tissue injuries, mild joint pain, and post-surgical rehabilitation. See an orthopedist if you suspect a fracture, experience sudden severe joint pain, have a locked joint, or if physical therapy has not improved your condition." },
      { q: "Do I need a referral to see an orthopedist?", a: "Many orthopedists accept self-referrals, especially for sports injuries. Some insurance plans require a referral for specialist coverage — check your plan or ask your family doctor to refer you." },
      { q: "How do I know if I need surgery?", a: "Surgery is typically considered after conservative treatments (physiotherapy, injections, bracing) have been tried for an appropriate period without success, or when the injury is severe enough that non-surgical management is unlikely to restore function." },
      { q: "How long is recovery after knee or hip replacement?", a: "Most patients walk with assistance within 24 hours of surgery. Full recovery to low-impact activities takes 6–8 weeks; return to higher-impact activities can take 3–6 months. Physical therapy begins immediately after surgery." },
      { q: "Is orthopedic care covered by insurance?", a: "Medical orthopedic care — including consultations, injections, and most surgeries — is covered by virtually all private plans and government programs. Out-of-pocket costs depend on your deductible and in-network status." },
      { q: "What imaging will I need before my first appointment?", a: "Bring any recent X-rays or MRIs if you have them. Your orthopedist will order imaging if needed. X-rays are taken in most orthopedic offices; MRI and CT may be ordered at a separate facility." },
    ],
  },
  "Chiropractic": {
    about: [
      "Chiropractors specialize in the diagnosis and manual treatment of musculoskeletal disorders, with a particular focus on the spine. Chiropractic care uses spinal manipulation and adjustments to restore joint mobility, reduce pain, and improve nervous system function without the use of drugs or surgery.",
      "Chiropractic is one of the most widely accessed non-pharmacological therapies in North America, with strong evidence supporting its use for acute and chronic low back pain, neck pain, and headaches. Most chiropractors also incorporate soft tissue therapy, rehabilitative exercise, and lifestyle counseling into their treatment plans.",
    ],
    whenToSee: [
      "Acute or chronic low back pain following injury or with no clear cause",
      "Neck pain or stiffness, especially after a motor vehicle accident or whiplash",
      "Tension headaches or cervicogenic headaches originating from the neck",
      "Sciatica or radiating leg pain from a compressed nerve",
      "Joint stiffness and restricted range of motion in the spine or extremities",
      "Preventive care and spinal health maintenance",
    ],
    conditions: [
      "Low back pain and lumbar disc herniation",
      "Neck pain and whiplash",
      "Tension and cervicogenic headaches",
      "Sciatica",
      "Sacroiliac joint dysfunction",
      "Sports and repetitive strain injuries",
    ],
    procedures: [
      { name: "Spinal Manipulation (Adjustment)", desc: "Controlled force applied to spinal joints to restore mobility and reduce pain" },
      { name: "Soft Tissue Therapy", desc: "Myofascial release, trigger point therapy, and instrument-assisted techniques for muscle tension" },
      { name: "Extremity Adjustments", desc: "Joint manipulation of the shoulder, elbow, wrist, hip, knee, and ankle" },
      { name: "Postural Assessment & Correction", desc: "Evaluation of posture patterns and targeted exercises to correct muscular imbalances" },
      { name: "Rehabilitative Exercise", desc: "Customized strengthening and mobility programs to support spinal stability" },
      { name: "Decompression Therapy", desc: "Mechanical traction to relieve pressure on compressed spinal discs and nerves" },
      { name: "Ergonomic Counseling", desc: "Workplace and home setup advice to prevent recurrence of spinal complaints" },
      { name: "Lifestyle & Nutritional Guidance", desc: "Anti-inflammatory diet advice, sleep positioning, and activity modification counseling" },
    ],
    facts: [
      "US: Doctor of Chiropractic (DC) degree requires 4 years of graduate-level study post-bachelor",
      "Canada: CCEB national board exams required for licensure in all provinces",
      "Covered by most extended health plans, some provincial plans, and workers' compensation",
      "Evidence is strongest for spinal manipulation in acute and chronic low back pain and neck pain",
      "Most cases show improvement within 6–12 sessions; many patients maintain monthly wellness visits",
    ],
    costs: [
      "Initial assessment: $100 – $200",
      "Per-session adjustment: $50 – $120",
      "Most extended health plans cover $300 – $600/year for chiropractic",
      "Workers' compensation typically covers full treatment for workplace injuries",
    ],
    faqs: [
      { q: "Is chiropractic safe?", a: "When performed by a licensed chiropractor, spinal manipulation is considered safe for most people. Rare but serious complications have been reported with cervical (neck) manipulation — discuss your full medical history with your chiropractor before treatment." },
      { q: "How many chiropractic sessions will I need?", a: "Acute conditions often improve within 6–12 sessions. Chronic conditions may require ongoing maintenance care. Your chiropractor will propose a treatment plan and reassess progress every 4–6 sessions." },
      { q: "Does chiropractic treat anything beyond back pain?", a: "Evidence is strongest for low back pain, neck pain, and headaches. Chiropractors also treat extremity joints and provide wellness care. They do not diagnose or treat systemic medical conditions." },
      { q: "Do I need a referral to see a chiropractor?", a: "No referral is needed to see a chiropractor. You can book directly. Some extended health plans require a physician's note for reimbursement — check your plan details." },
      { q: "What happens during a chiropractic adjustment?", a: "Your chiropractor applies a controlled, high-velocity, low-amplitude thrust to a specific joint. You may hear a 'cracking' sound (cavitation) — this is gas releasing from the joint fluid, not bones grinding." },
      { q: "Is chiropractic covered by my insurance?", a: "Most employer-sponsored extended health plans include chiropractic coverage, typically $300–$600/year. Medicare and Medicaid provide limited chiropractic coverage. Auto insurance (MVA) often covers full chiropractic treatment for accident injuries." },
    ],
  },
};

// Default content used for specialties without specific data
const DEFAULT_SPECIALTY_CONTENT: SpecialtyContent = {
  about: [
    "This specialty is a regulated area of healthcare focused on the diagnosis, treatment, and prevention of related disorders. Providers use evidence-based approaches to restore proper function, relieve symptoms, and improve quality of life for their patients.",
    "Care in this specialty is covered by most private insurance plans. Hospital.com lists only credentialed, background-checked providers — allowing you to compare by rating, availability, and insurance compatibility before you book.",
  ],
  whenToSee: [
    "Persistent symptoms that don't resolve on their own after 2–3 weeks",
    "Recurring or worsening conditions despite self-management",
    "Following an injury, medical event, or recent diagnosis",
    "Preventive care and routine health maintenance",
    "Second opinion on a diagnosis or proposed treatment plan",
    "Specialized evaluation, procedure, or imaging",
  ],
  conditions: [
    "Acute and chronic pain management",
    "Injury recovery and rehabilitation",
    "Preventive care and wellness",
    "Chronic disease management",
    "Post-surgical care and monitoring",
    "Diagnostic evaluation and screening",
  ],
  procedures: [
    { name: "Initial Assessment", desc: "Comprehensive evaluation of your health history, symptoms, and goals with a personalized treatment plan" },
    { name: "Follow-up Visit", desc: "Ongoing care and monitoring of your treatment progress and response" },
    { name: "Diagnostic Imaging", desc: "Advanced imaging ordered to identify, confirm, or rule out specific conditions" },
    { name: "Annual Physical", desc: "Preventive health check-up and risk-factor screening" },
    { name: "Treatment Plan", desc: "Customized, evidence-based care plan tailored to your specific needs and goals" },
    { name: "Preventive Care", desc: "Proactive health management, screenings, and wellness counseling" },
    { name: "Lab & Blood Tests", desc: "Comprehensive laboratory analysis to support diagnosis and monitoring" },
    { name: "Specialist Consultation", desc: "Expert second opinion or collaborative review of your care plan" },
  ],
  facts: [
    "Covered by most private health plans with standard copays",
    "No referral needed in most cases — book directly",
    "First visit typically includes a comprehensive intake assessment",
    "Average session: 30–60 minutes depending on complexity",
    "Most conditions show measurable improvement within 4–8 sessions",
  ],
  costs: [
    "Initial visit: $100 – $300 depending on location and provider",
    "Follow-up sessions: $60 – $150 per visit",
    "Most plans cover $300 – $1,500/year in specialist visits",
    "Many providers offer payment plans for out-of-pocket costs",
  ],
  faqs: [
    { q: "How much does a specialist visit cost?", a: "Costs typically range from $60–$300 per session depending on your location and provider. Initial visits are usually higher due to the comprehensive assessment. Most private plans cover a portion of the cost depending on your deductible and copay." },
    { q: "Do I need a referral?", a: "In most cases, no referral is required — you can book directly through Hospital.com. Some HMO insurance plans may request a referral for reimbursement purposes, so it's worth checking your plan documents beforehand." },
    { q: "Is this specialty covered by insurance?", a: "Yes — most employer-sponsored health plans include coverage for this specialty. Use Hospital.com's insurance filter to find in-network providers and avoid unexpected out-of-pocket costs." },
    { q: "How do I choose the best provider?", a: "Look for a licensed and board-certified provider, read verified patient reviews, confirm they treat your specific condition, and verify they accept your insurance plan. A thorough initial assessment is a strong positive sign." },
    { q: "How many visits will I need?", a: "Acute issues may resolve in 3–6 sessions while chronic or complex conditions may require ongoing care. Your provider will outline a plan after your first assessment and reassess at regular intervals." },
    { q: "Are Hospital.com providers verified?", a: "Yes — every provider on Hospital.com has been credentialed and background-checked. Verified Partners display a teal badge and have passed additional quality and patient satisfaction checks." },
  ],
};

function slugToDisplay(slug: string): string {
  return SPECIALTY_MAP[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function specialtyLabel(name: string): string {
  return SPECIALTY_LABEL[name] || name + " Providers";
}
function matchesSpecialty(p: Provider, specialty: string): boolean {
  const s = specialty.toLowerCase();
  return (
    p.specialty.toLowerCase().includes(s) ||
    p.tags.some(t => t.toLowerCase().includes(s)) ||
    (s === "family medicine"    && p.specialty.toLowerCase().includes("family")) ||
    (s === "cardiology"         && p.specialty.toLowerCase().includes("cardio")) ||
    (s === "dermatology"        && p.specialty.toLowerCase().includes("derm")) ||
    (s === "orthopedics"        && p.specialty.toLowerCase().includes("ortho")) ||
    (s === "medical aesthetics" && p.specialty.toLowerCase().includes("aesthetic")) ||
    (s === "acupuncture"        && (p.specialty.toLowerCase().includes("acupunct") || p.tags.some(t => t.toLowerCase().includes("acupunct"))))
  );
}

// ─── PROVIDER CARD ─────────────────────────────────────────────────────────────
function ProviderCard({ provider }: { provider: Provider }) {
  const router = useRouter();
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => router.push(`/providers/${provider.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? "#32cce0" : "#e8eef2"}`,
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hovered ? "0 8px 40px rgba(16,117,173,0.16)" : "none",
        transform: hovered ? "translateY(-3px)" : "none",
        transition: "all .22s",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top gradient line (on hover) */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg, #32cce0, #1075ad)",
        transform: hovered ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: "transform .3s ease",
      }} />

      {/* Top section */}
      <div style={{ padding: "22px 20px 16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
        {/* Circular avatar */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg, #eef9fc, #c8edf7)",
          border: "2px solid #cce4f0",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, overflow: "hidden",
        }}>
          {provider.photo && !imgErr
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={provider.photo} alt={provider.name} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          }
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#071e34", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {provider.name}
          </div>
          <div style={{ fontSize: 12, color: "#5a7085", marginBottom: 7 }}>{provider.specialty}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#112233" }}>
            <span style={{ color: "#f0c840", letterSpacing: -1 }}>
              {[1,2,3,4,5].map(s => <span key={s}>{s <= Math.round(provider.rating) ? "★" : "☆"}</span>)}
            </span>
            <span>{provider.rating}</span>
            <span style={{ color: "#5a7085", fontWeight: 400 }}>({provider.reviews} reviews)</span>
          </div>
        </div>

        {/* Verified badge */}
        {provider.contracted && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: "rgba(50,204,224,0.1)", border: "1px solid rgba(50,204,224,0.3)",
            color: "#1075ad", fontFamily: "Outfit, sans-serif",
            fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em",
            textTransform: "uppercase" as const, padding: "3px 8px", borderRadius: 100,
            flexShrink: 0,
          }}>
            ✓ Verified
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid #e8eef2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#5a7085", marginBottom: 8 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5a7085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
          {provider.city} · {provider.distance}km away
        </div>
        <div style={{ fontSize: 12, color: "#16a96a", fontWeight: 600, display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a96a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          {provider.contracted ? "Verified Partner · Accepting new patients" : "Accepting new patients"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {provider.tags.slice(0, 3).map(t => (
            <span key={t} style={{
              fontFamily: "Outfit, sans-serif", fontSize: 10.5, fontWeight: 600,
              color: "#1075ad", background: "rgba(16,117,173,0.07)",
              padding: "3px 9px", borderRadius: 100, border: "1px solid rgba(16,117,173,0.15)",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #e8eef2", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <span style={{ fontSize: 11.5, color: "#16a96a", fontWeight: 600 }}>
          ● {provider.hasCalendar ? "Available Today" : "Call to schedule"}
        </span>
        <button
          onClick={e => { e.stopPropagation(); router.push(`/providers/${provider.id}`); }}
          style={{
            fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 700,
            color: "#fff", background: "#1075ad",
            padding: "8px 16px", border: "none", borderRadius: 8,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            transition: "background .18s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#0b5e8c"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#1075ad"}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

// ─── FAQ ITEM ──────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e8eef2" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "18px 0", background: "none", border: "none", cursor: "pointer",
          fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14,
          color: open ? "#1075ad" : "#071e34", textAlign: "left" as const, gap: 12,
          transition: "color .2s",
        }}
      >
        {q}
        <svg
          width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke={open ? "#1075ad" : "#5a7085"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: "transform .22s", transform: open ? "rotate(180deg)" : "none" }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{ paddingBottom: 18, fontSize: 13.5, color: "#5a7085", lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function SpecialtyPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { specialty: slugParam } = router.query;

  const slug = Array.isArray(slugParam) ? slugParam[0] : (slugParam ?? "");
  const specialtyName = slugToDisplay(slug);
  const title = specialtyLabel(specialtyName);
  const singular = SPECIALTY_SINGULAR[specialtyName] || specialtyName;
  const content: SpecialtyContent = SPECIALTY_DATA[specialtyName] || DEFAULT_SPECIALTY_CONTENT;

  // ─── Filters ──────────────────────────────────────────────────────────────
  const [searchQuery,    setSearchQuery]    = useState("");
  const [locationInput,  setLocationInput]  = useState("");
  const [insuranceInput, setInsuranceInput] = useState("");
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterAvail,    setFilterAvail]    = useState(false);
  const [filterIns,      setFilterIns]      = useState(false);
  const [filterPrice,    setFilterPrice]    = useState(false);

  // ─── UI state ─────────────────────────────────────────────────────────────
  const [showAllProcs,   setShowAllProcs]   = useState(false);
  const [whenOpen,       setWhenOpen]       = useState(false);
  const [howOpen,        setHowOpen]        = useState(false);

  // ─── Last-reviewed date (auto-updates to current month/year) ──────────────
  const [reviewedDate,   setReviewedDate]   = useState("");
  useEffect(() => {
    setReviewedDate(new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }));
  }, []);

  // Base set
  const baseProviders = PROVIDERS.filter(p => !p.parentClinicId && matchesSpecialty(p, specialtyName));

  const filtered = baseProviders.filter(p => {
    if (filterVerified && !p.contracted) return false;
    if (filterAvail    && !p.hasCalendar) return false;
    if (insuranceInput.trim() && !p.contracted) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.specialty.toLowerCase().includes(q) &&
          !p.city.toLowerCase().includes(q) && !p.tags.some(t => t.toLowerCase().includes(q))) return false;
    }
    if (locationInput.trim()) {
      const loc = locationInput.trim().toLowerCase();
      if (!p.city.toLowerCase().includes(loc) && !p.address.toLowerCase().includes(loc)) return false;
    }
    return true;
  });
  const sorted = [...filtered.filter(p => p.contracted), ...filtered.filter(p => !p.contracted)];

  type Chip = "insurance" | "price" | "available" | "verified";
  const chipActive = (k: Chip) => ({ insurance: filterIns, price: filterPrice, available: filterAvail, verified: filterVerified }[k]);
  const toggleChip = (k: Chip) => {
    if (k === "insurance") setFilterIns(v => !v);
    if (k === "price")     setFilterPrice(v => !v);
    if (k === "available") setFilterAvail(v => !v);
    if (k === "verified")  setFilterVerified(v => !v);
  };

  const CHIPS: { k: Chip; label: string; icon: React.ReactNode }[] = [
    { k: "insurance", label: "Insurance",    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { k: "price",     label: "Price Range",  icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { k: "available", label: "Availability", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { k: "verified",  label: "Verified Only", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  ];

  if (!slug) return null;

  // ─── Shared section styles ─────────────────────────────────────────────────
  const sectionLabel = (text: string) => (
    <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#1075ad", marginBottom: 10 }}>{text}</div>
  );
  const sectionTitle = (node: React.ReactNode) => (
    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: isMobile ? 22 : 30, color: "#071e34", letterSpacing: "-0.02em", lineHeight: 1.15, maxWidth: 580 }}>{node}</div>
  );
  const sectionHeader = (label: string, title: React.ReactNode, btnText?: string, btnAction?: () => void) => (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
      <div>{sectionLabel(label)}{sectionTitle(title)}</div>
      {btnText && (
        <button onClick={btnAction}
          style={{ fontFamily: "Outfit, sans-serif", fontSize: 13.5, fontWeight: 600, color: "#1075ad", display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", border: "1.5px solid #1075ad", borderRadius: 8, background: "none", cursor: "pointer", whiteSpace: "nowrap" as const, transition: "all .2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#1075ad"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "#1075ad"; }}
        >{btnText}</button>
      )}
    </div>
  );

  return (
    <>
      <Head>
        <title>Find {title} Near You | Hospital.com</title>
        <meta name="description" content={`Browse verified ${title.toLowerCase()}, read real patient reviews, and book appointments online.`} />
      </Head>

      {/* ─── NAV ─────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "0 24px" : "0 48px", height: 68,
        borderBottom: "1px solid rgba(50,204,224,0.08)",
      }}>
        <button onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", padding: 0 }}>
          hospital<span style={{ color: "#32cce0" }}>.com</span>
        </button>
        {!isMobile && (
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["Find Local Care", "Global Health Services", "For Providers"].map((lbl, i) => (
              <button key={lbl} onClick={() => i === 0 ? router.push("/find-local-care") : undefined}
                style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: i === 0 ? "#32cce0" : "rgba(255,255,255,0.65)", padding: 0, transition: "color .2s" }}
                onMouseEnter={e => { if (i !== 0) (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={e => { if (i !== 0) (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)"; }}
              >{lbl}</button>
            ))}
            <button onClick={() => router.push("/find-local-care")}
              style={{ background: "#32cce0", color: "#071e34", border: "none", padding: "9px 20px", borderRadius: 8, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "background .15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#5cdaea"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#32cce0"}
            >Book Now</button>
          </div>
        )}
      </nav>

      {/* ─── BREADCRUMB ──────────────────────────────────────────────────────── */}
      <div style={{ background: "#f4f9fc", borderBottom: "1px solid #e8eef2", padding: "13px 0" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#5a7085", flexWrap: "wrap" }}>
          <button onClick={() => router.push("/find-local-care")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, color: "#1075ad", fontWeight: 500, padding: 0 }}>Find Local Care</button>
          <span style={{ opacity: 0.35 }}>›</span>
          <button onClick={() => router.push("/find-local-care")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, color: "#1075ad", fontWeight: 500, padding: 0 }}>Specialties</button>
          <span style={{ opacity: 0.35 }}>›</span>
          <span>{title}</span>
        </div>
      </div>

      {/* ─── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{
        background: "#f0fafe",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: isMobile ? "60px 24px 50px" : "80px 24px 70px",
        position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        {/* Radial gradient blobs */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 65% 70% at -5% 55%, rgba(50,204,224,0.25) 0%, transparent 55%), radial-gradient(ellipse 55% 65% at 105% 30%, rgba(16,117,173,0.16) 0%, transparent 55%), radial-gradient(ellipse 40% 50% at 100% 90%, rgba(50,204,224,0.1) 0%, transparent 50%)",
        }} />
        {/* Grid */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(16,117,173,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,117,173,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div style={{ position: "relative", width: "100%", maxWidth: 900 }}>
          {/* Label pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(50,204,224,0.12)", border: "1px solid rgba(50,204,224,0.35)", color: "#1075ad", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "6px 16px", borderRadius: 100, marginBottom: 24 }}>
            Find Local Care · Specialties
          </div>

          <h1 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: isMobile ? 32 : 54, color: "#071e34", lineHeight: 1.07, letterSpacing: "-0.03em", maxWidth: 820, margin: "0 auto", marginBottom: 16 }}>
            Find Trusted <em style={{ fontStyle: "italic", color: "#32cce0" }}>{title}</em> Near You
          </h1>
          <p style={{ color: "#5a7085", fontSize: isMobile ? 14 : 16, fontWeight: 400, margin: "0 auto 36px", maxWidth: 520, lineHeight: 1.7 }}>
            Compare verified {title.toLowerCase()}, read real patient reviews, and choose the right care — with confidence.
          </p>

          {/* Search card */}
          <div style={{
            width: "100%", maxWidth: 900, background: "#fff", borderRadius: 20,
            padding: 10, margin: "0 auto 14px",
            boxShadow: "0 8px 48px rgba(16,117,173,0.13), 0 0 0 1px rgba(16,117,173,0.08)",
            display: "flex", alignItems: "left",
            flexDirection: isMobile ? "column" : "row",
          }}>
            {[
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="17" y1="17" x2="22" y2="22"/></svg>,
                label: "Specialty / Procedure",
                child: <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={specialtyName}
                  style={{ border: "none", outline: "none", fontFamily: "DM Sans, Poppins, sans-serif", fontSize: 14.5, fontWeight: 500, color: "#112233", background: "transparent", width: "100%", padding: 0 }} />,
                flex: "1.2",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
                label: "Location",
                child: <input value={locationInput} onChange={e => setLocationInput(e.target.value)} placeholder="City or auto-detect…"
                  style={{ border: "none", outline: "none", fontFamily: "DM Sans, Poppins, sans-serif", fontSize: 14.5, color: "#a8bfcc", background: "transparent", width: "100%", padding: 0 }} />,
                flex: "1",
              },
              {
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
                label: "Insurance",
                child: <input value={insuranceInput} onChange={e => setInsuranceInput(e.target.value)} placeholder="Select plan…"
                  style={{ border: "none", outline: "none", fontFamily: "DM Sans, Poppins, sans-serif", fontSize: 14.5, color: insuranceInput ? "#112233" : "#a8bfcc", background: "transparent", width: "100%", padding: 0 }} />,
                flex: "0.7",
              },
            ].map((field, i) => (
              <div key={i} style={{
                flex: field.flex, display: "flex", alignItems: "flex-start", gap: 12,
                padding: "14px 18px",
                borderRight: !isMobile && i < 2 ? "1px solid #cce4f0" : "none",
                borderBottom: isMobile && i < 2 ? "1px solid #cce4f0" : "none",
                borderRadius: 12, cursor: "pointer", transition: "background .15s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#eef9fc"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
              >
                {field.icon}
                <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, textAlign: "left" }}>
                  <span style={{ fontFamily: "Outfit, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" as const, color: "#5a7085" }}>{field.label}</span>
                  {field.child}
                </div>
              </div>
            ))}
            <button
              style={{ background: "#32cce0", color: "#fff", border: "none", borderRadius: 13, padding: isMobile ? "14px" : "14px 28px", fontFamily: "Outfit, sans-serif", fontSize: 14.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexShrink: 0, whiteSpace: "nowrap" as const, transition: "opacity .2s, transform .15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="17" y1="17" x2="22" y2="22"/></svg>
              Search
            </button>
          </div>

          {/* Filter chips */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 14, marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: "#5a7085", fontWeight: 500 }}>Filter by:</span>
            {CHIPS.map(chip => {
              const active = chipActive(chip.k);
              return (
                <button key={chip.k} onClick={() => toggleChip(chip.k)}
                  style={{
                    fontSize: 13, fontWeight: 500, color: active ? "#1075ad" : "#112233",
                    background: active ? "rgba(50,204,224,0.07)" : "#fff",
                    border: `1px solid ${active ? "#32cce0" : "#cce4f0"}`,
                    borderRadius: 100, padding: "6px 14px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5,
                    fontFamily: "inherit", transition: "all .18s",
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.borderColor = "#32cce0"; (e.currentTarget as HTMLButtonElement).style.color = "#1075ad"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(50,204,224,0.07)"; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.borderColor = "#cce4f0"; (e.currentTarget as HTMLButtonElement).style.color = "#112233"; (e.currentTarget as HTMLButtonElement).style.background = "#fff"; } }}
                >
                  {chip.icon}{chip.label}
                </button>
              );
            })}
          </div>

          {/* Trust notes */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 14 : 20, flexWrap: "wrap" }}>
            {[
              { svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a96a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, text: "Verified providers" },
              { svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a96a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, text: "Real patient reviews" },
              { svg: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a96a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6l11 6 11-6"/><path d="M1 12l11 6 11-6"/><path d="M1 18l11 6 11-6"/></svg>, text: "Transparent information" },
            ].map(item => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#5a7085", fontWeight: 500 }}>
                {item.svg}{item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWED BADGE ─────────────────────────────────────────────────── */}
      {reviewedDate && (
        <div style={{ background: "#f4f9fc", borderBottom: "1px solid #e8eef2", padding: "10px 0" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#5a7085" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a96a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span><strong style={{ color: "#071e34", fontWeight: 600 }}>Medically reviewed</strong> by the Hospital.com Editorial Team</span>
            </div>
            <span style={{ color: "#cce4f0" }}>·</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5a7085" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5a7085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Last reviewed {reviewedDate}
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. TOP-RATED PROVIDERS ──────────────────────────────────────────── */}
      <section id="providers-section" style={{ background: "#f4f9fc", padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          {sectionHeader(
            "Social Proof",
            <>{`Top-Rated `}<em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>{title}</em>{` Near You`}</>,
            `View All ${title}`,
          )}

          {sorted.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(270px, 1fr))", gap: 20 }}>
              {sorted.map(p => <ProviderCard key={p.id} provider={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 14, border: "1.5px solid #e8eef2" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cce4f0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 14 }}><circle cx="11" cy="11" r="7"/><line x1="17" y1="17" x2="22" y2="22"/></svg>
              <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 18, fontWeight: 700, color: "#5a7085", marginBottom: 8 }}>No providers found</div>
              <div style={{ fontSize: 14, color: "#5a7085", marginBottom: 20 }}>Try adjusting your search or clearing filters.</div>
              <button onClick={() => { setSearchQuery(""); setLocationInput(""); setInsuranceInput(""); setFilterVerified(false); setFilterAvail(false); setFilterIns(false); setFilterPrice(false); }}
                style={{ padding: "10px 24px", background: "#32cce0", color: "#fff", border: "none", borderRadius: 8, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── 2b. STATS BAR (specialty-specific) ─────────────────────────────── */}
      {content.stats && (
        <section style={{ background: "#071e34", padding: isMobile ? "48px 24px" : "56px 48px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 32 : 0 }}>
              {content.stats.map((stat, i) => (
                <div key={stat.value} style={{ textAlign: "center", padding: isMobile ? 0 : "0 32px", borderLeft: !isMobile && i > 0 ? "1px solid rgba(50,204,224,0.15)" : "none" }}>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: isMobile ? 34 : 44, color: "#32cce0", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 10 }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, maxWidth: 180, margin: "0 auto" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 2c. WHAT TO EXPECT (specialty-specific) ────────────────────────── */}
      {content.steps && (
        <section style={{ background: "#fff", padding: isMobile ? "60px 24px" : "80px 48px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ marginBottom: 44 }}>
              {sectionLabel("Your First Visit")}
              {sectionTitle(<>What to Expect at Your <em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>First Appointment</em></>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: isMobile ? 20 : 0, position: "relative" }}>
              {/* Connecting line (desktop only) */}
              {!isMobile && (
                <div style={{ position: "absolute", top: 28, left: "12.5%", right: "12.5%", height: 2, background: "linear-gradient(90deg, #32cce0, #1075ad)", zIndex: 0 }} />
              )}
              {content.steps.map((step, i) => (
                <div key={step.num} style={{ position: "relative", zIndex: 1, padding: isMobile ? "20px" : "0 24px", background: isMobile ? "#f4f9fc" : "transparent", borderRadius: isMobile ? 12 : 0, border: isMobile ? "1.5px solid #e8eef2" : "none" }}>
                  {/* Step circle */}
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, #32cce0, #1075ad)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: "0 4px 20px rgba(50,204,224,0.3)", flexShrink: 0 }}>
                    <span style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 16, color: "#fff" }}>{step.num}</span>
                  </div>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#071e34", marginBottom: step.time ? 4 : 10 }}>{step.title}</div>
                  {step.time && (
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: "#1075ad", background: "rgba(16,117,173,0.07)", border: "1px solid rgba(16,117,173,0.15)", padding: "2px 10px", borderRadius: 100, display: "inline-block", marginBottom: 10 }}>{step.time}</div>
                  )}
                  <div style={{ fontSize: 13.5, color: "#5a7085", lineHeight: 1.7 }}>{step.desc}</div>
                </div>
              ))}
            </div>

            {/* Credentials sub-section */}
            {content.credentials && (
              <div style={{ marginTop: 56, padding: isMobile ? "24px" : "32px 36px", background: "#f4f9fc", borderRadius: 16, border: "1.5px solid #e8eef2" }}>
                <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16, color: "#071e34", marginBottom: 20 }}>
                  Credentials: what &ldquo;licensed acupuncturist&rdquo; means in the US and Canada
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24 }}>
                  {content.credentials.map(cred => (
                    <div key={cred.region} style={{ display: "flex", gap: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,117,173,0.08)", border: "1px solid rgba(16,117,173,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      </div>
                      <div>
                        <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 13.5, color: "#071e34", marginBottom: 6 }}>{cred.region}</div>
                        <div style={{ fontSize: 13, color: "#5a7085", lineHeight: 1.7 }}>{cred.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 3. ABOUT THIS SPECIALTY ─────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            {sectionLabel("About This Specialty")}
            {sectionTitle(<>About <em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>{specialtyName} Care</em></>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 60, alignItems: "start" }}>
            <div>
              {content.about.map((para, i) => (
                <p key={i} style={{ fontSize: 14.5, lineHeight: 1.8, color: "#5a7085", marginBottom: 16 }}>{para}</p>
              ))}
              {/* Accordion: When to see */}
              <div style={{ borderTop: "1px solid #e8eef2", marginTop: 24 }}>
                <button onClick={() => setWhenOpen(v => !v)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: whenOpen ? "#1075ad" : "#071e34", textAlign: "left", gap: 12, transition: "color .2s", borderBottom: whenOpen ? "none" : "1px solid #e8eef2" }}>
                  When should you see a {singular.toLowerCase()}?
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={whenOpen ? "#1075ad" : "#5a7085"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "transform .22s", transform: whenOpen ? "rotate(180deg)" : "none" }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {whenOpen && (
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, paddingBottom: 16, borderBottom: "1px solid #e8eef2" }}>
                    {content.whenToSee.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, color: "#5a7085", lineHeight: 1.6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#32cce0", flexShrink: 0, marginTop: 7 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Accordion: How to choose */}
              <div>
                <button onClick={() => setHowOpen(v => !v)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", background: "none", border: "none", cursor: "pointer", fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: howOpen ? "#1075ad" : "#071e34", textAlign: "left", gap: 12, transition: "color .2s", borderBottom: howOpen ? "none" : "1px solid #e8eef2" }}>
                  How to choose the right provider
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={howOpen ? "#1075ad" : "#5a7085"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: "transform .22s", transform: howOpen ? "rotate(180deg)" : "none" }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {howOpen && (
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, paddingBottom: 16, borderBottom: "1px solid #e8eef2" }}>
                    {["Check their credentials and board certification","Read verified patient reviews to understand their communication style","Confirm they treat your specific condition","Verify their insurance compatibility before booking","Look for providers who offer a thorough initial assessment"].map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13.5, color: "#5a7085", lineHeight: 1.6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#32cce0", flexShrink: 0, marginTop: 7 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, title: "Quick facts", items: content.facts },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: "Common conditions treated", items: content.conditions },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, title: "Average costs", items: content.costs },
              ].map(card => (
                <div key={card.title} style={{ background: "#f4f9fc", border: "1px solid #e8eef2", borderRadius: 12, padding: 20 }}>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14, color: "#071e34", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>{card.icon}{card.title}</div>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                    {card.items.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#5a7085", lineHeight: 1.5 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#1075ad", flexShrink: 0, marginTop: 7 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "#f4f9fc", padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ marginBottom: 44 }}>
            {sectionLabel("Common Questions")}
            {sectionTitle(<>Frequently Asked <em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>Questions</em></>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "0 40px" }}>
            <div>{content.faqs.slice(0, 3).map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}</div>
            <div>{content.faqs.slice(3).map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}</div>
          </div>
        </div>
      </section>

      {/* ─── 5. BROWSE BY LOCATION ───────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          {sectionHeader(
            "Browse by Area",
            <>{`Find ${title} by `}<em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>Location</em></>,
            "View All Locations",
          )}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {[
              { city: "New York",   count: "560" },
              { city: "Los Angeles",count: "480" },
              { city: "Chicago",    count: "290" },
              { city: "Miami",      count: "210" },
              { city: "Houston",    count: "187" },
              { city: "Boston",     count: "144" },
              { city: "Seattle",    count: "132" },
              { city: "Dallas",     count: "98"  },
            ].map(({ city, count }) => (
              <button key={city} onClick={() => { setLocationInput(city); document.getElementById("providers-section")?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "16px 18px", background: "#f4f9fc", border: "1.5px solid #e8eef2", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", transition: "all .18s" }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "#32cce0"; el.style.background = "#eef9fc"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 4px 24px rgba(16,117,173,0.09)"; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "#e8eef2"; el.style.background = "#f4f9fc"; el.style.transform = "none"; el.style.boxShadow = "none"; }}
              >
                <div>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14, color: "#071e34" }}>{city}</div>
                  <div style={{ fontSize: 12, color: "#5a7085", marginTop: 2 }}>{count}+ {title.toLowerCase()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. COMMON PROCEDURES ────────────────────────────────────────────── */}
      <section style={{ background: "#f4f9fc", padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          {sectionHeader(
            "Services & Procedures",
            <>Common <em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>{specialtyName}</em> Services</>,
            "Browse All Procedures",
          )}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {content.procedures.slice(0, showAllProcs ? undefined : 4).map((proc, idx) => {
              const icons = [
                <svg key={0} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
                <svg key={1} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/></svg>,
                <svg key={2} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
                <svg key={3} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/></svg>,
                <svg key={4} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
                <svg key={5} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
                <svg key={6} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
                <svg key={7} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1075ad" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="4"/></svg>,
              ];
              return (
                <div key={proc.name}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px", background: "#fff", border: "1.5px solid #e8eef2", borderRadius: 12, cursor: "pointer", transition: "all .2s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#1075ad"; el.style.boxShadow = "0 4px 24px rgba(16,117,173,0.09)"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#e8eef2"; el.style.boxShadow = "none"; el.style.transform = "none"; }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#eef9fc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {icons[idx % icons.length]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14, color: "#071e34", marginBottom: 2 }}>{proc.name}</div>
                    <div style={{ fontSize: 12, color: "#5a7085", lineHeight: 1.4 }}>{proc.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
          {content.procedures.length > 4 && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => setShowAllProcs(v => !v)}
                style={{ fontSize: 13.5, fontWeight: 600, color: "#1075ad", background: "none", border: "1.5px solid #1075ad", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 7, transition: "all .18s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#1075ad"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "#1075ad"; }}>
                {showAllProcs ? "Show fewer" : `Show all ${content.procedures.length} services`}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transition: "transform .2s", transform: showAllProcs ? "rotate(180deg)" : "none" }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── 5. INSURANCE ────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          {sectionHeader(
            "Insurance & Coverage",
            <>Find {title} That Accept <em style={{ fontStyle: "italic", color: "#1075ad", fontWeight: 800 }}>Your Insurance</em></>,
            "All Insurance Plans",
          )}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { abbr: "SL",  name: "Sun Life",         color: "#0369a1" },
              { abbr: "MN",  name: "Manulife",          color: "#15803d" },
              { abbr: "BC",  name: "Blue Cross",        color: "#1a56db" },
              { abbr: "GWL", name: "Great-West Life",   color: "#9333ea" },
              { abbr: "EMP", name: "Empire Life",       color: "#b45309" },
              { abbr: "IAF", name: "iA Financial",      color: "#0f766e" },
              { abbr: "SSQ", name: "SSQ Insurance",     color: "#b91c1c" },
              { abbr: "DEJ", name: "Desjardins",        color: "#1d4ed8" },
            ].map(ins => (
              <div key={ins.name}
                onClick={() => { setInsuranceInput(ins.name); document.getElementById("providers-section")?.scrollIntoView({ behavior: "smooth" }); }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "#f4f9fc", border: "1.5px solid #e8eef2", borderRadius: 10, cursor: "pointer", transition: "all .18s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#32cce0"; el.style.background = "#eef9fc"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 4px 24px rgba(16,117,173,0.09)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#e8eef2"; el.style.background = "#f4f9fc"; el.style.transform = "none"; el.style.boxShadow = "none"; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: ins.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 12, color: "#fff", flexShrink: 0 }}>
                  {ins.abbr}
                </div>
                <div>
                  <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 13.5, color: "#071e34" }}>{ins.name}</div>
                  <div style={{ fontSize: 11.5, color: "#5a7085", marginTop: 1 }}>200+ {title.toLowerCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. WHY HOSPITAL.COM ─────────────────────────────────────────────── */}
      <section style={{ background: "#071e34", padding: isMobile ? "60px 24px" : "80px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(50,204,224,0.08) 0%, transparent 60%)" }} />
        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#32cce0", marginBottom: 10 }}>Why Us</div>
            <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: isMobile ? 24 : 34, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, maxWidth: "100%" }}>
              Why Use Hospital.com to Find a <em style={{ fontStyle: "italic", color: "#1075ad" }}>{singular}</em>?
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)", gap: 0 }}>
            {[
              { svg: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#32cce0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, title: "Verified Providers", desc: "Every provider is credentialed and background-checked before listing." },
              { svg: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#32cce0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, title: "Real Patient Reviews", desc: "Aggregated from multiple sources — unfiltered, verified, and honest." },
              { svg: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#32cce0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6l11 6 11-6"/><path d="M1 12l11 6 11-6"/></svg>, title: "Transparent Information", desc: "Credentials, services, and pricing — clearly laid out before you book." },
              { svg: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#32cce0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, title: "Easy Comparison", desc: "Compare providers side-by-side by rating, location, and availability." },
              { svg: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#32cce0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, title: "Insurance Compatible", desc: "Filter by your plan to avoid surprise out-of-pocket costs at the door." },
            ].map((b, i) => (
              <div key={b.title} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: isMobile ? "0 12px" : "0 24px", position: "relative", borderLeft: !isMobile && i > 0 ? "1px solid rgba(50,204,224,0.14)" : "none" }}>
                <div style={{ marginBottom: 20 }}>{b.svg}</div>
                <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 8 }}>{b.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.6, maxWidth: 170 }}>{b.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 52, flexWrap: "wrap" }}>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #32cce0, #1075ad)", color: "#fff", padding: "14px 28px", border: "none", borderRadius: 10, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14.5, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
            >Find a {singular}</button>
            <button style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.06)", color: "#fff", padding: "14px 28px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14.5, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"}
            >How It Works</button>
          </div>
        </div>
      </section>

      {/* ─── 9. PROVIDER CTA ─────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(160deg, #eaf8fc 0%, #f0f9ff 40%, #e8f4fb 100%)", borderTop: "1px solid #e8eef2", padding: isMobile ? "64px 24px" : "88px 48px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #32cce0, #1075ad)" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#1075ad", fontFamily: "Outfit, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 16, background: "rgba(16,117,173,0.07)", border: "1px solid rgba(16,117,173,0.15)", padding: "5px 14px", borderRadius: 100 }}>
            For {specialtyName} Providers
          </div>
          <h2 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: isMobile ? 26 : 38, color: "#071e34", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 14 }}>
            Are You a {singular}? <em style={{ fontStyle: "italic", color: "#1075ad" }}>Join Hospital.com.</em>
          </h2>
          <p style={{ color: "#5a7085", fontSize: 15.5, lineHeight: 1.75, maxWidth: 520, marginBottom: 32 }}>
            Connect with new patients, grow your practice visibility, and build trust through a verified profile — all in one place. Thousands of providers already trust Hospital.com.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={() => router.push("/become-provider")} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #1075ad, #0b5e8c)", color: "#fff", padding: "14px 28px", border: "none", borderRadius: 10, fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 14.5, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              Join as a Provider
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 8, color: "#1075ad", padding: "14px 24px", border: "1.5px solid #1075ad", borderRadius: 10, background: "none", fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14.5, cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#1075ad"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "#1075ad"; }}
            >Learn More</button>
          </div>
        </div>
      </section>

      {/* ─── 10. SEO FOOTER NAV ──────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderTop: "1px solid #e8eef2", padding: isMobile ? "48px 24px" : "56px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 40 }}>
            {[
              { heading: "Related Specialties", links: ["Physiotherapists", "Massage Therapists", "Orthopedic Surgeons", "Sports Medicine Doctors", "Neurologists", "General Practitioners", "Osteopaths"] },
              { heading: "Related Procedures", links: ["Annual Physical", "Blood Test", "Diagnostic Imaging", "Initial Assessment", "Treatment Plan", "Follow-up Visit", "Consultation"] },
              { heading: "Nearby Locations", links: [`${title} in New York`, `${title} in Los Angeles`, `${title} in Chicago`, `${title} in Miami`, `${title} in Houston`, `${title} in Boston`, `${title} in Seattle`] },
              { heading: "Popular Insurance", links: ["Sun Life Providers", "Manulife Providers", "Blue Cross Providers", "Great-West Life Providers", "Desjardins Providers", "Empire Life Providers", "iA Financial Providers"] },
            ].map(col => (
              <div key={col.heading}>
                <h4 style={{ fontFamily: "Outfit, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#071e34", marginBottom: 16, paddingBottom: 10, borderBottom: "2px solid #32cce0", display: "inline-block" }}>{col.heading}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {col.links.map(link => (
                    <li key={link}>
                      <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: "#5a7085", padding: 0, textAlign: "left" as const, transition: "color .18s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#1075ad"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#5a7085"}
                      >{link}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
