'use client';
import { UserPlus, Palette, Package, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

const icons = [<UserPlus size={24} />, <Palette size={24} />, <Package size={24} />, <TrendingUp size={24} />];
const colorKeys = ['blue', 'purple', 'green', 'orange'];
const numbers = ['01', '02', '03', '04'];

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-[#0A66FF]', text: 'text-white' },
  purple: { bg: 'bg-purple-600', text: 'text-white' },
  green: { bg: 'bg-green-600', text: 'text-white' },
  orange: { bg: 'bg-orange-500', text: 'text-white' },
};

export default function HowItWorks() {
  const { lang, t } = useLanguage();
  const steps = translations[lang].how.steps;

  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-purple-200 dark:border-purple-800">{t('how.badge')}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-4">{t('how.title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('how.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 via-green-200 to-orange-200 dark:from-blue-900 dark:via-purple-900 dark:via-green-900 dark:to-orange-900" />
          {steps.map((s, i) => {
            const c = colorMap[colorKeys[i]];
            return (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className={`w-24 h-24 rounded-3xl ${c.bg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className={c.text}>{icons[i]}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-black text-gray-500">{numbers[i]}</div>
                </div>
                <h3 className="font-bold text-[#0D1B3E] dark:text-white text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
