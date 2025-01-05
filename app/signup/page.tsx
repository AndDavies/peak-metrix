// app/signup/page.tsx
"use client";

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

  // We'll store gymId from the query param if present
  const [gymId, setGymId] = useState<string | null>(null);

  useEffect(() => {
    const g = searchParams?.get("gym_id");
    if (g) setGymId(g);
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      // 1) Create user in Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // 2) If using a database trigger to auto-insert user_profiles row, 
      //    we just do an UPDATE to set current_gym_id if gymId is present.
      if (gymId && data.user) {
        await supabase
          .from("user_profiles")
          .update({ current_gym_id: gymId })
          .eq("user_id", data.user.id);
      }

      // Show success or redirect. 
      // If you have email confirmation on, they'll need to confirm. 
      // Otherwise, they might be logged in automatically.
      //router.push("/login");
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
