// lib/amazon‑paapi/fetchDeals.js
const amazonPaapi = require('amazon-paapi');
const { createClient } = require('@sanity/client');

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const commonParameters = {
  AccessKey: process.env.AMAZON_ACCESS_KEY,
  SecretKey: process.env.AMAZON_SECRET_KEY,
  PartnerTag: process.env.AMAZON_PARTNER_TAG, // Your affiliate tag
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

async function fetchAndStoreDeals() {
  try {
    const data = await amazonPaapi.SearchItems(commonParameters, requestParameters);
    const deals = data.Items?.map(item => ({
      _type: 'deal',
      title: item.ItemInfo.Title.DisplayValue,
      image: item.Images.Primary.Medium.URL,
      affiliateLink: item.DetailPageURL,
      originalPrice: item.Offers?.Listings?.[0]?.Price?.SavingBasis?.Money?.Amount,
      dealPrice: item.Offers?.Listings?.[0]?.Price?.Money?.Amount,
      discountPercentage: item.Offers?.Listings?.[0]?.Price?.Savings?.Percentage,
      isPrimeExclusive: item.Offers?.Listings?.[0]?.DealDetails?.AccessType === 'PRIME_EXCLUSIVE',
      rating: item.CustomerReviews?.StarRating,
      reviewCount: item.CustomerReviews?.Count,
    })) || [];

    // Upsert deals to Sanity
    for (const deal of deals) {
      await sanityClient.createOrReplace({
        ...deal,
        _id: `deal-${item.ASIN}`,
      });
    }
  } catch (error) {
    console.error('Failed to fetch/deals:', error);
  }
}