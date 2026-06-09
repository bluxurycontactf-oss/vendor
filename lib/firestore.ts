import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, addDoc, serverTimestamp,
  onSnapshot, Unsubscribe, increment
} from 'firebase/firestore';
import { db } from './firebase';
import { Shop, Product, Order, Customer } from '@/types';

// ── Shops ──────────────────────────────────────────────────────────────
export async function createShop(data: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(collection(db, 'shops'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  return ref.id;
}

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  const q = query(collection(db, 'shops'), where('slug', '==', slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Shop;
}

export async function getShopByOwner(ownerId: string): Promise<Shop | null> {
  const q = query(collection(db, 'shops'), where('ownerId', '==', ownerId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as Shop;
}

export async function updateShop(id: string, data: Partial<Shop>): Promise<void> {
  await updateDoc(doc(db, 'shops', id), { ...data, updatedAt: new Date().toISOString() });
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

// ── Customers ──────────────────────────────────────────────────────────
export async function getCustomers(shopId: string): Promise<Customer[]> {
  const q = query(collection(db, 'customers'), where('shopId', '==', shopId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Customer);
}
