'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Truck, ShieldCheck, Search, Menu, X, Settings2, Home, Compass, Clipboard, ArrowRight, Trash2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LazyImage } from './LazyImage';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { currentView, setView, cart, setSelectedProductId, updateCartQuantity, removeFromCart } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          setIsScrolled(prev => y > 80 ? true : y < 20 ? false : prev);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(e.target as Node)) {
        setCartDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      {!isScrolled && (
      <div className="bg-neutral-950 text-neutral-200 text-xs font-sans tracking-wide border-b border-neutral-800 hidden md:block" id="top-announcement-bar">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2 py-2.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-yellow animate-pulse"></span>
            Welcome to Burak Mart! Your Trusted Trend Boutique
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-slate-400 font-mono text-[10px] md:text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-accent-yellow" /> FAST DELIVERY
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-yellow" /> CASH ON DELIVERY
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-yellow" /> 100% AUTHENTIC
            </span>
          </div>
        </div>
      </div>
      )}

      {/* Main Navigation Row */}
      <div className={`w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-shadow duration-300 h-[80px] ${isScrolled ? 'shadow-md' : 'shadow-sm'}`} id="main-nav-bar">
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
                <img src="/logo.png" alt="Burak Mart" className="h-15 w-auto md:h-12 group-hover:scale-105 transition-transform duration-150 ease-out" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }} />
            </button>
          </div>
          
          {/* Center: Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-sm relative" id="desktop-search-container">
            <input
              type="text"
              aria-label="Search products"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'catalog') setView('catalog');
              }}
              className="w-full bg-slate-100/50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-xs outline-none hover-input focus:ring-1 focus:ring-accent-yellow focus:bg-white transition-all"
            />
            <Search className="absolute left-3.5 top-2 w-4 h-4 text-slate-400" />
          </div>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1" id="desktop-nav-links">
            <button
              onClick={() => handleNavigate('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === 'home' ? 'bg-accent-yellow/10 text-accent-yellow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigate('catalog')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === 'catalog' ? 'bg-accent-yellow/10 text-accent-yellow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Catalog
            </button>
            <button
              onClick={() => handleNavigate('order-tracking')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === 'order-tracking' ? 'bg-accent-yellow/10 text-accent-yellow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Track Order
            </button>
            <button
              onClick={() => handleNavigate('admin')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                currentView === 'admin' ? 'bg-accent-yellow/10 text-accent-yellow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Admin
            </button>
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-2" id="header-action-buttons">
            <button className="p-2 text-slate-600 hover:text-accent-yellow hover:scale-110 transition-all duration-150 ease-out hidden md:block">
                <Heart className="w-5 h-5" />
            </button>
            <div className="relative" ref={cartDropdownRef}>
                <button
                    onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                    className="p-2 text-slate-600 hover:text-accent-yellow hover:scale-110 transition-all duration-150 ease-out relative"
                    id="cart-trigger-button"
                >
                    <ShoppingBag className="w-5 h-5" />
                    {cartTotalItems > 0 && (
                        <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-accent-yellow text-navy w-4 h-4 flex items-center justify-center rounded-full">
                            {cartTotalItems}
                        </span>
                    )}
                </button>
                <AnimatePresence>
                  {cartDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50"
                      id="cart-dropdown"
                    >
                      <div className="p-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                          Cart ({cartTotalItems} items)
                        </h3>
                        {cart.length === 0 ? (
                          <p className="text-sm text-slate-400 py-4 text-center">Your cart is empty</p>
                        ) : (
                          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                            {cart.slice(0, 5).map((item) => (
                              <div
                                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                                className="flex gap-3 items-center cursor-pointer hover:bg-slate-50 rounded-xl p-2 -mx-2 transition-colors"
                                onClick={() => {
                                  setSelectedProductId(item.product.id);
                                  setView('product');
                                  setCartDropdownOpen(false);
                                }}
                              >
                                <LazyImage
                                  src={item.product.image}
                                  alt={item.product.name}
                                  fill
                                  referrerPolicy="no-referrer"
                                  className="object-cover"
                                  wrapperClassName="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="block text-xs font-semibold text-slate-700 truncate">
                                    {item.product.name}
                                  </span>
                                  <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                                    {item.quantity} × ${item.product.price.toFixed(2)}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(item.product.id, item.selectedSize, item.selectedColor);
                                  }}
                                  className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            {cart.length > 5 && (
                              <p className="text-[10px] text-slate-400 text-center pt-1">
                                +{cart.length - 5} more items
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="border-t border-slate-100 p-3">
                        <button
                          onClick={() => {
                            setView('cart');
                            setCartDropdownOpen(false);
                          }}
                          className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all duration-200 uppercase tracking-wider hover-lift"
                        >
                          View Full Cart
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search bar (Visible below md) */}
      <div className="md:hidden bg-slate-100 px-4 py-2 border-b border-slate-200" id="mobile-search-bar">
        <div className="w-full relative">
          <input
            type="text"
            aria-label="Search products"
            placeholder="Search fashion, accessories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView !== 'catalog') {
                setView('catalog');
              }
            }}
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-250 rounded-full hover-input focus:outline-hidden focus:border-accent-yellow text-xs text-slate-800"
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
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden shadow-md font-sans"
            id="mobile-navigation-drawer"
          >
            <div className="px-4 py-5 flex flex-col gap-3.5 bg-slate-50">
              <button
                onClick={() => handleNavigate('home')}
                className={`p-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                  currentView === 'home' ? 'bg-accent-yellow/10 text-accent-yellow' : 'hover:bg-slate-100 text-slate-700 font-normal'
                }`}
                id="mobile-nav-home"
              >
                <Home className="w-4.5 h-4.5" /> Home
              </button>

              <button
                onClick={() => handleNavigate('catalog')}
                className={`p-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                  currentView === 'catalog' ? 'bg-accent-yellow/10 text-accent-yellow' : 'hover:bg-slate-100 text-slate-700 font-normal'
                }`}
                id="mobile-nav-catalog"
              >
                <Compass className="w-4.5 h-4.5" /> Catalog Discover
              </button>

              <button
                onClick={() => handleNavigate('order-tracking')}
                className={`p-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                  currentView === 'order-tracking' ? 'bg-accent-yellow/10 text-accent-yellow' : 'hover:bg-slate-100 text-slate-700 font-normal'
                }`}
                id="mobile-nav-tracking"
              >
                <Clipboard className="w-4.5 h-4.5" /> Track Order
              </button>

              <button
                onClick={() => handleNavigate('cart')}
                className={`p-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                  currentView === 'cart' ? 'bg-accent-yellow/10 text-accent-yellow' : 'hover:bg-slate-100 text-slate-700 font-normal'
                }`}
                id="mobile-nav-cart"
              >
                <ShoppingBag className="w-4.5 h-4.5" /> My Cart ({cartTotalItems} items)
              </button>

              <div className="h-[1px] bg-slate-200 my-1"></div>

              <button
                onClick={() => handleNavigate('admin')}
                className={`p-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-colors text-left ${
                  currentView === 'admin' ? 'bg-accent-yellow/20 text-accent-yellow font-bold' : 'hover:bg-slate-100 text-slate-700 font-normal'
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
