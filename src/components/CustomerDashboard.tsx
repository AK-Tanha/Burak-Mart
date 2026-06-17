'use client';
import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, ShoppingBag, Package, User } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { orders, setPortal } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <button onClick={() => setPortal('store')} className="text-sm font-bold text-accent-yellow">Back to Store</button>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200">
               <h3 className="font-bold text-slate-500 uppercase tracking-wider text-xs">Total Orders</h3>
               <p className="text-3xl font-extrabold mt-2">{orders.length}</p>
           </div>
        </div>
      </div>
    </div>
  );
};
