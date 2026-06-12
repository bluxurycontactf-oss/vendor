'use client';
import { useEffect, useState } from 'react';
import { getRecommendedShops } from '@/lib/firestore';
import { Shop } from '@/types';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';

export default function RecommendedShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendedShops().then(s => { setShops(s.slice(0, 6)); setLoading(false); });
  }, []);

  if (!loading && shops.length === 0) return null;

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Sparkles size={16} className="text-[#0A66FF]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#0D1B3E] dark:text-white">Boutiques recommandées</h2>
            <p className="text-xs text-gray-400">Sélection de boutiques Premium à découvrir</p>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-3 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-44 h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {shops.map(s => (
              <a
                key={s.id}
                href={`/shop/${s.slug}`}
                className="group flex-shrink-0 w-44 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800 flex items-center justify-center text-base font-black text-[#0A66FF] overflow-hidden flex-shrink-0">
                    {s.logo ? <img src={s.logo} alt={s.name} className="w-full h-full object-cover" /> : s.name.charAt(0).toUpperCase()}
                  </div>
                  <VerifiedBadge plan="premium" size={14} />
                </div>
                <p className="font-bold text-sm text-gray-900 dark:text-white truncate mb-1">{s.name}</p>
                {s.city && (
                  <span className="text-xs text-gray-400 flex items-center gap-0.5 mb-2">
                    <MapPin size={10} />{s.city}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0A66FF] bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  <Sparkles size={10} /> Recommandé
                </span>
                <span className="mt-2 flex items-center gap-1 text-xs text-gray-400 group-hover:text-[#0A66FF] transition-colors">
                  Visiter <ArrowRight size={12} />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
