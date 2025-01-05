"use client";

/**
 * If you still get errors, add the line below:
 * export const dynamic = "force-dynamic";
 * That tells Next.js to skip static pre-render and rely on the client.
 */

// import React (optional, in Next.js 13 it’s not strictly required)
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase"; 
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If you have an optional gym_id
  const [gymId, setGymId] = useState<string | null>(null);

  // Capture the query param "gym_id" in a client-side effect
  useEffect(() => {
    const g = searchParams.get("gym_id");
    if (g) setGymId(g);
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      // 1) Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // 2) If your DB trigger doesn't auto-insert user_profiles, you can do so here. 
      //    Otherwise, if the row is created automatically, 
      //    we can update current_gym_id if needed:
      if (gymId && data.user) {
        await supabase
          .from("user_profiles")
          .update({ current_gym_id: gymId })
          .eq("user_id", data.user.id);
      }

      // 3) Redirect to login or wherever
      router.push("/login");
    } catch (err: any) {
      setErrorMsg(err.message || "Unknown error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSignup} className="space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-neutral-800 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-neutral-800 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600">
          Create Account
        </Button>
      </form>
    </div>
  );
}
