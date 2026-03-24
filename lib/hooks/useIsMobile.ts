import { useState, useEffect } from "react";

// ─── useIsMobile HOOK ─────────────────────────────────────────────────────────
export default function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(window.innerWidth <= 700);
    const mq = window.matchMedia("(max-width: 700px)");
    const h = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}
