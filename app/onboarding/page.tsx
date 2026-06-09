'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Store, MapPin, FileText, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createShop, isSlugAvailable } from '@/lib/firestore';
import { getShopDomain } from '@/lib/shopUrl';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const STEPS = ['Informations', 'Localisation', 'Description', 'Confirmation'];

export default function OnboardingPage() {
  const { user, refreshShop } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [country, setCountry] = useState('Bénin');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['Mode & Vêtements', 'Alimentation', 'Électronique', 'Beauté & Cosmétiques', 'Maison & Déco', 'Sport', 'Autre'];

  const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const handleNameChange = async (val: string) => {
    setName(val);
    const s = toSlug(val);
    setSlug(s);
    if (s.length >= 3) {
      setCheckingSlug(true);
      setSlugAvailable(null);
      const ok = await isSlugAvailable(s);
      setSlugAvailable(ok);
      setCheckingSlug(false);
    }
  };

  const handleSlugChange = async (val: string) => {
    const s = toSlug(val);
    setSlug(s);
    if (s.length >= 3) {
      setCheckingSlug(true);
      setSlugAvailable(null);
      const ok = await isSlugAvailable(s);
      setSlugAvailable(ok);
      setCheckingSlug(false);
    }
  };

  const canNext = () => {
    if (step === 0) return name.length >= 2 && slug.length >= 3 && slugAvailable === true;
    if (step === 1) return city.length >= 2 && phone.length >= 8;
    if (step === 2) return description.length >= 10 && category;
    return true;
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await createShop({
        ownerId: user.uid,
        ownerEmail: user.email || '',
        name,
        slug,
        description,
        category,
        country,
        city,
        phone,
        whatsapp: whatsapp || phone,
        logo: '',
        banner: '',
        plan: 'free',
        isActive: true,
      });
      await refreshShop();
      toast.success('Votre boutique est créée !');
      router.push('/dashboard');
    } catch {
      toast.error('Erreur lors de la création');
    } finally {
      setLoading(false);
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
          Vendor
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-[#0A66FF] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 transition-colors ${i < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl shadow-blue-900/5">
          {/* Step 0: Info boutique */}
          {step === 0 && (
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
                  onChange={e => handleNameChange(e.target.value)}
                  required
                />
                <div>
                  <Input
                    label="Adresse de votre boutique"
                    placeholder="ma-boutique"
                    value={slug}
                    onChange={e => handleSlugChange(e.target.value)}
                    hint={`Votre lien : ${getShopDomain(slug || 'ma-boutique')}`}
                  />
                  {slug.length >= 3 && (
                    <p className={`mt-1.5 text-sm font-medium ${checkingSlug ? 'text-gray-400' : slugAvailable ? 'text-green-600' : 'text-red-500'}`}>
                      {checkingSlug ? 'Vérification...' : slugAvailable ? '✓ Disponible' : '✗ Déjà pris, choisissez un autre'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Localisation */}
          {step === 1 && (
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
                    {['Bénin','Côte d\'Ivoire','Sénégal','Mali','Burkina Faso','Niger','Togo','Ghana','Nigeria','Cameroun','Autre'].map(c => (
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

          {/* Step 2: Description */}
          {step === 2 && (
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
                    {categories.map(c => (
                      <button key={c} type="button" onClick={() => setCategory(c)}
                        className={`px-3 py-2.5 rounded-2xl text-sm font-medium border-2 transition-all ${category === c ? 'bg-[#0A66FF] border-[#0A66FF] text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#0A66FF]'}`}
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

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={36} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-[#0D1B3E] dark:text-white mb-3">Tout est prêt !</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Votre boutique <strong className="text-[#0A66FF]">{name}</strong> sera accessible sur :</p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-8 font-mono text-[#0A66FF] font-bold text-center break-all">
                {getShopDomain(slug)}
              </div>
              <div className="text-left flex flex-col gap-2 mb-8">
                {[
                  { label: 'Boutique', val: name },
                  { label: 'Catégorie', val: category },
                  { label: 'Ville', val: `${city}, ${country}` },
                  { label: 'Contact', val: phone },
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
              <Button disabled={!canNext()} onClick={() => setStep(s => s + 1)} iconRight={<ArrowRight size={18} />} fullWidth={step === 0}>
                Continuer
              </Button>
            ) : (
              <Button onClick={handleFinish} loading={loading} fullWidth>
                Créer ma boutique
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
