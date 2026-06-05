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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center font-sans">
        <h2 className="text-xl font-bold text-neutral-800">Product not found</h2>
        <p className="text-neutral-500 mt-2">The product might have been deleted or archived.</p>
        <button
          onClick={() => setView('catalog')}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700"
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
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans" id="product-detail-view">
      
      <Button
        variant="tertiary"
        size="md"
        onClick={() => {
          setSelectedProductId(null);
          setView('catalog');
        }}
        className="mb-6 bg-transparent hover:bg-neutral-50 !p-0 !h-auto text-neutral-500 hover:text-orange-600 border-none group"
        icon={<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
      >
        Back to catalog products
      </Button>

      {/* Main Grid Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 bg-white rounded-3xl p-4 md:p-8 border border-neutral-100 shadow-xs mb-12">
        
        {/* Left Side: Large image wrapper */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-100 flex items-center justify-center">
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
              <span className="absolute top-4 left-4 z-20 bg-red-500 text-white font-mono font-bold text-xs tracking-wide px-3 py-1 rounded-lg">
                SAVE {discountPercent}%
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-4 right-4 z-20 bg-orange-600 text-white font-mono font-bold text-[10px] tracking-widest px-3 py-1 rounded-lg">
                NEW RELEASE
              </span>
            )}
          </div>
          
          {/* Trust Value Badges Grid */}
          <div className="grid grid-cols-3 gap-3 text-center" id="trust-badge-row">
            <div className="bg-neutral-50 border border-neutral-100/70 rounded-xl p-3 flex flex-col items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-orange-600 mb-1" />
              <span className="block text-[11px] font-bold text-slate-800 uppercase tracking-tight">100% Authentic</span>
              <span className="block text-[9px] text-neutral-400">Direct importer</span>
            </div>
            <div className="bg-neutral-50 border border-neutral-100/70 rounded-xl p-3 flex flex-col items-center justify-center">
              <Truck className="w-5 h-5 text-orange-600 mb-1" />
              <span className="block text-[11px] font-bold text-slate-800 uppercase tracking-tight">Fast Delivery</span>
              <span className="block text-[9px] text-neutral-400">Standard & Express</span>
            </div>
            <div className="bg-neutral-50 border border-neutral-100/70 rounded-xl p-3 flex flex-col items-center justify-center">
              <RotateCcw className="w-5 h-5 text-orange-600 mb-1" />
              <span className="block text-[11px] font-bold text-slate-800 uppercase tracking-tight">Secure COD</span>
              <span className="block text-[9px] text-neutral-400">Pay on delivery</span>
            </div>
          </div>
        </div>

        {/* Right Side: Product Customization & Checkout details */}
        <div className="col-span-1 lg:col-span-6 flex flex-col" id="details-customization-stage">
          {/* Category Tag & Rating Summary */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="font-mono text-xs text-orange-700 bg-orange-50 border border-orange-100 font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-neutral-700 ml-1">
                {product.rating} ({product.reviews.length} reviews)
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h1 className="text-2xl md:text-3xl font-sans font-extrabold text-neutral-900 tracking-tight leading-tight mb-2">
            {product.name}
          </h1>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3.5 mb-6">
            <span className="text-2xl md:text-3xl font-sans font-extrabold text-neutral-950">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm md:text-base text-neutral-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="text-xs font-mono font-bold text-red-600 bg-red-50 border border-red-100 rounded-sm px-1.5 py-0.5">
                  -{discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <div className="h-[1px] bg-neutral-100 mb-5"></div>

          {/* Product Long Description */}
          <div className="mb-6">
            <h3 className="font-sans font-bold text-neutral-800 text-sm mb-2 uppercase tracking-wide">
              Product Overview
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Sizing options if applicable */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-5" id="size-selectors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans font-bold text-neutral-800 text-xs uppercase tracking-wide">
                  Select Size
                </span>
                <span className="text-xs text-neutral-400 font-mono">Standard fit sizes</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-11 h-11 border rounded-lg font-sans text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                      selectedSize === size
                        ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
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
            <div className="mb-6" id="color-selectors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans font-bold text-neutral-800 text-xs uppercase tracking-wide">
                  Select Color
                </span>
                <span className="text-xs text-neutral-500 font-mono">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-2 border rounded-lg font-sans text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-orange-50 border-orange-600 text-orange-800'
                          : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-450'
                      }`}
                    >
                      {/* Generates a simple colored dot based on common names */}
                      <span
                        className="w-3 h-3 rounded-full border border-neutral-900/10 inline-block shrink-0"
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
          <div className="flex items-center gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <span className="font-sans font-bold text-neutral-800 text-xs uppercase tracking-wide">
                Quantity
              </span>
              <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 max-w-[120px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-neutral-500 hover:bg-neutral-100 font-bold text-sm cursor-pointer"
                  disabled={product.stock <= 0}
                >
                  -
                </button>
                <span className="flex-1 text-center font-mono text-sm font-bold text-neutral-800 w-8">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-neutral-500 hover:bg-neutral-100 font-bold text-sm cursor-pointer"
                  disabled={product.stock <= 0 || quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex-1 pt-4.5">
              {product.stock <= 0 ? (
                <span className="inline-flex items-center gap-1 text-red-600 font-sans font-medium text-xs">
                  <ShieldAlert className="w-4 h-4" /> Temporarily out of stock!
                </span>
              ) : (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-neutral-500 font-sans">
                    Availability: <span className="font-semibold text-orange-600">{product.stock} items ready</span>
                  </span>
                  <div className="h-1.5 bg-neutral-100 rounded-full w-40 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${product.stock <= 5 ? 'bg-red-500' : 'bg-orange-500'}`}
                      style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Checkout & Purchase Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-auto pt-6 border-t border-neutral-100">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={product.stock <= 0}
              isLoading={isAdding}
              isSuccess={isAdded}
              onClick={handleAddToCart}
              icon={<ShoppingBag className="w-5 h-5" />}
              id="details-add-to-cart-btn"
            >
                Add to Shopping Bag
            </Button>
            <Button
              variant="tertiary"
              size="lg"
              fullWidth
              disabled={product.stock <= 0}
              className="bg-neutral-900 text-white hover:bg-neutral-800"
              onClick={handleDirectBuy}
            >
                View Bag & Checkout
            </Button>
          </div>

        </div>

      </div>

      {/* Review Ratings and Customer Review Center */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-xs" id="product-review-center">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-55 pb-6 mb-6">
          <div>
            <h2 className="text-xl font-sans font-extrabold text-neutral-900">
              Verified Customer Reviews
            </h2>
            <p className="text-neutral-400 text-xs mt-1">
              Feedback gathered from buyers who purchased this item on Burak Mart.
            </p>
          </div>

          <Button
            variant="tertiary"
            size="md"
            className="text-orange-700 bg-orange-50 border border-orange-100"
            onClick={() => setShowReviewForm(!showReviewForm)}
            icon={<MessageSquarePlus className="w-4 h-4" />}
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </Button>
        </div>

        {/* Create Review Expandable Form */}
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
                className="pb-5 border-b border-neutral-100 last:border-b-0 last:pb-0"
                id={`customer-review-${rev.id}`}
              >
                <div className="flex justify-between items-start gap-4 mb-1.5">
                  <div>
                    <span className="font-sans font-bold text-neutral-800 text-sm">
                      {rev.userName}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 font-bold rounded-sm px-1.5 py-0.5 ml-2.5 uppercase tracking-wide">
                      Verified Buyer
                    </span>
                  </div>
                  <span className="font-mono text-xs text-neutral-400">
                    {rev.date}
                  </span>
                </div>

                {/* Stars alignment */}
                <div className="flex items-center text-amber-400 mb-2">
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
                <p className="text-sm text-neutral-600 leading-relaxed font-sans">
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
