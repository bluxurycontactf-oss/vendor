'use client';
import { useEffect, useState } from 'react';
import { getFeaturedShops } from '@/lib/firestore';
import { Shop } from '@/types';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { MapPin, Search, ArrowRight, Zap, X, BadgeCheck, Star } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['Tout', 'Mode & Vêtements', 'Alimentation', 'Électronique', 'Beauté & Soins', 'Maison', 'Sport', 'Autre'];

export default function BoutiquesPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tout');

  useEffect(() => {
    getFeaturedShops().then(s => { setShops(s); setLoading(false); });
  }, []);

  const filtered = shops
    .filter(s => category === 'Tout' || s.category === category)
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.city ?? '').toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#F0F7FF] via-white to-[#EAF3FF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-14 pb-16 px-4 text-center overflow-hidden border-b border-gray-100 dark:border-gray-800">
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Back link + Logo */}
        <div className="relative flex items-center justify-between max-w-5xl mx-auto mb-10">
          <Link href="/" className="flex items-center gap-2 font-black text-lg text-[#0A66FF]">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] rounded-xl flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            Shoply
          </Link>
          <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#0A66FF] transition-colors font-medium">
            ← Retour
          </Link>
        </div>

        {/* Badge pill */}
        <div className="relative inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5 mb-5">
          <span className="w-2 h-2 rounded-full bg-[#0A66FF] animate-pulse" />
          <span className="text-xs font-bold text-[#0A66FF]">Boutiques Certifiées Business</span>
        </div>

        <h1 className="relative text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-3 leading-tight">
          Achetez chez des marchands{' '}
          <span className="bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] bg-clip-text text-transparent">
            de confiance
          </span>
        </h1>
        <p className="relative text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-5">
          Des boutiques vérifiées et certifiées par Shoply. Chaque badge garantit l&apos;authenticité du commerçant.
        </p>

        {/* Stats chips */}
        {!loading && (
          <div className="relative flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
              <BadgeCheck size={14} className="text-[#0A66FF]" />
              {shops.length} boutiques certifiées
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              Vendeurs vérifiés
            </span>
          </div>
        )}
      </div>

      {/* Spotlight: boutiques Business mises en avant */}
      {!loading && shops.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Star size={15} className="text-yellow-400 fill-yellow-400" />
            <h2 className="text-sm font-black text-[#0D1B3E] dark:text-white">À la une</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
            {shops.slice(0, 5).map(s => (
              <a
                key={s.id}
                href={`/shop/${s.slug}`}
                className="group flex-shrink-0 w-64 bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-white relative overflow-hidden"
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
                <div className="flex items-center gap-3 mb-2 relative">
                  <div className="w-12 h-12 rounded-xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-lg font-black overflow-hidden flex-shrink-0">
                    {s.logo ? <img src={s.logo} alt={s.name} className="w-full h-full object-cover" /> : s.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-sm truncate">{s.name}</span>
                      <VerifiedBadge plan="business" size={14} />
                    </div>
                    {s.city && <span className="text-xs text-blue-100 flex items-center gap-1"><MapPin size={10} />{s.city}</span>}
                  </div>
                </div>
                <span className="relative inline-flex items-center gap-1 text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">
                  Visiter la boutique <ArrowRight size={12} />
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div className="max-w-5xl mx-auto px-4 mt-2 mb-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une boutique ou une ville..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-[#0A66FF] dark:text-white"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                category === c
                  ? 'bg-[#0A66FF] border-[#0A66FF] text-white shadow-sm'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-[#0A66FF] hover:text-[#0A66FF]'
              }`}
            >{c}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl h-52 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BadgeCheck size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Aucune boutique trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(s => (
              <a
                key={s.id}
                href={`/shop/${s.slug}`}
                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-1"
              >
                {/* Banner */}
                <div className="h-24 bg-gradient-to-br from-blue-50 to-[#EAF3FF] dark:from-blue-950/30 dark:to-gray-900 relative overflow-hidden">
                  {s.banner
                    ? <img src={s.banner} alt="" className="w-full h-full object-cover" />
                    : <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, #0A66FF 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                  }
                  {/* Logo */}
                  <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-2xl border-4 border-white dark:border-gray-900 shadow-md bg-white dark:bg-gray-800 flex items-center justify-center text-xl font-black text-[#0A66FF] overflow-hidden">
                    {s.logo ? <img src={s.logo} alt="" className="w-full h-full object-cover" /> : s.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="pt-8 px-4 pb-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-gray-900 dark:text-white text-sm">{s.name}</span>
                      <VerifiedBadge plan="business" size={16} />
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-[#0A66FF] transition-colors shrink-0 mt-0.5" />
                  </div>

                  {s.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{s.description}</p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                    {s.city && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-[#0A66FF]" />{s.city}
                      </span>
                    )}
                    {s.category && (
                      <span className="bg-blue-50 dark:bg-blue-900/20 text-[#0A66FF] dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                        {s.category}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 py-4 text-center">
        <Link href="/" className="text-xs text-gray-400 hover:text-[#0A66FF] transition-colors flex items-center justify-center gap-1">
          <Zap size={10} /> Propulsé par Shoply
        </Link>
      </div>
    </div>
  );
}
