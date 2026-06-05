'use client'
import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, Grid, Heart, User, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BottomNav: React.FC = () => {
    const { currentView, setView, currentPortal, setPortal, favorites, cart } = useApp();
    
    const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const favoritesCount = favorites.length;

    const navigations = [
        { name: 'Home', view: 'home', type: 'view' as const, icon: Home },
        { name: 'Search', view: 'catalog', type: 'view' as const, icon: Search },
        { name: 'Discover', view: 'catalog', type: 'view' as const, icon: Grid },
        { name: 'Wishlist', view: 'home', type: 'view' as const, icon: Heart, badge: favoritesCount },
        { name: 'Account', view: 'customer', type: 'portal' as const, icon: User },
    ];
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-xl border-t border-slate-200 px-4 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)]" id="bottom-nav">
            <div className="flex items-center justify-between h-16 max-w-lg mx-auto">
                {navigations.map((nav, i) => {
                    const isActive = nav.type === 'view' ? currentView === nav.view : currentPortal === nav.view;
                    
                    return (
                        <button
                            key={i}
                            onClick={() => {
                                if (nav.type === 'view') {
                                    setView(nav.view as any);
                                } else {
                                    setPortal(nav.view as any);
                                }
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all active:scale-90"
                            aria-label={nav.name}
                        >
                            <div className="relative group p-1">
                                <nav.icon 
                                    className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-orange-600 scale-110' : 'text-slate-400 group-hover:text-slate-600'}`} 
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                
                                <AnimatePresence>
                                    {nav.badge && nav.badge > 0 && (
                                        <motion.span 
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white shadow-sm"
                                        >
                                            {nav.badge}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {isActive && (
                                    <motion.div 
                                        layoutId="bottom-nav-indicator"
                                        className="absolute -top-1 left-1.5 right-1.5 h-0.5 bg-orange-600 rounded-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </div>
                            <span className={`text-[9px] font-bold tracking-tight uppercase transition-colors duration-300 ${isActive ? 'text-orange-600' : 'text-slate-400'}`}>
                                {nav.name}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
};
