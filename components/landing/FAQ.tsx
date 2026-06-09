'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Comment créer ma boutique en ligne ?',
    a: "Créez un compte gratuitement, choisissez le nom de votre boutique, ajoutez votre logo et commencez à publier vos produits. Votre boutique est accessible immédiatement sur l'URL myshoply.web.app/shop/votre-nom.",
  },
  {
    q: 'Quels moyens de paiement puis-je accepter ?',
    a: "Sur le plan gratuit, vous acceptez les paiements MTN Mobile Money. Sur les plans payants, vous pouvez également accepter Moov Money, les cartes Visa/Mastercard et les virements bancaires.",
  },
  {
    q: 'Puis-je utiliser mon propre nom de domaine ?',
    a: "Oui, à partir du plan Premium vous pouvez connecter votre propre domaine (ex: monshop.com) à votre boutique Shoply. La configuration prend moins de 5 minutes.",
  },
  {
    q: 'Y a-t-il des frais sur les transactions ?',
    a: "Vendor ne prélève aucune commission sur vos ventes. Les seuls frais sont les frais de transaction Mobile Money standards appliqués par les opérateurs (MTN, Moov, etc.).",
  },
  {
    q: 'Puis-je vendre en dehors de mon pays ?',
    a: "Absolument ! Votre boutique est accessible depuis partout dans le monde. Vous pouvez configurer plusieurs devises, des zones de livraison différentes et accepter des clients internationaux.",
  },
  {
    q: "Que se passe-t-il si je dépasse la limite de 10 produits du plan gratuit ?",
    a: "Vous ne pourrez plus ajouter de nouveaux produits jusqu'à ce que vous passiez au plan Premium ou supprimiez des produits existants. Vos produits actuels et votre boutique restent actifs.",
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: "Oui. Toutes vos données sont chiffrées et stockées de façon sécurisée sur les serveurs Firebase de Google. Nous sommes conformes au RGPD et ne vendons jamais vos données.",
  },
  {
    q: 'Puis-je annuler mon abonnement à tout moment ?',
    a: "Oui, sans frais d'annulation ni engagement. Si vous annulez, vous conservez votre boutique et vos produits mais avec les limitations du plan gratuit.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-[#F8FAFC] dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-cyan-200 dark:border-cyan-800">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-4">Questions fréquentes</h2>
          <p className="text-gray-500 dark:text-gray-400">Tout ce que vous devez savoir avant de vous lancer.</p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-[#0D1B3E] dark:text-white pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-gray-400 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
