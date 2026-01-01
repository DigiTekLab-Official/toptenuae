"use client";

import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const [state, handleSubmit] = useForm("xjknjnqv");

  // Success State (Show this after sending)
  if (state.succeeded) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-600">
          Thank you for reaching out. We will get back to you within 24-48 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-violet-400 p-8 md:p-10 h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-bold text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>

        {/* Subject Field (Added manually to help you categorize emails) */}
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-bold text-gray-700">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Partnership">Partnership / Advertising</option>
            <option value="Suggestion">Suggestion for Top 10 List</option>
            <option value="Report Issue">Report a Website Issue</option>
          </select>
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-bold text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder="How can we help you?"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          />
          <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-sm mt-1" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={state.submitting}
          className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-indigo-900 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.submitting ? 'Sending...' : (
            <>
              <Send className="w-5 h-5" /> Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}