import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };

export default function Card({ children, className = '', hover, padding = 'md' }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.05),0_2px_8px_rgba(10,102,255,0.08)] ${hover ? 'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(10,102,255,0.15)] cursor-pointer' : ''} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}
