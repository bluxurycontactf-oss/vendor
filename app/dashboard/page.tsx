'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getOrders, getProducts } from '@/lib/firestore';
import { Order, Product } from '@/types';
import { TrendingUp, ShoppingCart, Package, Users, ArrowUpRight, Clock, CheckCircle2, Copy } from 'lucide-react';
import { getShopUrl, getShopDomain } from '@/lib/shopUrl';
import toast from 'react-hot-toast';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function DashboardPage() {
  const { user, shop } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shop) return;
    setLoading(true);
    Promise.all([getOrders(shop.id!), getProducts(shop.id!)]).then(([o, p]) => {
      setOrders(o);
      setProducts(p);
      setLoading(false);
    });
  }, [shop]);

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const thisMonth = orders.filter(o => {
    const d = new Date(o.createdAt!);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthRevenue = thisMonth.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: 'Revenus totaux',    value: totalRevenue.toLocaleString('fr-FR') + ' FCFA', icon: <TrendingUp size={22} />,  color: 'blue',   trend: '+12%' },
    { label: 'Ce mois-ci',        value: monthRevenue.toLocaleString('fr-FR') + ' FCFA', icon: <ArrowUpRight size={22} />, color: 'green',  trend: '+8%' },
    { label: 'Commandes totales', value: orders.length.toString(),                        icon: <ShoppingCart size={22} />, color: 'purple', trend: `${pendingOrders} en attente` },
    { label: 'Produits actifs',   value: products.filter(p => p.isActive).length.toString(), icon: <Package size={22} />, color: 'orange', trend: `${products.length} au total` },
  ];

  const colorMap: Record<string, string> = {
    blue:   'bg-blue-100 text-[#0A66FF] dark:bg-blue-900/30 dark:text-blue-400',
    green:  'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  };

  const statusLabel: Record<string, { label: string; variant: 'yellow' | 'blue' | 'green' | 'red' | 'gray' }> = {
    pending:    { label: 'En attente', variant: 'yellow' },
    processing: { label: 'En cours',   variant: 'blue'   },
    shipped:    { label: 'Expédié',    variant: 'blue'   },
    delivered:  { label: 'Livré',      variant: 'green'  },
    cancelled:  { label: 'Annulé',     variant: 'red'    },
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0D1B3E] dark:text-white mb-1">
          Bonjour, {user?.displayName?.split(' ')[0] || 'vendeur'} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Voici un aperçu de votre boutique <strong>{shop?.name}</strong>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((s, i) => (
          <Card key={i} padding="lg">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-2xl ${colorMap[s.color]} flex items-center justify-center`}>{s.icon}</div>
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">{s.trend}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
            <p className="text-xl font-black text-[#0D1B3E] dark:text-white">{loading ? '...' : s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2">
          <Card padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-[#0D1B3E] dark:text-white">Dernières commandes</h2>
              <a href="/dashboard/orders" className="text-sm text-[#0A66FF] hover:underline font-medium">Voir tout</a>
            </div>
            {loading ? (
              <div className="flex flex-col gap-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">Aucune commande pour l&apos;instant</p>
                <p className="text-sm text-gray-400 mt-1">Partagez votre boutique pour recevoir vos premières commandes !</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {orders.slice(0, 6).map(o => (
                  <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        {o.status === 'delivered' ? <CheckCircle2 size={16} className="text-green-600" /> : <Clock size={16} className="text-[#0A66FF]" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{o.customerName}</p>
                        <p className="text-xs text-gray-400">{o.items.length} article(s)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#0D1B3E] dark:text-white">{o.total.toLocaleString()} F</p>
                      <Badge variant={statusLabel[o.status]?.variant || 'gray'} size="sm">{statusLabel[o.status]?.label || o.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          {/* Top products */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-[#0D1B3E] dark:text-white">Produits en vedette</h2>
              <a href="/dashboard/products" className="text-sm text-[#0A66FF] hover:underline font-medium">Gérer</a>
            </div>
            {loading ? (
              <div className="flex flex-col gap-3">{[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-6">
                <Package size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Ajoutez vos premiers produits</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {products.slice(0, 4).map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl flex items-center justify-center text-base">
                      {p.images?.[0] ? '🖼️' : '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">Stock: {p.stock}</p>
                    </div>
                    <p className="text-sm font-bold text-[#0A66FF]">{p.price.toLocaleString()} F</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Share link */}
          {shop && (
            <Card padding="lg" className="bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] text-white">
              <Users size={24} className="mb-3 opacity-80" />
              <h3 className="font-bold mb-1">Partagez votre boutique</h3>
              <p className="text-sm opacity-80 mb-4">Votre lien unique</p>
              <div className="bg-white/20 rounded-xl px-3 py-2 text-xs font-mono break-all mb-3">
                {getShopDomain(shop.slug)}
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(getShopUrl(shop.slug)); toast.success('Lien copié !'); }}
                className="flex items-center gap-2 w-full justify-center bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <Copy size={12} /> Copier le lien
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
