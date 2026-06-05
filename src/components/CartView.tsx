'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Trash2, ArrowRight, Tag, HelpCircle, Truck, PackageCheck, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export const CartView: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    setView, 
    applyCoupon, 
    activeCoupon,
    setSelectedProductId 
  } = useApp();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Free shipping threshold on Standard Delivery set to $50
  const freeShippingThreshold = 50.00;
  const isFreeStandardShipping = subtotal >= freeShippingThreshold;
  const amountToFreeShipping = freeShippingThreshold - subtotal;

  let discountAmount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * activeCoupon.value) / 100;
    } else {
      discountAmount = activeCoupon.value;
    }
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;

    const res = applyCoupon(promoCodeInput);
    setPromoFeedback({ success: res.success, message: res.message });
    if (res.success) {
      setPromoCodeInput('');
    }
  };

  const handleProductNavigate = (productId: string) => {
    setSelectedProductId(productId);
    setView('product');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center font-sans" id="empty-cart-drawer">
        <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto mb-5 text-neutral-400">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-sans text-neutral-900 tracking-tight">Your shopping bag is empty</h2>
        <p className="text-neutral-500 text-xs max-w-sm mx-auto mt-2.5 leading-relaxed">
          Looks like you haven&apos;t added any items to your design bag yet. Experience fast Cash on Delivery inside!
        </p>
        <button
          onClick={() => setView('catalog')}
          className="mt-6 inline-flex items-center gap-2 cursor-pointer px-5 py-2.5 bg-orange-600 border border-orange-600 text-white hover:bg-orange-700 font-sans font-bold text-xs rounded-xl transition-all"
        >
          <Compass className="w-4 h-4" /> Start browsing products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans" id="cart-workspace">
      <h1 className="text-2xl md:text-3xl font-sans font-extrabold text-neutral-900 tracking-tight leading-tight mb-8">
        Your Shopping Bag
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Free Shipping Alert Bar */}
          <div className="bg-orange-50 border border-orange-100/70 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-orange-850">
            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-orange-600 shrink-0" />
              <span className="text-xs font-semibold leading-snug">
                {isFreeStandardShipping ? (
                  <span>Congratulations! Your order qualifies for <strong>Free Standard Delivery</strong>! ✨</span>
                ) : (
                  <span>Add <strong>${amountToFreeShipping.toFixed(2)}</strong> more to unlock <strong>Free Standard Delivery</strong>!</span>
                )}
              </span>
            </div>
            
            {!isFreeStandardShipping && (
              <div className="h-1.5 bg-neutral-200/50 rounded-full w-full sm:w-36 overflow-hidden">
                <div 
                  className="h-full bg-orange-600 rounded-full"
                  style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Cart List */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-4 md:p-6 shadow-xs flex flex-col gap-6">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex gap-4 pb-6 border-b border-neutral-100 last:border-b-0 last:pb-0"
                id={`cart-item-${item.product.id}`}
              >
                {/* Image */}
                <div 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-150 flex items-center justify-center shrink-0 cursor-pointer"
                  onClick={() => handleProductNavigate(item.product.id)}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-3">
                      <h3 
                        className="font-sans font-bold text-neutral-800 text-sm md:text-base hover:text-orange-600 transition-colors cursor-pointer line-clamp-1"
                        onClick={() => handleProductNavigate(item.product.id)}
                      >
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                        className="text-neutral-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Attributes */}
                    <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-neutral-400 mt-1 font-mono text-[10px] uppercase font-semibold">
                      <span>Category: {item.product.category}</span>
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    </div>
                  </div>

                  {/* Quantity Actions & Line Pricing */}
                  <div className="flex items-center justify-between gap-3 mt-4">
                    <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 max-w-[100px]">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        className="px-2.5 py-1 text-neutral-500 hover:bg-neutral-100 font-bold text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-mono text-xs font-bold text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        className="px-2.5 py-1 text-neutral-500 hover:bg-neutral-100 font-bold text-xs cursor-pointer"
                        disabled={item.quantity >= item.product.stock}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="block text-sm md:text-base font-sans font-extrabold text-neutral-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-neutral-400 font-mono">
                          (${item.product.price.toFixed(2)} / item)
                        </span>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Right Side: Price Details & Promotion Codes */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Promo Code Application */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs">
            <h3 className="font-sans font-bold text-neutral-800 text-xs uppercase tracking-wide mb-3">
              Apply Promo Code
            </h3>

            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. BURAK10"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                className="flex-1 pl-3.5 pr-2 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs font-mono font-semibold uppercase"
              />
              <button
                type="submit"
                className="bg-neutral-900 border border-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold px-4 cursor-pointer"
              >
                Apply
              </button>
            </form>

            {promoFeedback && (
              <p className={`text-[11px] font-medium mt-2 ${promoFeedback.success ? 'text-orange-600' : 'text-red-500'}`}>
                {promoFeedback.message}
              </p>
            )}

            {/* Hint Box with preseed coupons */}
            <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-150/50 mt-4">
              <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-orange-505 text-orange-500" /> Active Coupons For You:
              </span>
              <ul className="text-[10px] text-neutral-500 font-sans space-y-1">
                <li>• <strong className="font-mono text-neutral-800">BURAK10</strong>: 10% off entire order!</li>
                <li>• <strong className="font-mono text-neutral-800">FREESHIP</strong>: $15 off on order values check &gt; $50</li>
                <li>• <strong className="font-mono text-neutral-800">WELCOME5</strong>: Flat $5.00 off instant discount</li>
              </ul>
            </div>
          </div>

          {/* Pricing Workspace */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs" id="cart-summary-block">
            <h3 className="font-sans font-bold text-neutral-800 text-xs uppercase tracking-wide mb-4 pb-2 border-b border-neutral-50">
              Billing Summary
            </h3>

            <div className="space-y-3.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold text-neutral-800">${subtotal.toFixed(2)}</span>
              </div>

              {activeCoupon && (
                <div className="flex justify-between text-orange-700 font-semibold bg-orange-50 rounded-lg p-2 border border-orange-100/50">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Coupon: {activeCoupon.code}
                  </span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Standard Delivery Standard</span>
                <span className="text-orange-655 text-orange-600 font-semibold font-mono">
                  {isFreeStandardShipping ? 'FREE' : '$5.99'}
                </span>
              </div>

              <div className="h-[1px] bg-neutral-100 my-4"></div>

              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-neutral-800 font-sans">Estimated Total</span>
                <div className="text-right">
                  <span className="text-lg md:text-xl font-sans font-extrabold text-neutral-950">
                    ${Math.max(0, subtotal - discountAmount + (isFreeStandardShipping ? 0 : 5.99)).toFixed(2)}
                  </span>
                  <span className="block text-[9px] text-neutral-400">VAT & duties included</span>
                </div>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => setView('checkout')}
              className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-orange-600 border border-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold shadow-xs active:scale-98 transition-all cursor-pointer font-sans"
              id="proceed-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 animate-pulse" />
            </button>

            {/* Quick Guarantees Badge Group */}
            <div className="mt-5 space-y-2 pt-4 border-t border-neutral-100 text-[10px] text-neutral-500 font-mono font-semibold uppercase tracking-wider text-center" id="summary-guarantees">
              <div className="flex items-center justify-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-orange-600" />
                <span>100% Secure Checkout</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
