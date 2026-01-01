// src/components/HomeNewsletter.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function HomeNewsletter() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      
      setTimeout(() => {
        router.push('/thank-you'); 
      }, 800);
      
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <input 
            type="email" 
            name="email"  // ✅ Added name for better browser autofill support
            id="email-input" // ✅ Added ID (good practice for linking)
            aria-label="Email address" // ✅ THE FIX: Solves the "Missing form label" error
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address" 
            disabled={status === 'loading' || status === 'success'}
            className={`w-full px-5 py-3 rounded-full border transition-all shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 
              ${status === 'error' ? 'border-red-500 ring-red-100' : 'border-gray-300 focus:border-[#4b0082] focus:ring-[#4b0082]/20'}`}
          />
          
          {status === 'error' && (
            <div className="absolute -bottom-6 left-2 flex items-center text-red-600 text-xs font-bold animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-3 h-3 mr-1" /> Something went wrong. Try again.
            </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          aria-label="Subscribe to newsletter" // ✅ Good practice: Label the icon-only states too
          className="bg-[#4b0082] text-white font-bold px-8 py-3 rounded-full hover:bg-[#3b0066] shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
    </div>
  );
}