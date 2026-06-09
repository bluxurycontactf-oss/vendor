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
  paymentMethod: 'mtn_momo' | 'moov_money' | 'card' | 'cash_on_delivery' | 'mobile_money';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
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
