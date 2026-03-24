// ─── FACILITATORS DATA ────────────────────────────────────────────────────────
export interface Facilitator {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  city: string;
  image: string;
  tags: string[];
  contracted: boolean;
  countries: string[];
  languages: string[];
  procedures: string[];
}

const FACILITATORS: Facilitator[] = [
  { id:10, name:"MedTravel Facilitators", rating:4.9, reviews:98, city:"New York", image:"MT", tags:["Hair Transplant","Cosmetic Surgery","International"], contracted:true, countries:["Turkey","Thailand","Poland"], languages:["EN","FR","TR"], procedures:["Hair Transplant","Rhinoplasty","Dental"] },
  { id:11, name:"GlobalCare Connect", rating:4.7, reviews:145, city:"Los Angeles", image:"GC", tags:["Dental","Cosmetic","Eastern Europe"], contracted:true, countries:["Hungary","Czech Republic","Thailand"], languages:["EN","DE"], procedures:["Dental","Cosmetic Surgery","Orthopedics"] },
  { id:12, name:"HealthBridge International", rating:4.8, reviews:211, city:"Miami", image:"HB", tags:["Cardiac","Oncology","Complex Surgery"], contracted:true, countries:["Germany","India","South Korea"], languages:["EN","HI","KO"], procedures:["Cardiac Surgery","Cancer Treatment","Joint Replacement"] },
  { id:13, name:"MediRoute Global", rating:4.6, reviews:77, city:"Houston", image:"MR", tags:["Fertility","Ophthalmology","Dental"], contracted:false, countries:["Spain","Cyprus","Mexico"], languages:["EN","FR","ES"], procedures:["IVF","LASIK","Dental Implants"] },
];

export default FACILITATORS;
