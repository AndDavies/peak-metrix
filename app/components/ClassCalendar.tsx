"use client";
import React from "react";
import { format, parseISO, isValid, getHours, getMinutes } from "date-fns";

type ClassSchedule = {
  id: string;
  class_name: string;
  start_time: string | null;
  end_time: string | null;
  max_participants: number;
  color: string;
  confirmed_count?: number;
};

type WeeklySchedule = {
  [key: string]: ClassSchedule[];
};

type ClassCalendarProps = {
  schedules: WeeklySchedule;
  weekDates: Date[];
  onClassClick?: (cls: ClassSchedule) => void;
};

export default function ClassCalendar({
  schedules,
  weekDates,
  onClassClick,
}: ClassCalendarProps) {
  /**
   * More flexible: 15-min increments from 5:00 (05:00) to 22:00
   */
  const timeSlots: string[] = [];
  for (let hour = 6; hour <= 21; hour++) {
    for (let quarter = 0; quarter < 60; quarter += 15) {
      const hh = hour.toString().padStart(2, "0");
      const mm = quarter.toString().padStart(2, "0");
      timeSlots.push(`${hh}:${mm}`);
    }
  }
  // Also add 22:00 as last slot
  timeSlots.push("22:00");

  const formatTime = (time: string | null) => {
    if (!time) return "No Time";
    const date = parseISO(time);
    if (!isValid(date)) return "Invalid time";
    return format(date, "h:mm a");
  };

  /**
   * We'll place classes into the slot where 
   * start_time's HH:mm matches the slot exactly. 
   * If you want partial overlap, you'd need a more advanced approach 
   * to show blocks spanning multiple slots.
   */
  const getSlotClasses = (dayStr: string, slot: string) => {
    const daySchedules = schedules[dayStr as keyof WeeklySchedule] || [];
    return daySchedules.filter((cls) => {
      if (!cls.start_time) return false;
      const st = parseISO(cls.start_time);
      if (!isValid(st)) return false;
      // Convert st -> "HH:mm"
      const hh = getHours(st).toString().padStart(2, "0");
      const mm = getMinutes(st).toString().padStart(2, "0");
      const stStr = `${hh}:${mm}`;
      return stStr === slot; 
    });
  };

  return (
    <div className="mt-4 overflow-auto calendar-grid">
      <div className="grid grid-cols-8 auto-rows-auto text-sm border border-gray-700 rounded-xl">
        {/* Header Row (empty + 7 days) */}
        <div className="bg-gray-700 p-2 border-b border-gray-600"></div>
        {weekDates.map((date, idx) => (
          <div
            key={idx}
            className="bg-gray-700 p-2 border-b border-gray-600 text-center font-semibold text-gray-200"
          >
            {format(date, "EEE MM/dd")}
          </div>
        ))}

        {/* Time slots */}
        {timeSlots.map((slot, i) => (
          <React.Fragment key={`row-${slot}`}>
            {/* Time label */}
            <div className="time-slot p-2 border-r border-gray-600 bg-gray-800 text-gray-400 text-center font-medium">
              {slot}
            </div>
            {weekDates.map((wd, colIndex) => {
              const dayStr = format(wd, "EEEE").toLowerCase();
              const classesInSlot = getSlotClasses(dayStr, slot);
              return (
                <div
                  key={`cell-${i}-${colIndex}`}
                  className="day-slot p-2 border-b border-gray-600 bg-gray-800 relative"
                >
                  {classesInSlot.map((cls) => (
                    <div
                      key={cls.id}
                      className="mb-2 rounded p-2 text-sm cursor-pointer transition-transform duration-150 hover:scale-105 hover:bg-pink-700/20"
                      style={{
                        borderLeft: `4px solid ${cls.color || "#fff"}`,
                        backgroundColor: "#2f2f2f",
                      }}
                      onClick={() => onClassClick && onClassClick(cls)}
                    >
                      <div style={{ color: cls.color }} className="font-semibold mb-1">
                        {cls.class_name}
                      </div>
                      <div className="text-gray-300 text-xs mb-1">
                        {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {(cls.confirmed_count ?? 0)}/{cls.max_participants} confirmed
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
