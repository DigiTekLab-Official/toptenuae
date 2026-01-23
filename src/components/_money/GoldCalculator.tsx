'use client';

import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
// 1. Import the hook
import { useRates } from '@/contexts/RatesContext';

interface GoldCalculatorProps {
  // We keep this as a fallback for the initial render (SSR)
  goldRate24K: number;
  title?: string;
}

export default function GoldCalculator({ 
  goldRate24K: initialRate, // Rename prop to avoid confusion
  title = "Gold Value Calculator" 
}: GoldCalculatorProps) {
  
  // 2. Connect to the Live Context
  const { rates } = useRates();
  
  // 3. Determine which rate to use
  // If context has data (live), use it. Otherwise use initial prop (server).
  const liveRate = rates?.metals?.gold_24k_per_gram_aed;
  const currentRate = liveRate || initialRate;

  const [weight, setWeight] = useState<number>(10);
  const [purity, setPurity] = useState<'24K' | '22K' | '18K'>('24K');
  
  const purityMultipliers = {
    '24K': 1.0,
    '22K': 0.916,
    '18K': 0.75
  };
  
  const calculateValue = () => {
    if (!currentRate) return 0;
    const baseValue = currentRate * weight;
    return baseValue * purityMultipliers[purity];
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calculator className="w-8 h-8 text-amber-600" />
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      
      <div className="space-y-6">
        {/* Weight Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gold Weight (grams)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="1000"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value) || 1)}
              className="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="w-24">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                className="w-full border border-amber-300 rounded-lg px-3 py-2 text-center"
                min="1"
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1g</span>
            <span>100g</span>
            <span>500g</span>
            <span>1000g</span>
          </div>
        </div>
        
        {/* Purity Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gold Purity
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['24K', '22K', '18K'] as const).map((karat) => (
              <button
                key={karat}
                onClick={() => setPurity(karat)}
                className={`py-3 rounded-lg border-2 transition-all ${
                  purity === karat
                    ? 'border-amber-500 bg-amber-100 text-amber-700 font-bold'
                    : 'border-gray-300 hover:border-amber-300'
                }`}
              >
                <div>{karat}</div>
                <div className="text-xs text-gray-600">
                  {(purityMultipliers[karat] * 100).toFixed(1)}%
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Result Display */}
        <div className="bg-white rounded-lg p-6 border border-amber-200 shadow-sm text-center">
          <div className="text-sm text-gray-500 mb-2">Estimated Value</div>
          <div className="text-4xl font-bold text-amber-700 mb-2">
            {calculateValue().toLocaleString('en-AE', {
              style: 'currency',
              currency: 'AED',
              minimumFractionDigits: 2
            })}
          </div>
          <div className="text-xs text-gray-600">
            {/* Display the Current Rate being used */}
            For {weight}g of {purity} gold at {currentRate ? currentRate.toFixed(2) : '0.00'} AED/g
          </div>
        </div>
        
        {/* Quick Presets */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Common Weights</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[1, 5, 10, 31.1, 50, 100, 500, 1000].map((preset) => (
              <button
                key={preset}
                onClick={() => setWeight(preset)}
                className="py-2 bg-white border border-gray-300 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors"
              >
                <span className="font-medium">{preset}g</span>
                <div className="text-[10px] text-gray-500">
                  {((currentRate * preset * purityMultipliers[purity])).toLocaleString('en-AE', {
                    style: 'currency',
                    currency: 'AED',
                    minimumFractionDigits: 0
                  })}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}