"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { RefreshCcw, Info, ExternalLink, ChevronDown, ChevronUp, Wallet, TrendingUp, TrendingDown, Coins } from "lucide-react";
import Link from "next/link";

export default function ZakatCalculator() {
  const [mounted, setMounted] = useState(false);

  // --- STATE ---
  const [values, setValues] = useState({
    goldPrice: 505, silverPrice: 4.5,
    cash: 0, receivables: 0, shares: 0, goldWeight: 0, silverWeight: 0,
    rentalIncome: 0, sukuk: 0, funds: 0, crypto: 0, businessAssets: 0, otherAssets: 0,
    homeFinance: 0, utilityBills: 0, personalLoans: 0, businessLiabilities: 0, otherLiabilities: 0,
  });

  const [results, setResults] = useState({
    totalAssets: 0, totalLiabilities: 0, netAssets: 0, nisabThreshold: 0, zakatPayable: 0, isEligible: false,
  });

  const [isAssetsOpen, setIsAssetsOpen] = useState(true);
  const [isLiabilitiesOpen, setIsLiabilitiesOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- CALCULATION LOGIC ---
  useEffect(() => {
    const goldValue = (values.goldWeight || 0) * (values.goldPrice || 0);
    const silverValue = (values.silverWeight || 0) * (values.silverPrice || 0);

    // Sum Assets
    const totalAssets =
      (values.cash || 0) + (values.receivables || 0) + (values.shares || 0) +
      goldValue + silverValue +
      (values.rentalIncome || 0) + (values.sukuk || 0) + (values.funds || 0) +
      (values.crypto || 0) + (values.businessAssets || 0) + (values.otherAssets || 0);

    // Sum Liabilities
    const totalLiabilities =
      (values.homeFinance || 0) + (values.utilityBills || 0) +
      (values.personalLoans || 0) + (values.businessLiabilities || 0);

    const netAssets = totalAssets - totalLiabilities;
    // Nisab = 85g of Gold
    const nisabThreshold = 85 * (values.goldPrice || 0);

    let zakatPayable = 0;
    let isEligible = false;

    if (netAssets >= nisabThreshold && netAssets > 0) {
      zakatPayable = netAssets * 0.025;
      isEligible = true;
    }

    setResults({ totalAssets, totalLiabilities, netAssets, nisabThreshold, zakatPayable, isEligible });
  }, [values]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setValues((prev) => ({ ...prev, [name]: isNaN(numValue) ? 0 : Math.max(0, numValue) }));
  };

  const handleReset = () => {
    setValues({
      goldPrice: 340, silverPrice: 4.5,
      cash: 0, receivables: 0, shares: 0, goldWeight: 0, silverWeight: 0,
      rentalIncome: 0, sukuk: 0, funds: 0, crypto: 0, businessAssets: 0, otherAssets: 0,
      homeFinance: 0, utilityBills: 0, personalLoans: 0, businessLiabilities: 0, otherLiabilities: 0,
    });
  };

  // --- 1. THE INPUTS COMPONENT (Teleported to Body) ---
  const InputSection = (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">

      {/* SECTION 1: RATES CARD (High Visibility) */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-300 overflow-hidden">
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-[#4b0082] font-black text-lg flex items-center gap-2">
            <Coins className="w-6 h-6" />
            Today's Gold & Silver Rate
          </h2>
          <Link href="https://dubaicityofgold.com/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-sm font-bold bg-white/90 hover:bg-white text-[#4b0082] px-4 py-2 rounded-full shadow-sm transition-all">
            <span>Check Dubai Rate</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="p-6">
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-500 mb-6 flex gap-3">
            <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-base text-gray-900 leading-relaxed">
              <strong>Mentor Tip:</strong> For Nisab threshold calculation, always use the <strong>24K</strong> rate. For your jewelry value, use the rate matching your gold purity (e.g., 22K).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RateInput label="Gold Price (per Gram)" name="goldPrice" value={values.goldPrice} onChange={handleChange} color="amber" />
            <RateInput label="Silver Price (per Gram)" name="silverPrice" value={values.silverPrice} onChange={handleChange} color="slate" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* SECTION 2: ASSETS (What I Own) */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-300 overflow-hidden flex flex-col h-full">
          <button
            onClick={() => setIsAssetsOpen(!isAssetsOpen)}
            className="w-full flex items-center justify-between p-5 bg-gradient-to-br from-emerald-50 to-white border-b border-emerald-100 hover:bg-emerald-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-slate-800 text-lg">What I Own</h3>
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide">Zakatable Assets (+)</p>
              </div>
            </div>
            {isAssetsOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
          </button>

          {isAssetsOpen && (
            <div className="p-6 space-y-5 flex-1 bg-slate-50/50">
              {/* Weight Inputs - Manually linked labels */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-400 shadow-sm focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition-all">
                  <label htmlFor="goldWeight" className="block text-sm font-bold text-slate-500 uppercase mb-1">Gold Weight (g)</label>
                  <input
                    id="goldWeight"
                    type="number"
                    name="goldWeight"
                    value={values.goldWeight || ""}
                    onChange={handleChange}
                    className="w-full font-black text-xl text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="0"
                  />
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-400 shadow-sm focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition-all">
                  <label htmlFor="silverWeight" className="block text-sm font-bold text-slate-500 uppercase mb-1">Silver Weight (g)</label>
                  <input
                    id="silverWeight"
                    type="number"
                    name="silverWeight"
                    value={values.silverWeight || ""}
                    onChange={handleChange}
                    className="w-full font-black text-xl text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="0"
                  />
                </div>
              </div>

              <InputGroup label="Cash & Bank Balance" name="cash" value={values.cash} onChange={handleChange} icon={<Wallet className="w-4 h-4" />} />
              <InputGroup label="Receivables (Money Owed)" name="receivables" value={values.receivables} onChange={handleChange} />
              <InputGroup label="Shares (Investments)" name="shares" value={values.shares} onChange={handleChange} />
              <InputGroup label="Crypto Assets" name="crypto" value={values.crypto} onChange={handleChange} />
              <InputGroup label="Business Assets (Stock)" name="businessAssets" value={values.businessAssets} onChange={handleChange} />
            </div>
          )}
        </div>

        {/* SECTION 3: LIABILITIES (What I Owe) */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-300 overflow-hidden flex flex-col h-full">
          <button
            onClick={() => setIsLiabilitiesOpen(!isLiabilitiesOpen)}
            className="w-full flex items-center justify-between p-5 bg-gradient-to-br from-rose-50 to-white border-b border-rose-100 hover:bg-rose-50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-black text-slate-800 text-lg">What I Owe</h3>
                <p className="text-sm font-bold text-rose-600 uppercase tracking-wide">Liabilities to Deduct (-)</p>
              </div>
            </div>
            {isLiabilitiesOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
          </button>

          {isLiabilitiesOpen && (
            <div className="p-6 space-y-5 flex-1 bg-slate-50/50">
              <InputGroup label="Home Finance (Short-term)" name="homeFinance" value={values.homeFinance} onChange={handleChange} isLiability />
              <InputGroup label="Utility Bills (Outstanding)" name="utilityBills" value={values.utilityBills} onChange={handleChange} isLiability />
              <InputGroup label="Personal Loans/Debts" name="personalLoans" value={values.personalLoans} onChange={handleChange} isLiability />
              <InputGroup label="Business Liabilities" name="businessLiabilities" value={values.businessLiabilities} onChange={handleChange} isLiability />
            </div>
          )}
        </div>

      </div>
    </div>
  );

  // --- 2. RENDER (Result Card + Portal) ---
  return (
    <>
      {/* 2A. RESULT CARD (Hero Section) */}
      <div className="bg-white rounded-2xl text-center shadow-2xl shadow-purple-900/50 border border-white/10 relative overflow-hidden">
        {/* Subtle Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 blur-[50px] rounded-full pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300"></div>
        <div className=" w-full bg-[#4b0082] text-white p-4 ">

          <span className="uppercase text-xl font-bold">Total Zakat Payable</span>
          <p className=" uppercase text-amber-300 text-sm font-semibold mt-1">Standard 2.5% Rate</p>
        </div>
        <div className="relative z-10 p-6">
          <div className="flex justify-center items-baseline gap-2">
            <span className="text-5xl lg:text-6xl font-black tracking-tight  drop-shadow-sm">
              {results.zakatPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xl font-bold ">AED</span>
          </div>

          <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border ${results.isEligible ? 'text-[#4b0082] bg-[#e0cfff] border-[#4b0082]' : 'text-amber-700 bg-amber-100 border-amber-300'}`}>
            {results.isEligible
              ? <span>✅ Eligible to Pay</span>
              : <span>❌ Below Nisab ({results.nisabThreshold.toLocaleString()} AED)</span>}
          </div>
        </div>

        <div className="space-y-4 px-11 py-4 bg-white/5 rounded-xl backdrop-blur-md border border-white/10">
          <div className="flex justify-between items-center teba">
            <span className="font-medium">Total Assets</span>
            <span className="font-bold tracking-wide">{results.totalAssets.toLocaleString()} AED</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-amber-700">Total Liabilities</span>
            <span className="font-bold tracking-wide text-amber-700">- {results.totalLiabilities.toLocaleString()} AED</span>
          </div>
          <div className="h-px bg-white/10 my-1"></div>
          <div className="flex justify-between text-[#4b0082] items-center">
            <span className="font-bold">Net Wealth</span>
            <span className="font-bold tracking-wide">{results.netAssets.toLocaleString()} AED</span>
          </div>
        </div>

        <button onClick={handleReset} className="mb-8 flex items-center justify-center gap-2 text-sm font-bold transition-colors p-3 rounded-lg border border-[#4b0082] text-[#4b0082] cursor-pointer w-fit mx-auto">
          <RefreshCcw className="w-4 h-4" /> Reset Calculator
        </button>
      </div>

      {/* 2B. PORTAL (Inputs appear in Body) */}
      {mounted && document.getElementById('tool-portal-root') && createPortal(
        InputSection,
        document.getElementById('tool-portal-root')!
      )}
    </>
  );
}

// --- SUB-COMPONENTS FOR CLEANER CODE ---

function RateInput({ label, name, value, onChange, color }: any) {
  const isAmber = color === 'amber';
  return (
    <div>
      {/* FIX: Added htmlFor */}
      <label htmlFor={name} className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <div className={`relative flex items-center overflow-hidden rounded-xl border-2 transition-all group ${isAmber ? 'border-amber-100 focus-within:border-amber-400' : 'border-slate-200 focus-within:border-slate-400'}`}>
        <span className={`pl-4 pr-2 text-sm font-bold ${isAmber ? 'text-amber-600' : 'text-slate-500'}`}>AED</span>
        {/* FIX: Added id matching name */}
        <input
          id={name}
          type="number"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full py-3 pr-4 text-xl font-black text-slate-800 outline-none placeholder:text-slate-300"
        />
      </div>
    </div>
  )
}

function InputGroup({ label, name, value, onChange, isLiability = false, icon }: any) {
  return (
    <div className="group">
      {/* FIX: Added htmlFor */}
      <label htmlFor={name} className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 ${isLiability ? 'text-rose-700' : 'text-slate-600'}`}>
        {icon}
        {label}
      </label>
      <div className={`relative flex items-center overflow-hidden rounded-xl border bg-white shadow-sm transition-all
        ${isLiability
          ? 'border-rose-400 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100'
          : 'border-green-600 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100'
        }`}>
        <span className={`pl-4 pr-2 text-sm font-bold select-none ${isLiability ? 'text-rose-300' : 'text-slate-300'}`}>AED</span>
        {/* FIX: Added id matching name */}
        <input
          id={name}
          type="number"
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder="0"
          className="w-full py-3 pr-4 text-lg font-bold text-slate-800 outline-none placeholder:text-slate-200"
        />
      </div>
    </div>
  );
}