'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateShop } from '@/lib/firestore';
import { Store, Bell, Shield, Zap, CheckCircle2, Copy } from 'lucide-react';
import { getShopUrl, getShopDomain } from '@/lib/shopUrl';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import Link from 'next/link';

const PLANS = [
  { key: 'free', label: 'Gratuit', price: '0 FCFA', desc: '10 produits, 1 boutique', color: 'gray' },
  { key: 'premium', label: 'Premium', price: '4 900 FCFA/mois', desc: 'Produits illimités, domaine perso', color: 'blue' },
  { key: 'business', label: 'Business', price: '14 900 FCFA/mois', desc: '5 boutiques, multi-utilisateurs, API', color: 'purple' },
];

export default function SettingsPage() {
  const { shop, refreshShop } = useAuth();
  const [tab, setTab] = useState<'boutique' | 'plan' | 'securite'>('boutique');
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (shop) {
      setName(shop.name || '');
      setDescription(shop.description || '');
      setPhone(shop.phone || '');
      setWhatsapp(shop.whatsapp || '');
      setCity(shop.city || '');
      setCountry(shop.country || '');
    }
  }, [shop]);

  const handleSave = async () => {
    if (!shop) return;
    setSaving(true);
    try {
      await updateShop(shop.id!, { name, description, phone, whatsapp, city, country });
      await refreshShop();
      toast.success('Paramètres enregistrés');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: 'boutique', label: 'Ma boutique', icon: <Store size={16} /> },
    { key: 'plan', label: 'Abonnement', icon: <Zap size={16} /> },
    { key: 'securite', label: 'Sécurité', icon: <Shield size={16} /> },
  ] as const;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0D1B3E] dark:text-white">Paramètres</h1>
        <p className="text-gray-500 dark:text-gray-400">Gérez votre boutique et votre compte</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-800">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${tab === t.key ? 'border-[#0A66FF] text-[#0A66FF]' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Boutique */}
      {tab === 'boutique' && (
        <div className="max-w-2xl flex flex-col gap-6">
          <Card padding="lg">
            <h2 className="font-bold text-[#0D1B3E] dark:text-white mb-5">Informations de la boutique</h2>
            <div className="flex flex-col gap-4">
              <Input label="Nom de la boutique" value={name} onChange={e => setName(e.target.value)} />
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#0A66FF] resize-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Ville" value={city} onChange={e => setCity(e.target.value)} />
                <Input label="Pays" value={country} onChange={e => setCountry(e.target.value)} />
              </div>
              <Input label="Téléphone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
              <Input label="WhatsApp" type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
            </div>
          </Card>

          {shop && (
            <Card padding="lg">
              <h2 className="font-bold text-[#0D1B3E] dark:text-white mb-2">Lien de votre boutique</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Votre domaine unique — partagez-le avec vos clients</p>
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                <code className="flex-1 text-sm font-mono text-[#0A66FF] font-bold break-all">{getShopDomain(shop.slug)}</code>
                <button
                  onClick={() => { navigator.clipboard.writeText(getShopUrl(shop.slug)); toast.success('Lien copié !'); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#0A66FF] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity flex-shrink-0"
                >
                  <Copy size={14} /> Copier
                </button>
              </div>
              <a href={getShopUrl(shop.slug)} target="_blank" className="mt-3 inline-flex items-center gap-1 text-sm text-[#0A66FF] hover:underline font-medium">
                Ouvrir ma boutique →
              </a>
            </Card>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} loading={saving}>Enregistrer les modifications</Button>
          </div>
        </div>
      )}

      {/* Tab: Plan */}
      {tab === 'plan' && (
        <div className="max-w-4xl">
          <div className="grid md:grid-cols-3 gap-5">
            {PLANS.map(plan => {
              const isActive = shop?.plan === plan.key;
              return (
                <Card key={plan.key} padding="lg" className={isActive ? 'border-2 border-[#0A66FF] dark:border-[#0A66FF]' : ''}>
                  {isActive && (
                    <div className="flex items-center gap-1.5 text-[#0A66FF] text-xs font-bold mb-3">
                      <CheckCircle2 size={14} /> Plan actuel
                    </div>
                  )}
                  <h3 className="font-black text-[#0D1B3E] dark:text-white text-lg mb-1">{plan.label}</h3>
                  <p className="text-2xl font-black text-[#0A66FF] mb-1">{plan.price}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{plan.desc}</p>
                  {!isActive && (
                    <Link href="/contact">
                      <Button variant="outline" fullWidth size="sm">Passer à ce plan</Button>
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>
          <p className="text-sm text-gray-400 mt-6 text-center">Pour changer de plan, contactez notre équipe. Annulation possible à tout moment.</p>
        </div>
      )}

      {/* Tab: Sécurité */}
      {tab === 'securite' && (
        <div className="max-w-2xl">
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <Shield size={22} className="text-[#0A66FF]" />
              </div>
              <div>
                <h2 className="font-bold text-[#0D1B3E] dark:text-white">Sécurité du compte</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gérez la sécurité de votre compte</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Mot de passe</p>
                  <p className="text-xs text-gray-400">Changez votre mot de passe de connexion</p>
                </div>
                <Button variant="outline" size="sm">Modifier</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Notifications</p>
                  <p className="text-xs text-gray-400">Recevoir une alerte à chaque nouvelle commande</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end pr-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Supprimer le compte</p>
                  <p className="text-xs text-red-500/80">Cette action est irréversible</p>
                </div>
                <Button variant="danger" size="sm">Supprimer</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
