'use client'
import { motion } from 'motion/react';
import { ToastManager } from './ToastManager';
import { BottomNav } from './BottomNav';
import { useApp } from '../context/AppContext';

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const { isOnline } = useApp();
    return (
        <>
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white text-center py-2 text-xs font-bold">
                    You are currently offline.
                </div>
            )}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen"
            >
                {children}
            </motion.main>
            <ToastManager />
            <BottomNav />
        </>
    );
};
