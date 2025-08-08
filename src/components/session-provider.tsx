"use client";

import { SteamUser } from "@/lib/session";
import { createContext, useContext, useEffect, useState } from "react";

interface SessionContextType {
  user: SteamUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  logout: async () => {}
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionContextType>({
    user: null,
    isLoggedIn: false,
    loading: true,
    logout: async () => {}
  });

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout");
      if (response.ok) {
        // Clear session state immediately
        setSession((prev) => ({
          ...prev,
          user: null,
          isLoggedIn: false,
          loading: false
        }));
        // Force page refresh to clear all cached data
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setSession({
            user: data.user || null,
            isLoggedIn: data.isLoggedIn || false,
            loading: false,
            logout
          });
        } else {
          setSession({
            user: null,
            isLoggedIn: false,
            loading: false,
            logout
          });
        }
      } catch (error) {
        console.error("Session check error:", error);
        setSession({
          user: null,
          isLoggedIn: false,
          loading: false,
          logout
        });
      }
    }

    checkSession();
  }, []);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}
