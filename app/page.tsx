"use client";

import { HabitEntry } from "../components/HabitEntry";
import { HabitGrid } from "../components/HabitGrid";
import { ScoreBoard } from "../components/ScoreBoard";
import { SupabaseConnectionBanner } from "../components/SupabaseConnectionBanner";
import { useHabitTracker } from "../hooks/useHabitTracker";

export default function Home() {
  const {
    habits,
    totalCoins,
    isLoading,
    error,
    connectionStatus,
    addHabit,
    toggleBox,
  } = useHabitTracker();
  const hasHabits = habits.length > 0;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <SupabaseConnectionBanner
          status={connectionStatus}
          errorMessage={error}
        />

        <header className="flex flex-col gap-3">
          <p className="font-mono text-xs font-black uppercase tracking-[0.4em] text-cyan-200 drop-shadow-[0_0_8px_rgba(103,232,249,0.9)]">
            Habit arcade
          </p>
          <h1 className="text-4xl font-black tracking-tight text-yellow-300 drop-shadow-[0_0_18px_rgba(250,204,21,0.75)] sm:text-6xl">
            Daily Loot Tracker
          </h1>
          <p className="max-w-2xl text-sm font-medium text-slate-400 sm:text-base">
            Check off daily habits, trigger loot bursts, and bank coins as you
            build your streak.
          </p>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-400/50 bg-red-950/50 px-4 py-3 text-sm font-bold text-red-100">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-3xl border border-slate-700 bg-slate-900/75 p-8 text-center font-mono text-sm font-black uppercase tracking-[0.3em] text-cyan-200">
            Loading quest data...
          </div>
        ) : null}

        {!isLoading ? <HabitEntry addHabit={addHabit} /> : null}

        {!isLoading && hasHabits ? (
          <div className="flex flex-col gap-6">
            <ScoreBoard totalCoins={totalCoins} />
            <HabitGrid habits={habits} toggleBox={toggleBox} />
          </div>
        ) : null}

        {!isLoading && !hasHabits ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center text-sm font-bold text-slate-400">
            Add your first habit above to start building the monthly grid.
          </div>
        ) : null}
      </div>
    </main>
  );
}
