"use client";

import { motion } from "framer-motion";

const habits = ["Move", "Hydrate", "Read", "Reflect"];

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm backdrop-blur">
            Next.js + Tailwind CSS + Framer Motion
          </div>

          <div className="space-y-5">
            <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Build better habits, one day at a time.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              A polished starter for your habit tracker with Supabase ready in
              <code className="mx-1 rounded bg-slate-900 px-1.5 py-0.5 text-sm text-white">
                lib/supabase.ts
              </code>
              and animation primitives already wired up.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#habits"
              className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Start tracking
            </a>
            <a
              href="https://supabase.com/docs"
              className="rounded-full border border-slate-300 bg-white/70 px-6 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Supabase docs
            </a>
          </div>
        </motion.div>

        <motion.div
          id="habits"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-500">
                Today
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Habit streaks
              </h2>
            </div>
            <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              4 active
            </div>
          </div>

          <div className="grid gap-4">
            {habits.map((habit, index) => (
              <motion.div
                key={habit}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + index * 0.08 }}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{habit}</p>
                    <p className="text-sm text-slate-500">
                      {index + 3} day streak
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  Done
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
