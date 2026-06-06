import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  { name: 'Sarah J.', location: 'New York, USA', rating: 5, quote: 'Absolutely love the quality. The shipping was fast and the product exceeded my expectations!' },
  { name: 'Mark D.', location: 'London, UK', rating: 5, quote: 'The best online shopping experience. Secure payment and excellent customer support.' },
  { name: 'Elena K.', location: 'Berlin, Germany', rating: 4, quote: 'Great selection of products. I found exactly what I needed. Will definitely shop here again.' },
];

export const TestimonialSection: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-12" id="testimonial-section">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-4xl md:text-5xl font-display text-navy mb-12 text-center tracking-tight uppercase">
          What our customers say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-light p-8 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex text-accent-yellow mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'fill-current' : ''}`} />
                ))}
              </div>
              <p className="text-navy font-body text-sm leading-relaxed mb-6 font-medium italic opacity-80">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-accent-yellow font-display font-bold text-xl">
                  {t.name[0]}
                </div>
                <div>
                  <strong className="block text-sm font-display font-bold text-navy tracking-wide uppercase">{t.name}</strong>
                  <span className="text-xs text-neutral-400 font-body uppercase tracking-widest">{t.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
