import React from 'react';
import { Skeleton } from './Skeleton';

export const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-[2rem] p-4 border border-neutral-100 shadow-xs flex flex-col gap-4">
            <Skeleton className="aspect-square rounded-[1.5rem] bg-bg-light" />
            <div className="px-1 flex flex-col gap-3">
                <div className="flex gap-2">
                    <Skeleton className="h-4 w-12 bg-bg-light rounded-md" />
                    <Skeleton className="h-4 w-12 bg-bg-light rounded-md" />
                </div>
                <Skeleton className="h-6 w-5/6 bg-bg-light rounded-lg" />
                <Skeleton className="h-4 w-full bg-bg-light rounded-lg opacity-60" />
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-50">
                    <Skeleton className="h-8 w-1/3 bg-bg-light rounded-lg" />
                    <Skeleton className="h-10 w-28 bg-bg-light rounded-xl" />
                </div>
            </div>
        </div>
    );
};
