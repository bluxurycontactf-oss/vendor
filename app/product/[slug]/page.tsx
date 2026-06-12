import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, Shop } from '@/types';
import { getProductSlug, getProductIdFromSlug } from '@/lib/slug';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import BuyButton from './BuyButton';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft, MapPin, Store, Zap, ShoppingBag } from 'lucide-react';

async function getActiveProductsWithShops() {
  const [shopsSnap, productsSnap] = await Promise.all([
    getDocs(query(collection(db, 'shops'), where('isActive', '==', true))),
    getDocs(query(collection(db, 'products'), where('isActive', '==', true))),
  ]);

  const shopsById = new Map<string, Shop>();
  shopsSnap.docs.forEach(d => {
    const shop = d.data() as Shop;
    if (!shop.suspended) shopsById.set(shop.id!, shop);
  });

  const products = productsSnap.docs
    .map(d => d.data() as Product)
    .filter(p => p.stock > 0 && shopsById.has(p.shopId));

  return { products, shopsById };
}

export async function generateStaticParams() {
  const { products } = await getActiveProductsWithShops();
  return products.map(p => ({ slug: getProductSlug(p) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { products, shopsById } = await getActiveProductsWithShops();
  const id = getProductIdFromSlug(slug);
  const product = products.find(p => p.id === id);
  if (!product) return { title: 'Produit introuvable | Shoply' };

  const shop = shopsById.get(product.shopId);
  const title = `${product.name} - ${shop?.name ?? 'Shoply'} | Shoply`;
  const description = product.description?.trim()
    ? product.description.slice(0, 160)
    : `Achetez ${product.name} à ${product.price.toLocaleString()} FCFA chez ${shop?.name ?? 'un vendeur'} sur Shoply${shop?.city ? `, ${shop.city}` : ''}.`;
  const image = product.images?.[0];

  return {
    title,
    description,
    alternates: { canonical: `https://myshoply.web.app/product/${slug}` },
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { products, shopsById } = await getActiveProductsWithShops();
  const id = getProductIdFromSlug(slug);
  const product = products.find(p => p.id === id);
  if (!product) notFound();
  const shop = shopsById.get(product.shopId)!;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Link href="/produits" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0A66FF] transition-colors">
            <ArrowLeft size={15} /> Retour à la marketplace
          </Link>
          <Link href="/" className="flex items-center gap-2 font-black text-lg text-[#0A66FF]">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0A66FF] to-[#3B82F6] rounded-xl flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            Shoply
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 grid sm:grid-cols-2">
          <div className="aspect-square bg-gray-50 dark:bg-gray-800 relative">
            {product.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-gray-300" />
              </div>
            )}
            {shop.plan !== 'free' && (
              <div className="absolute top-3 left-3">
                <VerifiedBadge plan={shop.plan as 'premium' | 'business'} size={24} />
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col gap-3">
            <p className="text-xs font-bold text-[#0A66FF] uppercase tracking-wide">{product.category}</p>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">{product.name}</h1>
            <p className="text-2xl font-black text-[#0A66FF]">{product.price.toLocaleString()} F CFA</p>
            {product.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-line">{product.description}</p>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mt-2">
              <Store size={15} className="text-[#0A66FF]" />
              <Link href={`/shop/${shop.slug}`} className="font-semibold hover:underline">{shop.name}</Link>
            </div>
            {shop.city && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={15} /> {shop.city}
              </div>
            )}

            <Suspense fallback={<div className="mt-4 w-full bg-[#0A66FF] text-white font-bold py-3 rounded-2xl text-center opacity-80">Commander maintenant</div>}>
              <BuyButton shopSlug={shop.slug} productId={product.id!} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 py-4 text-center">
        <Link href="/" className="text-xs text-gray-400 hover:text-[#0A66FF] transition-colors flex items-center justify-center gap-1">
          <Zap size={10} /> Propulsé par Shoply
        </Link>
      </div>
    </div>
  );
}
