import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio/', '/api/', '/admin/', '/private/', '/search/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot', 'anthropic-ai', 'OAI-SearchBot'],
        disallow: ['/studio/', '/api/', '/admin/', '/private/'],
      },
    ],
    // ✅ BACK TO STANDARD: Now that the file exists, we point to the main URL.
    sitemap: 'https://toptenuae.com/sitemap.xml',
  };
}