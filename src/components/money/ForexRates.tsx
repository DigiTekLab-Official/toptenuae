// src/components/money/ForexRates.tsx
'use client';

import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
// 1. Import the Hook and Data Type
import { useRates } from '@/contexts/RatesContext';
import { RatesData } from '@/sanity/lib/money';

// Helper to get flag emoji from currency code
const getFlag = (code: string) => {
  const flags: Record<string, string> = {
    USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', INR: '🇮🇳', PKR: '🇵🇰', PHP: '🇵🇭', SAR: '🇸🇦', AED: '🇦🇪'
  };
  return flags[code] || '🏳️';
};

interface ForexRatesProps {
  // We removed 'rates' from props because we fetch it from Context now
  featuredPairs: Array<{ code: string; name: string }>;
}

export default function ForexRates({ featuredPairs }: ForexRatesProps) {
  // 2. USE THE CONTEXT (Fixes the crash & enables live updates)
  const { rates } = useRates();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- CONVERTER STATE ---
  const [amount, setAmount] = useState<number>(1);
  const [targetCurrency, setTargetCurrency] = useState<string>('INR');
  const [convertedResult, setConvertedResult] = useState<number | null>(null);

  // Safety check: If rates are not yet loaded (rare edge case), show loading or return null
  if (!rates || !rates.forex) {
    return <div className="p-6 text-gray-400">Loading rates...</div>;
  }

  // Filter logic
  const filteredPairs = featuredPairs.filter(pair =>
    pair.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- CALCULATION LOGIC ---
  const handleConvert = () => {
    const rateData = rates.forex[targetCurrency];
    if (rateData) {
      setConvertedResult(amount * rateData.rate);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Forex Rates</h2>
        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">1 AED Base</span>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search currency..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Currency List */}
      <div className="space-y-3 mb-8">
        {filteredPairs.slice(0, 5).map((pair) => {
          // Access data from the Context 'rates'
          const forexData = rates.forex[pair.code];
          
          if (!forexData) return null;
          
          return (
            <div key={pair.code} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getFlag(pair.code)}</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{pair.code}</h4>
                  <p className="text-xs text-gray-500">{pair.name}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-mono font-bold text-gray-900">
                  {forexData.rate.toFixed(4)}
                </div>
                <div className={`flex items-center justify-end text-xs ${forexData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {forexData.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {Math.abs(forexData.change).toFixed(2)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* --- QUICK CONVERT --- */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center text-sm">
          <ArrowRightLeft className="w-4 h-4 mr-2 text-amber-600" />
          Quick Converter
        </h4>
        
        <div className="flex space-x-2 mb-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">AED</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-amber-500 outline-none"
            />
          </div>
          
          <select 
            className="w-24 px-2 py-2 text-sm border border-gray-300 rounded-lg bg-white outline-none"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
          >
            {featuredPairs.map(p => <option key={p.code} value={p.code}>{p.code}</option>)}
          </select>
        </div>

        <button 
          onClick={handleConvert}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm mb-3"
        >
          Convert Now
        </button>

        {convertedResult !== null && (
          <div className="text-center pt-3 border-t border-gray-200/50">
            <span className="text-xs text-gray-500">Result:</span>
            <div className="text-xl font-bold text-gray-900">
              {convertedResult.toLocaleString('en-AE', { maximumFractionDigits: 2 })} {targetCurrency}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}