'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Zap, LogOut, ExternalLink, Moon, Sun, ChevronRight, Copy, TrendingUp, Tag, Plus, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { getShopUrl, getShopDomain } from '@/lib/shopUrl';
import toast from 'react-hot-toast';
import { useState } from 'react';

// nav items built inside component using t()

export default function Sidebar() {
  const { shop, shops, user, logout, switchShop } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [shopSwitcherOpen, setShopSwitcherOpen] = useState(false);

  const canCreateShop = shop?.plan === 'business' && shops.length < 5;

  const nav = [
    { label: t('dash.nav.dashboard'), href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: t('dash.nav.products'), href: '/dashboard/products', icon: <Package size={20} /> },
    { label: t('dash.nav.orders'), href: '/dashboard/orders', icon: <ShoppingCart size={20} /> },
    { label: t('dash.nav.customers'), href: '/dashboard/customers', icon: <Users size={20} /> },
    { label: t('dash.nav.stats'), href: '/dashboard/stats', icon: <TrendingUp size={20} />, plan: 'premium' },
    { label: t('dash.nav.coupons'), href: '/dashboard/coupons', icon: <Tag size={20} />, plan: 'premium' },
    { label: t('dash.nav.settings'), href: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0D1B3E] text-white flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 font-black text-xl text-white">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          Shoply
        </Link>
      </div>

      {/* Shop info + switcher */}
      {shop && (
        <div className="p-4 mx-4 mt-4 bg-white/5 rounded-2xl">
          <button
            className="w-full flex items-center gap-3"
            onClick={() => shops.length > 1 || canCreateShop ? setShopSwitcherOpen(o => !o) : undefined}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-black text-white text-lg flex-shrink-0">
              {shop.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="font-bold text-sm text-white truncate">{shop.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${shop.plan === 'business' ? 'bg-purple-500/30 text-purple-300' : shop.plan === 'premium' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-white/10 text-white/60'}`}>
                {shop.plan === 'business' ? t('dash.plan.business') : shop.plan === 'premium' ? t('dash.plan.premium') : t('dash.plan.free')}
              </span>
            </div>
            {(shops.length > 1 || canCreateShop) && (
              <ChevronDown size={16} className={`text-white/40 transition-transform ${shopSwitcherOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Shop switcher dropdown */}
          {shopSwitcherOpen && (
            <div className="mt-3 border-t border-white/10 pt-3 flex flex-col gap-1">
              {shops.map(s => (
                <button
                  key={s.id}
                  onClick={() => { switchShop(s.id!); setShopSwitcherOpen(false); router.refresh(); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 ${s.id === shop.id ? 'bg-white/20 text-white font-semibold' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate">{s.name}</span>
                  {s.id === shop.id && <ChevronRight size={12} className="ml-auto flex-shrink-0" />}
                </button>
              ))}
              {canCreateShop && (
                <Link
                  href="/onboarding?new=1"
                  onClick={() => setShopSwitcherOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm text-blue-300 hover:bg-white/10 flex items-center gap-2 border border-dashed border-white/20 mt-1"
                >
                  <Plus size={14} /> {t('dash.nav.create_shop')} ({shops.length}/5)
                </Link>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center gap-1">
            <a href={getShopUrl(shop.slug)} target="_blank" className="flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 transition-colors truncate flex-1">
              <ExternalLink size={11} className="flex-shrink-0" />
              <span className="truncate">{getShopDomain(shop.slug)}</span>
            </a>
            <button
              onClick={() => { navigator.clipboard.writeText(getShopUrl(shop.slug)); toast.success(t('dash.nav.link_copied')); }}
              className="flex-shrink-0 text-blue-400 hover:text-white transition-colors"
            >
              <Copy size={11} />
            </button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1 mt-2">
        {nav.map(item => {
          const active = pathname === item.href;
          const locked = item.plan === 'premium' && shop?.plan === 'free';
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${active ? 'bg-[#0A66FF] text-white shadow-lg shadow-blue-500/30' : locked ? 'text-white/30 cursor-pointer hover:bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              {item.icon}
              {item.label}
              {active && <ChevronRight size={16} className="ml-auto" />}
              {locked && !active && <span className="ml-auto text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">Pro</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10 flex flex-col gap-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? t('dash.nav.light_mode') : t('dash.nav.dark_mode')}
        </button>
        {user && (
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
              {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.displayName || 'Mon compte'}</p>
              <p className="text-xs text-white/40 truncate">{user.email}</p>
            </div>
            <button onClick={logout} className="text-white/40 hover:text-red-400 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
