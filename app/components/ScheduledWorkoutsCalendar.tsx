"use client";

import React from "react";
import { format } from "date-fns";

interface ScheduledWorkout {
  id: string;
  name: string;
  date: string;
  gym_id: string;
  workout_details?: any; // JSONB
}

type WeeklyProgramming = {
  sunday: ScheduledWorkout[];
  monday: ScheduledWorkout[];
  tuesday: ScheduledWorkout[];
  wednesday: ScheduledWorkout[];
  thursday: ScheduledWorkout[];
  friday: ScheduledWorkout[];
  saturday: ScheduledWorkout[];
};

interface Props {
  weekDates: Date[];
  programming: WeeklyProgramming;
}

export default function ScheduledWorkoutsCalendar({ weekDates, programming }: Props) {
  return (
    <div className="grid grid-cols-7 gap-4">
      {weekDates.map((dayDate, idx) => {
        const dayStr = format(dayDate, "EEEE").toLowerCase() as keyof WeeklyProgramming;
        const workouts = programming[dayStr];

        return (
          <div
            key={idx}
            className="bg-[#1F1F1F] border border-[#374151] rounded-xl shadow-md p-3 text-sm flex flex-col"
          >
            {/* Day Header */}
            <h2 className="font-semibold text-pink-400 mb-2">
              {format(dayDate, "EEE, MMM d")}
            </h2>

            {workouts.length === 0 ? (
              <p className="text-gray-400">No workouts</p>
            ) : (
              workouts.map((w) => (
                <div
                  key={w.id}
                  className="mb-2 bg-[#2A2A2A] border border-[#374151] rounded-md p-2"
                >
                  <p className="text-gray-100 font-medium">{w.name}</p>
                  
                  {/* Display the JSONB details if present */}
                  {w.workout_details && (
                    <WorkoutDetailsDisplay details={w.workout_details} />
                  )}
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * A small helper component to display the JSON structure:
 * {
 *   "type": "Unknown",
 *   "notes": [],
 *   "workoutBlocks": [
 *     {
 *       "lines": [
 *         {"name": "Strength"},
 *         {"name": "Back Squats", "reps": [5,5,4,4,3,3]}
 *       ]
 *     }
 *   ]
 * }
 */
function WorkoutDetailsDisplay({ details }: { details: any }) {
  // Safely parse if it might be a string
  let parsed = details;
  if (typeof details === "string") {
    try {
      parsed = JSON.parse(details);
    } catch (err) {
      // fallback
      return <p className="text-red-500 text-xs">Error parsing workout details</p>;
    }
  }

  if (!parsed || typeof parsed !== "object") {
    return <p className="text-gray-400 text-xs">No details</p>;
  }

  const type = parsed.type || "Unknown";
  const blocks = Array.isArray(parsed.workoutBlocks) ? parsed.workoutBlocks : [];
  const notes = Array.isArray(parsed.notes) ? parsed.notes : [];

  return (
    <div className="mt-2 text-gray-300 text-xs">
      {/* Type */}
      <p className="text-pink-300 font-semibold mb-1">Type: {type}</p>

      {/* Blocks */}
      {blocks.map((block: any, idx: number) => (
        <div key={idx} className="mb-2 border-b border-gray-600 pb-2">
          {Array.isArray(block.lines) && block.lines.map((line: any, lineIdx: number) => (
            <div key={lineIdx} className="mb-1">
              <span className="font-medium text-gray-200">{line.name}</span>
              {line.reps && Array.isArray(line.reps) && (
                <span className="ml-2 text-gray-400">
                  (Reps: {line.reps.join(", ")})
                </span>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Notes */}
      {notes.length > 0 && (
        <div className="mt-1">
          <p className="text-pink-300 font-medium">Notes:</p>
          <ul className="list-disc ml-5">
            {notes.map((n: any, i: number) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
