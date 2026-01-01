"use client";

import { useState, useEffect } from "react";
import { RefreshCcw, Info, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export default function ZakatCalculator() {
  // --- STATE: All Specific Fields ---
  const [values, setValues] = useState({
    // Gold & Silver Rates (Defaults as of late 2025)
    goldPrice: 505.75, 
    silverPrice: 4.5, 

    // Assets (What I Own)
    cash: 0,
    receivables: 0,
    shares: 0,
    goldWeight: 0,
    silverWeight: 0,
    rentalIncome: 0,
    sukuk: 0,
    funds: 0,
    crypto: 0,
    businessAssets: 0,
    otherAssets: 0,

    // Liabilities (What I Owe)
    homeFinance: 0, // Short-term portion
    utilityBills: 0,
    personalLoans: 0,
    businessLiabilities: 0,
    otherLiabilities: 0,
  });

  const [results, setResults] = useState({
    totalAssets: 0,
    totalLiabilities: 0,
    netAssets: 0,
    nisabThreshold: 0,
    zakatPayable: 0,
    isEligible: false,
  });

  const [isAssetsOpen, setIsAssetsOpen] = useState(true);
  const [isLiabilitiesOpen, setIsLiabilitiesOpen] = useState(true);

  // --- CALCULATION LOGIC ---
  useEffect(() => {
    // 1. Calculate Precious Metals Value
    const goldValue = (values.goldWeight || 0) * (values.goldPrice || 0);
    const silverValue = (values.silverWeight || 0) * (values.silverPrice || 0);

    // 2. Sum Total Assets
    const totalAssets = 
      (values.cash || 0) + 
      (values.receivables || 0) + 
      (values.shares || 0) + 
      goldValue + 
      silverValue + 
      (values.rentalIncome || 0) + 
      (values.sukuk || 0) + 
      (values.funds || 0) + 
      (values.crypto || 0) + 
      (values.businessAssets || 0) + 
      (values.otherAssets || 0);

    // 3. Sum Total Liabilities
    const totalLiabilities = 
      (values.homeFinance || 0) + 
      (values.utilityBills || 0) + 
      (values.personalLoans || 0) + 
      (values.businessLiabilities || 0) + 
      (values.otherLiabilities || 0);

    // 4. Net Assets
    const netAssets = totalAssets - totalLiabilities;

    // 5. Calculate Nisab (85g Gold Rule)
    const nisabThreshold = 85 * (values.goldPrice || 0);

    // 6. Calculate Zakat
    let zakatPayable = 0;
    let isEligible = false;

    // Only pay if Net Assets >= Nisab AND positive
    if (netAssets >= nisabThreshold && netAssets > 0) {
      zakatPayable = netAssets * 0.025;
      isEligible = true;
    }

    setResults({
      totalAssets,
      totalLiabilities,
      netAssets,
      nisabThreshold,
      zakatPayable,
      isEligible,
    });
  }, [values]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Prevent negative numbers
    const numValue = parseFloat(value);
    setValues((prev) => ({
      ...prev,
      [name]: isNaN(numValue) ? 0 : Math.max(0, numValue),
    }));
  };

  const handleReset = () => {
     setValues({
        goldPrice: 340, 
        silverPrice: 4.5, 
        cash: 0, receivables: 0, shares: 0, goldWeight: 0, silverWeight: 0,
        rentalIncome: 0, sukuk: 0, funds: 0, crypto: 0, businessAssets: 0, otherAssets: 0,
        homeFinance: 0, utilityBills: 0, personalLoans: 0, businessLiabilities: 0, otherLiabilities: 0,
    });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start font-sans">
      
      {/* LEFT COLUMN: INPUTS */}
      <div className="flex-1 w-full space-y-6">
        
        {/* SECTION 1: RATES (Sticky Top for Mobile) */}
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-yellow-400 rounded-full"></span>
              Today's Gold & Silver Rate
            </h2>
            
            <Link 
              href="https://dubaicityofgold.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm bg-purple-50 hover:bg-purple-100 text-[#4b0082] px-3 py-2 rounded-lg transition-colors"
            >
              <div className="flex flex-col text-right">
                <span className="font-bold">Check Official Dubai Rate</span>
                <span className="text-[16px] opacity-70">Opens dubaicityofgold.com</span>
              </div>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-100 mb-4 text-sm text-yellow-800 flex gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Mentor Tip:</strong> For Nisab threshold calculation, always use the <strong>24K</strong> rate. For your jewelry value, use the rate matching your gold purity (e.g., 22K).
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="goldPrice" className="block text-sm font-bold text-gray-500 mb-1">Gold Price (per Gram)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">AED</span>
                <input
                  id="goldPrice"
                  type="number"
                  name="goldPrice"
                  value={values.goldPrice || ""}
                  onChange={handleChange}
                  className="w-full pl-12 pr-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none font-bold text-gray-900"
                />
              </div>
            </div>
            <div>
              <label htmlFor="silverPrice" className="block text-sm font-bold text-gray-500 mb-1">Silver Price (per Gram)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">AED</span>
                <input
                  id="silverPrice"
                  type="number"
                  name="silverPrice"
                  value={values.silverPrice || ""}
                  onChange={handleChange}
                  className="w-full pl-12 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none font-bold text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ASSETS (What I Own) */}
        <div className="bg-green-200 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <button 
            onClick={() => setIsAssetsOpen(!isAssetsOpen)}
            className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">+</span>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">What I Own</h3>
                <p className="text-sm text-gray-500">Zakatable Assets</p>
              </div>
            </div>
            {isAssetsOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>
          
          {isAssetsOpen && (
            <div className="p-5 grid md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
              {/* Precious Metals Weights */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4 mb-2">
                 <div className="p-3 bg-yellow-50/50 rounded-xl border border-yellow-100">
                  <label htmlFor="goldWeight" className="block text-sm font-bold text-gray-700 mb-1">Gold Weight (grams)</label>
                  <input id="goldWeight" type="number" name="goldWeight" value={values.goldWeight || ""} onChange={handleChange} className="w-full px-3 py-2 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none bg-white" placeholder="0g" />
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <label htmlFor="silverWeight" className="block text-sm font-bold text-gray-700 mb-1">Silver Weight (grams)</label>
                  <input id="silverWeight" type="number" name="silverWeight" value={values.silverWeight || ""} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none bg-white" placeholder="0g" />
                </div>
              </div>

              <InputGroup label="Cash & Bank Balance" name="cash" value={values.cash} onChange={handleChange} />
              <InputGroup label="Receivables (Money Owed)" name="receivables" value={values.receivables} onChange={handleChange} />
              <InputGroup label="Shares (Investments)" name="shares" value={values.shares} onChange={handleChange} />
              <InputGroup label="Crypto Assets" name="crypto" value={values.crypto} onChange={handleChange} />
              <InputGroup label="Sukuk (Bonds)" name="sukuk" value={values.sukuk} onChange={handleChange} />
              <InputGroup label="Investment Funds" name="funds" value={values.funds} onChange={handleChange} />
              <InputGroup label="Business Assets (Stock)" name="businessAssets" value={values.businessAssets} onChange={handleChange} />
              <InputGroup label="Rental Income Saved" name="rentalIncome" value={values.rentalIncome} onChange={handleChange} />
              <InputGroup label="Other Assets" name="otherAssets" value={values.otherAssets} onChange={handleChange} />
            </div>
          )}
        </div>

        {/* SECTION 3: LIABILITIES (What I Owe) */}
        <div className="bg-red-300 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <button 
            onClick={() => setIsLiabilitiesOpen(!isLiabilitiesOpen)}
            className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
             <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-lg">-</span>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">What I Owe</h3>
                <p className="text-sm text-gray-500">Liabilities to Deduct</p>
              </div>
            </div>
            {isLiabilitiesOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </button>
          
          {isLiabilitiesOpen && (
            <div className="p-5 grid md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
              <InputGroup label="Home Finance (Short-term)" name="homeFinance" value={values.homeFinance} onChange={handleChange} isLiability />
              <InputGroup label="Utility Bills (Outstanding)" name="utilityBills" value={values.utilityBills} onChange={handleChange} isLiability />
              <InputGroup label="Personal Loans/Debts" name="personalLoans" value={values.personalLoans} onChange={handleChange} isLiability />
              <InputGroup label="Business Liabilities" name="businessLiabilities" value={values.businessLiabilities} onChange={handleChange} isLiability />
              <InputGroup label="Other Debts" name="otherLiabilities" value={values.otherLiabilities} onChange={handleChange} isLiability />
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: RESULTS (Sticky) */}
      <div className="w-full xl:w-[400px] shrink-0 xl:sticky xl:top-24">
        {/* Updated Background to Brand Color #4b0082 */}
        <div className="bg-[#4b0082] text-white rounded-2xl p-6 shadow-xl shadow-purple-900/20">
          
          <div className="text-center mb-6">
            <span className="text-purple-200 uppercase text-sm font-bold tracking-wider">Total Zakat Payable</span>
            <div className="text-5xl font-black mt-2 tracking-tight">
              {results.zakatPayable.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-2xl">AED</span>
            </div>
            <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${results.isEligible ? 'bg-white text-[#4b0082]' : 'bg-red-500/20 text-red-100'}`}>
              {results.isEligible 
                ? "✅ You are eligible to pay" 
                : `❌ Below Nisab (${results.nisabThreshold.toLocaleString()} AED)`}
            </div>
          </div>

          <div className="space-y-4 bg-white/10 rounded-xl p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-purple-100">Total Assets</span>
              <span className="font-bold">{results.totalAssets.toLocaleString()} AED</span>
            </div>
            <div className="flex justify-between text-red-200">
              <span>Less Liabilities</span>
              <span>- {results.totalLiabilities.toLocaleString()} AED</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-white/20">
              <span className="font-bold">Net Zakatable Wealth</span>
              <span className="font-bold">{results.netAssets.toLocaleString()} AED</span>
            </div>
          </div>

          <button 
            onClick={handleReset}
            className="mt-6 w-full flex items-center justify-center gap-2 text-sm text-purple-200 hover:text-white transition-colors py-2"
          >
            <RefreshCcw className="w-4 h-4" /> Reset All
          </button>

        </div>
        
        {/* Helper Note */}
        <div className="mt-4 bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm leading-relaxed border border-yellow-100">
          <strong>Note:</strong> Zakat is 2.5% of your net zakatable assets. The Nisab threshold is calculated based on 85g of 24K gold. Ensure you enter the current gold rate for accuracy.
        </div>
      </div>

    </div>
  );
}

// Small Helper Component for Inputs (Fixed for A11y)
function InputGroup({ label, name, value, onChange, isLiability = false }: any) {
  // Use name as ID since it is unique in this form context
  const inputId = `input-${name}`;
  
  return (
    <div>
      <label 
        htmlFor={inputId} 
        className={`block text-sm font-bold mb-1 ${isLiability ? 'text-red-800' : 'text-gray-700'}`}
      >
        {label}
      </label>
      <div className="relative">
        <span className={`absolute left-3 top-2.5 text-sm font-bold ${isLiability ? 'text-red-300' : 'text-gray-400'}`}>
          AED
        </span>
        <input
          id={inputId}
          type="number"
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder="0.00"
          className={`w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:ring-2 transition-all font-medium ${
            isLiability 
              ? 'bg-red-50 border-red-100 focus:ring-red-500 text-red-900' 
              : 'bg-gray-50 border-gray-200 focus:ring-[#4b0082] text-gray-900'
          }`}
        />
      </div>
    </div>
  );
}