'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllMarketProducts, MarketProduct } from '@/lib/firestore';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { useLanguage } from '@/context/LanguageContext';
import { captureAffiliateParam, getPendingAffiliateUid } from '@/lib/affiliate';
import { Search, X, Zap, ShoppingBag, MapPin, Store } from 'lucide-react';

export default function ProduitsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(t('market.category_all'));
  const [affUid, setAffUid] = useState<string | null>(null);

  useEffect(() => {
    captureAffiliateParam();
    setAffUid(getPendingAffiliateUid());
    getAllMarketProducts().then(p => { setProducts(p); setLoading(false); });
  }, []);

  const categories = [
    t('market.category_all'),
    ...Array.from(new Set(products.map(p => p.category).filter(Boolean))),
  ];

  const filtered = products
    .filter(p => category === t('market.category_all') || p.category === category)
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.shopName.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#F0F7FF] via-white to-[#EAF3FF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pt-14 pb-16 px-4 text-center overflow-hidden border-b border-gray-100 dark:border-gray-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />

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

        <div className="relative inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5 mb-5">
          <span className="w-2 h-2 rounded-full bg-[#0A66FF] animate-pulse" />
          <span className="text-xs font-bold text-[#0A66FF]">{t('market.badge')}</span>
        </div>

        <h1 className="relative text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-3 leading-tight">
          {t('market.title')}
        </h1>
        <p className="relative text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-5">
          {t('market.subtitle')}
        </p>

        {!loading && (
          <div className="relative flex items-center justify-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm">
              <ShoppingBag size={14} className="text-[#0A66FF]" />
              {products.length} {t('market.products_count')}
            </span>
          </div>
        )}
      </div>

      {/* Search + filters */}
      <div className="max-w-6xl mx-auto px-4 mt-6 mb-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('market.search_placeholder')}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:border-[#0A66FF] dark:text-white"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {categories.map(c => (
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
        )}
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl h-60 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">{t('market.no_results')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <Link
                key={p.id}
                href={`/shop/${p.shopSlug}?product=${p.id}${affUid ? `&aff=${affUid}` : ''}`}
                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 flex flex-col"
              >
                {/* Image */}
                <div className="aspect-square bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={28} className="text-gray-300" />
                    </div>
                  )}
                  {p.shopPlan !== 'free' && (
                    <div className="absolute top-2 left-2">
                      <VerifiedBadge plan={p.shopPlan as 'premium' | 'business'} size={20} />
                    </div>
                  )}
                </div>

                <div className="p-3 flex-1 flex flex-col">
                  <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{p.name}</p>
                  <p className="text-sm font-black text-[#0A66FF] mb-2">{p.price.toLocaleString()} F</p>
                  <div className="mt-auto flex items-center gap-1 text-xs text-gray-400 truncate">
                    <Store size={11} className="flex-shrink-0" />
                    <span className="truncate">{p.shopName}</span>
                  </div>
                  {p.shopCity && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                      <MapPin size={10} className="flex-shrink-0" />
                      <span className="truncate">{p.shopCity}</span>
                    </div>
                  )}
                </div>
              </Link>
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
