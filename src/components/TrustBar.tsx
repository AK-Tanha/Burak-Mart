import React from 'react';
import { ShieldCheck, Zap, HandCoins, Headset } from 'lucide-react';
import { motion } from 'framer-motion';

export const TrustBar: React.FC = () => {
  const items = [
    { 
      icon: ShieldCheck, 
      title: '100% AUTHENTIC', 
      description: 'Sourced directly from verified premium agencies. Every product guaranteed authentic.',
    },
    { 
      icon: Zap, 
      title: 'FAST DELIVERY', 
      description: 'Quick processing and swift shipment. Track your order in real time.',
    },
    { 
      icon: HandCoins, 
      title: 'CASH ON DELIVERY', 
      description: 'Pay when your order arrives. Inspect packages before paying with complete confidence.',
    },
    { 
      icon: Headset, 
      title: 'SUPPORT SERVICES', 
      description: "Dedicated customer support via email and phone. We're here to help.",
    },
  ];

  return (
    <section className="bg-transparent py-16 px-4" id="trust-bar">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-display text-neutral-900 tracking-tight mb-3 uppercase">
            Why Shop Burak Mart?
          </h2>
          <p className="text-neutral-500 font-medium max-w-lg mx-auto font-body uppercase tracking-wider text-xs">
            We stand behind every purchase with authentic guarantees and dedicated support for your peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.1,
                type: 'spring',
                bounce: 0.3
              }}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="group bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-sm transition-all duration-300 flex flex-col items-center text-center cursor-default hover:border-accent-yellow hover:shadow-xl"
            >
              <div className="w-16 h-16 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-accent-yellow/10 text-accent-yellow rounded-full flex items-center justify-center mb-6 transition-all duration-200 ease-out group-hover:bg-accent-yellow group-hover:text-navy group-hover:scale-110">
                <item.icon className="w-8 h-8 md:w-7 md:h-7 lg:w-8 lg:h-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-display text-navy mb-3 uppercase tracking-wide">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed font-body font-medium">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
