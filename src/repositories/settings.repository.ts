// src/repositories/settings.repository.ts
// Site-shell repository - single source for settings, navigation, and footer data
import { client } from '@/sanity/lib/client';
import {
  SITE_SETTINGS_QUERY,
  NAVIGATION_MENU,
  FOOTER_DATA,
} from '@/sanity/queries/settings.queries';
import type { SiteSettings } from '@/types/site/settings';
import type { NavigationMenu } from '@/types/site/navigation';
import type { FooterData } from '@/types/site/footer';

/**
 * Fetch site settings
 * @returns Site settings data or null
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await client.fetch<SiteSettings>(SITE_SETTINGS_QUERY, {});
  } catch (error) {
    console.error('[SettingsRepository] Error fetching site settings:', error);
    return null;
  }
}

/**
 * Fetch the site navigation menu
 * @returns Navigation menu data or null
 */
export async function getNavigationMenu(): Promise<NavigationMenu | null> {
  try {
    return await client.fetch<NavigationMenu>(NAVIGATION_MENU, {});
  } catch (error) {
    console.error('[SettingsRepository] Error fetching navigation menu:', error);
    return null;
  }
}

/**
 * Fetch footer data
 * @returns Footer data or null
 */
export async function getFooterData(): Promise<FooterData | null> {
  try {
    return await client.fetch<FooterData>(FOOTER_DATA, {});
  } catch (error) {
    console.error('[SettingsRepository] Error fetching footer data:', error);
    return null;
  }
}

/**
 * Fetch everything the global layout/site-shell needs in one call:
 * site settings, navigation, and footer. Individual fetches are still
 * exported above for callers that only need one piece.
 * @returns Combined layout data; any piece that fails resolves to null
 * rather than failing the whole call
 */
export async function getGlobalLayoutData(): Promise<{
  settings: SiteSettings | null;
  navigation: NavigationMenu | null;
  footer: FooterData | null;
}> {
  const [settings, navigation, footer] = await Promise.all([
    getSiteSettings(),
    getNavigationMenu(),
    getFooterData(),
  ]);

  return { settings, navigation, footer };
}