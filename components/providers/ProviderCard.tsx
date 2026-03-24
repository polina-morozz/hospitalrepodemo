import C from "@/lib/tokens";
import ProviderAvatar from "@/components/providers/ProviderAvatar";
import BookmarkButton from "@/components/providers/BookmarkButton";
import { SealBadge } from "@/components/ui/Badge";
import type { Provider } from "@/lib/data/providers";

// ─── PROVIDER CARD ────────────────────────────────────────────────────────────
interface ProviderCardProps {
  provider: Provider;
  onClick: (provider: Provider) => void;
  onNameClick?: (provider: Provider) => void;
  compact?: boolean;
  bookmarks?: number[];
  toggleBookmark?: (id: number) => void;
  isLoggedIn?: boolean;
}
export default function ProviderCard({ provider, onClick, onNameClick, compact, bookmarks, toggleBookmark, isLoggedIn }: ProviderCardProps) {
  return (
    <div className="card" onClick={()=>onClick(provider)} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:compact?"12px 14px":"18px 20px", cursor:"pointer", display:"flex", gap:14, alignItems:"flex-start", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
      <ProviderAvatar provider={provider} size={compact?42:52} radius={12} fontSize={compact?13:17} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:2 }}>
          <span
            onClick={onNameClick ? (e)=>{e.stopPropagation();onNameClick(provider);} : undefined}
            style={{ fontWeight:700, fontSize:compact?13.5:15, color:onNameClick?C.teal:C.text, cursor:onNameClick?"pointer":"inherit", transition:"color .15s" }}
            onMouseEnter={onNameClick?e=>{(e.currentTarget as HTMLSpanElement).style.textDecoration="underline";}:undefined}
            onMouseLeave={onNameClick?e=>{(e.currentTarget as HTMLSpanElement).style.textDecoration="none";}:undefined}
          >
            {provider.name}
          </span>
          {provider.contracted && <SealBadge small />}
        </div>
        <div style={{ color:C.textSm, fontSize:12.5, marginBottom:6 }}>{provider.specialty}</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <span style={{ fontSize:12, color:C.amber }}>★ {provider.rating}</span>
          <span style={{ fontSize:12, color:C.textSm }}>({provider.reviews})</span>
          {!compact && <span style={{ fontSize:12, color:C.textSm }}>{provider.distance < 10 ? `${provider.distance} km` : "Global"}</span>}
          {!compact && <span style={{ fontSize:12, color:C.textSm }}>{provider.city}</span>}
        </div>
        {!compact && (
          <div style={{ display:"flex", gap:5, marginTop:10, flexWrap:"wrap" }}>
            {provider.tags.map(t=><span key={t} style={{ background:C.gray, color:C.textSm, fontSize:11, padding:"2px 8px", borderRadius:10 }}>{t}</span>)}
          </div>
        )}
      </div>
      {bookmarks && toggleBookmark && (
        <BookmarkButton providerId={provider.id} bookmarks={bookmarks} toggleBookmark={toggleBookmark} isLoggedIn={isLoggedIn ?? false} size={compact?16:18} />
      )}
    </div>
  );
}
