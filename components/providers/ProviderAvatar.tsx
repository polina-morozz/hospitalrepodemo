import { useState } from "react";
import C from "@/lib/tokens";
import type { Provider } from "@/lib/data/providers";

// ─── PROVIDER AVATAR ──────────────────────────────────────────────────────────
interface ProviderAvatarProps {
  provider: Provider;
  size?: number;
  radius?: number;
  fontSize?: number;
}
export default function ProviderAvatar({ provider, size=48, radius=12, fontSize=15 }: ProviderAvatarProps) {
  const [imgError, setImgError] = useState(false);
  if (provider.photo && !imgError) {
    return (
      <div style={{ width:size, height:size, borderRadius:radius, overflow:"hidden", flexShrink:0, border:`1px solid ${C.borderLt}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={provider.photo} alt={provider.name} onError={()=>setImgError(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
      </div>
    );
  }
  return (
    <div style={{ width:size, height:size, borderRadius:radius, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize, color:C.teal, flexShrink:0, border:`1px solid ${C.tealLt}` }}>
      {provider.image}
    </div>
  );
}
