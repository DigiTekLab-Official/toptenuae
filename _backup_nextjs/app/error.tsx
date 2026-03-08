"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "@/components/icons";
import { captureException } from "@/lib/monitoring";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Capture error in Sentry
    captureException(error, { 
      digest: error.digest,
      component: 'RootErrorBoundary',
    });
    
    // Also log to console for development
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-rose-600" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Something went wrong!
        </h2>
        
        <p className="text-slate-500 mb-8 leading-relaxed">
          We apologize for the inconvenience. Our team has been notified.
          Please try refreshing the page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 bg-[#4b0082] hover:bg-indigo-900 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>

        {/* Debug info - Only visible in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 text-left bg-slate-100 p-4 rounded-lg overflow-x-auto">
            <p className="text-xs font-mono text-rose-600 mb-2 font-bold">Dev Error Log:</p>
            <pre className="text-[10px] text-slate-600 whitespace-pre-wrap">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}