'use client';
import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  textarea = false,
  rows = 2,
  disabled = false,
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = (value ?? '').trim().length > 0;
  const isValid = hasValue && !error;
  const showError = error && !focused;

  const inputId = `field-${name}`;
  const errorId = `${inputId}-error`;

  const baseClasses =
    'w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 transition-all duration-200 ease-out outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  const borderClass = error
    ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
    : isValid
    ? 'border-green-400 focus:border-green-500 focus:ring-1 focus:ring-green-500/30'
    : 'border-neutral-200 focus:border-accent-yellow focus:ring-1 focus:ring-accent-yellow/30';

  const inputClasses = `${baseClasses} ${borderClass} ${textarea ? 'resize-none' : ''}`;

  const inputProps = {
    id: inputId,
    name,
    value,
    onChange,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(false);
      onBlur?.(e);
    },
    onFocus: () => setFocused(true),
    placeholder,
    disabled,
    required,
    'aria-required': required,
    'aria-invalid': !!error,
    'aria-describedby': error ? errorId : undefined,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <div className="relative">
        {textarea ? (
          <textarea rows={rows} className={inputClasses} {...(inputProps as any)} />
        ) : (
          <input type={type} className={inputClasses} {...(inputProps as any)} />
        )}

        {hasValue && !disabled && (
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${showError ? 'opacity-100' : 'opacity-100'}`}>
            {isValid ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : error ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : null}
          </span>
        )}
      </div>

      <div className="min-h-[18px] overflow-hidden">
        <p
          id={errorId}
          role="alert"
          className={`text-[11px] font-medium flex items-center gap-1 transition-all duration-200 ease-out ${
            showError ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
          } ${error ? 'text-red-500' : 'text-green-600'}`}
        >
          {showError && (
            <>
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{error}</span>
            </>
          )}
          {isValid && !showError && focused && (
            <>
              <CheckCircle className="w-3 h-3 shrink-0" />
              <span className="text-green-600">Looks good</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
