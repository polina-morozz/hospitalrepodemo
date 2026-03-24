import { useState, ChangeEvent, ReactNode } from "react";
import C from "@/lib/tokens";

// ─── FIELD INPUT ──────────────────────────────────────────────────────────────
interface FieldInputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  hint?: ReactNode;
  right?: ReactNode;
}
export default function FieldInput({ label, type, value, onChange, placeholder, hint, right }: FieldInputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom:14 }}>
      {label && (
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <label style={{ fontSize:12, fontWeight:700, color:C.text }}>{label}</label>
          {hint}
        </div>
      )}
      <div style={{ position:"relative" }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ width:"100%", padding: right ? "10px 44px 10px 13px" : "10px 13px", border:`1.5px solid ${focus?C.teal:C.border}`, borderRadius:9, fontSize:14, outline:"none", fontFamily:"inherit", transition:"border-color .15s", color:C.text, background:C.white }}
          onFocus={()=>setFocus(true)}
          onBlur={()=>setFocus(false)}
        />
        {right}
      </div>
    </div>
  );
}
