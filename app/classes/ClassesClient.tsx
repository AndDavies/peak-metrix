"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

import { supabase } from "../utils/supabase";

import { useAuth } from "@/app/context/AuthContext"; // your existing AuthContext
import { Header } from "../components/header";
import GymGuard from "../components/GymGuard"; 
import WeekSelector from "../components/WeekSelector";
import ClassCalendar from "../components/ClassCalendar";
import SideDrawer from "../components/SideDrawer";
import AddClassesDrawer from "../components/AddClassesDrawer";
import CreateClassTypeModal from "../components/CreateClassTypeModal";
import ClassRegistrationDrawer from "../components/ClassRegistrationDrawer";

import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
} from "date-fns";

type ClassSchedule = {
  id: string;
  class_name: string;
  start_time: string | null;
  end_time: string | null;
  max_participants: number;
  color: string;
  confirmed_count?: number;
};

type ClassType = {
  id: string;
  class_name: string;
  description: string | null;
  color: string;
};

type WeeklySchedule = {
  sunday: ClassSchedule[];
  monday: ClassSchedule[];
  tuesday: ClassSchedule[];
  wednesday: ClassSchedule[];
  thursday: ClassSchedule[];
  friday: ClassSchedule[];
  saturday: ClassSchedule[];
};

export default function ClassesClient() {
  const { userData, isLoading } = useAuth();
  const [schedules, setSchedules] = useState<WeeklySchedule>({
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  });
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [selectedClassType, setSelectedClassType] = useState<ClassType | null>(null);
  const [selectedClassForRegistration, setSelectedClassForRegistration] = useState<ClassSchedule | null>(null);

  // Drawers / modals
  const [weekStartDate, setWeekStartDate] = useState<Date>(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isClassTypeModalOpen, setIsClassTypeModalOpen] = useState(false);
  const [isRegistrationDrawerOpen, setIsRegistrationDrawerOpen] = useState(false);

  const canManageUsers = userData?.role === "admin" || userData?.role === "coach";

  // We store the gymId in a ref to detect changes.
  const gymIdRef = useRef<string | null | undefined>(userData?.current_gym_id);

  /**
   * Initialize the week dates once on mount, or whenever weekStartDate changes
   */
  const initializeWeekDates = useCallback(() => {
    const start = startOfWeek(weekStartDate, { weekStartsOn: 0 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDates(days);
  }, [weekStartDate]);

  /**
   * Fetch Class Schedules for this gym and date range
   */
  const fetchSchedules = useCallback(async () => {
    console.log("GETTING HERE::::::::", userData?.current_gym_id);
    if (!userData?.current_gym_id) return;

    const startISO = new Date(
      startOfWeek(weekStartDate, { weekStartsOn: 0 }).setHours(0, 0, 0, 0)
    ).toISOString();
    const endISO = new Date(
      addDays(startOfWeek(weekStartDate, { weekStartsOn: 0 }), 6).setHours(
        23,
        59,
        59,
        999
      )
    ).toISOString();

    const { data: schedulesData, error: schedulesError } = await supabase
      .from("class_schedules")
      .select("id, class_name, start_time, end_time, max_participants, class_type_id")
      .eq("current_gym_id", userData.current_gym_id)
      .gte("start_time", startISO)
      .lte("start_time", endISO);

    if (schedulesError) {
      console.error("Error fetching class schedules:", schedulesError.message);
      return;
    }

    const classIds = (schedulesData || []).map((c) => c.id);

    // We want to get confirmed_count for each schedule
    let countsMap = new Map<string, number>();
    if (classIds.length > 0) {
      const { data: regData, error: regError } = await supabase
        .from("class_registrations")
        .select("class_schedule_id", { count: "exact" })
        .eq("status", "confirmed")
        .in("class_schedule_id", classIds);

      if (!regError && regData) {
        regData.forEach((row: any) => {
          const prev = countsMap.get(row.class_schedule_id) || 0;
          countsMap.set(row.class_schedule_id, prev + 1);
        });
      }
    }

    // Then fetch class_types for color
    const { data: classTypesData, error: classTypesError } = await supabase
      .from("class_types")
      .select("id,color")
      .eq("gym_id", userData.current_gym_id);

    if (classTypesError) {
      console.error("Error fetching class types:", classTypesError.message);
      return;
    }
    const colorMap: Record<string, string> = {};
    classTypesData?.forEach((ct) => {
      colorMap[ct.id] = ct.color;
    });

    // Group schedules by day
    const grouped: WeeklySchedule = {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
    };

    schedulesData?.forEach((sch) => {
      if (!sch.start_time) return;
      const dayStr = format(new Date(sch.start_time), "EEEE").toLowerCase() as keyof WeeklySchedule;
      const color = colorMap[sch.class_type_id] || "#EC4899"; // default to pink
      grouped[dayStr].push({
        ...sch,
        color,
        confirmed_count: countsMap.get(sch.id) || 0,
      });
    });

    setSchedules(grouped);
  }, [weekStartDate, userData]);

  /**
   * Fetch Class Types
   */
  const fetchClassTypes = useCallback(async () => {
    //console.log("In Fetching Class Types", userData?.current_gym_id);
    if (!userData?.current_gym_id) return;
    const { data, error } = await supabase
      .from("class_types")
      .select("id, class_name, description, color")
      .eq("gym_id", userData.current_gym_id);

    if (error) {
      console.error("Error fetching class types:", error.message);
      return;
    }
    setClassTypes(data || []);
  }, [userData]);

  /**
   * refreshSchedules is a public method we can pass to children,
   * only re-fetches if the user is in a gym.
   */
  const refreshSchedules = () => {
    if (!userData?.current_gym_id) return;
    fetchSchedules();
  };

  // For minimal re-renders:
  //  - Only run schedule fetch if gym_id changes or we change the week
  //  - We'll also fetch class types once on mount or if gym changes
  useEffect(() => {
    if (!isLoading && userData) {
      initializeWeekDates();
      fetchSchedules();
      fetchClassTypes();

      // If the gym changed since last time, re-fetch
      if (gymIdRef.current !== userData.current_gym_id) {
        gymIdRef.current = userData.current_gym_id;
        fetchSchedules();
        fetchClassTypes();
      } else {
        // If gym is same, only re-fetch if user changed the week
        fetchSchedules();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, userData, weekStartDate]);

  //  - We only re-run fetchClassTypes if gym changed or on mount
  //    (already handled above logic).

  // *** Week navigation
  const goToPreviousWeek = () => setWeekStartDate((prev) => subWeeks(prev, 1));
  const goToNextWeek = () => setWeekStartDate((prev) => addWeeks(prev, 1));
  const goToToday = () => setWeekStartDate(new Date());

  // *** Class click -> open registration drawer
  function handleClassClick(cls: ClassSchedule) {
    setSelectedClassForRegistration(cls);
    setIsRegistrationDrawerOpen(true);
  }

  // *** Loading / Logged-out checks
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#E5E7EB] flex items-center justify-center">
        Loading user...
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#E5E7EB] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center font-medium">
          You are not logged in.
        </main>
      </div>
    );
  }

  // *** UI
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-[#E5E7EB]">
      <Header />

      <main className="flex-grow flex flex-col space-y-8 p-4 sm:p-6 lg:p-8 bg-[#121212]">
        {/* Top Row: WeekSelector, ClassTypes, optional schedule button */}
        <div className="flex flex-wrap lg:flex-nowrap items-start gap-6">
          <div className="flex-initial">
            <WeekSelector
              weekStartDate={weekStartDate}
              onPreviousWeek={goToPreviousWeek}
              onNextWeek={goToNextWeek}
              onToday={goToToday}
            />
          </div>

          {/* Class Types Card */}
          <div className="flex-1 bg-[#1F1F1F] rounded-xl shadow-md border border-[#374151] p-4 h-32">
            <h3 className="text-sm font-semibold border-b border-[#374151] pb-2">
              Class Types
            </h3>
            <ul className="flex flex-wrap gap-2 mt-2">
              {classTypes.map((ct) => {
                const isSelected = selectedClassType?.id === ct.id;
                return (
                  <li
                    key={ct.id}
                    onClick={() => {
                      if (canManageUsers) {
                        setSelectedClassType(isSelected ? null : ct);
                      }
                    }}
                    className={`cursor-pointer px-3 py-1 rounded-full border-2 text-sm font-medium transition ${
                      isSelected
                        ? "border-pink-500 bg-pink-500 text-white hover:bg-pink-600"
                        : "border-gray-500 text-gray-300 hover:border-pink-500 hover:text-pink-300"
                    }`}
                    style={{
                      borderColor: isSelected ? ct.color : undefined,
                      backgroundColor: isSelected ? ct.color : undefined,
                    }}
                  >
                    {ct.class_name}
                  </li>
                );
              })}
              {canManageUsers && (
                <li
                  className="cursor-pointer text-pink-400 hover:text-pink-300 transition text-sm font-medium"
                  onClick={() => setIsClassTypeModalOpen(true)}
                >
                  + new type
                </li>
              )}
            </ul>
          </div>

          {/* Schedule Classes Button */}
          {selectedClassType && canManageUsers && (
            <div className="flex-initial flex items-center justify-center">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="px-4 py-2 rounded-md text-white bg-pink-500 hover:bg-pink-600"
              >
                Schedule Classes
              </button>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="flex-grow bg-[#1F1F1F] border border-[#374151] rounded-xl shadow-md p-4">
          <GymGuard>
            <ClassCalendar
              schedules={schedules}
              weekDates={weekDates}
              onClassClick={handleClassClick}
            />
          </GymGuard>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1F1F1F] text-center py-4 text-sm text-[#9CA3AF] border-t border-[#374151]">
        &copy; 2024 FitSync. All rights reserved.
      </footer>

      {/* Side Drawer for Adding Classes */}
      {canManageUsers && (
        <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          {selectedClassType && (
            <AddClassesDrawer
              classType={selectedClassType}
              currentGymId={userData.current_gym_id!}
              onClose={() => setIsDrawerOpen(false)}
              refreshSchedules={refreshSchedules}
            />
          )}
        </SideDrawer>
      )}

      {/* Class Type Modal */}
      {canManageUsers && isClassTypeModalOpen && (
        <CreateClassTypeModal
          isVisible={isClassTypeModalOpen}
          onClose={() => setIsClassTypeModalOpen(false)}
          currentGymId={userData.current_gym_id!}
          refreshClassTypes={fetchClassTypes}
        />
      )}

      {/* Registration Drawer */}
      {selectedClassForRegistration && (
        <ClassRegistrationDrawer
          classSchedule={selectedClassForRegistration}
          userData={{ user_id: userData.user_id || null }}
          isOpen={isRegistrationDrawerOpen}
          onClose={() => setIsRegistrationDrawerOpen(false)}
          refreshSchedules={refreshSchedules}
        />
      )}
    </div>
  );
}
