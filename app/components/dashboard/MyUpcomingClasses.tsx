"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase"; 
import {
  parseISO,
  isValid,
  compareAsc
} from "date-fns";

interface MyUpcomingClassesProps {
  userId: string; // The logged-in user’s ID
}

// The schedule fields we need for display
interface ClassSchedule {
  id: string;
  class_name: string;
  start_time: string | null;
  end_time: string | null;
}

// Because Supabase is returning an array for class_schedules, define it as ClassSchedule[]
interface RegistrationRow {
  status: string;
  class_schedules: ClassSchedule[];
}

export default function MyUpcomingClasses({ userId }: MyUpcomingClassesProps) {
  const [loading, setLoading] = useState(false);
  const [upcoming, setUpcoming] = useState<RegistrationRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function fetchClasses() {
    setLoading(true);
    setError(null);

    try {
      // We'll fetch only future classes (start_time >= now)
      const nowISO = new Date().toISOString();

      // Because your foreign key is returning an array, it’s likely a 1-to-many relationship
      // in Supabase. We'll handle that as an array.
      const { data, error } = await supabase
        .from("class_registrations")
        .select(`
          status,
          class_schedules (
            id,
            class_name,
            start_time,
            end_time
          )
        `)
        .eq("user_profile_id", userId)
        .gte("class_schedules.start_time", nowISO)
        .order("class_schedules.start_time", { ascending: true });

      if (error) {
        setError(error.message);
      } else if (data) {
        // data is an array of RegistrationRow, each with class_schedules: ClassSchedule[]
        // Filter out any that have an empty class_schedules array
        const filtered = (data as RegistrationRow[]).filter((row) => {
          if (!row.class_schedules || row.class_schedules.length < 1) {
            return false;
          }
          // We'll keep it because it has at least 1 schedule in the future
          return true;
        });

        // Sort them by the first schedule’s start_time
        filtered.sort((a, b) => {
          const scheduleA = a.class_schedules[0];
          const scheduleB = b.class_schedules[0];
          if (!scheduleA.start_time || !scheduleB.start_time) return 0;

          const dateA = parseISO(scheduleA.start_time);
          const dateB = parseISO(scheduleB.start_time);
          if (!isValid(dateA) || !isValid(dateB)) return 0;

          return compareAsc(dateA, dateB);
        });

        setUpcoming(filtered);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#1F1F1F] border border-[#374151] rounded-xl shadow-md p-4 w-full">
      <h2 className="text-lg font-semibold mb-2 text-pink-400">
        My Upcoming Classes
      </h2>

      {loading && <p className="text-sm text-gray-300">Loading classes...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && upcoming.length === 0 && (
        <p className="text-sm text-gray-300">No upcoming classes</p>
      )}

      <ul className="space-y-2">
        {upcoming.map((row, idx) => {
          // Because row.class_schedules is an array
          const schedules = row.class_schedules;
          // We'll only display the FIRST schedule if there's exactly one
          // or display all if you suspect multiple
          const first = schedules[0];

          return (
            <li
              key={idx}
              className="bg-[#2A2A2A] border border-[#374151] rounded-md p-3 text-sm text-gray-100"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {first?.class_name ?? "Unnamed Class"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    row.status === "confirmed"
                      ? "bg-green-600 text-white"
                      : "bg-yellow-600 text-white"
                  }`}
                >
                  {row.status}
                </span>
              </div>
              <div className="mt-1 text-gray-400 text-xs">
                {first?.start_time
                  ? new Date(first.start_time).toLocaleString()
                  : "N/A"}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
