// ─── PROVIDERS DATA ───────────────────────────────────────────────────────────
export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  rating: number;
  reviews: number;
}

export interface Provider {
  id: number;
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
  branches?: Branch[];
}

const PROVIDERS: Provider[] = [
  { id:1, name:"Dr. Sarah Mitchell", specialty:"Family Medicine", rating:4.8, reviews:312, distance:0.8, city:"New York", address:"120 E 36th St", hours:"Mon–Fri 9–5", phone:"+1 212-555-0192", image:"SM", photo:"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face", tags:["Family Medicine","Preventive Care"], contracted:true, hasCalendar:true, amenities:["Wheelchair Accessible","Wi-Fi","Parking"] },
  { id:2, name:"Dr. James Okafor", specialty:"Cardiology", rating:4.9, reviews:187, distance:1.2, city:"New York", address:"340 E 72nd St", hours:"Tue–Sat 10–6", phone:"+1 212-555-0234", image:"JO", photo:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face", tags:["Cardiology","Internal Medicine"], contracted:true, hasCalendar:true, amenities:["Wheelchair Accessible","Parking"] },
  { id:3, name:"Dr. Elena Vasquez", specialty:"Dermatology", rating:4.7, reviews:421, distance:2.1, city:"Los Angeles", address:"8635 W 3rd St, Ste 200", hours:"Mon–Thu 8–4", phone:"+1 310-555-0311", image:"EV", photo:"https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=150&h=150&fit=crop&crop=face", tags:["Dermatology","Cosmetic"], contracted:false, hasCalendar:false, amenities:[] },
  { id:4, name:"Glow Medical Spa", specialty:"Medical Aesthetics", rating:4.6, reviews:530, distance:1.5, city:"Miami", address:"1395 Brickell Ave, Ste 800", hours:"Daily 10–7", phone:"+1 305-555-0445", image:"GM", photo:"https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=150&h=150&fit=crop&crop=face", tags:["Botox","Injectables","Skin Care"], contracted:true, hasCalendar:true, amenities:["Wi-Fi","Parking","Wheelchair Accessible","Private Rooms"], branches:[
    { id:"4a", name:"Glow Medical Spa — Brickell", address:"1395 Brickell Ave, Ste 800", city:"Miami, FL", phone:"+1 305-555-0445", hours:"Daily 10–7", rating:4.6, reviews:340 },
    { id:"4b", name:"Glow Medical Spa — Wynwood", address:"2520 NW 2nd Ave", city:"Miami, FL", phone:"+1 305-555-0446", hours:"Mon–Sat 9–6", rating:4.5, reviews:190 },
  ] },
  { id:5, name:"Dr. Amir Patel", specialty:"Orthopedics", rating:4.5, reviews:203, distance:3.4, city:"Chicago", address:"680 N Lake Shore Dr", hours:"Mon–Fri 8–3", phone:"+1 312-555-0678", image:"AP", photo:"https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face", tags:["Orthopedics","Sports Medicine"], contracted:true, hasCalendar:false, amenities:["Parking","Wheelchair Accessible"] },
  { id:6, name:"Dr. Priya Sharma", specialty:"Cardiology", rating:4.3, reviews:156, distance:4.2, city:"Houston", address:"6624 Fannin St", hours:"MWF 9–4", phone:"+1 713-555-0789", image:"PS", photo:"https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=150&h=150&fit=crop&crop=face", tags:["Cardiology","Echocardiography"], contracted:false, hasCalendar:false, amenities:[] },
  { id:7, name:"CityHealth Clinic", specialty:"Family Medicine", rating:4.2, reviews:89, distance:5.1, city:"Los Angeles", address:"4835 Van Nuys Blvd, Ste 105", hours:"Daily 8–8", phone:"+1 818-555-0890", image:"CH", photo:"https://images.unsplash.com/photo-1666214280557-091e285b2bba?w=150&h=150&fit=crop&crop=face", tags:["Family Medicine","Walk-in"], contracted:false, hasCalendar:false, amenities:[] },
];

export default PROVIDERS;
