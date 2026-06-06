'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star, ShoppingBag, Send, ShieldAlert, BadgeCheck, Truck, RotateCcw, MessageSquarePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { LazyImage } from './LazyImage';

export const ProductDetails: React.FC = () => {
  const { 
    products, 
    selectedProductId, 
    setView, 
    setSelectedProductId, 
    addToCart, 
    addProductReview 
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId);

  // Fallback if product deleted or not found
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center font-body">
        <h2 className="text-3xl font-display font-bold text-navy uppercase tracking-tight">Product not found</h2>
        <p className="text-neutral-400 mt-4 uppercase tracking-widest text-xs font-bold">The product might have been deleted or archived.</p>
        <button
          onClick={() => setView('catalog')}
          className="mt-10 inline-flex items-center gap-3 px-8 py-3 bg-navy text-accent-yellow rounded-2xl text-xs font-display font-bold tracking-widest uppercase hover:scale-105 transition-transform shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Go back to catalog
        </button>
      </div>
    );
  }

  // Active selections state
  const [selectedSize, setSelectedSize] = useState<string>(() => 
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [selectedColor, setSelectedColor] = useState<string>(() => 
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // New review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    setIsAdding(true);
    
    setTimeout(() => {
      addToCart(product, quantity, selectedSize || undefined, selectedColor || undefined);
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 600);
  };

  const handleDirectBuy = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity, selectedSize || undefined, selectedColor || undefined);
    setView('cart');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    addProductReview(product.id, {
      userName: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment
    });

    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setReviewSuccessMsg('Thank you! Your verified customer review was added.');
    setTimeout(() => {
      setReviewSuccessMsg('');
      setShowReviewForm(false);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-body" id="product-detail-view">
      
      <Button
        variant="tertiary"
        size="md"
        onClick={() => {
          setSelectedProductId(null);
          setView('catalog');
        }}
        className="mb-8 bg-transparent hover:bg-neutral-50 !p-0 !h-auto text-neutral-500 hover:text-navy border-none group transition-all"
        icon={<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
      >
        Back to catalog
      </Button>

      {/* Main Grid Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 bg-white rounded-3xl p-4 md:p-10 border border-neutral-100 shadow-xs mb-16">
        
        {/* Left Side: Large image wrapper */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-bg-light border border-neutral-100 flex items-center justify-center shadow-inner">
            <LazyImage
              src={product.image}
              alt={product.name}
              fill
              referrerPolicy="no-referrer"
              className="object-cover object-center"
              wrapperClassName="w-full h-full"
              id="details-large-image"
            />
            {discountPercent > 0 && (
              <span className="absolute top-6 left-6 z-20 bg-warning text-white font-display font-bold text-sm tracking-widest px-4 py-1.5 rounded-xl shadow-lg uppercase">
                SAVE {discountPercent}%
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-6 right-6 z-20 bg-accent-yellow text-navy font-display font-bold text-sm tracking-widest px-4 py-1.5 rounded-xl shadow-lg uppercase">
                NEW RELEASE
              </span>
            )}
          </div>
          
          {/* Trust Value Badges Grid */}
          <div className="grid grid-cols-3 gap-4 text-center" id="trust-badge-row">
            <div className="bg-bg-light border border-neutral-100 p-4 rounded-3xl flex flex-col items-center justify-center hover:border-accent-yellow transition-colors group">
              <BadgeCheck className="w-6 h-6 text-accent-yellow mb-2 group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-display font-bold text-navy uppercase tracking-widest">100% Authentic</span>
            </div>
            <div className="bg-bg-light border border-neutral-100 p-4 rounded-3xl flex flex-col items-center justify-center hover:border-accent-yellow transition-colors group">
              <Truck className="w-6 h-6 text-accent-yellow mb-2 group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-display font-bold text-navy uppercase tracking-widest">Fast Delivery</span>
            </div>
            <div className="bg-bg-light border border-neutral-100 p-4 rounded-3xl flex flex-col items-center justify-center hover:border-accent-yellow transition-colors group">
              <RotateCcw className="w-6 h-6 text-accent-yellow mb-2 group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-display font-bold text-navy uppercase tracking-widest">Secure COD</span>
            </div>
          </div>
        </div>

        {/* Right Side: Product Customization & Checkout details */}
        <div className="col-span-1 lg:col-span-6 flex flex-col" id="details-customization-stage">
          {/* Category Tag & Rating Summary */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="font-display text-sm text-accent-yellow bg-navy font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-sm">
              {product.category}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-accent-yellow">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-navy font-display tracking-widest ml-1">
                {product.rating} ({product.reviews.length})
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-navy tracking-tight leading-[0.95] mb-4 uppercase">
            {product.name}
          </h1>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-4xl md:text-5xl font-display font-bold text-accent-yellow">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-neutral-300 font-display line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              </>
            )}
          </div>

          <div className="h-[1px] bg-neutral-100 mb-8"></div>

          {/* Product Long Description */}
          <div className="mb-8">
            <h3 className="font-display font-bold text-navy text-xs mb-3 uppercase tracking-[0.2em]">
              Product Overview
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed font-body font-medium opacity-80">
              {product.description}
            </p>
          </div>

          {/* Sizing options if applicable */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8" id="size-selectors">
              <div className="flex justify-between items-center mb-3">
                <span className="font-display font-bold text-navy text-xs uppercase tracking-[0.2em]">
                  Select Size
                </span>
                <span className="text-[10px] text-neutral-400 font-mono font-bold tracking-widest uppercase">Standard fit</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 h-12 border-2 rounded-2xl font-display text-sm font-bold flex items-center justify-center transition-all cursor-pointer uppercase ${
                      selectedSize === size
                        ? 'bg-navy border-navy text-accent-yellow shadow-lg scale-110'
                        : 'bg-white border-neutral-100 text-neutral-600 hover:border-accent-yellow hover:text-navy'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors selection if applicable */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8" id="color-selectors">
              <div className="flex justify-between items-center mb-3">
                <span className="font-display font-bold text-navy text-xs uppercase tracking-[0.2em]">
                  Select Color
                </span>
                <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-widest">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2.5 border-2 rounded-2xl font-display text-xs font-bold flex items-center gap-3 transition-all cursor-pointer uppercase tracking-widest ${
                        isSelected
                          ? 'bg-navy border-navy text-accent-yellow shadow-lg'
                          : 'bg-white border-neutral-100 text-neutral-500 hover:border-accent-yellow hover:text-navy font-medium'
                      }`}
                    >
                      {/* Generates a simple colored dot based on common names */}
                      <span
                        className="w-3 h-3 rounded-full border border-neutral-900/10 inline-block shrink-0 shadow-sm"
                        style={{
                          backgroundColor: color.toLowerCase().includes('black')
                            ? '#171717'
                            : color.toLowerCase().includes('gray') || color.toLowerCase().includes('slate')
                            ? '#737373'
                            : color.toLowerCase().includes('khaki') || color.toLowerCase().includes('beige') || color.toLowerCase().includes('sand') || color.toLowerCase().includes('oatmeal')
                            ? '#d6c0a5'
                            : color.toLowerCase().includes('green') || color.toLowerCase().includes('olive')
                            ? '#3f6212'
                            : color.toLowerCase().includes('blue') || color.toLowerCase().includes('navy')
                            ? '#1e3a8a'
                            : color.toLowerCase().includes('tan') || color.toLowerCase().includes('brown')
                            ? '#78350f'
                            : color.toLowerCase().includes('white') || color.toLowerCase().includes('cream')
                            ? '#fcfcfc'
                            : '#ec4899',
                        }}
                      ></span>
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector and Stock Check */}
          <div className="flex items-center gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <span className="font-display font-bold text-navy text-xs uppercase tracking-[0.2em]">
                Quantity
              </span>
              <div className="flex items-center border-2 border-neutral-100 rounded-2xl overflow-hidden bg-bg-light max-w-[140px] shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2.5 text-navy hover:bg-neutral-100 font-bold text-lg cursor-pointer transition-colors"
                  disabled={product.stock <= 0}
                >
                  -
                </button>
                <span className="flex-1 text-center font-display text-lg font-bold text-navy w-10">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2.5 text-navy hover:bg-neutral-100 font-bold text-lg cursor-pointer transition-colors"
                  disabled={product.stock <= 0 || quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex-1 pt-6">
              {product.stock <= 0 ? (
                <span className="inline-flex items-center gap-2 text-error font-display font-bold text-xs tracking-widest uppercase">
                  <ShieldAlert className="w-4 h-4" /> Temporarily out of stock!
                </span>
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-widest">
                    Available stock: <span className="text-accent-yellow">{product.stock} items</span>
                  </span>
                  <div className="h-2 bg-neutral-100 rounded-full w-full max-w-[200px] overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${product.stock <= 5 ? 'bg-error' : 'bg-accent-yellow'}`}
                      style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Checkout & Purchase Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto pt-8 border-t border-neutral-100">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={product.stock <= 0}
              isLoading={isAdding}
              isSuccess={isAdded}
              onClick={handleAddToCart}
              className="font-display tracking-[0.2em] shadow-lg"
              icon={<ShoppingBag className="w-5 h-5" />}
              id="details-add-to-cart-btn"
            >
                ADD TO BAG
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              disabled={product.stock <= 0}
              className="font-display tracking-[0.2em] border-2"
              onClick={handleDirectBuy}
            >
                QUICK CHECKOUT
            </Button>
          </div>

        </div>

      </div>

      {/* Review Ratings and Customer Review Center */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-neutral-100 shadow-xs mb-20" id="product-review-center">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neutral-50 pb-8 mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-navy uppercase tracking-tight">
              Customer Reviews
            </h2>
            <p className="text-neutral-400 font-body text-xs mt-1 uppercase tracking-widest font-bold">
              Verified feedback from the Burak Mart community
            </p>
          </div>

          <Button
            variant="secondary"
            size="md"
            className="font-display tracking-[0.2em] border-2"
            onClick={() => setShowReviewForm(!showReviewForm)}
            icon={<MessageSquarePlus className="w-5 h-5" />}
          >
            {showReviewForm ? 'CANCEL' : 'WRITE A REVIEW'}
          </Button>
        </div>

        {/* Create Review Form (rest of content) */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
              id="write-review-form-container"
            >
              <form onSubmit={handleReviewSubmit} className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/60 max-w-2xl mb-8">
                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wide mb-4">
                  Write Your Review
                </h3>
                
                {reviewSuccessMsg && (
                  <div className="bg-orange-50 border border-orange-200 text-orange-855 text-orange-800 text-xs px-3 py-2.5 rounded-lg mb-4">
                    {reviewSuccessMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 uppercase mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      placeholder="e.g. John Doe"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-600 uppercase mb-1">
                      Rating Star Selection
                    </label>
                    <div className="flex items-center gap-2 pt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="text-amber-400 focus:outline-hidden hover:scale-110 transition-transform"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              star <= newReviewRating ? 'fill-amber-400' : 'text-neutral-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold font-mono text-neutral-500 ml-2">
                        {newReviewRating} Star{newReviewRating > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-neutral-600 uppercase mb-1">
                    Your Feedback Comments
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="Describe product weight, sizing accuracy, delivery speed..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  variant="tertiary"
                  size="md"
                  className="bg-neutral-900 text-white"
                  icon={<Send className="w-4 h-4" />}
                >
                  Submit Verified Review
                </Button>

              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing Comments list */}
        {product.reviews.length === 0 ? (
          <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-neutral-100">
            <span className="text-sm font-semibold text-neutral-400">No reviews yet for this product.</span>
            <p className="text-neutral-400 text-xs mt-1">Be the very first buyer to review this item!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5" id="customer-reviews-stack">
            {product.reviews.map((rev) => (
              <div 
                key={rev.id} 
                className="pb-8 border-b border-neutral-100 last:border-b-0 last:pb-0"
                id={`customer-review-${rev.id}`}
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                   <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-bg-light border border-neutral-100 flex items-center justify-center text-navy font-display font-bold text-lg">
                      {rev.userName[0]}
                    </div>
                    <div>
                      <span className="font-display font-bold text-navy text-sm tracking-wide uppercase">
                        {rev.userName}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1 text-[9px] text-accent-yellow font-bold uppercase tracking-widest border border-accent-yellow/20 px-1.5 py-0.5 rounded-sm bg-accent-yellow/5">
                          <BadgeCheck className="w-3 h-3" /> Verified Buyer
                        </span>
                        <span className="font-mono text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                          {rev.date}
                        </span>
                      </div>
                    </div>
                   </div>
                </div>

                {/* Stars alignment */}
                <div className="flex items-center text-accent-yellow mb-4 ml-16">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${
                        idx < rev.rating ? 'fill-current' : 'text-neutral-100'
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm text-navy leading-relaxed font-body font-medium opacity-80 ml-16 max-w-2xl">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
