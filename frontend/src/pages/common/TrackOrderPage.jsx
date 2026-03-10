import React, { useEffect, useMemo, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PackageOpen, ShoppingBag, Clock3, Gavel } from 'lucide-react';
import { T } from '../../context/TranslationContext';
import { AuthContext } from '../../context/AuthContext';
import { tradeService } from '../../services/tradeService';
import { formatQuintalQuantity, formatQuintalRate } from '../../utils/formatters';

const bidStatusStyle = {
    Pending: 'bg-amber-100 text-amber-700',
    Accepted: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-rose-100 text-rose-700',
    Completed: 'bg-blue-100 text-blue-700',
    Expired: 'bg-slate-200 text-slate-600',
};

function getBidTimeLeft(expiresAt) {
    if (!expiresAt) return '-';
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}h ${m}m`;
}

export default function TrackOrderPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [bids, setBids] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');

    const dashboardRoute = user?.role === 'BUYER' ? '/dashboard/buyer' : '/dashboard/farmer';

    useEffect(() => {
        const load = async () => {
            try {
                const [ordersRes, bidsRes] = await Promise.all([
                    tradeService.getOrders(),
                    tradeService.getBidHistory(),
                ]);

                const buyerOrders = (ordersRes.data || []).filter(
                    (o) => String(o.buyer?._id || o.buyer) === String(user?._id)
                );
                setOrders(buyerOrders);
                setBids(bidsRes.data || []);
            } catch (err) {
                console.error('Failed to load order/bid history:', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user?._id]);

    const directBuyOrders = useMemo(
        () => orders.filter((o) => !o.sourceBid),
        [orders]
    );

    const tabs = [
        { id: 'orders', label: 'My Orders', count: orders.length },
        { id: 'bids', label: 'Bid History', count: bids.length },
        { id: 'direct', label: 'Direct Buy', count: directBuyOrders.length },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(dashboardRoute)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span><T>Back to Dashboard</T></span>
                    </button>

                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="text-emerald-600" size={24} />
                        <T>My Orders & History</T>
                    </h1>

                    <div className="w-36" />
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="flex gap-2 border-b border-slate-200 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-t-lg font-bold text-sm ${
                                activeTab === tab.id
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>

                {loading && (
                    <div className="text-center py-12 text-slate-500">Loading history...</div>
                )}

                {!loading && activeTab === 'orders' && (
                    <div className="space-y-4">
                        {orders.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
                                <PackageOpen className="mx-auto mb-3 text-slate-300" size={36} />
                                <T>No orders yet</T>
                            </div>
                        ) : (
                            orders.map((order) => {
                                const item = order.items?.[0];
                                return (
                                    <div key={order._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-black text-slate-900">{item?.name || 'Crop'}</h3>
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">
                                                {order.orderStatus || 'Pending'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            {formatQuintalQuantity(item?.quantity || 0)} x {formatQuintalRate(item?.pricePerKg || 0)}
                                        </p>
                                        <p className="text-sm font-bold text-emerald-700 mt-1">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                                        <p className="text-xs text-slate-500 mt-2">Order ID: {order._id}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {!loading && activeTab === 'bids' && (
                    <div className="space-y-4">
                        {bids.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
                                <Gavel className="mx-auto mb-3 text-slate-300" size={36} />
                                <T>No bid history yet</T>
                            </div>
                        ) : (
                            bids.map((bid) => (
                                <motion.div
                                    key={bid._id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl p-5 shadow-sm border border-slate-100"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-black text-slate-900">{bid.listingId?.name || 'Crop Listing'}</h3>
                                            <p className="text-sm text-slate-600 mt-1">Farmer: {bid.farmerId?.name || 'Farmer'}</p>
                                            <p className="text-sm font-bold text-emerald-700 mt-1">Bid: ₹{Number(bid.amount || 0).toLocaleString('en-IN')} /quintal</p>
                                            <p className="text-xs text-slate-500 mt-2">Placed: {new Date(bid.createdAt).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${bidStatusStyle[bid.status] || 'bg-slate-100 text-slate-700'}`}>
                                                {bid.status}
                                            </span>
                                            {bid.status === 'Accepted' && (
                                                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1 justify-end">
                                                    <Clock3 size={12} /> {getBidTimeLeft(bid.expiresAt)}
                                                </p>
                                            )}
                                            {bid.status === 'Accepted' && (
                                                <button
                                                    onClick={() =>
                                                        navigate(`/buy/${bid.listingId?._id || bid.listingId}`, {
                                                            state: {
                                                                crop: bid.listingId,
                                                                bid,
                                                            },
                                                        })
                                                    }
                                                    className="mt-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                                                >
                                                    Proceed to Payment
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                {!loading && activeTab === 'direct' && (
                    <div className="space-y-4">
                        {directBuyOrders.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 text-center text-slate-500">
                                <T>No direct buy orders yet</T>
                            </div>
                        ) : (
                            directBuyOrders.map((order) => {
                                const item = order.items?.[0];
                                return (
                                    <div key={order._id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-black text-slate-900">{item?.name || 'Crop'}</h3>
                                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">DIRECT BUY</span>
                                        </div>
                                        <p className="text-sm text-slate-600">{formatQuintalQuantity(item?.quantity || 0)} x {formatQuintalRate(item?.pricePerKg || 0)}</p>
                                        <p className="text-sm font-bold text-emerald-700 mt-1">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
