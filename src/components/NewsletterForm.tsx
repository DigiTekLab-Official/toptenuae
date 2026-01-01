// src/components/NewsletterForm.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';

export default function NewsletterForm() {
  const router = useRouter();
  
  // State to handle input and loading status
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      // Send data to our custom API route (created in the previous step)
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Success: Redirect to Thank You page
      router.push('/thank-you');
      
    } catch (error: any) {
      console.error("Subscription error:", error);
      setStatus("error");
      setErrorMessage("Failed to join. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-4">
        
        {/* Email Input Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            placeholder="Enter your best email..."
            className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900 bg-white shadow-sm disabled:opacity-50 disabled:bg-gray-100"
          />
          {/* Error Message */}
          {status === "error" && (
             <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1">
               ⚠️ {errorMessage}
             </p>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-indigo-900 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Joining...
            </>
          ) : (
            <>
              Subscribe Now <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        
        <p className="text-sm text-center text-gray-500 mt-2">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </form>
  );
}