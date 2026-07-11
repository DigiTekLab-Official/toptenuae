// src/sanity/lib/index.ts
// Sanity runtime utilities and helpers
// NOTE: Query exports removed - import queries from @/sanity/queries instead

export { client, sanityFetch } from './client';
export { projectId, dataset, apiVersion } from '../env';
export {
  urlFor,
  mainImage,
  archiveCardImage,
  featureCardImage,
  thumbnailImage,
  heroBannerImage,
  productCardImage,
  ogImage,
  blurImage,
  optimizedImage,
  getImageDimensions,
  getAspectRatio,
  isValidImage,
  getDominantColor,
  getLQIP,
  sanityImageUrl,
  // Legacy aliases for backward compatibility
  listImage,
  cardImage,
  thumbImage,
  discoverImage,
  sidebarImage,
  urlForImage,
} from './image';
