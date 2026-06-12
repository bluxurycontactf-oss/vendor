'use client';
import Link from 'next/link';
import { Zap, ArrowRight, ShoppingCart, Plus, Search, Package, ShoppingBag, Settings, LayoutGrid, TrendingUp, Users, CheckCircle2, Smartphone, SignalHigh, Wifi, BatteryFull } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import Footer from '@/components/landing/Footer';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[270px]">
      {/* Boutons latéraux */}
      <div className="absolute -left-[3px] top-24 w-[3px] h-8 bg-[#2c2c2e] rounded-l-sm" />
      <div className="absolute -left-[3px] top-36 w-[3px] h-14 bg-[#2c2c2e] rounded-l-sm" />
      <div className="absolute -right-[3px] top-32 w-[3px] h-16 bg-[#2c2c2e] rounded-r-sm" />

      {/* Châssis titane */}
      <div className="bg-gradient-to-br from-[#3a3a3c] via-[#1c1c1e] to-[#3a3a3c] rounded-[3rem] p-[10px] shadow-2xl shadow-blue-500/20">
        <div className="relative bg-white dark:bg-gray-900 rounded-[2.4rem] overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-20" />

          {/* Status bar */}
          <div className="flex items-center justify-between px-7 pt-3.5 pb-2 text-[11px] font-semibold text-gray-900 dark:text-white relative z-10">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <SignalHigh size={12} />
              <Wifi size={12} />
              <BatteryFull size={14} />
            </div>
          </div>

          {/* Écran */}
          <div className="min-h-[440px] flex flex-col">
            {children}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center py-2 pb-2.5">
            <div className="w-28 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommentCaMarchePage() {
  const { lang, t } = useLanguage();
  const shotsInfo = translations[lang].guide.shots;
  const shots = [
    // 1. Boutique publique
    (
      <PhoneFrame>
        <div className="bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] h-20 relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center"><ShoppingBag size={18} className="text-[#0A66FF]" /></div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">AfriShop</p>
              <p className="text-blue-100 text-[10px]">Cotonou · 45 produits</p>
            </div>
          </div>
        </div>
        <div className="p-3.5 flex-1">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-2.5 py-2 mb-3">
            <Search size={12} className="text-gray-400" />
            <span className="text-[11px] text-gray-400">Rechercher...</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { name: 'Robe élégante', price: '15 000', color: 'from-pink-200 to-rose-200', emoji: '👗' },
              { name: 'Sneakers', price: '25 000', color: 'from-blue-200 to-cyan-200', emoji: '👟' },
              { name: 'Sac tendance', price: '18 000', color: 'from-amber-200 to-orange-200', emoji: '👜' },
              { name: 'Montre', price: '35 000', color: 'from-emerald-200 to-teal-200', emoji: '⌚' },
            ].map((p, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
                <div className={`h-16 bg-gradient-to-br ${p.color} flex items-center justify-center text-3xl`}>{p.emoji}</div>
                <div className="p-2 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                    <p className="text-[10px] font-bold text-[#0A66FF]">{p.price} F</p>
                  </div>
                  <div className="w-5 h-5 rounded-md bg-[#0A66FF] flex items-center justify-center flex-shrink-0">
                    <Plus size={10} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PhoneFrame>
    ),
    // 2. Dashboard vendeur
    (
      <PhoneFrame>
        <div className="flex-1 p-3.5">
          <p className="text-sm font-black text-[#0D1B3E] dark:text-white mb-3">Tableau de bord</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'Revenus', value: '485k F', color: 'text-[#0A66FF] bg-blue-50 dark:bg-blue-900/30' },
              { label: 'Commandes', value: '128', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
              { label: 'Produits', value: '45', color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
            ].map((k, i) => (
              <div key={i} className={`rounded-xl p-2 ${k.color}`}>
                <p className="text-[9px] opacity-70 mb-0.5">{k.label}</p>
                <p className="text-xs font-black">{k.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5">
            <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-2">Dernières commandes</p>
            <div className="flex flex-col gap-1.5">
              {['Aïcha B.', 'Koffi A.', 'Sarah M.'].map((name, i) => (
                <div key={i} className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-lg px-2 py-1.5">
                  <span className="text-[10px] text-gray-600 dark:text-gray-400">{name}</span>
                  <span className="text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">Livré</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Barre de navigation */}
        <div className="flex items-center justify-around border-t border-gray-100 dark:border-gray-800 py-2.5 mt-auto">
          {[LayoutGrid, Package, ShoppingCart, Users, Settings].map((Icon, i) => (
            <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center ${i === 0 ? 'bg-[#0A66FF] text-white' : 'text-gray-300 dark:text-gray-600'}`}>
              <Icon size={14} />
            </div>
          ))}
        </div>
      </PhoneFrame>
    ),
    // 3. Statistiques
    (
      <PhoneFrame>
        <div className="p-3.5 flex-1">
          <p className="text-sm font-black text-[#0D1B3E] dark:text-white mb-3">Statistiques</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Revenu total', value: '2.4M F', icon: <TrendingUp size={12} />, color: 'text-[#0A66FF] bg-blue-50 dark:bg-blue-900/30' },
              { label: 'Panier moyen', value: '12 500 F', icon: <Package size={12} />, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
            ].map((k, i) => (
              <div key={i} className={`rounded-xl p-2 ${k.color}`}>
                <div className="flex items-center gap-1.5 mb-1">{k.icon}<span className="text-[9px] opacity-70">{k.label}</span></div>
                <p className="text-xs font-black">{k.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5 mb-2.5">
            <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-2">Revenus — 7 derniers jours</p>
            <div className="flex items-end gap-1.5 h-20">
              {[40, 65, 35, 80, 55, 95, 70].map((h, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-[#0A66FF] to-[#3B82F6] rounded-t-md" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5">
            <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-2">Top produits</p>
            <div className="flex flex-col gap-2">
              {[{ n: 'Robe élégante', v: 90 }, { n: 'Sneakers', v: 65 }, { n: 'Montre', v: 40 }].map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[9px] text-gray-500 mb-1"><span>{p.n}</span></div>
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] h-1.5 rounded-full" style={{ width: `${p.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PhoneFrame>
    ),
    // 4. Commande & paiement
    (
      <PhoneFrame>
        <div className="p-3.5 flex-1">
          <p className="text-sm font-black text-[#0D1B3E] dark:text-white mb-3 flex items-center gap-1.5"><Smartphone size={14} className="text-[#0A66FF]" /> Récapitulatif</p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-3 flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-400"><span>Robe élégante x1</span><span>15 000 F</span></div>
            <div className="flex justify-between text-[11px] text-gray-600 dark:text-gray-400"><span>Sneakers x1</span><span>25 000 F</span></div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-1.5 flex justify-between text-sm font-black text-[#0D1B3E] dark:text-white"><span>Total</span><span>40 000 F</span></div>
          </div>
          <p className="text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-2">Mode de paiement</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { name: 'MTN MoMo', color: 'bg-yellow-400 text-yellow-900' },
              { name: 'Moov Money', color: 'bg-orange-400 text-orange-900' },
              { name: 'Wave', color: 'bg-blue-400 text-blue-900' },
              { name: 'Orange Money', color: 'bg-orange-300 text-orange-900' },
            ].map((m, i) => (
              <div key={i} className={`rounded-lg px-2 py-2 text-[10px] font-bold text-center ${m.color}`}>{m.name}</div>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3 py-2.5">
            <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
            <p className="text-[11px] font-semibold text-green-700 dark:text-green-400">Commande passée avec succès !</p>
          </div>
        </div>
      </PhoneFrame>
    ),
  ];

  return (
    <main>
      <Navbar />

      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#F0F7FF] via-white to-[#EAF3FF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-28 pb-16 px-4 text-center overflow-hidden border-b border-gray-100 dark:border-gray-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5 mb-5">
          <Zap size={12} className="text-[#0A66FF]" />
          <span className="text-xs font-bold text-[#0A66FF]">{t('guide.badge')}</span>
        </div>

        <h1 className="relative text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D1B3E] dark:text-white mb-4 leading-tight max-w-2xl mx-auto">
          {t('guide.title')}
        </h1>
        <p className="relative text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
          {t('guide.subtitle')}
        </p>

        <div className="relative flex justify-center">
          <Link href="/auth/register">
            <Button size="lg" iconRight={<ArrowRight size={18} />}>{t('hero.cta_primary')}</Button>
          </Link>
        </div>
      </div>

      {/* Comment ça marche : étapes */}
      <HowItWorks />

      {/* Captures d'écran / aperçu */}
      <section className="py-24 bg-[#F8FAFC] dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-[#0A66FF] dark:text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-blue-200 dark:border-blue-800">{t('guide.shots_badge')}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-4">{t('guide.shots_title')}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('guide.shots_subtitle')}</p>
          </div>

          <div className="flex flex-col gap-16">
            {shots.map((shot, i) => (
              <div key={i} className={`flex flex-col lg:flex-row items-center gap-10 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="w-full lg:w-1/2">{shot}</div>
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0A66FF] text-white font-black text-sm mb-4">{i + 1}</div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0D1B3E] dark:text-white mb-3">{shotsInfo[i].title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mx-auto lg:mx-0">{shotsInfo[i].desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Les 3 plans */}
      <Pricing />

      <Footer />
    </main>
  );
}
