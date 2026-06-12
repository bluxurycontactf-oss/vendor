'use client';
import { useEffect, useState } from 'react';
import { getFeaturedShops } from '@/lib/firestore';
import { Shop } from '@/types';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { ArrowRight, MapPin, ShieldCheck, BadgeCheck } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedShops().then(s => { setShops(s.slice(0, 6)); setLoading(false); });
  }, []);

  if (!loading && shops.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#F0F7FF] dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#0A66FF] animate-pulse" />
            <span className="text-xs font-bold text-[#0A66FF]">Boutiques Certifiées Business</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-3">
            Achetez en toute{' '}
            <span className="bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] bg-clip-text text-transparent">
              confiance
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm sm:text-base">
            Ces boutiques ont été vérifiées et certifiées par Shoply. Elles bénéficient d&apos;un badge officiel visible par tous vos clients.
          </p>
        </div>

        {/* Trust bar */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
          {[
            { icon: '✓', label: 'Identité vérifiée' },
            { icon: '🔒', label: 'Paiements sécurisés' },
            { icon: '⚡', label: 'Support prioritaire' },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center gap-1.5 bg-white dark:bg-gray-800 rounded-2xl py-3 px-2 shadow-sm border border-blue-100 dark:border-blue-900/30">
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 text-center">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Shops grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-36 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            {shops.map(s => (
              <a
                key={s.id}
                href={`/shop/${s.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800 flex items-center justify-center text-lg font-black text-[#0A66FF] overflow-hidden flex-shrink-0">
                  {s.logo ? <img src={s.logo} alt={s.name} className="w-full h-full object-cover" /> : s.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm text-gray-900 dark:text-white truncate">{s.name}</span>
                    <VerifiedBadge plan="business" size={16} />
                  </div>
                  {s.city && (
                    <span className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                      <MapPin size={10} />{s.city}
                    </span>
                  )}
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-[#0A66FF] transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        )}

        {/* CTA button */}
        <div className="text-center">
          <Link
            href="/boutiques"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] hover:from-[#0052CC] hover:to-[#2563EB] text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
          >
            <BadgeCheck size={18} />
            Voir toutes les boutiques certifiées
            <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
            <ShieldCheck size={12} className="text-[#0A66FF]" />
            Toutes les boutiques Business sont vérifiées par Shoply
          </p>
        </div>
      </div>
    </section>
  );
}
