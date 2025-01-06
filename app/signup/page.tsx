"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/utils/supabase"; // or wherever you keep the supabase client
import { Button } from "@/components/ui/button";

// The main signup page capturing first_name, last_name, email, password
export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // 1) Create user in auth
      const { data, error: supaError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (supaError) {
        setError(supaError.message);
        setLoading(false);
        return;
      }

      // If signUp was successful (no supaError), we have data.user (may be null if "email confirmation" is required)
      // data.user.id might exist right away; if email confirmation is on, user row is created but unconfirmed.

      // 2) Insert or upsert into user_profiles
      // The "user_id" is data.user?.id. If supabase requires email confirmation first,
      // data.user might be null. We can handle that with a check:
      const userId = data.user?.id;
      if (userId) {
        // Insert or upsert the profile row
        const { error: profileError } = await supabase
          .from("user_profiles")
          .upsert({
            user_id: userId,
            display_name: firstName,
            last_name: lastName,
            // any other columns you want to set
          })
          .eq("user_id", userId); 
        // or .single() if you prefer. Upsert ensures if row exists, it's updated.

        if (profileError) {
          // Not a fatal error for sign-up itself, but let's show it
          console.error("Profile insert/update error:", profileError.message);
        }
      }

      // 3) Show success
      // If email confirmations are enabled, they'll need to confirm before they can actually log in.
      setSuccess("Signup successful! Please check your email to confirm your account.");

    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Disable input fields if success or loading
  const isDisabled = !!success || loading;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel (Dark) */}
      <div className="flex-1 bg-[#121212] text-gray-200 p-8 flex flex-col justify-center">
        <div className="max-w-sm mx-auto">
          <h1 className="text-xl font-bold mb-2">PeakMetrix</h1>
          <p className="text-sm text-gray-400">
            “Join us and start your journey to better performance and data-driven training.”
          </p>
        </div>
      </div>

      {/* Right Panel (Light) */}
      <div className="w-full max-w-md bg-white text-gray-900 flex flex-col justify-center p-8">
        <div className="max-w-sm mx-auto w-full">
          <h2 className="text-2xl font-bold mb-4">Create an account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your details below to create your account
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isDisabled}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="John"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isDisabled}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isDisabled}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="name@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isDisabled}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded disabled:bg-pink-300"
              disabled={isDisabled}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-pink-500 font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}