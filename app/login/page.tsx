"use client";

import { useState } from "react";
import { supabase } from "@/app/utils/supabase";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // Redirect to dashboard or wherever
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="flex-1 bg-[#121212] text-gray-200 p-8 flex flex-col justify-center">
        <div className="max-w-sm mx-auto">
          <h1 className="text-xl font-bold mb-2">PeakMetrix</h1>
          <p className="text-sm text-gray-400">
            “Train smarter, perform better. Our platform helps you track
            everything so you can focus on results.”
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full max-w-md bg-white text-gray-900 flex flex-col justify-center p-8">
        <div className="max-w-sm mx-auto w-full">
          <h2 className="text-2xl font-bold mb-4">Welcome Back</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <p className="text-red-500 text-sm">{errorMsg}</p>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-pink-500 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
