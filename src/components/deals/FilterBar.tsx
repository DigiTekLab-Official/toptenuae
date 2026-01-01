// src/components/deals/FilterBar.tsx
'use client';
import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react'; // Using Lucide icons to match your hub

const categories = [
  { id: 'All', name: 'All Deals' },
  { id: 'Electronics', name: 'Electronics' },
  { id: 'Home & Kitchen', name: 'Home' },
  { id: 'Fashion', name: 'Fashion' },
  { id: 'Beauty & Personal Care', name: 'Beauty' },
  { id: 'Toys & Games', name: 'Toys' },
  { id: 'Prime Exclusive', name: 'Prime' },
];

interface FilterBarProps {
  selectedCategory: string;
  sortBy: string;
  onCategoryChange: (cat: string) => void;
  onSortChange: (sort: string) => void;
  onSearch: (query: string) => void;
}

export default function FilterBar({ 
  selectedCategory, 
  sortBy, 
  onCategoryChange, 
  onSortChange,
  onSearch 
}: FilterBarProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="lg:hidden mb-6 bg-white text-slate-700 border border-slate-300 rounded-xl px-4 py-3 flex items-center justify-center w-full font-bold shadow-sm"
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        {showMobileFilters ? 'Hide Filters' : 'Filter Deals'}
      </button>

      <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block mb-10`}>
        <div className="flex flex-col gap-6">
          
          {/* Top Row: Search & Sort */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Search Input - Hub Style */}
            <div className="relative w-full md:max-w-md">
              <label htmlFor="deals-search" className="sr-only">
                Search for products
              </label>
              <input
                id="deals-search"
                type="text"
                placeholder="Search for products..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4b0082] focus:border-transparent shadow-sm text-slate-700 placeholder:text-slate-400 transition-all"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label htmlFor="sort-select" className="sr-only">Sort deals</label>
              <span className="text-sm font-semibold text-slate-500 whitespace-nowrap hidden md:block">Sort by:</span>
              <select 
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full md:w-48 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl focus:ring-[#4b0082] focus:border-[#4b0082] block p-3 shadow-sm cursor-pointer"
              >
                <option value="latest">Newest Arrivals</option>
                <option value="discount">Highest Discount</option>
                <option value="price-low">Price: Low to High</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Categories Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 border ${
                  selectedCategory === category.id
                    ? 'bg-[#4b0082] text-white border-[#4b0082] shadow-md shadow-purple-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#4b0082] hover:text-[#4b0082]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}