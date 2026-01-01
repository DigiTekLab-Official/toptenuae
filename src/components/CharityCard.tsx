// components/CharityCard.tsx
import Link from 'next/link'

interface Charity {
  _id: string;
  name: string;
  emirate: string;
  donationMethods: string[];
  bestFor: string;
  description: string;
  website: string;
}

// Helper to get labels and colors for tags
const getMethodStyle = (method: string) => {
  switch (method) {
    case 'pickup': return { label: '🚚 Home Pickup', style: 'bg-green-100 text-green-800' };
    case 'bin': return { label: '📍 Bin Drop-off', style: 'bg-yellow-100 text-yellow-800' };
    case 'center': return { label: '🏢 Center Visit', style: 'bg-blue-100 text-blue-800' };
    case 'mall': return { label: '🛍️ Mall Collection', style: 'bg-purple-100 text-purple-800' };
    default: return { label: method, style: 'bg-gray-100 text-gray-800' };
  }
};

export default function CharityList({ charities }: { charities: Charity[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {charities.map((charity) => (
        <div key={charity._id} className="flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white">
          
          {/* Header Section */}
          <div className="p-6 pb-4 flex-grow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">
                {charity.emirate}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{charity.name}</h3>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {charity.description}
            </p>

            {/* Dynamic Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {charity.donationMethods.map((method) => {
                const { label, style } = getMethodStyle(method);
                return (
                  <span key={method} className={`text-xs px-2 py-1 rounded-md font-medium ${style}`}>
                    {label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Footer Action */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <Link 
              href={charity.website} 
              target="_blank" 
              className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Visit Website
            </Link>
          </div>
          
        </div>
      ))}
    </div>
  )
}