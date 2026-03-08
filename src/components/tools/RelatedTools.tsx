// src/components/tools/RelatedTools.tsx
import { Percent, Coins, HeartHandshake } from "@/components/icons";

interface RelatedToolsProps {
  currentTool: string;
}

export default function RelatedTools({ currentTool }: RelatedToolsProps) {
  const tools = [
    {
      id: 'gratuity',
      title: 'Gratuity Calculator',
      desc: 'Calculate end-of-service benefits',
      // ✅ FIX: Matched to screenshot (gratuity-calculator-uae)
      href: '/finance-tools/gratuity-calculator-uae',
      icon: Coins,
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400'
    },
    {
      id: 'vat',
      title: 'VAT Calculator',
      desc: 'Add or Remove 5% Tax in UAE',
      // ✅ FIX: Matched to screenshot (uae-vat-calculator)
      href: '/finance-tools/uae-vat-calculator',
      icon: Percent,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400'
    },
    {
      id: 'zakat',
      title: 'Zakat Calculator',
      desc: 'Islamic wealth tax calculation',
      // ✅ FIX: Matched to screenshot (zakat-calculator)
      href: '/finance-tools/zakat-calculator',
      icon: HeartHandshake,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-400'
    }
  ];

  // Filter out the current tool (fuzzy match)
  const related = tools.filter(t => !currentTool.includes(t.id));

  return (
    <div className="mt-16 border-t border-slate-100 pt-10">
      <h3 className="text-xl font-bold text-slate-900 mb-6">More UAE Finance Tools</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((tool) => {
          const Icon = tool.icon;
          return (
            <a 
              key={tool.id} 
              href={tool.href}
              className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all hover:shadow-md ${tool.color}`}
            >
              <div className="bg-white/60 p-3 rounded-xl backdrop-blur-sm">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-slate-900 group-hover:underline decoration-2 underline-offset-2">
                  {tool.title}
                </div>
                <div className="text-sm opacity-80 font-medium">
                  {tool.desc}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}