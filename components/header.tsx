// components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

// Shadcn UI or your own
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Auth

import { useAuth } from "@/app/context/AuthContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userData, supabaseLogout } = useAuth();

  const userPhoto = userData?.profile_picture || "/images/default-avatar.png";
  const displayName = userData?.display_name || "Guest";

  return (
    <header className="sticky top-0 z-50 bg-neutral-900 backdrop-blur-sm border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/dashboard">
            <Image
              src="/images/Ascent_Logo_trans.png"
              alt="peakMetrix Logo"
              width={140}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 font-medium">
          <Link href="/dashboard" className="hover:text-pink-500 transition">Home</Link>
          <Link href="/programs" className="hover:text-pink-500 transition">Programs</Link>
          <Link href="/workouts" className="hover:text-pink-500 transition">Workouts</Link>
          <Link href="/account" className="hover:text-pink-500 transition">Account</Link>
        </nav>

        {/* Desktop: User Info & Logout */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={userPhoto} alt={displayName} />
              <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-white">{displayName}</span>
          </div>

          <Button
            variant="outline"
            className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
            onClick={supabaseLogout}
          >
            Log Out
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 px-4 pb-4">
          <nav className="flex flex-col space-y-3 mt-4">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/programs" onClick={() => setMobileMenuOpen(false)}>Programs</Link>
            <Link href="/workouts" onClick={() => setMobileMenuOpen(false)}>Workouts</Link>
            <Link href="/account" onClick={() => setMobileMenuOpen(false)}>Account</Link>

            <div className="mt-6 flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={userPhoto} alt={displayName} />
                <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-white">{displayName}</span>
            </div>

            <Button
              variant="outline"
              className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white mt-2"
              onClick={() => {
                supabaseLogout();
                setMobileMenuOpen(false);
              }}
            >
              Log Out
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
