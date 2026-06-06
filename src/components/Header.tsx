'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Truck, ShieldCheck, Search, Menu, X, Settings2, Home, Compass, Clipboard, ArrowRight, Trash2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { currentView, setView, cart, setSelectedProductId, updateCartQuantity, removeFromCart } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <div className="bg-neutral-950 text-neutral-200 py-2.5 text-xs font-sans tracking-wide border-b border-neutral-800 hidden md:block" id="top-announcement-bar">
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
      <header className={`fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all duration-300 ${isScrolled ? 'h-[60px] shadow-md' : 'h-[80px] shadow-sm'}`} id="main-nav-bar">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-4">
          
          {/* Left: Mobile Hamburger / Desktop Logo */}
          <div className="flex items-center gap-3">
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
                id="mobile-menu-trigger"
            >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button 
                onClick={handleLogoClick}
                className="flex items-center gap-2 cursor-pointer group focus:outline-hidden"
                id="logo-button"
            >
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8 group-hover:scale-105 transition-transform duration-300">
                        {/* Simplified Logo for brevity inside Header */}
                        <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="none" stroke="#171717" strokeWidth="4" />
                    </svg>
                </div>
                <span className="hidden md:block font-display font-bold text-neutral-900 tracking-tight text-3xl mt-1">BURAK MART</span>
            </button>
          </div>
          
          {/* Center: Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-sm relative" id="desktop-search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'catalog') setView('catalog');
              }}
              className="w-full bg-slate-100/50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-all"
            />
            <Search className="absolute left-3.5 top-2 w-4 h-4 text-slate-400" />
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-2" id="header-action-buttons">
            <button className="p-2 text-slate-600 hover:text-orange-600 transition-colors hidden md:block">
                <Heart className="w-5 h-5" />
            </button>
            <div className="relative">
                <button
                    onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                    className="p-2 text-slate-600 hover:text-orange-600 transition-colors relative"
                    id="cart-trigger-button"
                >
                    <ShoppingBag className="w-5 h-5" />
                    {cartTotalItems > 0 && (
                        <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-orange-600 text-white w-4 h-4 flex items-center justify-center rounded-full">
                            {cartTotalItems}
                        </span>
                    )}
                </button>
            </div>
          </div>
        </div>
      </header>


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
