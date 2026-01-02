// src/lib/sanityLoader.ts

export default function sanityLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If the source is already optimized or external, return as is
  if (src.includes('?')) {
    return `${src}&w=${width}&q=${quality || 75}&auto=format`;
  }
  
  // Append Sanity optimization parameters
  return `${src}?w=${width}&q=${quality || 75}&auto=format`;
}