'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCustomers } from '@/lib/firestore';
import { Customer } from '@/types';
import { Users, Search, Phone, MapPin, ShoppingBag } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function CustomersPage() {
  const { shop } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!shop) return;
    setLoading(true);
    getCustomers(shop.id!).then(data => { setCustomers(data); setLoading(false); });
  }, [shop]);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0D1B3E] dark:text-white">Clients</h1>
        <p className="text-gray-500 dark:text-gray-400">{customers.length} client(s) enregistré(s)</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Rechercher un client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#0A66FF] text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-36 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Aucun client</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Vos clients apparaîtront ici quand ils passeront leurs premières commandes</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <Card key={c.id} hover padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center font-black text-[#0A66FF] text-lg">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-[#0D1B3E] dark:text-white">{c.name}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Phone size={11} /> {c.phone}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {c.address && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <MapPin size={13} /> <span className="truncate">{c.address}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <ShoppingBag size={13} /> {c.totalOrders} commande(s)
                  </div>
                  <span className="text-xs font-bold text-[#0A66FF]">{c.totalSpent.toLocaleString()} F</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
