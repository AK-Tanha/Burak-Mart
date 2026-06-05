'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { TrustBar } from './TrustBar';
import { TestimonialSection } from './TestimonialSection';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Heart, BookmarkCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  setCategoryFilter: (cat: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCategoryFilter }) => {
  const { products, setView, setSelectedProductId, favorites, isLoaded } = useApp();

  const heroImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=85",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=85"
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  const handleCategoryClick = (category: string) => {
    setCategoryFilter(category);
    setView('catalog');
  };

  return (
    <div className="font-sans px-4 py-8 md:px-12 md:py-12 bg-slate-50 min-h-screen" id="store-front-home">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
        
        {/* 1. EDITORIAL HERO BANNER - 2x2 Bento Style (xl:col-span-8, xl:row-span-2) */}
        <section className="xl:col-span-8 xl:row-span-2 relative rounded-3xl overflow-hidden bg-primary shadow-sm border border-primary/20 min-h-[400px] flex items-center" id="editorial-hero">
          <div className="flex flex-col md:flex-row items-center w-full h-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-left text-white px-8 md:px-12 py-12 md:py-16 flex flex-col gap-4"
            >
              <div className="inline-flex items-center gap-1.5 bg-accent/20 border border-accent/30 text-accent font-body text-[10px] md:text-[11px] font-bold tracking-widest px-3 py-1 rounded-full uppercase self-start">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> New Collection
              </div>
              <h1 className="text-3xl md:text-5xl font-headline font-bold tracking-wide leading-tight text-white mb-1">
                Elevate Your Style, Master Your Vibe.
              </h1>
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-body font-normal max-w-sm">
                Unmatched quality meets trend-forward design. Find your fit.
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <button
                  onClick={() => { setCategoryFilter('all'); setView('catalog'); }}
                  className="bg-accent hover:bg-yellow-300 text-primary font-body font-bold text-xs rounded-xl px-6 py-3 flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-97 uppercase tracking-wider"
                  id="hero-discover-btn"
                >
                  <span>Level Up My Style</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full h-full min-h-[250px] md:min-h-[350px] relative"
            >
              <Image
                src={heroImages[currentImageIndex]}
                alt="Burak Mart Editorial fashion"
                fill
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-transparent to-transparent"></div>
            </motion.div>
          </div>
        </section>

        <section className="xl:col-span-12">
            <TrustBar />
        </section>

        {/* 1.5 JUST FOR YOU - Bento Style (xl:col-span-4) */}
        {favorites.length > 0 && (
          <section className="xl:col-span-4 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col gap-4" id="just-for-you">
            <h3 className="text-xl font-sans font-extrabold text-neutral-900">Just For You</h3>
            <div className="flex flex-col gap-3">
              {products.filter(p => favorites.includes(p.id)).slice(0, 3).map(prod => (
                <div key={prod.id} className="flex gap-3 items-center group cursor-pointer" onClick={() => { setSelectedProductId(prod.id); setView('product'); }}>
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 relative">
                    <Image src={prod.image} alt={prod.name} fill referrerPolicy="no-referrer" className="object-cover" />
                  </div>
                  <div>
                    <strong className="block text-sm font-sans font-bold group-hover:text-orange-600 transition-colors">{prod.name}</strong>
                    <span className="text-xs text-neutral-500">${prod.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. PROMOTIONAL BOX - Bento Style (xl:col-span-4) */}
        <section className="xl:col-span-4 bg-white rounded-3xl p-8 border border-slate-200 flex flex-col gap-4 shadow-sm" id="trust-campaign-panel">
            <span className="inline-flex items-center gap-1.5 text-orange-800 bg-orange-50 text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md mb-3 border border-orange-100 self-start">
                <Sparkles className="w-4 h-4 text-orange-600" /> Limited Time
            </span>
            <h3 className="text-xl font-sans font-extrabold text-neutral-900">
                Unlock 10% Off
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                Drop Code <strong className="font-mono text-neutral-850">BURAK10</strong> inside your shopping bag for extra savings!
            </p>
            <button
              onClick={() => { setCategoryFilter('all'); setView('catalog'); }}
              className="mt-4 bg-slate-900 text-white font-sans font-bold text-xs rounded-xl px-5 py-3 hover:bg-slate-800 transition-colors cursor-pointer w-full"
            >
                Shop Now
            </button>
        </section>

        {/* 3. CATEGORY CLUSTERS - Bento Style Grid */}
        <section className="xl:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="category-clusters">
          {[
            { id: "Men's Apparel", title: "Men's Moves", count: products.filter(p => p.category === "Men's Apparel").length, bg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80' },
            { id: "Women's Apparel", title: "Women's Edge", count: products.filter(p => p.category === "Women's Apparel").length, bg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80' },
            { id: 'Accessories', title: 'Vibe Definers', count: products.filter(p => p.category === 'Accessories').length, bg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80' },
            { id: 'Footwear', title: 'Step Confident', count: products.filter(p => p.category === 'Footwear').length, bg: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=80' },
          ].map((cluster) => (
            <div
              key={cluster.id}
              onClick={() => handleCategoryClick(cluster.id)}
              className="group relative aspect-video rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-150/20 cursor-pointer shadow-sm flex items-end p-6"
            >
              <Image src={cluster.bg} alt={cluster.title} fill referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 duration-500 transition-all opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/10 to-transparent"></div>
              <div className="relative z-10 text-white">
                <span className="block text-[10px] font-mono font-bold tracking-widest text-orange-400 uppercase mb-0.5">{cluster.count} Products</span>
                <strong className="block text-md font-sans font-bold leading-tight group-hover:text-orange-300 transition-colors">{cluster.title}</strong>
              </div>
            </div>
          ))}
        </section>

        {/* 4. TRENDING PRODUCTS - Bento Style Grid */}
        <section className="xl:col-span-12" id="trending-products-section">
            <h2 className="text-2xl font-sans font-extrabold text-neutral-900 tracking-tight mb-6">Trending This Week</h2>
            <motion.div 
               variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
               }}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, amount: 0.2 }}
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="trending-products-grid">
                {!isLoaded ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <ProductCardSkeleton />
                        </motion.div>
                    ))
                ) : (
                    featuredProducts.map((prod) => (
                        <motion.div key={prod.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <ProductCard product={prod} />
                        </motion.div>
                    ))
                )}
            </motion.div>
        </section>

        <section className="xl:col-span-12">
            <TestimonialSection />
        </section>

      </div>
    </div>
  );
};
