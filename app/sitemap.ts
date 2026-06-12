import { MetadataRoute } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, Shop } from '@/types';
import { getProductSlug } from '@/lib/slug';

const BASE_URL = 'https://myshoply.web.app';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [shopsSnap, productsSnap] = await Promise.all([
    getDocs(query(collection(db, 'shops'), where('isActive', '==', true))),
    getDocs(query(collection(db, 'products'), where('isActive', '==', true))),
  ]);

  const shops = shopsSnap.docs.map(d => d.data() as Shop).filter(s => !s.suspended);
  const shopsById = new Map(shops.map(s => [s.id!, s]));
  const products = productsSnap.docs
    .map(d => d.data() as Product)
    .filter(p => p.stock > 0 && shopsById.has(p.shopId));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/produits`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/boutiques`, changeFrequency: 'daily', priority: 0.8 },
  ];

  const shopUrls: MetadataRoute.Sitemap = shops.map(s => ({
    url: `${BASE_URL}/shop/${s.slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const productUrls: MetadataRoute.Sitemap = products.map(p => ({
    url: `${BASE_URL}/product/${getProductSlug(p)}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticUrls, ...shopUrls, ...productUrls];
}
