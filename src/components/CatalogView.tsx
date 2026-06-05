'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { ArrowDownAZ, ArrowUpAZ, Sparkles, Filter, Compass, Undo2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CatalogViewProps {
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
}) => {
  const { products } = useApp();

  // Sorting state: 'default' | 'price-asc' | 'price-desc' | 'popular'
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc' | 'popular'>('default');

  const categories = ['all', "Men's Apparel", "Women's Apparel", 'Accessories', 'Footwear'];

  // 1. Apply category filter
  let filtered = categoryFilter === 'all' 
    ? products 
    : products.filter((p) => p.category === categoryFilter);

  // 2. Apply search text filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // 3. Apply sorting option
  const sortedAndFiltered = [...filtered].sort((a, b) => {
    if (sortOption === 'price-asc') {
      return a.price - b.price;
    }
    if (sortOption === 'price-desc') {
      return b.price - a.price;
    }
    if (sortOption === 'popular') {
      return b.salesCount - a.salesCount;
    }
    return 0; // Default Unsorted
  });

  return (
    <div className="font-sans flex flex-col gap-8 pb-12" id="catalog-discover-view">
      
      {/* Title block */}
      <div>
        <h1 className="text-2xl md:text-3xl font-sans font-extrabold text-neutral-900 tracking-tight leading-none">
          Discover Burak Mart Collections
        </h1>
        <p className="text-neutral-500 text-xs mt-2 font-medium">
          {searchQuery ? (
            <span>Showing results for &quot;<strong className="text-neutral-800">{searchQuery}</strong>&quot; ({filtered.length} products found)</span>
          ) : (
            <span>Browse our trendy streetwear, minimal wristwatches, custom knit fabrics, and suede loafers.</span>
          )}
        </p>
      </div>

      {/* Controllers Row (Filters & Sorter) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-100 pb-5" id="catalog-controllers-row">
        
        {/* Flat Category selector list */}
        <div className="flex flex-wrap gap-2" id="department-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 border rounded-xl font-sans text-xs font-bold transition-all cursor-pointer capitalize ${
                categoryFilter === cat
                  ? 'bg-orange-600 border-orange-600 text-white shadow-xs'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-350'
              }`}
            >
              {cat === 'all' ? 'All Collections' : cat}
            </button>
          ))}
        </div>

        {/* Sort select dropdown */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0" id="catalog-sort-wrapper">
          <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> SORT BY:
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="flex-1 md:flex-initial bg-white border border-neutral-250 rounded-xl px-3.5 py-2 text-xs font-semibold text-neutral-700 cursor-pointer focus:outline-hidden"
          >
            <option value="default">Default Features</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Best Selling / Popularity</option>
          </select>
        </div>

      </div>

      {/* Grid Layout Core */}
      {sortedAndFiltered.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 border border-neutral-150/40 rounded-3xl" id="empty-catalog-fallback">
          <Compass className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-neutral-800 font-sans">No search results matching your filter</h2>
          <p className="text-neutral-500 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
            Please double-check spelling or try switching categories. You may also clear your active filters.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="bg-neutral-900 border border-neutral-900/90 hover:bg-neutral-800 text-white font-sans font-bold text-xs rounded-xl px-4 py-2 cursor-pointer"
              >
                Clear Search Phrase
              </button>
            )}
            <button
              onClick={() => {
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              className="bg-white border border-neutral-250 text-neutral-700 hover:bg-neutral-50 font-sans font-bold text-xs rounded-xl px-4 py-2 cursor-pointer flex items-center gap-1.5"
            >
              <Undo2 className="w-3.5 h-3.5 animate-pulse" /> Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="catalog-products-grid">
          {sortedAndFiltered.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

    </div>
  );
};
