"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

export default function HomeNewsletter() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed");

      // ✅ FIXED: Redirect to the correct path
      router.push('/thank-you'); 
      
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address" 
            disabled={status === 'loading'}
            className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-[#4b0082] focus:ring-2 focus:ring-[#4b0082]/20 shadow-sm text-gray-900 placeholder:text-gray-400"
          />
          {status === 'error' && (
            <div className="absolute -bottom-6 left-0 flex items-center text-red-600 text-xs font-bold animate-pulse">
              <AlertCircle className="w-3 h-3 mr-1" /> Failed. Try again.
            </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={status === 'loading'}
          className="bg-[#4b0082] text-white font-bold px-8 py-3 rounded-full hover:bg-[#3b0066] shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
        >
          {status === 'loading' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
    </div>
  );
}