'use client';

import { useState } from 'react';

export default function FilterBar() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'All',
    'Electronics',
    'Home & Kitchen',
    'Fashion',
    'Beauty',
    'Toys',
    'Books',
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${
            selectedCategory === cat.toLowerCase()
              ? 'bg-white text-blue-700'
              : 'bg-blue-900 text-white hover:bg-blue-800'
          }`}
          onClick={() => setSelectedCategory(cat.toLowerCase())}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}