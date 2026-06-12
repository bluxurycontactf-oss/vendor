'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getOrders, getProducts } from '@/lib/firestore';
import { Order, Product } from '@/types';
import { TrendingUp, ShoppingCart, Package, Users, Lock } from 'lucide-react';
import Link from 'next/link';

function BarChart({ data, max, color }: { data: { label: string; value: number }[]; max: number; color: string }) {
  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-20 flex-shrink-0 text-right">{d.label}</span>
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-6 overflow-hidden">
            <div
              className={`h-full rounded-full flex items-center px-2 transition-all duration-500 ${color}`}
              style={{ width: max > 0 ? `${Math.max((d.value / max) * 100, d.value > 0 ? 8 : 0)}%` : '0%' }}
            >
              {d.value > 0 && <span className="text-xs font-bold text-white whitespace-nowrap">{d.value.toLocaleString()}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StatsPage() {
  const { shop } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) return;
    Promise.all([getOrders(shop.id!), getProducts(shop.id!)]).then(([o, p]) => {
      setOrders(o);
      setProducts(p);
      setLoading(false);
    });
  }, [shop]);

  if (shop?.plan === 'free') {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-3xl flex items-center justify-center mb-4">
          <Lock size={28} className="text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-2">Statistiques</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">Les statistiques sont disponibles à partir du plan Premium.</p>
        <Link href="/dashboard/settings" className="bg-[#0A66FF] text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity">
          Passer au Premium →
        </Link>
      </div>
    );
  }

  // Revenus par jour sur les 30 derniers jours
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d;
  });

  const revenueByDay = last30.map(date => {
    const label = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    const value = orders
      .filter(o => {
        const od = new Date(o.createdAt!);
        return od.toDateString() === date.toDateString() && o.status === 'delivered';
      })
      .reduce((s, o) => s + o.total, 0);
    return { label, value };
  });

  // Revenu des 7 derniers jours
  const last7 = revenueByDay.slice(-7);
  const maxDay = Math.max(...last7.map(d => d.value), 1);

  // Commandes par statut
  const statusCounts = [
    { label: 'En attente', value: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-400' },
    { label: 'En cours', value: orders.filter(o => o.status === 'processing').length, color: 'bg-blue-400' },
    { label: 'Expédié', value: orders.filter(o => o.status === 'shipped').length, color: 'bg-indigo-400' },
    { label: 'Livré', value: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-500' },
    { label: 'Annulé', value: orders.filter(o => o.status === 'cancelled').length, color: 'bg-red-400' },
  ];
  const maxStatus = Math.max(...statusCounts.map(s => s.value), 1);

  // Top produits par nombre de commandes
  const productRevenue: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      if (!productRevenue[item.productId]) productRevenue[item.productId] = { name: item.productName, qty: 0, revenue: 0 };
      productRevenue[item.productId].qty += item.quantity;
      productRevenue[item.productId].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.values(productRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const maxTopRev = Math.max(...topProducts.map(p => p.revenue), 1);

  // KPIs globaux
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const conversionRate = orders.length > 0 ? Math.round((orders.filter(o => o.status === 'delivered').length / orders.length) * 100) : 0;

  const kpis = [
    { label: 'Revenu total', value: totalRevenue.toLocaleString() + ' F', icon: <TrendingUp size={20} />, color: 'text-[#0A66FF] bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Total commandes', value: totalOrders.toString(), icon: <ShoppingCart size={20} />, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Panier moyen', value: avgOrder.toLocaleString() + ' F', icon: <Package size={20} />, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
    { label: 'Taux livraison', value: conversionRate + '%', icon: <Users size={20} />, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-[#0D1B3E] dark:text-white">
          {shop?.plan === 'business' ? 'Statistiques avancées' : 'Statistiques'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Vue complète de votre activité</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {kpis.map((k, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${k.color} flex items-center justify-center mb-3`}>{k.icon}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{k.label}</p>
                <p className="text-lg font-black text-[#0D1B3E] dark:text-white">{k.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Revenus 7 derniers jours */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-[#0D1B3E] dark:text-white mb-4">Revenus — 7 derniers jours</h2>
              {last7.every(d => d.value === 0) ? (
                <p className="text-sm text-gray-400 text-center py-8">Aucun revenu sur cette période</p>
              ) : (
                <BarChart data={last7} max={maxDay} color="bg-gradient-to-r from-[#0A66FF] to-[#3B82F6]" />
              )}
            </div>

            {/* Commandes par statut */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-[#0D1B3E] dark:text-white mb-4">Commandes par statut</h2>
              {orders.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Aucune commande</p>
              ) : (
                <BarChart
                  data={statusCounts.map(s => ({ label: s.label, value: s.value }))}
                  max={maxStatus}
                  color="bg-gradient-to-r from-purple-500 to-purple-400"
                />
              )}
            </div>
          </div>

          {shop?.plan === 'business' ? (
            <>
              {/* Top produits */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm mb-6">
                <h2 className="font-bold text-[#0D1B3E] dark:text-white mb-4">Top 5 produits par revenu</h2>
                {topProducts.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Aucune vente enregistrée</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {topProducts.map((p, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="w-6 text-xs font-black text-gray-400 text-center">#{i+1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{p.name}</span>
                            <span className="text-sm font-black text-[#0A66FF] ml-2 flex-shrink-0">{p.revenue.toLocaleString()} F</span>
                          </div>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                            <div className="bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(p.revenue / maxTopRev) * 100}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{p.qty} vendu(s)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Produits en rupture */}
              {products.filter(p => p.stock === 0 && p.isActive).length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-4">
                  <h2 className="font-bold text-red-700 dark:text-red-400 mb-3">Produits en rupture de stock</h2>
                  <div className="flex flex-col gap-2">
                    {products.filter(p => p.stock === 0 && p.isActive).map(p => (
                      <div key={p.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{p.name}</span>
                        <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">Rupture</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-900/30 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-bold text-purple-700 dark:text-purple-400 mb-1">Statistiques avancées</h2>
                <p className="text-sm text-purple-600/80 dark:text-purple-400/70">Top produits par revenu et alertes de rupture de stock — disponibles avec le plan Business.</p>
              </div>
              <Link href="/dashboard/settings" className="bg-purple-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm whitespace-nowrap hover:opacity-90 transition-opacity">
                Passer Business →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
