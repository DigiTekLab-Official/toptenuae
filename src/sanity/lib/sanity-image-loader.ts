// lib/sanity-image-loader.ts
import type { ImageLoader } from "next/image";

const sanityImageLoader: ImageLoader = ({ src, width, quality }) => {
  const baseUrl = "https://cdn.sanity.io/images";

  // Ensure src is relative to your Sanity project
  // Example src: "<projectId>/<dataset>/<assetId>-<dimensions>.<ext>"
  const params = [
    `w=${width}`,
    `q=${quality || 75}`,
    "auto=format", // Let Sanity serve WebP/AVIF when supported
  ].join("&");

  return `${baseUrl}/${src}?${params}`;
};

export default sanityImageLoader;
