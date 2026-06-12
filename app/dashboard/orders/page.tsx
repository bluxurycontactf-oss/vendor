'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getOrders, updateOrderStatus, markAffiliateCommissionPaid, markOrderPaymentReceived } from '@/lib/firestore';
import { Order } from '@/types';
import { ShoppingCart, Search, ChevronDown, Eye, Download, Users, Truck, ShieldCheck } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente', variant: 'yellow' },
  { value: 'processing', label: 'En cours', variant: 'blue' },
  { value: 'shipped', label: 'Expédié', variant: 'blue' },
  { value: 'delivered', label: 'Livré', variant: 'green' },
  { value: 'cancelled', label: 'Annulé', variant: 'red' },
] as const;

export default function OrdersPage() {
  const { shop } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Order | null>(null);

  const load = async () => {
    if (!shop) return;
    setLoading(true);
    const data = await getOrders(shop.id!);
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [shop]);

  const handleStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status as Order['status']);
    toast.success('Statut mis à jour');
    load();
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status: status as Order['status'] } : null);
  };

  const handleMarkCommissionPaid = async (orderId: string) => {
    await markAffiliateCommissionPaid(orderId);
    toast.success('Commission marquée comme payée');
    load();
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, affiliateCommissionPaid: true } : null);
  };

  const handleMarkPaymentReceived = async (orderId: string) => {
    await markOrderPaymentReceived(orderId);
    toast.success('Paiement client confirmé');
    load();
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, paymentReceived: true, paymentReceivedAt: new Date().toISOString() } : null);
  };

  const filtered = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => o.customerName.toLowerCase().includes(search.toLowerCase()) || o.id?.includes(search));

  const statusMap = Object.fromEntries(STATUS_OPTIONS.map(s => [s.value, s]));

  const exportCSV = () => {
    const rows = [
      ['ID', 'Client', 'Téléphone', 'Adresse', 'Articles', 'Total (FCFA)', 'Statut', 'Date'],
      ...filtered.map(o => [
        o.id?.slice(-8) || '',
        o.customerName,
        o.customerPhone,
        o.customerAddress || '',
        o.items.map(i => `${i.productName} x${i.quantity}`).join(' | '),
        o.total.toString(),
        statusMap[o.status]?.label || o.status,
        new Date(o.createdAt!).toLocaleDateString('fr-FR'),
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0D1B3E] dark:text-white">Commandes</h1>
          <p className="text-gray-500 dark:text-gray-400">{orders.length} commande(s) au total</p>
        </div>
        {shop?.plan !== 'free' && orders.length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:border-[#0A66FF] hover:text-[#0A66FF] transition-all"
          >
            <Download size={16} /> Exporter CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Rechercher une commande..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#0A66FF] text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[{ value: 'all', label: 'Toutes' }, ...STATUS_OPTIONS].map(s => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all border-2 ${filter === s.value ? 'bg-[#0A66FF] border-[#0A66FF] text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#0A66FF]'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Aucune commande</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Partagez votre boutique pour recevoir vos premières commandes</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(o => {
            const s = statusMap[o.status];
            return (
              <Card key={o.id} hover padding="none" className="overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-[#0D1B3E] dark:text-white">{o.customerName}</p>
                      <Badge variant={s?.variant || 'gray'} size="sm">{s?.label || o.status}</Badge>
                      {o.affiliateCommission != null && (
                        <Badge variant={o.affiliateCommissionPaid ? 'green' : 'yellow'} size="sm">
                          <Users size={10} className="inline -mt-0.5 mr-1" />
                          Affilié {o.affiliateCommission.toLocaleString()} F{o.affiliateCommissionPaid ? ' · payé' : ''}
                        </Badge>
                      )}
                      {o.paymentMethod === 'fedapay' && (
                        <>
                          <Badge variant="blue" size="sm">
                            <ShieldCheck size={10} className="inline -mt-0.5 mr-1" />
                            Payé FedaPay
                          </Badge>
                          <Badge variant={o.deliveryStatus === 'delivered' ? 'green' : o.deliveryStatus === 'failed' ? 'red' : o.deliveryStatus === 'assigned' ? 'blue' : 'yellow'} size="sm">
                            <Truck size={10} className="inline -mt-0.5 mr-1" />
                            {o.deliveryStatus === 'delivered' ? 'Livré'
                              : o.deliveryStatus === 'assigned' ? `Livreur : ${o.deliveryAgentName}`
                              : o.deliveryStatus === 'failed' ? 'Échec livraison'
                              : 'En attente livreur'}
                          </Badge>
                          <Badge variant={o.vendorPayoutPaid ? 'green' : 'yellow'} size="sm">
                            Versement {(o.vendorPayoutAmount ?? 0).toLocaleString()} F{o.vendorPayoutPaid ? ' · reçu' : ' · en attente'}
                          </Badge>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{o.items.length} article(s) · #{o.id?.slice(-8)}</p>
                    <p className="text-xs text-gray-400">{o.customerPhone}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-[#0D1B3E] dark:text-white">{o.total.toLocaleString()} F</p>
                    <p className="text-xs text-gray-400">{new Date(o.createdAt!).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setSelected(o)} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-[#0A66FF] transition-colors">
                      <Eye size={16} />
                    </button>
                    <div className="relative group">
                      <button className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-[#0A66FF] transition-colors">
                        <ChevronDown size={16} />
                      </button>
                      <div className="absolute right-0 top-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hidden group-hover:block z-10 w-44">
                        {STATUS_OPTIONS.map(opt => (
                          <button key={opt.value} onClick={() => handleStatus(o.id!, opt.value)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 first:rounded-t-2xl last:rounded-b-2xl transition-colors">
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Détail de la commande" size="md">
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Client', val: selected.customerName },
                { label: 'Téléphone', val: selected.customerPhone },
                { label: 'Adresse', val: selected.customerAddress || 'Non renseignée' },
                { label: 'Date', val: new Date(selected.createdAt!).toLocaleDateString('fr-FR') },
              ].map(r => (
                <div key={r.label}>
                  <p className="text-xs text-gray-400 mb-0.5">{r.label}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{r.val}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Articles commandés</p>
              <div className="flex flex-col gap-2">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.productName}</p>
                      <p className="text-xs text-gray-400">Qté: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-[#0A66FF]">{(item.price * item.quantity).toLocaleString()} F</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
              <p className="font-bold text-gray-700 dark:text-gray-300">Total</p>
              <p className="text-xl font-black text-[#0D1B3E] dark:text-white">{selected.total.toLocaleString()} FCFA</p>
            </div>
            {selected.paymentMethod === 'fedapay' && (
              <div className="flex flex-col gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600 flex-shrink-0" />
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-400">Paiement reçu via FedaPay (escrow Shoply)</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400 mb-0.5">Frais FedaPay (client)</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{(selected.fedapayFee ?? 0).toLocaleString()} F</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-0.5">Vous recevrez</p>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">{(selected.vendorPayoutAmount ?? 0).toLocaleString()} F</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-blue-200/70 dark:border-blue-800 pt-3">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5"><Truck size={13} /> Livraison</p>
                  <Badge variant={selected.deliveryStatus === 'delivered' ? 'green' : selected.deliveryStatus === 'failed' ? 'red' : selected.deliveryStatus === 'assigned' ? 'blue' : 'yellow'} size="sm">
                    {selected.deliveryStatus === 'delivered' ? 'Livré'
                      : selected.deliveryStatus === 'assigned' ? `Livreur : ${selected.deliveryAgentName}`
                      : selected.deliveryStatus === 'failed' ? 'Échec livraison'
                      : "En attente d'un livreur"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Versement de votre part</p>
                  <Badge variant={selected.vendorPayoutPaid ? 'green' : 'yellow'} size="sm">
                    {selected.vendorPayoutPaid ? 'Reçu' : 'En attente (après livraison)'}
                  </Badge>
                </div>
              </div>
            )}
            {selected.affiliateCommission != null && (
              <div className="flex flex-col gap-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-purple-700 dark:text-purple-400">Commission affilié : {selected.affiliateCommission.toLocaleString()} F</p>
                    <p className="text-xs text-purple-600 dark:text-purple-500">À régler directement à l&apos;affilié (Mobile Money)</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-purple-200/70 dark:border-purple-800 pt-3">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">1. Le client a-t-il bien payé ?</p>
                  {selected.paymentReceived ? (
                    <Badge variant="green" size="sm">Confirmé</Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleMarkPaymentReceived(selected.id!)}>Confirmer</Button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">2. Commission versée à l&apos;affilié ?</p>
                  {selected.affiliateCommissionPaid ? (
                    <Badge variant="green" size="sm">Payée</Badge>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleMarkCommissionPaid(selected.id!)}>Marquer payée</Button>
                  )}
                </div>
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Changer le statut</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleStatus(selected.id!, opt.value)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${selected.status === opt.value ? 'bg-[#0A66FF] border-[#0A66FF] text-white' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#0A66FF]'}`}
                  >{opt.label}</button>
                ))}
              </div>
            </div>
            <Button variant="outline" onClick={() => setSelected(null)}>Fermer</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
