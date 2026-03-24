import { createContext, useContext, useState, ReactNode } from "react";

// ─── APP CONTEXT ──────────────────────────────────────────────────────────────
interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  bookings: unknown[];
  setBookings: React.Dispatch<React.SetStateAction<unknown[]>>;
  initialQuery: string;
  setInitialQuery: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [bookings, setBookings] = useState<unknown[]>([]);
  const [initialQuery, setInitialQuery] = useState("");

  function toggleBookmark(id: number) {
    setBookmarks(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  }

  return (
    <AppContext.Provider value={{
      isLoggedIn, setIsLoggedIn,
      bookmarks, toggleBookmark,
      bookings, setBookings,
      initialQuery, setInitialQuery,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export default AppContext;
