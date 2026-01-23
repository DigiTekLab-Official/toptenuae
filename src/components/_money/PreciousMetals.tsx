// src/components/money/PreciousMetals.tsx
'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useRates } from '@/contexts/RatesContext';

export default function PreciousMetals() {
  const { rates } = useRates();
  
  const metals = [
    {
      name: '24K Gold (per gram)',
      price: rates.metals.gold_24k_per_gram_aed,
      change: rates.metals.gold_24k_change,
      purity: '99.9%',
      icon: '🟡'
    },
    {
      name: '22K Gold (per gram)',
      price: rates.metals.gold_22k_per_gram_aed,
      change: rates.metals.gold_24k_change * 0.916,
      purity: '91.6%',
      icon: '🟠'
    },
    {
      name: '18K Gold (per gram)',
      price: rates.metals.gold_18k_per_gram_aed,
      change: rates.metals.gold_24k_change * 0.75,
      purity: '75%',
      icon: '🔴'
    },
    {
      name: 'Silver (per gram)',
      price: rates.metals.silver_per_gram_aed,
      change: rates.metals.silver_change,
      purity: '99.9%',
      icon: '⚪'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gold & Silver</h2>
        <span className="text-sm text-gray-500">Prices in AED</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metals.map((metal) => (
          <div 
            key={metal.name} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{metal.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{metal.name}</h3>
                  <p className="text-sm text-gray-500">{metal.purity} purity</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-xl font-bold text-gray-900">
                    {metal.price.toFixed(2)} AED
                  </span>
                  <span className={`flex items-center text-sm font-medium ${
                    metal.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metal.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(metal.change).toFixed(2)}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Per gram</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Market Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">24H Market Trend</span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              Gold: +{Math.abs(rates.metals.gold_24k_change).toFixed(2)}%
            </span>
            <span className="flex items-center text-red-600">
              <TrendingDown className="w-4 h-4 mr-1" />
              Silver: {rates.metals.silver_change.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}