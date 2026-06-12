'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getDeliveryAgentByEmail, getOrdersForAgent, markOrderDelivered, markOrderDeliveryFailed, saveAgentFcmToken, saveDeliveryAgent } from '@/lib/firestore';
import { getFCMToken, notificationsSupported } from '@/lib/messaging';
import { DeliveryAgent, Order } from '@/types';
import { Truck, LogOut, Phone, MapPin, CheckCircle, XCircle, Package, ShieldAlert, Bell, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LivreurPage() {
  const { user, ready, login, register, logout } = useAuth();
  const router = useRouter();
  const [agent, setAgent] = useState<DeliveryAgent | null | undefined>(undefined);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  // Authentification / inscription (utilisateur non connecté)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user || !user.email) { setLoading(false); return; }
    load();
  }, [ready, user]);

  const load = async () => {
    if (!user?.email) return;
    setLoading(true);
    const a = await getDeliveryAgentByEmail(user.email);
    setAgent(a);
    if (a) {
      const o = await getOrdersForAgent(user.email);
      setOrders(o);
      setNotifEnabled(!!a.fcmToken);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      await login(email, password);
    } catch {
      toast.error('Email ou mot de passe incorrect');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Mot de passe trop court (8 caractères minimum)');
      return;
    }
    setAuthLoading(true);
    try {
      await register(email, password, name);
      await saveDeliveryAgent({ email, name, phone, city, active: false });
      toast.success('Compte créé ! En attente d\'activation par Shoply.');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      const msg = code === 'auth/email-already-in-use'
        ? 'Cet email est déjà utilisé'
        : 'Erreur lors de la création du compte';
      toast.error(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEnableNotifications = async () => {
    if (!user?.email) return;
    if (!notificationsSupported()) { toast.error('Notifications non supportées par ce navigateur'); return; }
    setNotifLoading(true);
    try {
      const token = await getFCMToken();
      if (!token) { toast.error('Notifications refusées. Activez-les dans les réglages du navigateur.'); return; }
      await saveAgentFcmToken(user.email, token);
      setNotifEnabled(true);
      toast.success('Notifications activées ✓');
    } catch { toast.error('Erreur'); }
    finally { setNotifLoading(false); }
  };

  const handleDelivered = async (orderId: string) => {
    if (!confirm('Confirmer que cette commande a bien été livrée au client ?')) return;
    setActing(orderId);
    try {
      await markOrderDelivered(orderId);
      toast.success('Livraison confirmée ✓');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryStatus: 'delivered', status: 'delivered' } : o));
    } catch { toast.error('Erreur'); }
    finally { setActing(null); }
  };

  const handleFailed = async (orderId: string) => {
    if (!confirm('Confirmer que cette livraison a échoué ?')) return;
    setActing(orderId);
    try {
      await markOrderDeliveryFailed(orderId);
      toast.success('Livraison marquée comme échouée');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryStatus: 'failed' } : o));
    } catch { toast.error('Erreur'); }
    finally { setActing(null); }
  };

  if (!ready || loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#0A66FF] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Utilisateur non connecté : connexion ou création de compte livreur, sur la même page
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 font-black text-xl text-[#0A66FF] mb-8 justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] rounded-xl flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          Shoply
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#0A66FF] mb-5">
            <Truck size={26} />
          </div>
          <h1 className="text-2xl font-black text-[#0D1B3E] dark:text-white mb-2">Espace livreur Shoply</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            {authMode === 'login'
              ? 'Connectez-vous à votre compte livreur pour voir vos livraisons.'
              : 'Créez votre compte pour recevoir automatiquement les livraisons à effectuer et les notifications sur votre téléphone. Votre compte sera activé par l\'équipe Shoply.'}
          </p>

          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-6">
            <button onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${authMode === 'login' ? 'bg-white dark:bg-gray-900 text-[#0A66FF] shadow-sm' : 'text-gray-500'}`}>
              Se connecter
            </button>
            <button onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${authMode === 'register' ? 'bg-white dark:bg-gray-900 text-[#0A66FF] shadow-sm' : 'text-gray-500'}`}>
              Créer un compte
            </button>
          </div>

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input label="Email" type="email" placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)} required />
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
              <Button type="submit" loading={authLoading} iconRight={<ArrowRight size={18} />} fullWidth>
                Se connecter
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <Input label="Nom complet" type="text" placeholder="Ex : Jean Livraison" value={name} onChange={e => setName(e.target.value)} required />
              <Input label="Email" type="email" placeholder="vous@exemple.com" value={email} onChange={e => setEmail(e.target.value)} required />
              <Input label="Téléphone" type="tel" placeholder="Ex : 90 00 00 00" value={phone} onChange={e => setPhone(e.target.value)} required />
              <Input label="Ville" type="text" placeholder="Ex : Cotonou" value={city} onChange={e => setCity(e.target.value)} required />
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
              <Button type="submit" loading={authLoading} iconRight={<ArrowRight size={18} />} fullWidth>
                Créer mon compte livreur
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  if (!agent || !agent.active) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center">
        <ShieldAlert size={36} className="text-red-500" />
      </div>
      <h1 className="text-xl font-black text-gray-800">{agent ? 'Compte en attente d\'activation' : 'Accès livreur non activé'}</h1>
      <p className="text-gray-500 text-sm max-w-xs">
        {agent
          ? `Votre compte livreur (${user.email}) a bien été créé et est en attente d'activation par l'équipe Shoply. Vous recevrez l'accès très bientôt.`
          : `Votre compte (${user.email}) n'est pas enregistré comme livreur sur Shoply. Déconnectez-vous pour créer un compte livreur.`}
      </p>
      <button onClick={() => { logout(); router.replace('/'); }} className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-2xl text-sm">
        Déconnexion
      </button>
    </div>
  );

  const active = orders.filter(o => o.deliveryStatus === 'assigned');
  const history = orders.filter(o => o.deliveryStatus === 'delivered' || o.deliveryStatus === 'failed');

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0A66FF] flex items-center justify-center text-white">
            <Truck size={18} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{agent.name}</p>
            <p className="text-xs text-gray-400">{agent.city}</p>
          </div>
        </div>
        <button onClick={() => { logout(); router.replace('/'); }} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
          <LogOut size={16} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-5 max-w-2xl mx-auto">
        {!notifEnabled && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#0A66FF] shrink-0">
              <Bell size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Activer les notifications</p>
              <p className="text-xs text-gray-500">Recevez une alerte sur ce téléphone dès qu&apos;une nouvelle livraison vous est assignée.</p>
            </div>
            <button onClick={handleEnableNotifications} disabled={notifLoading}
              className="shrink-0 px-3 py-2 bg-[#0A66FF] text-white font-bold rounded-xl text-xs disabled:opacity-50">
              Activer
            </button>
          </div>
        )}
        {notifEnabled && (
          <div className="flex items-center gap-2 text-xs text-green-600 font-semibold px-1">
            <Bell size={13} /> Notifications activées
          </div>
        )}

        <div>
          <h2 className="font-black text-gray-900 mb-3">Livraisons à faire ({active.length})</h2>
          {active.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-sm shadow-sm">
              <Package size={32} className="mx-auto mb-2 text-gray-300" />
              Aucune livraison assignée pour le moment
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {active.map(o => (
                <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900">{o.customerName}</p>
                    <p className="font-black text-[#0A66FF]">{o.total.toLocaleString()} F</p>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-gray-500">
                    <a href={`tel:${o.customerPhone}`} className="flex items-center gap-2"><Phone size={14} className="text-[#0A66FF]" /> {o.customerPhone}</a>
                    {o.customerAddress && <p className="flex items-center gap-2"><MapPin size={14} className="text-[#0A66FF]" /> {o.customerAddress}</p>}
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex flex-col gap-1">
                    {o.items.map((item, i) => (
                      <p key={i} className="text-xs text-gray-500 flex justify-between">
                        <span>{item.productName} x{item.quantity}</span>
                      </p>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleDelivered(o.id!)} disabled={acting === o.id}
                      className="flex-1 bg-green-500 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 disabled:opacity-50">
                      <CheckCircle size={15} /> Livré
                    </button>
                    <button onClick={() => handleFailed(o.id!)} disabled={acting === o.id}
                      className="flex-1 bg-red-50 text-red-600 font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 disabled:opacity-50">
                      <XCircle size={15} /> Échec
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div>
            <h2 className="font-black text-gray-900 mb-3">Historique</h2>
            <div className="flex flex-col gap-2">
              {history.map(o => (
                <div key={o.id} className="bg-white rounded-2xl p-3 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{o.customerName}</p>
                    <p className="text-xs text-gray-400">{o.customerAddress}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${o.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {o.deliveryStatus === 'delivered' ? 'Livré' : 'Échec'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
