'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Moon, Sun, Zap } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'Tarifs', href: '#pricing' },
    { label: 'Témoignages', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
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
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/auth/login" className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-[#0A66FF] transition-colors">Connexion</Link>
          <Link href="/auth/register">
            <Button size="sm">Créer ma boutique</Button>
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
          <Link href="/auth/login" className="text-sm font-medium text-gray-700 py-2">Connexion</Link>
        </div>
      )}
    </nav>
  );
}
