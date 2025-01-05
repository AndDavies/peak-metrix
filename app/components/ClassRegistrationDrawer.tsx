"use client";

import { useEffect, useState } from "react";
import SideDrawer from "./SideDrawer";
import { supabase } from "../utils/supabase";


interface ClassSchedule {
  id: string;
  class_name: string;
  start_time: string | null;
  end_time: string | null;
  max_participants: number;
}

interface UserData {
  user_id?: string | null;
  
}

interface ClassRegistrationDrawerProps {
  classSchedule: ClassSchedule;
  userData: UserData;
  isOpen: boolean;
  onClose: () => void;
  refreshSchedules: () => void;
}

export default function ClassRegistrationDrawer({
  classSchedule,
  userData,
  isOpen,
  onClose,
  refreshSchedules,
}: ClassRegistrationDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [confirmedCount, setConfirmedCount] = useState<number>(0);
  const [userStatus, setUserStatus] = useState<"confirmed" | "waitlisted" | "none">(
    "none"
  );

  useEffect(() => {
    if (isOpen && classSchedule?.id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, classSchedule]);

  async function fetchData() {
    if (!userData.user_id) return;
    setLoading(true);

    const scheduleId = classSchedule.id;
    try {
      // Single combined query using Supabase RPC or two queries in parallel:
      // For simplicity, do them in parallel:

      const [countRes, userRowRes] = await Promise.all([
        supabase
          .from("class_registrations")
          .select("*", { count: "exact" })
          .eq("class_schedule_id", scheduleId)
          .eq("status", "confirmed"),
        supabase
          .from("class_registrations")
          .select("status")
          .eq("class_schedule_id", scheduleId)
          .eq("user_profile_id", userData.user_id)
          .maybeSingle(),
      ]);

      if (countRes.error) {
        console.error("Error fetching confirmed count:", countRes.error.message);
      } else {
        setConfirmedCount(countRes.data?.length || 0);
      }

      if (userRowRes.error && userRowRes.error.code !== "PGRST116") {
        console.error("Error fetching user registration:", userRowRes.error.message);
      } else if (userRowRes.data) {
        const statusVal = userRowRes.data.status;
        setUserStatus(statusVal === "confirmed" ? "confirmed" : "waitlisted");
      } else {
        setUserStatus("none");
      }
    } catch (err: any) {
      console.error("Error in fetchData:", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    setLoading(true);
    try {
      const res = await fetch("/api/class/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ class_schedule_id: classSchedule.id }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Failed to register");
      } else {
        setUserStatus(result.status); // 'confirmed' or 'waitlisted'
        refreshSchedules();
      }
    } catch (err: any) {
      alert(err.message || "Error registering");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setLoading(true);
    try {
      const res = await fetch("/api/class/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ class_schedule_id: classSchedule.id }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Failed to cancel");
      } else {
        setUserStatus("none");
        refreshSchedules();
      }
    } catch (err: any) {
      alert(err.message || "Error cancelling");
    } finally {
      setLoading(false);
    }
  }

  const spotsAvailable = confirmedCount < classSchedule.max_participants;

  return (
    <SideDrawer isOpen={isOpen} onClose={onClose} title="Class Registration">
      <div className="p-4 text-gray-800">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {classSchedule.class_name}
        </h2>
        {classSchedule.start_time && (
          <p className="text-sm text-gray-600 mb-2">
            {new Date(classSchedule.start_time).toLocaleString()}
          </p>
        )}
        <p className="text-sm mb-4">
          {confirmedCount} / {classSchedule.max_participants} confirmed
          {spotsAvailable ? " (spots available)" : " (full, waitlist)"}
        </p>

        {userStatus === "none" && (
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              spotsAvailable
                ? "bg-green-600 hover:bg-green-500"
                : "bg-yellow-600 hover:bg-yellow-500"
            }`}
          >
            {loading
              ? spotsAvailable
                ? "Registering..."
                : "Waitlisting..."
              : spotsAvailable
              ? "Register"
              : "Join Waitlist"}
          </button>
        )}
        {userStatus === "confirmed" && (
          <div className="space-y-2">
            <p className="text-green-700 font-medium">You are confirmed!</p>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {loading ? "Cancelling..." : "Cancel Registration"}
            </button>
          </div>
        )}
        {userStatus === "waitlisted" && (
          <div className="space-y-2">
            <p className="text-yellow-700 font-medium">You are waitlisted!</p>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {loading ? "Cancelling..." : "Cancel Waitlist"}
            </button>
          </div>
        )}
      </div>
    </SideDrawer>
  );
}
