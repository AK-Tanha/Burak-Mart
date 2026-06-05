'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Heart, BookmarkCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  setCategoryFilter: (cat: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCategoryFilter }) => {
  const { products, setView, setSelectedProductId } = useApp();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  const handleCategoryClick = (category: string) => {
    setCategoryFilter(category);
    setView('catalog');
  };

  return (
    <div className="font-sans flex flex-col gap-12 md:gap-16 pb-12" id="store-front-home">
      
      {/* 1. EDITORIAL HERO BANNER */}
      <section className="relative w-full rounded-3xl overflow-hidden bg-neutral-900 min-h-[460px] flex items-center md:px-12 px-6 shadow-sm border border-neutral-800" id="editorial-hero">
        {/* Unsplash Editorial background image (overlayed with transparent shading blur) */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1537151608828-ea2b117b6281?w=1600&auto=format&fit=crop&q=85"
            alt="Burak Mart Editorial fashion"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-45 brightness-75 filter saturate-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/60 to-transparent"></div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 max-w-xl text-left text-white flex flex-col gap-5 py-12">
          
          <div className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-400/30 text-orange-355 text-orange-400 font-mono text-[10px] md:text-[11px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> New Season Released
          </div>

          <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-none text-neutral-50 mb-1">
            Redefining Lifestyle.
          </h1>
          <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-sans font-medium">
            Explore Burak Mart &apos;s tailored selection of trendy apparel, minimal wristwatches, waterproof leather backpacks, and Italian-stitched suede loafers. Absolute authenticity, standard & express doorstep couriers, and risk-free payments.
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => {
                setCategoryFilter('all');
                setView('catalog');
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-sans font-bold text-xs rounded-xl px-6 py-3.5 flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-97"
              id="hero-discover-btn"
            >
              <span>Discover Collection</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </button>
            
            <button
              onClick={() => {
                setCategoryFilter('all');
                setView('catalog');
              }}
              className="bg-white/10 hover:bg-white/15 text-white font-sans font-semibold text-xs border border-white/20 rounded-xl px-5 py-3.5 transition-all cursor-pointer backdrop-blur-xs"
            >
              See Trend Book
            </button>
          </div>

        </div>
      </section>

      {/* 2. CATEGORY CLUSTERS GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-0 w-full" id="category-clusters">
        <div className="flex justify-between items-end gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-sans font-extrabold text-neutral-900 tracking-tight">
              Curated Collections
            </h2>
            <p className="text-neutral-400 text-xs mt-1">Select visual departments to start catalog filtering.</p>
          </div>
          <button
            onClick={() => {
              setCategoryFilter('all');
              setView('catalog');
            }}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer font-sans"
          >
            <span>Show all collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[
            {
              id: "Men's Apparel",
              title: "Men's Apparel",
              count: products.filter((p) => p.category === "Men's Apparel").length,
              bg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80',
            },
            {
              id: "Women's Apparel",
              title: "Women's Apparel",
              count: products.filter((p) => p.category === "Women's Apparel").length,
              bg: 'https://images.unsplash.com/photo-1542272604-787c38355322?w=400&auto=format&fit=crop&q=80',
            },
            {
              id: 'Accessories',
              title: 'Smart Accessories',
              count: products.filter((p) => p.category === 'Accessories').length,
              bg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80',
            },
            {
              id: 'Footwear',
              title: 'Footwear & Shoes',
              count: products.filter((p) => p.category === 'Footwear').length,
              bg: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=80',
            },
          ].map((cluster) => (
            <div
              key={cluster.id}
              onClick={() => handleCategoryClick(cluster.id)}
              className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-150/20 cursor-pointer shadow-xs min-h-[140px] md:min-h-[180px] flex items-end p-4 md:p-5"
              id={`category-cluster-${cluster.id.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <img
                src={cluster.bg}
                alt={cluster.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-106 opacity-50 duration-500 transition-all filter saturate-[.95]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/10 to-transparent"></div>

              <div className="relative z-10 text-white">
                <span className="block text-[10px] font-mono font-bold tracking-widest text-orange-455 text-orange-400 uppercase mb-0.5">
                  {cluster.count} Products Available
                </span>
                <strong className="block text-sm md:text-base font-sans font-bold leading-tight group-hover:text-orange-300 transition-colors">
                  {cluster.title}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRENDING COLLECTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-0 w-full" id="trending-products-section">
        <div className="flex justify-between items-end gap-4 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-sans font-extrabold text-neutral-900 tracking-tight">
              Trending This Week
            </h2>
            <p className="text-neutral-400 text-xs mt-1">Specially hand-selected trending items currently high in user demand.</p>
          </div>
          <button
            onClick={() => {
              setCategoryFilter('all');
              setView('catalog');
            }}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer font-sans"
          >
            <span>Discover complete catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="trending-products-grid">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. VERIFIED TRUST CAMPAIGN BOX */}
      <section className="max-w-7xl mx-auto px-4 md:px-0 w-full" id="trust-campaign-panel">
        <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-orange-800 bg-orange-50 text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md mb-3 border border-orange-100">
              <Sparkles className="w-4 h-4 text-orange-600" /> Dynamic Welcome Benefit
            </span>
            <h3 className="text-lg md:text-xl font-sans font-extrabold text-neutral-900">
              Get an Extra 10% Discount on Checkout!
            </h3>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed font-sans">
              Apply code <strong className="font-mono text-neutral-850">BURAK10</strong> inside your shopping bag to receive 10% off of your order today. Absolute Cash on Delivery support ensures continuous visual inspectings before payout.
            </p>
          </div>

          <div className="flex gap-3 shrink-0 uppercase tracking-wide">
            <button
              onClick={() => {
                setCategoryFilter('all');
                setView('catalog');
              }}
              className="bg-neutral-900 border border-neutral-900/90 text-white font-sans font-bold text-xs rounded-xl px-5.5 py-3.5 hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Shop trends now
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
