// ─── INSURANCE CARRIERS DATA ─────────────────────────────────────────────────
export interface InsuranceCarrier {
  name: string;
  color: string;
  plans: string[];
}

const INSURANCE_CARRIERS: InsuranceCarrier[] = [
  { name:"Aetna", color:"#7B2D8E", plans:["Aetna Choice POS II","Aetna HMO","Aetna PPO","Aetna Medicare Advantage","Aetna Open Access"] },
  { name:"BlueCross BlueShield", color:"#0073CF", plans:["BCBS PPO","BCBS HMO","BCBS Blue Card","BCBS Federal","BCBS Medicare Supplement"] },
  { name:"Cigna", color:"#E87722", plans:["Cigna PPO","Cigna HMO","Cigna Open Access Plus","Cigna EPO","Cigna Medicare Advantage"] },
  { name:"UnitedHealthcare", color:"#002677", plans:["UHC Choice Plus","UHC Navigate","UHC Options PPO","UHC Medicare Advantage","UHC Dual Complete"] },
  { name:"Medicare", color:"#00548E", plans:["Medicare Part A","Medicare Part B","Medicare Advantage","Medigap"] },
  { name:"Humana", color:"#39B54A", plans:["Humana PPO","Humana HMO","Humana Gold Plus","Humana Medicare Advantage"] },
  { name:"Kaiser Permanente", color:"#006BA6", plans:["Kaiser HMO","Kaiser Medicare"] },
  { name:"Medicaid", color:"#5C7A29", plans:["Medicaid Managed Care","Medicaid Fee-for-Service"] },
  { name:"Anthem", color:"#0033A0", plans:["Anthem PPO","Anthem HMO","Anthem Blue Access"] },
  { name:"Oscar Health", color:"#FF6600", plans:["Oscar PPO","Oscar EPO"] },
  { name:"Tricare", color:"#003F72", plans:["Tricare Prime","Tricare Select","Tricare for Life"] },
  { name:"Molina", color:"#8DC63F", plans:["Molina Marketplace","Molina Medicaid"] },
];

export default INSURANCE_CARRIERS;
