'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getCoupons, addCoupon, deleteCoupon, updateCoupon } from '@/lib/firestore';
import { Coupon } from '@/types';
import { Plus, Trash2, Tag, Lock, ToggleLeft, ToggleRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import Link from 'next/link';

const EMPTY: Omit<Coupon, 'id' | 'createdAt' | 'shopId' | 'usageCount'> = {
  code: '',
  discountType: 'percent',
  discountValue: 10,
  minOrderAmount: 0,
  maxUses: 0,
  isActive: true,
  expiresAt: '',
};

export default function CouponsPage() {
  const { shop } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!shop) return;
    setLoading(true);
    const data = await getCoupons(shop.id!);
    setCoupons(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [shop]);

  if (shop?.plan === 'free') {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-3xl flex items-center justify-center mb-4">
          <Lock size={28} className="text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="text-xl font-black text-[#0D1B3E] dark:text-white mb-2">Coupons & Promotions</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">Créez des codes promo pour vos clients. Disponible à partir du plan Premium.</p>
        <Link href="/dashboard/settings" className="bg-[#0A66FF] text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity">
          Passer au Premium →
        </Link>
      </div>
    );
  }

  const handleSave = async () => {
    if (!shop || !form.code || form.discountValue <= 0) {
      toast.error('Code et remise requis');
      return;
    }
    if (form.discountType === 'percent' && form.discountValue > 100) {
      toast.error('La remise ne peut pas dépasser 100%');
      return;
    }
    setSaving(true);
    try {
      await addCoupon({
        ...form,
        code: form.code.toUpperCase().replace(/\s/g, ''),
        shopId: shop.id!,
        usageCount: 0,
        minOrderAmount: form.minOrderAmount || 0,
        maxUses: form.maxUses || 0,
        expiresAt: form.expiresAt || undefined,
      });
      toast.success('Coupon créé');
      setShowModal(false);
      setForm(EMPTY);
      load();
    } catch { toast.error('Erreur'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce coupon ?')) return;
    await deleteCoupon(id);
    toast.success('Coupon supprimé');
    load();
  };

  const handleToggle = async (c: Coupon) => {
    await updateCoupon(c.id!, { isActive: !c.isActive });
    load();
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0D1B3E] dark:text-white">Coupons & Promotions</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{coupons.length} coupon(s) créé(s)</p>
        </div>
        <Button onClick={() => setShowModal(true)} iconLeft={<Plus size={18} />}>Créer un coupon</Button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Vos clients peuvent entrer un code promo lors du paiement sur votre boutique.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}</div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16">
          <Tag size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">Aucun coupon</p>
          <p className="text-sm text-gray-400">Créez votre premier code promo pour booster vos ventes</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {coupons.map(c => (
            <div key={c.id} className={`bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm flex items-center gap-4 border-2 ${c.isActive ? 'border-transparent' : 'border-gray-200 dark:border-gray-700 opacity-60'}`}>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Tag size={18} className="text-[#0A66FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <code className="font-black text-[#0D1B3E] dark:text-white text-sm tracking-wider">{c.code}</code>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500'}`}>
                    {c.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {c.discountType === 'percent' ? `-${c.discountValue}%` : `-${c.discountValue.toLocaleString()} F`}
                  {c.minOrderAmount ? ` · min ${c.minOrderAmount.toLocaleString()} F` : ''}
                  {c.maxUses ? ` · ${c.usageCount}/${c.maxUses} utilisations` : ` · ${c.usageCount} utilisation(s)`}
                  {c.expiresAt ? ` · expire le ${new Date(c.expiresAt).toLocaleDateString('fr-FR')}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(c)} className="text-gray-400 hover:text-[#0A66FF] transition-colors">
                  {c.isActive ? <ToggleRight size={22} className="text-green-500" /> : <ToggleLeft size={22} />}
                </button>
                <button onClick={() => handleDelete(c.id!)} className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Créer un coupon" size="sm">
        <div className="flex flex-col gap-4">
          <Input
            label="Code promo"
            placeholder="EX: PROMO20"
            value={form.code}
            onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Type de remise</label>
            <div className="flex gap-2">
              {(['percent', 'fixed'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setForm(f => ({ ...f, discountType: type }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${form.discountType === type ? 'bg-[#0A66FF] border-[#0A66FF] text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
                >
                  {type === 'percent' ? 'Pourcentage (%)' : 'Montant fixe (F)'}
                </button>
              ))}
            </div>
          </div>

          <Input
            label={form.discountType === 'percent' ? 'Remise (%)' : 'Remise (FCFA)'}
            type="number"
            value={form.discountValue.toString()}
            onChange={e => setForm(f => ({ ...f, discountValue: Number(e.target.value) }))}
          />

          <Input
            label="Commande minimum (FCFA, 0 = aucun)"
            type="number"
            value={(form.minOrderAmount || 0).toString()}
            onChange={e => setForm(f => ({ ...f, minOrderAmount: Number(e.target.value) }))}
          />

          <Input
            label="Utilisations max (0 = illimité)"
            type="number"
            value={(form.maxUses || 0).toString()}
            onChange={e => setForm(f => ({ ...f, maxUses: Number(e.target.value) }))}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Date d'expiration (optionnel)</label>
            <input
              type="date"
              value={form.expiresAt || ''}
              onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#0A66FF] text-sm"
            />
          </div>

          <Button onClick={handleSave} loading={saving} fullWidth>Créer le coupon</Button>
        </div>
      </Modal>
    </div>
  );
}
