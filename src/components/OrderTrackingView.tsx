'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { Search, ClipboardList, Clock, Truck, ShieldAlert, BadgeCheck, PhoneCall, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OrderTrackingView: React.FC = () => {
  const { 
    orders, 
    activeOrderTrackingId, 
    setActiveOrderTrackingId, 
    updateOrderStatus 
  } = useApp();

  const [searchInput, setSearchInput] = useState('');
  const [errorSearchMsg, setErrorSearchMsg] = useState('');

  // Active tracked order (either selected or defaulting to first order placed)
  const trackedOrder = orders.find(
    (o) => o.id === activeOrderTrackingId || o.trackingNumber === activeOrderTrackingId
  ) || (orders.length > 0 ? orders[0] : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorSearchMsg('');

    const query = searchInput.trim().toUpperCase();
    if (!query) return;

    const matched = orders.find((o) => o.id === query || o.trackingNumber === query);

    if (matched) {
      setActiveOrderTrackingId(matched.id);
      setSearchInput('');
    } else {
      setErrorSearchMsg(`Unable to locate Order ID or Tracking Code matching "${query}". Please check your receipt.`);
    }
  };

  // Stepper timeline definition helper
  const getStatusStepInfo = (status: OrderStatus) => {
    switch (status) {
      case 'cancelled':
        return { step: -1, label: 'Order Cancelled', color: 'bg-red-500' };
      case 'pending':
        return { step: 1, label: 'Order Placed', color: 'bg-amber-500' };
      case 'confirmed':
        return { step: 2, label: 'Order Confirmed', color: 'bg-blue-500' };
      case 'shipped':
        return { step: 3, label: 'In Transit', color: 'bg-purple-500' };
      case 'delivered':
        return { step: 4, label: 'Package Delivered', color: 'bg-orange-600' };
      default:
        return { step: 1, label: 'Order Placed', color: 'bg-neutral-500' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans" id="tracking-portal">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-2xl md:text-3xl font-sans font-extrabold text-neutral-900 tracking-tight leading-tight">
          Live Order Tracker
        </h1>
        <p className="text-neutral-500 text-xs mt-2 leading-relaxed">
          Input your custom Burak Mart Order ID (e.g. <span className="font-mono font-bold text-neutral-800">BM-84920</span> or <span className="font-mono font-bold text-neutral-800">BM-29381</span>) below to get live delivery couriers transit metrics!
        </p>

        {/* Tracking Lookup bar */}
        <form onSubmit={handleSearch} className="flex gap-2.5 mt-6 relative">
          <input
            type="text"
            placeholder="Search Order ID or Tracking Number..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 pl-11 pr-4 py-3 bg-white border border-neutral-255 border-neutral-200 rounded-xl focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-xs font-semibold"
          />
          <Search className="absolute left-4 top-3.5 w-4.5 h-4.5 text-neutral-400 pointer-events-none" />
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-sans font-bold text-xs rounded-xl px-5 transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>

        {errorSearchMsg && (
          <p className="text-red-500 text-[11px] font-medium text-left mt-2.5" id="search-tracker-error">
            {errorSearchMsg}
          </p>
        )}
      </div>

      <div className="h-[1px] bg-neutral-100 my-8"></div>

      <AnimatePresence mode="wait">
        {trackedOrder ? (
          <motion.div
            key={trackedOrder.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            id={`active-tracking-screen-${trackedOrder.id}`}
          >
            {/* Left Side: Order Status Timeline Progress */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Core Status Summary Panel */}
              <div className="bg-white border border-neutral-100 rounded-3xl p-5 md:p-7 shadow-xs">
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-50 pb-5 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">
                      Currently Tracking
                    </span>
                    <h2 className="text-lg md:text-xl font-sans font-extrabold text-neutral-900 mt-0.5">
                      Order: {trackedOrder.id}
                    </h2>
                    <span className="font-mono text-xs text-neutral-500 mt-1 block">
                      Tracking Code: {trackedOrder.trackingNumber}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400 block">
                      Shipping Speed
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold font-sans text-orange-700 bg-orange-50 border border-orange-100 rounded-md px-2.5 py-1 mt-1 uppercase">
                      <Truck className="w-3.5 h-3.5" />
                      {trackedOrder.shippingMethod === 'express' ? 'Express Courier (1-2 days)' : 'Standard Delivery (3-5 days)'}
                    </span>
                  </div>
                </div>

                {/* Vertical/Horizontal Visual Timeline Stepper */}
                <div className="relative py-4" id="timeline-stepper">
                  {/* Cancelled State Check */}
                  {trackedOrder.status === 'cancelled' ? (
                    <div className="bg-red-50 border border-red-150 p-4 rounded-xl flex items-center gap-3.5 text-red-800">
                      <ShieldAlert className="w-6 h-6 shrink-0 text-red-500" />
                      <div>
                        <span className="block text-sm font-bold">This Order has been Cancelled</span>
                        <p className="text-xs text-neutral-500 leading-relaxed mt-0.5">
                          This order was cancelled by the administration. Any dynamic stock levels have been restored. Reach customer support for questions.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Interactive Progress Line */}
                      <div className="absolute top-9 left-6 md:left-[12.5%] right-[12.5%] h-1 bg-neutral-100 hidden md:block">
                        <div 
                          className="h-full bg-orange-600 transition-all duration-500"
                          style={{
                            width: `${
                              trackedOrder.status === 'pending'
                                ? '0'
                                : trackedOrder.status === 'confirmed'
                                ? '33'
                                : trackedOrder.status === 'shipped'
                                ? '66'
                                : '100'
                            }%`
                          }}
                        ></div>
                      </div>

                      {/* Stepper Dots Row */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative text-left md:text-center">
                        {[
                          { key: 'pending', label: 'Order Placed', desc: 'Awaiting confirmation', icon: Clock },
                          { key: 'confirmed', label: 'Confirmed', desc: 'Awaiting packing', icon: BadgeCheck },
                          { key: 'shipped', label: 'In Transit', desc: 'Dispatched to courier', icon: Truck },
                          { key: 'delivered', label: 'Delivered', desc: 'Arrived at your door', icon: PhoneCall }
                        ].map((node, index) => {
                          const nodeMap = { pending: 1, confirmed: 2, shipped: 3, delivered: 4 };
                          const currentMap = nodeMap[trackedOrder!.status];
                          const stepState = nodeMap[node.key as keyof typeof nodeMap];

                          const isPast = stepState < currentMap;
                          const isActive = stepState === currentMap;
                          const isFuture = stepState > currentMap;

                          const NodeIcon = node.icon;

                          return (
                            <div key={node.key} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2.5">
                              {/* Sphere */}
                              <div 
                                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                                  isPast 
                                    ? 'bg-orange-600 border-orange-600 text-white shadow-xs' 
                                    : isActive 
                                    ? 'bg-orange-50 border-orange-600 text-orange-800 scale-110 shadow-xs' 
                                    : 'bg-white border-neutral-200 text-neutral-400'
                                }`}
                              >
                                <NodeIcon className="w-5 h-5" />
                              </div>

                              {/* Titles */}
                              <div>
                                <span className={`block text-xs font-bold ${isActive ? 'text-orange-700' : isPast ? 'text-neutral-800' : 'text-neutral-400'}`}>
                                  {node.label}
                                </span>
                                <span className="block text-[10px] text-neutral-400 mt-0.5 leading-snug">
                                  {isActive ? 'Processing now' : node.desc}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* Simulation Sandbox (Super cool and helpful for testers to verify the workflow!) */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200" id="testing-sandbox">
                <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  🛠️ Developer Testing Sandbox (Step-by-Step State Simulator)
                </span>
                <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                  Easily advance this specific order across different delivery phases to test the visual timelines responsive transitions.
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateOrderStatus(trackedOrder!.id, st)}
                      className={`px-3 py-1.5 border rounded-lg text-xs font-semibold uppercase cursor-pointer transition-colors ${
                        trackedOrder.status === st
                          ? 'bg-neutral-900 border-neutral-900 text-white'
                          : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side: Shipping address & Purchased items list */}
            <div className="lg:col-span-4 flex flex-col gap-4" id="tracking-details-column">
              {/* Delivery info */}
              <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs">
                <h3 className="font-sans font-bold text-neutral-800 text-xs uppercase tracking-wide mb-3">
                  Recipient Information
                </h3>
                
                <div className="space-y-3.5 text-xs text-neutral-600" id="recipient-details-box">
                  <div>
                    <span className="block text-[10px] text-neutral-400 font-mono font-bold uppercase">Name</span>
                    <span className="font-semibold text-neutral-800 text-sm mt-0.5 block">{trackedOrder.shippingDetails.fullName}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] text-neutral-400 font-mono font-bold uppercase">Phone Number</span>
                    <span className="font-mono text-neutral-800 text-sm mt-0.5 block font-semibold">{trackedOrder.shippingDetails.phone}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] text-neutral-400 font-mono font-bold uppercase">Email</span>
                    <span className="text-neutral-850 mt-0.5 block">{trackedOrder.shippingDetails.email}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] text-neutral-400 font-mono font-bold uppercase">Delivery Address</span>
                    <span className="text-neutral-850 leading-relaxed mt-0.5 block">
                      {trackedOrder.shippingDetails.address}, {trackedOrder.shippingDetails.city}, {trackedOrder.shippingDetails.postalCode}
                    </span>
                  </div>

                  {trackedOrder.shippingDetails.notes && (
                    <div className="bg-neutral-50 rounded-xl p-2.5 border border-neutral-100 text-neutral-500 leading-relaxed text-[11px]">
                      <strong className="text-neutral-700">Special notes:</strong> {trackedOrder.shippingDetails.notes}
                    </div>
                  )}
                </div>

              </div>

              {/* Items Summaries */}
              <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs">
                <h3 className="font-sans font-bold text-neutral-800 text-xs uppercase tracking-wide mb-3">
                  Purchased Items Receipt
                </h3>

                <div className="space-y-3.5 max-h-[220px] overflow-y-auto mb-4" id="receipt-items-list">
                  {trackedOrder.items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex items-center gap-3 text-xs text-neutral-600">
                      <div className="w-10 h-10 bg-neutral-50 border rounded-lg overflow-hidden shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block font-semibold text-neutral-800 truncate">{item.product.name}</span>
                        <span className="block text-[10px] text-neutral-400 font-mono uppercase">
                          Qty: {item.quantity} {item.selectedSize ? `| S: ${item.selectedSize}` : ''}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-neutral-800">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-[1px] bg-neutral-100 my-4" />

                {/* Subtotals listings */}
                <div className="space-y-2.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-800">${trackedOrder.subtotal.toFixed(2)}</span>
                  </div>

                  {trackedOrder.couponCode && (
                    <div className="flex justify-between text-orange-600 font-semibold">
                      <span>Discount Coupon ({trackedOrder.couponCode})</span>
                      <span>-${trackedOrder.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Expenses</span>
                    <span>{trackedOrder.shippingCost === 0 ? 'FREE' : `$${trackedOrder.shippingCost.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-50">
                    <span>Grand Total (Paid via COD)</span>
                    <span className="font-mono">${trackedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        ) : (
          <div className="text-center py-16 bg-white border rounded-3xl" id="no-tracking-records">
            <ClipboardList className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-neutral-800">No active tracking records identified</h2>
            <p className="text-neutral-500 text-xs mt-1.5 max-w-sm mx-auto">
              Please place an order in checkout first or search for a valid order reference code in the top panel.
            </p>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
