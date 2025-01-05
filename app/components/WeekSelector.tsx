"use client";
import React from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Example Lucide icons

interface WeekSelectorProps {
  weekStartDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export default function WeekSelector({
  weekStartDate,
  onPreviousWeek,
  onNextWeek,
  onToday,
}: WeekSelectorProps) {
  return (
    <div className="bg-[#1F1F1F] border border-gray-700 rounded-xl shadow p-4 flex flex-col items-center justify-center h-32 space-y-2 w-48">
      <div className="flex items-center justify-between w-full px-4">
        <button
          onClick={onPreviousWeek}
          className="text-gray-400 hover:text-pink-400 transition text-lg font-bold focus:outline-none"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="week-label font-semibold text-sm mb-1 text-gray-300">
            Week Of
          </span>
          <span className="week-date text-lg font-bold text-gray-100">
            {format(weekStartDate, "dd MMM yy")}
          </span>
        </div>
        <button
          onClick={onNextWeek}
          className="text-gray-400 hover:text-pink-400 transition text-lg font-bold focus:outline-none"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <button
        onClick={onToday}
        className="text-pink-400 hover:underline text-sm font-medium focus:outline-none"
      >
        Today
      </button>
    </div>
  );
}
