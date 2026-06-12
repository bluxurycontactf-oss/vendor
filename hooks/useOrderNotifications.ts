'use client';
import { useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Shop } from '@/types';

export function useOrderNotifications(shop: Shop | null) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!shop?.id) return;

    const requestPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };
    requestPermission();

    // Listen only to recent orders (last hour) to avoid firing on initial load
    const since = new Date(Date.now() - 60 * 1000).toISOString();
    const q = query(
      collection(db, 'orders'),
      where('shopId', '==', shop.id),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    let firstLoad = true;
    const unsub = onSnapshot(q, (snap) => {
      if (firstLoad) { firstLoad = false; return; }
      snap.docChanges().forEach(change => {
        if (change.type === 'added') {
          const order = change.doc.data();
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`🛍️ Nouvelle commande — ${shop.name}`, {
              body: `${order.customerName} · ${order.total?.toLocaleString()} FCFA`,
              icon: '/favicon.ico',
            });
          }
        }
      });
    });

    return unsub;
  }, [shop?.id]);
}
