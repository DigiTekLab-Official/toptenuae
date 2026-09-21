const SANITY_IMAGE_HOST = 'cdn.sanity.io';

type SanityImageOptions = {
  width: number;
  quality?: number;
};

/**
 * Apply Sanity CDN transforms to a projected asset URL. Non-Sanity URLs are
 * returned unchanged so callers retain their existing fallback behavior.
 */
export function sanityImageUrl(
  source: string | null | undefined,
  { width, quality = 75 }: SanityImageOptions,
): string | undefined {
  if (!source) return undefined;

  try {
    const url = new URL(source);
    if (url.hostname !== SANITY_IMAGE_HOST) return source;

    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(quality));
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'max');
    return url.toString();
  } catch {
    return source;
  }
}

export function sanityImageSrcSet(
  source: string | null | undefined,
  widths: number[],
  quality = 75,
): string | undefined {
  if (!source) return undefined;

  const candidates = widths
    .map((width) => {
      const url = sanityImageUrl(source, { width, quality });
      return url ? `${url} ${width}w` : null;
    })
    .filter(Boolean);

  return candidates.length > 0 ? candidates.join(', ') : undefined;
}
