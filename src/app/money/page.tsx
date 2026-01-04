import React from 'react';
import { Metadata } from 'next'; 

// Components (Using Relative Paths to avoid Alias errors)
import MarketHeader from '../../components/money/MarketHeader';
import PreciousMetals from '../../components/money/PreciousMetals';
import ForexRates from '../../components/money/ForexRates';
import GoldCalculator from '../../components/money/GoldCalculator';
import DataDisclaimer from '../../components/money/DataDisclaimer';

// Data Fetching (Using Relative Paths)
import { getMoneyPageData, getLiveRates } from '../../sanity/lib/money';
import { RatesProvider } from '../../contexts/RatesContext';

// --- 1. CONFIGURATION (ISR) ---
export const revalidate = 60; 

// --- 2. DYNAMIC SEO METADATA ---
export async function generateMetadata(): Promise<Metadata> {
  const data = await getMoneyPageData();

  return {
    title: data.title,
    description: data.description,
    keywords: ['Gold rate Dubai', 'UAE Gold Rate', 'AED to INR', '22k gold price Dubai today'],
    openGraph: {
      title: data.title,
      description: data.description,
      type: 'website',
      locale: 'en_AE',
      siteName: 'TopTenUAE',
    },
    alternates: {
      canonical: 'https://toptenuae.com/money',
    }
  };
}

// --- 3. MAIN COMPONENT ---
export default async function MoneyPage() {
  const [pageData, initialRates] = await Promise.all([
    getMoneyPageData(),
    getLiveRates()
  ]);

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
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-8">
              <section aria-label="Precious Metal Rates">
                <PreciousMetals />
              </section>
              
              <section id="calculator" aria-label="Gold Calculator">
                <GoldCalculator 
                  goldRate24K={initialRates.metals.gold_24k_per_gram_aed}
                  // This prop will now work because we updated the component!
                  title={pageData.goldCalculatorText} 
                />
              </section>
            </div>
            
            {/* RIGHT COLUMN */}
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