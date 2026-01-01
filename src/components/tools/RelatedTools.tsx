import Link from 'next/link';

interface RelatedToolsProps {
  currentTool: 'vat' | 'gratuity' | 'zakat';
}

export default function RelatedTools({ currentTool }: RelatedToolsProps) {
  const tools = [
    {
      id: 'gratuity',
      title: 'Gratuity Calculator',
      desc: 'Calculate end-of-service benefits (MOHRE)',
      href: '/gratuity-calculator-uae',
      icon: '💰',
      color: 'bg-amber-100 text-amber-700 border-amber-100 hover:border-amber-300'
    },
    {
      id: 'vat',
      title: 'VAT Calculator',
      desc: 'Add or Remove 5% Tax in UAE',
      href: '/uae-vat-calculator',
      icon: '📊',
      color: 'bg-purple-100 text-purple-700 border-purple-100 hover:border-purple-300'
    },
    {
      id: 'zakat',
      title: 'Zakat Calculator',
      desc: 'Islamic wealth tax calculation',
      href: '/zakat-calculator',
      icon: '🌙',
      color: 'bg-green-100 text-green-700 border-green-100 hover:border-green-300'
    }
  ];

  // Filter out the current tool so we don't link to the page we are already on
  const related = tools.filter(t => t.id !== currentTool);

  return (
    <div className="mt-16 border-t border-slate-100 pt-10">
      <h3 className="text-xl font-bold text-slate-900 mb-6">More UAE Finance Tools</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {related.map((tool) => (
          <Link 
            key={tool.id} 
            href={tool.href}
            className={`group flex items-center gap-4 p-5 rounded-xl border transition-all hover:shadow-md ${tool.color}`}
          >
            <span className="text-2xl">{tool.icon}</span>
            <div>
              <div className="font-bold group-hover:underline decoration-2 underline-offset-2">
                {tool.title}
              </div>
              <div className="text-sm opacity-80 font-medium">
                {tool.desc}
              </div>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}