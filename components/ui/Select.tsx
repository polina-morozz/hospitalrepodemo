import { useState, useRef, useEffect } from "react";
import C from "@/lib/tokens";

// ─── CUSTOM SELECT ────────────────────────────────────────────────────────────
type SelectOption = string | { value: string; label: string };

interface SelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  minWidth?: number;
}
export default function Select({ value, onChange, options, placeholder, minWidth }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = options.find(o => (typeof o === "object" ? o.value : o) === value);
  const label = current ? (typeof current === "object" ? current.label : current) : placeholder ?? "Select…";

  return (
    <div ref={ref} style={{ position:"relative", minWidth: minWidth || 120 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8,
          padding:"8px 12px 8px 14px", border:`1.5px solid ${open ? C.teal : C.border}`,
          borderRadius:22, background:open ? C.tealLt : C.white, cursor:"pointer",
          fontSize:13, fontWeight:500, color: open ? C.teal : C.textMd,
          fontFamily:"inherit", transition:"all .15s", whiteSpace:"nowrap",
          boxShadow: open ? `0 0 0 3px ${C.teal}18` : "none",
        }}
      >
        <span>{label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ flexShrink:0, transition:"transform .18s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>
      {open && (
        <div className="fade-up" style={{
          position:"absolute", top:"calc(100% + 6px)", left:0, minWidth:"100%",
          background:C.white, border:`1px solid ${C.border}`, borderRadius:16,
          boxShadow:"0 12px 36px rgba(0,0,0,.12)", zIndex:999, overflow:"hidden", padding:"6px",
        }}>
          {options.map(o => {
            const val = typeof o === "object" ? o.value : o;
            const lbl = typeof o === "object" ? o.label : o;
            const selected = val === value;
            return (
              <button key={val} onClick={() => { onChange(val); setOpen(false); }}
                style={{
                  display:"flex", alignItems:"center", gap:8, width:"100%", textAlign:"left", padding:"10px 14px",
                  background: selected ? C.tealLt : "transparent",
                  color: selected ? C.teal : C.text,
                  fontWeight: selected ? 700 : 500,
                  fontSize:14, border:"none", borderRadius:11, cursor:"pointer",
                  fontFamily:"inherit", transition:"background .12s",
                }}
                onMouseEnter={e => { if(!selected) (e.currentTarget as HTMLButtonElement).style.background = C.gray; }}
                onMouseLeave={e => { if(!selected) (e.currentTarget as HTMLButtonElement).style.background = selected ? C.tealLt : "transparent"; }}
              >
                {selected && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="3" style={{ flexShrink:0 }}><polyline points="20,6 9,17 4,12"/></svg>}
                {lbl}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
