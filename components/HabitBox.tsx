"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type HabitBoxStatus = "checked" | "unchecked" | "future";

type HabitBoxClickResult =
  | number
  | { coins_earned: number }
  | null
  | undefined
  | void;

type HabitBoxProps = {
  status: HabitBoxStatus;
  awardedCoinValue?: number | null;
  onClick?: () => HabitBoxClickResult | Promise<HabitBoxClickResult>;
  ariaLabel?: string;
  className?: string;
};

type MaybeAsyncClickResult =
  | HabitBoxClickResult
  | Promise<HabitBoxClickResult>;

const particleOffsets = [
  { x: -28, y: -24 },
  { x: 0, y: -34 },
  { x: 28, y: -24 },
  { x: 34, y: 0 },
  { x: 24, y: 28 },
  { x: 0, y: 34 },
  { x: -24, y: 28 },
  { x: -34, y: 0 },
];

function getCoinValue(result: HabitBoxClickResult): number | null {
  if (typeof result === "number") {
    return result;
  }

  if (
    result &&
    typeof result === "object" &&
    typeof result.coins_earned === "number"
  ) {
    return result.coins_earned;
  }

  return null;
}

function isPromiseClickResult(
  result: MaybeAsyncClickResult,
): result is Promise<HabitBoxClickResult> {
  return Boolean(result && typeof result === "object" && "then" in result);
}

export function HabitBox({
  status,
  awardedCoinValue = null,
  onClick,
  ariaLabel,
  className = "",
}: HabitBoxProps) {
  const [burstKey, setBurstKey] = useState(0);
  const [activeCoinValue, setActiveCoinValue] = useState<number | null>(null);
  const [isBursting, setIsBursting] = useState(false);
  const burstTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFuture = status === "future";
  const isChecked = status === "checked";

  useEffect(() => {
    return () => {
      if (burstTimeoutRef.current) {
        clearTimeout(burstTimeoutRef.current);
      }
    };
  }, []);

  function handleClick() {
    if (isFuture) {
      return;
    }

    const clickResult = onClick?.();
    const immediateCoinValue = isPromiseClickResult(clickResult)
      ? null
      : getCoinValue(clickResult);

    setActiveCoinValue(immediateCoinValue ?? awardedCoinValue);
    setBurstKey((currentKey) => currentKey + 1);
    setIsBursting(true);

    if (burstTimeoutRef.current) {
      clearTimeout(burstTimeoutRef.current);
    }

    burstTimeoutRef.current = setTimeout(() => {
      setIsBursting(false);
    }, 700);

    void Promise.resolve(clickResult).then((result) => {
      const resolvedCoinValue = getCoinValue(result);

      if (resolvedCoinValue !== null) {
        setActiveCoinValue(resolvedCoinValue);
      }
    });
  }

  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isChecked}
      disabled={isFuture}
      onClick={handleClick}
      whileTap={isFuture ? undefined : { scale: 0.88 }}
      className={[
        "relative grid h-9 w-9 place-items-center overflow-visible rounded-lg border text-sm font-bold transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-slate-950",
        isChecked
          ? "border-yellow-300 bg-yellow-400 text-slate-950 shadow-[0_0_18px_rgba(250,204,21,0.45)]"
          : "border-slate-600 bg-slate-800 text-slate-200 hover:border-cyan-300 hover:bg-slate-700",
        isFuture
          ? "cursor-not-allowed border-slate-700 bg-slate-200 text-slate-400 opacity-50 grayscale hover:border-slate-700 hover:bg-slate-200"
          : "cursor-pointer",
        className,
      ].join(" ")}
    >
      <span className="relative z-10">
        {isChecked ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-4 w-4"
            fill="none"
          >
            <path
              d="M3.25 8.25 6.5 11.5l6.25-7"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          </svg>
        ) : null}
      </span>

      <AnimatePresence>
        {isBursting ? (
          <motion.span
            key={`burst-${burstKey}`}
            className="pointer-events-none absolute inset-0 z-20"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-yellow-300"
              initial={{ opacity: 0.9, scale: 0.3 }}
              animate={{ opacity: 0, scale: 2.2 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            {particleOffsets.map((offset, index) => (
              <motion.span
                key={`${burstKey}-${index}`}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]"
                initial={{ x: "-50%", y: "-50%", opacity: 1, scale: 0.4 }}
                animate={{
                  x: `calc(-50% + ${offset.x}px)`,
                  y: `calc(-50% + ${offset.y}px)`,
                  opacity: 0,
                  scale: 1.3,
                }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            ))}

            {activeCoinValue !== null ? (
              <motion.span
                className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-yellow-300 px-2 py-0.5 text-xs font-black text-slate-950 shadow-lg"
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: -18, scale: 1 }}
                exit={{ opacity: 0, y: -28 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                +{activeCoinValue}
              </motion.span>
            ) : null}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}
