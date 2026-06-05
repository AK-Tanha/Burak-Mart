'use client';
import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from './Skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface LazyImageProps extends ImageProps {
  wrapperClassName?: string;
  fallbackSrc?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({ 
  wrapperClassName = '', 
  className = '',
  src,
  alt,
  fallbackSrc = 'https://picsum.photos/400/400?blur=5',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionType, setConnectionType] = useState<string>('4g');

  useEffect(() => {
    // @ts-ignore
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      setConnectionType(conn.effectiveType || '4g');
      const updateConnection = () => setConnectionType(conn.effectiveType || '4g');
      conn.addEventListener('change', updateConnection);
      return () => conn.removeEventListener('change', updateConnection);
    }
  }, []);

  // Generate a small blurred version for Unsplash URLs
  const thumbUrl = typeof src === 'string' && src.includes('unsplash.com') 
    ? src.split('?')[0] + '?w=20&q=20&blur=10&auto=format'
    : null;

  // Adjust quality based on connection
  const quality = connectionType === 'slow-2g' || connectionType === '2g' ? 30 : connectionType === '3g' ? 60 : 85;

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(false);
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className={`relative overflow-hidden group/lazy ${wrapperClassName}`}>
      <AnimatePresence>
        {!isLoaded && !error && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10"
            >
                <Skeleton className="absolute inset-0" />
                {thumbUrl && (
                    <img 
                        src={thumbUrl} 
                        alt="" 
                        className="absolute inset-0 w-full h-full object-cover blur-md scale-105" 
                    />
                )}
            </motion.div>
        )}
      </AnimatePresence>

      {error ? (
        <div className="absolute inset-0 z-20 bg-neutral-50 flex flex-col items-center justify-center p-4 text-center">
            <AlertCircle className="w-8 h-8 text-neutral-300 mb-2" />
            <p className="text-[10px] font-mono text-neutral-400 uppercase font-bold mb-3">Load Failed</p>
            <button 
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
        </div>
      ) : (
        <Image
          key={`${src}-${retryCount}`}
          src={src}
          alt={alt}
          {...props}
          quality={quality}
          onLoad={(e) => {
            setIsLoaded(true);
            if (props.onLoad) props.onLoad(e);
          }}
          onError={() => {
            setError(true);
          }}
          className={`transition-all duration-700 ${
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-xl scale-105'
          } ${className}`}
        />
      )}
    </div>
  );
};
