
import { useState } from 'react';

interface DownloadButtonsProps {
  allContent: any[];
  categories: any[];
  toolPages: any[];
  staticPages: any[];
  productionUrl: string;
}

export function DownloadButtons({ 
  allContent, 
  categories, 
  toolPages, 
  staticPages,
  productionUrl 
}: DownloadButtonsProps) {
  const [downloading, setDownloading] = useState(false);

  const buildPostUrl = (post: any) => {
    if (post.categorySlug) {
      return `${productionUrl}/${post.categorySlug}/${post.slug}`;
    }
    return `${productionUrl}/${post.slug}`;
  };

  const downloadCSV = () => {
    setDownloading(true);
    
    // CSV Headers
    let csv = 'Type,Title,URL,Category,Last Updated\n';
    
    // Add all content
    allContent.forEach((post) => {
      const url = buildPostUrl(post);
      const title = (post.title || 'No Title').replace(/"/g, '""');
      const category = (post.categoryTitle || 'No Category').replace(/"/g, '""');
      const type = post._type;
      const updated = new Date(post._updatedAt).toLocaleDateString();
      
      csv += `"${type}","${title}","${url}","${category}","${updated}"\n`;
    });
    
    // Add categories
    categories.forEach((cat) => {
      const url = `${productionUrl}/${cat.slug}`;
      const title = cat.title.replace(/"/g, '""');
      const updated = new Date(cat._updatedAt).toLocaleDateString();
      
      csv += `"category","${title}","${url}","N/A","${updated}"\n`;
    });
    
    // Add tool pages
    toolPages.forEach((tool) => {
      const url = `${productionUrl}/${tool.slug}`;
      const title = tool.title.replace(/"/g, '""');
      
      csv += `"tool","${title}","${url}","N/A","N/A"\n`;
    });
    
    // Add static pages
    staticPages.forEach((page) => {
      const url = page.slug ? `${productionUrl}/${page.slug}` : productionUrl;
      const title = page.title.replace(/"/g, '""');
      
      csv += `"static","${title}","${url}","N/A","N/A"\n`;
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `toptenuae-content-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    setTimeout(() => setDownloading(false), 500);
  };

  const downloadTXT = () => {
    setDownloading(true);
    
    let txt = `TOPTENUAE.COM - CONTENT REPORT\n`;
    txt += `Generated: ${new Date().toLocaleString()}\n`;
    txt += `Production URL: ${productionUrl}\n`;
    txt += `=`.repeat(80) + '\n\n';
    
    txt += `SUMMARY\n`;
    txt += `-`.repeat(80) + '\n';
    txt += `Dynamic Posts: ${allContent.length}\n`;
    txt += `Categories: ${categories.length}\n`;
    txt += `Tools: ${toolPages.length}\n`;
    txt += `Static Pages: ${staticPages.length}\n`;
    txt += `TOTAL: ${allContent.length + categories.length + toolPages.length + staticPages.length}\n\n`;
    
    // Tools
    txt += `\n${'='.repeat(80)}\n`;
    txt += `FUNCTIONAL TOOLS (${toolPages.length})\n`;
    txt += `${'='.repeat(80)}\n\n`;
    toolPages.forEach((tool, i) => {
      txt += `${i + 1}. ${tool.title}\n`;
      txt += `   ${productionUrl}/${tool.slug}\n\n`;
    });
    
    // All Content
    txt += `\n${'='.repeat(80)}\n`;
    txt += `ALL PUBLISHED CONTENT (${allContent.length})\n`;
    txt += `${'='.repeat(80)}\n\n`;
    allContent.forEach((post, i) => {
      txt += `${i + 1}. ${post.title || 'No Title'}\n`;
      txt += `   Type: ${post._type}\n`;
      txt += `   Category: ${post.categoryTitle || 'No Category'}\n`;
      txt += `   URL: ${buildPostUrl(post)}\n`;
      txt += `   Updated: ${new Date(post._updatedAt).toLocaleDateString()}\n\n`;
    });
    
    // Categories
    txt += `\n${'='.repeat(80)}\n`;
    txt += `CATEGORIES (${categories.length})\n`;
    txt += `${'='.repeat(80)}\n\n`;
    categories.forEach((cat, i) => {
      txt += `${i + 1}. ${cat.title}\n`;
      txt += `   Slug: ${cat.slug}\n`;
      txt += `   URL: ${productionUrl}/${cat.slug}\n`;
      txt += `   Updated: ${new Date(cat._updatedAt).toLocaleDateString()}\n\n`;
    });
    
    // Static Pages
    txt += `\n${'='.repeat(80)}\n`;
    txt += `STATIC PAGES (${staticPages.length})\n`;
    txt += `${'='.repeat(80)}\n\n`;
    staticPages.forEach((page, i) => {
      const url = page.slug ? `${productionUrl}/${page.slug}` : productionUrl;
      txt += `${i + 1}. ${page.title}\n`;
      txt += `   ${url}\n\n`;
    });
    
    // Download
    const blob = new Blob([txt], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `toptenuae-content-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    setTimeout(() => setDownloading(false), 500);
  };

  return (
    <div className="mb-8 flex gap-4 items-center">
      <button
        onClick={downloadCSV}
        disabled={downloading}
        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition shadow-md"
      >
        {downloading ? 'Generating...' : '📥 Download CSV Report'}
      </button>
      
      <button
        onClick={downloadTXT}
        disabled={downloading}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition shadow-md"
      >
        {downloading ? 'Generating...' : '📄 Download TXT Report'}
      </button>
      
      <div className="text-sm text-gray-500 ml-4">
        All URLs will use: <strong className="text-gray-900">{productionUrl}</strong>
      </div>
    </div>
  );
}