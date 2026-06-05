'use client'
import { useApp } from '../context/AppContext';
import { Home, Search, Grid, Heart, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
    const { currentView, setView } = useApp();
    
    const navigations = [
        { name: 'Home', view: 'home', icon: Home },
        { name: 'Search', view: 'catalog', icon: Search },
        { name: 'Categories', view: 'catalog', icon: Grid },
        { name: 'Favorites', view: 'home', icon: Heart },
        { name: 'Account', view: 'home', icon: User },
    ];
    
    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 z-40 flex items-center justify-around md:hidden px-2 pb-safe" id="bottom-nav">
            {navigations.map((nav, i) => {
                const isActive = currentView === nav.view;
                return (
                    <button
                        key={i}
                        onClick={() => setView(nav.view as any)}
                        className={`flex flex-col items-center gap-1 p-2 ${isActive ? 'text-accent' : 'text-slate-400'}`}
                    >
                        <nav.icon className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{nav.name}</span>
                    </button>
                )
            })}
        </div>
    )
};
