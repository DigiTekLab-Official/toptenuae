import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">
        
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <AlertCircle className="w-12 h-12" />
        </div>

        <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Oops! It looks like the page you are looking for has been moved, deleted, or never existed.
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-primary text-white font-bold py-4 px-8 rounded-full hover:bg-indigo-900 transition-all shadow-lg shadow-primary/30"
        >
          <Home className="w-5 h-5" /> Back to Home
        </Link>
      </div>
    </div>
  );
}