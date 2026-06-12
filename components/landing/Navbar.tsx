'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Moon, Sun, Zap, ChevronDown, BadgeCheck, ShoppingBag } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { type Lang } from '@/lib/translations';
import Button from '@/components/ui/Button';

const FLAGS: Record<Lang, string> = { fr: '🇫🇷', en: '🇬🇧', pt: '🇵🇹' };
const LANG_LABELS: Record<Lang, string> = { fr: 'FR', en: 'EN', pt: 'PT' };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const links = [
    { label: t('nav.features'), href: '#features' },
    { label: t('nav.pricing'), href: '#pricing' },
    { label: t('nav.testimonials'), href: '#testimonials' },
    { label: t('nav.faq'), href: '#faq' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-gray-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-xl text-[#0A66FF]">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          Shoply
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.label} href={l.href} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#0A66FF] dark:hover:text-blue-400 transition-colors">{l.label}</a>
          ))}
          <Link href="/produits" className="flex items-center gap-1.5 text-sm font-bold text-[#0A66FF] hover:text-[#0052CC] transition-colors">
            <ShoppingBag size={14} />
            Produits
          </Link>
          <Link href="/boutiques" className="flex items-center gap-1.5 text-sm font-bold text-[#0A66FF] hover:text-[#0052CC] transition-colors">
            <BadgeCheck size={14} />
            Boutiques
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(o => !o)}
              className="flex items-center gap-1.5 h-9 px-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
            >
              <span>{FLAGS[lang]}</span>
              <span className="hidden sm:inline">{LANG_LABELS[lang]}</span>
              <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-11 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50 min-w-[110px]">
                {(Object.keys(FLAGS) as Lang[]).map(l => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${lang === l ? 'text-[#0A66FF] font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    <span>{FLAGS[l]}</span>
                    <span>{LANG_LABELS[l]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/auth/login" className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#0A66FF] transition-colors">{t('nav.login')}</Link>
          <Link href="/auth/register">
            <Button size="sm">{t('nav.create_shop')}</Button>
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-3">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 dark:text-gray-300 py-2">{l.label}</a>
          ))}
          <Link href="/produits" onClick={() => setMenuOpen(false)} className="text-sm font-bold text-[#0A66FF] py-2 flex items-center gap-1.5">
            <ShoppingBag size={14} /> Tous les produits
          </Link>
          <Link href="/boutiques" onClick={() => setMenuOpen(false)} className="text-sm font-bold text-[#0A66FF] py-2 flex items-center gap-1.5">
            <BadgeCheck size={14} /> Boutiques certifiées
          </Link>
          <Link href="/auth/login" className="text-sm font-medium text-gray-700 py-2">{t('nav.login')}</Link>
          {/* Mobile lang switcher */}
          <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            {(Object.keys(FLAGS) as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${lang === l ? 'bg-[#0A66FF] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
              >
                {FLAGS[l]} {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
