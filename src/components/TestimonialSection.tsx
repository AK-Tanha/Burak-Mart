'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  { name: 'Sarah J.', location: 'New York, USA', rating: 5, quote: 'Absolutely love the quality. The shipping was fast and the product exceeded my expectations!' },
  { name: 'Mark D.', location: 'London, UK', rating: 5, quote: 'The best online shopping experience. Secure payment and excellent customer support.' },
  { name: 'Elena K.', location: 'Berlin, Germany', rating: 4, quote: 'Great selection of products. I found exactly what I needed. Will definitely shop here again.' },
];

export const TestimonialSection: React.FC = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goTo = useCallback((index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  }, [active]);

  const next = useCallback(() => {
    setDirection(1);
    setActive(prev => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive(prev => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) prev();
    else next();
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  const t = testimonials[active];

  return (
    <section
      className="bg-white py-20 px-4 md:px-12 overflow-hidden"
      id="testimonial-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 justify-center mb-14">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neutral-200 max-w-20" />
          <h2 className="text-4xl md:text-5xl font-display text-navy tracking-tight uppercase text-center">
            What our customers say
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neutral-200 max-w-20" />
        </div>

        <div className="relative flex items-center justify-center gap-4 md:gap-6">
          <button
            onClick={prev}
            className="hidden md:flex w-10 h-10 shrink-0 items-center justify-center rounded-full bg-accent-yellow/10 text-accent-yellow hover:bg-accent-yellow hover:text-navy hover:scale-110 active:scale-95 transition-all duration-200 ease-out"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            className="flex-1 max-w-[600px] w-full"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-bg-light rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10 flex flex-col items-center text-center"
              >
                <Quote className="w-10 h-10 text-accent-yellow/30 mb-4 shrink-0" />

                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`w-5 h-5 ${j < t.rating ? 'fill-accent-yellow text-accent-yellow' : 'text-neutral-200'}`}
                    />
                  ))}
                </div>

                <p className="text-lg md:text-xl text-navy font-body leading-relaxed mb-8 font-medium italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent-yellow flex items-center justify-center text-navy font-display font-bold text-2xl shrink-0">
                    {t.name[0]}
                  </div>
                  <div className="text-left">
                    <strong className="block text-base font-display font-bold text-navy tracking-wide uppercase">
                      {t.name}
                    </strong>
                    <span className="text-xs text-neutral-400 font-body uppercase tracking-widest">
                      {t.location}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={next}
            className="hidden md:flex w-10 h-10 shrink-0 items-center justify-center rounded-full bg-accent-yellow/10 text-accent-yellow hover:bg-accent-yellow hover:text-navy hover:scale-110 active:scale-95 transition-all duration-200 ease-out"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-200 ease-out cursor-pointer ${
                active === i
                  ? 'w-3 h-3 bg-accent-yellow shadow-sm shadow-accent-yellow/40 scale-[1.3]'
                  : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400 hover:scale-[1.2]'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};