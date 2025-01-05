"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import {
  format,
  parseISO,
  isValid,
  addWeeks,
  addMinutes,
  addDays,
  startOfWeek,
} from "date-fns";


import SideDrawer from "./SideDrawer";

interface ClassType {
  id: string;
  class_name: string;
  description: string | null;
  color: string;
}

interface AddClassesDrawerProps {
  classType: ClassType;
  currentGymId: string;
  onClose: () => void;
  refreshSchedules: () => void;
}

const possibleStartTimes = [
  "05:00","05:15","05:30","05:45",
  // ... up to 21:45
  "22:00",
];
const possibleDurations = [45, 60, 75, 90, 120];

export default function AddClassesDrawer({
  classType,
  currentGymId,
  onClose,
  refreshSchedules,
}: AddClassesDrawerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // single or recurring
  const [occurrenceType, setOccurrenceType] = useState<"single" | "recurring">("single");

  // single
  const [singleDate, setSingleDate] = useState("");
  const [singleStartTime, setSingleStartTime] = useState("06:00");
  const [singleDuration, setSingleDuration] = useState(60);
  const [singleEndTime, setSingleEndTime] = useState("07:00");

  // recurring
  const [startDate, setStartDate] = useState("");
  const [recurringStartTime, setRecurringStartTime] = useState("06:00");
  const [recurringDuration, setRecurringDuration] = useState(60);
  const [recurringEndTime, setRecurringEndTime] = useState("07:00");
  const [weeksCount, setWeeksCount] = useState(1);
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });

  const [maxParticipants, setMaxParticipants] = useState(10);

  // Compute end times
  useEffect(() => {
    setSingleEndTime(computeEndTime(singleStartTime, singleDuration));
  }, [singleStartTime, singleDuration]);

  useEffect(() => {
    setRecurringEndTime(computeEndTime(recurringStartTime, recurringDuration));
  }, [recurringStartTime, recurringDuration]);

  function computeEndTime(start: string, durationMins: number) {
    const [hh, mm] = start.split(":");
    const dateObj = new Date();
    dateObj.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
    const plus = addMinutes(dateObj, durationMins);
    const endHH = plus.getHours().toString().padStart(2, "0");
    const endMM = plus.getMinutes().toString().padStart(2, "0");
    return `${endHH}:${endMM}`;
  }

  function handleDayToggle(day: string) {
    setSelectedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  }

  function validateFieldsForCurrentStep(): boolean {
    setError(null);
    if (currentStep === 3) {
      if (occurrenceType === "single") {
        if (!singleDate) {
          setError("Please select a date for the single class.");
          return false;
        }
      } else {
        if (!startDate) {
          setError("Please select the start date for recurring classes.");
          return false;
        }
        const anyDay = Object.values(selectedDays).some((v) => v);
        if (!anyDay) {
          setError("Select at least one weekday for recurring classes.");
          return false;
        }
        if (weeksCount < 1) {
          setError("Weeks count must be >= 1.");
          return false;
        }
      }
    }
    if (currentStep === 4) {
      if (maxParticipants < 1) {
        setError("Max participants must be >= 1.");
        return false;
      }
    }
    return true;
  }

  function goNext() {
    if (validateFieldsForCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  }
  function goBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function handleCreateClasses() {
    setIsSubmitting(true);
    setError(null);

    try {
      const inserts: any[] = [];
      if (occurrenceType === "single") {
        const startDateTime = `${singleDate}T${singleStartTime}`;
        const endDateTime = `${singleDate}T${singleEndTime}`;
        inserts.push({
          current_gym_id: currentGymId,
          class_name: classType.class_name,
          start_time: startDateTime,
          end_time: endDateTime,
          maxParticipants,
          class_type_id: classType.id,
        });
      } else {
        // recurring
        const parseStart = parseISO(startDate);
        if (!isValid(parseStart)) {
          setError("Invalid start date");
          setIsSubmitting(false);
          return;
        }
        const dayMap: Record<string, number> = {
          sunday: 0,
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
        };

        const daysSelected = Object.entries(selectedDays)
          .filter(([, val]) => val)
          .map(([day]) => day);

        for (let w = 0; w < weeksCount; w++) {
          const baseDate = addWeeks(parseStart, w);
          for (const day of daysSelected) {
            const dayIndex = dayMap[day];
            const tempDate = new Date(baseDate);
            // shift to correct weekday
            tempDate.setDate(tempDate.getDate() + (dayIndex - tempDate.getDay()));
            const classDateStr = format(tempDate, "yyyy-MM-dd");
            const startDateTime = `${classDateStr}T${recurringStartTime}`;
            const endDateTime = `${classDateStr}T${recurringEndTime}`;
            inserts.push({
              current_gym_id: currentGymId,
              class_name: classType.class_name,
              start_time: startDateTime,
              end_time: endDateTime,
              maxParticipants,
              class_type_id: classType.id,
            });
          }
        }
      }

      const { error: insertError } = await supabase
        .from("class_schedules")
        .insert(inserts);

      if (insertError) {
        setError(insertError.message);
      } else {
        refreshSchedules();
        onClose();
      }
    } catch (err: any) {
      setError("Unexpected error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderStepContent() {
    if (currentStep === 1) {
      return (
        <div>
          <h3 className="text-md font-semibold text-pink-400 mb-2">
            Step 1: Confirm Class Type
          </h3>
          <p>You selected: {classType.class_name}</p>
        </div>
      );
    } else if (currentStep === 2) {
      return (
        <div>
          <h3 className="text-md font-semibold text-pink-400 mb-2">
            Step 2: Single or Recurring
          </h3>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                checked={occurrenceType === "single"}
                onChange={() => setOccurrenceType("single")}
              />
              <span>Single Class</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                checked={occurrenceType === "recurring"}
                onChange={() => setOccurrenceType("recurring")}
              />
              <span>Recurring Schedule</span>
            </label>
          </div>
        </div>
      );
    } else if (currentStep === 3) {
      if (occurrenceType === "single") {
        return (
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-pink-400">
              Step 3: Date & Time (Single)
            </h3>
            <div>
              <label className="block text-sm mb-1">Date</label>
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="p-2 w-full bg-gray-800 border border-gray-600 rounded"
              />
            </div>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm mb-1">Start Time</label>
                <select
                  value={singleStartTime}
                  onChange={(e) => setSingleStartTime(e.target.value)}
                  className="p-2 bg-gray-800 border border-gray-600 rounded"
                >
                  {possibleStartTimes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Duration (min)</label>
                <select
                  value={singleDuration}
                  onChange={(e) => setSingleDuration(Number(e.target.value))}
                  className="p-2 bg-gray-800 border border-gray-600 rounded"
                >
                  {possibleDurations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">End Time</label>
              <input
                type="text"
                value={singleEndTime}
                readOnly
                className="p-2 w-full bg-gray-700 border border-gray-600 rounded"
              />
            </div>
          </div>
        );
      } else {
        // recurring
        const days = [
          "sunday","monday","tuesday","wednesday","thursday","friday","saturday"
        ];
        return (
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-pink-400">
              Step 3: Recurring Details
            </h3>
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 w-full bg-gray-800 border border-gray-600 rounded"
              />
            </div>
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm mb-1">Start Time</label>
                <select
                  value={recurringStartTime}
                  onChange={(e) => setRecurringStartTime(e.target.value)}
                  className="p-2 bg-gray-800 border border-gray-600 rounded"
                >
                  {possibleStartTimes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Duration (min)</label>
                <select
                  value={recurringDuration}
                  onChange={(e) => setRecurringDuration(Number(e.target.value))}
                  className="p-2 bg-gray-800 border border-gray-600 rounded"
                >
                  {possibleDurations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">End Time</label>
              <input
                type="text"
                value={recurringEndTime}
                readOnly
                className="p-2 w-full bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            {/* Days of week */}
            <div>
              <label className="block text-sm mb-1">Days of the Week</label>
              <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                  <label key={day} className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={selectedDays[day]}
                      onChange={() => handleDayToggle(day)}
                    />
                    <span className="capitalize">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Number of Weeks</label>
              <input
                type="number"
                min={1}
                value={weeksCount}
                onChange={(e) => setWeeksCount(Number(e.target.value))}
                className="p-2 bg-gray-800 border border-gray-600 rounded w-20"
              />
            </div>
          </div>
        );
      }
    } else if (currentStep === 4) {
      return (
        <div className="space-y-3">
          <h3 className="text-md font-semibold text-pink-400">
            Step 4: Max Participants
          </h3>
          <input
            type="number"
            min={1}
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(Number(e.target.value))}
            className="p-2 bg-gray-800 border border-gray-600 rounded w-24"
          />
        </div>
      );
    } else if (currentStep === 5) {
      return (
        <div className="space-y-3">
          <h3 className="text-md font-semibold text-pink-400">
            Step 5: Review & Confirm
          </h3>
          {/* Show a brief summary */}
          {renderPreview()}
          <p>If everything looks good, click "Create Classes".</p>
        </div>
      );
    }
    return null;
  }

  function renderPreview() {
    if (occurrenceType === "single") {
      return (
        <div className="text-sm">
          <p>Class: {classType.class_name}</p>
          <p>Date: {singleDate}</p>
          <p>Time: {singleStartTime} - {singleEndTime}</p>
          <p>Max Participants: {maxParticipants}</p>
        </div>
      );
    } else {
      const chosenDays = Object.entries(selectedDays)
        .filter(([, val]) => val)
        .map(([day]) => day)
        .join(", ");
      return (
        <div className="text-sm">
          <p>Class: {classType.class_name}</p>
          <p>Start: {startDate}</p>
          <p>Days: {chosenDays}</p>
          <p>Time: {recurringStartTime} - {recurringEndTime}</p>
          <p>Weeks: {weeksCount}</p>
          <p>Max Participants: {maxParticipants}</p>
        </div>
      );
    }
  }

  return (
    <div className="w-full h-full bg-gray-900 text-gray-200 flex flex-col overflow-y-auto p-2">
      {/* Step Indicator */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 font-semibold">
          Step {currentStep} of {totalSteps}
        </p>
        <div className="flex space-x-1 mt-2">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-grow rounded-full ${
                idx < currentStep ? "bg-pink-500" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Render current step */}
      {renderStepContent()}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      {/* Nav buttons */}
      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={goBack}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
          >
            Back
          </button>
        )}
        <div className="flex space-x-2">
          {currentStep < totalSteps && (
            <button
              type="button"
              onClick={goNext}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          )}
          {currentStep === totalSteps && (
            <button
              type="button"
              onClick={handleCreateClasses}
              disabled={isSubmitting}
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-500"
            >
              {isSubmitting ? "Creating..." : "Create Classes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
