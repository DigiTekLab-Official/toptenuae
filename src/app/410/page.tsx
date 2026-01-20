// src/app/410/page.tsx
// Create this file to handle 410 Gone responses properly

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '410 - Page Gone | TopTenUAE',
  robots: {
    index: false,
    follow: false,
  },
};

export default function GonePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-gray-300">410</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Page No Longer Available
          </h2>
        </div>
        
        <p className="text-gray-600 mb-8">
          This page has been permanently removed and is no longer accessible.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Link href="/reviews" className="text-blue-600 hover:underline">
                Reviews
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/tech" className="text-blue-600 hover:underline">
                Tech
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/deals" className="text-blue-600 hover:underline">
                Deals
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/parenting-kids" className="text-blue-600 hover:underline">
                Parenting
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}