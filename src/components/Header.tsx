'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Truck, ShieldCheck, Search, Menu, X, Settings2, Home, Compass, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { currentView, setView, cart, setSelectedProductId } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartTotalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogoClick = () => {
    setSelectedProductId(null);
    setView('home');
    setMobileMenuOpen(false);
  };

  const handleNavigate = (viewName: 'home' | 'catalog' | 'cart' | 'order-tracking' | 'admin') => {
    setSelectedProductId(null);
    setView(viewName);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full" id="site-header">
      {/* Top Banner with Store Guarantees */}
      <div className="bg-neutral-950 text-neutral-200 py-2.5 text-xs font-sans tracking-wide border-b border-neutral-800" id="top-announcement-bar">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
            Welcome to Burak Mart! Your Trusted Trend Boutique
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-slate-400 font-mono text-[10px] md:text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-orange-400" /> FAST DELIVERY
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> CASH ON DELIVERY
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> 100% AUTHENTIC
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-4" id="main-nav-bar">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 cursor-pointer group focus:outline-hidden"
            id="logo-button"
          >
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-10 h-10 group-hover:scale-105 transition-transform duration-300" id="burak-mart-logo-svg">
                {/* Double line Octagon */}
                <polygon 
                  points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" 
                  fill="none" 
                  stroke="#171717" 
                  strokeWidth="2" 
                />
                <polygon 
                  points="32,8 68,8 92,32 92,68 68,92 32,92 8,68 8,32" 
                  fill="#ffffff" 
                  stroke="#171717" 
                  strokeWidth="0.75" 
                />
                
                {/* Orange slanted tag */}
                <g transform="rotate(-30 50 48)">
                  <rect 
                    x="37" 
                    y="31" 
                    width="26" 
                    height="38" 
                    rx="3.5" 
                    fill="#FF7A00" 
                  />
                  {/* Tag hole */}
                  <circle 
                    cx="50" 
                    cy="37" 
                    r="3" 
                    fill="#FFFFFF" 
                  />
                </g>
                
                {/* Black Shopping Cart, superimposed */}
                <g stroke="#171717" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" transform="translate(6, 4)">
                  {/* Handle to base */}
                  <path d="M 31,39 L 37,39 L 42,51 L 56,51 L 60,42 L 39,42" />
                  {/* Mesh/Basket lines */}
                  <path d="M 45,42 L 45,51" strokeWidth="1.2" />
                  <path d="M 49,42 L 49,51" strokeWidth="1.2" />
                  <path d="M 53,42 L 53,51" strokeWidth="1.2" />
                  <path d="M 41,46 L 58,46" strokeWidth="1.2" />
                  {/* Wheels */}
                  <circle cx="43" cy="55" r="1.5" fill="#171717" stroke="none" />
                  <circle cx="55" cy="55" r="1.5" fill="#171717" stroke="none" />
                </g>
              </svg>
            </div>
            <div className="text-left">
              <span className="block font-sans font-extrabold text-neutral-900 tracking-tight text-xl leading-none">
                BURAK MART
              </span>
              <span className="block text-[10px] font-sans text-orange-600 font-bold uppercase tracking-wide mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
                Try the new best
              </span>
            </div>
          </button>

          {/* Catalog Search Bar (Always visible on Md+ screen) */}
          <div className="hidden md:flex flex-1 max-w-md relative" id="desktop-search-container">
            <input
              type="text"
              placeholder="Search fashion, accessories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'catalog') {
                  setView('catalog');
                }
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all text-slate-800"
            />
            <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2 text-xs font-mono text-slate-400 hover:text-slate-700 pointer-events-auto bg-slate-100 px-1.5 py-0.5 rounded-sm"
              >
                Clear
              </button>
            )}
          </div>

          {/* Desktop Control Menus */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-sans font-medium text-slate-500" id="desktop-nav-menu">
            <button 
              onClick={() => handleNavigate('home')}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:text-orange-600 ${currentView === 'home' ? 'text-orange-600 font-semibold' : 'text-slate-500'}`}
              id="nav-home"
            >
              <Home className="w-4 h-4" /> Home
            </button>
            
            <button 
              onClick={() => handleNavigate('catalog')}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:text-orange-600 ${currentView === 'catalog' ? 'text-orange-600 font-semibold' : 'text-slate-500'}`}
              id="nav-catalog"
            >
              <Compass className="w-4 h-4" /> Discover
            </button>
 
            <button 
              onClick={() => handleNavigate('order-tracking')}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer hover:text-orange-600 ${currentView === 'order-tracking' ? 'text-orange-600 font-semibold' : 'text-slate-500'}`}
              id="nav-tracking"
            >
              <Clipboard className="w-4 h-4" /> Track Order
            </button>
          </nav>

          {/* Header Action Button Row */}
          <div className="flex items-center gap-3" id="header-action-buttons">
            {/* Quick Toggle for Admin */}
            <button
              onClick={() => handleNavigate('admin')}
              className={`flex items-center justify-center p-2.5 rounded-xl border transition-all hover:scale-102 cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-orange-50 border-orange-200 text-orange-755 text-orange-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
              }`}
              title="Admin Dashboard"
              id="admin-panel-toggle"
            >
              <Settings2 className="w-4.5 h-4.5" />
              <span className="hidden sm:inline ml-1.5 text-xs font-semibold font-mono tracking-tight">Admin</span>
            </button>
 
            {/* Shopping Cart Trigger */}
            <button
              onClick={() => handleNavigate('cart')}
              className={`relative flex items-center justify-center p-2.5 rounded-xl border transition-all hover:scale-102 cursor-pointer ${
                currentView === 'cart'
                  ? 'bg-orange-600 border-orange-600 text-white'
                  : 'bg-orange-50 border-orange-100 text-orange-800 hover:bg-orange-100/80'
              }`}
              id="cart-trigger-button"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span className="ml-1.5 hidden sm:inline text-xs font-bold">Cart</span>
              
              {cartTotalItems > 0 && (
                <span 
                  className={`absolute -top-1.5 -right-1.5 min-w-5 h-5 flex items-center justify-center text-[10px] font-sans font-bold rounded-full border shadow-sm px-1 ${
                    currentView === 'cart' 
                      ? 'bg-slate-950 border-slate-900 text-white' 
                      : 'bg-orange-600 border-white text-white'
                  }`}
                  id="cart-badge-count"
                >
                  {cartTotalItems}
                </span>
              )}
            </button>
 
            {/* Mobile Hamburger menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
              aria-label="Toggle menu"
              id="mobile-menu-trigger"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile search bar (Visible below md) */}
      <div className="md:hidden bg-slate-100 px-4 py-2 border-b border-slate-200 flex" id="mobile-search-bar">
        <div className="w-full relative">
          <input
            type="text"
            placeholder="Search fashion, accessories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView !== 'catalog') {
                setView('catalog');
              }
            }}
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-250 rounded-full focus:outline-hidden focus:border-orange-500 text-xs text-slate-800"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden shadow-md absolute w-full left-0 font-sans"
            id="mobile-navigation-drawer"
          >
            <div className="px-4 py-5 flex flex-col gap-3.5 bg-slate-50">
              <button
                onClick={() => handleNavigate('home')}
                className={`p-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                  currentView === 'home' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-100 text-slate-700 font-normal'
                }`}
                id="mobile-nav-home"
              >
                <Home className="w-4.5 h-4.5" /> Home
              </button>

              <button
                onClick={() => handleNavigate('catalog')}
                className={`p-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                  currentView === 'catalog' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-100 text-slate-700 font-normal'
                }`}
                id="mobile-nav-catalog"
              >
                <Compass className="w-4.5 h-4.5" /> Catalog Discover
              </button>

              <button
                onClick={() => handleNavigate('order-tracking')}
                className={`p-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                  currentView === 'order-tracking' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-100 text-slate-700 font-normal'
                }`}
                id="mobile-nav-tracking"
              >
                <Clipboard className="w-4.5 h-4.5" /> Track Order
              </button>

              <button
                onClick={() => handleNavigate('cart')}
                className={`p-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                  currentView === 'cart' ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-100 text-slate-700 font-normal'
                }`}
                id="mobile-nav-cart"
              >
                <ShoppingBag className="w-4.5 h-4.5" /> My Cart ({cartTotalItems} items)
              </button>

              <div className="h-[1px] bg-slate-200 my-1"></div>

              <button
                onClick={() => handleNavigate('admin')}
                className={`p-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                  currentView === 'admin' ? 'bg-orange-100 text-orange-800 font-bold' : 'hover:bg-slate-100 text-slate-700 font-normal'
                }`}
                id="mobile-nav-admin"
              >
                <Settings2 className="w-4.5 h-4.5" /> Store Settings (Admin Panel)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
