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
  const touchStartX = React.useRef(0);
  const touchStartY = React.useRef(0);
  const [activeCard, setActiveCard] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);

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

  const getItemWidth = (): number => {
    if (!carouselRef.current) return 480;
    const containerWidth = carouselRef.current.clientWidth;
    if (containerWidth >= 1024) return (containerWidth - 48) / 3;
    if (containerWidth >= 640) return 264;
    return containerWidth - 32;
  };

  const updateScrollState = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const itemWidth = maxScroll <= 0 ? clientWidth : getItemWidth();
    const newIndex = Math.min(
      Math.round(scrollLeft / itemWidth),
      featuredProducts.length - 1
    );
    setActiveCard(newIndex);
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(maxScroll > 10 && scrollLeft < maxScroll - 10);
  };

  useEffect(() => {
    updateScrollState();
    const onResize = () => updateScrollState();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [featuredProducts.length, isLoaded]);

  // Auto-rotation every 5 seconds, pauses on hover
  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const interval = setInterval(() => {
      if (isHoveringCarousel || !carouselRef.current) return;
      const itemWidth = getItemWidth();
      const currentIndex = Math.round(carouselRef.current.scrollLeft / itemWidth);
      if (currentIndex >= featuredProducts.length - 1) {
        carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredProducts.length, isHoveringCarousel]);

  const handleScroll = () => {
    requestAnimationFrame(updateScrollState);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const distance = getItemWidth();
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  const scrollToItem = (index: number) => {
    if (!carouselRef.current) return;
    const itemWidth = getItemWidth();
    carouselRef.current.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth',
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) scrollCarousel('left');
    else scrollCarousel('right');
  };

  const handleCategoryClick = (category: string) => {
    setCategoryFilter(category);
    setView('catalog');
  };

  return (
    <div className="font-body bg-bg-light min-h-screen pb-8" id="store-front-home">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6">
        
        {/* 1. EDITORIAL HERO BANNER - Modern Redesign (xl:col-span-12) */}
        <section className="xl:col-span-12 relative rounded-[2.5rem] p-8 md:p-16 bg-navy shadow-2xl overflow-hidden flex items-center min-h-[500px]" id="editorial-hero">
            <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex-1 text-left flex flex-col gap-6"
                >
                    <CompactTrustBadgeBar />
                    <h1 className="text-5xl md:text-8xl font-display text-white leading-[0.85] tracking-tight uppercase">
                        Fresh Trends,<br /><span className="text-accent-yellow">Delivered.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-lg font-body font-medium opacity-80">
                        Discover our latest apparel, accessories, and footwear. High-quality items designed to elevate your everyday look.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            className="sm:w-auto px-12 py-6 font-display text-lg tracking-widest"
                            onClick={() => { setCategoryFilter('all'); setView('catalog'); }}
                            icon={<ArrowRight className="w-5 h-5" />}
                        >
                            EXPLORE NOW
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            fullWidth
                            className="sm:w-auto px-12 py-6 border-white/20 text-white hover:bg-white/10 font-display text-lg tracking-widest"
                            onClick={() => { setCategoryFilter('all'); setView('catalog'); }}
                        >
                            BROWSE COLLECTION
                        </Button>
                    </div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full lg:w-1/2 h-[350px] md:h-[500px] relative rounded-[2rem] overflow-hidden shadow-2xl skew-y-1 lg:-rotate-2 hover:rotate-0 transition-transform duration-700"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent"></div>
                </motion.div>
            </div>
        </section>


        {/* 1.5 JUST FOR YOU - Bento Style (xl:col-span-4) */}
        {favorites.length > 0 && (
          <section className="xl:col-span-4 bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-xs flex flex-col gap-6" id="just-for-you">
            <h3 className="text-2xl font-display font-bold text-navy uppercase tracking-tight">Just For You</h3>
            <div className="flex flex-col gap-4">
              {products.filter(p => favorites.includes(p.id)).slice(0, 3).map(prod => (
                <div key={prod.id} className="flex gap-4 items-center group cursor-pointer" onClick={() => { setSelectedProductId(prod.id); setView('product'); }}>
                  <LazyImage 
                    src={prod.image} 
                    alt={prod.name} 
                    fill 
                    referrerPolicy="no-referrer" 
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    wrapperClassName="w-20 h-20 rounded-2xl overflow-hidden bg-bg-light border border-neutral-50"
                  />
                  <div className="flex-1">
                    <strong className="block text-sm font-display font-bold text-navy group-hover:text-accent-yellow transition-colors uppercase tracking-wide">{prod.name}</strong>
                    <span className="text-xs font-mono font-bold text-neutral-400 mt-1 block uppercase tracking-widest">${prod.price}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-200 group-hover:text-accent-yellow group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. PROMOTIONAL BOX - Bento Style (xl:col-span-4) */}
        <section className="xl:col-span-4 bg-navy rounded-[2rem] p-8 border border-white/10 flex flex-col gap-4 shadow-xl relative overflow-hidden group" id="trust-campaign-panel">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-24 h-24 text-accent-yellow" />
            </div>
            <span className="inline-flex items-center gap-1.5 text-accent-yellow bg-white/5 text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-accent-yellow/20 self-start">
                <Sparkles className="w-4 h-4" /> Limited Benefit
            </span>
            <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tight leading-tight mt-2">
                Unlock 10%<br /><span className="text-accent-yellow">Off Extra</span>
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed font-body font-medium">
                Apply code <strong className="font-mono text-accent-yellow bg-white/5 px-2 py-0.5 rounded shadow-inner">BURAK10</strong> at checkout for bonus savings.
            </p>
            <Button
              variant="primary"
              size="md"
              fullWidth
              className="mt-4 font-display tracking-widest text-sm py-4"
              onClick={() => { setCategoryFilter('all'); setView('catalog'); }}
            >
                SHOP TRENDS NOW
            </Button>
        </section>

        {/* 3. CURATED COLLECTIONS - Modern Bento Grid Layout */}
        <section className="xl:col-span-12 py-10" id="curated-collections">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-2">
            <div>
              <h2 className="text-4xl md:text-5xl font-display text-neutral-900 tracking-tight uppercase">Curated Collections</h2>
              <p className="text-neutral-500 mt-2 font-body font-medium">Select visual departments to start catalog filtering</p>
            </div>
            <button 
              onClick={() => { setCategoryFilter('all'); setView('catalog'); }}
              className="text-accent-yellow font-bold uppercase tracking-wider text-sm hover-underline"
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
                className={`group relative ${cluster.span} ${cluster.height} rounded-[2rem] overflow-hidden bg-neutral-900 cursor-pointer shadow-sm shadow-black/5 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 ease-out`}
              >
                <LazyImage 
                  src={cluster.bg} 
                  alt={cluster.title} 
                  fill 
                  referrerPolicy="no-referrer" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 duration-300 ease-out transition-all opacity-70 will-change-transform" 
                  wrapperClassName="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end items-start">
                  <div className="relative z-10 w-full">
                    <span className="block text-[10px] md:text-xs font-mono font-bold tracking-[0.3em] text-accent-yellow uppercase mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      {cluster.count} Products Available
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-white leading-[0.9] mb-6 group-hover:text-accent-yellow transition-colors duration-300 uppercase tracking-tight">
                      {cluster.title}
                    </h3>
                    <div className="inline-flex items-center gap-3 bg-accent-yellow text-navy px-8 py-3.5 rounded-2xl text-[10px] font-display font-bold uppercase tracking-[0.2em] opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#FFC700] hover:-translate-y-1 hover:shadow-2xl active:bg-[#FFB800] active:scale-95 shadow-xl">
                      Explore Collection <ArrowRight className="w-4 h-4" />
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
        <section className="xl:col-span-12 py-16" id="trending-products-section">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 px-2 gap-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-display text-navy tracking-tight uppercase leading-[0.9]">Trending <span className="text-accent-yellow">Specials</span></h2>
                <p className="text-neutral-500 mt-4 font-body font-medium text-base max-w-lg opacity-70 italic border-l-2 border-accent-yellow pl-4">Hand-selected trending items currently high in user demand based on real-time sales data.</p>
              </div>
              <button 
                onClick={() => setView('catalog')}
                className="flex items-center gap-3 text-navy font-display font-bold text-sm group uppercase tracking-[0.2em] bg-bg-light px-8 py-4 rounded-2xl border border-neutral-100 shadow-xs hover-lift"
              >
                Full Catalog
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-accent-yellow" />
              </button>
            </div>

            <div className="relative">
              {/* Navigation Arrows (Desktop) */}
              <button
                onClick={() => scrollCarousel('left')}
                disabled={!canScrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-12 h-12 bg-accent-yellow text-navy shadow-lg rounded-full flex items-center justify-center transition-all duration-200 ease-out hover:bg-[#FFC700] hover:scale-110 hover:shadow-xl active:bg-[#FFB800] active:scale-95 disabled:opacity-0 disabled:pointer-events-none hidden lg:flex"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => scrollCarousel('right')}
                disabled={!canScrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-12 h-12 bg-accent-yellow text-navy shadow-lg rounded-full flex items-center justify-center transition-all duration-200 ease-out hover:bg-[#FFC700] hover:scale-110 hover:shadow-xl active:bg-[#FFB800] active:scale-95 disabled:opacity-0 disabled:pointer-events-none hidden lg:flex"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
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
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setIsHoveringCarousel(true)}
                onMouseLeave={() => setIsHoveringCarousel(false)}
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-10 pt-4 px-2"
                style={{ scrollBehavior: 'smooth', willChange: 'scroll-position' }}
              >
                {!isLoaded ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="min-w-[85vw] sm:min-w-[320px] lg:min-w-[calc(25%-18px)] snap-start shrink-0">
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
                      className="w-[calc(100vw-2rem)] sm:w-[240px] lg:w-[calc(33.333%-16px)] snap-start shrink-0"
                    >
                      <ProductCard product={prod} />
                    </motion.div>
                  ))
                )}
              </div>

              {/* Status & Dots */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  {featuredProducts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToItem(i)}
                      className={`rounded-full transition-all duration-200 ease-out cursor-pointer ${
                        activeCard === i
                          ? 'w-3 h-3 bg-accent-yellow shadow-md shadow-accent-yellow/30 scale-[1.3]'
                          : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400 hover:scale-[1.2]'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
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
