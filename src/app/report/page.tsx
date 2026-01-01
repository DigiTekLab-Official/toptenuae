import { client } from '@/sanity/client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Full Content Report',
  robots: { index: false, follow: false }, // Keep hidden from Google
};

export default async function ReportPage() {
  const baseUrl = process.env.BASE_URL || 'https://toptenuae.com';

  // 1. IMPROVED QUERY: Fetches ANY document with a slug (Posts, Holidays, Tools, etc.)
  // We exclude 'category' because we fetch those separately below.
  const allContent = await client.fetch(`
  *[_type != "category" && _type != "tool" && _type != "author" && defined(slug.current)] | order(_updatedAt desc) {
    title,
    _type,
    "slug": slug.current,
    _updatedAt
  }
`);

  // 2. Fetch Categories
  const categories = await client.fetch(`
    *[_type == "category" && defined(slug.current)] | order(title asc) {
      title,
      "slug": slug.current,
      _updatedAt
    }
  `);

  // 3. YOUR TOOLS (From your Sitemap XML)
  // Since these are likely static pages in Next.js (not Sanity), we list them manually here.
  const toolPages = [
    { title: 'Gratuity Calculator UAE', url: '/gratuity-calculator-uae' },
    { title: 'UAE VAT Calculator', url: '/uae-vat-calculator' },
    { title: 'Zakat Calculator', url: '/zakat-calculator' },
  ];

  // 4. OTHER STATIC PAGES
  const staticPages = [
    '', '/about-us', '/contact-us', '/privacy-policy', 
    '/terms-and-conditions', '/affiliate-disclosure',
    '/disclaimer', '/cookies-policy', '/thank-you', '/subscribe', '/search',
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans bg-white text-gray-800">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Content Report</h1>
          <p className="text-gray-500 mt-1">Status: <span className="text-green-600 font-bold">Ready for Migration</span></p>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>Dynamic Posts: <strong>{allContent.length}</strong></p>
          <p>Categories: <strong>{categories.length}</strong></p>
          <p>Tools & Static: <strong>{toolPages.length + staticPages.length}</strong></p>
        </div>
      </div>

      {/* SECTION 1: THE TOOLS (Critical for User Value) */}
      <section className="mb-10 bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-xl font-bold mb-4 text-blue-800 flex items-center">
          🛠️ Functional Tools ({toolPages.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {toolPages.map((tool) => (
            <a 
              key={tool.url}
              href={`${baseUrl}${tool.url}`}
              target="_blank"
              className="block p-4 bg-white rounded shadow-sm border hover:shadow-md transition text-blue-600 font-semibold"
            >
              {tool.title} <span className="float-right">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* SECTION 2: ALL DYNAMIC POSTS (Holidays, Articles, Reviews) */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-l-4 border-purple-500 pl-3">
          All Published Content ({allContent.length})
        </h2>
        <div className="overflow-x-auto shadow-sm rounded-lg border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 uppercase font-semibold text-gray-600">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Title</th>
                <th className="p-4">Content Type</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allContent.map((post: any, index: number) => (
                <tr key={post.slug} className="hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-400">{index + 1}</td>
                  <td className="p-4 font-medium text-gray-900">{post.title || '(No Title Found)'}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-200 rounded text-xs uppercase font-bold text-gray-600">
                      {post._type}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(post._updatedAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <a 
                      href={`${baseUrl}/${post.slug}`} 
                      target="_blank" 
                      className="text-green-600 hover:text-green-800 font-medium hover:underline"
                    >
                      Check Live
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: CATEGORIES */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-l-4 border-yellow-500 pl-3">
          Categories ({categories.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat: any) => (
            <a 
              key={cat.slug}
              href={`${baseUrl}/category/${cat.slug}`}
              target="_blank"
              className="px-3 py-2 border rounded-full text-sm text-gray-600 hover:bg-yellow-50 hover:border-yellow-300 transition"
            >
              {cat.title}
            </a>
          ))}
        </div>
      </section>

      {/* SECTION 4: STATIC PAGES */}
      <section className="pb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-l-4 border-gray-500 pl-3">
          Core Pages ({staticPages.length})
        </h2>
        <div className="flex flex-wrap gap-2 text-sm text-gray-500">
          {staticPages.map((route) => (
            <span key={route} className="bg-gray-100 px-2 py-1 rounded">
              {route === '' ? '/ (Home)' : route}
            </span>
          ))}
        </div>
      </section>

    </div>
  );
}