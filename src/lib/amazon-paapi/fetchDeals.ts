// src/lib/amazon-paapi/fetchDeals.ts

import { client } from "@/sanity/lib/client";

type AmazonProduct = {
  asin: string;
  title: string;
  price?: number;
  listPrice?: number;
  detailPageURL: string;
  imageUrl?: string;
};

type SearchItemsResponse = {
  SearchResult?: {
    Items?: Array<{
      ASIN: string;
      ItemInfo?: {
        Title?: { DisplayValue?: string };
      };
      Images?: {
        Primary?: {
          Large?: { URL?: string };
        };
      };
      Offers?: {
        Listings?: Array<{
          Price?: { Amount?: number };
          SavingBasis?: { Amount?: number };
        }>;
      };
      DetailPageURL?: string;
    }>;
  };
};

/**
 * Create AWS Signature Version 4 for Amazon PA-API
 */
async function createAwsSignature(
  method: string,
  path: string,
  body: string,
  region: string = "eu-west-1"
) {
  const accessKey = process.env.AMAZON_ACCESS_KEY!;
  const secretKey = process.env.AMAZON_SECRET_KEY!;
  
  const host = `webservices.amazon.ae`;
  const service = "ProductAdvertisingAPI";
  
  // Create date strings
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);

  // Create canonical request
  const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "content-type;host;x-amz-date";
  
  // Hash the payload
  const payloadHash = await sha256(body);
  
  const canonicalRequest = `${method}\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  
  // Create string to sign
  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalRequestHash = await sha256(canonicalRequest);
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${canonicalRequestHash}`;

  // Calculate signature
  const signingKey = await getSignatureKey(secretKey, dateStamp, region, service);
  const signature = await hmacSha256(signingKey, stringToSign);

  // Create authorization header
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

/**
 * SHA256 hash function
 */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * HMAC SHA256
 */
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

/**
 * Get AWS signature key
 */
async function getSignatureKey(
  key: string,
  dateStamp: string,
  region: string,
  service: string
): Promise<ArrayBuffer> {
  const kDate = await hmacSha256Raw(new TextEncoder().encode(`AWS4${key}`), dateStamp);
  const kRegion = await hmacSha256Raw(kDate, region);
  const kService = await hmacSha256Raw(kRegion, service);
  const kSigning = await hmacSha256Raw(kService, 'aws4_request');
  return kSigning;
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

/**
 * Search Amazon products using PA-API with fetch
 */
async function searchAmazonProducts(params: {
  keywords: string;
  marketplace: string;
}): Promise<AmazonProduct[]> {
  const partnerTag = process.env.AMAZON_PARTNER_TAG;
  
  if (!process.env.AMAZON_ACCESS_KEY || !process.env.AMAZON_SECRET_KEY || !partnerTag) {
    console.warn("Amazon API credentials not configured");
    return [];
  }

  const requestBody = {
    PartnerTag: partnerTag,
    PartnerType: "Associates",
    Keywords: params.keywords,
    SearchIndex: "All",
    ItemCount: 10,
    Resources: [
      "ItemInfo.Title",
      "Offers.Listings.Price",
      "Offers.Listings.SavingBasis",
      "Images.Primary.Large",
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
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Amazon API error:", response.status, errorText);
      return [];
    }

    const data: SearchItemsResponse = await response.json();
    const items = data.SearchResult?.Items || [];

    return items.map((item) => {
      const listing = item.Offers?.Listings?.[0];
      return {
        asin: item.ASIN,
        title: item.ItemInfo?.Title?.DisplayValue || "Untitled",
        price: listing?.Price?.Amount,
        listPrice: listing?.SavingBasis?.Amount,
        detailPageURL: item.DetailPageURL || "",
        imageUrl: item.Images?.Primary?.Large?.URL,
      };
    });
  } catch (error) {
    console.error("Error calling Amazon PA-API:", error);
    return [];
  }
}

/**
 * Fetches deals from Amazon Product Advertising API and stores them in Sanity
 */
export async function fetchAndStoreDeals() {
  try {
    const products = await searchAmazonProducts({
      keywords: "electronics deals",
      marketplace: "www.amazon.ae",
    });

    const deals = products.filter(
      (p) => p.listPrice && p.price && p.price < p.listPrice
    );

    let addedCount = 0;

    for (const p of deals) {
      await client.createOrReplace({
        _type: "deal",
        _id: `deal-${p.asin}`,
        slug: { _type: "slug", current: p.asin },
        title: p.title,
        dealPrice: p.price,
        originalPrice: p.listPrice,
        discountPercentage: Math.round(
          ((p.listPrice! - p.price!) / p.listPrice!) * 100
        ),
        affiliateLink: p.detailPageURL,
        imageUrl: p.imageUrl,
        topTenCategory: "Electronics",
        isActive: true,
      });
      addedCount++;
    }

    return { added: addedCount, total: products.length };
  } catch (error) {
    console.error("Error in fetchAndStoreDeals:", error);
    throw error;
  }
}
