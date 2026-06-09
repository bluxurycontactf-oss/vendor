import { Store, ShoppingCart, Smartphone, BarChart3, Truck, QrCode, Globe, Tag, Bell, Repeat, Languages, Shield } from 'lucide-react';
import Card from '@/components/ui/Card';

const features = [
  { icon: <Store />, title: 'Boutique instantanée', desc: 'Créez votre boutique en 2 minutes avec votre lien unique myshoply.web.app/shop/votre-nom', color: 'blue' },
  { icon: <ShoppingCart />, title: 'Catalogue produits', desc: 'Ajoutez vos produits avec photos, prix, stock et description en quelques clics', color: 'purple' },
  { icon: <Smartphone />, title: 'Paiement Mobile Money', desc: 'Acceptez MTN MoMo, Moov Money et cartes bancaires directement sur votre boutique', color: 'green' },
  { icon: <BarChart3 />, title: 'Statistiques détaillées', desc: "Suivez vos ventes, revenus, visiteurs et produits les plus populaires en temps réel", color: 'orange' },
  { icon: <Truck />, title: 'Gestion des livraisons', desc: 'Gérez la livraison, le retrait en magasin ou votre propre système de livraison', color: 'pink' },
  { icon: <QrCode />, title: 'QR Code automatique', desc: 'Chaque boutique génère automatiquement un QR Code pour faciliter le partage', color: 'cyan' },
  { icon: <Globe />, title: 'Domaine personnalisé', desc: 'Connectez votre propre domaine (monshop.com) pour une image plus professionnelle', color: 'indigo' },
  { icon: <Tag />, title: 'Coupons & Promotions', desc: 'Créez des codes promo et promotions pour booster vos ventes rapidement', color: 'rose' },
  { icon: <Bell />, title: 'Notifications push', desc: 'Recevez une notification à chaque nouvelle commande sur votre téléphone', color: 'amber' },
  { icon: <Repeat />, title: 'Multi-devises', desc: 'Vendez en FCFA, EUR, USD et plus de 30 devises supportées automatiquement', color: 'emerald' },
  { icon: <Languages />, title: 'Multi-langues', desc: 'Votre boutique est disponible en français, anglais, arabe et plus encore', color: 'violet' },
  { icon: <Shield />, title: 'Sécurité garantie', desc: 'Données chiffrées, paiements sécurisés, conformité RGPD et protection totale', color: 'slate' },
];

const colors: Record<string, string> = {
  blue: 'bg-blue-100 text-[#0A66FF] dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400',
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#F8FAFC] dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-[#0A66FF] text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-blue-200 dark:border-blue-800">Fonctionnalités</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-4">Tout ce dont vous avez besoin<br />pour vendre en ligne</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Une plateforme complète pensée pour les commerçants africains, avec toutes les fonctionnalités pour développer votre business en ligne.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <Card key={i} hover padding="lg">
              <div className={`w-12 h-12 rounded-2xl ${colors[f.color]} flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-[#0D1B3E] dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
