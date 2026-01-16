// 1. Use 'import' instead of 'require'
import { createClient } from 'next-sanity';
// Note: You might need to add: // @ts-ignore if amazon-paapi doesn't have type definitions
import amazonPaapi from 'amazon-paapi'; 

// 2. Initialize a Write-Ready Sanity Client
// We create a separate client here because we need the WRITE_TOKEN
const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, // Use NEXT_PUBLIC_ vars for ID
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN, // Ensure this is set in .env.local
  apiVersion: '2024-01-01', // Always specify an API version
  useCdn: false, // Always false for writes
});

const commonParameters = {
  AccessKey: process.env.AMAZON_ACCESS_KEY!,
  SecretKey: process.env.AMAZON_SECRET_KEY!,
  PartnerTag: process.env.AMAZON_PARTNER_TAG!,
  Marketplace: 'www.amazon.ae',
  PartnerType: 'Associates',
};

const requestParameters = {
  Keywords: 'deals',
  SearchIndex: 'All',
  ItemCount: 20,
  Resources: [
    'Images.Primary.Medium',
    'ItemInfo.Title',
    'Offers.Listings.Price',
    'Offers.Listings.DealDetails',
    'CustomerReviews.StarRating',
    'CustomerReviews.Count',
  ],
};

// 3. Define Types (Even simple ones help prevent errors)
interface DealData {
  _type: 'deal';
  asin: string;
  title: string;
  image: string;
  affiliateLink: string;
  originalPrice?: number;
  dealPrice?: number;
  discountPercentage?: number;
  isPrimeExclusive: boolean;
  rating?: number;
  reviewCount?: number;
}

// 4. Export the function so it can be used elsewhere
export async function fetchAndStoreDeals() {
  try {
    console.log('Fetching deals from Amazon...');
    const data = await amazonPaapi.SearchItems(commonParameters, requestParameters);

    if (!data.Items || data.Items.length === 0) {
      console.warn('No items found from Amazon API.');
      return;
    }

    // Map Amazon data to your Sanity schema
    const deals: DealData[] = data.Items.map((item: any) => ({
      _type: 'deal',
      asin: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || 'Unknown Title',
      image: item.Images?.Primary?.Medium?.URL || '',
      affiliateLink: item.DetailPageURL,
      // Safe navigation for deeply nested properties
      originalPrice: item.Offers?.Listings?.[0]?.Price?.SavingBasis?.Amount || 0,
      dealPrice: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
      discountPercentage: item.Offers?.Listings?.[0]?.Price?.Savings?.Percentage || 0,
      isPrimeExclusive: item.Offers?.Listings?.[0]?.DeliveryInfo?.IsPrimeEligible || false,
      rating: item.CustomerReviews?.StarRating || 0,
      reviewCount: item.CustomerReviews?.Count || 0,
    }));

    // 5. Use a Transaction for Atomic, Fast Updates
    const transaction = sanityWriteClient.transaction();

    deals.forEach((deal) => {
      // Use a deterministic ID so we don't create duplicates
      const docId = `deal-${deal.asin}`;
      
      transaction.createOrReplace({
        _id: docId,
        ...deal
      });
    });

    const result = await transaction.commit();
    console.log(`Successfully updated ${deals.length} deals in Sanity.`);
    return result;

  } catch (error) {
    console.error('Failed to fetch/store deals:', error);
    // Re-throw so the calling function knows it failed
    throw error;
  }
}