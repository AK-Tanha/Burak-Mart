'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, Coupon } from '../types';
import { 
  DollarSign, ShoppingCart, Percent, AlertTriangle, 
  Trash2, Edit, Plus, CheckCircle, Package, ArrowRight,
  User, Calendar, ShieldCheck, KeyRound, Ban, ArrowDown, HelpCircle 
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    orders, 
    coupons, 
    adminPasswordVerified, 
    setAdminPasswordVerified,
    addProduct, 
    updateProduct, 
    deleteProduct,
    updateOrderStatus, 
    addCoupon, 
    deleteCoupon 
  } = useApp();

  // Authentication Pin state
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Sub-View
  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'orders' | 'coupons'>('overview');

  // Product Editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New product form inputs
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('29.00');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('39.00');
  const [newProdCategory, setNewProdCategory] = useState("Men's Apparel");
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=600');
  
  // New coupon form inputs
  const [newCode, setNewCode] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [newValue, setNewValue] = useState('15');
  const [newMinSpend, setNewMinSpend] = useState('0');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Default password is "burak"
    if (passwordInput.trim() === 'burak') {
      setAdminPasswordVerified(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect Password! Type "burak" to authorize secure access.');
    }
  };

  // Skip Login helper for easy developer reviews
  const handleSkipLogin = () => {
    setAdminPasswordVerified(true);
  };

  // Metrics calculators
  const completedOrders = orders.filter((o) => o.status !== 'cancelled');
  const totalSales = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsSold = completedOrders.reduce(
    (sum, o) => sum + o.items.reduce((acc, item) => acc + item.quantity, 0),
    0
  );
  const avgOrderVal = completedOrders.length > 0 ? totalSales / completedOrders.length : 0;
  const lowStockItems = products.filter((p) => p.stock <= 5).length;

  // Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice || !newProdStock) return;

    addProduct({
      name: newProdName,
      price: Number(Number(newProdPrice).toFixed(2)),
      originalPrice: newProdOrigPrice ? Number(Number(newProdOrigPrice).toFixed(2)) : undefined,
      category: newProdCategory,
      stock: Number(newProdStock),
      description: newProdDesc || 'Premium, 100% authentic designer apparel.',
      image: newProdImage || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Midnight Black', 'Oatmeal', 'Sand Beige']
    });

    // Reset forms
    setNewProdName('');
    setNewProdPrice('29.00');
    setNewProdOrigPrice('39.00');
    setNewProdDesc('');
    setShowAddForm(false);
  };

  // Edit Product Stock adjustments
  const handleStockUpdate = (prod: Product, delta: number) => {
    const nextStock = Math.max(0, prod.stock + delta);
    updateProduct({ ...prod, stock: nextStock });
  };

  // Toggle coupon active state
  const handleToggleCoupon = (code: string, currentActive: boolean) => {
    const coup = coupons.find((c) => c.code === code);
    if (coup) {
      addCoupon({ ...coup, isActive: !currentActive });
    }
  };

  // Coupon submissions
  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newValue) return;

    addCoupon({
      code: newCode.trim().toUpperCase(),
      discountType: newDiscountType,
      value: Number(newValue),
      minSpend: newMinSpend ? Number(newMinSpend) : undefined,
      isActive: true
    });

    setNewCode('');
    setNewValue('15');
    setNewMinSpend('0');
  };

  // --- UNVERIFIED ACCESS SCREEN ---
  if (!adminPasswordVerified) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 font-sans flex flex-col items-center justify-center min-h-[55vh]" id="admin-auth-screen">
        <div className="w-full bg-white border border-neutral-150 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-4 shadow-xs">
              <KeyRound className="w-5.5 h-5.5" />
            </div>
            <h1 className="text-xl font-sans font-extrabold text-neutral-900 tracking-tight">
              Administration Login
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed mt-1.5 px-4">
              Enter the administration password to configure inventory stocks, track buyers transactions, and define voucher codes.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Security Password
              </label>
              <input
                type="password"
                placeholder="Type secure password (use burak)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-250 rounded-xl focus:outline-hidden focus:border-orange-500 focus:bg-white text-sm font-semibold transition-all text-center"
              />
            </div>

            {authError && (
              <p className="text-red-500 text-[11px] font-semibold text-center leading-snug">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 border border-neutral-900 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Sign In to Admin
            </button>
          </form>

          <div className="h-[1px] bg-neutral-100 my-1"></div>

          {/* Quick Bypass Button */}
          <button 
            onClick={handleSkipLogin}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center justify-center gap-1.5 py-1 select-none cursor-pointer"
          >
            <span>Bypass Authentications (Skip for Development Check)</span>
            <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans mb-12" id="admin-workspace">
      
      {/* Header Administration */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping shrink-0" />
            <span className="font-mono text-[10px] text-orange-700 bg-orange-50 font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">
              Security Checked Mode
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-sans font-extrabold text-neutral-900 mt-1 tracking-tight">
            Burak Mart Manager Board
          </h1>
        </div>

        {/* Action button to sign out */}
        <button
          onClick={() => {
            setAdminPasswordVerified(false);
            setPasswordInput('');
          }}
          className="text-xs font-bold text-neutral-500 hover:text-red-600 bg-neutral-100 hover:bg-red-50 border border-neutral-200 hover:border-red-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          Sign Out Manager Mode
        </button>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="flex border-b border-neutral-200 mb-8 overflow-x-auto gap-1" id="admin-tabs-list">
        {[
          { id: 'overview', label: 'Store Overview Metrics' },
          { id: 'products', label: 'Item Inventory catalog' },
          { id: 'orders', label: 'Buyers Order Lists' },
          { id: 'coupons', label: 'Coupon Vouchers' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-5 py-3.5 text-xs font-sans font-bold uppercase tracking-tight relative -mb-[1px] whitespace-nowrap cursor-pointer transition-colors ${
              adminTab === tab.id
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABS VIEW CONTROLLER */}

      {/* 1. OVERVIEW TRENDS TAB */}
      {adminTab === 'overview' && (
        <div className="flex flex-col gap-8" id="admin-overview-view">
          {/* KPI Display Metrics Rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="admin-kpi-row">
            {/* Sales */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 shadow-xs">
                <DollarSign className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold font-mono text-neutral-400 uppercase">Gross Sales (COD)</span>
                <span className="block text-xl font-extrabold text-neutral-900 mt-0.5">${totalSales.toFixed(2)}</span>
                <span className="block text-[9px] text-orange-600 font-semibold mt-0.5">↑ 14.5% Past month activity</span>
              </div>
            </div>

            {/* Orders */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                <ShoppingCart className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold font-mono text-neutral-400 uppercase">Total Orders placed</span>
                <span className="block text-xl font-extrabold text-neutral-905 mt-0.5">{completedOrders.length} orders</span>
                <span className="block text-[9px] text-blue-600 font-semibold mt-0.5">Ready for doorstep COD dispatch</span>
              </div>
            </div>

            {/* AOV */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
                <Package className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold font-mono text-neutral-400 uppercase">Average Ticket Code</span>
                <span className="block text-xl font-extrabold text-neutral-900 mt-0.5">${avgOrderVal.toFixed(2)}</span>
                <span className="block text-[9px] text-neutral-400 mt-1">Total items sold: {totalItemsSold}</span>
              </div>
            </div>

            {/* Low Stocks */}
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0 shadow-xs">
                <AlertTriangle className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="block text-[11px] font-bold font-mono text-neutral-400 uppercase">Low Stock triggers</span>
                <span className="block text-xl font-extrabold text-red-600 mt-0.5">{lowStockItems} items warning</span>
                <span className="block text-[9px] text-red-500 font-semibold mt-0.5">Requires urgent vendor logs</span>
              </div>
            </div>
          </div>

          {/* Bespoke Analytics Sparklines in native Vector Elements */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual Vector sales Line */}
            <div className="col-span-1 lg:col-span-8 bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs">
              <h3 className="font-sans font-bold text-neutral-800 text-sm mb-1 uppercase tracking-wide">
                Bimonthly Retail Performance
              </h3>
              <p className="text-neutral-400 text-xs mb-6">Demonstrates gross sales volume metrics.</p>

              {/* Responsive Vector element representation */}
              <div className="relative min-h-[220px] w-full" id="bespoke-svg-dashboard-element">
                <svg className="w-full h-[200px]" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                  
                  {/* Fill Area Chart */}
                  <path
                    d="M 0 180 Q 80 140 150 110 T 300 80 T 420 50 L 500 40 L 500 200 L 0 200 Z"
                    fill="url(#orange-sales-gradient)"
                    opacity="0.1"
                  />
                  
                  {/* Sales Curve Line */}
                  <path
                    d="M 0 180 Q 80 140 150 110 T 300 80 T 420 50 L 500 40"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Nodes */}
                  <circle cx="150" cy="110" r="4.5" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="300" cy="80" r="4.5" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="420" cy="50" r="4.5" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="500" cy="40" r="5.5" fill="#7c2d12" stroke="#ffffff" strokeWidth="2" />

                  {/* Definitions */}
                  <defs>
                    <linearGradient id="orange-sales-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ffedd5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* X labels list */}
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest mt-2 px-1">
                  <span>April 01</span>
                  <span>April 15</span>
                  <span>May 01</span>
                  <span>May 15</span>
                  <span>June 01</span>
                  <span>Today (Verified)</span>
                </div>
              </div>

            </div>

            {/* Quick tips logs */}
            <div className="col-span-1 lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-sans font-bold text-neutral-800 text-sm mb-4 uppercase tracking-wide">
                  Recent Activity Signals
                </h3>
                <ul className="space-y-4.5 text-xs text-neutral-600">
                  <li className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 bg-orange-500 rounded-full shrink-0 mt-1" />
                    <span>Real-time persistence enabled via secure <code className="font-mono text-neutral-800 bg-neutral-150 rounded-sm px-1 font-bold">localStorage</code> engines.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shrink-0 mt-1" />
                    <span>Multiple products require inventory restocks. Verify in Catalog sub-tab.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0 mt-1" />
                    <span>Cash on Delivery is enabled. Delivery steps simulate courier transits.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5 text-orange-855 text-orange-800 mt-6 text-xs flex gap-2">
                <ShieldCheck className="w-5 h-5 shrink-0 text-orange-600" />
                <span>
                  All database logs are currently 100% stable. No integration leaks reported.
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. INVENTORY CATALOG */}
      {adminTab === 'products' && (
        <div className="flex flex-col gap-6" id="admin-inventory-workspace">
          
          {/* Header Action section */}
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-bold text-neutral-800 text-sm uppercase tracking-wide">
              Product catalog list ({products.length} active inventory items)
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 px-3.5 py-2 rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" /> Add Product Item
            </button>
          </div>

          {/* Add Product Expandable Form */}
          {showAddForm && (
            <form onSubmit={handleAddProductSubmit} className="bg-neutral-50 rounded-2xl p-5 md:p-6 border border-neutral-200 flex flex-col gap-4 max-w-3xl">
              <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wide mb-2">
                Create New Catalog Product
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Trendy Oversized Knit Sweater"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Category Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-sans"
                  >
                    <option value="Men's Apparel">Men&apos;s Apparel</option>
                    <option value="Women's Apparel">Women&apos;s Apparel</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Offer Pricing ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdOrigPrice}
                    onChange={(e) => setNewProdOrigPrice(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Initial Stock Count</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono font-semibold"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Unsplash/Image Address Link</label>
                  <input
                    type="url"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Product Description</label>
                  <textarea
                    rows={2}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-sans"
                    placeholder="Enter complete technical specifications, fabric details, sizing info..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 hover:bg-neutral-105 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800"
                >
                  Create Product Entry
                </button>
              </div>
            </form>
          )}

          {/* Core Table Grid layout */}
          <div className="bg-white border rounded-2xl overflow-hidden shadow-xs" id="admin-inventory-table">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50/75 border-b border-neutral-100 uppercase font-mono font-bold tracking-widest text-neutral-500">
                    <th className="py-4.5 px-4.5">Product Info</th>
                    <th className="py-4.5 px-4">Category</th>
                    <th className="py-4.5 px-4">Pricing</th>
                    <th className="py-4.5 px-4">Current Stock Status</th>
                    <th className="py-4.5 px-4">Sales Vol</th>
                    <th className="py-4.5 px-4.5 text-right">Inventory Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                      {/* Name Details */}
                      <td className="py-4 px-4.5 flex items-center gap-3 md:min-w-[280px]">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded-lg border border-neutral-100"
                        />
                        <div>
                          <span className="block font-bold text-neutral-850 leading-snug">{item.name}</span>
                          <span className="block font-mono text-[9px] text-neutral-400 mt-0.5">ID: {item.id}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 font-semibold text-neutral-600">
                        {item.category}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-mono font-bold text-neutral-850">
                        ${item.price.toFixed(2)}
                        {item.originalPrice && (
                          <span className="block text-[10px] text-neutral-400 line-through font-normal">
                            ${item.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Stock level */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            item.stock <= 0 ? 'bg-red-500' : item.stock <= 5 ? 'bg-amber-500 animate-pulse' : 'bg-orange-500'
                          }`}></span>
                          <span className="font-mono font-bold text-neutral-850">
                            {item.stock} items
                          </span>
                        </div>
                      </td>

                      {/* Sol volume count */}
                      <td className="py-4 px-4 font-mono font-semibold text-neutral-500">
                        {item.salesCount} sold
                      </td>

                      {/* Restocking adjustments / Deletion */}
                      <td className="py-4 px-4.5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white shrink-0">
                            <button
                              onClick={() => handleStockUpdate(item, -5)}
                              className="px-2 py-1 text-neutral-500 hover:bg-neutral-100 font-bold"
                              title="Decrease Stock (5)"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleStockUpdate(item, 5)}
                              className="px-2 py-1 text-neutral-500 hover:bg-neutral-100 font-bold border-l border-neutral-200"
                              title="Increase Stock (5)"
                            >
                              +5
                            </button>
                          </div>

                          <button
                            onClick={() => deleteProduct(item.id)}
                            className="text-neutral-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete Product completely"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 3. BUYER ORDERS PORTFOLIOS */}
      {adminTab === 'orders' && (
        <div className="flex flex-col gap-6" id="admin-orders-workspace">
          
          <h3 className="font-sans font-bold text-neutral-800 text-sm uppercase tracking-wide">
            Manage Client Orders ({orders.length} transactions total)
          </h3>

          <div className="bg-white border rounded-2xl overflow-hidden shadow-xs" id="admin-orders-table">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50/75 border-b border-neutral-100 uppercase font-mono font-bold tracking-widest text-neutral-500">
                    <th className="py-4.5 px-4.5">Order ID & Date</th>
                    <th className="py-4.5 px-4">Client Recipient</th>
                    <th className="py-4.5 px-4">Items Summary</th>
                    <th className="py-4.5 px-4">Paid Total (COD)</th>
                    <th className="py-4.5 px-4">Tracking Code</th>
                    <th className="py-4.5 px-4">Delivery Status</th>
                    <th className="py-4.5 px-4.5 text-right font-semibold">Change State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-neutral-400">
                        No orders recorded on Burak Mart yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-50/50 transition-colors" id={`admin-ord-row-${ord.id}`}>
                        {/* ID and Date */}
                        <td className="py-4.5 px-4.5">
                          <span className="block font-bold text-neutral-900">{ord.id}</span>
                          <span className="block text-[10px] text-neutral-400 font-mono mt-0.5">
                            {new Date(ord.createdAt).toISOString().split('T')[0]}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-4.5 px-4">
                          <span className="block font-semibold text-neutral-800">{ord.shippingDetails.fullName}</span>
                          <span className="block text-[10px] text-neutral-400 font-mono">{ord.shippingDetails.phone}</span>
                        </td>

                        {/* Items */}
                        <td className="py-4.5 px-4">
                          <span className="block font-semibold text-neutral-800 truncate max-w-[150px]">
                            {ord.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                          </span>
                          <span className="block text-[10px] text-neutral-400 font-mono uppercase mt-0.5">
                            {ord.shippingMethod} delivery
                          </span>
                        </td>

                        {/* Cost */}
                        <td className="py-4.5 px-4 font-mono font-bold text-neutral-850">
                          ${ord.total.toFixed(2)}
                        </td>

                        {/* Tracking */}
                        <td className="py-4.5 px-4 font-mono text-neutral-500 font-semibold uppercase">
                          {ord.trackingNumber}
                        </td>

                        {/* Status tag */}
                        <td className="py-4.5 px-4">
                          <span className={`inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase border ${
                            ord.status === 'pending'
                              ? 'bg-amber-50 border-amber-100 text-amber-700'
                              : ord.status === 'confirmed'
                              ? 'bg-blue-50 border-blue-100 text-blue-700'
                              : ord.status === 'shipped'
                              ? 'bg-purple-50 border-purple-100 text-purple-700'
                              : ord.status === 'delivered'
                              ? 'bg-orange-50 border-orange-100 text-orange-700'
                              : 'bg-red-50 border-red-100 text-red-600'
                          }`}>
                            {ord.status}
                          </span>
                        </td>

                        {/* Actions to update */}
                        <td className="py-4.5 px-4.5 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                            className="bg-white border border-neutral-250 rounded-lg text-[10px] p-1 text-neutral-700 py-1 cursor-pointer focus:outline-hidden"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 4. COUPONS VOUCHERS MANAGER */}
      {adminTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="admin-coupons-workspace">
          
          {/* Create Coupons Form */}
          <div className="lg:col-span-5 bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs">
            <h3 className="font-sans font-bold text-neutral-800 text-xs uppercase tracking-wide mb-4 pb-1.5 border-b border-neutral-50">
              Define New Coupon Code
            </h3>

            <form onSubmit={handleAddCouponSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GETWINTER20"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold uppercase text-neutral-800 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Discount Style</label>
                  <select
                    value={newDiscountType}
                    onChange={(e) => setNewDiscountType(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Benefit Value</label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-800 focus:outline-hidden font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1">Minimum Order Value ($)</label>
                <input
                  type="number"
                  value={newMinSpend}
                  onChange={(e) => setNewMinSpend(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono"
                  placeholder="e.g. 50 (leave 0 if none)"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 border border-neutral-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-neutral-850 mt-2 cursor-pointer"
              >
                Create active coupon
              </button>
            </form>

          </div>

          {/* Active Lists */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h3 className="font-sans font-bold text-neutral-850 text-xs uppercase tracking-wide">
              Active Vouchers List ({coupons.length} codes)
            </h3>

            <div className="bg-white border rounded-2xl p-4 md:p-6 shadow-xs flex flex-col gap-4">
              {coupons.map((c) => (
                <div 
                  key={c.code} 
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-mono font-bold text-xs shrink-0">
                      %
                    </div>
                    <div>
                      <span className="font-mono font-extrabold text-neutral-900 text-sm tracking-wide">{c.code}</span>
                      <div className="text-[10px] text-neutral-400 font-sans uppercase font-semibold mt-0.5">
                        {c.discountType === 'percentage' ? `${c.value}% discount` : `$${c.value} reduction`}
                        {c.minSpend ? ` | spend limits > $${c.minSpend}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleCoupon(c.code, c.isActive)}
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 border rounded-md cursor-pointer uppercase ${
                        c.isActive
                          ? 'bg-orange-50 border-orange-100 text-orange-700'
                          : 'bg-neutral-100 border-neutral-200 text-neutral-400'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Muted'}
                    </button>
                    
                    <button
                      onClick={() => deleteCoupon(c.code)}
                      className="text-neutral-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Delete code"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
