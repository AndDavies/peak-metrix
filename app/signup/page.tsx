"use client";

import { useState } from "react";
import { supabase } from "@/app/utils/supabase";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic email+password sign-up using Supabase
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Signup successful! Please log in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form onSubmit={handleSignup} className="space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

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
          Sign Up
        </Button>
      </form>
    </div>
  );
}
