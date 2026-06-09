import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Domaines racines — le sous-domaine est extrait en les retirant
const ROOT_DOMAINS = [
  process.env.NEXT_PUBLIC_APP_DOMAIN || 'myvendor.web.app',
  'localhost:3000',
  'localhost',
];

// Sous-domaines système à ne pas traiter comme des boutiques
const SYSTEM_SUBDOMAINS = ['www', 'api', 'admin', 'dashboard', 'app'];

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // Ne pas traiter les assets Next.js
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Extraire le sous-domaine
  let shopSlug = '';
  for (const domain of ROOT_DOMAINS) {
    if (hostname !== domain && hostname.endsWith(`.${domain}`)) {
      shopSlug = hostname.slice(0, hostname.length - domain.length - 1);
      break;
    }
  }

  // Si sous-domaine boutique détecté
  if (shopSlug && !SYSTEM_SUBDOMAINS.includes(shopSlug)) {
    // Éviter la boucle infinie
    if (pathname.startsWith('/shop/')) return NextResponse.next();

    const url = request.nextUrl.clone();
    url.pathname = `/shop/${shopSlug}${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.json|icon).*)'],
};
