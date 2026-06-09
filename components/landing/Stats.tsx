import { Store, Package, ShoppingCart, Users } from 'lucide-react';

const stats = [
  { icon: <Store size={24} />, value: '10 000+', label: 'Boutiques actives', color: 'blue' },
  { icon: <Package size={24} />, value: '100 000+', label: 'Produits en vente', color: 'purple' },
  { icon: <ShoppingCart size={24} />, value: '1 000 000+', label: 'Commandes traitées', color: 'green' },
  { icon: <Users size={24} />, value: '500 000+', label: 'Clients satisfaits', color: 'orange' },
];

const colors: Record<string, string> = {
  blue: 'bg-blue-100 text-[#0A66FF] dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
};

export default function Stats() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center group">
              <div className={`w-14 h-14 rounded-2xl ${colors[s.color]} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {s.icon}
              </div>
              <div className="text-3xl font-black text-[#0D1B3E] dark:text-white mb-1">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
