'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { ArrowDownAZ, ArrowUpAZ, Sparkles, Filter, Compass, Undo2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './Button';

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
    <div className="font-body flex flex-col gap-8 pb-12" id="catalog-discover-view">
      
      {/* Title block */}
      <div className="border-l-4 border-accent-yellow pl-6 py-2 md:mt-8">
        <h1 className="text-3xl md:text-5xl font-display text-navy tracking-tight leading-none uppercase">
          Burak Mart Collections
        </h1>
        <p className="text-neutral-500 text-xs mt-3 uppercase tracking-[0.2em] font-bold">
          {searchQuery ? (
            <span>Showing results for &quot;<strong className="text-accent-yellow">{searchQuery}</strong>&quot; ({filtered.length} products found)</span>
          ) : (
            <span>Curated apparel, accessories, and footwear for the modern era.</span>
          )}
        </p>
      </div>

      {/* Controllers Row (Filters & Sorter) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neutral-100 pb-8" id="catalog-controllers-row">
        
        {/* Flat Category selector list */}
        <div className="flex flex-wrap gap-2.5" id="department-filters">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={categoryFilter === cat ? 'primary' : 'tertiary'}
              size="sm"
              className={`rounded-xl border shadow-xs transition-all font-display tracking-widest px-6 ${categoryFilter === cat ? 'border-accent-yellow shadow-accent-yellow/10' : 'border-neutral-100 bg-white text-neutral-400 hover:text-navy hover:border-neutral-300'}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'all' ? 'ALL COLLECTIONS' : cat.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Sort select dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0" id="catalog-sort-wrapper">
          <span className="text-[10px] text-neutral-400 font-mono font-bold flex items-center gap-2 tracking-widest uppercase">
            <Filter className="w-3.5 h-3.5 text-accent-yellow" /> SORT BY:
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="flex-1 md:flex-initial bg-bg-light border border-neutral-100 rounded-xl px-5 py-2.5 text-xs font-display font-bold text-navy cursor-pointer focus:outline-hidden focus:border-accent-yellow uppercase tracking-wider shadow-inner"
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
        <div className="text-center py-32 bg-white border border-neutral-100 rounded-[2.5rem] shadow-xs" id="empty-catalog-fallback">
          <Compass className="w-16 h-16 text-neutral-200 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-navy font-display uppercase tracking-tight">No matching results found</h2>
          <p className="text-neutral-400 text-xs mt-3 max-w-sm mx-auto leading-relaxed uppercase tracking-widest font-bold">
            Please double-check spelling or try switching categories.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            {searchQuery && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setSearchQuery('')}
                className="font-display tracking-widest px-8"
              >
                CLEAR SEARCH
              </Button>
            )}
            <Button
              variant="secondary"
              size="md"
              className="border-neutral-100 text-navy font-display tracking-widest px-8"
              onClick={() => {
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              icon={<Undo2 className="w-4 h-4" />}
            >
               RESET ALL
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="catalog-products-grid">
          {sortedAndFiltered.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

    </div>
  );
};
