import { auth } from './firebase';

const API_BASE = process.env.NEXT_PUBLIC_NOTIFY_API_URL || '';

async function authedPost<T = { success: boolean; reason?: string }>(path: string, body: unknown): Promise<T> {
  const user = auth.currentUser;
  if (!user) throw new Error('Non authentifié');
  const token = await user.getIdToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erreur serveur');
  return json as T;
}

// Activates a paid plan after a FedaPay payment, verified server-side.
export async function activatePlan(shopId: string, plan: 'premium' | 'business', transactionId: string): Promise<{ success: boolean }> {
  return authedPost('/activate-plan', { shopId, plan, transactionId });
}

// Processes a referral code server-side (Admin SDK), so the referrer's
// shop document can be updated regardless of who triggers it.
export async function processReferral(referralCode: string): Promise<{ success: boolean; reason?: string }> {
  return authedPost('/process-referral', { referralCode });
}

export interface CreatePaidOrderPayload {
  shopId: string;
  items: { productId: string; productName: string; price: number; quantity: number; image?: string }[];
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerEmail?: string;
  notes?: string;
  subtotal: number;
  deliveryFee: number;
  fedapayFee: number;
  total: number;
  transactionId: string;
  affiliateUid?: string;
}

// Crée une commande payée (plan Gratuit, escrow FedaPay) après vérification
// de la transaction côté serveur. Pas d'authentification requise : le client
// peut être anonyme, la sécurité repose sur la vérification FedaPay.
export async function createPaidOrder(payload: CreatePaidOrderPayload): Promise<{ success: boolean; orderId: string }> {
  const res = await fetch(`${API_BASE}/create-paid-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erreur serveur');
  return json;
}

// Renvoie une notification push au livreur assigné pour le relancer (admin uniquement).
export async function resendDeliveryNotification(orderId: string): Promise<{ success: boolean }> {
  return authedPost('/resend-delivery-notification', { orderId });
}
