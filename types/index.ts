export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}

export interface Shop {
  id?: string;
  ownerId: string;
  ownerEmail?: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  banner?: string;
  primaryColor?: string;
  category: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  whatsapp?: string;
  plan: 'free' | 'premium' | 'business';
  isActive: boolean;
  suspended?: boolean;
  referralCode?: string;
  referralCount?: number;
  premiumUntil?: string;   // ISO date — premium offert par parrainage
  promoBanner?: {          // Outil marketing Business : bannière promo personnalisée
    text: string;
    color?: string;
    active?: boolean;
  };
  freeDeliveriesUsed?: number;   // Plan Business : livraisons gratuites utilisées ce mois-ci
  freeDeliveriesMonth?: string;  // Format "YYYY-MM" — mois du compteur ci-dessus
  paymentMethods?: {
    mtn?: string;
    moov?: string;
    wave?: string;
    orange?: string;
    bankName?: string;
    bankAccount?: string;
    instructions?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopSubscription {
  id?: string;
  shopId: string;
  fcmToken: string;
  createdAt?: string;
}

export interface Coupon {
  id?: string;
  shopId: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usageCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt?: string;
}

export interface Product {
  id?: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  currency?: string;
  stock: number;
  category: string;
  images: string[];
  tags?: string[];
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id?: string;
  shopId: string;
  customerId?: string;
  orderNumber?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  items: OrderItem[];
  subtotal?: number;
  deliveryFee?: number;
  total: number;
  currency?: string;
  paymentMethod: 'mtn_momo' | 'moov_money' | 'card' | 'cash_on_delivery' | 'mobile_money' | 'fedapay';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  affiliateUid?: string;          // uid de l'utilisateur affilié à l'origine de la vente
  affiliateCommission?: number;   // montant de la commission (FCFA), calculé à la commande
  affiliateCommissionPaid?: boolean; // le vendeur a réglé la commission à l'affilié
  paymentReceived?: boolean;      // le vendeur confirme avoir reçu le paiement du client
  paymentReceivedAt?: string;     // date de cette confirmation (point de départ du délai de paiement affilié)

  // Paiement FedaPay (escrow plan Gratuit) ----------------------------------
  fedapayTransactionId?: string;     // id de la transaction FedaPay vérifiée côté serveur
  fedapayFee?: number;               // frais FedaPay (FCFA) ajoutés au panier du client
  vendorPayoutAmount?: number;       // montant (FCFA) à reverser au vendeur (total - frais FedaPay)
  vendorPayoutPaid?: boolean;        // Shoply a reversé ce montant au vendeur
  vendorPayoutPaidAt?: string;       // date du versement

  // Livraison Shoply (réseau de livreurs) -----------------------------------
  deliveryAgentId?: string;          // email du livreur assigné
  deliveryAgentName?: string;
  deliveryStatus?: 'awaiting_assignment' | 'assigned' | 'delivered' | 'failed';

  createdAt?: string;
  updatedAt?: string;
}

export interface DeliveryAgent {
  id?: string;       // = email (utilisé comme identifiant)
  email: string;
  name: string;
  phone: string;
  city: string;
  active: boolean;
  fcmToken?: string; // pour notification automatique des nouvelles livraisons
  createdAt?: string;
}

export interface AffiliateDispute {
  id?: string;
  orderId: string;
  shopId: string;
  shopName: string;
  affiliateUid: string;
  commission: number;
  reason: string;
  details?: string;
  proofUrl?: string;
  reviewed?: boolean;
  createdAt?: string;
}

export interface Customer {
  id?: string;
  shopId: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
  createdAt?: string;
}

export interface Referral {
  id?: string;
  referralCode: string;
  referrerShopId: string;
  referrerOwnerId: string;
  referredUid: string;
  referredEmail?: string;
  createdAt?: string;
}

export interface Payment {
  id?: string;
  shopId: string;
  ownerEmail?: string;
  plan: 'premium' | 'business';
  amount: number;
  currency: 'XOF';
  transactionRef: string;
  createdAt?: string;
}

export interface Report {
  id?: string;
  shopId: string;
  shopName: string;
  shopSlug: string;
  reason: string;
  details?: string;
  reporterIp?: string;
  createdAt?: string;
  reviewed?: boolean;
}

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalVisitors: number;
  pendingOrders: number;
  revenueGrowth: number;
  ordersGrowth: number;
}
