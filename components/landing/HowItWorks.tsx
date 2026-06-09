import { UserPlus, Palette, Package, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <UserPlus size={24} />,
    title: 'Créez votre compte',
    desc: "Inscrivez-vous gratuitement en 30 secondes. Aucune carte bancaire n'est requise pour commencer.",
    color: 'blue',
  },
  {
    number: '02',
    icon: <Palette size={24} />,
    title: 'Personnalisez votre boutique',
    desc: 'Choisissez votre nom, ajoutez votre logo, votre bannière et décrivez votre activité.',
    color: 'purple',
  },
  {
    number: '03',
    icon: <Package size={24} />,
    title: 'Ajoutez vos produits',
    desc: 'Publiez vos produits avec photos, prix et stock. Vos clients peuvent commander immédiatement.',
    color: 'green',
  },
  {
    number: '04',
    icon: <TrendingUp size={24} />,
    title: 'Commencez à vendre',
    desc: 'Partagez votre lien, recevez des commandes et encaissez via Mobile Money depuis votre dashboard.',
    color: 'orange',
  },
];

const colorMap: Record<string, { bg: string; text: string; line: string }> = {
  blue: { bg: 'bg-[#0A66FF]', text: 'text-white', line: 'border-blue-200 dark:border-blue-800' },
  purple: { bg: 'bg-purple-600', text: 'text-white', line: 'border-purple-200 dark:border-purple-800' },
  green: { bg: 'bg-green-600', text: 'text-white', line: 'border-green-200 dark:border-green-800' },
  orange: { bg: 'bg-orange-500', text: 'text-white', line: 'border-orange-200 dark:border-orange-800' },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-purple-200 dark:border-purple-800">Comment ça marche</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0D1B3E] dark:text-white mb-4">Lancez-vous en 4 étapes simples</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">De zéro à votre première vente en moins d&apos;une heure, sans aucune expertise technique.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 via-green-200 to-orange-200 dark:from-blue-900 dark:via-purple-900 dark:via-green-900 dark:to-orange-900" />

          {steps.map((s, i) => {
            const c = colorMap[s.color];
            return (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className={`w-24 h-24 rounded-3xl ${c.bg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className={c.text}>{s.icon}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-black text-gray-500">{s.number}</div>
                </div>
                <h3 className="font-bold text-[#0D1B3E] dark:text-white text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
