'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 px-6 font-sans">
      <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-5">
        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2">
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Page Not Found</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          We couldn&apos;t find the page you were looking for. Feel free to browse our main catalog for amazing apparel, watches, and bags!
        </p>
        <Link 
          href="/"
          className="mt-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold py-3 px-6 rounded-xl transition-all cursor-pointer shadow-sm mx-auto"
        >
          Back to Burak Mart
        </Link>
      </div>
    </div>
  );
}
