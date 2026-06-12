// Frais FedaPay appliqués sur les commandes payées en ligne (plan Gratuit).
// Ajoutés au panier du client en plus du prix des produits, pour que le
// vendeur reçoive bien le montant exact de ses produits + livraison.
export const FEDAPAY_FEE_RATE = 0.035; // 3,5%
export const FEDAPAY_FEE_FIXED = 100; // FCFA

export function calculateFedapayFee(amount: number): number {
  return Math.round(amount * FEDAPAY_FEE_RATE) + FEDAPAY_FEE_FIXED;
}
