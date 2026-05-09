"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";

type ScoreBoardProps = {
  totalCoins: number;
  className?: string;
};

function formatScore(value: number) {
  return Math.max(0, Math.round(value)).toString().padStart(6, "0");
}

export function ScoreBoard({ totalCoins, className = "" }: ScoreBoardProps) {
  const [displayCoins, setDisplayCoins] = useState(totalCoins);
  const currentCoinsRef = useRef(totalCoins);

  useEffect(() => {
    const controls = animate(currentCoinsRef.current, totalCoins, {
      duration: 0.55,
      ease: "easeOut",
      onUpdate: (latestValue) => {
        currentCoinsRef.current = latestValue;
        setDisplayCoins(latestValue);
      },
    });

    return () => controls.stop();
  }, [totalCoins]);

  return (
    <motion.section
      key={totalCoins}
      aria-label="Total coins"
      initial={{ scale: 0.98, filter: "brightness(1)" }}
      animate={{
        scale: [1, 1.04, 1],
        filter: ["brightness(1)", "brightness(1.35)", "brightness(1)"],
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={[
        "relative overflow-hidden rounded-3xl border-2 border-fuchsia-400 bg-slate-950 px-6 py-5 shadow-[0_0_35px_rgba(217,70,239,0.45)]",
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.25),_transparent_45%)] before:content-['']",
        "after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-cyan-200 after:shadow-[0_0_18px_rgba(103,232,249,1)] after:content-['']",
        className,
      ].join(" ")}
    >
      <div className="relative z-10 flex flex-col gap-2">
        <span className="font-mono text-xs font-black uppercase tracking-[0.35em] text-cyan-200 drop-shadow-[0_0_8px_rgba(103,232,249,0.95)]">
          Coins
        </span>
        <motion.span
          key={`score-${totalCoins}`}
          initial={{ y: 8, opacity: 0.75 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="font-mono text-4xl font-black tabular-nums tracking-[0.18em] text-yellow-300 drop-shadow-[0_0_16px_rgba(250,204,21,1)] sm:text-5xl"
        >
          {formatScore(displayCoins)}
        </motion.span>
        <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.28em] text-fuchsia-200 drop-shadow-[0_0_8px_rgba(232,121,249,0.9)]">
          Arcade bank
        </span>
      </div>
    </motion.section>
  );
}
