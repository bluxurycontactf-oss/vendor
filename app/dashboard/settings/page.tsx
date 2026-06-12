'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateShop, deleteShop, getMyAffiliateOrders, getMyAffiliateDisputes, createAffiliateDispute, getShopById } from '@/lib/firestore';
import { openFedaPayCheckout } from '@/lib/fedapay';
import { activatePlan } from '@/lib/api';
import { getAffiliateLink, AFFILIATE_RATE } from '@/lib/affiliate';
import { Order, Shop, AffiliateDispute } from '@/types';
import { Store, Shield, Zap, Check, CheckCircle2, Copy, ExternalLink, Wallet, QrCode, Trash2, AlertTriangle, Crown, Gift, Users, Megaphone, Truck, Headset, Mail, Share2, Flag } from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import Badge from '@/components/ui/Badge';
import ImageUploader from '@/components/ui/ImageUploader';
import Modal from '@/components/ui/Modal';
import { getShopUrl, getShopDomain } from '@/lib/shopUrl';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import Link from 'next/link';

const PLANS = [
  {
    key: 'free',
    label: 'Gratuit',
    price: '0 FCFA',
    period: '',
    features: ['10 produits maximum', '1 boutique', 'Lien boutique Shoply', 'Support standard'],
  },
  {
    key: 'premium',
    label: 'Premium',
    price: '4 900 FCFA',
    period: '/mois',
    popular: true,
    features: ['Produits illimités', 'Paiement Mobile Money', 'QR Code boutique', 'Mise en avant légère', 'Statistiques'],
  },
  {
    key: 'business',
    label: 'Business',
    price: '14 900 FCFA',
    period: '/mois',
    features: ['Tout Premium inclus', 'Publicité sur Shoply', 'Outils marketing', 'Statistiques avancées', '5 livraisons gratuites/mois', 'Support prioritaire'],
  },
];

const tabs = [
  { key: 'boutique', label: 'Boutique', icon: Store },
  { key: 'paiements', label: 'Paiements', icon: Wallet },
  { key: 'plan', label: 'Abonnement', icon: Zap },
  { key: 'parrainage', label: 'Parrainage', icon: Gift },
  { key: 'affiliation', label: 'Affiliation', icon: Share2 },
  { key: 'securite', label: 'Sécurité', icon: Shield },
] as const;

export default function SettingsPage() {
  const { user, shop, refreshShop } = useAuth();
  const [tab, setTab] = useState<'boutique' | 'paiements' | 'plan' | 'parrainage' | 'affiliation' | 'securite'>('boutique');
  const [affiliateOrders, setAffiliateOrders] = useState<Order[]>([]);
  const [affiliateShops, setAffiliateShops] = useState<Record<string, Shop>>({});
  const [affiliateDisputes, setAffiliateDisputes] = useState<AffiliateDispute[]>([]);
  const [affiliateLoading, setAffiliateLoading] = useState(false);
  const [disputeOrder, setDisputeOrder] = useState<Order | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDetails, setDisputeDetails] = useState('');
  const [disputeProof, setDisputeProof] = useState<string[]>([]);
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [paymentFailedPlan, setPaymentFailedPlan] = useState<string | null>(null);

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

  const [bannerText, setBannerText] = useState('');
  const [bannerColor, setBannerColor] = useState('#0A66FF');
  const [bannerActive, setBannerActive] = useState(false);


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
      setBannerText(shop.promoBanner?.text || '');
      setBannerColor(shop.promoBanner?.color || '#0A66FF');
      setBannerActive(shop.promoBanner?.active || false);

      // Auto-generate referralCode for existing shops that don't have one
      if (!shop.referralCode && shop.id) {
        const code = shop.id.replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase();
        updateShop(shop.id, { referralCode: code, referralCount: shop.referralCount ?? 0 })
          .then(() => refreshShop())
          .catch(() => {});
      }
    }
  }, [shop]);

  useEffect(() => {
    if (tab === 'affiliation' && user && affiliateOrders.length === 0 && !affiliateLoading) {
      setAffiliateLoading(true);
      Promise.all([getMyAffiliateOrders(user.uid), getMyAffiliateDisputes(user.uid)])
        .then(async ([orders, disputes]) => {
          setAffiliateOrders(orders);
          setAffiliateDisputes(disputes);
          const shopIds = Array.from(new Set(orders.map(o => o.shopId)));
          const shopsMap: Record<string, Shop> = {};
          await Promise.all(shopIds.map(async id => {
            const s = await getShopById(id);
            if (s) shopsMap[id] = s;
          }));
          setAffiliateShops(shopsMap);
        })
        .finally(() => setAffiliateLoading(false));
    }
  }, [tab, user]);

  const PAYOUT_DEADLINE_DAYS = 7;

  const handleSubmitDispute = async () => {
    if (!user || !disputeOrder || !disputeReason) {
      toast.error('Veuillez préciser le motif du signalement');
      return;
    }
    setSubmittingDispute(true);
    try {
      const s = affiliateShops[disputeOrder.shopId];
      await createAffiliateDispute({
        orderId: disputeOrder.id!,
        shopId: disputeOrder.shopId,
        shopName: s?.name || 'Boutique Shoply',
        affiliateUid: user.uid,
        commission: disputeOrder.affiliateCommission || 0,
        reason: disputeReason,
        details: disputeDetails || undefined,
        proofUrl: disputeProof[0],
      });
      toast.success('Signalement envoyé à l\'équipe Shoply');
      setAffiliateDisputes(prev => [...prev, {
        orderId: disputeOrder.id!, shopId: disputeOrder.shopId, shopName: s?.name || '',
        affiliateUid: user.uid, commission: disputeOrder.affiliateCommission || 0,
        reason: disputeReason, details: disputeDetails, proofUrl: disputeProof[0],
        reviewed: false, createdAt: new Date().toISOString(),
      }]);
      setDisputeOrder(null);
      setDisputeReason('');
      setDisputeDetails('');
      setDisputeProof([]);
    } catch {
      toast.error('Erreur lors de l\'envoi du signalement');
    } finally {
      setSubmittingDispute(false);
    }
  };

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

  const handleSaveBanner = async () => {
    if (!shop) return;
    setSaving(true);
    try {
      await updateShop(shop.id!, {
        promoBanner: { text: bannerText, color: bannerColor, active: bannerActive },
      });
      await refreshShop();
      toast.success('Bannière enregistrée');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

const handleChangePlan = async (newPlan: string) => {
    if (!shop || newPlan === shop.plan) return;

    // Downgrade to Free: no payment needed, just confirm
    if (newPlan === 'free') {
      setChangingPlan(true);
      try {
        await updateShop(shop.id!, { plan: 'free' });
        await refreshShop();
        toast.success('Plan rétrogradé au Gratuit');
        setPendingPlan(null);
      } catch {
        toast.error('Erreur lors du changement de plan');
      } finally {
        setChangingPlan(false);
      }
      return;
    }

    // Upgrade to Premium or Business: trigger FedaPay
    setPendingPlan(null); // close current modal
    setChangingPlan(true);
    try {
      await openFedaPayCheckout({
        plan: newPlan as 'premium' | 'business',
        customerEmail: shop.ownerEmail || '',
        onSuccess: async (transactionId) => {
          try {
            await activatePlan(shop.id!, newPlan as 'premium' | 'business', transactionId);
            await refreshShop();
            toast.success(`🎉 Plan ${PLANS.find(p => p.key === newPlan)?.label} activé !`);
          } catch {
            toast.error('Paiement reçu mais erreur activation — contactez le support');
          } finally {
            setChangingPlan(false);
          }
        },
        onCancel: () => {
          setPaymentFailedPlan(newPlan);
          setChangingPlan(false);
        },
        onError: () => {
          setPaymentFailedPlan(newPlan);
          setChangingPlan(false);
        },
      });
    } catch {
      toast.error('Erreur de connexion à FedaPay');
      setChangingPlan(false);
    }
  };

  const handleDeleteShop = async () => {
    if (!shop || deleteConfirm !== shop.name) return;
    setDeleting(true);
    try {
      await deleteShop(shop.id!);
      await refreshShop(); // shop becomes null → layout redirects to /onboarding
      toast.success('Boutique supprimée');
    } catch {
      toast.error('Erreur lors de la suppression');
      setDeleting(false);
    }
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const freeDeliveriesUsed = shop?.freeDeliveriesMonth === currentMonth ? (shop?.freeDeliveriesUsed || 0) : 0;
  const freeDeliveriesRemaining = Math.max(0, 5 - freeDeliveriesUsed);

  const shopUrl = shop ? getShopUrl(shop.slug) : '';
  const qrUrl = shop ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shopUrl)}&bgcolor=ffffff&color=0D1B3E&margin=10` : '';

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
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-[#0D1B3E] dark:text-white">Lien de votre boutique</h2>
                {(shop.plan === 'premium' || shop.plan === 'business') && (
                  <VerifiedBadge plan={shop.plan} size={16} />
                )}
              </div>
              {shop.plan === 'free' && (
                <p className="text-xs text-gray-400 mb-1">Passez en Premium pour obtenir votre badge de vérification ✓</p>
              )}
              <p className="text-xs text-gray-500 mb-3">Partagez ce lien avec vos clients</p>
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-3">
                <code className="flex-1 text-xs sm:text-sm font-mono text-[#0A66FF] font-bold break-all">{getShopDomain(shop.slug)}</code>
                <button onClick={() => { navigator.clipboard.writeText(shopUrl); toast.success('Lien copié !'); }}
                  className="flex-shrink-0 w-9 h-9 bg-[#0A66FF] text-white rounded-xl flex items-center justify-center">
                  <Copy size={14} />
                </button>
              </div>
              <a href={shopUrl} target="_blank" className="mt-2 inline-flex items-center gap-1 text-xs text-[#0A66FF] hover:underline font-medium">
                <ExternalLink size={12} /> Ouvrir ma boutique
              </a>

              {/* QR Code */}
              {shop.plan !== 'free' && (
                <div className="mt-5 border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode size={16} className="text-[#0A66FF]" />
                    <h3 className="font-bold text-sm text-[#0D1B3E] dark:text-white">QR Code de votre boutique</h3>
                  </div>
                  <div className="flex items-start gap-4">
                    <img src={qrUrl} alt="QR Code boutique" className="w-28 h-28 rounded-xl border border-gray-200 dark:border-gray-700" />
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="text-xs text-gray-500">Imprimez ce QR code sur vos emballages, cartes de visite ou affiches pour que vos clients accèdent directement à votre boutique.</p>
                      <a
                        href={qrUrl + '&size=400x400'}
                        download={`qr-${shop.slug}.png`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A66FF] hover:underline"
                      >
                        Télécharger en haute résolution
                      </a>
                    </div>
                  </div>
                </div>
              )}
              {shop.plan === 'free' && (
                <div className="mt-4 flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
                  <QrCode size={16} className="text-yellow-600 flex-shrink-0" />
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">QR Code disponible en <Link href="#" onClick={() => setTab('plan')} className="font-bold underline">plan Premium</Link></p>
                </div>
              )}
            </div>
          )}

          <Button onClick={handleSave} loading={saving} fullWidth>Enregistrer les modifications</Button>

          {/* Outils marketing — Business : bannière promo */}
          {shop?.plan === 'business' ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Megaphone size={16} className="text-[#0A66FF]" />
                <h2 className="font-bold text-[#0D1B3E] dark:text-white">Bannière promotionnelle</h2>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
                Affichez un message promo en haut de votre boutique publique (ex : &quot;Livraison gratuite ce week-end !&quot;).
              </p>
              <Input
                label="Texte de la bannière"
                placeholder="Ex : -10% sur tout le catalogue ce mois-ci !"
                value={bannerText}
                onChange={e => setBannerText(e.target.value)}
                maxLength={120}
              />
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Couleur</label>
                <input type="color" value={bannerColor} onChange={e => setBannerColor(e.target.value)} className="w-10 h-10 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer bg-transparent" />
                <button
                  onClick={() => setBannerActive(a => !a)}
                  className={`ml-auto flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${bannerActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
                >
                  {bannerActive ? <Check size={14} /> : null} {bannerActive ? 'Activée' : 'Désactivée'}
                </button>
              </div>
              {bannerActive && bannerText && (
                <div className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white text-center" style={{ backgroundColor: bannerColor }}>
                  {bannerText}
                </div>
              )}
              <Button onClick={handleSaveBanner} loading={saving} fullWidth variant="outline">Enregistrer la bannière</Button>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-center gap-3">
              <Megaphone size={18} className="text-[#0A66FF] flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                La bannière promotionnelle et les autres outils marketing sont disponibles avec le plan{' '}
                <button onClick={() => setTab('plan')} className="font-bold underline">Business</button>.
              </p>
            </div>
          )}

          {/* Danger zone */}
          <div className="border-2 border-red-200 dark:border-red-900/50 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} className="text-red-500" />
              <h2 className="font-bold text-red-600 dark:text-red-400 text-sm">Zone dangereuse</h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              La suppression de la boutique est <strong>irréversible</strong>. Tous vos produits, commandes et données seront perdus définitivement.
            </p>
            <button
              onClick={() => { setDeleteConfirm(''); setShowDeleteModal(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold text-sm rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-800"
            >
              <Trash2 size={15} /> Supprimer cette boutique
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Supprimer la boutique</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Cette action est <strong className="text-red-500">irréversible</strong>. Pour confirmer, tapez le nom exact de votre boutique :
              <strong className="block mt-1 text-gray-800 dark:text-gray-200">{shop?.name}</strong>
            </p>
            <input
              type="text"
              placeholder={shop?.name}
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-red-400 text-sm mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteShop}
                disabled={deleteConfirm !== shop?.name || deleting}
                className="flex-1 px-4 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Suppression...</>
                ) : (
                  <><Trash2 size={15} /> Supprimer définitivement</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Paiements */}
      {tab === 'paiements' && (
        <div className="flex flex-col gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
            {shop?.plan === 'free' ? (
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Avec le plan Gratuit, vos clients paient automatiquement et en sécurité via FedaPay (Mobile Money MTN, Moov, Wave, Orange...). Renseignez vos numéros ci-dessous : c&apos;est sur ces numéros que Shoply vous reversera vos gains après chaque commande livrée.
              </p>
            ) : (
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Ajoutez vos numéros de paiement. Vos clients verront ces options au moment de commander.
              </p>
            )}
          </div>

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

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-bold text-[#0D1B3E] dark:text-white flex items-center gap-2">
              <span className="text-xl">🏦</span> Virement bancaire
            </h2>
            <Input label="Nom de la banque" placeholder="Ex : UBA, BGFIBANK..." value={bankName} onChange={e => setBankName(e.target.value)} />
            <Input label="Numéro de compte / IBAN" placeholder="BJ XX XXXX XXXX..." value={bankAccount} onChange={e => setBankAccount(e.target.value)} />
          </div>

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
        <div className="flex flex-col gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-start gap-3">
            <Crown size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Plan actuel : <strong>{PLANS.find(p => p.key === shop?.plan)?.label}</strong></p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Sélectionnez un plan pour le modifier. Les changements sont immédiats.</p>
            </div>
          </div>

          {/* Avantages Business actifs */}
          {shop?.plan === 'business' && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#0A66FF]" />
                  <h3 className="font-bold text-[#0D1B3E] dark:text-white text-sm">Livraisons gratuites ce mois-ci</h3>
                </div>
                <span className="text-xs font-black text-[#0A66FF] bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  {freeDeliveriesRemaining}/5 restantes
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((freeDeliveriesUsed / 5) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                La livraison est offerte automatiquement aux clients à la commande, jusqu&apos;à 5 fois par mois.
              </p>
            </div>
          )}

          {/* Support */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${shop?.plan === 'business' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
              <Headset size={20} className={shop?.plan === 'business' ? 'text-purple-600 dark:text-purple-400' : 'text-[#0A66FF]'} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#0D1B3E] dark:text-white text-sm">{shop?.plan === 'business' ? 'Support prioritaire ⚡' : 'Support par email'}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {shop?.plan === 'business'
                  ? "Votre boutique Business bénéficie d'une réponse prioritaire de l'équipe Shoply."
                  : 'Une question, un problème ? Écrivez-nous, notre équipe vous répond par email.'}
              </p>
            </div>
            <a
              href={`mailto:didilolade@gmail.com?subject=${encodeURIComponent((shop?.plan === 'business' ? '[Support prioritaire Business] ' : '[Support Shoply] ') + (shop?.name || ''))}`}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-white text-xs font-bold rounded-xl transition-colors ${shop?.plan === 'business' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[#0A66FF] hover:bg-blue-700'}`}
            >
              <Mail size={13} /> Contacter
            </a>
          </div>

          {PLANS.map(plan => {
            const isActive = shop?.plan === plan.key;
            const isDowngrade = plan.key === 'free' && shop?.plan !== 'free';
            return (
              <div key={plan.key} className={`bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border-2 transition-all
                ${isActive ? 'border-[#0A66FF]' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isActive && <div className="flex items-center gap-1 text-[#0A66FF] text-xs font-bold"><CheckCircle2 size={12} /> Plan actuel</div>}
                      {'popular' in plan && !isActive && <span className="text-[10px] bg-[#0A66FF] text-white font-bold px-2 py-0.5 rounded-full">POPULAIRE</span>}
                    </div>
                    <h3 className="font-black text-gray-900 dark:text-white text-base">{plan.label}</h3>
                    <p className="text-[#0A66FF] font-black text-sm mt-0.5">{plan.price}<span className="text-gray-400 font-normal text-xs">{plan.period}</span></p>
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Check size={11} className="text-green-500 flex-shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {!isActive && (
                    <button
                      onClick={() => isDowngrade ? setPendingPlan(plan.key) : handleChangePlan(plan.key)}
                      disabled={changingPlan}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-1.5
                        ${isDowngrade
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          : 'bg-[#0A66FF] text-white hover:bg-blue-700'}`}
                    >
                      {changingPlan && <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                      {isDowngrade ? 'Rétrograder' : 'Payer & Activer'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <p className="text-xs text-gray-400 text-center">Annulation ou changement possible à tout moment.</p>
        </div>
      )}

      {/* Payment failed modal — offers retry or staying on Free for now */}
      {paymentFailedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-yellow-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Paiement non effectué</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Le paiement n&apos;a pas abouti (annulé, expiré ou solde Mobile Money insuffisant). Aucun montant n&apos;a été débité. Si c&apos;est une erreur, vous pouvez réessayer. Sinon, vous restez sur le <strong>plan Gratuit</strong> (10 produits maximum, 1 boutique, paiement Mobile Money via FedaPay) — vous pourrez repasser au plan payant plus tard quand vous le souhaitez.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPaymentFailedPlan(null)}
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors"
              >
                Rester en Gratuit
              </button>
              <button
                onClick={() => { const plan = paymentFailedPlan; setPaymentFailedPlan(null); handleChangePlan(plan); }}
                className="flex-1 px-4 py-3 rounded-2xl bg-[#0A66FF] text-white font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingPlan === 'free' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-yellow-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Rétrograder au Gratuit</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3 mb-5 flex items-start gap-2">
              <AlertTriangle size={14} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700 dark:text-yellow-300">Vous perdrez l'accès aux fonctionnalités avancées : statistiques, coupons, QR code, badge vérifié.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPendingPlan(null)} className="flex-1 px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button
                onClick={() => handleChangePlan('free')}
                disabled={changingPlan}
                className="flex-1 px-4 py-3 rounded-2xl bg-gray-700 text-white font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {changingPlan && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Parrainage */}
      {tab === 'parrainage' && (
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Gift size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-black text-lg">Programme Parrainage</h2>
                <p className="text-blue-100 text-xs">Invitez 5 amis → 1 mois Premium offert !</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#0A66FF]" />
                <h3 className="font-bold text-[#0D1B3E] dark:text-white text-sm">Progression</h3>
              </div>
              <span className="text-xs font-black text-[#0A66FF] bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                {shop?.referralCount ?? 0}/5
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-[#0A66FF] to-[#3B82F6] h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(((shop?.referralCount ?? 0) / 5) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(shop?.referralCount ?? 0) >= 5
                ? 'Objectif atteint !'
                : `Encore ${5 - (shop?.referralCount ?? 0)} parrainage(s) pour débloquer 1 mois Premium`}
            </p>

            {/* Premium unlocked banner */}
            {shop?.premiumUntil && new Date(shop.premiumUntil) > new Date() && (
              <div className="mt-4 flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="text-sm font-black text-green-700 dark:text-green-400">1 mois Premium débloqué !</p>
                  <p className="text-xs text-green-600 dark:text-green-500">
                    Valable jusqu&apos;au {new Date(shop.premiumUntil).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Referral link */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-[#0D1B3E] dark:text-white text-sm mb-1">Votre lien de parrainage</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Partagez ce lien. Chaque boutique créée via votre code compte comme 1 parrainage.
            </p>
            {shop?.referralCode ? (
              <>
                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-3 mb-3">
                  <code className="flex-1 text-xs font-mono text-[#0A66FF] font-bold break-all">
                    myshoply.web.app/auth/register?ref={shop.referralCode}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://myshoply.web.app/auth/register?ref=${shop.referralCode}`);
                      toast.success('Lien copié !');
                    }}
                    className="flex-shrink-0 w-9 h-9 bg-[#0A66FF] text-white rounded-xl flex items-center justify-center"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <span className="text-xs text-gray-500">Code :</span>
                  <span className="font-black text-gray-800 dark:text-white text-sm tracking-widest">{shop.referralCode}</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(shop.referralCode!); toast.success('Code copié !'); }}
                    className="ml-auto text-gray-400 hover:text-[#0A66FF] transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-xs text-gray-400">Code de parrainage non disponible</p>
            )}
          </div>

          {/* How it works */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-[#0D1B3E] dark:text-white text-sm mb-3">Comment ça marche ?</h3>
            <div className="flex flex-col gap-3">
              {[
                { num: '1', text: 'Partagez votre lien ou code à vos amis' },
                { num: '2', text: 'Ils créent leur boutique Shoply via votre lien' },
                { num: '3', text: 'Après 5 inscriptions validées, vous recevez automatiquement 1 mois Premium gratuit' },
              ].map(step => (
                <div key={step.num} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-[#0A66FF]">{step.num}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Affiliation */}
      {tab === 'affiliation' && (
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Share2 size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-black text-lg">Programme d&apos;affiliation</h2>
                <p className="text-purple-100 text-xs">Recommandez des produits Shoply et touchez {AFFILIATE_RATE * 100}% sur chaque vente générée.</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Ventes générées', value: affiliateOrders.length },
              { label: 'Commission totale', value: `${affiliateOrders.reduce((s, o) => s + (o.affiliateCommission || 0), 0).toLocaleString()} F` },
              { label: 'En attente', value: `${affiliateOrders.filter(o => !o.affiliateCommissionPaid).reduce((s, o) => s + (o.affiliateCommission || 0), 0).toLocaleString()} F` },
            ].map(k => (
              <div key={k.label} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm text-center">
                <p className="text-lg font-black text-[#0D1B3E] dark:text-white">{k.value}</p>
                <p className="text-xs text-gray-400 mt-1">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Affiliate link */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-[#0D1B3E] dark:text-white text-sm mb-1">Votre lien d&apos;affiliation</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Partagez ce lien vers la marketplace Shoply. Si quelqu&apos;un achète un produit après l&apos;avoir cliqué, vous touchez {AFFILIATE_RATE * 100}% du montant de sa commande.
            </p>
            {user && (
              <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-3">
                <code className="flex-1 text-xs font-mono text-purple-700 dark:text-purple-400 font-bold break-all">
                  {getAffiliateLink(user.uid).replace('https://', '')}
                </code>
                <button
                  onClick={() => { navigator.clipboard.writeText(getAffiliateLink(user.uid)); toast.success('Lien copié !'); }}
                  className="flex-shrink-0 w-9 h-9 bg-purple-600 text-white rounded-xl flex items-center justify-center"
                >
                  <Copy size={14} />
                </button>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-[#0D1B3E] dark:text-white text-sm mb-3">Comment ça marche ?</h3>
            <div className="flex flex-col gap-3">
              {[
                { num: '1', text: 'Partagez votre lien d\'affiliation (vers la marketplace ou vers un produit précis)' },
                { num: '2', text: 'Une personne clique sur votre lien puis achète un produit dans une boutique Shoply' },
                { num: `${AFFILIATE_RATE * 100}%`, text: `Dès que le vendeur confirme avoir reçu le paiement du client, vous touchez ${AFFILIATE_RATE * 100}% du montant de la commande` },
                { num: '⏱', text: `Le vendeur a ${PAYOUT_DEADLINE_DAYS} jours après confirmation du paiement pour vous régler en Mobile Money. Passé ce délai, vous pouvez signaler le litige à Shoply avec une preuve` },
              ].map(step => (
                <div key={step.num} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-black text-purple-600">{step.num}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Liste des ventes */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-[#0D1B3E] dark:text-white text-sm mb-3">Ventes générées</h3>
            {affiliateLoading ? (
              <div className="flex flex-col gap-2">{[1,2].map(i => <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />)}</div>
            ) : affiliateOrders.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Aucune vente générée pour l&apos;instant.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {affiliateOrders.map(o => {
                  const s = affiliateShops[o.shopId];
                  const dispute = affiliateDisputes.find(d => d.orderId === o.id);
                  const daysSincePayment = o.paymentReceivedAt
                    ? Math.floor((Date.now() - new Date(o.paymentReceivedAt).getTime()) / (1000 * 60 * 60 * 24))
                    : null;
                  const canDispute = o.paymentReceived && !o.affiliateCommissionPaid && !dispute
                    && daysSincePayment !== null && daysSincePayment >= PAYOUT_DEADLINE_DAYS;
                  return (
                    <div key={o.id} className="flex flex-col gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{s?.name || 'Boutique Shoply'}</p>
                          <p className="text-xs text-gray-400">{new Date(o.createdAt!).toLocaleDateString('fr-FR')} · Commande {o.total.toLocaleString()} F</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-purple-600">{(o.affiliateCommission || 0).toLocaleString()} F</p>
                          <Badge variant={o.affiliateCommissionPaid ? 'green' : 'yellow'} size="sm">{o.affiliateCommissionPaid ? 'Payée' : 'En attente'}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                        <Badge variant={o.paymentReceived ? 'green' : 'gray'} size="sm">
                          {o.paymentReceived ? 'Client : a payé' : 'Client : paiement non confirmé'}
                        </Badge>
                        {!o.affiliateCommissionPaid && o.paymentReceived && (
                          dispute ? (
                            <Badge variant={dispute.reviewed ? 'green' : 'yellow'} size="sm">
                              {dispute.reviewed ? 'Litige traité' : 'Litige signalé'}
                            </Badge>
                          ) : canDispute ? (
                            <button
                              onClick={() => setDisputeOrder(o)}
                              className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                            >
                              <Flag size={12} /> Signaler le non-paiement
                            </button>
                          ) : (
                            <p className="text-xs text-gray-400">
                              Délai vendeur : {PAYOUT_DEADLINE_DAYS - (daysSincePayment ?? 0)} j restant(s)
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dispute affiliation modal */}
      <Modal
        isOpen={!!disputeOrder}
        onClose={() => { setDisputeOrder(null); setDisputeReason(''); setDisputeDetails(''); setDisputeProof([]); }}
        title="Signaler un non-paiement"
        size="md"
      >
        {disputeOrder && (
          <div className="flex flex-col gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-3">
              <p className="text-sm font-bold text-purple-700 dark:text-purple-400">
                Commission de {(disputeOrder.affiliateCommission || 0).toLocaleString()} F — {affiliateShops[disputeOrder.shopId]?.name || 'Boutique Shoply'}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-500">
                Le client a payé mais le vendeur ne vous a pas réglé sous {PAYOUT_DEADLINE_DAYS} jours. L&apos;équipe Shoply va contacter le vendeur.
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Motif</label>
              <select
                value={disputeReason}
                onChange={e => setDisputeReason(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#0A66FF] text-sm"
              >
                <option value="">Sélectionner un motif</option>
                <option value="Le vendeur ne répond pas">Le vendeur ne répond pas</option>
                <option value="Le vendeur refuse de payer">Le vendeur refuse de payer</option>
                <option value="Le vendeur dit avoir payé mais je n'ai rien reçu">Le vendeur dit avoir payé mais je n&apos;ai rien reçu</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Détails (optionnel)</label>
              <textarea
                value={disputeDetails}
                onChange={e => setDisputeDetails(e.target.value)}
                rows={3}
                placeholder="Expliquez la situation..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#0A66FF] text-sm resize-none"
              />
            </div>
            <ImageUploader images={disputeProof} onChange={setDisputeProof} max={1} label="Capture d'écran (preuve)" />
            <Button onClick={handleSubmitDispute} disabled={submittingDispute || !disputeReason}>
              {submittingDispute ? 'Envoi...' : 'Envoyer le signalement'}
            </Button>
          </div>
        )}
      </Modal>

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
