'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getShopBySlug, getPublicProducts, createOrder } from '@/lib/firestore';
import { Shop, Product, OrderItem } from '@/types';
import { ShoppingCart, MapPin, Phone, MessageCircle, Zap, Minus, Plus, X, Search, Package, Star } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface CartItem { product: Product; qty: number; }

export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!slug) return;
    Promise.all([getShopBySlug(slug), getShopBySlug(slug).then(s => s ? getPublicProducts(s.id!) : [])]).then(([shopData]) => {
      if (!shopData) { setNotFound(true); setLoading(false); return; }
      setShop(shopData);
      getPublicProducts(shopData.id!).then(p => { setProducts(p); setLoading(false); });
    });
  }, [slug]);

  const categories = ['Tout', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const filtered = products
    .filter(p => selectedCategory === 'Tout' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`${product.name} ajouté au panier`);
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleOrder = async () => {
    if (!shop || !checkoutName || !checkoutPhone) { toast.error('Remplissez vos informations'); return; }
    setOrdering(true);
    try {
      const items: OrderItem[] = cart.map(i => ({ productId: i.product.id!, productName: i.product.name, price: i.product.price, quantity: i.qty }));
      await createOrder({ shopId: shop.id!, customerName: checkoutName, customerPhone: checkoutPhone, customerAddress: checkoutAddress, items, total: cartTotal, status: 'pending', paymentMethod: 'mobile_money', notes: '' });
      toast.success('Commande passée avec succès !');
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
    } catch { toast.error('Erreur lors de la commande'); }
    finally { setOrdering(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-[#0A66FF] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Chargement de la boutique...</p>
      </div>
    </div>
  );

  if (notFound || !shop) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center">
        <Package size={36} className="text-gray-400" />
      </div>
      <h1 className="text-2xl font-black text-gray-800 dark:text-white">Boutique introuvable</h1>
      <p className="text-gray-500">Cette boutique n&apos;existe pas ou a été désactivée.</p>
      <a href="/" className="text-[#0A66FF] hover:underline font-medium">← Retour à l&apos;accueil</a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header / Banner */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-[#0D1B3E] to-[#0A66FF] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        {shop.banner && <img src={shop.banner} alt="banner" className="absolute inset-0 w-full h-full object-cover opacity-30" />}
      </div>

      {/* Shop info */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-end gap-4 -mt-10 mb-6">
          <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 border-4 border-white dark:border-gray-800 flex items-center justify-center text-4xl shadow-lg font-black text-[#0A66FF] flex-shrink-0">
            {shop.logo ? <img src={shop.logo} alt={shop.name} className="w-full h-full rounded-3xl object-cover" /> : shop.name.charAt(0).toUpperCase()}
          </div>
          <div className="pb-2">
            <h1 className="text-2xl font-black text-[#0D1B3E] dark:text-white">{shop.name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              {shop.city && <span className="flex items-center gap-1"><MapPin size={13} />{shop.city}</span>}
              <span className="flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400" />4.8</span>
              <span>{products.length} produits</span>
            </div>
          </div>
        </div>

        {shop.description && <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl">{shop.description}</p>}

        {/* Contact buttons */}
        <div className="flex gap-3 mb-8">
          {shop.phone && (
            <a href={`tel:${shop.phone}`} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-[#0A66FF] transition-colors">
              <Phone size={16} className="text-[#0A66FF]" /> Appeler
            </a>
          )}
          {shop.whatsapp && (
            <a href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}`} target="_blank" className="flex items-center gap-2 px-4 py-2.5 bg-green-500 rounded-2xl text-sm font-semibold text-white hover:bg-green-600 transition-colors">
              <MessageCircle size={16} /> WhatsApp
            </a>
          )}
        </div>

        {/* Search + categories */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Rechercher un produit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#0A66FF] text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold border-2 transition-all ${selectedCategory === c ? 'bg-[#0A66FF] border-[#0A66FF] text-white' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-[#0A66FF]'}`}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
            {filtered.map(p => (
              <div key={p.id} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedProduct(p)}>
                <div className="h-40 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center text-4xl">
                  {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : '📦'}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-[#0D1B3E] dark:text-white text-sm mb-1 truncate">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-[#0A66FF] text-sm">{p.price.toLocaleString()} F</p>
                      {p.comparePrice && p.comparePrice > p.price && (
                        <p className="text-xs text-gray-400 line-through">{p.comparePrice.toLocaleString()} F</p>
                      )}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); addToCart(p); }}
                      className="w-8 h-8 bg-[#0A66FF] rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 bg-[#0A66FF] text-white px-6 py-4 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center gap-3 font-bold hover:opacity-90 transition-opacity z-40"
        >
          <ShoppingCart size={20} />
          <span>{cartCount} article{cartCount > 1 ? 's' : ''}</span>
          <span className="font-black">{cartTotal.toLocaleString()} F</span>
        </button>
      )}

      {/* Cart modal */}
      <Modal isOpen={showCart} onClose={() => setShowCart(false)} title="Mon panier" size="sm">
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Votre panier est vide</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                  {item.product.images?.[0] ? <img src={item.product.images[0]} alt="" className="w-full h-full object-cover rounded-2xl" /> : '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{item.product.name}</p>
                  <p className="text-xs text-[#0A66FF] font-bold">{item.product.price.toLocaleString()} F</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.product.id!, -1)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"><Minus size={12} /></button>
                  <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                  <button onClick={() => updateQty(item.product.id!, 1)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"><Plus size={12} /></button>
                </div>
              </div>
            ))}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between items-center">
              <span className="font-bold text-gray-700 dark:text-gray-300">Total</span>
              <span className="text-xl font-black text-[#0D1B3E] dark:text-white">{cartTotal.toLocaleString()} FCFA</span>
            </div>
            <Button onClick={() => { setShowCart(false); setShowCheckout(true); }} fullWidth>
              Commander maintenant
            </Button>
          </div>
        )}
      </Modal>

      {/* Checkout modal */}
      <Modal isOpen={showCheckout} onClose={() => setShowCheckout(false)} title="Finaliser la commande" size="sm">
        <div className="flex flex-col gap-4">
          <Input label="Votre nom *" placeholder="Prénom et nom" value={checkoutName} onChange={e => setCheckoutName(e.target.value)} required />
          <Input label="Téléphone *" type="tel" placeholder="+229 01 XX XX XX" value={checkoutPhone} onChange={e => setCheckoutPhone(e.target.value)} required />
          <Input label="Adresse de livraison" placeholder="Quartier, ville..." value={checkoutAddress} onChange={e => setCheckoutAddress(e.target.value)} />
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Récapitulatif</p>
            {cart.map(i => (
              <div key={i.product.id} className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{i.product.name} x{i.qty}</span>
                <span>{(i.product.price * i.qty).toLocaleString()} F</span>
              </div>
            ))}
            <div className="flex justify-between font-black text-[#0D1B3E] dark:text-white mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span>{cartTotal.toLocaleString()} FCFA</span>
            </div>
          </div>
          <Button onClick={handleOrder} loading={ordering} fullWidth>Confirmer la commande</Button>
          <p className="text-xs text-center text-gray-400">Le vendeur vous contactera pour confirmer et organiser le paiement</p>
        </div>
      </Modal>

      {/* Product detail modal */}
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={selectedProduct?.name || ''} size="sm">
        {selectedProduct && (
          <div className="flex flex-col gap-4">
            <div className="h-52 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center text-6xl">
              {selectedProduct.images?.[0] ? <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-cover rounded-2xl" /> : '📦'}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl font-black text-[#0A66FF]">{selectedProduct.price.toLocaleString()} FCFA</span>
                {selectedProduct.comparePrice && selectedProduct.comparePrice > selectedProduct.price && (
                  <span className="text-gray-400 line-through">{selectedProduct.comparePrice.toLocaleString()} F</span>
                )}
              </div>
              {selectedProduct.description && <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{selectedProduct.description}</p>}
              <p className={`text-xs font-semibold mt-2 ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {selectedProduct.stock > 0 ? `✓ En stock (${selectedProduct.stock} disponibles)` : '✗ Rupture de stock'}
              </p>
            </div>
            <Button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} disabled={selectedProduct.stock === 0} fullWidth>
              Ajouter au panier
            </Button>
          </div>
        )}
      </Modal>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 py-3 px-4 text-center z-30">
        <a href="/" className="text-xs text-gray-400 hover:text-[#0A66FF] transition-colors flex items-center justify-center gap-1">
          <Zap size={11} /> Propulsé par Vendor
        </a>
      </div>
    </div>
  );
}
