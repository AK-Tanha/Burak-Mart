import React from 'react';
import { Skeleton } from './Skeleton';

export const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3">
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
        </div>
    );
};
