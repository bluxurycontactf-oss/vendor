'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateShop } from '@/lib/firestore';
import { Store, Shield, Zap, CheckCircle2, Copy, ExternalLink, Wallet } from 'lucide-react';
import { getShopUrl, getShopDomain } from '@/lib/shopUrl';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import Link from 'next/link';

const PLANS = [
  { key: 'free', label: 'Gratuit', price: '0 FCFA', desc: '10 produits, 1 boutique' },
  { key: 'premium', label: 'Premium', price: '4 900 FCFA/mois', desc: 'Produits illimités, domaine perso' },
  { key: 'business', label: 'Business', price: '14 900 FCFA/mois', desc: '5 boutiques, multi-utilisateurs' },
];

const tabs = [
  { key: 'boutique', label: 'Boutique', icon: Store },
  { key: 'paiements', label: 'Paiements', icon: Wallet },
  { key: 'plan', label: 'Abonnement', icon: Zap },
  { key: 'securite', label: 'Sécurité', icon: Shield },
] as const;

export default function SettingsPage() {
  const { shop, refreshShop } = useAuth();
  const [tab, setTab] = useState<'boutique' | 'paiements' | 'plan' | 'securite'>('boutique');
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const [mtn, setMtn] = useState('');
  const [moov, setMoov] = useState('');
  const [wave, setWave] = useState('');
  const [orange, setOrange] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (shop) {
      setName(shop.name || '');
      setDescription(shop.description || '');
      setPhone(shop.phone || '');
      setWhatsapp(shop.whatsapp || '');
      setCity(shop.city || '');
      setCountry(shop.country || '');
      setMtn(shop.paymentMethods?.mtn || '');
      setMoov(shop.paymentMethods?.moov || '');
      setWave(shop.paymentMethods?.wave || '');
      setOrange(shop.paymentMethods?.orange || '');
      setBankName(shop.paymentMethods?.bankName || '');
      setBankAccount(shop.paymentMethods?.bankAccount || '');
      setInstructions(shop.paymentMethods?.instructions || '');
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

  const handleSavePayments = async () => {
    if (!shop) return;
    setSaving(true);
    try {
      await updateShop(shop.id!, {
        paymentMethods: {
          mtn: mtn || undefined,
          moov: moov || undefined,
          wave: wave || undefined,
          orange: orange || undefined,
          bankName: bankName || undefined,
          bankAccount: bankAccount || undefined,
          instructions: instructions || undefined,
        }
      });
      await refreshShop();
      toast.success('Moyens de paiement enregistrés');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-[#0D1B3E] dark:text-white">Paramètres</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Gérez votre boutique et votre compte</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 overflow-x-auto">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${tab === t.key ? 'bg-white dark:bg-gray-700 text-[#0A66FF] shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Boutique */}
      {tab === 'boutique' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-bold text-[#0D1B3E] dark:text-white">Informations</h2>
            <Input label="Nom de la boutique" value={name} onChange={e => setName(e.target.value)} />
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#0A66FF] resize-none text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Ville" value={city} onChange={e => setCity(e.target.value)} />
              <Input label="Pays" value={country} onChange={e => setCountry(e.target.value)} />
            </div>
            <Input label="Téléphone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
            <Input label="WhatsApp" type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
          </div>

          {shop && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="font-bold text-[#0D1B3E] dark:text-white mb-1">Lien de votre boutique</h2>
              <p className="text-xs text-gray-500 mb-3">Partagez ce lien avec vos clients</p>
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-3">
                <code className="flex-1 text-xs sm:text-sm font-mono text-[#0A66FF] font-bold break-all">{getShopDomain(shop.slug)}</code>
                <button onClick={() => { navigator.clipboard.writeText(getShopUrl(shop.slug)); toast.success('Lien copié !'); }}
                  className="flex-shrink-0 w-9 h-9 bg-[#0A66FF] text-white rounded-xl flex items-center justify-center">
                  <Copy size={14} />
                </button>
              </div>
              <a href={getShopUrl(shop.slug)} target="_blank" className="mt-2 inline-flex items-center gap-1 text-xs text-[#0A66FF] hover:underline font-medium">
                <ExternalLink size={12} /> Ouvrir ma boutique
              </a>
            </div>
          )}

          <Button onClick={handleSave} loading={saving} fullWidth>Enregistrer les modifications</Button>
        </div>
      )}

      {/* Tab: Paiements */}
      {tab === 'paiements' && (
        <div className="flex flex-col gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Ajoutez vos numéros de paiement. Vos clients verront ces options au moment de commander.
            </p>
          </div>

          {/* Mobile Money */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-bold text-[#0D1B3E] dark:text-white flex items-center gap-2">
              <span className="text-xl">📱</span> Mobile Money
            </h2>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-yellow-600 uppercase tracking-wide">MTN Mobile Money</label>
              <Input placeholder="+229 96 XX XX XX" value={mtn} onChange={e => setMtn(e.target.value)} type="tel" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-blue-600 uppercase tracking-wide">Moov Money</label>
              <Input placeholder="+229 99 XX XX XX" value={moov} onChange={e => setMoov(e.target.value)} type="tel" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-teal-600 uppercase tracking-wide">Wave</label>
              <Input placeholder="+221 XX XX XX XX" value={wave} onChange={e => setWave(e.target.value)} type="tel" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-orange-600 uppercase tracking-wide">Orange Money</label>
              <Input placeholder="+229 97 XX XX XX" value={orange} onChange={e => setOrange(e.target.value)} type="tel" />
            </div>
          </div>

          {/* Virement bancaire */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-bold text-[#0D1B3E] dark:text-white flex items-center gap-2">
              <span className="text-xl">🏦</span> Virement bancaire
            </h2>
            <Input label="Nom de la banque" placeholder="Ex : UBA, BGFIBANK..." value={bankName} onChange={e => setBankName(e.target.value)} />
            <Input label="Numéro de compte / IBAN" placeholder="BJ XX XXXX XXXX..." value={bankAccount} onChange={e => setBankAccount(e.target.value)} />
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm">
            <h2 className="font-bold text-[#0D1B3E] dark:text-white mb-3 flex items-center gap-2">
              <span className="text-xl">📝</span> Instructions personnalisées
            </h2>
            <textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              rows={3}
              placeholder="Ex : Envoyez le paiement au +229 96 XX XX XX puis envoyez la capture sur WhatsApp..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#0A66FF] resize-none text-sm"
            />
          </div>

          <Button onClick={handleSavePayments} loading={saving} fullWidth>Enregistrer les moyens de paiement</Button>
        </div>
      )}

      {/* Tab: Plan */}
      {tab === 'plan' && (
        <div className="flex flex-col gap-3">
          {PLANS.map(plan => {
            const isActive = shop?.plan === plan.key;
            return (
              <div key={plan.key} className={`bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm flex items-center gap-4 ${isActive ? 'border-2 border-[#0A66FF]' : 'border-2 border-transparent'}`}>
                <div className="flex-1">
                  {isActive && <div className="flex items-center gap-1 text-[#0A66FF] text-xs font-bold mb-1"><CheckCircle2 size={12} /> Plan actuel</div>}
                  <h3 className="font-black text-gray-900 dark:text-white">{plan.label}</h3>
                  <p className="text-[#0A66FF] font-black text-sm">{plan.price}</p>
                  <p className="text-xs text-gray-500">{plan.desc}</p>
                </div>
                {!isActive && <Link href="/contact"><Button variant="outline" size="sm">Choisir</Button></Link>}
              </div>
            );
          })}
          <p className="text-xs text-gray-400 text-center mt-2">Annulation possible à tout moment.</p>
        </div>
      )}

      {/* Tab: Sécurité */}
      {tab === 'securite' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Mot de passe</p>
              <p className="text-xs text-gray-400">Changez votre mot de passe</p>
            </div>
            <Button variant="outline" size="sm">Modifier</Button>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Notifications</p>
              <p className="text-xs text-gray-400">Alerte à chaque nouvelle commande</p>
            </div>
            <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end pr-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-4 border border-red-100 dark:border-red-900/30 flex items-center justify-between">
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Supprimer le compte</p>
              <p className="text-xs text-red-500/80">Action irréversible</p>
            </div>
            <Button variant="danger" size="sm">Supprimer</Button>
          </div>
        </div>
      )}
    </div>
  );
}
