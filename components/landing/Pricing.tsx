'use client';
import { Check, Zap, Star, Building2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

const planIcons = [<Zap size={20} />, <Star size={20} />, <Building2 size={20} />];
const planPrices = ['0', '4 900', '14 900'];
const planColors = ['gray', 'blue', 'purple'];
const planHrefs = ['/auth/register', '/auth/register?plan=premium', '/auth/register?plan=business'];
const planPopular = [false, true, false];

const colorMap: Record<string, { badge: string; ring: string; icon: string }> = {
  gray: { badge: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400', ring: 'border-gray-200 dark:border-gray-700', icon: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
  blue: { badge: 'bg-[#0A66FF] text-white', ring: 'border-[#0A66FF] shadow-xl shadow-blue-500/20', icon: 'bg-[#0A66FF] text-white' },
  purple: { badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400', ring: 'border-purple-200 dark:border-purple-700', icon: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
};

export default function Pricing() {
  const { lang, t } = useLanguage();
  const plans = translations[lang].price.plans;

  return (
    <section id="pricing" className="py-24 bg-[#F8FAFC] dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-green-200 dark:border-green-800">{t('price.badge')}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-4">{t('price.title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('price.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const c = colorMap[planColors[i]];
            return (
              <div key={i} className={`relative bg-white dark:bg-gray-900 rounded-3xl border-2 ${c.ring} p-8 flex flex-col`}>
                {planPopular[i] && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg">{t('price.popular')}</span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-2xl ${c.icon} flex items-center justify-center mb-5`}>
                  {planIcons[i]}
                </div>
                <h3 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{plan.desc}</p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-[#0D1B3E] dark:text-white">{planPrices[i]}</span>
                  {planPrices[i] !== '0' && <span className="text-lg text-gray-400"> FCFA</span>}
                  {planPrices[i] === '0' && <span className="text-lg font-bold text-gray-500"> FCFA</span>}
                  <span className="text-sm text-gray-400 ml-1">{planPrices[i] !== '0' ? t('price.period') : t('price.free_period')}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      {f.badge ? (
                        <VerifiedBadge plan={f.badge} size={20} className="mt-0.5" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={11} className="text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      <span className={`text-sm flex items-center gap-2 flex-wrap ${f.badge ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                        {f.label}
                        {f.soon && <span className="text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded-full">{t('price.soon')}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href={planHrefs[i]}>
                  <Button variant={planPopular[i] ? 'primary' : 'outline'} fullWidth>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">{t('price.footer')}</p>
      </div>
    </section>
  );
}
