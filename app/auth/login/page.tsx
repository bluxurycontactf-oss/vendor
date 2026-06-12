'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { lang, t } = useLanguage();
  const router = useRouter();

  const A = translations[lang].auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      // onAuthStateChanged will load shops and set ready=true
      // dashboard layout will redirect to /onboarding if no shop, or show dashboard if shop exists
      router.push('/dashboard');
    } catch {
      toast.error(lang === 'en' ? 'Incorrect email or password' : lang === 'pt' ? 'Email ou senha incorretos' : 'Email ou mot de passe incorrect');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0D1B3E] to-[#0A66FF] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <Zap size={36} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">{A.login_left_title}</h2>
          <p className="text-blue-200 text-lg max-w-sm">{A.login_left_subtitle}</p>
          <div className="mt-12 flex flex-col gap-4">
            {A.stats.map(s => (
              <div key={s.label} className="flex items-center gap-4 bg-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm">
                <div className="text-white font-black text-xl">{s.value}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 font-black text-xl text-[#0A66FF] mb-10 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            Shoply
          </Link>

          <h1 className="text-3xl font-black text-[#0D1B3E] dark:text-white mb-2">{t('auth.login_title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{t('auth.login_subtitle')}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label={t('auth.email_label')}
              type="email"
              placeholder={t('auth.email_placeholder')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label={t('auth.password_label')}
              type={showPwd ? 'text' : 'password'}
              placeholder={t('auth.password_placeholder')}
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
              <Link href="/auth/forgot-password" className="text-sm text-[#0A66FF] hover:underline">{t('auth.login_forgot')}</Link>
            </div>
            <Button type="submit" loading={submitting} iconRight={<ArrowRight size={18} />} fullWidth>
              {t('auth.login_btn')}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            {t('auth.login_no_account')}{' '}
            <Link href="/auth/register" className="text-[#0A66FF] font-semibold hover:underline">{t('auth.login_register_link')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
