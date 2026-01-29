// src/lib/amazon-paapi/search.ts
"use server";

import aws4 from "aws4";

interface AmazonProduct {
  asin: string;
  title: string;
  price?: number;
  listPrice?: number;
  detailPageURL: string;
  imageUrl?: string;
}

interface SearchParams {
  keywords: string;
  marketplace?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function searchAmazonProducts(params: SearchParams): Promise<AmazonProduct[]> {
  const { keywords, marketplace = "www.amazon.ae" } = params;

  // Validate environment variables
  if (!process.env.AMAZON_ACCESS_KEY || !process.env.AMAZON_SECRET_KEY || !process.env.AMAZON_PARTNER_TAG) {
    console.error("❌ Missing Amazon credentials:");
    console.error("  AMAZON_ACCESS_KEY:", !!process.env.AMAZON_ACCESS_KEY);
    console.error("  AMAZON_SECRET_KEY:", !!process.env.AMAZON_SECRET_KEY);
    console.error("  AMAZON_PARTNER_TAG:", !!process.env.AMAZON_PARTNER_TAG);
    return [];
  }

  // Configuration for UAE Store
  const HOST = "webservices.amazon.ae";
  const REGION = "eu-west-1"; // UAE uses eu-west-1
  const PATH = "/paapi5/searchitems";

  // Construct the payload
  const payload: any = {
    Keywords: keywords,
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price",
      "Offers.Listings.SavingBasis"
    ],
    PartnerTag: process.env.AMAZON_PARTNER_TAG,
    PartnerType: "Associates",
    Marketplace: marketplace,
    ItemCount: 10, // Get 10 items
  };

  // Add price filters if provided
  if (params.minPrice) {
    payload.MinPrice = params.minPrice * 100; // Convert to cents
  }
  if (params.maxPrice) {
    payload.MaxPrice = params.maxPrice * 100;
  }

  // Prepare request options for signing
  const opts = {
    host: HOST,
    path: PATH,
    service: "ProductAdvertisingAPI",
    region: REGION,
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-encoding": "amz-1.0",
      "x-amz-target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems",
    },
  };

  // Sign the request (AWS Signature v4)
  aws4.sign(opts, {
    accessKeyId: process.env.AMAZON_ACCESS_KEY,
    secretAccessKey: process.env.AMAZON_SECRET_KEY,
  });

  try {
    console.log(`🔍 Searching Amazon for: "${keywords}"`);
    
    const response = await fetch(`https://${HOST}${PATH}`, {
      method: "POST",
      headers: opts.headers as any,
      body: opts.body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Amazon API Error (${response.status}):`, errorText);
      
      // Try to parse error for more details
      try {
        const errorJson = JSON.parse(errorText);
        console.error("Error details:", JSON.stringify(errorJson, null, 2));
      } catch (e) {
        // Not JSON, already logged as text
      }
      
      return [];
    }

    const data = await response.json();
    console.log(`✅ Amazon API Response received`);

    // Map response to our format
    if (data.SearchResult && data.SearchResult.Items) {
      const products = data.SearchResult.Items.map((item: any) => {
        const listing = item.Offers?.Listings?.[0];
        const price = listing?.Price?.Amount;
        const listPrice = listing?.SavingBasis?.Amount;

        return {
          asin: item.ASIN,
          title: item.ItemInfo?.Title?.DisplayValue || "Unknown Product",
          price: price ? price / 100 : undefined, // Convert from cents to AED
          listPrice: listPrice ? listPrice / 100 : undefined,
          detailPageURL: item.DetailPageURL,
          imageUrl: item.Images?.Primary?.Large?.URL || "",
        };
      });

      console.log(`📦 Found ${products.length} products`);
      return products;
    }

    console.warn("⚠️ No items found in SearchResult");
    return [];

  } catch (error) {
    console.error("❌ Amazon Fetch Error:", error);
    return [];
  }
}