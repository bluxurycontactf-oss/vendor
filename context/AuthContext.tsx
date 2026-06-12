'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, updateProfile, User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getShopsByOwner } from '@/lib/firestore';
import { Shop } from '@/types';

interface AuthContextType {
  user: FirebaseUser | null;
  shop: Shop | null;
  shops: Shop[];
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  refreshShop: () => Promise<void>;
  switchShop: (shopId: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [shop, setShop] = useState<Shop | null>(null);
  const [ready, setReady] = useState(false);

  const loadShops = async (uid: string) => {
    try {
      const list = await getShopsByOwner(uid);
      setShops(list);
      const savedId = typeof window !== 'undefined' ? localStorage.getItem('activeShopId') : null;
      setShop((savedId && list.find(s => s.id === savedId)) || list[0] || null);
    } catch {
      setShops([]);
      setShop(null);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setReady(false);
      setUser(u);
      if (u) {
        await loadShops(u.uid);
      } else {
        setShops([]);
        setShop(null);
      }
      setReady(true);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged handles everything from here
  };

  const register = async (email: string, password: string, name: string): Promise<FirebaseUser> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refreshShop = async () => {
    if (!user) return;
    await loadShops(user.uid);
  };

  const switchShop = (shopId: string) => {
    const found = shops.find(s => s.id === shopId);
    if (!found) return;
    setShop(found);
    if (typeof window !== 'undefined') localStorage.setItem('activeShopId', shopId);
  };

  return (
    <AuthContext.Provider value={{ user, shop, shops, ready, login, register, logout, refreshShop, switchShop }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
