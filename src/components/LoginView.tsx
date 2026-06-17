'use client';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const LoginView: React.FC = () => {
  const { setPortal } = useApp();
  const [role, setRole] = useState<'admin' | 'customer'>('customer');

  const handleLogin = () => {
    if (role === 'admin') {
      // For now, keep simple
    }
    setPortal(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <select value={role} onChange={(e) => setRole(e.target.value as any)} className="mb-4 block w-full p-2 border rounded">
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleLogin} className="w-full bg-accent-yellow text-navy p-2 rounded font-bold">Enter</button>
      </div>
    </div>
  );
};
