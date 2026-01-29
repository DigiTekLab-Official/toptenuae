// quick-test.js - Simple test that loads .env.local automatically
require('dotenv').config({ path: '.env.local' });
const aws4 = require('aws4');

console.log("🔍 Testing Amazon PA-API...\n");

// Remove quotes if they exist
const accessKey = process.env.AMAZON_ACCESS_KEY?.replace(/"/g, '');
const secretKey = process.env.AMAZON_SECRET_KEY?.replace(/"/g, '');
const partnerTag = process.env.AMAZON_PARTNER_TAG?.replace(/"/g, '');

console.log("Credentials Check:");
console.log("  ACCESS_KEY:", accessKey ? `${accessKey.substring(0, 6)}...${accessKey.substring(accessKey.length - 4)}` : "❌ MISSING");
console.log("  SECRET_KEY:", secretKey ? `${secretKey.substring(0, 6)}...${secretKey.substring(secretKey.length - 4)}` : "❌ MISSING");
console.log("  PARTNER_TAG:", partnerTag || "❌ MISSING");
console.log("");

if (!accessKey || !secretKey || !partnerTag) {
  console.error("❌ Missing credentials in .env.local");
  process.exit(1);
}

async function testAPI() {
  const HOST = "webservices.amazon.ae";
  const REGION = "eu-west-1";
  const PATH = "/paapi5/searchitems";

  const payload = {
    Keywords: "laptop",
    Resources: [
      "Images.Primary.Large",
      "ItemInfo.Title",
      "Offers.Listings.Price"
    ],
    PartnerTag: partnerTag,
    PartnerType: "Associates",
    Marketplace: "www.amazon.ae",
    ItemCount: 1,
  };

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

  aws4.sign(opts, {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  });

  console.log("🚀 Calling Amazon API...\n");

  try {
    const response = await fetch(`https://${HOST}${PATH}`, {
      method: "POST",
      headers: opts.headers,
      body: opts.body,
    });

    console.log(`Status: ${response.status} ${response.statusText}\n`);
    
    const data = await response.text();
    
    if (!response.ok) {
      console.error("❌ Error Response:");
      console.error(data);
      
      if (data.includes("InvalidSignature")) {
        console.error("\n💡 Your SECRET_KEY is incorrect");
      } else if (data.includes("InvalidClientTokenId")) {
        console.error("\n💡 Your ACCESS_KEY is incorrect");
      } else if (data.includes("InvalidPartnerTag")) {
        console.error("\n💡 Your PARTNER_TAG is incorrect or not approved yet");
        console.error("   Make sure you've completed Amazon Associates signup");
        console.error("   and your account is approved for PA-API access");
      }
      return;
    }

    const json = JSON.parse(data);
    console.log("✅ SUCCESS! Amazon PA-API is working!\n");
    
    if (json.SearchResult?.Items?.[0]) {
      const item = json.SearchResult.Items[0];
      console.log("Sample Product:");
      console.log("  Title:", item.ItemInfo?.Title?.DisplayValue);
      console.log("  ASIN:", item.ASIN);
      console.log("  Price:", item.Offers?.Listings?.[0]?.Price?.DisplayAmount);
    }
    
  } catch (error) {
    console.error("❌ Request failed:", error.message);
  }
}

testAPI();