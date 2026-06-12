'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, Store, MapPin, FileText, Check, ArrowRight, ArrowLeft, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createShop, isSlugAvailable } from '@/lib/firestore';
import { openFedaPayCheckout } from '@/lib/fedapay';
import { activatePlan, processReferral } from '@/lib/api';
import { getShopDomain } from '@/lib/shopUrl';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const PLANS = [
  {
    key: 'free' as const,
    label: 'Gratuit',
    price: '0 FCFA',
    period: '',
    features: ['10 produits maximum', '1 boutique', 'Lien boutique Shoply', 'Protection anti-arnaque'],
  },
  {
    key: 'premium' as const,
    label: 'Premium',
    price: '4 900 FCFA',
    period: '/mois',
    popular: true,
    features: ['Produits illimités', 'Paiement Mobile Money', 'QR Code boutique', 'Mise en avant légère', 'Statistiques'],
  },
  {
    key: 'business' as const,
    label: 'Business',
    price: '14 900 FCFA',
    period: '/mois',
    features: ['Tout Premium inclus', 'Publicité sur Shoply', 'Outils marketing', 'Statistiques avancées', '5 livraisons gratuites/mois', 'Support prioritaire'],
  },
];

const CATEGORIES = ['Mode & Vêtements', 'Alimentation', 'Électronique', 'Beauté & Cosmétiques', 'Maison & Déco', 'Sport', 'Autre'];

function OnboardingContent() {
  const { user, shop, shops, ready, refreshShop } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewShop = searchParams.get('new') === '1';

  // Steps: for new additional shop skip plan step (inherits existing plan)
  const STEPS = isNewShop
    ? ['Boutique', 'Localisation', 'Description', 'Confirmation']
    : ['Boutique', 'Plan', 'Localisation', 'Description', 'Confirmation'];

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 0 — name
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugOk, setSlugOk] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  // Step 1 — plan (skipped for isNewShop)
  const initialPlan = searchParams.get('plan');
  const [plan, setPlan] = useState<'free' | 'premium' | 'business'>(
    initialPlan === 'premium' || initialPlan === 'business' ? initialPlan : 'free'
  );

  // Location step
  const [country, setCountry] = useState('Bénin');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Description step
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  // Redirect if user already has a shop (and not adding a new one)
  useEffect(() => {
    if (ready && shop && !isNewShop) router.replace('/dashboard');
  }, [ready, shop, isNewShop, router]);

  const toSlug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const checkSlug = async (s: string) => {
    if (s.length < 3) return;
    setChecking(true); setSlugOk(null);
    setSlugOk(await isSlugAvailable(s));
    setChecking(false);
  };

  const onNameChange = async (v: string) => {
    setName(v);
    const s = toSlug(v);
    setSlug(s);
    await checkSlug(s);
  };

  const onSlugChange = async (v: string) => {
    const s = toSlug(v);
    setSlug(s);
    await checkSlug(s);
  };

  // Map step index → content key (accounts for isNewShop skipping plan)
  const stepKey = (i: number) => STEPS[i];

  const canNext = () => {
    const key = stepKey(step);
    if (key === 'Boutique')      return name.length >= 2 && slug.length >= 3 && slugOk === true;
    if (key === 'Plan')          return true; // always has a default
    if (key === 'Localisation')  return city.length >= 2 && phone.length >= 8;
    if (key === 'Description')   return description.length >= 10 && !!category;
    return true;
  };

  const doCreateShop = async (chosenPlan: 'free' | 'premium' | 'business', transactionId?: string) => {
    if (!user) return;
    setSaving(true);
    try {
      // La boutique est toujours créée au plan Gratuit. Si un plan payant
      // a été choisi (et payé via FedaPay), il est activé ensuite par le
      // backend après vérification du paiement.
      const shopId = await createShop({
        ownerId: user.uid,
        ownerEmail: user.email || '',
        name, slug, description, category,
        country, city, phone,
        whatsapp: whatsapp || phone,
        logo: '', banner: '',
        plan: 'free',
        isActive: true,
      });

      if (chosenPlan !== 'free' && transactionId) {
        try {
          await activatePlan(shopId, chosenPlan, transactionId);
        } catch { /* non-blocking — l'utilisateur pourra réessayer dans Paramètres */ }
      }

      // Process pending referral from localStorage
      const pendingRef = localStorage.getItem('pendingRefCode');
      if (pendingRef) {
        try {
          await processReferral(pendingRef);
        } catch { /* non-blocking */ }
        localStorage.removeItem('pendingRefCode');
      }

      await refreshShop();
      toast.success('Boutique créée !');
      router.replace('/dashboard');
    } catch {
      toast.error('Erreur lors de la création');
      setSaving(false);
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    if (isNewShop && shop?.plan !== 'business') {
      toast.error('Les boutiques multiples nécessitent le plan Business'); return;
    }
    if (isNewShop && shops.length >= 5) {
      toast.error('Limite de 5 boutiques atteinte'); return;
    }

    const chosenPlan = isNewShop ? (shop?.plan || 'business') : plan;

    // Free plan: create directly
    if (chosenPlan === 'free') {
      await doCreateShop('free');
      return;
    }

    // Paid plan: payment first
    setSaving(true);
    try {
      await openFedaPayCheckout({
        plan: chosenPlan as 'premium' | 'business',
        customerEmail: user.email || '',
        onSuccess: async (transactionId) => {
          await doCreateShop(chosenPlan, transactionId);
        },
        onCancel: () => {
          toast('Paiement annulé — boutique non créée.');
          setSaving(false);
        },
        onError: (msg) => {
          toast.error(msg);
          setSaving(false);
        },
      });
    } catch {
      toast.error('Erreur de connexion à FedaPay');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F7FF] via-white to-[#EAF3FF] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex items-center gap-2 font-black text-xl text-[#0A66FF] mb-10 justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          Shoply
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0
                ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-[#0A66FF] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 ${i < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl shadow-blue-900/5">

          {/* Boutique */}
          {stepKey(step) === 'Boutique' && (
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-5">
                <Store size={24} className="text-[#0A66FF]" />
              </div>
              <h2 className="text-2xl font-black text-[#0D1B3E] dark:text-white mb-1">Nommez votre boutique</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Choisissez un nom mémorable pour votre boutique en ligne.</p>
              <div className="flex flex-col gap-5">
                <Input
                  label="Nom de la boutique"
                  placeholder="Ex : AfriShop, MonMarché, BijouAfrica..."
                  value={name}
                  onChange={e => onNameChange(e.target.value)}
                  required
                />
                <div>
                  <Input
                    label="Adresse de votre boutique"
                    placeholder="ma-boutique"
                    value={slug}
                    onChange={e => onSlugChange(e.target.value)}
                    hint={`Votre lien : ${getShopDomain(slug || 'ma-boutique')}`}
                  />
                  {slug.length >= 3 && (
                    <p className={`mt-1.5 text-sm font-medium ${checking ? 'text-gray-400' : slugOk ? 'text-green-600' : 'text-red-500'}`}>
                      {checking ? 'Vérification...' : slugOk ? '✓ Disponible' : '✗ Déjà pris, choisissez un autre'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Plan */}
          {stepKey(step) === 'Plan' && (
            <div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mb-5">
                <Crown size={24} className="text-yellow-600" />
              </div>
              <h2 className="text-2xl font-black text-[#0D1B3E] dark:text-white mb-1">Choisissez votre plan</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Vous pouvez changer de plan à tout moment depuis les paramètres.</p>
              <div className="flex flex-col gap-3">
                {PLANS.map(p => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setPlan(p.key)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                      plan === p.key
                        ? p.key === 'business' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : p.key === 'premium' ? 'border-[#0A66FF] bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-400 bg-gray-50 dark:bg-gray-800'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900 dark:text-white">{p.label}</span>
                        {'popular' in p && <span className="text-[10px] bg-[#0A66FF] text-white font-bold px-2 py-0.5 rounded-full">POPULAIRE</span>}
                      </div>
                      <div className="text-right">
                        <span className="font-black text-gray-900 dark:text-white text-sm">{p.price}</span>
                        <span className="text-xs text-gray-400">{p.period}</span>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {p.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Check size={11} className={plan === p.key ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
              {plan !== 'free' && (
                <p className="text-xs text-gray-400 mt-3 text-center">Le paiement sera effectué après la création de votre boutique.</p>
              )}
            </div>
          )}

          {/* Localisation */}
          {stepKey(step) === 'Localisation' && (
            <div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-5">
                <MapPin size={24} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-[#0D1B3E] dark:text-white mb-1">Localisation & Contact</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Ces informations seront visibles par vos clients.</p>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Pays</label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#0A66FF]"
                  >
                    {["Bénin","Côte d'Ivoire","Sénégal","Mali","Burkina Faso","Niger","Togo","Ghana","Nigeria","Cameroun","Autre"].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Input label="Ville" placeholder="Ex : Cotonou, Dakar, Abidjan..." value={city} onChange={e => setCity(e.target.value)} required />
                <Input label="Numéro de téléphone" type="tel" placeholder="+229 01 XX XX XX" value={phone} onChange={e => setPhone(e.target.value)} required />
                <Input label="WhatsApp (optionnel)" type="tel" placeholder="+229 01 XX XX XX" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} hint="Laissez vide pour utiliser le même numéro" />
              </div>
            </div>
          )}

          {/* Description */}
          {stepKey(step) === 'Description' && (
            <div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-5">
                <FileText size={24} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-black text-[#0D1B3E] dark:text-white mb-1">Décrivez votre boutique</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Aidez vos clients à comprendre ce que vous vendez.</p>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Catégorie</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(c => (
                      <button key={c} type="button" onClick={() => setCategory(c)}
                        className={`px-3 py-2.5 rounded-2xl text-sm font-medium border-2 transition-all
                          ${category === c ? 'bg-[#0A66FF] border-[#0A66FF] text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#0A66FF]'}`}
                      >{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Décrivez vos produits, votre histoire, votre engagement..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#0A66FF] resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{description.length}/500 caractères</p>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation */}
          {stepKey(step) === 'Confirmation' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={36} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-[#0D1B3E] dark:text-white mb-3">Tout est prêt !</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Votre boutique <strong className="text-[#0A66FF]">{name}</strong> sera accessible sur :
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-6 font-mono text-[#0A66FF] font-bold text-center break-all">
                {getShopDomain(slug)}
              </div>
              <div className="text-left flex flex-col gap-2">
                {[
                  { label: 'Boutique',  val: name },
                  { label: 'Plan',      val: isNewShop ? (shop?.plan || 'business') : PLANS.find(p => p.key === plan)?.label || plan },
                  { label: 'Catégorie', val: category },
                  { label: 'Ville',     val: `${city}, ${country}` },
                  { label: 'Contact',   val: phone },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{r.label}</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} iconLeft={<ArrowLeft size={18} />}>
                Retour
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button
                disabled={!canNext()}
                onClick={() => setStep(s => s + 1)}
                iconRight={<ArrowRight size={18} />}
                fullWidth={step === 0}
              >
                Continuer
              </Button>
            ) : (
              <Button onClick={handleFinish} loading={saving} fullWidth>
                Créer ma boutique
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingContent />
    </Suspense>
  );
}
