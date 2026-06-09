const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || 'myshoply.web.app';

export function getShopUrl(slug: string): string {
  return `https://${APP_DOMAIN}/shop/${slug}`;
}

export function getShopDomain(slug: string): string {
  return `${APP_DOMAIN}/shop/${slug}`;
}

export { APP_DOMAIN };
