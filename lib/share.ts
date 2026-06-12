import { APP_DOMAIN } from './shopUrl';
import { getProductSlug } from './slug';

export interface ShareProductData {
  id?: string;
  name: string;
  price: number;
  shopName: string;
  image?: string;
}

export function getProductShareUrl(product: ShareProductData): string {
  return `https://${APP_DOMAIN}/product/${getProductSlug(product)}`;
}

export function buildShareText(product: ShareProductData): string {
  const url = getProductShareUrl(product);
  return `🛍️ ${product.name} — ${product.price.toLocaleString()} FCFA\nDisponible chez ${product.shopName} 👉 ${url}`;
}

export type ShareResult = 'shared' | 'copied' | 'cancelled';

// Partage natif (TikTok, Instagram, WhatsApp...) sur mobile via Web Share API,
// avec repli sur la copie du texte (+lien) dans le presse-papiers sur desktop.
export async function shareProduct(product: ShareProductData): Promise<ShareResult> {
  const text = buildShareText(product);
  const url = getProductShareUrl(product);

  if (typeof navigator !== 'undefined' && navigator.share) {
    let files: File[] | undefined;
    if (product.image) {
      try {
        const res = await fetch(product.image);
        const blob = await res.blob();
        const file = new File([blob], 'produit.jpg', { type: blob.type || 'image/jpeg' });
        if (navigator.canShare?.({ files: [file] })) files = [file];
      } catch {
        // Image inaccessible (CORS...) — on partage juste le texte + lien
      }
    }
    try {
      await navigator.share(files ? { title: product.name, text, files } : { title: product.name, text, url });
      return 'shared';
    } catch (err) {
      if ((err as Error).name === 'AbortError') return 'cancelled';
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}`);
    return 'copied';
  } catch {
    return 'cancelled';
  }
}
