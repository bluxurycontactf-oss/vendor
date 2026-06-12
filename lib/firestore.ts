import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, addDoc, serverTimestamp,
  onSnapshot, Unsubscribe, increment
} from 'firebase/firestore';
import { db } from './firebase';
import { Shop, Product, Order, Customer, Coupon, ShopSubscription, Report, AffiliateDispute, DeliveryAgent } from '@/types';

// ── Shops ──────────────────────────────────────────────────────────────
export async function createShop(data: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(collection(db, 'shops'));
  const referralCode = ref.id.replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase();
  await setDoc(ref, {
    ...data,
    // Une boutique est toujours créée au plan Gratuit. Les plans payants
    // sont activés ensuite via le backend (/activate-plan), après
    // vérification du paiement FedaPay.
    plan: 'free',
    id: ref.id,
    suspended: false,
    referralCode,
    referralCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function getShopByCustomDomain(domain: string): Promise<Shop | null> {
  const q = query(collection(db, 'shops'), where('customDomain', '==', domain));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Shop;
}

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  const q = query(collection(db, 'shops'), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Shop;
}

export async function getShopById(id: string): Promise<Shop | null> {
  const snap = await getDoc(doc(db, 'shops', id));
  return snap.exists() ? (snap.data() as Shop) : null;
}

export async function getShopByOwner(ownerId: string): Promise<Shop | null> {
  const q = query(collection(db, 'shops'), where('ownerId', '==', ownerId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Shop;
}

export async function getShopsByOwner(ownerId: string): Promise<Shop[]> {
  const q = query(collection(db, 'shops'), where('ownerId', '==', ownerId));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Shop);
}

export async function updateShop(id: string, data: Partial<Shop>): Promise<void> {
  await updateDoc(doc(db, 'shops', id), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteShop(id: string): Promise<void> {
  await deleteDoc(doc(db, 'shops', id));
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  const q = query(collection(db, 'shops'), where('slug', '==', slug));
  const snap = await getDocs(q);
  return snap.empty;
}

// ── Products ───────────────────────────────────────────────────────────
export async function addProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(collection(db, 'products'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  return ref.id;
}

export async function getProducts(shopId: string): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('shopId', '==', shopId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Product);
}

export async function getPublicProducts(shopId: string): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('shopId', '==', shopId), where('isActive', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Product);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, 'products', id), { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

// ── Orders ─────────────────────────────────────────────────────────────
export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(collection(db, 'orders'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  return ref.id;
}

export async function getOrders(shopId: string): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('shopId', '==', shopId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Order);
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  await updateDoc(doc(db, 'orders', id), { status, updatedAt: new Date().toISOString() });
}

// ── Affiliation produits ───────────────────────────────────────────────
export async function getMyAffiliateOrders(uid: string): Promise<Order[]> {
  // Pas de orderBy ici pour éviter de nécessiter un index composite Firestore
  const q = query(collection(db, 'orders'), where('affiliateUid', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Order)
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
}

export async function markAffiliateCommissionPaid(id: string): Promise<void> {
  await updateDoc(doc(db, 'orders', id), { affiliateCommissionPaid: true, updatedAt: new Date().toISOString() });
}

export async function markOrderPaymentReceived(id: string): Promise<void> {
  await updateDoc(doc(db, 'orders', id), {
    paymentReceived: true,
    paymentReceivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// ── Litiges affiliation ─────────────────────────────────────────────────
export async function createAffiliateDispute(data: Omit<AffiliateDispute, 'id' | 'createdAt' | 'reviewed'>): Promise<string> {
  const ref = doc(collection(db, 'affiliateDisputes'));
  await setDoc(ref, { ...data, id: ref.id, reviewed: false, createdAt: new Date().toISOString() });
  return ref.id;
}

export async function getMyAffiliateDisputes(uid: string): Promise<AffiliateDispute[]> {
  // Pas de orderBy ici pour éviter de nécessiter un index composite Firestore
  const q = query(collection(db, 'affiliateDisputes'), where('affiliateUid', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as AffiliateDispute)
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
}

export async function getAllAffiliateDisputes(): Promise<AffiliateDispute[]> {
  const q = query(collection(db, 'affiliateDisputes'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as AffiliateDispute);
}

export async function markDisputeReviewed(id: string): Promise<void> {
  await updateDoc(doc(db, 'affiliateDisputes', id), { reviewed: true });
}

// ── Livraison Shoply (réseau de livreurs) ───────────────────────────────
export async function getDeliveryAgents(): Promise<DeliveryAgent[]> {
  const snap = await getDocs(collection(db, 'deliveryAgents'));
  return snap.docs.map(d => d.data() as DeliveryAgent);
}

export async function getDeliveryAgentByEmail(email: string): Promise<DeliveryAgent | null> {
  const snap = await getDoc(doc(db, 'deliveryAgents', email));
  return snap.exists() ? (snap.data() as DeliveryAgent) : null;
}

export async function saveDeliveryAgent(data: Omit<DeliveryAgent, 'id' | 'createdAt'>): Promise<void> {
  const ref = doc(db, 'deliveryAgents', data.email);
  await setDoc(ref, { ...data, id: data.email, createdAt: new Date().toISOString() }, { merge: true });
}

export async function setDeliveryAgentActive(email: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, 'deliveryAgents', email), { active });
}

export async function saveAgentFcmToken(email: string, fcmToken: string): Promise<void> {
  await updateDoc(doc(db, 'deliveryAgents', email), { fcmToken, updatedAt: new Date().toISOString() });
}

export async function getAllDeliveryOrders(): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('paymentMethod', '==', 'fedapay'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Order)
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
}

export async function getOrdersAwaitingAssignment(): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('deliveryStatus', '==', 'awaiting_assignment'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Order)
    .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
}

export async function getOrdersAwaitingPayout(): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('deliveryStatus', '==', 'delivered'), where('vendorPayoutPaid', '==', false));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Order)
    .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
}

export async function assignDeliveryAgent(orderId: string, agentEmail: string, agentName: string): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), {
    deliveryAgentId: agentEmail,
    deliveryAgentName: agentName,
    deliveryStatus: 'assigned',
    updatedAt: new Date().toISOString(),
  });
}

export async function getOrdersForAgent(email: string): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('deliveryAgentId', '==', email));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Order)
    .sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
}

export async function markOrderDelivered(orderId: string): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), {
    deliveryStatus: 'delivered',
    status: 'delivered',
    updatedAt: new Date().toISOString(),
  });
}

export async function markOrderDeliveryFailed(orderId: string): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), {
    deliveryStatus: 'failed',
    updatedAt: new Date().toISOString(),
  });
}

export async function markVendorPayoutPaid(orderId: string): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), {
    vendorPayoutPaid: true,
    vendorPayoutPaidAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

// ── Customers ──────────────────────────────────────────────────────────
export async function getCustomers(shopId: string): Promise<Customer[]> {
  const q = query(collection(db, 'customers'), where('shopId', '==', shopId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Customer);
}

// ── Coupons ────────────────────────────────────────────────────────────
export async function getCoupons(shopId: string): Promise<Coupon[]> {
  const q = query(collection(db, 'coupons'), where('shopId', '==', shopId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Coupon);
}

export async function addCoupon(data: Omit<Coupon, 'id' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'coupons'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: new Date().toISOString() });
  return ref.id;
}

export async function updateCoupon(id: string, data: Partial<Coupon>): Promise<void> {
  await updateDoc(doc(db, 'coupons', id), data);
}

export async function deleteCoupon(id: string): Promise<void> {
  await deleteDoc(doc(db, 'coupons', id));
}

export async function getCouponByCode(shopId: string, code: string): Promise<Coupon | null> {
  const q = query(collection(db, 'coupons'), where('shopId', '==', shopId), where('code', '==', code.toUpperCase()), where('isActive', '==', true));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Coupon;
}

export async function incrementCouponUsage(id: string): Promise<void> {
  await updateDoc(doc(db, 'coupons', id), { usageCount: increment(1) });
}

// ── Shop Subscriptions ─────────────────────────────────────────────────
export async function subscribeToShop(shopId: string, fcmToken: string): Promise<void> {
  const ref = doc(db, 'subscriptions', `${shopId}_${fcmToken.slice(-20)}`);
  await setDoc(ref, { id: ref.id, shopId, fcmToken, createdAt: new Date().toISOString() }, { merge: true });
}

export async function unsubscribeFromShop(shopId: string, fcmToken: string): Promise<void> {
  await deleteDoc(doc(db, 'subscriptions', `${shopId}_${fcmToken.slice(-20)}`));
}

export async function isSubscribed(shopId: string, fcmToken: string): Promise<boolean> {
  const ref = doc(db, 'subscriptions', `${shopId}_${fcmToken.slice(-20)}`);
  const snap = await getDoc(ref);
  return snap.exists();
}

// ── Featured / Business shops ─────────────────────────────────────────
export async function getFeaturedShops(): Promise<Shop[]> {
  const q = query(
    collection(db, 'shops'),
    where('plan', '==', 'business'),
    where('isActive', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(d => d.data() as Shop)
    .filter(s => !s.suspended);
}

// ── Marketplace: tous les produits actifs, toutes boutiques confondues ──
export interface MarketProduct extends Product {
  shopName: string;
  shopSlug: string;
  shopPlan: Shop['plan'];
  shopCity?: string;
}

export async function getAllMarketProducts(): Promise<MarketProduct[]> {
  const [shopsSnap, productsSnap] = await Promise.all([
    getDocs(query(collection(db, 'shops'), where('isActive', '==', true))),
    getDocs(query(collection(db, 'products'), where('isActive', '==', true))),
  ]);

  const shopsById = new Map<string, Shop>();
  shopsSnap.docs.forEach(d => {
    const shop = d.data() as Shop;
    if (!shop.suspended) shopsById.set(shop.id!, shop);
  });

  const planRank: Record<Shop['plan'], number> = { business: 0, premium: 1, free: 2 };

  return productsSnap.docs
    .map(d => d.data() as Product)
    .filter(p => p.stock > 0)
    .map(p => {
      const shop = shopsById.get(p.shopId);
      if (!shop) return null;
      return { ...p, shopName: shop.name, shopSlug: shop.slug, shopPlan: shop.plan, shopCity: shop.city } as MarketProduct;
    })
    .filter((p): p is MarketProduct => p !== null)
    .sort((a, b) => {
      const rankDiff = planRank[a.shopPlan] - planRank[b.shopPlan];
      if (rankDiff !== 0) return rankDiff;
      return (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
    });
}

// ── Recommended (Premium) shops ────────────────────────────────────────
export async function getRecommendedShops(): Promise<Shop[]> {
  const q = query(
    collection(db, 'shops'),
    where('plan', '==', 'premium'),
    where('isActive', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(d => d.data() as Shop)
    .filter(s => !s.suspended);
}

// ── Anti-fraud: Reports ────────────────────────────────────────────────
export async function createReport(data: Omit<Report, 'id' | 'createdAt' | 'reviewed'>): Promise<string> {
  const ref = doc(collection(db, 'reports'));
  await setDoc(ref, { ...data, id: ref.id, reviewed: false, createdAt: new Date().toISOString() });
  return ref.id;
}

export async function getReports(): Promise<Report[]> {
  const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Report);
}

export async function markReportReviewed(id: string): Promise<void> {
  await updateDoc(doc(db, 'reports', id), { reviewed: true });
}

// ── Admin ops ──────────────────────────────────────────────────────────
export async function getAllShops(): Promise<Shop[]> {
  const snap = await getDocs(collection(db, 'shops'));
  return snap.docs.map(d => d.data() as Shop);
}

export async function suspendShop(id: string): Promise<void> {
  await updateDoc(doc(db, 'shops', id), { suspended: true, updatedAt: new Date().toISOString() });
}

export async function unsuspendShop(id: string): Promise<void> {
  await updateDoc(doc(db, 'shops', id), { suspended: false, updatedAt: new Date().toISOString() });
}
