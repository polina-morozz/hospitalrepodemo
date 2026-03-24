import C from "@/lib/tokens";
import { ReactNode } from "react";

// ─── BADGE ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode;
  color?: string;
  bg?: string;
  small?: boolean;
}
export function Badge({ children, color = C.teal, bg = C.tealLt, small }: BadgeProps) {
  return (
    <span style={{ background:bg, color, fontSize:small?9:10, fontWeight:700, padding:small?"1px 6px":"2px 9px", borderRadius:20, letterSpacing:.4, whiteSpace:"nowrap" }}>
      {children}
    </span>
  );
}

// ─── CHIP ─────────────────────────────────────────────────────────────────────
interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  color?: string;
}
export function Chip({ label, active, onClick, color }: ChipProps) {
  return (
    <button onClick={onClick} style={{ padding:"5px 13px", border:`1.5px solid ${active?(color||C.teal):C.border}`, borderRadius:20, background:active?(color?color+"15":C.tealLt):C.white, color:active?(color||C.teal):C.textSm, fontSize:12, cursor:"pointer", fontWeight:active?700:400, fontFamily:"inherit", transition:"all .15s" }}>
      {label}
    </button>
  );
}

// ─── SEAL BADGE ──────────────────────────────────────────────────────────────
interface SealBadgeProps {
  small?: boolean;
}
export function SealBadge({ small }: SealBadgeProps) {
  return (
    <span title="Verified by Hospital.com" style={{ display:"inline-flex", alignItems:"center", gap:small?3:4, background:"linear-gradient(135deg, #13527a, #46c4d9)", color:"#fff", fontSize:small?9:11, fontWeight:700, padding:small?"2px 7px":"3px 10px", borderRadius:20, letterSpacing:.3, whiteSpace:"nowrap", cursor:"default" }}>
      <svg width={small?10:12} height={small?10:12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
      {small ? "Verified" : "Hospital.com Verified"}
    </span>
  );
}
