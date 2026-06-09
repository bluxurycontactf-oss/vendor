'use client';
import { useEffect, useState } from 'react';
import { getShopBySlug, getPublicProducts, createOrder } from '@/lib/firestore';
import { Shop, Product, OrderItem } from '@/types';
import { ShoppingCart, MapPin, Phone, MessageCircle, Zap, Minus, Plus, Search, Package, Star, ChevronLeft, ArrowRight, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CartItem { product: Product; qty: number; }

export default function ShopClient() {
  const [slug, setSlug] = useState('');
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<'shop' | 'cart' | 'checkout' | 'product'>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const parts = window.location.pathname.split('/');
    const idx = parts.indexOf('shop');
    const urlSlug = idx !== -1 ? parts[idx + 1] : '';
    if (urlSlug) setSlug(urlSlug);
  }, []);

  useEffect(() => {
    if (!slug) return;
    getShopBySlug(slug).then(shopData => {
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
    toast.success(`${product.name} ajouté`);
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
      toast.success('Commande passée !');
      setCart([]);
      setCheckoutName('');
      setCheckoutPhone('');
      setCheckoutAddress('');
      setView('shop');
    } catch { toast.error('Erreur lors de la commande'); }
    finally { setOrdering(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-[#0A66FF] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium text-sm">Chargement...</p>
      </div>
    </div>
  );

  if (notFound || !shop) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6">
      <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center">
        <Package size={36} className="text-gray-400" />
      </div>
      <h1 className="text-xl font-black text-gray-800 text-center">Boutique introuvable</h1>
      <p className="text-gray-500 text-sm text-center">Cette boutique n&apos;existe pas ou a été désactivée.</p>
      <a href="/" className="text-[#0A66FF] hover:underline font-medium text-sm">← Retour à l&apos;accueil</a>
    </div>
  );

  /* ── PRODUCT DETAIL VIEW ── */
  if (view === 'product' && selectedProduct) return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => { setView('shop'); setSelectedProduct(null); }} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <span className="font-bold text-gray-900 truncate flex-1">{selectedProduct.name}</span>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="h-72 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          {selectedProduct.images?.[0]
            ? <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
            : <span className="text-7xl">📦</span>}
        </div>
        <div className="p-5">
          <h1 className="text-xl font-black text-gray-900 mb-2">{selectedProduct.name}</h1>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-2xl font-black text-[#0A66FF]">{selectedProduct.price.toLocaleString()} FCFA</span>
            {selectedProduct.comparePrice && selectedProduct.comparePrice > selectedProduct.price && (
              <span className="text-gray-400 line-through text-sm">{selectedProduct.comparePrice.toLocaleString()} F</span>
            )}
          </div>
          <span className={`inline-flex text-xs font-bold px-3 py-1 rounded-full mb-4 ${selectedProduct.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {selectedProduct.stock > 0 ? `En stock (${selectedProduct.stock})` : 'Rupture de stock'}
          </span>
          {selectedProduct.description && (
            <p className="text-gray-600 text-sm leading-relaxed">{selectedProduct.description}</p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <button
          onClick={() => { addToCart(selectedProduct); setView('shop'); setSelectedProduct(null); }}
          disabled={selectedProduct.stock === 0}
          className="w-full bg-[#0A66FF] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} /> Ajouter au panier
        </button>
      </div>
    </div>
  );

  /* ── CART VIEW ── */
  if (view === 'cart') return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setView('shop')} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <span className="font-bold text-gray-900 flex-1">Mon panier ({cartCount})</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-36 flex flex-col gap-3">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 mt-20">
            <ShoppingCart size={48} className="text-gray-300" />
            <p className="text-gray-500 font-medium">Panier vide</p>
            <button onClick={() => setView('shop')} className="text-[#0A66FF] font-semibold text-sm">Continuer mes achats</button>
          </div>
        ) : cart.map(item => (
          <div key={item.product.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {item.product.images?.[0] ? <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl">📦</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{item.product.name}</p>
              <p className="text-[#0A66FF] font-black text-sm">{item.product.price.toLocaleString()} F</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => updateQty(item.product.id!, -1)} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Minus size={14} className="text-gray-600" />
              </button>
              <span className="w-6 text-center font-bold text-sm">{item.qty}</span>
              <button onClick={() => updateQty(item.product.id!, 1)} className="w-8 h-8 rounded-lg bg-[#0A66FF]/10 flex items-center justify-center">
                <Plus size={14} className="text-[#0A66FF]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-xl font-black text-gray-900">{cartTotal.toLocaleString()} FCFA</span>
          </div>
          <button onClick={() => setView('checkout')} className="w-full bg-[#0A66FF] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
            Commander <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  /* ── CHECKOUT VIEW ── */
  if (view === 'checkout') return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setView('cart')} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <span className="font-bold text-gray-900 flex-1">Finaliser la commande</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-36 flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          <h2 className="font-bold text-gray-900">Vos informations</h2>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Nom complet *</label>
            <input value={checkoutName} onChange={e => setCheckoutName(e.target.value)} placeholder="Prénom et nom"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0A66FF] outline-none text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Téléphone *</label>
            <input value={checkoutPhone} onChange={e => setCheckoutPhone(e.target.value)} type="tel" placeholder="+229 01 XX XX XX"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0A66FF] outline-none text-sm" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Adresse de livraison</label>
            <input value={checkoutAddress} onChange={e => setCheckoutAddress(e.target.value)} placeholder="Quartier, ville..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0A66FF] outline-none text-sm" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-3">Récapitulatif</h2>
          {cart.map(i => (
            <div key={i.product.id} className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{i.product.name} x{i.qty}</span>
              <span className="font-semibold">{(i.product.price * i.qty).toLocaleString()} F</span>
            </div>
          ))}
          <div className="flex justify-between font-black text-gray-900 pt-3 border-t border-gray-100 mt-2">
            <span>Total</span>
            <span className="text-[#0A66FF]">{cartTotal.toLocaleString()} FCFA</span>
          </div>
        </div>

        <p className="text-xs text-center text-gray-400">Le vendeur vous contactera pour confirmer et organiser le paiement</p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <button onClick={handleOrder} disabled={ordering}
          className="w-full bg-[#0A66FF] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60">
          {ordering ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Confirmer la commande'}
        </button>
      </div>
    </div>
  );

  /* ── MAIN SHOP VIEW ── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop header */}
      <div className="px-4 sm:px-6 max-w-3xl mx-auto pt-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 border-2 border-gray-100 shadow-sm flex items-center justify-center text-3xl font-black text-[#0A66FF] overflow-hidden flex-shrink-0">
            {shop.logo ? <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" /> : shop.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{shop.name}</h1>
            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap mt-1">
              {shop.city && <span className="flex items-center gap-1"><MapPin size={11} />{shop.city}</span>}
              <span className="flex items-center gap-1"><Star size={11} className="text-yellow-400 fill-yellow-400" />4.8</span>
              <span>{products.length} produits</span>
            </div>
          </div>
        </div>

        {shop.description && <p className="text-gray-500 text-sm mb-4 leading-relaxed">{shop.description}</p>}

        {/* Contact */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {shop.phone && (
            <a href={`tel:${shop.phone}`} className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 shadow-sm">
              <Phone size={13} className="text-[#0A66FF]" /> Appeler
            </a>
          )}
          {shop.whatsapp && (
            <a href={`https://wa.me/${shop.whatsapp.replace(/\D/g, '')}`} target="_blank" className="flex items-center gap-1.5 px-3 py-2 bg-green-500 rounded-xl text-xs font-semibold text-white shadow-sm">
              <MessageCircle size={13} /> WhatsApp
            </a>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-[#0A66FF] text-sm shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {categories.map(c => (
            <button key={c} onClick={() => setSelectedCategory(c)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${selectedCategory === c ? 'bg-[#0A66FF] border-[#0A66FF] text-white' : 'border-gray-200 bg-white text-gray-600'}`}
            >{c}</button>
          ))}
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-medium text-sm">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-28">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-transform cursor-pointer" onClick={() => { setSelectedProduct(p); setView('product'); }}>
                <div className="h-36 sm:h-44 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                  {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-4xl">📦</span>}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 text-xs mb-1 truncate">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-[#0A66FF] text-sm">{p.price.toLocaleString()} F</p>
                      {p.comparePrice && p.comparePrice > p.price && (
                        <p className="text-xs text-gray-400 line-through">{p.comparePrice.toLocaleString()} F</p>
                      )}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); addToCart(p); }}
                      className="w-8 h-8 bg-[#0A66FF] rounded-xl flex items-center justify-center text-white active:opacity-70"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky cart button */}
      {cartCount > 0 && (
        <button onClick={() => setView('cart')}
          className="fixed bottom-14 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto bg-[#0A66FF] text-white px-6 py-4 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-between sm:justify-start sm:gap-4 font-bold z-40">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} />
            <span className="bg-white text-[#0A66FF] text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
            <span className="sm:inline">Voir le panier</span>
          </div>
          <span className="font-black">{cartTotal.toLocaleString()} FCFA</span>
        </button>
      )}

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-100 py-2 px-4 text-center z-30">
        <a href="/" className="text-xs text-gray-400 hover:text-[#0A66FF] transition-colors flex items-center justify-center gap-1">
          <Zap size={10} /> Propulsé par Shoply
        </a>
      </div>
    </div>
  );
}
