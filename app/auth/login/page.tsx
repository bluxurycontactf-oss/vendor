'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, shop } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      router.push(shop ? '/dashboard' : '/onboarding');
    } catch {
      toast.error('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0D1B3E] to-[#0A66FF] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <Zap size={36} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Bon retour sur Shoply</h2>
          <p className="text-blue-200 text-lg max-w-sm">Accédez à votre tableau de bord et gérez vos ventes en toute simplicité.</p>
          <div className="mt-12 flex flex-col gap-4">
            {[
              { label: 'Boutiques actives', value: '10 000+' },
              { label: 'Commandes / jour', value: '5 000+' },
              { label: 'Satisfaction', value: '4.9 / 5' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-4 bg-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm">
                <div className="text-white font-black text-xl">{s.value}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 font-black text-xl text-[#0A66FF] mb-10 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            Shoply
          </Link>

          <h1 className="text-3xl font-black text-[#0D1B3E] dark:text-white mb-2">Connexion</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Connectez-vous à votre espace vendeur.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Adresse email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="Mot de passe"
              type={showPwd ? 'text' : 'password'}
              placeholder="Votre mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              iconRight={
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-sm text-[#0A66FF] hover:underline">Mot de passe oublié ?</Link>
            </div>
            <Button type="submit" loading={loading} iconRight={<ArrowRight size={18} />} fullWidth>
              Se connecter
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-[#0A66FF] font-semibold hover:underline">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
