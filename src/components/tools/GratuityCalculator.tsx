// src/components/tools/GratuityCalculator.tsx
'use client';

import React, { useState } from 'react';

export default function GratuityCalculator() {
  // Inputs
  const [basicSalary, setBasicSalary] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [unpaidDays, setUnpaidDays] = useState<number | ''>('');
  const [contractType, setContractType] = useState('Limited');
  const [exitReason, setExitReason] = useState('Resignation');
  
  // Results
  const [result, setResult] = useState<number | null>(null);
  const [serviceDuration, setServiceDuration] = useState<string>('');

  const calculateGratuity = () => {
    if (!basicSalary || !startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const salary = Number(basicSalary);
    const unpaid = Number(unpaidDays) || 0;

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const netDays = totalDays - unpaid;
    const yearsOfService = netDays / 365;

    const displayYears = Math.floor(yearsOfService);
    const displayMonths = Math.floor((yearsOfService - displayYears) * 12);
    setServiceDuration(`${displayYears} Years, ${displayMonths} Months`);

    if (yearsOfService < 1) {
      setResult(0);
      return;
    }

    const dailySalary = salary / 30;
    let totalGratuity = 0;

    if (yearsOfService <= 5) {
      totalGratuity = yearsOfService * 21 * dailySalary;
    } else {
      const firstFive = 5 * 21 * dailySalary;
      const remainingYears = yearsOfService - 5;
      const additional = remainingYears * 30 * dailySalary;
      totalGratuity = firstFive + additional;
    }

    const maxCap = salary * 24;
    setResult(Math.min(totalGratuity, maxCap));
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 font-sans">
      
      {/* Header */}
      <div className="bg-[#4b0082] p-5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
        {/* WAVE FIX: Heading structure safe */}
        <h2 className="text-xl font-bold text-white relative z-10">UAE Gratuity Calculator</h2>
        <p className="text-amber-300 text-sm uppercase tracking-wider font-semibold mt-1 relative z-10">
          Official MOHRE Formula (2026)
        </p>
      </div>

      {/* Form */}
      <form className="p-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        
        {/* Basic Salary */}
        <div>
          <label htmlFor="basicSalary" className="block text-sm font-semibold text-gray-700 mb-1">
            Last Drawn Basic Salary (AED)
          </label>
          <input
            id="basicSalary"
            name="basicSalary"
            type="number"
            value={basicSalary}
            onChange={(e) => setBasicSalary(Number(e.target.value))}
            placeholder="e.g. 10000"
            className="w-full px-3 py-1 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#4b0082] outline-none transition-all font-medium"
          />
          <p className="text-sm text-gray-400 mt-1">Basic salary only (exclude allowances).</p>
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-1">
              First Working Day
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#4b0082] outline-none text-gray-600"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-1">
              Last Working Day
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#4b0082] outline-none text-gray-600"
            />
          </div>
        </div>

        {/* Contract & Exit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contractType" className="block text-sm font-semibold text-gray-700 mb-1">
              Type of Contract
            </label>
            <select 
              id="contractType"
              name="contractType"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full  px-3 py-1 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#4b0082] outline-none bg-white"
            >
              <option value="Limited">Limited Contract</option>
              <option value="Unlimited">Unlimited Contract</option>
            </select>
          </div>
          <div>
            <label htmlFor="exitReason" className="block text-sm font-semibold text-gray-700 mb-1">
              Reason for Exit
            </label>
            <select 
              id="exitReason"
              name="exitReason"
              value={exitReason}
              onChange={(e) => setExitReason(e.target.value)}
              className="w-full px-3 py-1 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#4b0082] outline-none bg-white"
            >
              <option value="Resignation">Resignation</option>
              <option value="Termination">Termination</option>
              <option value="End of Contract">End of Contract</option>
            </select>
          </div>
        </div>

        {/* Unpaid Leave */}
        <div>
           <label htmlFor="unpaidDays" className="block text-sm font-semibold text-gray-700 mb-1">
             Unpaid Leave Days (Optional)
           </label>
           <input
             id="unpaidDays"
             name="unpaidDays"
             type="number"
             value={unpaidDays}
             onChange={(e) => setUnpaidDays(Number(e.target.value))}
             placeholder="0"
             className="w-full px-3 py-1 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#4b0082] outline-none"
           />
           <p className="text-sm text-gray-400 mt-1">Deducted from service period.</p>
        </div>

        {/* Calculate Button */}
        <button
          type="button" // Explicitly prevent form submission
          onClick={calculateGratuity}
          className="w-full bg-[#4b0082] hover:bg-[#3b0066] text-white font-bold py-4 rounded-lg shadow-lg shadow-purple-900/20 transition-all transform active:scale-[0.98] mt-2"
        >
          Calculate Gratuity
        </button>

        {/* Result Display */}
        {result !== null && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 text-center animate-in fade-in slide-in-from-top-2">
            <p className="text-sm font-bold text-green-700 uppercase tracking-widest mb-2">Total Estimated Gratuity</p>
            <div className="flex justify-center items-baseline gap-1">
              <span className="text-lg font-bold text-green-600">AED</span>
              <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            {serviceDuration && (
              <p className="text-sm text-green-800 mt-2 font-medium">
                Service Duration: {serviceDuration}
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}