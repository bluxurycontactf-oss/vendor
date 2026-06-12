'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function BuyButton({ shopSlug, productId }: { shopSlug: string; productId: string }) {
  const params = useSearchParams();
  const aff = params.get('aff');
  const href = `/shop/${shopSlug}?product=${productId}${aff ? `&aff=${aff}` : ''}`;

  return (
    <Link href={href} className="mt-4 w-full bg-[#0A66FF] text-white font-bold py-3 rounded-2xl text-center block hover:bg-[#0853CC] transition-colors">
      Commander maintenant
    </Link>
  );
}
