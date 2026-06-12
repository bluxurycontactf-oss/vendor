'use client';
import { useEffect, useState } from 'react';
import { getShopBySlug, getPublicProducts, createOrder, getCouponByCode, incrementCouponUsage, subscribeToShop, unsubscribeFromShop, isSubscribed, createReport, updateShop } from '@/lib/firestore';
import { Shop, Product, OrderItem, Coupon } from '@/types';
import { ShoppingCart, MapPin, Phone, MessageCircle, Zap, Minus, Plus, Search, Package, Star, ChevronLeft, ArrowRight, X, Tag, Bell, BellOff, Flag, ShieldAlert, Share2, Truck, Link2, ShieldCheck } from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { getFCMToken, notificationsSupported } from '@/lib/messaging';
import { useLanguage } from '@/context/LanguageContext';
import { getShopUrl } from '@/lib/shopUrl';
import { AFFILIATE_RATE, captureAffiliateParam, getPendingAffiliateUid } from '@/lib/affiliate';
import { calculateFedapayFee } from '@/lib/fees';
import { openOrderCheckout } from '@/lib/fedapay';
import { createPaidOrder } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartItem { product: Product; qty: number; }

function safePhone(p: string): string {
  return p.replace(/[^0-9+\-() ]/g, '').slice(0, 20);
}

export default function ShopClient() {
  const [slug, setSlug] = useState('');
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'shop' | 'cart' | 'checkout' | 'product'>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSending, setReportSending] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const parts = window.location.pathname.split('/');
    const idx = parts.indexOf('shop');
    const rawSlug = idx !== -1 ? parts[idx + 1] : '';
    if (rawSlug && /^[a-z0-9-]{2,60}$/.test(rawSlug)) setSlug(rawSlug);
    else if (rawSlug) setNotFound(true);
    captureAffiliateParam();
  }, []);

  useEffect(() => {
    if (!slug) return;
    getShopBySlug(slug).then(async shopData => {
      if (!shopData || !shopData.isActive) { setNotFound(true); setLoading(false); return; }
      setShop(shopData);
      getPublicProducts(shopData.id!).then(p => {
        setProducts(p);
        setLoading(false);
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('product');
        if (productId) {
          const found = p.find(item => item.id === productId);
          if (found) { setSelectedProduct(found); setView('product'); }
        }
      });
      if (notificationsSupported()) {
        const stored = localStorage.getItem(`sub_${shopData.id}`);
        if (stored) {
          const still = await isSubscribed(shopData.id!, stored);
          setSubscribed(still);
        }
      }
    });
  }, [slug]);

  const categories = [t('shop.category_all'), ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const filtered = products
    .filter(p => selectedCategory === t('shop.category_all') || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const featuredProducts = shop?.plan === 'business' ? products.filter(p => p.isFeatured) : [];

  const currentMonth = new Date().toISOString().slice(0, 7);
  const freeDeliveriesUsed = shop?.freeDeliveriesMonth === currentMonth ? (shop?.freeDeliveriesUsed || 0) : 0;
  const freeDeliveryAvailable = shop?.plan === 'business' && freeDeliveriesUsed < 5;

  const shopUrl = shop ? getShopUrl(shop.slug) : '';

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`${product.name} ✓`);
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const cartSubtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percent'
      ? Math.round(cartSubtotal * appliedCoupon.discountValue / 100)
      : appliedCoupon.discountValue
    : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  // Plan Gratuit : paiement obligatoire via FedaPay (escrow Shoply), avec
  // frais de paiement ajoutés au panier et reversés à FedaPay.
  const isFreePlan = shop?.plan === 'free';
  const fedapayFee = isFreePlan ? calculateFedapayFee(cartTotal) : 0;
  const grandTotal = cartTotal + fedapayFee;

  const handleSubscribe = async () => {
    if (!shop || subLoading) return;
    setSubLoading(true);
    try {
      const token = await getFCMToken();
      if (!token) { toast.error('Notifications non supportées ou refusées'); setSubLoading(false); return; }
      if (subscribed) {
        await unsubscribeFromShop(shop.id!, token);
        localStorage.removeItem(`sub_${shop.id}`);
        setSubscribed(false);
        toast.success('OK');
      } else {
        await subscribeToShop(shop.id!, token);
        localStorage.setItem(`sub_${shop.id}`, token);
        setSubscribed(true);
        toast.success(`${t('shop.subscribed')} 🔔`);
      }
    } catch { toast.error('Erreur'); }
    finally { setSubLoading(false); }
  };

  const applyCoupon = async () => {
    if (!shop || !couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const c = await getCouponByCode(shop.id!, couponCode.trim());
      if (!c) { toast.error('Code promo invalide'); setCouponLoading(false); return; }
      if (c.expiresAt && new Date(c.expiresAt) < new Date()) { toast.error('Code expiré'); setCouponLoading(false); return; }
      if (c.maxUses && c.usageCount >= c.maxUses) { toast.error('Limite atteinte'); setCouponLoading(false); return; }
      if (c.minOrderAmount && cartSubtotal < c.minOrderAmount) { toast.error(`Min: ${c.minOrderAmount.toLocaleString()} FCFA`); setCouponLoading(false); return; }
      setAppliedCoupon(c);
      toast.success(`Code appliqué ! -${c.discountType === 'percent' ? c.discountValue + '%' : c.discountValue.toLocaleString() + ' F'}`);
    } catch { toast.error('Erreur lors de la vérification'); }
    finally { setCouponLoading(false); }
  };

  const handleOrder = async () => {
    if (!shop || !checkoutName || !checkoutPhone) { toast.error('⚠️'); return; }
    setOrdering(true);
    try {
      const items: OrderItem[] = cart.map(i => ({ productId: i.product.id!, productName: i.product.name, price: i.product.price, quantity: i.qty }));
      const notes = appliedCoupon ? `Coupon: ${appliedCoupon.code} (-${discountAmount.toLocaleString()} F)` : '';
      const orderData: Parameters<typeof createOrder>[0] = { shopId: shop.id!, customerName: checkoutName, customerPhone: checkoutPhone, customerAddress: checkoutAddress, items, total: cartTotal, status: 'pending', paymentMethod: paymentMethod as 'mobile_money', notes };
      if (freeDeliveryAvailable) orderData.deliveryFee = 0;
      const affUid = getPendingAffiliateUid();
      if (affUid && affUid !== shop.ownerId) {
        orderData.affiliateUid = affUid;
        orderData.affiliateCommission = Math.round(cartTotal * AFFILIATE_RATE);
      }
      await createOrder(orderData);
      if (appliedCoupon?.id) await incrementCouponUsage(appliedCoupon.id);
      if (freeDeliveryAvailable) {
        const isNewMonth = shop.freeDeliveriesMonth !== currentMonth;
        await updateShop(shop.id!, {
          freeDeliveriesMonth: currentMonth,
          freeDeliveriesUsed: isNewMonth ? 1 : freeDeliveriesUsed + 1,
        }).catch(() => {});
      }
      setOrderDone(true);
      setCart([]);
    } catch { toast.error('Erreur lors de la commande'); }
    finally { setOrdering(false); }
  };

  // Plan Gratuit : paiement via FedaPay (escrow Shoply), commande créée
  // côté serveur uniquement après vérification de la transaction.
  const handlePayWithFedapay = async () => {
    if (!shop || !checkoutName || !checkoutPhone) { toast.error('⚠️'); return; }
    setOrdering(true);
    try {
      await openOrderCheckout({
        amount: grandTotal,
        description: `Commande chez ${shop.name}`,
        customerPhone: checkoutPhone,
        onSuccess: async (transactionId) => {
          try {
            const items: OrderItem[] = cart.map(i => ({ productId: i.product.id!, productName: i.product.name, price: i.product.price, quantity: i.qty }));
            const notes = appliedCoupon ? `Coupon: ${appliedCoupon.code} (-${discountAmount.toLocaleString()} F)` : '';
            const affUid = getPendingAffiliateUid();
            await createPaidOrder({
              shopId: shop.id!,
              items,
              customerName: checkoutName,
              customerPhone: checkoutPhone,
              customerAddress: checkoutAddress,
              notes,
              subtotal: cartTotal,
              deliveryFee: 0,
              fedapayFee,
              total: grandTotal,
              transactionId,
              affiliateUid: affUid && affUid !== shop.ownerId ? affUid : undefined,
            });
            if (appliedCoupon?.id) await incrementCouponUsage(appliedCoupon.id);
            setOrderDone(true);
            setCart([]);
          } catch {
            toast.error('Paiement reçu mais erreur lors de la création de la commande. Contactez le support avec votre numéro de transaction.');
          } finally {
            setOrdering(false);
          }
        },
        onCancel: () => setOrdering(false),
        onError: (msg) => { toast.error(msg); setOrdering(false); },
      });
    } catch {
      toast.error('Erreur lors du paiement');
      setOrdering(false);
    }
  };

  const handleReport = async () => {
    if (!shop || !reportReason) return;
    setReportSending(true);
    try {
      await createReport({ shopId: shop.id!, shopName: shop.name, shopSlug: shop.slug, reason: reportReason, details: reportDetails || undefined });
      toast.success('Signalement envoyé. Merci !');
      setShowReportModal(false);
      setReportReason('');
      setReportDetails('');
    } catch {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setReportSending(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-[#0A66FF] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium text-sm">Loading…</p>
      </div>
    </div>
  );

  if (notFound || !shop) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6">
      <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center">
        <Package size={36} className="text-gray-400" />
      </div>
      <h1 className="text-xl font-black text-gray-800 text-center">Boutique introuvable</h1>
      <p className="text-gray-500 text-sm text-center">Cette boutique n&apos;existe pas ou a été désactivée.</p>
      <a href="/" className="text-[#0A66FF] hover:underline font-medium text-sm">← Retour à l&apos;accueil</a>
    </div>
  );

  if (shop.suspended) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center">
        <ShieldAlert size={36} className="text-red-500" />
      </div>
      <h1 className="text-xl font-black text-gray-800">Boutique suspendue</h1>
      <p className="text-gray-500 text-sm max-w-xs">
        Cette boutique a été suspendue suite à des signalements. Elle n&apos;est temporairement plus accessible.
      </p>
      <a href="/" className="text-[#0A66FF] hover:underline font-medium text-sm">← Retour à l&apos;accueil</a>
    </div>
  );

  /* ── PRODUCT DETAIL VIEW ── */
  if (view === 'product' && selectedProduct) return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => { setView('shop'); setSelectedProduct(null); }} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <span className="font-bold text-gray-900 truncate flex-1">{selectedProduct.name}</span>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="h-72 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          {selectedProduct.images?.[0]
            ? <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
            : <span className="text-7xl">📦</span>}
        </div>
        <div className="p-5">
          <h1 className="text-xl font-black text-gray-900 mb-2">{selectedProduct.name}</h1>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-2xl font-black text-[#0A66FF]">{selectedProduct.price.toLocaleString()} FCFA</span>
            {selectedProduct.comparePrice && selectedProduct.comparePrice > selectedProduct.price && (
              <span className="text-gray-400 line-through text-sm">{selectedProduct.comparePrice.toLocaleString()} F</span>
            )}
          </div>
          <span className={`inline-flex text-xs font-bold px-3 py-1 rounded-full mb-4 ${selectedProduct.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {selectedProduct.stock > 0 ? `${t('shop.in_stock')} (${selectedProduct.stock})` : t('shop.out_of_stock')}
          </span>
          {selectedProduct.description && (
            <p className="text-gray-600 text-sm leading-relaxed">{selectedProduct.description}</p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3">
        {shop?.whatsapp && (
          <a
            href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`${t('shop.whatsapp_msg')} *${selectedProduct.name}* (${selectedProduct.price.toLocaleString()} FCFA)`)}`}
            target="_blank"
            className="flex-shrink-0 bg-green-500 text-white font-bold py-4 px-5 rounded-2xl flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
          </a>
        )}
        <button
          onClick={() => { addToCart(selectedProduct); setView('shop'); setSelectedProduct(null); }}
          disabled={selectedProduct.stock === 0}
          className="flex-1 bg-[#0A66FF] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} /> {t('shop.add_to_cart')}
        </button>
      </div>
    </div>
  );

  /* ── CART VIEW ── */
  if (view === 'cart') return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setView('shop')} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <span className="font-bold text-gray-900 flex-1">{t('shop.cart')} ({cartCount})</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-36 flex flex-col gap-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 mt-20">
            <ShoppingCart size={48} className="text-gray-300" />
            <p className="text-gray-500 font-medium">{t('shop.cart_empty')}</p>
            <button onClick={() => setView('shop')} className="text-[#0A66FF] font-semibold text-sm">{t('shop.back')}</button>
          </div>
        ) : cart.map(item => (
          <div key={item.product.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {item.product.images?.[0] ? <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl">📦</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{item.product.name}</p>
              <p className="text-[#0A66FF] font-black text-sm">{item.product.price.toLocaleString()} F</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => updateQty(item.product.id!, -1)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Minus size={14} className="text-gray-600" />
              </button>
              <span className="w-6 text-center font-bold text-sm">{item.qty}</span>
              <button onClick={() => updateQty(item.product.id!, 1)} className="w-8 h-8 rounded-lg bg-[#0A66FF]/10 flex items-center justify-center">
                <Plus size={14} className="text-[#0A66FF]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">{t('shop.subtotal')}</span>
            <span className="text-xl font-black text-gray-900">{cartSubtotal.toLocaleString()} FCFA</span>
          </div>
          <button onClick={() => setView('checkout')} className="w-full bg-[#0A66FF] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
            {t('shop.checkout')} <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  /* ── CHECKOUT VIEW ── */
  if (view === 'checkout') {
    const pm = shop.paymentMethods;
    const availableMethods = [
      pm?.mtn && { key: 'mtn', label: 'MTN Mobile Money', number: pm.mtn, color: 'bg-yellow-400', emoji: '🟡' },
      pm?.moov && { key: 'moov', label: 'Moov Money', number: pm.moov, color: 'bg-blue-500', emoji: '🔵' },
      pm?.wave && { key: 'wave', label: 'Wave', number: pm.wave, color: 'bg-teal-400', emoji: '🌊' },
      pm?.orange && { key: 'orange', label: 'Orange Money', number: pm.orange, color: 'bg-orange-400', emoji: '🟠' },
      pm?.bankName && { key: 'bank', label: pm.bankName, number: pm.bankAccount || '', color: 'bg-gray-500', emoji: '🏦' },
    ].filter(Boolean) as { key: string; label: string; number: string; color: string; emoji: string }[];

    if (orderDone) return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl">✅</div>
        <h1 className="text-2xl font-black text-gray-900">✅</h1>
        <p className="text-gray-500 text-sm max-w-xs">{t('shop.order_success')}</p>

        {isFreePlan ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm w-full max-w-xs text-left flex flex-col gap-2">
            <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
              <ShieldCheck size={18} />
              <span>{t('shop.escrow_success')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs border-t border-gray-100 pt-2">
              <Truck size={14} className="text-[#0A66FF]" />
              <span>{t('shop.delivery_by_shoply')}</span>
            </div>
          </div>
        ) : paymentMethod && availableMethods.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm w-full max-w-xs text-left">
            <p className="font-bold text-gray-900 mb-2 text-sm">{t('shop.payment_instructions')} :</p>
            {(() => {
              const m = availableMethods.find(m => m.key === paymentMethod);
              return m ? (
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">{m.emoji} {m.label}</p>
                  <p className="text-lg font-black text-[#0A66FF]">{m.number}</p>
                  <p className="text-xs text-gray-400">Montant : {cartTotal.toLocaleString()} FCFA</p>
                </div>
              ) : null;
            })()}
            {pm?.instructions && <p className="text-xs text-gray-500 mt-2 border-t pt-2">{pm.instructions}</p>}
          </div>
        )}

        <button onClick={() => { setView('shop'); setOrderDone(false); setCheckoutName(''); setCheckoutPhone(''); setCheckoutAddress(''); setPaymentMethod(''); }}
          className="mt-2 px-6 py-3 bg-[#0A66FF] text-white font-bold rounded-2xl text-sm">
          {t('shop.back')}
        </button>
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setView('cart')} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900 flex-1">{t('shop.checkout')}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-36 flex flex-col gap-4">
          {/* Livraison gratuite (Business) */}
          {freeDeliveryAvailable && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
              <Truck size={18} className="text-green-600 flex-shrink-0" />
              <p className="text-sm font-semibold text-green-700">{t('shop.free_delivery_available')}</p>
            </div>
          )}

          {/* Infos client */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            <h2 className="font-bold text-gray-900">Vos informations</h2>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">{t('shop.name')} *</label>
              <input value={checkoutName} onChange={e => setCheckoutName(e.target.value)} placeholder={t('shop.name_placeholder') || t('shop.name')}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0A66FF] outline-none text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">{t('shop.phone')} *</label>
              <input value={checkoutPhone} onChange={e => setCheckoutPhone(e.target.value)} type="tel" placeholder="+229 01 XX XX XX"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0A66FF] outline-none text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600">{t('shop.address')}</label>
              <input value={checkoutAddress} onChange={e => setCheckoutAddress(e.target.value)} placeholder="Quartier, ville..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0A66FF] outline-none text-sm" />
            </div>
          </div>

          {/* Moyens de paiement */}
          {isFreePlan ? (
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" /> {t('shop.pay_secure_fedapay')}
              </h2>
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                <ShieldCheck size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-700 leading-relaxed">{t('shop.escrow_notice')}</p>
              </div>
              <div className="flex items-center gap-2 px-1">
                <Truck size={15} className="text-[#0A66FF] flex-shrink-0" />
                <p className="text-xs text-gray-500">{t('shop.delivery_by_shoply')}</p>
              </div>
            </div>
          ) : availableMethods.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <h2 className="font-bold text-gray-900">{t('shop.payment_method')}</h2>
              {availableMethods.map(m => (
                <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${paymentMethod === m.key ? 'border-[#0A66FF] bg-blue-50' : 'border-gray-200'}`}>
                  <span className="text-2xl">{m.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.number}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === m.key ? 'border-[#0A66FF]' : 'border-gray-300'}`}>
                    {paymentMethod === m.key && <div className="w-3 h-3 bg-[#0A66FF] rounded-full" />}
                  </div>
                </button>
              ))}
              {pm?.instructions && (
                <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-3">{pm.instructions}</p>
              )}
            </div>
          )}

          {/* Coupon */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Tag size={16} className="text-[#0A66FF]" />{t('shop.coupon')}</h2>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <span className="text-sm font-bold text-green-700">{appliedCoupon.code} — -{discountAmount.toLocaleString()} F</span>
                <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-gray-400 hover:text-red-500 ml-2"><X size={15} /></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="PROMO20"
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0A66FF] outline-none text-sm uppercase tracking-wider" />
                <button onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()}
                  className="px-4 py-2.5 bg-[#0A66FF] text-white font-bold rounded-xl text-sm disabled:opacity-50 flex items-center gap-1">
                  {couponLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : t('shop.apply')}
                </button>
              </div>
            )}
          </div>

          {/* Récapitulatif */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3">Récapitulatif</h2>
            {cart.map(i => (
              <div key={i.product.id} className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{i.product.name} x{i.qty}</span>
                <span className="font-semibold">{(i.product.price * i.qty).toLocaleString()} F</span>
              </div>
            ))}
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>{t('shop.discount')} ({appliedCoupon.code})</span>
                <span className="font-semibold">-{discountAmount.toLocaleString()} F</span>
              </div>
            )}
            {freeDeliveryAvailable && (
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>{t('shop.delivery_fee')}</span>
                <span className="font-semibold">{t('shop.free_delivery')} 🎉</span>
              </div>
            )}
            {isFreePlan && (
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{t('shop.fedapay_fee')}</span>
                <span className="font-semibold">{fedapayFee.toLocaleString()} F</span>
              </div>
            )}
            <div className="flex justify-between font-black text-gray-900 pt-3 border-t border-gray-100 mt-2">
              <span>{t('shop.total')}</span>
              <span className="text-[#0A66FF]">{(isFreePlan ? grandTotal : cartTotal).toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
          {isFreePlan ? (
            <button onClick={handlePayWithFedapay} disabled={ordering || !checkoutName || !checkoutPhone}
              className="w-full bg-[#0A66FF] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50">
              {ordering ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>{t('shop.pay_secure_fedapay')} · {grandTotal.toLocaleString()} F</>}
            </button>
          ) : (
            <button onClick={handleOrder} disabled={ordering || !checkoutName || !checkoutPhone}
              className="w-full bg-[#0A66FF] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50">
              {ordering ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : t('shop.place_order')}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── MAIN SHOP VIEW ── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bannière promo (Business) */}
      {shop.plan === 'business' && shop.promoBanner?.active && shop.promoBanner?.text && (
        <div className="text-center text-sm font-semibold text-white px-4 py-2.5" style={{ backgroundColor: shop.promoBanner.color || '#0A66FF' }}>
          {shop.promoBanner.text}
        </div>
      )}

      {/* Shop header */}
      <div className="px-4 sm:px-6 max-w-3xl mx-auto pt-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 border-2 border-gray-100 shadow-sm flex items-center justify-center text-3xl font-black text-[#0A66FF] overflow-hidden flex-shrink-0">
            {shop.logo ? <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" /> : shop.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{shop.name}</h1>
              {(shop.plan === 'premium' || shop.plan === 'business') && (
                <VerifiedBadge plan={shop.plan} size={16} />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap mt-1">
              {shop.city && <span className="flex items-center gap-1"><MapPin size={11} />{shop.city}</span>}
              <span className="flex items-center gap-1"><Star size={11} className="text-yellow-400 fill-yellow-400" />4.8</span>
              <span>{products.length} produits</span>
            </div>
          </div>
        </div>

        {shop.description && <p className="text-gray-500 text-sm mb-4 leading-relaxed">{shop.description}</p>}

        {/* Contact + Subscribe */}
        <div className="flex gap-2 mb-5 flex-wrap items-center">
          {shop.phone && (
            <a href={`tel:${safePhone(shop.phone)}`} className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 shadow-sm">
              <Phone size={13} className="text-[#0A66FF]" /> Appeler
            </a>
          )}
          {shop.whatsapp && (
            <a href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}`} target="_blank" className="flex items-center gap-1.5 px-3 py-2 bg-green-500 rounded-xl text-xs font-semibold text-white shadow-sm">
              <MessageCircle size={13} /> WhatsApp
            </a>
          )}
          {shop.plan !== 'free' && notificationsSupported() && (
            <button
              onClick={handleSubscribe}
              disabled={subLoading}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${subscribed ? 'bg-blue-100 text-[#0A66FF] border border-blue-200' : 'bg-white border border-gray-200 text-gray-700'}`}
            >
              {subLoading
                ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : subscribed ? <BellOff size={13} /> : <Bell size={13} />}
              {subscribed ? t('shop.subscribed') : t('shop.subscribe')}
            </button>
          )}
          {shop.plan === 'business' && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 shadow-sm"
            >
              <Share2 size={13} className="text-[#0A66FF]" /> {t('shop.share')}
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder={t('shop.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-[#0A66FF] text-sm shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {categories.map(c => (
            <button key={c} onClick={() => setSelectedCategory(c)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${selectedCategory === c ? 'bg-[#0A66FF] border-[#0A66FF] text-white' : 'border-gray-200 bg-white text-gray-600'}`}
            >{c}</button>
          ))}
        </div>

        {/* Produits vedettes (Business) */}
        {featuredProducts.length > 0 && !search && selectedCategory === t('shop.category_all') && (
          <div className="mb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <Star size={14} className="text-purple-500 fill-purple-500" />
              <h2 className="text-sm font-black text-gray-900">{t('shop.featured_products')}</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {featuredProducts.map(p => (
                <div key={p.id} className="flex-shrink-0 w-32 bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-purple-100 active:scale-95 transition-transform cursor-pointer" onClick={() => { setSelectedProduct(p); setView('product'); }}>
                  <div className="h-24 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center overflow-hidden">
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-3xl">📦</span>}
                  </div>
                  <div className="p-2">
                    <h3 className="font-bold text-gray-900 text-xs mb-1 truncate">{p.name}</h3>
                    <p className="font-black text-[#0A66FF] text-xs">{p.price.toLocaleString()} F</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-medium text-sm">—</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-28">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-transform cursor-pointer" onClick={() => { setSelectedProduct(p); setView('product'); }}>
                <div className="h-36 sm:h-44 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                  {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-4xl">📦</span>}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 text-xs mb-1 truncate">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-[#0A66FF] text-sm">{p.price.toLocaleString()} F</p>
                      {p.comparePrice && p.comparePrice > p.price && (
                        <p className="text-xs text-gray-400 line-through">{p.comparePrice.toLocaleString()} F</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {shop?.whatsapp && (
                        <a
                          href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`${t('shop.whatsapp_msg')} *${p.name}* (${p.price.toLocaleString()} FCFA)`)}`}
                          target="_blank"
                          onClick={e => e.stopPropagation()}
                          className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center text-white active:opacity-70"
                        >
                          <MessageCircle size={14} />
                        </a>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); addToCart(p); }}
                        className="w-8 h-8 bg-[#0A66FF] rounded-xl flex items-center justify-center text-white active:opacity-70"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky cart button */}
      {cartCount > 0 && (
        <button onClick={() => setView('cart')}
          className="fixed bottom-14 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto bg-[#0A66FF] text-white px-6 py-4 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-between sm:justify-start sm:gap-4 font-bold z-40">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} />
            <span className="bg-white text-[#0A66FF] text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
            <span className="sm:inline">Voir le panier</span>
          </div>
          <span className="font-black">{cartTotal.toLocaleString()} FCFA</span>
        </button>
      )}

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100 py-2 px-4 z-30 flex items-center justify-between">
        <a href="/" className="text-xs text-gray-400 hover:text-[#0A66FF] transition-colors flex items-center gap-1">
          <Zap size={10} /> Propulsé par Shoply
        </a>
        <button
          onClick={() => setShowReportModal(true)}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <Flag size={10} /> Signaler
        </button>
      </div>

      {/* Report modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-900 flex items-center gap-2">
                <Flag size={16} className="text-red-500" /> Signaler la boutique
              </h2>
              <button onClick={() => setShowReportModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">Votre signalement sera examiné par notre équipe sous 24h.</p>
            <div className="mb-3">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Raison *</label>
              <select
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0A66FF]"
              >
                <option value="">Choisir une raison...</option>
                <option value="Arnaque / Produits non livrés">Arnaque / Produits non livrés</option>
                <option value="Faux produits / Contrefaçons">Faux produits / Contrefaçons</option>
                <option value="Prix abusifs / Tromperie">Prix abusifs / Tromperie</option>
                <option value="Contenu inapproprié">Contenu inapproprié</option>
                <option value="Boutique inactive / Abandon">Boutique inactive / Abandon</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Détails (optionnel)</label>
              <textarea
                value={reportDetails}
                onChange={e => setReportDetails(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Décrivez le problème en détail..."
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0A66FF] resize-none"
              />
            </div>
            <button
              onClick={handleReport}
              disabled={!reportReason || reportSending}
              className="w-full bg-red-500 text-white font-bold py-3.5 rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {reportSending
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Flag size={15} /> Envoyer le signalement</>}
            </button>
          </div>
        </div>
      )}

      {/* Share modal (Business) */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-900 flex items-center gap-2">
                <Share2 size={16} className="text-[#0A66FF]" /> {t('shop.share')}
              </h2>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${shop.name} - ${shopUrl}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 text-green-700 font-bold text-sm"
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shopUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-50 text-blue-700 font-bold text-sm"
              >
                <span className="w-[18px] h-[18px] rounded-full bg-blue-700 text-white text-xs font-black flex items-center justify-center flex-shrink-0">f</span> Facebook
              </a>
              <button
                onClick={() => { navigator.clipboard.writeText(shopUrl); toast.success('Lien copié !'); }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold text-sm"
              >
                <Link2 size={18} /> Copier le lien
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
