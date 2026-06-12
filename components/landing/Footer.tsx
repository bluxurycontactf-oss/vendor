'use client';
import Link from 'next/link';
import { Zap, Share2, MessagesSquare, Camera, Briefcase, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

const socials = [
  { icon: <Share2 size={18} />, href: '#', label: 'Twitter' },
  { icon: <MessagesSquare size={18} />, href: '#', label: 'Facebook' },
  { icon: <Camera size={18} />, href: '#', label: 'Instagram' },
  { icon: <Briefcase size={18} />, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  const { lang, t } = useLanguage();
  const L = translations[lang].foot.links;
  const S = translations[lang].foot.sections;

  const links = {
    [S.product]: [
      { label: L.features, href: '#features' },
      { label: L.pricing, href: '#pricing' },
      { label: L.testimonials, href: '#testimonials' },
      { label: L.updates, href: '/changelog' },
    ],
    [S.resources]: [
      { label: L.docs, href: '/docs' },
      { label: L.blog, href: '/blog' },
      { label: L.tutorials, href: '/tutorials' },
      { label: L.help, href: '/help' },
    ],
    [S.company]: [
      { label: L.about, href: '/about' },
      { label: L.careers, href: '/careers' },
      { label: L.partners, href: '/partners' },
      { label: L.contact, href: '/contact' },
    ],
    [S.legal]: [
      { label: L.terms, href: '/terms' },
      { label: L.privacy, href: '/privacy' },
      { label: L.cookies, href: '/cookies' },
      { label: L.mentions, href: '/legal' },
    ],
  };

  return (
    <footer className="bg-[#0D1B3E] text-white">
      {/* CTA Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black mb-2">{t('foot.cta_title')}</h2>
            <p className="text-blue-200">{t('foot.cta_subtitle')}</p>
          </div>
          <Link href="/auth/register" className="flex-shrink-0 bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30">
            {t('foot.cta_btn')}
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-6 gap-8">
          {/* Brand col */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-black text-xl mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] rounded-xl flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              Shoply
            </Link>
            <p className="text-sm text-blue-200/70 leading-relaxed mb-6">{t('foot.tagline')}</p>
            <div className="flex flex-col gap-2 text-sm text-blue-200/60">
              <div className="flex items-center gap-2"><Mail size={14} /><span>support@myshoply.web.app</span></div>
              <div className="flex items-center gap-2"><Phone size={14} /><span>+229 01 XX XX XX</span></div>
              <div className="flex items-center gap-2"><MapPin size={14} /><span>Cotonou, Bénin</span></div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-bold text-sm mb-4 text-white">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-blue-200/60 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-200/50">{t('foot.copyright')}</p>
          <div className="flex items-center gap-3">
            {socials.map((s, i) => (
              <a key={i} href={s.href} aria-label={s.label} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-blue-200/60 hover:text-white transition-all">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
