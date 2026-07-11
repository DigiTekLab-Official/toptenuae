// src/repositories/sitemap.repository.ts
// Sitemap repository - aggregates every URL-bearing document across
// categories, top ten lists, products, and generic posts/articles/
// how-tos/holidays/events into sitemap-ready entries.
import { client } from '@/sanity/lib/client';
import { SITEMAP_ENTRIES_QUERY } from '@/sanity/queries/sitemap.queries';
import type { SitemapEntry } from '@/types/content/sitemap';

/**
 * Fetch raw sitemap entries (type, slug, categorySlug, last updated) for
 * every indexable document.
 * @returns Array of sitemap entries or empty array on error
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  try {
    return await client.fetch<SitemapEntry[]>(SITEMAP_ENTRIES_QUERY);
  } catch (error) {
    console.error('[SitemapRepository] Error fetching sitemap entries:', error);
    return [];
  }
}

/**
 * Build the final site-relative URL for a single sitemap entry, matching
 * the routing convention used by src/pages/[category]/[slug].astro.
 *
 * - `category` documents live at `/{slug}`
 * - everything else lives at `/{categorySlug}/{slug}`
 *
 * NOTE: if `categorySlug` is missing for a non-category document, that
 * likely means the doc has no category reference in Sanity - such entries
 * are skipped (return null) rather than emitting a broken URL. Worth an
 * editorial fix in Sanity rather than a routing workaround here.
 */
function buildSitemapUrl(entry: SitemapEntry): string | null {
  if (entry._type === 'category') {
    return `/${entry.slug}`;
  }

  if (!entry.categorySlug) {
    console.warn(
      `[SitemapRepository] Skipping "${entry.slug}" (${entry._type}) - missing categorySlug`
    );
    return null;
  }

  return `/${entry.categorySlug}/${entry.slug}`;
}

/**
 * Fetch every sitemap entry and resolve it to a final URL, ready for
 * an Astro sitemap route or build script to consume.
 * @returns Array of `{ url, lastModified }` or empty array on error
 */
export async function getAllSitemapUrls(): Promise<
  { url: string; lastModified: string }[]
> {
  const entries = await getSitemapEntries();

  return entries
    .map((entry) => {
      const url = buildSitemapUrl(entry);
      if (!url) return null;
      return { url, lastModified: entry._updatedAt };
    })
    .filter((item): item is { url: string; lastModified: string } => item !== null);
}