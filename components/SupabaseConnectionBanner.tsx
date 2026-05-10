"use client";

import type { SupabaseConnectionStatus } from "../hooks/useHabitTracker";

type SupabaseConnectionBannerProps = {
  status: SupabaseConnectionStatus;
  errorMessage?: string | null;
};

const statusContent = {
  checking: {
    label: "Checking Supabase",
    detail: "Verifying live database access...",
    dotClassName: "bg-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.95)]",
    bannerClassName: "border-yellow-300/50 bg-yellow-300/10 text-yellow-100",
  },
  connected: {
    label: "Supabase connected",
    detail: "Live habit data is available.",
    dotClassName: "bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.95)]",
    bannerClassName: "border-emerald-300/50 bg-emerald-300/10 text-emerald-100",
  },
  failed: {
    label: "Supabase connection failed",
    detail: "Check your Vercel env vars and Supabase table/RLS setup.",
    dotClassName: "bg-red-300 shadow-[0_0_12px_rgba(252,165,165,0.95)]",
    bannerClassName: "border-red-300/50 bg-red-300/10 text-red-100",
  },
};

export function SupabaseConnectionBanner({
  status,
  errorMessage,
}: SupabaseConnectionBannerProps) {
  const content = statusContent[status];

  return (
    <section
      aria-live="polite"
      className={[
        "rounded-2xl border px-4 py-3 font-mono shadow-lg shadow-slate-950/30",
        content.bannerClassName,
      ].join(" ")}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={["h-3 w-3 rounded-full", content.dotClassName].join(
              " ",
            )}
          />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em]">
              {content.label}
            </p>
            <p className="mt-1 text-xs font-bold opacity-80">
              {errorMessage && status === "failed"
                ? errorMessage
                : content.detail}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-current/30 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.25em] opacity-90">
          {status}
        </span>
      </div>
    </section>
  );
}
