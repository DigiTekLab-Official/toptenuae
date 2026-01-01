import { Info } from "lucide-react";

export default function AffiliateDisclosure() {
  return (
    <div className="bg-slate-50 border-b border-gray-100 py-2 px-4 mb-6 text-sm text-gray-600 flex items-start gap-2 leading-relaxed">
      <Info className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-80" />
      <p>
        <strong>Transparency:</strong> TopTenUAE is reader-supported. When you buy through links on our site, we may earn an affiliate commission (at no extra cost to you). <a href="/about" className="underline hover:text-primary">Learn more</a>
      </p>
    </div>
  );
}