'use client';
import { Store, Package, ShoppingCart, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const icons = [<Store size={24} />, <Package size={24} />, <ShoppingCart size={24} />, <Users size={24} />];
const values = ['10 000+', '100 000+', '1 000 000+', '500 000+'];
const colorKeys = ['blue', 'purple', 'green', 'orange'];

const colors: Record<string, string> = {
  blue: 'bg-blue-100 text-[#0A66FF] dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
};

const labelKeys = ['stats.shops', 'stats.products', 'stats.orders', 'stats.clients'];

export default function Stats() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {labelKeys.map((key, i) => (
            <div key={i} className="text-center group">
              <div className={`w-14 h-14 rounded-2xl ${colors[colorKeys[i]]} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {icons[i]}
              </div>
              <div className="text-3xl font-black text-[#0D1B3E] dark:text-white mb-1">{values[i]}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{t(key)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
