"use client";

import { SteamUser } from "@/lib/session";
import { createContext, useContext, useEffect, useState } from "react";

interface SessionContextType {
  user: SteamUser | null;
  isLoggedIn: boolean;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  isLoggedIn: false,
  loading: true
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionContextType>({
    user: null,
    isLoggedIn: false,
    loading: true
  });

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setSession({
            user: data.user || null,
            isLoggedIn: data.isLoggedIn || false,
            loading: false
          });
        } else {
          setSession({
            user: null,
            isLoggedIn: false,
            loading: false
          });
        }
      } catch (error) {
        console.error("Session check error:", error);
        setSession({
          user: null,
          isLoggedIn: false,
          loading: false
        });
      }
    }

    checkSession();
  }, []);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
