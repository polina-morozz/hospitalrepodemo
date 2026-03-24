// ─── SealBadge ────────────────────────────────────────────────────────────────
interface SealBadgeProps {
  small?: boolean;
}
export default function SealBadge({ small }: SealBadgeProps) {
  return (
    <span title="Verified by Hospital.com" style={{ display:"inline-flex", alignItems:"center", gap:small?3:4, background:"linear-gradient(135deg, #13527a, #46c4d9)", color:"#fff", fontSize:small?9:11, fontWeight:700, padding:small?"2px 7px":"3px 10px", borderRadius:20, letterSpacing:.3, whiteSpace:"nowrap", cursor:"default" }}>
      <svg width={small?10:12} height={small?10:12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
      {small ? "Verified" : "Hospital.com Verified"}
    </span>
  );
}
