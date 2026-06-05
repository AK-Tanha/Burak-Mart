import React from 'react';
import { ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const items = [
    { icon: ShieldCheck, title: '100% Authentic', description: 'Verified products' },
    { icon: Truck, title: 'Free Delivery', description: 'On orders over $50' },
    { icon: RefreshCw, title: 'Easy Returns', description: '30-day money back' },
    { icon: CreditCard, title: 'Secure Payment', description: 'Encrypted transactions' },
  ];

  return (
    <section className="bg-white py-8 border-y border-slate-200" id="trust-bar">
      <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="p-3 bg-slate-50 text-primary rounded-xl">
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <strong className="block text-sm font-headline font-bold text-primary tracking-wide">
                {item.title}
              </strong>
              <span className="text-xs text-charcoal font-body">{item.description}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
