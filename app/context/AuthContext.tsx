"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/supabase";

type UserProfile = {
  user_id?: string | null;
  display_name?: string | null;
  bio?: string | null;
  created_at?: string | null;
  role?: string | null;
  current_gym_id?: string | null;
  email?: string | null;
  profile_picture?: string | null;
  join_date?: string | null;
  last_login?: string | null;
  activity_level?: string | null;
  phone_number?: string | null;
  emergency_contact?: string | null;
  subscription_plan?: string | null;
  trainer_id?: string | null;
  goals?: string | null;
  weight?: number | null;
  height?: number | null;
  metrics?: any | null;
  notifications_enabled?: boolean | null;
  onboarding_completed?: boolean | null;
  age?: number | null;
  gender?: string | null;
  postal_code?: string | null;
  occupation?: string | null;
  onboarding_data?: any | null;
  emergency_contact_name?: string | null;
};

type AuthContextType = {
  session: Session | null;
  userData: UserProfile | null;
  isLoading: boolean;
  supabaseLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabaseClient = createClientComponentClient<Database>();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Wrap fetchUserData in useCallback so it's stable across renders.
   * This way we can include it in dependency arrays without re-triggering.
   */
  const fetchUserData = useCallback(
    async (s: Session) => {
      try {
        const { data, error } = await supabaseClient
          .from("user_profiles")
          .select("user_id, display_name, current_gym_id, role, onboarding_completed, goals")
          .eq("user_id", s.user.id)
          .maybeSingle();

        if (error) {
          console.error("[fetchUserData] error:", error.message);
          setUserData(null);
          return;
        }
        if (data) {
          setUserData({
            user_id: data.user_id ?? null,
            display_name: data.display_name ?? null,
            current_gym_id: data.current_gym_id ?? null,
            role: data.role ?? null,
            
            goals: data.goals ?? null,
            
          });
        } else {
          setUserData(null);
        }
      } catch (err: any) {
        console.error("[fetchUserData] unexpected error:", err.message);
        setUserData(null);
      }
    },
    [supabaseClient]
  );

  // The nuclear logout
  const supabaseLogout = async () => {
    try {
      // 1) Sign out from Supabase
      await supabaseClient.auth.signOut();

      // 2) Clear local storage tokens (supabase) just in case
      localStorage.removeItem("supabase.auth.token");

      // 3) Wipe session & user data
      setSession(null);
      setUserData(null);

      // 4) Navigate them to homepage
      router.push("/");
    } catch (err) {
      console.error("[supabaseLogout] error:", err);
    }
  };

  /**
   * Subscribe to auth state changes (SIGN_IN, SIGN_OUT, TOKEN_REFRESH, etc.).
   * This does NOT re-run if user simply tabs away—only triggers on actual auth changes.
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[AuthStateChange]", event, newSession);
      setSession(newSession);

      if (event === "SIGNED_IN" && newSession) {
        setIsLoading(true);
        await fetchUserData(newSession);
        setIsLoading(false);
      } else if (event === "SIGNED_OUT") {
        setUserData(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseClient, fetchUserData]);

  /**
   * On initial mount, check if there's an existing session.
   * If so, fetch the user data. This also runs only once, not on tab focus.
   */
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const { data, error } = await supabaseClient.auth.getSession();
      if (error) {
        console.error("[init] getSession error:", error);
        setIsLoading(false);
        return;
      }
      if (data.session) {
        setSession(data.session);
        await fetchUserData(data.session);
      }
      setIsLoading(false);
    };
    init();
  }, [supabaseClient, fetchUserData]);

  return (
    <AuthContext.Provider
      value={{
        session,
        userData,
        isLoading,
        supabaseLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}