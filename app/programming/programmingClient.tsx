"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Header } from "../components/header";
import WeekSelector from "../components/WeekSelector";
import ScheduledWorkoutsCalendar from "../components/ScheduledWorkoutsCalendar";
import { supabase } from "../utils/supabase";
import {
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  format
} from "date-fns";

interface ScheduledWorkout {
  id: string;
  name: string;
  date: string;       // Storing as ISO string in DB
  gym_id: string;
  // ... any other columns you have
}

// We'll store them grouped by day-of-week, e.g. 'sunday', 'monday', ...
type WeeklyProgramming = {
  sunday: ScheduledWorkout[];
  monday: ScheduledWorkout[];
  tuesday: ScheduledWorkout[];
  wednesday: ScheduledWorkout[];
  thursday: ScheduledWorkout[];
  friday: ScheduledWorkout[];
  saturday: ScheduledWorkout[];
};

export default function ProgrammingClient() {
  const { userData, isLoading } = useAuth();
  const [weekStartDate, setWeekStartDate] = useState<Date>(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [programming, setProgramming] = useState<WeeklyProgramming>({
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  });

  // 1) Initialize the 7 day date array
  const initializeWeekDates = useCallback(() => {
    const sunday = startOfWeek(weekStartDate, { weekStartsOn: 0 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(sunday, i));
    setWeekDates(days);
  }, [weekStartDate]);

  // 2) fetchProgramming from scheduled_workouts
  const fetchProgramming = useCallback(async () => {
    if (!userData?.current_gym_id) return;

    // We do date-based range
    const start = startOfWeek(weekStartDate, { weekStartsOn: 0 });
    const end = addDays(start, 6);

    // Convert to ISO
    const startStr = format(start, "yyyy-MM-dd");
    const endStr = format(end, "yyyy-MM-dd");

    const { data, error } = await supabase
      .from("scheduled_workouts")
      .select("id, name, date, gym_id, workout_details")
      .eq("gym_id", userData.current_gym_id)
      .gte("date", startStr)
      .lte("date", endStr);

    if (error) {
      console.error("Error fetching programming:", error.message);
      return;
    }
    if (!data) return;

    // Group by day
    const grouped: WeeklyProgramming = {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    };

    data.forEach((w) => {
      const dayStr = format(new Date(w.date), "EEEE").toLowerCase() as keyof WeeklyProgramming;
      grouped[dayStr].push(w);
    });

    setProgramming(grouped);
  }, [userData, weekStartDate]);

  // 3) effect to initialize + fetch
  useEffect(() => {
    if (!isLoading && userData) {
      initializeWeekDates();
      fetchProgramming();
    }
  }, [isLoading, userData, weekStartDate, initializeWeekDates, fetchProgramming]);

  // 4) week nav
  function goPreviousWeek() {
    setWeekStartDate((prev) => subWeeks(prev, 1));
  }
  function goNextWeek() {
    setWeekStartDate((prev) => addWeeks(prev, 1));
  }
  function goToday() {
    setWeekStartDate(new Date());
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212] text-[#E5E7EB]">
        Loading...
      </div>
    );
  }
  if (!userData) {
    return (
      <div className="flex flex-col min-h-screen bg-[#121212] text-[#E5E7EB]">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          Please log in.
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-[#E5E7EB]">
      <Header />

      <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6">

        {/* Week Selector */}
        <div className="mb-4">
          <WeekSelector
            weekStartDate={weekStartDate}
            onPreviousWeek={goPreviousWeek}
            onNextWeek={goNextWeek}
            onToday={goToday}
          />
        </div>

        {/* Calendar */}
        <ScheduledWorkoutsCalendar
          weekDates={weekDates}
          programming={programming}
        />
      </main>

      <footer className="bg-[#1F1F1F] text-center py-4 text-sm text-[#9CA3AF] border-t border-[#374151]">
        &copy; 2024 peakMetrix. All rights reserved.
      </footer>
    </div>
  );
}
