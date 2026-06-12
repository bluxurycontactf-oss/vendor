'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileNav from '@/components/dashboard/MobileNav';
import { Loader2 } from 'lucide-react';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, shop, ready } = useAuth();
  useOrderNotifications(shop);
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;                            // wait — auth + shops still loading
    if (!user)  { router.replace('/auth/login');  return; }
    if (!shop)  { router.replace('/onboarding');  return; }
  }, [ready, user, shop, router]);

  // Spinner while loading
  if (!ready || !user || !shop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <Loader2 size={40} className="text-[#0A66FF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
