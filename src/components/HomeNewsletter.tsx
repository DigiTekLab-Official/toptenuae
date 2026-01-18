// src/components/HomeNewsletter.tsx
"use client";

import { useState, useRef } from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function HomeNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  
  // Security
  const [honeypot, setHoneypot] = useState("");
  const [token, setToken] = useState("");
  const turnstileRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    // Honeypot & Captcha
    if (honeypot) return;
    if (!token) {
      alert("Please complete the security check.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          fax: honeypot,
          token
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      setEmail("");
      
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
      if (turnstileRef.current) (turnstileRef.current as any).reset();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Honeypot Field - Hidden from humans & screen readers */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="fax-input">Fax</label>
              <input
                type="text"
                name="fax"
                id="fax-input"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                // ✅ ACCESSIBILITY FIX: Removed role="presentation"
                aria-hidden="true" 
              />
            </div>

            <div className="relative grow">
              <label htmlFor="email-input" className="sr-only">
                Email address
              </label>
              <input 
                type="email" 
                name="email"
                id="email-input"
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
                  <AlertCircle className="w-3 h-3 mr-1" /> Something went wrong.
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              aria-label="Subscribe to newsletter"
              className="bg-[#4b0082] text-white font-bold px-8 py-3 rounded-full hover:bg-[#3b0066] shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-35"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : status === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                'Subscribe'
              )}
            </button>
        </div>

        {/* Turnstile - Only show if not success */}
        {status !== 'success' && (
          <div className="flex justify-center scale-90 origin-top">
             <Turnstile 
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                onSuccess={(token) => setToken(token)}
                options={{ size: 'flexible' }}
             />
          </div>
        )}
        
        {status === 'success' && (
           <div className="text-green-700 text-center text-sm font-medium bg-green-50 p-2 rounded-lg border border-green-200">
             ✅ Confirmation link sent! Check your inbox.
           </div>
        )}

      </form>
    </div>
  );
}