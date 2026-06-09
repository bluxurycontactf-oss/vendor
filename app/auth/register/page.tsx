'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error('Veuillez accepter les conditions d\'utilisation'); return; }
    if (password.length < 8) { toast.error('Mot de passe trop court (8 caractères minimum)'); return; }
    setLoading(true);
    try {
      await register(email, password, name);
      toast.success('Compte créé avec succès !');
      router.push('/onboarding');
    } catch (err: unknown) {
      const msg = (err as { code?: string })?.code === 'auth/email-already-in-use'
        ? 'Cet email est déjà utilisé'
        : 'Erreur lors de la création du compte';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    'Boutique en ligne en 2 minutes',
    'Paiement Mobile Money intégré',
    '10 produits gratuits pour démarrer',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0D1B3E] to-[#0A66FF] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <Zap size={36} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Rejoignez Vendor Africa</h2>
          <p className="text-blue-200 text-lg max-w-sm mb-10">Lancez votre boutique en ligne et commencez à vendre dès aujourd&apos;hui.</p>
          <div className="flex flex-col gap-4">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm text-left">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-white" />
                </div>
                <span className="text-white text-sm font-medium">{p}</span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-blue-200/60 text-sm">Déjà +10 000 vendeurs nous font confiance</p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 font-black text-xl text-[#0A66FF] mb-10 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            Vendor
          </Link>

          <h1 className="text-3xl font-black text-[#0D1B3E] dark:text-white mb-2">Créer un compte</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Gratuit, sans carte bancaire requise.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Nom complet"
              type="text"
              placeholder="Votre prénom et nom"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <Input
              label="Adresse email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <div>
              <Input
                label="Mot de passe"
                type={showPwd ? 'text' : 'password'}
                placeholder="8 caractères minimum"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                iconRight={
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              {password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${password.length >= i * 2 ? i < 3 ? 'bg-yellow-400' : 'bg-green-500' : 'bg-gray-200'}`} />
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`w-5 h-5 mt-0.5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors cursor-pointer ${agreed ? 'bg-[#0A66FF] border-[#0A66FF]' : 'border-gray-300 bg-white'}`}
              >
                {agreed && <Check size={12} className="text-white" />}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                J&apos;accepte les{' '}
                <Link href="/terms" className="text-[#0A66FF] hover:underline">conditions d&apos;utilisation</Link>
                {' '}et la{' '}
                <Link href="/privacy" className="text-[#0A66FF] hover:underline">politique de confidentialité</Link>
              </span>
            </label>

            <Button type="submit" loading={loading} iconRight={<ArrowRight size={18} />} fullWidth>
              Créer mon compte gratuitement
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="text-[#0A66FF] font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
