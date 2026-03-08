/**
 * Example: Using Feature Flags in Components
 * This file is documentation - copy the patterns to your actual components
 */

// import { features, isFeatureEnabled } from '@/lib/featureFlags';

// ============================================
// EXAMPLE 1: Simple Conditional Rendering
// ============================================
// export function ProductCard() {
//   if (features.newProductCardDesign) {
//     return <ProductCardV2 />;
//   }
//   return <ProductCardV1 />;
// }

// ============================================
// EXAMPLE 2: Using isFeatureEnabled Helper
// ============================================
// export function HomePage() {
//   return (
//     <div>
//       {/* Always show main content */}
//       <HeroSection />
//
//       {/* Conditionally show newsletter popup */}
//       {isFeatureEnabled('newsletterPopup') && <NewsletterPopup />}
//
//       {/* Conditionally show testimonials */}
//       {isFeatureEnabled('testimonials') && <TestimonialsSection />}
//
//       {/* Show search based on feature */}
//       {isFeatureEnabled('advancedSearch') ? (
//         <AdvancedSearch />
//       ) : (
//         <BasicSearch />
//       )}
//     </div>
//   );
// }

// ============================================
// EXAMPLE 3: Server Component Feature Flag
// ============================================
// export async function CategoryPage() {
//   // Server-side feature flag check
//   const enableAmazonSync = isFeatureEnabled('amazonSync');
//
//   // Fetch data conditionally
//   let deals = [];
//   if (enableAmazonSync) {
//     deals = await fetchAmazonDeals();
//   }
//
//   return (
//     <div>
//       <ProductList />
//       {enableAmazonSync && <DealsSection deals={deals} />}
//     </div>
//   );
// }

// ============================================
// EXAMPLE 4: API Route Feature Flag
// ============================================
// import { NextResponse } from 'next/server';
//
// export async function GET() {
//   if (!isFeatureEnabled('userReviews')) {
//     return NextResponse.json(
//       { error: 'User reviews feature is disabled' },
//       { status: 403 }
//     );
//   }
//
//   // Fetch and return reviews
//   const reviews = await fetchReviews();
//   return NextResponse.json(reviews);
// }

// ============================================
// EXAMPLE 5: Configuration Based on Flags
// ============================================
// export const getConfig = () => ({
//   analytics: {
//     gtm: isFeatureEnabled('googleTagManager'),
//     clarity: isFeatureEnabled('clarity'),
//     eventTracking: isFeatureEnabled('eventTracking'),
//   },
//   ui: {
//     showBreadcrumbs: isFeatureEnabled('breadcrumbs'),
//     showTestimonials: isFeatureEnabled('testimonials'),
//     showWishlist: isFeatureEnabled('wishlist'),
//   },
//   performance: {
//     optimizeImages: isFeatureEnabled('imageOptimization'),
//     lazyLoadImages: isFeatureEnabled('lazyLoading'),
//   },
// });

// ============================================
// EXAMPLE 6: A/B Testing with Feature Flags
// ============================================
// export function ProductCTA({ userId }: { userId: string }) {
//   if (features.newProductCardDesign && isUserInGroup(userId, 'beta')) {
//     return (
//       <button className="bg-gradient-to-r from-purple-600 to-blue-600">
//         New CTA Design
//       </button>
//     );
//   }
//
//   return (
//     <button className="bg-blue-600">
//       Standard CTA
//     </button>
//   );
// }
//
// function isUserInGroup(userId: string, group: string): boolean {
//   // Implement user cohort logic here
//   return userId.charCodeAt(0) % 2 === (group === 'beta' ? 0 : 1);
// }

