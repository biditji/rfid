"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearLegacyToken,
  fetchSessionUser,
  signIn as apiSignIn,
  signOut,
  signUp as apiSignUp,
} from "@/lib/auth-client";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  /** Throws an ApiError carrying the backend's message on bad credentials. */
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {
    throw new Error("AuthProvider missing");
  },
  signUp: async () => {
    throw new Error("AuthProvider missing");
  },
  logout: async () => {},
  checkAuth: async () => {},
});

/**
 * Client-side view of the session. The session itself is an httpOnly cookie
 * managed by the /api/auth routes — this only mirrors who is signed in so the
 * UI can react. Protected pages are gated server-side by `proxy.ts`.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      setUser(await fetchSessionUser());
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearLegacyToken();
    // Syncs with the session cookie on mount. Every state update in
    // checkAuth happens after its fetch resolves, not during the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();
  }, [checkAuth]);

  const signIn = useCallback(async (email: string, password: string) => {
    const signedIn = await apiSignIn(email, password);
    setUser(signedIn);
    return signedIn;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const created = await apiSignUp(name, email, password);
    setUser(created);
    return created;
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    router.push("/login");
  }, [router]);

  // Memoized so the header and every other consumer re-render only when the
  // session actually changes, not whenever this provider does.
  const value = useMemo(
    () => ({ user, loading, signIn, signUp, logout, checkAuth }),
    [user, loading, signIn, signUp, logout, checkAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
