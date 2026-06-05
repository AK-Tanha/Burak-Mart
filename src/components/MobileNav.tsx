'use client';
import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, ShoppingBag, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { setView, setPortal } = useApp();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 z-50 pb-safe">
      <button onClick={() => { setView('home'); setPortal('store'); }} className="p-2 flex flex-col items-center">
        <Home className="w-6 h-6 text-slate-600" />
      </button>
      <button onClick={() => { setView('catalog'); setPortal('store'); }} className="p-2 flex flex-col items-center">
        <Search className="w-6 h-6 text-slate-600" />
      </button>
      <button onClick={() => { setView('cart'); setPortal('store'); }} className="p-2 flex flex-col items-center">
        <ShoppingBag className="w-6 h-6 text-slate-600" />
      </button>
      <button onClick={() => setPortal('customer')} className="p-2 flex flex-col items-center">
        <User className="w-6 h-6 text-slate-600" />
      </button>
    </nav>
  );
};
