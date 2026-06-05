'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, ShoppingCart, Info, CheckCircle2, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quickAddStatus, setQuickAddStatus] = useState<'idle' | 'adding' | 'added'>('idle');
  const { setView, setSelectedProductId, addToCart, favorites, toggleFavorite } = useApp();
  const isFavorite = favorites.includes(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setView('product');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    
    // Trigger quick add state
    setQuickAddStatus('adding');

    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
    
    addToCart(product, 1, defaultSize, defaultColor);
    
    setTimeout(() => {
      setQuickAddStatus('added');
      setTimeout(() => setQuickAddStatus('idle'), 2000);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col h-full cursor-pointer"
      onClick={handleCardClick}
      id={`product-card-${product.id}`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square overflow-hidden bg-neutral-50 flex items-center justify-center">
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-colors ${
            isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/80 text-neutral-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <Image
          src={product.image}
          alt={product.name}
          fill
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          id={`product-image-${product.id}`}
        />

        {/* Hot Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
          {product.isNew && (
            <span className="bg-orange-655 bg-orange-600 text-white font-mono font-bold text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-md shadow-xs">
              NEW
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white font-mono font-bold text-[10px] tracking-wide px-2 py-0.5 rounded-md shadow-xs">
              SAVE {discountPercent}%
            </span>
          )}
        </div>

        {/* Authentic Protection Shield */}
        <div className="absolute top-3.5 right-3.5 bg-neutral-900/40 backdrop-blur-xs p-1 rounded-full text-white hover:bg-neutral-900/60 transition-colors" title="100% Authentic Product">
          <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
        </div>

        {/* Stock status banner */}
        {product.stock <= 0 ? (
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-neutral-900 text-white font-sans font-semibold text-xs tracking-wider border border-neutral-700 rounded-lg px-3.5 py-1.5 uppercase">
              Sold Out
            </span>
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute bottom-3 left-3 bg-red-50/90 backdrop-blur-xs border border-red-200 text-red-700 font-mono text-[9px] px-2 py-0.5 rounded-sm font-semibold animate-pulse">
            ONLY {product.stock} LEFT IN STOCK!
          </div>
        ) : null}
      </div>

      {/* Product Info Block */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        {/* Category & Badge Row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="font-mono text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
            {product.category}
          </span>
          <div className="flex items-center gap-1 font-mono text-xs font-semibold text-neutral-600">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-sans font-bold text-slate-800 text-sm md:text-base leading-snug group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Description Snippet */}
        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Pricing and Quick Add button */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3.5 border-t border-neutral-50">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through font-medium">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-base md:text-lg font-sans font-extrabold text-neutral-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="bg-neutral-50 hover:bg-neutral-100 text-neutral-600 p-2 rounded-lg border border-neutral-200 transition-colors"
              title="More info"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              disabled={product.stock <= 0 || quickAddStatus !== 'idle'}
              onClick={handleQuickAdd}
              className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-sans text-xs font-bold transition-all cursor-pointer ${
                product.stock <= 0
                  ? 'bg-neutral-100 border border-neutral-250 text-neutral-400 cursor-not-allowed'
                  : quickAddStatus === 'added'
                  ? 'bg-green-600 border border-green-600 text-white'
                  : 'bg-orange-600 border border-orange-600 text-white hover:bg-orange-700 active:scale-95'
              }`}
              id={`quick-add-${product.id}`}
            >
              {quickAddStatus === 'adding' ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><ShoppingCart className="w-3.5 h-3.5" /></motion.div>
              ) : quickAddStatus === 'added' ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="w-3.5 h-3.5" /></motion.div>
              ) : <ShoppingCart className="w-3.5 h-3.5" />}
              <span>{quickAddStatus === 'idle' ? 'Quick Add' : quickAddStatus === 'adding' ? 'Adding...' : 'Added'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
