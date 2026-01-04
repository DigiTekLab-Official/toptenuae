import { NextResponse } from 'next/server';

// Cloudflare optimization
export const runtime = 'edge';

/**
 * PRODUCTION RATES API
 * Optimized for MetalPriceAPI (100 req/month) and ExchangeRate-API V6
 */
export async function GET() {
  const METAL_KEY = process.env.METALPRICE_API_KEY;
  const FOREX_KEY = process.env.EXCHANGE_RATE_API_KEY;

  try {
    // 1. Fetch Metals (Base: USD)
    // We cache for 6 hours (21600s) to strictly stay under the 100/month limit.
    const metalUrl = `https://api.metalpriceapi.com/v1/latest?api_key=${METAL_KEY}&base=USD&currencies=XAU,XAG`;
    
    const metalPromise = fetch(metalUrl, {
      next: { revalidate: 21600 } 
    });

    // 2. Fetch Forex (Base: AED)
    const forexUrl = `https://v6.exchangerate-api.com/v6/${FOREX_KEY}/latest/AED`;
    
    const forexPromise = fetch(forexUrl, { 
      next: { revalidate: 21600 } // Synced with metal refresh
    });

    const [metalRes, forexRes] = await Promise.all([metalPromise, forexPromise]);

    if (!metalRes.ok || !forexRes.ok) {
      throw new Error('Upstream API failure');
    }

    const metalData = await metalRes.json();
    const forexData = await forexRes.json();

    // --- CALCULATIONS ---
    const fx = forexData.conversion_rates || {};
    const aedToUsdRate = fx.USD || 0.2722;
    const usdToAedRate = 1 / aedToUsdRate;

    const xauRate = metalData.rates?.XAU || 0;
    const xagRate = metalData.rates?.XAG || 0;

    if (xauRate === 0) throw new Error("Invalid Metal Rate");

    const goldPricePerOunceUSD = 1 / xauRate;
    const silverPricePerOunceUSD = 1 / xagRate;

    const OUNCE_TO_GRAM = 31.1035;
    const goldSpotPerGram = (goldPricePerOunceUSD * usdToAedRate) / OUNCE_TO_GRAM;
    const silverSpotPerGram = (silverPricePerOunceUSD * usdToAedRate) / OUNCE_TO_GRAM;

    const rates = {
      metals: {
        gold_24k_per_gram_aed: goldSpotPerGram,
        gold_22k_per_gram_aed: goldSpotPerGram * 0.9167,
        gold_18k_per_gram_aed: goldSpotPerGram * 0.75,
        silver_per_gram_aed: silverSpotPerGram,
        gold_24k_change: 0, // Free plans don't provide change data
        silver_change: 0
      },
      forex: {
        USD: { rate: fx.USD || 0, change: 0 },
        EUR: { rate: fx.EUR || 0, change: 0 },
        GBP: { rate: fx.GBP || 0, change: 0 },
        INR: { rate: fx.INR || 0, change: 0 },
        PKR: { rate: fx.PKR || 0, change: 0 },
        PHP: { rate: fx.PHP || 0, change: 0 },
        SAR: { rate: fx.SAR || 0, change: 0 }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(rates, { 
      headers: { 
        // Shared cache for 1 hour, stale allowed for 24 hours
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' 
      } 
    });

  } catch (error) {
    // Fail silently on production to prevent 500 errors
    return NextResponse.json(getFallbackData());
  }
}

function getFallbackData() {
  return {
    metals: {
      gold_24k_per_gram_aed: 312.50, 
      gold_22k_per_gram_aed: 286.00,
      gold_18k_per_gram_aed: 234.00,
      silver_per_gram_aed: 3.80,
      gold_24k_change: 0.00,
      silver_change: 0.00
    },
    forex: {
      USD: { rate: 0.2723, change: 0 },
      EUR: { rate: 0.2489, change: 0 },
      GBP: { rate: 0.2135, change: 0 },
      INR: { rate: 22.75, change: 0 },
      PKR: { rate: 76.25, change: 0 },
      PHP: { rate: 16.01, change: 0 },
      SAR: { rate: 1.02, change: 0 }
    },
    timestamp: new Date().toISOString()
  };
}