'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  getAllShops, getReports, suspendShop, unsuspendShop, markReportReviewed, getAllAffiliateDisputes, markDisputeReviewed,
  getDeliveryAgents, saveDeliveryAgent, setDeliveryAgentActive, getOrdersAwaitingAssignment, getOrdersAwaitingPayout,
  assignDeliveryAgent, markVendorPayoutPaid, getAllDeliveryOrders,
} from '@/lib/firestore';
import { resendDeliveryNotification } from '@/lib/api';
import { Shop, Report, AffiliateDispute, DeliveryAgent, Order } from '@/types';
import { ShieldAlert, ShieldCheck, Store, Flag, Eye, EyeOff, LogOut, AlertTriangle, CheckCircle, Users, Truck, Wallet, Plus, Bell, XCircle, Clock, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const ADMIN_EMAIL = 'didilolade@gmail.com';

type Tab = 'shops' | 'reports' | 'disputes' | 'agents' | 'deliveries';

export default function AdminPage() {
  const { user, ready, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('reports');
  const [shops, setShops] = useState<Shop[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [disputes, setDisputes] = useState<AffiliateDispute[]>([]);
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [awaitingAssignment, setAwaitingAssignment] = useState<Order[]>([]);
  const [awaitingPayout, setAwaitingPayout] = useState<Order[]>([]);
  const [deliveryOrders, setDeliveryOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!user || user.email !== ADMIN_EMAIL) {
      router.replace('/');
      return;
    }
    loadData();
  }, [ready, user]);

  const loadData = async () => {
    setLoading(true);
    const [s, r, d, a, oa, op, dl] = await Promise.all([
      getAllShops(), getReports(), getAllAffiliateDisputes(),
      getDeliveryAgents(), getOrdersAwaitingAssignment(), getOrdersAwaitingPayout(),
      getAllDeliveryOrders(),
    ]);
    setShops(s.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '')));
    setReports(r);
    setDisputes(d);
    setAgents(a);
    setAwaitingAssignment(oa);
    setAwaitingPayout(op);
    setDeliveryOrders(dl);
    setLoading(false);
  };

  const handleSuspend = async (shop: Shop) => {
    try {
      if (shop.suspended) {
        await unsuspendShop(shop.id!);
        toast.success(`${shop.name} réactivée`);
      } else {
        await suspendShop(shop.id!);
        toast.success(`${shop.name} suspendue`);
      }
      setShops(prev => prev.map(s => s.id === shop.id ? { ...s, suspended: !s.suspended } : s));
    } catch {
      toast.error('Erreur');
    }
  };

  const handleReview = async (report: Report) => {
    try {
      await markReportReviewed(report.id!);
      setReports(prev => prev.map(r => r.id === report.id ? { ...r, reviewed: true } : r));
      toast.success('Signalement marqué comme traité');
    } catch {
      toast.error('Erreur');
    }
  };

  const handleReviewDispute = async (dispute: AffiliateDispute) => {
    try {
      await markDisputeReviewed(dispute.id!);
      setDisputes(prev => prev.map(d => d.id === dispute.id ? { ...d, reviewed: true } : d));
      toast.success('Litige marqué comme traité');
    } catch {
      toast.error('Erreur');
    }
  };

  const handleAddAgent = async (data: { email: string; name: string; phone: string; city: string }) => {
    try {
      await saveDeliveryAgent({ ...data, active: true });
      toast.success('Livreur ajouté');
      loadData();
    } catch {
      toast.error('Erreur');
    }
  };

  const handleToggleAgent = async (agent: DeliveryAgent) => {
    try {
      await setDeliveryAgentActive(agent.email, !agent.active);
      setAgents(prev => prev.map(a => a.email === agent.email ? { ...a, active: !a.active } : a));
      toast.success(agent.active ? 'Livreur désactivé' : 'Livreur activé');
    } catch {
      toast.error('Erreur');
    }
  };

  const handleAssign = async (orderId: string, agentEmail: string) => {
    const agent = agents.find(a => a.email === agentEmail);
    if (!agent) return;
    try {
      await assignDeliveryAgent(orderId, agent.email, agent.name);
      setAwaitingAssignment(prev => prev.filter(o => o.id !== orderId));
      toast.success(`Commande assignée à ${agent.name}`);
    } catch {
      toast.error('Erreur');
    }
  };

  const handleMarkPayout = async (orderId: string) => {
    if (!confirm('Confirmer que le versement au vendeur a bien été effectué (Mobile Money) ?')) return;
    try {
      await markVendorPayoutPaid(orderId);
      setAwaitingPayout(prev => prev.filter(o => o.id !== orderId));
      toast.success('Versement marqué comme effectué');
    } catch {
      toast.error('Erreur');
    }
  };

  const handleResendNotification = async (orderId: string) => {
    try {
      await resendDeliveryNotification(orderId);
      toast.success('Livreur relancé ✓');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  if (!ready || !user) return null;
  if (user.email !== ADMIN_EMAIL) return null;

  const pendingReports = reports.filter(r => !r.reviewed);
  const suspendedShops = shops.filter(s => s.suspended);
  const pendingDisputes = disputes.filter(d => !d.reviewed);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h1 className="font-bold text-lg">Admin Shoply</h1>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); router.replace('/'); }}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </header>

      {/* Stats */}
      <div className="px-6 py-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatCard label="Boutiques" value={shops.length} icon={<Store size={18} />} color="blue" />
        <StatCard label="Suspendues" value={suspendedShops.length} icon={<ShieldAlert size={18} />} color="red" />
        <StatCard label="Signalements" value={reports.length} icon={<Flag size={18} />} color="orange" />
        <StatCard label="Non traités" value={pendingReports.length} icon={<AlertTriangle size={18} />} color="yellow" />
        <StatCard label="Litiges affiliation" value={pendingDisputes.length} icon={<Users size={18} />} color="purple" />
        <StatCard label="Livraisons à assigner" value={awaitingAssignment.length} icon={<Truck size={18} />} color="blue" />
        <StatCard label="Livraisons en cours" value={deliveryOrders.filter(o => o.deliveryStatus === 'assigned').length} icon={<Clock size={18} />} color="orange" />
        <StatCard label="Versements à faire" value={awaitingPayout.length} icon={<Wallet size={18} />} color="yellow" />
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex border-b border-gray-800 mb-6 overflow-x-auto">
          {(['reports', 'shops', 'disputes', 'agents', 'deliveries'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {t === 'reports' ? `Signalements ${pendingReports.length > 0 ? `(${pendingReports.length})` : ''}`
                : t === 'shops' ? 'Boutiques'
                : t === 'disputes' ? `Litiges affiliation ${pendingDisputes.length > 0 ? `(${pendingDisputes.length})` : ''}`
                : t === 'agents' ? 'Livreurs'
                : (() => {
                    const inProgressCount = deliveryOrders.filter(o => o.deliveryStatus === 'assigned').length;
                    const total = awaitingAssignment.length + awaitingPayout.length + inProgressCount;
                    return `Livraisons & versements ${total > 0 ? `(${total})` : ''}`;
                  })()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">Chargement...</div>
        ) : tab === 'reports' ? (
          <ReportsPanel reports={reports} onReview={handleReview} onSuspend={(shopId) => {
            const s = shops.find(sh => sh.id === shopId);
            if (s) handleSuspend(s);
          }} />
        ) : tab === 'shops' ? (
          <ShopsPanel shops={shops} onToggleSuspend={handleSuspend} />
        ) : tab === 'disputes' ? (
          <DisputesPanel disputes={disputes} onReview={handleReviewDispute} />
        ) : tab === 'agents' ? (
          <AgentsPanel agents={agents} onAdd={handleAddAgent} onToggle={handleToggleAgent} />
        ) : (
          <DeliveriesPanel
            awaitingAssignment={awaitingAssignment}
            awaitingPayout={awaitingPayout}
            deliveryOrders={deliveryOrders}
            agents={agents.filter(a => a.active)}
            shops={shops}
            onAssign={handleAssign}
            onMarkPayout={handleMarkPayout}
            onResend={handleResendNotification}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400',
    red: 'bg-red-500/10 text-red-400',
    orange: 'bg-orange-500/10 text-orange-400',
    yellow: 'bg-yellow-500/10 text-yellow-400',
    purple: 'bg-purple-500/10 text-purple-400',
  };
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function ReportsPanel({ reports, onReview, onSuspend }: {
  reports: Report[];
  onReview: (r: Report) => void;
  onSuspend: (shopId: string) => void;
}) {
  if (reports.length === 0) return (
    <div className="text-center py-16 text-gray-500">
      <Flag size={40} className="mx-auto mb-3 opacity-40" />
      <p>Aucun signalement</p>
    </div>
  );

  return (
    <div className="space-y-3 pb-8">
      {reports.map(r => (
        <div key={r.id} className={`bg-gray-900 border rounded-xl p-4 ${r.reviewed ? 'border-gray-800 opacity-60' : 'border-orange-500/30'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{r.shopName}</span>
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">/{r.shopSlug}</span>
                {r.reviewed && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle size={12} /> Traité</span>}
              </div>
              <p className="text-sm text-orange-300 font-medium">{r.reason}</p>
              {r.details && <p className="text-xs text-gray-400 mt-1">{r.details}</p>}
              <p className="text-xs text-gray-600 mt-2">{r.createdAt ? new Date(r.createdAt).toLocaleString('fr-FR') : ''}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              {!r.reviewed && (
                <button
                  onClick={() => onReview(r)}
                  className="text-xs px-3 py-1.5 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                >
                  Marquer traité
                </button>
              )}
              <button
                onClick={() => onSuspend(r.shopId)}
                className="text-xs px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
              >
                Suspendre
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ShopsPanel({ shops, onToggleSuspend }: { shops: Shop[]; onToggleSuspend: (s: Shop) => void }) {
  const [search, setSearch] = useState('');
  const filtered = shops.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.slug.toLowerCase().includes(search.toLowerCase()) ||
    (s.ownerEmail ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-8">
      <input
        type="text"
        placeholder="Rechercher une boutique..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-4 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
      />
      <div className="space-y-2">
        {filtered.map(s => (
          <div key={s.id} className={`bg-gray-900 border rounded-xl p-4 flex items-center gap-3 ${s.suspended ? 'border-red-500/30' : 'border-gray-800'}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">{s.name}</span>
                <span className="text-xs text-gray-500">/{s.slug}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  s.plan === 'business' ? 'bg-purple-500/20 text-purple-300' :
                  s.plan === 'premium' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-gray-700 text-gray-400'
                }`}>{s.plan}</span>
                {s.suspended && <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">Suspendue</span>}
              </div>
              {s.ownerEmail && <p className="text-xs text-gray-500 mt-0.5">{s.ownerEmail}</p>}
            </div>
            <button
              onClick={() => onToggleSuspend(s)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                s.suspended
                  ? 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30'
                  : 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30'
              }`}
            >
              {s.suspended ? <><ShieldCheck size={13} /> Réactiver</> : <><ShieldAlert size={13} /> Suspendre</>}
            </button>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-500 py-8">Aucune boutique trouvée</p>}
      </div>
    </div>
  );
}

function DisputesPanel({ disputes, onReview }: {
  disputes: AffiliateDispute[];
  onReview: (d: AffiliateDispute) => void;
}) {
  if (disputes.length === 0) return (
    <div className="text-center py-16 text-gray-500">
      <Users size={40} className="mx-auto mb-3 opacity-40" />
      <p>Aucun litige d&apos;affiliation</p>
    </div>
  );

  return (
    <div className="space-y-3 pb-8">
      {disputes.map(d => (
        <div key={d.id} className={`bg-gray-900 border rounded-xl p-4 ${d.reviewed ? 'border-gray-800 opacity-60' : 'border-orange-500/30'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-medium text-sm">{d.shopName}</span>
                <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">{d.commission.toLocaleString()} F</span>
                {d.reviewed && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle size={12} /> Traité</span>}
              </div>
              <p className="text-sm text-orange-300 font-medium">{d.reason}</p>
              {d.details && <p className="text-xs text-gray-400 mt-1">{d.details}</p>}
              <p className="text-xs text-gray-600 mt-1">Affilié : {d.affiliateUid}</p>
              {d.proofUrl && (
                <a href={d.proofUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2">
                  <img src={d.proofUrl} alt="Preuve" className="w-24 h-24 object-cover rounded-lg border border-gray-700" />
                </a>
              )}
              <p className="text-xs text-gray-600 mt-2">{d.createdAt ? new Date(d.createdAt).toLocaleString('fr-FR') : ''}</p>
            </div>
            {!d.reviewed && (
              <button
                onClick={() => onReview(d)}
                className="shrink-0 text-xs px-3 py-1.5 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
              >
                Marquer traité
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentsPanel({ agents, onAdd, onToggle }: {
  agents: DeliveryAgent[];
  onAdd: (data: { email: string; name: string; phone: string; city: string }) => void;
  onToggle: (agent: DeliveryAgent) => void;
}) {
  const [form, setForm] = useState({ email: '', name: '', phone: '', city: '' });
  const [adding, setAdding] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.name || !form.phone) return;
    setAdding(true);
    await onAdd(form);
    setForm({ email: '', name: '', phone: '', city: '' });
    setAdding(false);
  };

  const activeAgents = agents.filter(a => a.active)
    .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
  const currentAgent = activeAgents[0];

  return (
    <div className="pb-8">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4 text-xs text-blue-300 leading-relaxed">
        Toute nouvelle commande payée (plan Gratuit) est <strong>automatiquement assignée et
        notifiée</strong> au livreur actif le plus ancien — c&apos;est donc lui le « service de
        livraison Shoply » en place. Un seul livreur actif à la fois est recommandé.
        Le livreur doit ouvrir <strong>/livreur</strong> avec son compte Shoply (email indiqué
        ci-dessous) et activer les notifications pour recevoir les alertes sur son téléphone.
      </div>

      {currentAgent && (
        <div className="bg-gray-900 border border-blue-600/30 rounded-xl p-4 mb-4">
          <p className="text-xs font-bold text-blue-400 mb-1 flex items-center gap-1.5"><Truck size={13} /> Service de livraison actif</p>
          <p className="text-sm font-medium">{currentAgent.name} — {currentAgent.city}</p>
          <p className="text-xs text-gray-500 mt-0.5">{currentAgent.email} · {currentAgent.phone}</p>
          <p className={`text-xs mt-1.5 flex items-center gap-1.5 ${currentAgent.fcmToken ? 'text-green-400' : 'text-yellow-400'}`}>
            {currentAgent.fcmToken ? '🔔 Notifications activées' : '⚠️ Notifications pas encore activées (le livreur doit se connecter sur /livreur)'}
          </p>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium mb-3">Ajouter / remplacer le service de livraison</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input placeholder="Email (compte Shoply)" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
          <input placeholder="Nom du service / livreur" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
          <input placeholder="Téléphone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
          <input placeholder="Ville" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <button onClick={handleSubmit} disabled={adding || !form.email || !form.name || !form.phone}
          className="text-xs px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-colors disabled:opacity-50 flex items-center gap-1.5">
          <Plus size={13} /> Enregistrer
        </button>
        <p className="text-xs text-gray-500 mt-2">Le service de livraison doit créer un compte Shoply (email / mot de passe) avec cette adresse email pour se connecter sur /livreur.</p>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Truck size={40} className="mx-auto mb-3 opacity-40" />
          <p>Aucun service de livraison enregistré</p>
        </div>
      ) : (
        <div className="space-y-2">
          {agents.map(a => (
            <div key={a.email} className={`bg-gray-900 border rounded-xl p-4 flex items-center gap-3 ${a.active ? 'border-gray-800' : 'border-red-500/30 opacity-60'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{a.name}</span>
                  <span className="text-xs text-gray-500">{a.city}</span>
                  {!a.active && <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">Désactivé</span>}
                  {a.active && a === currentAgent && <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full">En service</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{a.email} · {a.phone}</p>
              </div>
              <button
                onClick={() => onToggle(a)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                  a.active
                    ? 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30'
                    : 'bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30'
                }`}
              >
                {a.active ? <><EyeOff size={13} /> Désactiver</> : <><Eye size={13} /> Activer</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeliveriesPanel({ awaitingAssignment, awaitingPayout, deliveryOrders, agents, shops, onAssign, onMarkPayout, onResend }: {
  awaitingAssignment: Order[];
  awaitingPayout: Order[];
  deliveryOrders: Order[];
  agents: DeliveryAgent[];
  shops: Shop[];
  onAssign: (orderId: string, agentEmail: string) => void;
  onMarkPayout: (orderId: string) => void;
  onResend: (orderId: string) => void;
}) {
  const shopName = (shopId: string) => shops.find(s => s.id === shopId)?.name || shopId;
  const shopPaymentInfo = (shopId: string) => {
    const pm = shops.find(s => s.id === shopId)?.paymentMethods;
    if (!pm) return null;
    const parts: string[] = [];
    if (pm.mtn) parts.push(`MTN: ${pm.mtn}`);
    if (pm.moov) parts.push(`Moov: ${pm.moov}`);
    if (pm.wave) parts.push(`Wave: ${pm.wave}`);
    if (pm.orange) parts.push(`Orange: ${pm.orange}`);
    if (pm.bankName) parts.push(`${pm.bankName}: ${pm.bankAccount || ''}`);
    return parts.length ? parts.join(' · ') : null;
  };

  const inProgress = deliveryOrders.filter(o => o.deliveryStatus === 'assigned');
  const history = deliveryOrders.filter(o => o.deliveryStatus === 'delivered' || o.deliveryStatus === 'failed');
  const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="pb-8 flex flex-col gap-8">
      <div>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Clock size={15} className="text-orange-400" /> Livraisons en cours ({inProgress.length})</h3>
        {inProgress.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">Aucune livraison en cours</p>
        ) : (
          <div className="space-y-2">
            {inProgress.map(o => (
              <div key={o.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{o.customerName} — {shopName(o.shopId)}</p>
                  <p className="text-xs text-gray-500">{o.customerAddress} · {o.customerPhone}</p>
                  <p className="text-xs text-gray-500">{o.total.toLocaleString()} F · livreur : {o.deliveryAgentName || o.deliveryAgentId}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Assignée le {formatDate(o.createdAt)}</p>
                </div>
                <button
                  onClick={() => onResend(o.id!)}
                  className="shrink-0 text-xs px-3 py-1.5 bg-orange-600/20 text-orange-400 border border-orange-600/30 rounded-lg hover:bg-orange-600/30 transition-colors flex items-center gap-1.5"
                >
                  <Bell size={13} /> Relancer le livreur
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Truck size={15} className="text-blue-400" /> À assigner à un livreur ({awaitingAssignment.length})</h3>
        {awaitingAssignment.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">Aucune commande en attente d&apos;assignation</p>
        ) : (
          <div className="space-y-2">
            {awaitingAssignment.map(o => (
              <div key={o.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{o.customerName} — {shopName(o.shopId)}</p>
                  <p className="text-xs text-gray-500">{o.customerAddress} · {o.customerPhone}</p>
                  <p className="text-xs text-gray-500">{o.total.toLocaleString()} F</p>
                </div>
                {agents.length === 0 ? (
                  <span className="text-xs text-red-400">Aucun livreur actif</span>
                ) : (
                  <select
                    onChange={e => e.target.value && onAssign(o.id!, e.target.value)}
                    defaultValue=""
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="" disabled>Choisir un livreur...</option>
                    {agents.map(a => <option key={a.email} value={a.email}>{a.name} ({a.city})</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Wallet size={15} className="text-yellow-400" /> Versements vendeurs en attente ({awaitingPayout.length})</h3>
        {awaitingPayout.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">Aucun versement en attente</p>
        ) : (
          <div className="space-y-2">
            {awaitingPayout.map(o => (
              <div key={o.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{shopName(o.shopId)}</p>
                  <p className="text-xs text-yellow-300 font-semibold">{(o.vendorPayoutAmount ?? 0).toLocaleString()} F à verser</p>
                  {shopPaymentInfo(o.shopId) && <p className="text-xs text-gray-500 mt-0.5">{shopPaymentInfo(o.shopId)}</p>}
                  <p className="text-xs text-gray-600 mt-1">Commande #{o.id?.slice(-8)} — livrée le {o.updatedAt ? new Date(o.updatedAt).toLocaleDateString('fr-FR') : ''}</p>
                </div>
                <button
                  onClick={() => onMarkPayout(o.id!)}
                  className="shrink-0 text-xs px-3 py-1.5 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle size={13} /> Marquer versé
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Package size={15} className="text-gray-400" /> Historique des livraisons ({history.length})</h3>
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm py-4">Aucune livraison terminée pour le moment</p>
        ) : (
          <div className="space-y-2">
            {history.map(o => (
              <div key={o.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{o.customerName} — {shopName(o.shopId)}</p>
                  <p className="text-xs text-gray-500">{o.customerAddress} · {o.customerPhone}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Livreur : {o.deliveryAgentName || o.deliveryAgentId || '—'} · {formatDate(o.updatedAt)}</p>
                </div>
                <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                  o.deliveryStatus === 'delivered' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                }`}>
                  {o.deliveryStatus === 'delivered' ? <><CheckCircle size={13} /> Livrée</> : <><XCircle size={13} /> Échec</>}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
