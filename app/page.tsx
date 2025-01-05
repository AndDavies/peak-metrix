"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ShadCN UI components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Lucide icons
import { BarChart2, UserCheck, Brain, UserPlus, ClipboardCheck, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-neutral-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Image
            src="/images/Ascent_Logo_trans.png"
            alt="peakMetrix Logo"
            width={150}
            height={150}
            priority
          />

          <div className="flex items-center space-x-8 text-white font-medium">
            <a href="#features" className="hover:text-pink-500 transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-pink-500 transition">
              How It Works
            </a>
            <a href="#what-it-is" className="hover:text-pink-500 transition">
              About Us
            </a>
            <a href="#contact" className="hover:text-pink-500 transition">
              Contact
            </a>

            <Link href="/signup">
              <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-pink-500 hover:bg-pink-600">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full pt-28 relative"
      >
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <Image
            src="/images/hero_abstract_bg.png"
            alt="Abstract geometric background shape"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center space-y-10 md:space-y-0">
          {/* Left: Headline + CTA */}
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-clip-text text-transparent">
              Train Smarter,
              <br />
              Perform Better.
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
              peakMetrix empowers athletes and gyms with data-rich insights, personalized
              programming, and seamless class management—all in one platform.
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="/signup">
                <Button className="bg-pink-500 hover:bg-pink-600">
                  Get Started
                </Button>
              </Link>
              <Link href="/signin">
                <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="flex-1 md:ml-12 relative">
            <Image
              src="/images/hero_person_training.png"
              alt="Athlete training with barbell"
              width={600}
              height={450}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </motion.header>

      {/* Features Section */}
      <motion.section
        id="features"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full py-20 bg-black"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Features</h2>
          <p className="text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            From personal tracking to gym-wide management, peakMetrix adapts to your needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-neutral-900 hover:shadow-md transition border border-neutral-700">
              <CardHeader className="flex flex-col items-center">
                <BarChart2 size={48} className="text-pink-500 mb-2" />
                <CardTitle className="text-xl text-white">Data-Driven Insights</CardTitle>
                <CardDescription className="text-gray-400">
                  Track your progress and improve with in-depth analytics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-neutral-900 hover:shadow-md transition border border-neutral-700">
              <CardHeader className="flex flex-col items-center">
                <UserCheck size={48} className="text-pink-500 mb-2" />
                <CardTitle className="text-xl text-white">Personalized Programming</CardTitle>
                <CardDescription className="text-gray-400">
                  Workouts tailored to your goals, delivered seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-neutral-900 hover:shadow-md transition border border-neutral-700">
              <CardHeader className="flex flex-col items-center">
                <Brain size={48} className="text-pink-500 mb-2" />
                <CardTitle className="text-xl text-white">AI Coaching</CardTitle>
                <CardDescription className="text-gray-400">
                  Get expert guidance backed by advanced AI insights.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-neutral-900 py-4 text-center text-gray-400 text-sm">
        &copy; 2024 peakMetrix. All rights reserved.
      </footer>
    </div>
  );
}