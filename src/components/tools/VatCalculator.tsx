// src/components/tools/VatCalculator.tsx
'use client';

import React, { useState, useEffect } from 'react';

export default function VatCalculator() {
  const [amount, setAmount] = useState<number | ''>('');
  const [vatRate] = useState(5); // UAE Standard Rate
  const [mode, setMode] = useState<'add' | 'remove'>('add'); // 'add' = Exclusive, 'remove' = Inclusive
  
  const [result, setResult] = useState({
    net: 0,
    vat: 0,
    gross: 0
  });

  useEffect(() => {
    const val = Number(amount) || 0;
    
    if (mode === 'add') {
      // Logic: Amount is Net (Before Tax)
      // Math: Net * 0.05 = VAT
      const vatValue = val * (vatRate / 100);
      const grossValue = val + vatValue;
      
      setResult({
        net: val,
        vat: vatValue,
        gross: grossValue
      });
    } else {
      // Logic: Amount is Gross (After Tax)
      // Math: Gross / 1.05 = Net
      const netValue = val / (1 + (vatRate / 100));
      const vatValue = val - netValue;

      setResult({
        net: netValue,
        vat: vatValue,
        gross: val
      });
    }
  }, [amount, mode, vatRate]);

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 font-sans">
      
      {/* Header */}
      <div className="bg-[#4b0082] p-5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
        <h2 className="text-xl font-bold text-white relative z-10">UAE VAT Calculator</h2>
        <p className="text-amber-300 text-sm uppercase tracking-wider font-semibold mt-1 relative z-10">
          Standard 5% Rate
        </p>
      </div>

      {/* Tabs for Mode Switching */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setMode('add')}
          className={`flex-1 py-4 text-sm font-bold transition-colors cursor-pointer ${
            mode === 'add' 
              ? 'bg-purple-50 text-[#4b0082] border-b-2 border-[#4b0082]' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Add VAT (+)
          <span className="block text-[14px] font-normal text-gray-400 mt-1">Amount excludes VAT</span>
        </button>
        <button
          onClick={() => setMode('remove')}
          className={`flex-1 py-4 text-sm font-bold transition-colors cursor-pointer ${
            mode === 'remove' 
              ? 'bg-purple-50 text-[#4b0082] border-b-2 border-[#4b0082]' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Remove VAT (-)
          <span className="block text-[14px] font-normal text-gray-400 mt-1">Amount includes VAT</span>
        </button>
      </div>

      {/* Input Form */}
      <div className="p-6 space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
            Enter Amount (AED)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder={mode === 'add' ? "e.g. 1000 (Before Tax)" : "e.g. 1050 (After Tax)"}
            className="w-full p-4 text-lg border border-gray-500 rounded-lg focus:ring-2 focus:ring-[#4b0082] outline-none transition-all font-medium placeholder:text-gray-300"
          />
        </div>

        {/* Results Grid */}
        <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
          {/* Row 1: Net */}
          <div className="flex justify-between items-center p-4 border-b border-slate-100">
            <span className="text-sm text-gray-500 font-medium">Net Amount (excl. VAT)</span>
            <span className="text-lg font-bold text-slate-700">
              {result.net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Row 2: VAT */}
          <div className="flex justify-between items-center p-4 bg-amber-50/50 border-b border-slate-100">
            <span className="text-sm text-amber-700 font-bold">VAT (5%)</span>
            <span className="text-lg font-bold text-amber-600">
              {result.vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Row 3: Gross */}
          <div className="flex justify-between items-center p-4 bg-[#4b0082]/5">
            <span className="text-sm text-[#4b0082] font-bold uppercase tracking-wide">Gross Amount (Total)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-[#4b0082] font-semibold">AED</span>
              <span className="text-2xl font-extrabold text-[#4b0082]">
                {result.gross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}