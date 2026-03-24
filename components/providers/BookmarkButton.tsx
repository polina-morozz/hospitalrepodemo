import { useRouter } from "next/router";
import C from "@/lib/tokens";

// ─── BOOKMARK ICON ────────────────────────────────────────────────────────────
interface BookmarkIconProps {
  filled?: boolean;
  size?: number;
}
export function BookmarkIcon({ filled, size = 18 }: BookmarkIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? C.teal : "none"} stroke={filled ? C.teal : C.textSm} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

// ─── BOOKMARK BUTTON ──────────────────────────────────────────────────────────
interface BookmarkButtonProps {
  providerId: number;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  isLoggedIn: boolean;
  size?: number;
}
export default function BookmarkButton({ providerId, bookmarks, toggleBookmark, isLoggedIn, size = 18 }: BookmarkButtonProps) {
  const router = useRouter();
  const isBookmarked = bookmarks.includes(providerId);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push("/signup");
      return;
    }
    toggleBookmark(providerId);
  };
  return (
    <button className="bookmark-btn" onClick={handleClick} title={isLoggedIn ? (isBookmarked ? "Remove bookmark" : "Bookmark this provider") : "Sign up to bookmark"}
      style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <BookmarkIcon filled={isBookmarked} size={size} />
    </button>
  );
}
