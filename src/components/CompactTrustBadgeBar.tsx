import React from 'react';
import { ShieldCheck, Truck, Zap } from 'lucide-react';

export const CompactTrustBadgeBar: React.FC = () => {
    const badges = [
        { icon: ShieldCheck, text: "100% AUTHENTIC" },
        { icon: Truck, text: "CASH ON DELIVERY" },
        { icon: Zap, text: "FAST DELIVERY" },
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {badges.map((badge, i) => (
                <div key={i} className="bg-accent-yellow/10 backdrop-blur-md border border-accent-yellow/30 text-accent-yellow flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
                    <badge.icon className="w-3.5 h-3.5" />
                    {badge.text}
                </div>
            ))}
        </div>
    );
};
