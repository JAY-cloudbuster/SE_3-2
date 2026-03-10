/**
 * @fileoverview My Orders Tab for Buyer Dashboard
 *
 * Displays the complete trading history for the buyer:
 *   - Direct purchases (Buy Now)
 *   - Bids placed in auctions (Accepted / Rejected / Pending / Expired)
 *   - Negotiated purchases
 *
 * Each card shows: crop name, farmer, order/bid ID, quantity, price per
 * quintal, total price, timestamp, and a status badge.
 *
 * Accepted bids still awaiting payment show a "Pay Now" button.
 *
 * Real-time updates are driven by the parent BuyerDashboard via the
 * `refreshTrigger` prop — pass an incremented integer to force a reload.
 *
 * @component MyOrdersTab
 * @param {Object}  props
 * @param {number}  [props.refreshTrigger=0] - Increment to force data reload
 */
import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import {
    Package, Clock, CheckCircle, XCircle, Gavel,
    CreditCard, AlertCircle, ShoppingBag, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { T, useT } from '../../../context/TranslationContext';
import { tradeService } from '../../../services/tradeService';
import toast from 'react-hot-toast';

// ── Status badge config ───────────────────────────────────────────────────────

const BID_STATUS_META = {
    Pending:   { label: 'Bid Placed',    color: 'bg-amber-100 text-amber-700 border-amber-200',   icon: Clock },
    Accepted:  { label: 'Bid Accepted',  color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
    Rejected:  { label: 'Bid Rejected',  color: 'bg-red-100 text-red-700 border-red-200',         icon: XCircle },
    Completed: { label: 'Bid Completed', color: 'bg-blue-100 text-blue-700 border-blue-200',       icon: CheckCircle },
    Expired:   { label: 'Bid Expired',   color: 'bg-slate-100 text-slate-500 border-slate-200',    icon: AlertCircle },
};

const ORDER_STATUS_META = {
    Pending:    { label: 'Payment Pending',   color: 'bg-amber-100 text-amber-700 border-amber-200',    icon: Clock },
    Processing: { label: 'Order Confirmed',   color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
    Shipped:    { label: 'Shipped',           color: 'bg-blue-100 text-blue-700 border-blue-200',        icon: Package },
    Delivered:  { label: 'Delivered',         color: 'bg-green-100 text-green-700 border-green-200',     icon: CheckCircle },
    Cancelled:  { label: 'Cancelled',         color: 'bg-red-100 text-red-700 border-red-200',           icon: XCircle },
};

const PAYMENT_STATUS_META = {
    pending:   { label: 'Payment Pending',   color: 'bg-amber-100 text-amber-700 border-amber-200',    icon: Clock },
    paid:      { label: 'Payment Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
    failed:    { label: 'Payment Failed',    color: 'bg-red-100 text-red-700 border-red-200',           icon: XCircle },
};

const ORDER_TYPE_ICON = {
    buyNow:      ShoppingBag,
    bid:         Gavel,
    negotiation: MessageSquare,
};

const ORDER_TYPE_LABEL = {
    buyNow:      'Direct Purchase',
    bid:         'Bid Purchase',
    negotiation: 'Negotiated Purchase',
};

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ meta }) {
    if (!meta) return null;
    const Icon = meta.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${meta.color}`}>
            <Icon size={11} />
            {meta.label}
        </span>
    );
}

// ── Bid history card ──────────────────────────────────────────────────────────

function BidCard({ bid, onPayNow }) {
    const navigate = useNavigate();
    const crop     = bid.listingId || {};
    const farmer   = bid.farmerId  || {};
    const meta     = BID_STATUS_META[bid.status] || BID_STATUS_META.Pending;

    const showPayNow = bid.status === 'Accepted' &&
        bid.expiresAt && new Date(bid.expiresAt) > new Date();

    return (
        <motion.div
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Gavel className="text-amber-600" size={20} />
                    </div>
                    <div>
                        <p className="font-black text-slate-800 text-base leading-tight">
                            {crop.name || 'Crop'}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            <T>Farmer</T>: <span className="font-bold text-slate-700">{farmer.name || '—'}</span>
                        </p>
                    </div>
                </div>
                <StatusBadge meta={meta} />
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                    <span className="text-slate-400"><T>Bid ID</T></span>
                    <p className="font-bold text-slate-700 truncate">{bid._id}</p>
                </div>
                <div>
                    <span className="text-slate-400"><T>Quantity</T></span>
                    <p className="font-bold text-slate-700">{crop.quantity || '—'} <T>quintals</T></p>
                </div>
                <div>
                    <span className="text-slate-400"><T>Bid Amount</T></span>
                    <p className="font-bold text-emerald-600">₹{bid.amount}/<T>quintal</T></p>
                </div>
                <div>
                    <span className="text-slate-400"><T>Placed On</T></span>
                    <p className="font-bold text-slate-700">
                        {bid.createdAt ? new Date(bid.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </p>
                </div>
            </div>

            {/* Pay Now button for accepted bids */}
            {showPayNow && (
                <div className="pt-2 border-t border-amber-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-700 text-xs font-bold flex items-center gap-1">
                            <Clock size={12} />
                            Payment window expires {new Date(bid.expiresAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <button
                        onClick={() =>
                            navigate(`/buy/${crop._id || crop.id}`, {
                                state: { crop: { ...crop, id: crop._id }, bidId: bid._id, bidAmount: bid.amount }
                            })
                        }
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow hover:shadow-lg transition-shadow"
                    >
                        <CreditCard size={16} />
                        <T>Pay Now</T>
                    </button>
                </div>
            )}
        </motion.div>
    );
}

// ── Order card ────────────────────────────────────────────────────────────────

function OrderCard({ order }) {
    const firstItem  = order.items?.[0] || {};
    const crop       = firstItem.crop || {};
    const farmer     = order.farmer || {};
    const orderType  = order.orderType || 'buyNow';
    const TypeIcon   = ORDER_TYPE_ICON[orderType] || ShoppingBag;

    // Determine displayed status
    const paymentMeta = PAYMENT_STATUS_META[order.paymentStatus] || PAYMENT_STATUS_META.pending;
    const statusMeta  = ORDER_STATUS_META[order.orderStatus]     || ORDER_STATUS_META.Pending;

    return (
        <motion.div
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <TypeIcon className="text-emerald-600" size={20} />
                    </div>
                    <div>
                        <p className="font-black text-slate-800 text-base leading-tight">
                            {firstItem.name || crop.name || 'Crop'}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {ORDER_TYPE_LABEL[orderType]} — Farmer:{' '}
                            <span className="font-bold text-slate-700">{farmer.name || '—'}</span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <StatusBadge meta={paymentMeta} />
                    <StatusBadge meta={statusMeta} />
                </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                    <span className="text-slate-400"><T>Order ID</T></span>
                    <p className="font-bold text-slate-700 truncate">{order._id}</p>
                </div>
                <div>
                    <span className="text-slate-400"><T>Quantity</T></span>
                    <p className="font-bold text-slate-700">{firstItem.quantity || '—'} <T>quintals</T></p>
                </div>
                <div>
                    <span className="text-slate-400"><T>Price / Quintal</T></span>
                    <p className="font-bold text-emerald-600">₹{firstItem.pricePerKg || '—'}</p>
                </div>
                <div>
                    <span className="text-slate-400"><T>Total Amount</T></span>
                    <p className="font-black text-slate-800">₹{order.totalAmount?.toLocaleString('en-IN') || '—'}</p>
                </div>
                <div className="col-span-2">
                    <span className="text-slate-400"><T>Ordered On</T></span>
                    <p className="font-bold text-slate-700">
                        {order.createdAt
                            ? new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : '—'}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MyOrdersTab({ refreshTrigger = 0 }) {
    const [orders, setOrders]   = useState([]);
    const [bids,   setBids]     = useState([]);
    const [filter, setFilter]   = useState('all');  // all | orders | bids
    const [loading, setLoading] = useState(true);
    const tr = useT();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [orderRes, bidRes] = await Promise.all([
                    tradeService.getOrders(),
                    tradeService.getBidHistory(),
                ]);
                setOrders(orderRes.data || []);
                setBids(bidRes.data || []);
            } catch {
                toast.error(tr('Failed to load order history'));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [refreshTrigger]);

    const filterTabs = [
        { id: 'all',    label: 'All Activity',  count: orders.length + bids.length },
        { id: 'orders', label: 'Orders',         count: orders.length },
        { id: 'bids',   label: 'Bid History',    count: bids.length },
    ];

    return (
        <div className="space-y-6">
            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {filterTabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setFilter(t.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                            filter === t.id
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                        }`}
                    >
                        <T>{t.label}</T>
                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                            filter === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>{t.count}</span>
                    </button>
                ))}
            </div>

            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-52 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            )}

            {!loading && orders.length === 0 && bids.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Package size={48} className="mb-4 opacity-40" />
                    <p className="font-bold text-lg"><T>No orders or bids yet</T></p>
                    <p className="text-sm mt-1">
                        <T>Head to the Marketplace to start trading</T>
                    </p>
                </div>
            )}

            {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(filter === 'all' || filter === 'orders') &&
                        orders.map((order) => <OrderCard key={order._id} order={order} />)}

                    {(filter === 'all' || filter === 'bids') &&
                        bids.map((bid) => <BidCard key={bid._id} bid={bid} />)}
                </div>
            )}
        </div>
    );
}
