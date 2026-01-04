import React from 'react';
import { Metadata } from 'next'; 
import { notFound } from 'next/navigation'; // Import this

// Components
import MarketHeader from '../../components/money/MarketHeader';
import PreciousMetals from '../../components/money/PreciousMetals';
import ForexRates from '../../components/money/ForexRates';
import GoldCalculator from '../../components/money/GoldCalculator';
import DataDisclaimer from '../../components/money/DataDisclaimer';

// Data Fetching
import { getMoneyPageData, getLiveRates } from '../../sanity/lib/money';
import { RatesProvider } from '../../contexts/RatesContext';

export const revalidate = 60; 
export const runtime = 'edge'; // Crucial for your Cloudflare build

export async function generateMetadata(): Promise<Metadata> {
  const data = await getMoneyPageData();

  // 1. If no data (unpublished in Sanity), return empty metadata
  if (!data) return {};

  return {
    title: data.title,
    description: data.description,
    // ... existing metadata logic
  };
}

export default async function MoneyPage() {
  const [pageData, initialRates] = await Promise.all([
    getMoneyPageData(),
    getLiveRates()
  ]);

  // 2. THE KILL SWITCH: If Sanity document is unpublished, show 404
  if (!pageData) {
    notFound(); 
  }

  return (
    <RatesProvider initialRates={initialRates}>
      <div className="min-h-screen bg-gray-50 font-geist">
        <MarketHeader 
          title={pageData.title}
          description={pageData.description}
          lastUpdated={initialRates.timestamp}
        />
        
        <main className="container mx-auto px-4 py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-8">
              <section aria-label="Precious Metal Rates">
                <PreciousMetals />
              </section>
              
              <section id="calculator" aria-label="Gold Calculator">
                <GoldCalculator 
                  goldRate24K={initialRates.metals.gold_24k_per_gram_aed}
                  title={pageData.goldCalculatorText} 
                />
              </section>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <section aria-label="Forex Rates">
                <ForexRates 
                  featuredPairs={pageData.featuredCurrencies}
                />
              </section>
            </div>
          </div>
          
          <DataDisclaimer 
            disclaimer={pageData.disclaimer}
            sources={pageData.dataSources}
            lastUpdated={initialRates.timestamp}
          />
        </main>
      </div>
    </RatesProvider>
  );
}