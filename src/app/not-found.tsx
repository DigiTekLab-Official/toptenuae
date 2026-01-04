import Link from "next/link";
import { Home, AlertCircle, Search, Briefcase, IndianRupee } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-xl w-full">
        
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>

        <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Temporarily Unavailable</h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you are looking for is currently undergoing technical updates or has moved. 
          Try searching for what you need below.
        </p>

        {/* Added Search functionality for better UX */}
        <form action="/search" className="relative mb-10 max-w-md mx-auto">
          <input 
            type="text" 
            name="q"
            placeholder="Search for Gold Rates, Jobs, or News..."
            className="w-full py-3 px-5 pr-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
          <button type="submit" className="absolute right-4 top-3 text-gray-400 hover:text-primary">
            <Search className="w-5 h-5" />
          </button>
        </form>

        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-black text-white font-bold py-3 px-6 rounded-full hover:bg-gray-800 transition-all"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          
          {/* Quick links related to your portal's niches */}
          <Link 
            href="/deals" 
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-50 transition-all"
          >
            <Briefcase className="w-4 h-4" /> Deals
          </Link>

          <Link 
            href="/money" 
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-50 transition-all opacity-50 cursor-not-allowed"
          >
            <IndianRupee className="w-4 h-4" /> Rates (Updating)
          </Link>
        </div>
      </div>
    </div>
  );
}