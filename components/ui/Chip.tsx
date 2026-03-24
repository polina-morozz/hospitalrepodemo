import C from "@/lib/tokens";

// ─── Chip ─────────────────────────────────────────────────────────────────────
interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  color?: string;
}
export default function Chip({ label, active, onClick, color }: ChipProps) {
  return (
    <button onClick={onClick} style={{ padding:"5px 13px", border:`1.5px solid ${active?(color||C.teal):C.border}`, borderRadius:20, background:active?(color?color+"15":C.tealLt):C.white, color:active?(color||C.teal):C.textSm, fontSize:12, cursor:"pointer", fontWeight:active?700:400, fontFamily:"inherit", transition:"all .15s" }}>
      {label}
    </button>
  );
}
