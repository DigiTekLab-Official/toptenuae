// src/components/RamadanCountdown.tsx

import { useState, useEffect } from "react";

export default function RamadanCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target Date: Feb 19, 2026 (Approximate)
    const targetDate = new Date("2026-02-19T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex flex-wrap justify-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
      <div className="text-center min-w-[70px]">
        <span className="block text-3xl font-bold text-white tabular-nums">{timeLeft.days}</span>
        <span className="text-xs text-purple-200 uppercase tracking-wider">Days</span>
      </div>
      <div className="text-2xl font-light text-purple-300 self-center mb-4">:</div>
      <div className="text-center min-w-[70px]">
        <span className="block text-3xl font-bold text-white tabular-nums">{timeLeft.hours}</span>
        <span className="text-xs text-purple-200 uppercase tracking-wider">Hours</span>
      </div>
      <div className="text-2xl font-light text-purple-300 self-center mb-4">:</div>
      <div className="text-center min-w-[70px]">
        <span className="block text-3xl font-bold text-white tabular-nums">{timeLeft.minutes}</span>
        <span className="text-xs text-purple-200 uppercase tracking-wider">Mins</span>
      </div>
      <div className="text-2xl font-light text-purple-300 self-center mb-4">:</div>
      <div className="text-center min-w-[70px]">
        <span className="block text-3xl font-bold text-amber-400 tabular-nums">{timeLeft.seconds}</span>
        <span className="text-xs text-purple-200 uppercase tracking-wider">Secs</span>
      </div>
    </div>
  );
}