// src/components/deals/CountdownTimer.tsx
'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: string;
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
  // 1. Initialize with specific "loading" state to prevent hydration errors
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    setMounted(true); // Signal that we are on the client
    
    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false,
      };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  // 2. Prevent Hydration Mismatch: Don't render until client loads
  if (!mounted) return null;

  if (timeLeft.expired) {
    return <span className="text-red-600 text-sm font-bold bg-red-50 px-2 py-1 rounded">Expired</span>;
  }

  // Format time units with leading zeros
  const formatTimeUnit = (unit: number) => unit.toString().padStart(2, '0');

  return (
    <div className="flex items-center space-x-1 ml-2">
      {/* Only show days if > 0 to save space */}
      {timeLeft.days > 0 && (
        <>
          <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold min-w-[32px] text-center">
            {formatTimeUnit(timeLeft.days)}d
          </div>
          <span className="text-gray-400 font-bold">:</span>
        </>
      )}
      <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold min-w-[32px] text-center">
        {formatTimeUnit(timeLeft.hours)}h
      </div>
      <span className="text-gray-400 font-bold">:</span>
      <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold min-w-[32px] text-center">
        {formatTimeUnit(timeLeft.minutes)}m
      </div>
      <span className="text-gray-400 font-bold">:</span>
      <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold min-w-[32px] text-center animate-pulse">
        {formatTimeUnit(timeLeft.seconds)}s
      </div>
    </div>
  );
}