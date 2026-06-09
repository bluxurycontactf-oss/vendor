'use client';
import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, error, hint, icon, iconRight, fullWidth, className = '', ...props }, ref) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          ref={ref}
          {...props}
          className={`w-full bg-white dark:bg-gray-900 border-2 ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-[#0A66FF]'} rounded-[14px] px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all duration-300 focus:shadow-[0_0_0_4px_rgba(10,102,255,0.12)] ${icon ? 'pl-11' : ''} ${iconRight ? 'pr-11' : ''} ${className}`}
        />
        {iconRight && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{iconRight}</span>}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
});

export default Input;
