export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getProductSlug(product: { id?: string; name: string }): string {
  return `${slugify(product.name)}-${product.id}`;
}

export function getProductIdFromSlug(slug: string): string {
  const idx = slug.lastIndexOf('-');
  return idx === -1 ? slug : slug.slice(idx + 1);
}
