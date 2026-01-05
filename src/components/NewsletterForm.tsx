// src/components/NewsletterForm.tsx
"use client";

import React, { useState, useRef } from 'react';
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");
  
  // 🛡️ Security State
  const [honeypot, setHoneypot] = useState(""); 
  const [token, setToken] = useState(""); // Turnstile Token
  const turnstileRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 🍯 Honeypot Check (Frontend)
    if (honeypot) { return; } // Silently fail for bots

    // 2. 🤖 CAPTCHA Check
    if (!token) {
      setMsg("Please complete the security check below.");
      return;
    }

    setStatus("loading");
    setMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            email, 
            fax: honeypot, // Send honeypot
            token // Send CAPTCHA token
        }), 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setStatus("success");
      setEmail("");
    } catch (error: any) {
      setStatus("error");
      setMsg(error.message || "Something went wrong.");
      // Reset captcha on error so they can try again
      if (turnstileRef.current) (turnstileRef.current as any).reset();
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 p-6 rounded-xl text-center border border-green-100">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="font-bold text-green-900 text-lg">One Last Step!</h3>
        <p className="text-green-800 mt-2 text-sm">
          We sent a confirmation link to <strong>{email}</strong>. 
          <br/>Please click it to activate your subscription.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-4">
        
        {/* 🍯 HONEYPOT (Hidden) */}
        <input 
            type="text" 
            name="fax" 
            style={{ display: 'none' }} 
            tabIndex={-1} 
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
        />

        {/* Email Field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your best email..."
            className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900 bg-white"
          />
        </div>
        
        {/* 🤖 TURNSTILE WIDGET */}
        <div className="flex justify-center min-h-[65px]">
            <Turnstile 
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                onSuccess={(token) => setToken(token)}
            />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-indigo-900 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {status === 'loading' ? <Loader2 className="animate-spin" /> : <>Subscribe Now <ArrowRight className="w-5 h-5"/></>}
        </button>
        
        {msg && <p className="text-red-500 text-sm text-center">{msg}</p>}
        
        <p className="text-xs text-center text-gray-500 mt-2">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </form>
  );
}