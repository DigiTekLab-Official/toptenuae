// src/lib/amazon.ts
"use server";

import aws4 from "aws4";

interface AmazonProduct {
  asin: string;
  url: string;
  title: string;
  image: string;
  price: string;
  availability: string;
}

export async function getAmazonProductDetails(asins: string[]): Promise<AmazonProduct[]> {
  if (!asins || asins.length === 0) return [];

  // 1. Configuration for UAE Store
  const HOST = "webservices.amazon.ae";
  const REGION = "eu-west-1"; // Crucial: UAE (amazon.ae) uses the eu-west-1 region for API
  const PATH = "/paapi5/getitems";

  // 2. Construct the Payload
  const payload = {
    ItemIds: asins,
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price",
      "Offers.Listings.Availability.Message"
    ],
    PartnerTag: process.env.AMAZON_PARTNER_TAG!,
    PartnerType: "Associates",
    Marketplace: "www.amazon.ae"
  };

  // 3. Prepare Request Options for Signing
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
      "x-amz-target": "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems",
    },
  };

  // 4. Sign the Request (AWS Signature v4)
  aws4.sign(opts, {
    accessKeyId: process.env.AMAZON_ACCESS_KEY!,
    secretAccessKey: process.env.AMAZON_SECRET_KEY!,
  });

  try {
    // 5. Native Fetch
    const response = await fetch(`https://${HOST}${PATH}`, {
      method: "POST",
      headers: opts.headers as any, // Cast headers to satisfy TypeScript
      body: opts.body,
      next: { revalidate: 3600 }, // Cache prices for 1 hour to stay fast and avoid rate limits
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Amazon API Error (${response.status}):`, errorText);
      return [];
    }

    const data = await response.json();

    // 6. Map Response
    if (data.ItemsResult && data.ItemsResult.Items) {
      return data.ItemsResult.Items.map((item: any) => ({
        asin: item.ASIN,
        url: item.DetailPageURL,
        title: item.ItemInfo?.Title?.DisplayValue || "Unknown Product",
        image: item.Images?.Primary?.Large?.URL || "",
        price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || "Check Price",
        availability: item.Offers?.Listings?.[0]?.Availability?.Message || "In Stock"
      }));
    }

    return [];

  } catch (error) {
    console.error("Amazon Fetch Error:", error);
    return [];
  }
}