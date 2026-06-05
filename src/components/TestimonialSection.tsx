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
        <h2 className="text-3xl font-headline font-bold text-primary mb-12 text-center tracking-wide">
          WHAT OUR CUSTOMERS SAY
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm"
            >
              <div className="flex text-accent mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'fill-current' : ''}`} />
                ))}
              </div>
              <p className="text-charcoal font-body text-sm leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-headline font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <strong className="block text-sm font-headline font-bold text-primary">{t.name}</strong>
                  <span className="text-xs text-charcoal">{t.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
