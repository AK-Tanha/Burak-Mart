'use client';

import React, { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Runtime system exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 px-6 font-sans">
      <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-5">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2">
          !
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Something went wrong</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          An unexpected error occurred while loading this boutique experience. Please try reloading the system state.
        </p>
        <button
          onClick={() => reset()}
          className="mt-2 bg-accent-yellow text-navy hover:bg-[#FFC700] text-sm font-bold py-3 px-6 rounded-xl transition-all cursor-pointer shadow-sm mx-auto"
        >
          Reload Experience
        </button>
      </div>
    </div>
  );
}
