'use client';
import { Store, ShoppingCart, Smartphone, BarChart3, Truck, QrCode, Globe, Tag, Bell, Repeat, Languages, Shield } from 'lucide-react';
import Card from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

const icons = [<Store />, <ShoppingCart />, <Smartphone />, <BarChart3 />, <Truck />, <QrCode />, <Globe />, <Tag />, <Bell />, <Repeat />, <Languages />, <Shield />];
const colorKeys = ['blue', 'purple', 'green', 'orange', 'pink', 'cyan', 'indigo', 'rose', 'amber', 'emerald', 'violet', 'slate'];

const colors: Record<string, string> = {
  blue: 'bg-blue-100 text-[#0A66FF] dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400',
};

export default function Features() {
  const { lang, t } = useLanguage();
  const items = translations[lang].feat.items;

  return (
    <section id="features" className="py-24 bg-[#F8FAFC] dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-[#0A66FF] text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-blue-200 dark:border-blue-800">{t('feat.badge')}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-4">
            {t('feat.title').split('\n').map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t('feat.subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((f, i) => (
            <Card key={i} hover padding="lg">
              <div className={`w-12 h-12 rounded-2xl ${colors[colorKeys[i]]} flex items-center justify-center mb-4`}>
                {icons[i]}
              </div>
              <h3 className="font-bold text-[#0D1B3E] dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
