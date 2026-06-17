'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, ShoppingCart, Info, CheckCircle2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { LazyImage } from './LazyImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quickAddStatus, setQuickAddStatus] = useState<'idle' | 'adding' | 'added'>('idle');
  const { setView, setSelectedProductId, addToCart, favorites, toggleFavorite, addToast } = useApp();
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
    addToast(`${product.name} added to cart`, 'success');
    
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
      whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs transition-all flex flex-col h-full cursor-pointer"
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

        <LazyImage
          src={product.image}
          alt={product.name}
          fill
          referrerPolicy="no-referrer"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          wrapperClassName="w-full h-full"
          id={`product-image-${product.id}`}
        />

        {/* Hot Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
          {product.isNew && (
              <motion.span
                key="new-badge"
                initial={{ rotate: 0, scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-accent-yellow text-navy font-display font-bold text-[10px] tracking-widest uppercase px-2 py-1 rounded-md shadow-xs origin-center"
              >
                NEW
              </motion.span>
            )}
            {discountPercent > 0 && (
              <motion.span
                key="discount-badge"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="bg-error text-white font-display font-bold text-[11px] tracking-wide px-2 py-1 rounded-md shadow-xs"
              >
                SAVE {discountPercent}%
              </motion.span>
            )}
        </div>

        {/* Authentic Protection Shield */}
        <div className="absolute top-3.5 right-3.5 bg-neutral-900/40 backdrop-blur-xs p-1 rounded-full text-white hover:bg-neutral-900/60 transition-colors" title="100% Authentic Product">
          <CheckCircle2 className="w-3.5 h-3.5 text-accent-yellow" />
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
          <span className="font-mono text-[10px] text-accent-yellow font-extrabold uppercase tracking-widest">
            {product.category}
          </span>
          <motion.div 
            className="flex items-center gap-0.5"
            initial="idle"
            whileHover="hover"
          >
            {[...Array(5)].map((_, i) => (
                <motion.div
                key={i}
                variants={{
                    idle: { opacity: 0, scale: 0.5 },
                    hover: { opacity: 1, scale: 1, transition: { delay: i * 0.05 } }
                }}
                >
                <Star className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-accent-yellow text-accent-yellow' : 'text-neutral-300'}`} />
                </motion.div>
            ))}
            <span className="ml-1 font-mono text-xs font-semibold text-neutral-600">{product.rating}</span>
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="font-sans font-bold text-slate-800 text-sm md:text-base leading-snug group-hover:text-accent-yellow transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Description Snippet */}
        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Pricing and Quick Add button */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3.5 border-t border-neutral-50" id={`product-actions-${product.id}`}>
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through font-medium">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-base md:text-2xl font-display font-bold text-navy tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-2 flex-1 justify-end max-w-[180px]">
             <Button
                variant="tertiary"
                size="md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
                className="hidden sm:flex"
                icon={<Info className="w-4 h-4" />}
                aria-label="Product details"
             />
             <Button
                variant="primary"
                size="md"
                className="flex-1 sm:flex-none sm:min-w-[120px]"
                disabled={product.stock <= 0}
                isLoading={quickAddStatus === 'adding'}
                isSuccess={quickAddStatus === 'added'}
                onClick={handleQuickAdd}
                icon={<ShoppingCart className="w-4 h-4" />}
             >
                {product.stock <= 0 ? 'Out' : 'Add'}
             </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
