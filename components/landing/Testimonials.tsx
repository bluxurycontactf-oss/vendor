import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Aminata Diallo',
    role: 'Vendeuse de mode, Dakar',
    avatar: '👩🏾‍💼',
    quote: "Vendor a complètement transformé mon business. J'ai lancé ma boutique en une heure et j'ai eu mes 10 premières commandes le même jour !",
    rating: 5,
    revenue: '+320 000 FCFA / mois',
  },
  {
    name: 'Kofi Mensah',
    role: "Restaurateur, Accra",
    avatar: '🧑🏿‍🍳',
    quote: "Le système de commande en ligne m'a permis de doubler mes ventes pendant le weekend. Mes clients adorent pouvoir commander depuis leur téléphone.",
    rating: 5,
    revenue: '+680 000 FCFA / mois',
  },
  {
    name: 'Fatou Traoré',
    role: 'Cosmétiques naturels, Abidjan',
    avatar: '👩🏿‍💄',
    quote: "J'avais peur de ne pas savoir utiliser, mais c'est tellement simple. En 30 minutes ma boutique était en ligne et mes clients peuvent payer avec MoMo.",
    rating: 5,
    revenue: '+210 000 FCFA / mois',
  },
  {
    name: 'Ibrahima Coulibaly',
    role: 'Électronique, Bamako',
    avatar: '🧑🏾‍💼',
    quote: "Les statistiques en temps réel me permettent de savoir exactement quels produits marchent le mieux. Un outil indispensable pour mon business.",
    rating: 5,
    revenue: '+1 200 000 FCFA / mois',
  },
  {
    name: 'Ngozi Okafor',
    role: 'Artisane, Lagos',
    avatar: '👩🏿‍🎨',
    quote: "Je vends maintenant dans toute l'Afrique de l'Ouest ! Le lien de ma boutique est partagé sur WhatsApp et les commandes arrivent chaque jour.",
    rating: 5,
    revenue: '+450 000 FCFA / mois',
  },
  {
    name: 'Moussa Diarra',
    role: 'Agriculture bio, Conakry',
    avatar: '🧑🏿‍🌾',
    quote: "Avant je vendais seulement au marché local. Avec Vendor, mes légumes bios sont commandés à l'avance et je n'ai plus de gaspillage.",
    rating: 5,
    revenue: '+180 000 FCFA / mois',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-yellow-200 dark:border-yellow-800">Témoignages</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-4">Ils ont transformé leur business</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Rejoignez des milliers de commerçants africains qui développent leur activité avec Shoply.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#F8FAFC] dark:bg-gray-800 rounded-3xl p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-1 text-sm">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center text-xl">{t.avatar}</div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#0D1B3E] dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-green-600 dark:text-green-400">{t.revenue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
