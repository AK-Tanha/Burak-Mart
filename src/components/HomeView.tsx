'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { Button } from './Button';
import { TrustBar } from './TrustBar';
import { CompactTrustBadgeBar } from './CompactTrustBadgeBar';
import { TestimonialSection } from './TestimonialSection';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Heart, BookmarkCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyImage } from './LazyImage';

interface HomeViewProps {
  setCategoryFilter: (cat: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCategoryFilter }) => {
  const { products, setView, setSelectedProductId, favorites, isLoaded } = useApp();
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

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

  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const width = carouselRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveCard(newIndex);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const offset = direction === 'left' ? -carouselRef.current.offsetWidth : carouselRef.current.offsetWidth;
    carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const scrollToItem = (index: number) => {
    if (!carouselRef.current) return;
    const width = carouselRef.current.offsetWidth;
    carouselRef.current.scrollTo({ left: index * width, behavior: 'smooth' });
  };

  const handleCategoryClick = (category: string) => {
    setCategoryFilter(category);
    setView('catalog');
  };

  return (
    <div className="font-sans px-4 py-8 md:px-12 md:py-12 bg-slate-50 min-h-screen" id="store-front-home">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
        
        {/* 1. EDITORIAL HERO BANNER - Modern Redesign (xl:col-span-12) */}
        <section className="xl:col-span-12 relative rounded-3xl p-8 md:p-16 bg-neutral-950 shadow-xl overflow-hidden flex items-center min-h-[500px]" id="editorial-hero">
            <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-10">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex-1 text-left flex flex-col gap-6"
                >
                    <CompactTrustBadgeBar />
                    <h1 className="text-4xl md:text-6xl font-bold font-headline text-white leading-[1.1] tracking-tight">
                        Master Your Style, Elevate Your Vibe.
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-lg">
                        Unmatched quality meets trend-forward design. The finishing touches that define your unique identity.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            className="sm:w-auto px-10"
                            onClick={() => { setCategoryFilter('all'); setView('catalog'); }}
                            icon={<ArrowRight className="w-5 h-5" />}
                        >
                            Explore Now
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            fullWidth
                            className="sm:w-auto px-10 border-white/20 text-white hover:bg-white/10"
                            onClick={() => { setCategoryFilter('all'); setView('catalog'); }}
                        >
                            Browse Collections
                        </Button>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full lg:w-1/2 h-[350px] md:h-[450px] relative rounded-3xl overflow-hidden shadow-2xl"
                >
                    <LazyImage
                        src={heroImages[currentImageIndex]}
                        alt="Burak Mart Editorial fashion"
                        fill
                        referrerPolicy="no-referrer"
                        className="object-cover object-center"
                        wrapperClassName="w-full h-full"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </motion.div>
            </div>
        </section>


        {/* 1.5 JUST FOR YOU - Bento Style (xl:col-span-4) */}
        {favorites.length > 0 && (
          <section className="xl:col-span-4 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col gap-4" id="just-for-you">
            <h3 className="text-xl font-sans font-extrabold text-neutral-900">Just For You</h3>
            <div className="flex flex-col gap-3">
              {products.filter(p => favorites.includes(p.id)).slice(0, 3).map(prod => (
                <div key={prod.id} className="flex gap-3 items-center group cursor-pointer" onClick={() => { setSelectedProductId(prod.id); setView('product'); }}>
                  <LazyImage 
                    src={prod.image} 
                    alt={prod.name} 
                    fill 
                    referrerPolicy="no-referrer" 
                    className="object-cover"
                    wrapperClassName="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100"
                  />
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
            <Button
              variant="tertiary"
              size="md"
              fullWidth
              className="mt-4 bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => { setCategoryFilter('all'); setView('catalog'); }}
            >
                Shop Now
            </Button>
        </section>

        {/* 3. CURATED COLLECTIONS - Modern Bento Grid Layout */}
        <section className="xl:col-span-12 py-10" id="curated-collections">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
            <div>
              <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-neutral-900 tracking-tight">Curated Collections</h2>
              <p className="text-neutral-500 mt-2 font-medium">Select visual departments to start catalog filtering</p>
            </div>
            <button 
              onClick={() => { setCategoryFilter('all'); setView('catalog'); }}
              className="text-orange-600 font-bold hover:underline underline-offset-4 transition-all"
            >
              Show all collections
            </button>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5"
          >
            {[
              { id: "Men's Apparel", title: "Men's Moves", span: "lg:col-span-6", height: "h-[300px] md:h-[400px]", count: products.filter(p => p.category === "Men's Apparel").length, bg: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80' },
              { id: "Women's Apparel", title: "Women's Edge", span: "lg:col-span-6", height: "h-[300px] md:h-[400px]", count: products.filter(p => p.category === "Women's Apparel").length, bg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80' },
              { id: 'Accessories', title: 'Vibe Definers', span: "lg:col-span-4", height: "h-[250px] md:h-[300px]", count: products.filter(p => p.category === 'Accessories').length, bg: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80' },
              { id: 'Footwear', title: 'Step Confident', span: "lg:col-span-4", height: "h-[250px] md:h-[300px]", count: products.filter(p => p.category === 'Footwear').length, bg: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80' },
              { id: 'all', title: 'Essentials', span: "lg:col-span-4", height: "h-[250px] md:h-[300px]", count: products.length, bg: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80' },
            ].map((cluster, i) => (
              <motion.div
                key={cluster.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 30 },
                  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                }}
                onClick={() => handleCategoryClick(cluster.id)}
                className={`group relative ${cluster.span} ${cluster.height} rounded-[2rem] overflow-hidden bg-neutral-900 cursor-pointer shadow-sm shadow-black/5 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all duration-500`}
              >
                <LazyImage 
                  src={cluster.bg} 
                  alt={cluster.title} 
                  fill 
                  referrerPolicy="no-referrer" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 duration-700 transition-all opacity-70 will-change-transform" 
                  wrapperClassName="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end items-start">
                  <div className="relative z-10">
                    <span className="block text-[10px] md:text-xs font-mono font-bold tracking-[0.2em] text-orange-400 uppercase mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      {cluster.count} Products Available
                    </span>
                    <h3 className="text-2xl md:text-3xl font-sans font-extrabold text-white leading-tight mb-4 group-hover:text-accent transition-colors duration-300">
                      {cluster.title}
                    </h3>
                    <div className="flex items-center gap-2 bg-white text-neutral-900 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent">
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="xl:col-span-12">
            <TrustBar />
        </section>

        {/* 4. TRENDING PRODUCTS - Interactive Carousel Redesign */}
        <section className="xl:col-span-12 py-10" id="trending-products-section">
            <div className="flex items-end justify-between mb-8 px-2">
              <div>
                <h2 className="text-3xl font-sans font-extrabold text-neutral-900 tracking-tight underline decoration-orange-500/30 underline-offset-8">Trending This Week</h2>
                <p className="text-neutral-500 mt-3 font-medium text-sm max-w-md">Specially hand-selected trending items currently high in user demand based on real-time sales data.</p>
              </div>
              <button 
                onClick={() => setView('catalog')}
                className="hidden md:flex items-center gap-2 text-orange-600 font-bold hover:translate-x-1 transition-all text-sm group"
              >
                Discover complete catalog 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="relative group/carousel">
              {/* Navigation Arrows (Desktop) */}
              <button 
                onClick={() => scrollCarousel('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 bg-white border border-slate-200 shadow-xl rounded-full p-4 text-slate-800 opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:translate-x-0 transition-all duration-300 hidden lg:flex hover:bg-orange-600 hover:text-white cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => scrollCarousel('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 bg-white border border-slate-200 shadow-xl rounded-full p-4 text-slate-800 opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:translate-x-0 transition-all duration-300 hidden lg:flex hover:bg-orange-600 hover:text-white cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Mobile Swipe Hint */}
              <AnimatePresence>
                {showSwipeHint && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2 pointer-events-none uppercase tracking-widest"
                  >
                    <ChevronLeft className="w-3 h-3 animate-pulse" /> 
                    Swipe to explore 
                    <ChevronRight className="w-3 h-3 animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div 
                ref={carouselRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory pb-10 pt-4 px-2"
              >
                {!isLoaded ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="min-w-[85vw] sm:min-w-[320px] lg:min-w-[calc(25%-18px)] snap-start">
                      <ProductCardSkeleton />
                    </div>
                  ))
                ) : (
                  featuredProducts.map((prod, i) => (
                    <motion.div 
                      key={prod.id} 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="min-w-[85vw] sm:min-w-[320px] lg:min-w-[calc(25%-18px)] snap-start"
                    >
                      <ProductCard product={prod} />
                    </motion.div>
                  ))
                )}
              </div>

              {/* Status & Dots */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {featuredProducts.map((_, i) => {
                    // Logic to show only relevant dots if too many items
                    const isNearby = Math.abs(activeCard - i) <= 2;
                    if (!isNearby && featuredProducts.length > 10) return null;
                    
                    return (
                      <button
                        key={i}
                        onClick={() => scrollToItem(i)}
                        className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                          activeCard === i ? 'w-10 bg-orange-600 shadow-md shadow-orange-200' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    );
                  })}
                </div>
                <div className="text-[10px] font-mono font-bold text-neutral-400 tracking-tighter uppercase">
                  Showing {activeCard + 1} of {featuredProducts.length} Trending Styles
                </div>
              </div>
            </div>
        </section>

        <section className="xl:col-span-12">
            <TestimonialSection />
        </section>

      </div>
    </div>
  );
};
