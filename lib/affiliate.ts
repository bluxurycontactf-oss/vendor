export const AFFILIATE_RATE = 0.05; // 5% de commission sur le total de la commande

export const AFFILIATE_STORAGE_KEY = 'pendingAffUid';

export function getAffiliateLink(uid: string): string {
  return `https://myshoply.web.app/produits?aff=${uid}`;
}

export function captureAffiliateParam(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const aff = params.get('aff');
  if (aff) localStorage.setItem(AFFILIATE_STORAGE_KEY, aff);
}

export function getPendingAffiliateUid(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AFFILIATE_STORAGE_KEY);
}
