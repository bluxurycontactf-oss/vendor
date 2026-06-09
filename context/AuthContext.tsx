'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, updateProfile, User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getShopByOwner } from '@/lib/firestore';
import { Shop } from '@/types';

interface AuthContextType {
  user: FirebaseUser | null;
  shop: Shop | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  refreshShop: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchShop = async (uid: string) => {
    try {
      const s = await getShopByOwner(uid);
      setShop(s);
    } catch { setShop(null); }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await fetchShop(u.uid);
      else setShop(null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string): Promise<FirebaseUser> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
    setShop(null);
  };

  const refreshShop = async () => {
    if (user) await fetchShop(user.uid);
  };

  return (
    <AuthContext.Provider value={{ user, shop, loading, login, register, logout, refreshShop }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
