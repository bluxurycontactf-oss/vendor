'use client';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

const variants = {
  primary: 'bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] hover:from-[#0052CC] hover:to-[#2563EB] text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5',
  secondary: 'bg-[#EAF3FF] text-[#0A66FF] hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50',
  outline: 'border-2 border-[#0A66FF] text-[#0A66FF] hover:bg-[#EAF3FF] dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/30',
  ghost: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-[14px]',
  lg: 'px-6 py-3 text-base rounded-[14px]',
  xl: 'px-8 py-4 text-lg rounded-[16px]',
};

export default function Button({ variant = 'primary', size = 'md', loading, icon, iconLeft, iconRight, fullWidth, children, className = '', disabled, ...props }: ButtonProps) {
  const leftIcon = iconLeft || icon;
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : leftIcon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
