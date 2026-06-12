'use client';
import { Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const testimonials = [
  { name: 'Aminata Diallo', role_fr: 'Vendeuse de mode, Dakar', role_en: 'Fashion seller, Dakar', role_pt: 'Vendedora de moda, Dakar', avatar: '👩🏾‍💼', quote_fr: "Shoply a complètement transformé mon business. J'ai lancé ma boutique en une heure et j'ai eu mes 10 premières commandes le même jour !", quote_en: "Shoply completely transformed my business. I launched my shop in one hour and got my first 10 orders the same day!", quote_pt: "O Shoply transformou completamente meu negócio. Lancei minha loja em uma hora e recebi meus 10 primeiros pedidos no mesmo dia!", rating: 5, revenue: '+320 000 FCFA / mois' },
  { name: 'Kofi Mensah', role_fr: 'Restaurateur, Accra', role_en: 'Restaurant owner, Accra', role_pt: 'Restaurador, Accra', avatar: '🧑🏿‍🍳', quote_fr: "Le système de commande en ligne m'a permis de doubler mes ventes pendant le weekend. Mes clients adorent pouvoir commander depuis leur téléphone.", quote_en: "The online ordering system allowed me to double my sales over the weekend. My customers love ordering from their phone.", quote_pt: "O sistema de pedidos online me permitiu dobrar as vendas no fim de semana. Meus clientes adoram pedir pelo telefone.", rating: 5, revenue: '+680 000 FCFA / mois' },
  { name: 'Fatou Traoré', role_fr: 'Cosmétiques naturels, Abidjan', role_en: 'Natural cosmetics, Abidjan', role_pt: 'Cosméticos naturais, Abidjan', avatar: '👩🏿‍💄', quote_fr: "J'avais peur de ne pas savoir utiliser, mais c'est tellement simple. En 30 minutes ma boutique était en ligne et mes clients peuvent payer avec MoMo.", quote_en: "I was afraid I wouldn't know how to use it, but it's so simple. In 30 minutes my shop was online and customers can pay with MoMo.", quote_pt: "Tinha medo de não saber usar, mas é tão simples. Em 30 minutos minha loja estava online e os clientes pagam com MoMo.", rating: 5, revenue: '+210 000 FCFA / mois' },
  { name: 'Ibrahima Coulibaly', role_fr: 'Électronique, Bamako', role_en: 'Electronics, Bamako', role_pt: 'Eletrônicos, Bamako', avatar: '🧑🏾‍💼', quote_fr: "Les statistiques en temps réel me permettent de savoir exactement quels produits marchent le mieux. Un outil indispensable pour mon business.", quote_en: "Real-time statistics let me know exactly which products perform best. An indispensable tool for my business.", quote_pt: "As estatísticas em tempo real me permitem saber exatamente quais produtos têm melhor desempenho. Uma ferramenta indispensável.", rating: 5, revenue: '+1 200 000 FCFA / mois' },
  { name: 'Ngozi Okafor', role_fr: 'Artisane, Lagos', role_en: 'Artisan, Lagos', role_pt: 'Artesã, Lagos', avatar: '👩🏿‍🎨', quote_fr: "Je vends maintenant dans toute l'Afrique de l'Ouest ! Le lien de ma boutique est partagé sur WhatsApp et les commandes arrivent chaque jour.", quote_en: "I now sell across all of West Africa! My shop link is shared on WhatsApp and orders come in every day.", quote_pt: "Agora vendo em toda a África Ocidental! O link da minha loja é compartilhado no WhatsApp e os pedidos chegam todos os dias.", rating: 5, revenue: '+450 000 FCFA / mois' },
  { name: 'Moussa Diarra', role_fr: 'Agriculture bio, Conakry', role_en: 'Organic farming, Conakry', role_pt: 'Agricultura orgânica, Conakry', avatar: '🧑🏿‍🌾', quote_fr: "Avant je vendais seulement au marché local. Avec Shoply, mes légumes bios sont commandés à l'avance et je n'ai plus de gaspillage.", quote_en: "Before I only sold at the local market. With Shoply, my organic vegetables are pre-ordered and I have no more waste.", quote_pt: "Antes vendia apenas no mercado local. Com o Shoply, meus legumes orgânicos são encomendados com antecedência e não há desperdício.", rating: 5, revenue: '+180 000 FCFA / mois' },
];

export default function Testimonials() {
  const { lang, t } = useLanguage();

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-yellow-200 dark:border-yellow-800">{t('test.badge')}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-4">{t('test.title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('test.subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t2, i) => {
            const quote = lang === 'en' ? t2.quote_en : lang === 'pt' ? t2.quote_pt : t2.quote_fr;
            const role = lang === 'en' ? t2.role_en : lang === 'pt' ? t2.role_pt : t2.role_fr;
            return (
              <div key={i} className="bg-[#F8FAFC] dark:bg-gray-800 rounded-3xl p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex gap-0.5">
                  {[...Array(t2.rating)].map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-1 text-sm">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center text-xl">{t2.avatar}</div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-[#0D1B3E] dark:text-white">{t2.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-600 dark:text-green-400">{t2.revenue}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
