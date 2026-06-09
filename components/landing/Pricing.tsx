'use client';
import { Check, Zap, Star, Building2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const plans = [
  {
    name: 'Gratuit',
    icon: <Zap size={20} />,
    price: '0',
    period: '',
    desc: 'Parfait pour démarrer et tester la plateforme.',
    color: 'gray',
    features: [
      '10 produits maximum',
      '1 boutique en ligne',
      'Paiement Mobile Money',
      'Lien boutique unique',
      'Tableau de bord basique',
      'Support par email',
    ],
    cta: 'Commencer gratuitement',
    href: '/auth/register',
    popular: false,
  },
  {
    name: 'Premium',
    icon: <Star size={20} />,
    price: '4 900',
    period: '/ mois',
    desc: 'Pour les commerçants sérieux qui veulent se développer.',
    color: 'blue',
    features: [
      'Produits illimités',
      '1 boutique en ligne',
      'Paiement Mobile Money + Carte',
      'Domaine personnalisé',
      'QR Code automatique',
      'Statistiques avancées',
      'Coupons & promotions',
      'Notifications push',
      'Support prioritaire',
    ],
    cta: 'Démarrer Premium',
    href: '/auth/register?plan=premium',
    popular: true,
  },
  {
    name: 'Business',
    icon: <Building2 size={20} />,
    price: '14 900',
    period: '/ mois',
    desc: "Pour les entreprises avec plusieurs boutiques et équipes.",
    color: 'purple',
    features: [
      'Tout du plan Premium',
      '5 boutiques simultanées',
      'Multi-utilisateurs (5)',
      'Accès API complet',
      'Export CSV / Excel',
      'Multi-devises avancé',
      'Intégrations (Zapier, etc.)',
      'Manager de compte dédié',
      'SLA 99.9% garanti',
    ],
    cta: 'Contacter les ventes',
    href: '/contact',
    popular: false,
  },
];

const colorMap: Record<string, { badge: string; btn: string; ring: string; icon: string }> = {
  gray: {
    badge: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    btn: '',
    ring: 'border-gray-200 dark:border-gray-700',
    icon: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  },
  blue: {
    badge: 'bg-[#0A66FF] text-white',
    btn: '',
    ring: 'border-[#0A66FF] shadow-xl shadow-blue-500/20',
    icon: 'bg-[#0A66FF] text-white',
  },
  purple: {
    badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    btn: '',
    ring: 'border-purple-200 dark:border-purple-700',
    icon: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  },
};

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-[#F8FAFC] dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-green-200 dark:border-green-800">Tarifs</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-4">Des prix simples et transparents</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Commencez gratuitement. Passez au niveau supérieur quand vous êtes prêt. Aucun frais caché.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const c = colorMap[plan.color];
            return (
              <div key={i} className={`relative bg-white dark:bg-gray-900 rounded-3xl border-2 ${c.ring} p-8 flex flex-col`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg">Le plus populaire</span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-2xl ${c.icon} flex items-center justify-center mb-5`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{plan.desc}</p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-[#0D1B3E] dark:text-white">{plan.price}</span>
                  {plan.price !== '0' && <span className="text-lg text-gray-400"> FCFA</span>}
                  {plan.price === '0' && <span className="text-lg font-bold text-gray-500"> FCFA</span>}
                  <span className="text-sm text-gray-400 ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={11} className="text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button variant={plan.popular ? 'primary' : 'outline'} fullWidth>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">Tous les prix sont en FCFA. Annulez à tout moment sans frais.</p>
      </div>
    </section>
  );
}
