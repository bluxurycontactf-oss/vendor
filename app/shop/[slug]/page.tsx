import ShopClient from './ShopClient';

export function generateStaticParams() {
  return [{ slug: '_' }];
}

export default function ShopPage() {
  return <ShopClient />;
}
