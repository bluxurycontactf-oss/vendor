'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/firestore';
import { Product } from '@/types';
import { Plus, Search, Edit2, Trash2, Package, ToggleLeft, ToggleRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUploader from '@/components/ui/ImageUploader';
import toast from 'react-hot-toast';

const EMPTY: Omit<Product, 'id' | 'shopId' | 'createdAt' | 'updatedAt'> = {
  name: '', description: '', price: 0, comparePrice: 0, images: [], category: '', stock: 0, isActive: true,
};

export default function ProductsPage() {
  const { shop } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!shop) return;
    setLoading(true);
    const data = await getProducts(shop.id!);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [shop]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, description: p.description, price: p.price, comparePrice: p.comparePrice || 0, images: p.images, category: p.category, stock: p.stock, isActive: p.isActive }); setShowModal(true); };

  const handleSave = async () => {
    if (!shop || !form.name || form.price <= 0) { toast.error('Remplissez tous les champs requis'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateProduct(editing.id!, { ...form });
        toast.success('Produit mis à jour');
      } else {
        await addProduct({ ...form, shopId: shop.id! });
        toast.success('Produit ajouté');
      }
      setShowModal(false);
      load();
    } catch { toast.error('Erreur'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await deleteProduct(id);
    toast.success('Produit supprimé');
    load();
  };

  const toggleActive = async (p: Product) => {
    await updateProduct(p.id!, { isActive: !p.isActive });
    load();
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const FREE_LIMIT = shop?.plan === 'free' ? 10 : Infinity;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0D1B3E] dark:text-white">Produits</h1>
          <p className="text-gray-500 dark:text-gray-400">{products.length} produit(s){shop?.plan === 'free' ? ` / ${FREE_LIMIT} (plan gratuit)` : ''}</p>
        </div>
        <Button onClick={openAdd} disabled={products.length >= FREE_LIMIT} iconLeft={<Plus size={18} />}>
          Ajouter un produit
        </Button>
      </div>

      {shop?.plan === 'free' && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl flex items-center justify-between">
          <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
            Plan gratuit : {products.length}/{FREE_LIMIT} produits utilisés
          </p>
          <a href="/dashboard/settings" className="text-xs font-bold text-yellow-700 dark:text-yellow-300 hover:underline">Passer Premium →</a>
        </div>
      )}

      <div className="mb-6">
        <Input
          placeholder="Rechercher un produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<Search size={18} />}
        />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-52 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Aucun produit</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Ajoutez votre premier produit pour le vendre en ligne</p>
          <Button onClick={openAdd} iconLeft={<Plus size={18} />}>Ajouter un produit</Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <Card key={p.id} hover padding="none" className="overflow-hidden">
              <div className={`h-36 flex items-center justify-center text-5xl ${p.isActive ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30' : 'bg-gray-100 dark:bg-gray-800 opacity-60'}`}>
                {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : '📦'}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-[#0D1B3E] dark:text-white text-sm leading-tight flex-1">{p.name}</h3>
                  <button onClick={() => toggleActive(p)} className="ml-2 flex-shrink-0 text-gray-400 hover:text-[#0A66FF] transition-colors">
                    {p.isActive ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} />}
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-black text-[#0A66FF]">{p.price.toLocaleString()} F</span>
                  {p.comparePrice && p.comparePrice > p.price && (
                    <span className="text-xs text-gray-400 line-through">{p.comparePrice.toLocaleString()} F</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={p.stock > 5 ? 'green' : p.stock > 0 ? 'yellow' : 'red'} size="sm">
                    Stock: {p.stock}
                  </Badge>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-[#0A66FF] hover:bg-blue-50 transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(p.id!)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Modifier le produit' : 'Nouveau produit'} size="lg">
        <div className="flex flex-col gap-4">
          <ImageUploader
            images={form.images}
            onChange={imgs => setForm(f => ({ ...f, images: imgs }))}
            max={5}
          />
          <Input label="Nom du produit *" placeholder="Ex : Robe en pagne, iPhone 15..." value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prix (FCFA) *" type="number" placeholder="0" value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} required />
            <Input label="Prix barré (optionnel)" type="number" placeholder="0" value={form.comparePrice || ''} onChange={e => setForm(f => ({ ...f, comparePrice: +e.target.value }))} />
          </div>
          <Input label="Catégorie" placeholder="Mode, Alimentation, Électronique..." value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
          <Input label="Stock disponible" type="number" placeholder="0" value={form.stock || ''} onChange={e => setForm(f => ({ ...f, stock: +e.target.value }))} />
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Décrivez votre produit..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#0A66FF] resize-none text-sm"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} loading={saving} fullWidth>{editing ? 'Enregistrer' : 'Ajouter le produit'}</Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
