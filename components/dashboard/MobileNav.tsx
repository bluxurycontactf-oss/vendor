'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, TrendingUp, Settings } from 'lucide-react';

const nav = [
  { label: 'Accueil', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Produits', href: '/dashboard/products', icon: Package },
  { label: 'Commandes', href: '/dashboard/orders', icon: ShoppingCart },
  { label: 'Stats', href: '/dashboard/stats', icon: TrendingUp },
  { label: 'Paramètres', href: '/dashboard/settings', icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-2 py-1 safe-area-bottom">
      {nav.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-2 py-2 flex-1">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-[#0A66FF]' : 'bg-transparent'}`}>
              <Icon size={18} className={active ? 'text-white' : 'text-gray-400'} />
            </div>
            <span className={`text-xs font-semibold transition-colors ${active ? 'text-[#0A66FF]' : 'text-gray-400'}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
