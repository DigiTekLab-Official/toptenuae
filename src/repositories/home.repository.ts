// src/repositories/home.repository.ts
// Homepage content repository - single source for homepage editorial data
import { client } from '@/sanity/lib/client';
import { HOME_QUERY } from '@/sanity/queries/home.queries';
import type { HomePageData } from '@/types/content/home';

/**
 * Category slugs used to populate homepage sections. This is the single
 * source of truth for "which categories does the homepage show" - the
 * page should import this rather than keeping its own copy, so the fetch
 * list and any display-order logic can never drift apart.
 *
 * Sourced from the live `SELECTED_CATEGORIES` previously hardcoded in
 * src/pages/index.astro.
 */
export const HOME_SECTION_CATEGORIES: string[] = [
  'tech',
  'top-ten',
  'reviews',
  'how-to-guides',
  'events-holidays',
  'whats-on',
  'parenting-kids',
  'finance-tools',
];

/**
 * Fetch all data the homepage needs: hero post, categorized sections,
 * and upcoming posts.
 *
 * This is the only thing the homepage page/template should call for
 * editorial data. Global layout data (site settings, navigation, footer)
 * is a separate concern - see `settings.repository.ts` /
 * `getGlobalLayoutData()` - and intentionally is not merged in here.
 *
 * @param params.categories - category slugs to populate homepage sections;
 * defaults to `HOME_SECTION_CATEGORIES` if omitted
 * @returns Homepage data. On fetch failure, `error` is true and the rest
 * of the fields are safe empty defaults - the caller decides how to
 * render that (e.g. an error state vs. an empty state).
 */
export async function getHomePageData(params?: {
  categories?: string[];
}): Promise<HomePageData> {
  const categories = params?.categories ?? HOME_SECTION_CATEGORIES;

  try {
    const data = await client.fetch<Omit<HomePageData, 'error'>>(HOME_QUERY, { categories });
    return {
      heroPost: data?.heroPost ?? null,
      sections: data?.sections ?? [],
      upcomingPosts: data?.upcomingPosts ?? [],
      buyerGuides: data?.buyerGuides ?? [],
      commercialGuides: data?.commercialGuides ?? [],
      error: false,
    };
  } catch (error) {
    console.error('[HomeRepository] Error fetching homepage data:', error);
    return { heroPost: null, sections: [], upcomingPosts: [], buyerGuides: [], commercialGuides: [], error: true };
  }
}
