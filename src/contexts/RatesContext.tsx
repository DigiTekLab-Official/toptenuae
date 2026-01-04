'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// ✅ Import the shared interface (Single Source of Truth)
import { RatesData } from '@/sanity/lib/money';

interface RatesContextType {
  rates: RatesData;
  lastUpdate: string;
  isLoading: boolean;
  refreshRates: () => Promise<void>;
}

const RatesContext = createContext<RatesContextType | undefined>(undefined);

export function RatesProvider({ 
  children, 
  initialRates }: { 
  children: React.ReactNode; 
  initialRates: RatesData }) {
  
  const [rates, setRates] = useState<RatesData>(initialRates);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>(
    // Initialize with current client time
    new Date().toLocaleTimeString('en-AE', { 
      timeZone: 'Asia/Dubai',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    })
  );

  const refreshRates = async () => {
    setIsLoading(true);
    try {
      // Calls your internal API route
      const response = await fetch('/api/rates', {
        // Force fresh data from the server (bypass browser cache)
        cache: 'no-store' 
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const newRates = await response.json();
      setRates(newRates);
      
      // Update timestamp to show user the data is live
      setLastUpdate(new Date().toLocaleTimeString('en-AE', {
        timeZone: 'Asia/Dubai',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      }));
    } catch (error) {
      console.error('Failed to refresh rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Auto-refresh logic (Runs every 60 seconds)
  useEffect(() => {
    // Initial delay to prevent immediate double-fetch on load
    const timer = setTimeout(() => {
        const interval = setInterval(refreshRates, 60000); 
        return () => clearInterval(interval);
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <RatesContext.Provider value={{ rates, lastUpdate, isLoading, refreshRates }}>
      {children}
    </RatesContext.Provider>
  );
}

export const useRates = () => {
  const context = useContext(RatesContext);
  if (!context) {
    throw new Error('useRates must be used within RatesProvider');
  }
  return context;
};