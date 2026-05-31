
import { useState, useMemo } from 'react';
import DealCard from './DealCard'; 
import FilterBar from './FilterBar';
import type { Deal } from '@/types/sanity'; 

interface DealsFeedProps {
  initialDeals: Deal[];
}

export default function DealsFeed({ initialDeals }: DealsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');

  // --- Logic: Filter and Sort the raw data ---
  const filteredDeals = useMemo(() => {
    let result = [...initialDeals];

    // Defense-in-depth: drop expired deals client-side too (mirror the server now() gate),
    // so SSR and client agree even if the cached payload is briefly stale.
    const nowTs = Date.now();
    result = result.filter(d => !d.dealEndDate || new Date(d.dealEndDate).getTime() > nowTs);

    // 1. Filter by Category
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Prime Exclusive') {
        result = result.filter(deal => deal.isPrimeExclusive);
      } else {
        // Simple case-insensitive match (safeguarded against null categories)
        result = result.filter(deal => {
          const cat = typeof deal.category === 'string' ? deal.category : deal.category?.title;
          return cat?.toLowerCase() === selectedCategory.toLowerCase();
        });
      }
    }

    // 2. Filter by Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(deal => 
        deal.title?.toLowerCase().includes(query) || 
        deal.description?.toLowerCase().includes(query)
      );
    }

    // 3. Sorting
    switch (sortBy) {
      case 'discount':
        // Sort by highest discount first
        result.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
        break;
      case 'price-low':
        // Sort by lowest price first
        result.sort((a, b) => (a.dealPrice || 0) - (b.dealPrice || 0));
        break;
      case 'rating':
        // Sort by highest rating first
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'latest':
      default:
        // Sort by newest date first
        result.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
        break;
    }

    return result;
  }, [initialDeals, selectedCategory, sortBy, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* The Controls */}
      <FilterBar 
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSortBy}
        onSearch={setSearchQuery}
      />

      {/* The Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredDeals.length > 0 ? (
          filteredDeals.map((deal) => (
            <DealCard key={deal._id} deal={deal} />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-900">No deals found</h2>
            <p className="text-gray-500">Try adjusting your filters.</p>
            <button 
              onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}
              className="mt-4 text-orange-600 font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}