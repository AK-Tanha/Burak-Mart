'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LayoutWrapper } from './components/LayoutWrapper';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetails } from './components/ProductDetails';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminPanel } from './components/AdminPanel';
import { CustomerDashboard } from './components/CustomerDashboard';
import { LoginView } from './components/LoginView';
import { Footer } from './components/Footer';

function AppContent() {
  const { currentView, currentPortal } = useApp();
  
  // High-capacity filtered query handlers synced across header searches and catalogs
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (currentPortal === 'admin') {
    return <AdminPanel />;
  }

  if (currentPortal === 'customer') {
    return (
      <div className="pb-20">
        <CustomerDashboard />
      </div>
    );
  }
  
  if (currentPortal === 'login') {
    return <LoginView />;
  }

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-accent-yellow/30 text-slate-800 font-sans" id="store-root-app">
        {/* Visual Navigation Bar */}
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Main Core Stage */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8 pb-20 md:pb-8" id="main-content-canvas">
          {currentView === 'home' && (
            <HomeView setCategoryFilter={setCategoryFilter} />
          )}
          
          {currentView === 'catalog' && (
            <CatalogView 
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {currentView === 'product' && (
            <ProductDetails />
          )}

          {currentView === 'cart' && (
            <CartView />
          )}

          {currentView === 'checkout' && (
            <CheckoutView />
          )}

          {currentView === 'order-tracking' && (
            <OrderTrackingView />
          )}

          {currentView === 'admin' && (
            <AdminPanel />
          )}
        </main>

        {/* Footer information section */}
        <Footer />
      </div>
    </LayoutWrapper>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
