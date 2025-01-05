"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

  // Fetch user_profiles row
  const fetchUserData = async (s: Session) => {
    // Example: selecting just user_id and display_name
    const { data, error } = await supabaseClient
      .from("user_profiles")
      .select("user_id, display_name")
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
      });
    } else {
      setUserData(null);
    }
  };

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

      // 4) Finally, navigate them to homepage
      router.push("/");
    } catch (err) {
      console.error("[supabaseLogout] error:", err);
    }
  };

  // Subscribe to changes in the Supabase auth state
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
  }, [supabaseClient]);

  // On mount, get existing session
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
  }, [supabaseClient]);

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
