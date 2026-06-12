export const PLAN_PRICES: Record<'premium' | 'business', number> = {
  premium: 4900,
  business: 14900,
};

export const PLAN_LABELS: Record<'premium' | 'business', string> = {
  premium: 'Premium',
  business: 'Business',
};

type FedaPayInstance = {
  init: (config: unknown) => { open: () => void };
  TRANSACTION_APPROVED: string;
  DIALOG_DISMISSED: string;
};

function getFedaPay(): FedaPayInstance | null {
  return (window as unknown as { FedaPay?: FedaPayInstance }).FedaPay ?? null;
}

export function loadFedaPayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') { reject(new Error('SSR')); return; }
    if (getFedaPay()) { resolve(); return; }
    if (document.getElementById('fedapay-script')) {
      // script tag already added, wait for load
      const interval = setInterval(() => {
        if (getFedaPay()) { clearInterval(interval); resolve(); }
      }, 100);
      return;
    }
    const script = document.createElement('script');
    script.id = 'fedapay-script';
    script.src = 'https://cdn.fedapay.com/checkout.js?v=1.1.7';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Impossible de charger FedaPay'));
    document.body.appendChild(script);
  });
}

export interface PaymentOptions {
  plan: 'premium' | 'business';
  customerEmail: string;
  // transactionId is the FedaPay transaction id, used by the backend to
  // verify the payment server-side via the FedaPay API.
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
  onError: (message: string) => void;
}

export async function openFedaPayCheckout(options: PaymentOptions): Promise<void> {
  await loadFedaPayScript();

  const fp = getFedaPay()!;
  const amount = PLAN_PRICES[options.plan];
  const label = PLAN_LABELS[options.plan];

  fp.init({
    public_key: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY ?? '',
    transaction: {
      amount,
      description: `Abonnement ${label} Shoply — 1 mois`,
      currency: { iso: 'XOF' },
    },
    customer: {
      email: options.customerEmail,
    },
    onComplete(result: { reason: string; transaction?: { id: number; reference: string } }) {
      if (result.reason === fp.TRANSACTION_APPROVED) {
        const id = result.transaction?.id;
        if (!id) {
          options.onError('Transaction invalide — contactez le support.');
          return;
        }
        options.onSuccess(String(id));
      } else if (result.reason === fp.DIALOG_DISMISSED) {
        options.onCancel();
      } else {
        options.onError('Paiement refusé ou annulé.');
      }
    },
  }).open();
}

export interface OrderPaymentOptions {
  amount: number;
  description: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
  onError: (message: string) => void;
}

// Paiement d'une commande (escrow Shoply, plan Gratuit) : montant variable
// (panier + frais FedaPay), vérifié côté serveur via /create-paid-order.
export async function openOrderCheckout(options: OrderPaymentOptions): Promise<void> {
  await loadFedaPayScript();

  const fp = getFedaPay()!;

  fp.init({
    public_key: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY ?? '',
    transaction: {
      amount: options.amount,
      description: options.description,
      currency: { iso: 'XOF' },
    },
    customer: {
      email: options.customerEmail || undefined,
      phone_number: options.customerPhone ? { number: options.customerPhone, country: 'bj' } : undefined,
    },
    onComplete(result: { reason: string; transaction?: { id: number; reference: string } }) {
      if (result.reason === fp.TRANSACTION_APPROVED) {
        const id = result.transaction?.id;
        if (!id) {
          options.onError('Transaction invalide — contactez le support.');
          return;
        }
        options.onSuccess(String(id));
      } else if (result.reason === fp.DIALOG_DISMISSED) {
        options.onCancel();
      } else {
        options.onError('Paiement refusé ou annulé.');
      }
    },
  }).open();
}
