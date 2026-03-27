// ─── INTERNATIONAL CLINICS DATA ───────────────────────────────────────────────
export interface IntlClinic {
  id: number;
  name: string;
  country: string;
  city: string;
  flag: string;
  procedures: string[];
  description: string;
  image: string;
  photo: string;
  rating: number;
  reviews: number;
}

const INTL_CLINICS: IntlClinic[] = [
  { id:101, name:"Estetik International", country:"Turkey", city:"Istanbul", flag:"🇹🇷", procedures:["Hair Transplant","Rhinoplasty","Liposuction","Dental Veneers"], description:"One of Turkey's largest accredited medical aesthetic centers, recognized internationally for hair restoration and cosmetic surgery with over 20 years of experience.", image:"EI", photo:"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=500&fit=crop&q=85", rating:4.8, reviews:1240 },
  { id:102, name:"Bumrungrad International", country:"Thailand", city:"Bangkok", flag:"🇹🇭", procedures:["Cardiac Surgery","Orthopedics","Oncology","General Surgery"], description:"A JCI-accredited hospital recognized among Asia's leading medical centers, treating over 1.1 million patients annually including 520,000 international patients.", image:"BI", photo:"https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&h=500&fit=crop&q=85", rating:4.9, reviews:3100 },
  { id:103, name:"Charité – Universitätsmedizin", country:"Germany", city:"Berlin", flag:"🇩🇪", procedures:["Neurology","Cancer Treatment","Cardiac Surgery","Rare Diseases"], description:"Germany's largest university hospital and one of Europe's most prestigious medical institutions, offering cutting-edge diagnostics and specialist treatments.", image:"CH", photo:"https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop&q=85", rating:4.9, reviews:890 },
  { id:104, name:"Apollo Hospitals", country:"India", city:"Chennai", flag:"🇮🇳", procedures:["Cardiac Surgery","Bone Marrow Transplant","Liver Transplant","Orthopedics"], description:"India's largest healthcare group, JCI-accredited, providing world-class tertiary care at significantly lower costs than Western countries.", image:"AH", photo:"https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=500&fit=crop&q=85", rating:4.7, reviews:2700 },
  { id:105, name:"Quirónsalud Barcelona", country:"Spain", city:"Barcelona", flag:"🇪🇸", procedures:["IVF","Dental Implants","Orthopedics","Ophthalmology"], description:"Spain's leading private hospital group offering fertility treatments, dental care, and surgical procedures with multilingual staff across 50+ centers.", image:"QB", photo:"https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&h=500&fit=crop&q=85", rating:4.6, reviews:640 },
  { id:106, name:"Samsung Medical Center", country:"South Korea", city:"Seoul", flag:"🇰🇷", procedures:["Cancer Treatment","Robotic Surgery","Cardiology","Stem Cell Therapy"], description:"One of Asia's top-ranked hospitals known for advanced robotic surgery and cancer treatment programs, consistently ranked among the world's best.", image:"SM", photo:"https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&h=500&fit=crop&q=85", rating:4.9, reviews:1870 },
  { id:107, name:"Medicover Dental Warsaw", country:"Poland", city:"Warsaw", flag:"🇵🇱", procedures:["Dental Implants","Veneers","Full Mouth Rehabilitation","Orthodontics"], description:"Premium dental care clinic offering European-standard treatments at 40–60% lower cost than the UK, US, or Canada, with English-speaking staff.", image:"MD", photo:"https://images.unsplash.com/photo-1629909615957-0ec2d4dde79b?w=800&h=500&fit=crop&q=85", rating:4.7, reviews:520 },
  { id:108, name:"Clinique des Cèdres", country:"France", city:"Toulouse", flag:"🇫🇷", procedures:["Bariatric Surgery","Cardiac Surgery","Orthopedics","Neurosurgery"], description:"Internationally recognized French private hospital offering specialist surgeries with state-of-the-art facilities and post-operative rehabilitation programs.", image:"CC", photo:"https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800&h=500&fit=crop&q=85", rating:4.8, reviews:390 },
];

export default INTL_CLINICS;
