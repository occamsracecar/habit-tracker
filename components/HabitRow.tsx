"use client";

import { HabitBox, type HabitBoxStatus } from "./HabitBox";
import type { HabitWithCompletions } from "../hooks/useHabitTracker";
import { isFutureDayIndex } from "../lib/utils";

type HabitRowProps = {
  habit: HabitWithCompletions;
  dayIndexes: number[];
  toggleBox: (
    habitId: string,
    dayIndex: number,
  ) =>
    | Promise<{ coins_earned: number } | null>
    | { coins_earned: number }
    | null;
};

function getHabitBoxStatus(
  habit: HabitWithCompletions,
  dayIndex: number,
): HabitBoxStatus {
  if (isFutureDayIndex(dayIndex)) {
    return "future";
  }

  return habit.completions.some(
    (completion) => completion.day_index === dayIndex,
  )
    ? "checked"
    : "unchecked";
}

export function HabitRow({ habit, dayIndexes, toggleBox }: HabitRowProps) {
  return (
    <div className="grid min-w-max grid-cols-[12rem_repeat(var(--days),2.25rem)] items-center gap-2">
      <div className="sticky left-0 z-10 truncate rounded-xl border border-slate-700 bg-slate-950/95 px-4 py-2 text-sm font-bold text-slate-100 shadow-lg shadow-slate-950/40">
        {habit.name}
      </div>

      {dayIndexes.map((dayIndex) => (
        <HabitBox
          key={`${habit.id}-${dayIndex}`}
          status={getHabitBoxStatus(habit, dayIndex)}
          ariaLabel={`${habit.name}, day ${dayIndex}`}
          onClick={() => toggleBox(habit.id, dayIndex)}
        />
      ))}
    </div>
  );
}
