"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart2, Target, ShoppingCart, Clock } from "lucide-react";

export default function DashboardPage() {
  const { userData, isLoading } = useAuth();
  const router = useRouter();

  // Inverted logic: If userData.onboarding_completed === true, we push to /onboarding
  useEffect(() => {
    if (!isLoading && userData) {
      if (userData.onboarding_completed === true) {
        router.push("/onboarding");
      }
    }
  }, [isLoading, userData, router]);

  if (isLoading || !userData) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const displayName = userData?.display_name || "Guest";

  return (
    <div className="space-y-8">
      <section className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Welcome, {displayName}!
        </h1>
        <p className="text-gray-400 mt-2">
          Track your progress, view today's workout, manage programs, and stay on top of your goals.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Daily WOD */}
        <Card className="bg-neutral-900 border border-neutral-800 hover:shadow-md transition">
          <CardHeader className="flex flex-col items-start space-y-2 p-4">
            <BarChart2 className="text-pink-500" size={32} />
            <CardTitle className="text-white">Daily WOD</CardTitle>
            <CardDescription className="text-gray-400">
              Preview your workout of the day.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Goal Tracker */}
        <Card className="bg-neutral-900 border border-neutral-800 hover:shadow-md transition">
          <CardHeader className="flex flex-col items-start space-y-2 p-4">
            <Target className="text-pink-500" size={32} />
            <CardTitle className="text-white">Goal Trackerr</CardTitle>
            <CardDescription className="text-gray-400">
              Monitor progress towards personal records.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Programs Marketplace */}
        <Card className="bg-neutral-900 border border-neutral-800 hover:shadow-md transition">
          <CardHeader className="flex flex-col items-start space-y-2 p-4">
            <ShoppingCart className="text-pink-500" size={32} />
            <CardTitle className="text-white">Programs Marketplace</CardTitle>
            <CardDescription className="text-gray-400">
              Explore and purchase new training programs.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Recently Logged Workouts */}
        <Card className="bg-neutral-900 border border-neutral-800 hover:shadow-md transition">
          <CardHeader className="flex flex-col items-start space-y-2 p-4">
            <Clock className="text-pink-500" size={32} />
            <CardTitle className="text-white">Recently Logged Workouts</CardTitle>
            <CardDescription className="text-gray-400">
              View a snapshot of your latest sessions.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
