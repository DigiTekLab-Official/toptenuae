import { client } from './client';

// Define the interface for your data
export interface RatesData {
  metals: {
    gold_24k_per_gram_aed: number;
    gold_22k_per_gram_aed: number;
    gold_18k_per_gram_aed: number;
    silver_per_gram_aed: number;
    gold_24k_change: number;
    silver_change: number;
  };
  forex: Record<string, {
    rate: number;
    change: number;
  }>;
  timestamp: string;
}

// 1. Fetch Page Content from Sanity
export async function getMoneyPageData() {
  const query = `*[_type == "moneyPage"][0]{
    title,
    description,
    "goldCalculatorText": goldCalculatorTitle,
    "featuredCurrencies": featuredForex[]->{
      "code": currencyCode,
      "name": currencyName
    },
    disclaimer,
    dataSources
  }`;

  const data = await client.fetch(query);

  return {
    title: data?.title || 'Live Gold Rate Dubai & UAE Exchange Rates',
    description: data?.description || 'Track real-time 24K, 22K gold prices and AED exchange rates.',
    goldCalculatorText: data?.goldCalculatorText || 'Gold Value Calculator',
    featuredCurrencies: data?.featuredCurrencies || [
      { code: 'INR', name: 'Indian Rupee' },
      { code: 'PKR', name: 'Pakistani Rupee' },
      { code: 'PHP', name: 'Philippine Peso' },
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' },
      { code: 'GBP', name: 'British Pound' }
    ],
    disclaimer: data?.disclaimer || '',
    dataSources: data?.dataSources || ['GoldAPI.io', 'ExchangeRate-API']
  };
}

// 2. Fetch Live Rates (Server-Side)
export async function getLiveRates(): Promise<RatesData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/api/rates`, { 
      next: { revalidate: 0 },
      cache: 'no-store'
    });

    if (!res.ok) throw new Error('Failed to fetch rates');

    return res.json();
  } catch (error) {
    console.error("⚠️ Failed to fetch initial rates, using fallback:", error);
    
    return {
      metals: {
        gold_24k_per_gram_aed: 312.50,
        gold_22k_per_gram_aed: 286.00,
        gold_18k_per_gram_aed: 234.00,
        silver_per_gram_aed: 3.80,
        gold_24k_change: 0,
        silver_change: 0
      },
      forex: {
        USD: { rate: 0.2723, change: 0 },
        INR: { rate: 22.75, change: 0 },
        PKR: { rate: 76.50, change: 0 },
        PHP: { rate: 15.50, change: 0 },
        EUR: { rate: 0.25, change: 0 },
        GBP: { rate: 0.21, change: 0 },
        SAR: { rate: 1.02, change: 0 }
      },
      timestamp: new Date().toISOString()
    };
  }
}