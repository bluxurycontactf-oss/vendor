const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || 'myvendor.web.app';

export function getShopUrl(slug: string): string {
  return `https://${slug}.${APP_DOMAIN}`;
}

export function getShopDomain(slug: string): string {
  return `${slug}.${APP_DOMAIN}`;
}

export { APP_DOMAIN };
