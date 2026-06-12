'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Lang } from '@/lib/translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'fr',
  setLang: () => {},
  t: (k) => k,
});

function detectLanguage(): Lang {
  if (typeof window === 'undefined') return 'fr';
  const stored = localStorage.getItem('shoply_lang') as Lang | null;
  if (stored && ['fr', 'en', 'pt'].includes(stored)) return stored;
  const browser = navigator.language.toLowerCase();
  if (browser.startsWith('pt')) return 'pt';
  if (browser.startsWith('en')) return 'en';
  return 'fr';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');

  useEffect(() => {
    setLangState(detectLanguage());
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('shoply_lang', l);
  }

  function t(key: string): string {
    const parts = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = translations[lang];
    for (const p of parts) {
      if (val == null) return key;
      val = val[p];
    }
    return typeof val === 'string' ? val : key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
