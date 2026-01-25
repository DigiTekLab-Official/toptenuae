// src/app/report/page.tsx
import { client } from '@/sanity/lib/client';
import { DownloadButtons } from '@/components/report/DownloadButtons';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Full Content Report',
  robots: { index: false, follow: false },
};

const productionUrl = 'https://toptenuae.com';

const buildPostUrl = (post: any, useProduction = false) => {
  const baseUrl = useProduction ? productionUrl : (process.env.BASE_URL || 'http://localhost:3000');
  
  let folder = '/reviews';

  if (post._type === 'deal') {
    folder = '/deals';
  }
  else if (post._type === 'product') {
    folder = '/reviews';
  }
  else if (['how-to-guides', 'guides'].includes(post.categorySlug)) {
    folder = '/how-to-guides';
  } else if (['top-ten', 'top-lists'].includes(post.categorySlug)) {
    folder = '/top-ten';
  } else if (['deals', 'hot-deals', 'offers'].includes(post.categorySlug)) {
    folder = '/deals';
  } else if (['reviews', 'product-reviews', 'buyers-guide'].includes(post.categorySlug)) {
    folder = '/reviews';
  }
  else {
    switch (post._type) {
      case 'topTenList': folder = '/top-ten'; break;
      case 'howTo': folder = '/how-to-guides'; break;
      case 'holiday':
      case 'event': folder = '/events-holidays'; break;
      case 'tool': folder = '/finance-tools'; break;
    }
  }

  return `${baseUrl}${folder}/${post.slug}`;
};

export default async function ReportPage() {

  // ✅ FIX: Filter out inactive deals here too
  const allContent = await client.fetch(`
    *[
      _type != "category" &&
      _type != "tool" &&
      _type != "author" &&
      defined(slug.current) &&
      !(_type == "deal" && isActive == false)
    ] | order(_updatedAt desc) {
      title,
      _type,
      "slug": slug.current,
      _updatedAt,
      "categorySlug": categories[0]->slug.current,
      "categoryTitle": categories[0]->title
    }
  `);

  const categories = await client.fetch(`
    *[_type == "category" && defined(slug.current)] | order(title asc) {
      title,
      "slug": slug.current,
      _updatedAt
    }
  `);

  const toolPages = [
    { title: 'Gratuity Calculator UAE', slug: 'gratuity-calculator-uae' },
    { title: 'UAE VAT Calculator', slug: 'uae-vat-calculator' },
    { title: 'Zakat Calculator', slug: 'zakat-calculator' },
  ];

  const staticPages = [
    { title: 'Home', slug: '' },
    { title: 'About Us', slug: 'about-us' },
    { title: 'Contact Us', slug: 'contact-us' },
    { title: 'Privacy Policy', slug: 'privacy-policy' },
    { title: 'Terms and Conditions', slug: 'terms-and-conditions' },
    { title: 'Affiliate Disclosure', slug: 'affiliate-disclosure' },
    { title: 'Disclaimer', slug: 'disclaimer' },
    { title: 'Cookies Policy', slug: 'cookies-policy' },
    { title: 'Thank You', slug: 'thank-you' },
    { title: 'Subscribe', slug: 'subscribe' },
    { title: 'Search', slug: 'search' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans bg-white text-gray-800">
      <DownloadButtons 
        allContent={allContent}
        categories={categories}
        toolPages={toolPages}
        staticPages={staticPages}
        productionUrl={productionUrl}
      />
      
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Content Report</h1>
          <p className="text-gray-500 mt-1">Status: <span className="text-green-600 font-bold">Filtered (Active Only)</span></p>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p className="font-bold">Total: {allContent.length + categories.length + toolPages.length + staticPages.length}</p>
        </div>
      </div>

      <section className="mb-12">
        <div className="overflow-x-auto shadow-sm rounded-lg border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 uppercase font-semibold text-gray-600">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Config</th>
                <th className="p-4">Final URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allContent.map((post: any, index: number) => {
                const fullUrl = buildPostUrl(post, true);
                let configSource = 'Default';
                if (post._type === 'deal') configSource = 'Deal Schema';
                else if (post._type === 'product') configSource = 'Product Schema';
                else if (post.categorySlug) configSource = `Cat: ${post.categorySlug}`;

                return (
                  <tr key={post.slug} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-400">{index + 1}</td>
                    <td className="p-4 font-medium">{post.title || '(No Title)'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs uppercase font-bold 
                        ${post._type === 'deal' ? 'bg-yellow-100 text-yellow-800' : 
                          post._type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-600'}`}>
                        {post._type}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-500">{configSource}</td>
                    <td className="p-4">
                      <a href={fullUrl} target="_blank" className="text-blue-600 hover:underline text-xs break-all font-mono">
                        {fullUrl.replace(productionUrl, '')}
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      
      {/* ... (Keep other sections unchanged) ... */}
       {/* SECTION 1: TOOLS */}
      <section className="mb-10 bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-xl font-bold mb-4 text-blue-800 flex items-center">
          🛠️ Functional Tools ({toolPages.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {toolPages.map((tool) => (
            <a 
              key={tool.slug}
              href={`${productionUrl}/finance-tools/${tool.slug}`}
              target="_blank"
              className="block p-4 bg-white rounded shadow-sm border hover:shadow-md transition"
            >
              <div className="font-semibold text-blue-600">{tool.title}</div>
              <div className="text-xs text-gray-500 mt-1 break-all">/finance-tools/{tool.slug}</div>
            </a>
          ))}
        </div>
      </section>

      {/* SECTION 3: CATEGORIES */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-l-4 border-yellow-500 pl-3">
          Categories ({categories.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat: any) => {
            // Mapping categories to their new homes
            let catFolder = '';
            if (['how-to-guides', 'guides'].includes(cat.slug)) catFolder = 'how-to-guides';
            else if (['top-ten', 'top-lists'].includes(cat.slug)) catFolder = 'top-ten';
            else if (['deals', 'hot-deals'].includes(cat.slug)) catFolder = 'deals';
            else if (['reviews', 'product-reviews'].includes(cat.slug)) catFolder = 'reviews';
            else catFolder = cat.slug; // Fallback to root or keep as is

            const categoryUrl = `${productionUrl}/${catFolder}`;
            
            return (
              <div
                key={cat.slug}
                className="p-4 border rounded-lg bg-white hover:shadow-sm transition"
              >
                <div className="font-semibold text-gray-900">{cat.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Sanity Slug: <span className="font-mono">{cat.slug}</span>
                </div>
                <div className="text-xs text-blue-600 mt-2 break-all">
                  <a href={categoryUrl} target="_blank" className="hover:underline">
                    /{catFolder}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: STATIC PAGES */}
      <section className="pb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 border-l-4 border-gray-500 pl-3">
          Core Pages ({staticPages.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {staticPages.map((page) => {
            const pageUrl = page.slug ? `${productionUrl}/${page.slug}` : productionUrl;
            return (
              <div key={page.slug} className="bg-gray-50 p-3 rounded border">
                <div className="font-medium text-gray-900">{page.title}</div>
                <a 
                  href={pageUrl}
                  target="_blank"
                  className="text-xs text-blue-600 hover:underline break-all"
                >
                  {pageUrl.replace(productionUrl, '') || '/'}
                </a>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}