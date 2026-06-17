'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Truck, CheckSquare, Smile, PhoneCall } from 'lucide-react';
import { motion } from 'motion/react';

export const Footer: React.FC = () => {
  const { setView } = useApp();

  return (
    <footer className="bg-neutral-900 text-neutral-400 font-sans mt-auto border-t border-neutral-850" id="site-footer">
      
      {/* Guarantees Highlight Row */}
      {/* <div className="bg-neutral-950 border-b border-neutral-850" id="footer-highlights">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-center text-xs">
          
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-500 mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <strong className="text-neutral-100 uppercase tracking-tight text-[11px]">Free Standard Delivery</strong>
            <span className="text-neutral-400 text-[10px] mt-1">On all orders exceeding $50.00</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-500 mb-3">
              <PhoneCall className="w-5 h-5" />
            </div>
            <strong className="text-neutral-100 uppercase tracking-tight text-[11px]">Cash On Delivery</strong>
            <span className="text-neutral-400 text-[10px] mt-1">Standard doorstep visual package inspection</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-500 mb-3">
              <CheckSquare className="w-5 h-5" />
            </div>
            <strong className="text-neutral-100 uppercase tracking-tight text-[11px]">100% Authentic Guarantees</strong>
            <span className="text-neutral-400 text-[10px] mt-1">Sourced directly from verified premium agencies</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-500 mb-3">
              <Smile className="w-5 h-5" />
            </div>
            <strong className="text-neutral-100 uppercase tracking-tight text-[11px]">Helpful Support Services</strong>
            <span className="text-neutral-400 text-[10px] mt-1">Continuous assistances via email & phone call</span>
          </div>

        </div>
      </div> */}

      {/* Main Footer Block */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12" id="footer-main-grid">
        
        {/* About column */}
        <div className="md:col-span-5 flex flex-col">
          <img src="/footer.png" alt="Burak Mart" className="w-full max-w-sm md:max-w-md self-start m-0 p-0" />
          <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-sm mt-4">
            Trendy designs, accessories, apparel, and premium footwear. Rest assured taking advantage of secure Cash on Delivery, and inspect packages straight at your doorstep. We stand by our 100% authenticity guarantee!
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3">
          <h4 className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-wider mb-4">
            Catalog Collections
          </h4>
          <ul className="text-xs text-neutral-400 space-y-2.5">
            <li>
              <button onClick={() => setView('catalog')} className="hover:text-accent-yellow cursor-pointer">
                Men&apos;s Apparel Wear
              </button>
            </li>
            <li>
              <button onClick={() => setView('catalog')} className="hover:text-accent-yellow cursor-pointer">
                Women&apos;s Apparel Wear
              </button>
            </li>
            <li>
              <button onClick={() => setView('catalog')} className="hover:text-accent-yellow cursor-pointer">
                Smart Tech Accessories
              </button>
            </li>
            <li>
              <button onClick={() => setView('catalog')} className="hover:text-accent-yellow cursor-pointer">
                Footwear & Shoes
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Coordinates */}
        <div className="md:col-span-4 column">
          <h4 className="text-xs font-mono font-bold text-neutral-200 uppercase tracking-wider mb-4">
            Burak Mart Help Center
          </h4>
          <ul className="text-xs text-neutral-400 space-y-3 font-sans">
            <li>
              <strong>Support Email:</strong>{' '}
              <a href="mailto:support@burakmart.com" className="text-neutral-300 hover:text-accent-yellow font-mono">
                support@burakmart.com
              </a>
            </li>
            <li>
              <strong>Order Helpline Support:</strong>{' '}
              <span className="text-neutral-300 font-mono font-bold">+90 555 987 6543</span>
            </li>
            <li>
              <strong>Boutique Warehouse:</strong> Bebek Mah. Cevdet Pasa Cad. No:99, Besiktas / Istanbul, Turkey
            </li>
          </ul>
        </div>

      </div>

      {/* Copywrite Section */}
      <div className="bg-neutral-950/40 border-t border-neutral-900 py-6 text-center text-[10px] font-mono uppercase tracking-widest text-neutral-500" id="footer-copyright">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Burak Mart Inc. All rights reserved.</span>
          <span>Designed with absolute perfection</span>
        </div>
      </div>

    </footer>
  );
};
