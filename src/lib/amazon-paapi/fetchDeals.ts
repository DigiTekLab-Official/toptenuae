// src/lib/amazon-paapi/fetchDeals.ts
import { createClient } from "@sanity/client";
import { getEnv, getEnvOptional } from "@/lib/validateEnv";

// --- 1. CONFIGURATION & CHECKS (with proper validation) ---
const validateAmazonConfig = () => {
  const required = ['AMAZON_ACCESS_KEY', 'AMAZON_SECRET_KEY', 'AMAZON_PARTNER_TAG'];
  const env = import.meta.env as Record<string, string>;
  const missing = required.filter(key => !env[key]);
  
  if (missing.length > 0) {
    console.error(
      `❌ Amazon PAAPI Configuration Error:\n` +
      `Missing required credentials: ${missing.join(', ')}\n` +
      `The Amazon sync functionality will not work. Add these to your .env.local`
    );
    return false;
  }
  return true;
};

const amazonConfigValid = validateAmazonConfig();

// Sanity Client for WRITING (Needs Write Token)
const writeClient = createClient({
  projectId: getEnv('PUBLIC_SANITY_PROJECT_ID'),
  dataset: getEnvOptional('PUBLIC_SANITY_DATASET', 'production'),
  token: getEnvOptional('SANITY_WRITE_TOKEN'),
  apiVersion: '2024-01-01',
  useCdn: false, // Must be false for writing
});

// --- 2. TYPES ---
type AmazonProduct = {
  asin: string;
  title: string;
  price?: number;
  listPrice?: number;
  detailPageURL: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
};

// --- 3. CRYPTO HELPERS (Edge Compatible) ---
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSha256(key: ArrayBuffer | Uint8Array, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key as BufferSource,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSha256Raw(key: ArrayBuffer | Uint8Array, message: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key as BufferSource,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
}

async function getSignatureKey(key: string, dateStamp: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate = await hmacSha256Raw(new TextEncoder().encode(`AWS4${key}`), dateStamp);
  const kRegion = await hmacSha256Raw(kDate, region);
  const kService = await hmacSha256Raw(kRegion, service);
  return await hmacSha256Raw(kService, 'aws4_request');
}

async function createAwsSignature(method: string, path: string, body: string, region: string = "eu-west-1") {
  const accessKey = getEnv('AMAZON_ACCESS_KEY');
  const secretKey = getEnv('AMAZON_SECRET_KEY');
  const host = `webservices.amazon.ae`;
  const service = "ProductAdvertisingAPI";
  
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);

  const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-date";
  const payloadHash = await sha256(body);
  const canonicalRequest = `${method}\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  
  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalRequestHash = await sha256(canonicalRequest);
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${canonicalRequestHash}`;

  const signingKey = await getSignatureKey(secretKey, dateStamp, region, service);
  const signature = await hmacSha256(signingKey, stringToSign);
  const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "host": host,
      "x-amz-date": amzDate,
      "Authorization": authorizationHeader,
    },
  };
}

// --- 4. API CALLER (with improved error handling) ---
async function searchAmazonProducts(keywords: string): Promise<AmazonProduct[]> {
  // ✅ Early return if config invalid
  if (!amazonConfigValid) {
    console.warn('⚠️ Amazon PAAPI not configured. Skipping search for:', keywords);
    return [];
  }

  const partnerTag = getEnvOptional('AMAZON_PARTNER_TAG');
  if (!partnerTag) {
    console.error('❌ AMAZON_PARTNER_TAG not set');
    return [];
  }

  const requestBody = {
    PartnerTag: partnerTag,
    PartnerType: "Associates",
    Keywords: keywords,
    SearchIndex: "All",
    ItemCount: 10,
    Resources: [
      "ItemInfo.Title",
      "Offers.Listings.Price",
      "Offers.Listings.SavingBasis",
      "Images.Primary.Large",
      "CustomerReviews.StarRating",
      "CustomerReviews.Count"
    ],
  };

  const path = "/paapi5/searchitems";
  const body = JSON.stringify(requestBody);

  try {
    const { headers } = await createAwsSignature("POST", path, body);
    const response = await fetch(`https://webservices.amazon.ae${path}`, {
      method: "POST",
      headers,
      body,
      // ✅ Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    // ✅ Better error handling with specific messages
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `❌ Amazon API Error (${response.status}):`,
        errorText.slice(0, 200) // Limit error message length
      );
      
      // Specific handling for different error codes
      if (response.status === 401 || response.status === 403) {
        console.error('🔐 Authentication failed. Check AMAZON_ACCESS_KEY and AMAZON_SECRET_KEY');
      } else if (response.status === 429) {
        console.error('⏱️ Rate limited by Amazon API. Retry after delay.');
      } else if (response.status === 500 || response.status === 503) {
        console.error('🔴 Amazon API service unavailable. Try again later.');
      }
      
      return [];
    }

    const data = await response.json();
    
    // ✅ Handle empty results gracefully
    if (!data.SearchResult?.Items || data.SearchResult.Items.length === 0) {
      console.log(`ℹ️ No Amazon products found for: "${keywords}"`);
      return [];
    }

    const items: Array<Record<string, any>> = data.SearchResult.Items || [];

    return items.map((item: Record<string, any>) => ({
      asin: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || "Untitled",
      price: item.Offers?.Listings?.[0]?.Price?.Amount,
      listPrice: item.Offers?.Listings?.[0]?.Price?.SavingBasis?.Amount,
      detailPageURL: item.DetailPageURL || "",
      imageUrl: item.Images?.Primary?.Large?.URL,
      rating: item.CustomerReviews?.StarRating,
      reviewCount: item.CustomerReviews?.Count
    }));
  } catch (error) {
    console.error("Error calling Amazon PA-API:", error);
    return [];
  }
}

// --- 5. MAIN EXPORT ---
export async function fetchAndStoreDeals() {
  if (!import.meta.env.SANITY_WRITE_TOKEN) {
    throw new Error("Missing SANITY_WRITE_TOKEN. Cannot sync deals.");
  }

  try {
    const products = await searchAmazonProducts("electronics deals");
    
    // Filter for actual discounts
    const deals = products.filter(
      (p) => p.listPrice && p.price && p.price < p.listPrice
    );

    const transaction = writeClient.transaction();

    deals.forEach((p) => {
      const discount = Math.round(((p.listPrice! - p.price!) / p.listPrice!) * 100);
      
      transaction.createOrReplace({
        _type: "deal",
        _id: `deal-${p.asin}`,
        slug: { _type: "slug", current: p.asin },
        title: p.title,
        dealPrice: p.price,
        originalPrice: p.listPrice,
        discountPercentage: discount,
        affiliateLink: p.detailPageURL,
        imageUrl: p.imageUrl,
        rating: p.rating,
        reviewCount: p.reviewCount,
        topTenCategory: "Electronics",
        isActive: true,
      });
    });

    if (deals.length > 0) {
      await transaction.commit();
    }

    return { added: deals.length, total: products.length };
  } catch (error) {
    console.error("Error in fetchAndStoreDeals:", error);
    throw error;
  }
}