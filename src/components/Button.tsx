'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, AlertCircle } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'error';
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  isSuccess = false,
  isError = false,
  icon,
  fullWidth = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const [isRippling, setIsRippling] = useState(false);

  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center font-bold tracking-tight uppercase rounded-xl active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed hover-lift";
  
  const variants = {
    primary: "bg-accent-yellow text-navy shadow-sm hover:bg-[#FFC700] active:bg-[#FFB800]",
    secondary: "bg-transparent border-2 border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-navy",
    tertiary: "bg-neutral-100 text-navy hover:bg-neutral-200",
    success: "bg-success text-white",
    error: "bg-error text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs h-10",
    md: "px-5 py-2.5 text-sm h-12",
    lg: "px-6 py-3.5 text-base h-14", // 56px height for mobile primary
    xl: "px-8 py-4 text-base h-16",
  };

  const currentVariant = isSuccess ? 'success' : isError ? 'error' : variant;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 600);
    if (props.onClick) props.onClick(e);
  };

  return (
    <button
      className={`
        ${baseStyles} 
        ${variants[currentVariant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple Effect */}
      {isRippling && (
        <span className="absolute inset-0 pointer-events-none">
          <span className="absolute block w-4 h-4 bg-white/30 rounded-full animate-ripple -translate-x-1/2 -translate-y-1/2" />
        </span>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="hidden sm:inline">Processing...</span>
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>Added!</span>
          </motion.div>
        ) : isError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            <span>Retry</span>
          </motion.div>
        ) : (
          <motion.div
            key="normal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2"
          >
            {icon && icon}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
