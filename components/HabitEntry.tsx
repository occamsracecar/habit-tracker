"use client";

import { type FormEvent, useState } from "react";

type HabitEntryProps = {
  addHabit: (name: string) => Promise<unknown> | unknown;
};

export function HabitEntry({ addHabit }: HabitEntryProps) {
  const [habitName, setHabitName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedHabitName = habitName.trim();

    if (!trimmedHabitName || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addHabit(trimmedHabitName);
      setHabitName("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/30 sm:flex-row"
    >
      <label htmlFor="habit-name" className="sr-only">
        Habit name
      </label>
      <input
        id="habit-name"
        type="text"
        value={habitName}
        onChange={(event) => setHabitName(event.target.value)}
        placeholder="Add a new habit..."
        disabled={isSubmitting}
        className="min-h-11 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm font-medium text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30 disabled:cursor-not-allowed disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={!habitName.trim() || isSubmitting}
        className="min-h-11 rounded-xl bg-yellow-400 px-5 text-sm font-black uppercase tracking-wide text-slate-950 transition hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {isSubmitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
