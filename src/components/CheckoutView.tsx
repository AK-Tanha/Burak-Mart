'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Truck, PhoneCall, AlertCircle, ShoppingBag, ArrowLeft, Landmark } from 'lucide-react';
import { ShippingDetails } from '../types';
import { Button } from './Button';
import { FormField } from './FormField';
import { validators } from '../lib/validation';

export const CheckoutView: React.FC = () => {
  const { cart, activeCoupon, placeOrder, setView } = useApp();

  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingDetails, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ShippingDetails, boolean>>>({});
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Math totals
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      discountAmount = (subtotal * activeCoupon.value) / 100;
    } else {
      discountAmount = activeCoupon.value;
    }
  }

  const shippingCost = shippingMethod === 'express' ? 9.99 : subtotal >= 50.00 ? 0.00 : 5.99;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const validateField = useCallback((name: keyof ShippingDetails, value: string) => {
    const rules: Record<keyof ShippingDetails, (v: string) => string> = {
      fullName: validators.name,
      email: validators.email,
      phone: validators.phone,
      address: (v) => validators.text(v, 5, 200),
      city: validators.name,
      postalCode: validators.postalCode,
      notes: () => '',
    };
    return rules[name](value);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const key = name as keyof ShippingDetails;
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) {
      setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const key = name as keyof ShippingDetails;
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  };

  const isFormValid = (): boolean => {
    const fields: (keyof ShippingDetails)[] = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode'];
    const newErrors: Partial<Record<keyof ShippingDetails, string>> = {};
    let valid = true;
    for (const field of fields) {
      const err = validateField(field, formData[field] ?? '');
      if (err) { newErrors[field] = err; valid = false; }
    }
    setErrors(newErrors);
    setTouched(Object.fromEntries(fields.map((f) => [f, true])) as any);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!isFormValid()) return;
    setSubmitting(true);
    setTimeout(() => {
      const order = placeOrder(formData, shippingMethod);
      setSubmitting(false);
      if (!order) {
        setErrorMsg('Fatal checkout error. Unable to process empty carts.');
      }
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center font-sans">
        <h2 className="text-xl font-bold font-sans text-neutral-800">Your Checkout is empty</h2>
        <p className="text-neutral-500 text-xs mt-2">Add items on Burak Mart before accessing our secure checkout.</p>
        <Button
          variant="primary"
          size="md"
          className="mt-6 px-10"
          onClick={() => setView('catalog')}
        >
          Check Catalog Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans" id="checkout-workspace">
      
      {/* Return to cart button */}
      <Button
        variant="tertiary"
        size="md"
        onClick={() => setView('cart')}
        className="mb-6 bg-transparent hover:bg-neutral-50 !p-0 !h-auto text-neutral-500 hover:text-accent-yellow border-none"
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        Return to your shopping bag
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Dynamic Shipping Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white border border-neutral-100 rounded-3xl p-5 md:p-8 shadow-xs flex flex-col gap-6" id="checkout-form">
            <div>
              <h2 className="text-xl font-sans font-extrabold text-neutral-900">
                Secure Delivery Details
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Provide correct information to ensure seamless deliveries and immediate updates on your order.
              </p>
            </div>

            <div className="min-h-[48px]">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Inputs Core */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <FormField
                  label="Full Customer Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={touched.fullName ? errors.fullName : undefined}
                  placeholder="e.g. Burak Erdogan"
                  required
                />
              </div>

              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
                placeholder="e.g. email@example.com"
                required
              />

              <FormField
                label="Mobile Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={touched.phone ? errors.phone : undefined}
                placeholder="e.g. +90 555 123 4567"
                required
              />

              <div className="md:col-span-2">
                <FormField
                  label="Delivery Home Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={touched.address ? errors.address : undefined}
                  placeholder="Street name, apartment, building number..."
                  required
                />
              </div>

              <FormField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={touched.city ? errors.city : undefined}
                placeholder="e.g. Istanbul"
                required
              />

              <FormField
                label="Postal/Zip Code"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={touched.postalCode ? errors.postalCode : undefined}
                placeholder="e.g. 34367"
                required
              />

              <div className="md:col-span-2">
                <FormField
                  label="Delivery Instruction Notes (Optional)"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={touched.notes ? errors.notes : undefined}
                  placeholder="Leave with neighbor, buzzer code, call at arrival..."
                  textarea
                  rows={2}
                />
              </div>
            </div>

            <div className="h-[1px] bg-neutral-100"></div>

            {/* Delivery Shipping Method Choice */}
            <div>
              <h3 className="font-sans font-bold text-neutral-800 text-sm mb-3">
                Select Shipping Courier Level
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="shipping-method-selection">
                {/* Standard Card */}
                <button
                  type="button"
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 border rounded-2xl text-left flex gap-3 transition-colors cursor-pointer ${
                    shippingMethod === 'standard'
                      ? 'bg-accent-yellow/10 border-accent-yellow text-accent-yellow'
                      : 'bg-white border-neutral-250 text-neutral-600 hover:border-neutral-350'
                  }`}
                >
                  <Truck className="w-5 h-5 text-accent-yellow shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-tight">Standard Fast Delivery</span>
                    <span className="block text-[10px] text-neutral-400 mt-1">Delivered in 3 to 5 business days</span>
                    <span className="block text-xs font-extrabold mt-1">
                      {subtotal >= 50.00 ? 'FREE' : '$5.99'}
                    </span>
                  </div>
                </button>

                {/* Express Card */}
                <button
                  type="button"
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 border rounded-2xl text-left flex gap-3 transition-colors cursor-pointer ${
                    shippingMethod === 'express'
                      ? 'bg-accent-yellow/10 border-accent-yellow text-accent-yellow'
                      : 'bg-white border-neutral-250 text-neutral-600 hover:border-neutral-350'
                  }`}
                >
                  <Truck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-tight">Premium Express Delivery</span>
                    <span className="block text-[10px] text-neutral-400 mt-1">Priority transit in 1 to 2 business days</span>
                    <span className="block text-xs font-extrabold text-neutral-800 mt-1">$9.99</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="h-[1px] bg-neutral-100"></div>

            {/* Payment Method Details (Cash On Delivery) */}
            <div>
              <h3 className="font-sans font-bold text-neutral-800 text-sm mb-3">
                Trusted Payment Choice
              </h3>
              <div className="bg-accent-yellow/5 rounded-2xl p-4 border border-accent-yellow/20 flex gap-4 text-navy" id="payment-method-card">
                <div className="w-10 h-10 rounded-xl bg-accent-yellow flex items-center justify-center text-navy shrink-0 mt-0.5 shadow-xs">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wide">Cash on Delivery (COD)</span>
                  <p className="text-xs text-neutral-500 leading-relaxed mt-1">
                    Zero prepayment required! Inspect the package, verify authenticity, and pay standard, authentic cash exactly at your doorstep. Safe, reliable, and completely worry-free!
                  </p>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Right Side: Order Items checkout summary */}
        <div className="lg:col-span-5" id="checkout-summary-column">
          <div className="bg-white border border-neutral-150 rounded-3xl p-5 shadow-xs sticky top-28">
            <h3 className="font-sans font-extrabold text-neutral-800 text-sm mb-4 pb-2 border-b border-neutral-50 flex items-center gap-1.5 justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-normal text-neutral-400">({cart.reduce((s, c) => s + c.quantity, 0)} items)</span>
            </h3>

            {/* Mini Items Lists */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto mb-5 pr-2">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex items-center gap-3.5 text-xs text-neutral-600">
                  <div className="w-11 h-11 bg-neutral-50 border rounded-lg overflow-hidden shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-semibold text-neutral-800 truncate">{item.product.name}</span>
                    <span className="block text-[10px] text-neutral-400 font-mono uppercase mt-0.5">
                      Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-neutral-800 shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-[1px] bg-neutral-100 my-4" />

            {/* Calculations summaries */}
            <div className="space-y-3.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-neutral-800">${subtotal.toFixed(2)}</span>
              </div>

              {activeCoupon && (
                <div className="flex justify-between text-accent-yellow font-semibold bg-accent-yellow/5 border border-accent-yellow/20 rounded-lg p-2">
                  <span>Promo Coupon Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span>Shipping & Delivery Cost</span>
                  {shippingMethod === 'express' &&                   <span className="text-[10px] bg-accent-yellow/10 text-accent-yellow px-1 border border-accent-yellow/20 rounded-sm">Express</span>}
                </span>
                <span className="font-mono font-semibold text-neutral-800">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="h-[1px] bg-neutral-100 my-4"></div>

              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-neutral-800 font-sans">Final Total (COD)</span>
                <div className="text-right">
                  <span className="text-xl md:text-2xl font-sans font-extrabold text-neutral-950">
                    ${total.toFixed(2)}
                  </span>
                  <span className="block text-[9px] font-mono text-accent-yellow font-bold uppercase mt-0.5">
                    Pay Cash On Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Main Checkout Click */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="mt-6"
              onClick={handleSubmit}
              isLoading={submitting}
              icon={<CheckCircle className="w-5 h-5" />}
              id="submit-checkout-form-btn"
            >
                Confirm order on Cash on Delivery
            </Button>

            {/* Quick Guarantees Badge */}
            <div className="mt-5 pt-4.5 border-t border-neutral-100 flex items-center justify-center gap-2 text-neutral-500 text-[10px] font-mono uppercase font-semibold">
              <PhoneCall className="w-4 h-4 text-accent-yellow animate-bounce" />
              <span>Free COD doorstep inspection</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
