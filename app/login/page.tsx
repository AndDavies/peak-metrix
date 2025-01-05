"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/app/utils/supabase"; // or create your own client
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // If user already has session, push to /dashboard
  useEffect(() => {
    if (!isLoading && session) {
      router.push("/dashboard");
    }
  }, [session, isLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
  };

  // While checking session or if user is already logged in, show loader
  if (isLoading || session) {
    return <p className="text-center py-10">Loading...</p>;
  }

  // Show login form
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
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
          Sign In
        </Button>
      </form>
    </div>
  );
}
