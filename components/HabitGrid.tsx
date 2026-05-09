"use client";

import type { CSSProperties } from "react";

import { HabitRow } from "./HabitRow";
import type { HabitWithCompletions } from "../hooks/useHabitTracker";
import { formatCurrentMonthName, getDaysInCurrentMonth } from "../lib/utils";

type HabitGridProps = {
  habits: HabitWithCompletions[];
  toggleBox: (
    habitId: string,
    dayIndex: number,
  ) =>
    | Promise<{ coins_earned: number } | null>
    | { coins_earned: number }
    | null;
};

type HabitGridStyle = CSSProperties & {
  "--days": number;
};

function getDayIndexes() {
  return Array.from(
    { length: getDaysInCurrentMonth() },
    (_unusedValue, index) => index + 1,
  );
}

export function HabitGrid({ habits, toggleBox }: HabitGridProps) {
  const dayIndexes = getDayIndexes();
  const gridStyle: HabitGridStyle = {
    "--days": dayIndexes.length,
  };

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/75 p-4 shadow-2xl shadow-slate-950/40">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">
            Current quest
          </p>
          <h2 className="text-2xl font-black text-slate-100">
            {formatCurrentMonthName()}
          </h2>
        </div>
        <p className="rounded-full border border-yellow-300/40 bg-yellow-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-yellow-200">
          {dayIndexes.length} days
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max flex-col gap-2" style={gridStyle}>
          <div className="grid grid-cols-[12rem_repeat(var(--days),2.25rem)] items-center gap-2">
            <div className="sticky left-0 z-20 rounded-xl bg-slate-900/95 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-slate-400">
              Habit
            </div>

            {dayIndexes.map((dayIndex) => (
              <div
                key={dayIndex}
                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-700 bg-slate-950 text-xs font-black text-slate-400"
              >
                {dayIndex}
              </div>
            ))}
          </div>

          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              dayIndexes={dayIndexes}
              toggleBox={toggleBox}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
