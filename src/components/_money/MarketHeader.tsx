// src/components/money/MarketHeader.tsx
'use client';

import React from 'react';
import { Clock, RefreshCw, Zap } from 'lucide-react';

interface MarketHeaderProps {
  title: string;
  description: string;
  lastUpdated: string;
}

// Helper for human-readable date
function formatTime(isoString: string) {
  try {
    return new Date(isoString).toLocaleString('en-AE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return isoString;
  }
}

export default function MarketHeader({ title, description, lastUpdated }: MarketHeaderProps) {
  const formattedDate = formatTime(lastUpdated);

  return (
    <header className="relative bg-[#4b0082] text-white overflow-hidden shadow-lg">
      {/* 1. The Gold Gradient Line (Brand Signature) */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 z-20"></div>

      {/* Background Decorative Glow (Optional, adds depth) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
          
          {/* Left: Title & Info */}
          <div className="max-w-3xl">
            {/* Live Badge & Date */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-purple-900 uppercase tracking-wide">
                <Zap className="w-3 h-3 mr-1 fill-current" />
                Live Market
              </span>
              <span className="flex items-center text-xs text-purple-200 font-medium">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                Updated: {formattedDate}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              {title}
            </h1>
            <p className="text-lg text-purple-100 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          {/* Right: Live Pulse Indicator */}
          <div className="hidden md:flex flex-col items-end">
             <div className="flex items-center space-x-3 bg-purple-900/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-purple-700/50 shadow-sm">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-white leading-none">Market Open</span>
                  <span className="text-[10px] text-purple-300 flex items-center mt-1">
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin-slow" /> 
                    Auto-updates 60s
                  </span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}