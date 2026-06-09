'use client';
import Link from 'next/link';
import { ArrowRight, Play, Star, ShoppingBag, TrendingUp, Users, Package } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-gradient-to-br from-[#F0F7FF] via-white to-[#EAF3FF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* BG decorations */}
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-200/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-blue-400 animate-ping opacity-60" />
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-40" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: text */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-[#0A66FF] dark:text-blue-400">Plateforme #1 pour les commerçants africains</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0D1B3E] dark:text-white leading-[1.1] mb-6 animate-slide-up">
              Créez votre boutique en ligne{' '}
              <span className="bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] bg-clip-text text-transparent">en quelques minutes</span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Vendez vos produits sur internet et recevez vos paiements via <strong className="text-gray-700 dark:text-gray-300">Mobile Money</strong>. Sans compétences techniques, sans frais cachés.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/auth/register">
                <Button size="xl" iconRight={<ArrowRight size={20} />}>Créer ma boutique</Button>
              </Link>
              <button className="inline-flex items-center gap-3 px-6 py-4 rounded-[16px] bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-[#0A66FF] transition-all group">
                <span className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <Play size={16} className="text-white ml-0.5" />
                </span>
                Voir une démo
              </button>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex -space-x-2">
                {['🧑🏿‍💼','👩🏾‍💼','🧑🏾‍💼','👩🏿‍💼'].map((e,i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                  <span className="text-sm font-bold text-gray-900 dark:text-white ml-1">4.9</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">+10 000 vendeurs satisfaits</p>
              </div>
            </div>
          </div>

          {/* Right: mockup */}
          <div className="relative animate-slide-up lg:animate-none" style={{ animationDelay: '0.4s' }}>
            <div className="relative mx-auto w-full max-w-lg">
              {/* Main phone mockup */}
              <div className="relative mx-auto w-72 animate-float">
                <div className="bg-[#0D1B3E] rounded-[40px] p-3 shadow-[0_40px_80px_rgba(10,102,255,0.3)]">
                  <div className="bg-white dark:bg-gray-900 rounded-[30px] overflow-hidden">
                    {/* Store header */}
                    <div className="h-32 bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                      <div className="absolute bottom-4 left-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg mb-1">
                          <ShoppingBag size={22} className="text-[#0A66FF]" />
                        </div>
                        <p className="text-white font-bold text-sm">AfriShop</p>
                        <p className="text-blue-200 text-xs">45 produits · Cotonou</p>
                      </div>
                    </div>
                    {/* Products grid */}
                    <div className="p-3 grid grid-cols-2 gap-2">
                      {[
                        { name: 'Robe élégante', price: '15 000', color: 'from-pink-200 to-rose-200', emoji: '👗' },
                        { name: 'Sneakers', price: '25 000', color: 'from-blue-200 to-cyan-200', emoji: '👟' },
                        { name: 'Sac tendance', price: '18 000', color: 'from-amber-200 to-orange-200', emoji: '👜' },
                        { name: 'Montre', price: '35 000', color: 'from-emerald-200 to-teal-200', emoji: '⌚' },
                      ].map((p, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl overflow-hidden">
                          <div className={`h-16 bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl`}>{p.emoji}</div>
                          <div className="p-1.5">
                            <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                            <p className="text-xs font-bold text-[#0A66FF]">{p.price} F</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -left-8 top-12 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-gray-700 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center"><TrendingUp size={14} className="text-green-600" /></div>
                  <div>
                    <p className="text-xs text-gray-500">Revenus ce mois</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">485 000 F</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 top-1/2 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-gray-700 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center"><Package size={14} className="text-[#0A66FF]" /></div>
                  <div>
                    <p className="text-xs text-gray-500">Nouvelle commande</p>
                    <p className="text-sm font-bold text-[#0A66FF]">+1 commande !</p>
                  </div>
                </div>
              </div>

              <div className="absolute -left-4 bottom-12 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-gray-700 animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center"><Users size={14} className="text-purple-600" /></div>
                  <div>
                    <p className="text-xs text-gray-500">Visiteurs aujourd&apos;hui</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">1 234</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
