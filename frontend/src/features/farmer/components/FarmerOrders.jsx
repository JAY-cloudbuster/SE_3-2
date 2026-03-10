/**
 * @fileoverview Farmer Orders Component for AgriSahayak Frontend
 * 
 * Displays a list of recent orders received by the farmer.
 * Fetches real order data from the backend via tradeService.getOrders().
 * Each order card shows buyer name, order ID, items, amount,
 * date, and status badge (Pending/Completed/Processing/Shipped/Delivered).
 * 
 * @component FarmerOrders
 * @see Epic 4, Story 4.7 - Order Tracking for Farmers
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, ChevronRight, PackageOpen, Gavel, CheckCircle2, XCircle } from 'lucide-react';
import { T, useT } from '../../../context/TranslationContext';
import { tradeService } from '../../../services/tradeService';
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

const statusStyles = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Processing: 'bg-blue-100 text-blue-700 border-blue-200',
    Shipped: 'bg-purple-100 text-purple-700 border-purple-200',
    Delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
};

const paymentStatusStyles = {
    paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    failed: 'bg-rose-100 text-rose-700 border-rose-200',
};

const paymentStatusLabel = {
    paid: 'Payment Done',
    pending: 'Pending',
    failed: 'Failed',
};

export default function FarmerOrders() {
    const { user } = useContext(AuthContext);
    const tr = useT();
    const [orders, setOrders] = useState([]);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, bidsRes] = await Promise.all([
                    tradeService.getOrders(),
                    tradeService.getIncomingBids(),
                ]);
                const farmerOrders = (ordersRes.data || []).filter(
                    (order) => String(order.farmer?._id || order.farmer) === String(user?._id)
                );
                setOrders(farmerOrders);
                setBids(bidsRes.data || []);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch farmer trade data:', err);
                setError(err.response?.data?.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        if (!user?._id) return;
        fetchData();
        const id = setInterval(fetchData, 15000);
        return () => clearInterval(id);
    }, [user?._id]);

    const handleBidDecision = async (bidId, status) => {
        try {
            const res = await tradeService.updateBidStatus(bidId, status);
            setBids((prev) => prev.map((b) => (b._id === bidId ? res.data : b)));
            toast.success(tr(`Bid ${status.toLowerCase()}`));
        } catch (err) {
            toast.error(tr(err.response?.data?.message || `Failed to ${status.toLowerCase()} bid`));
        }
    };

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="text-emerald-600" size={24} />
                    <h2 className="text-2xl font-black text-emerald-900"><T>Recent Orders</T></h2>
                </div>
                {!loading && (
                    <div className="bg-white/50 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 border border-emerald-100">
                        <T>Total Orders</T>: {orders.length}
                    </div>
                )}
            </div>

            {/* Loading state */}
            {loading && (
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card p-5 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-slate-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 bg-slate-200 rounded" />
                                    <div className="h-3 w-48 bg-slate-100 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error state */}
            {error && !loading && (
                <div className="glass-card p-8 text-center">
                    <p className="text-rose-600 font-bold mb-2">{error}</p>
                    <p className="text-sm text-slate-500"><T>Please try refreshing the page</T></p>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && orders.length === 0 && bids.length === 0 && (
                <div className="glass-card p-10 text-center">
                    <PackageOpen className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="font-bold text-slate-700 mb-1"><T>No orders yet</T></h3>
                    <p className="text-sm text-slate-500"><T>Orders will appear here when buyers purchase your crops</T></p>
                </div>
            )}

            {/* Incoming Bids */}
            {!loading && !error && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Gavel className="text-blue-600" size={20} />
                        <h3 className="text-xl font-black text-slate-900"><T>Incoming Bids</T></h3>
                    </div>

                    {bids.length === 0 ? (
                        <div className="glass-card p-6 text-center text-sm text-slate-500">
                            <T>No bids received yet</T>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {bids.map((bid) => (
                                <div key={bid._id} className="glass-card p-4 flex items-center justify-between border border-blue-100">
                                    <div>
                                        <p className="font-bold text-slate-800">{bid.listingId?.name || 'Crop'}</p>
                                        <p className="text-xs text-slate-500">
                                            <T>Buyer</T>: {bid.buyerId?.name || bid.buyerId?.phone || 'Buyer'}
                                        </p>
                                        <p className="text-sm font-bold text-emerald-700 mt-1">
                                            ₹{bid.amount?.toLocaleString('en-IN')} /quintal
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {bid.status === 'Pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleBidDecision(bid._id, 'Accepted')}
                                                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1"
                                                >
                                                    <CheckCircle2 size={14} /> <T>Accept</T>
                                                </button>
                                                <button
                                                    onClick={() => handleBidDecision(bid._id, 'Rejected')}
                                                    className="px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 flex items-center gap-1"
                                                >
                                                    <XCircle size={14} /> <T>Reject</T>
                                                </button>
                                            </>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[bid.status] || statusStyles.Pending}`}>
                                                <T>{bid.status}</T>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Orders list */}
            {!loading && !error && orders.length > 0 && (
                <div className="grid gap-4">
                    {orders.map((order) => {
                        const buyerName = order.buyer?.name || order.buyer?.phone || 'Buyer';
                        const itemsSummary = order.items?.map(item => `${item.quantity} quintal ${item.name}`).join(', ') || 'N/A';
                        const status = order.orderStatus || 'Pending';
                        const paymentStatus = String(order.paymentStatus || 'pending').toLowerCase();
                        const orderStatusLabel =
                            paymentStatus === 'paid' && status === 'Pending' ? 'Order Confirmed' : status;
                        const amount = order.totalAmount ? `₹${order.totalAmount.toLocaleString('en-IN')}` : 'N/A';
                        const date = order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '';

                        return (
                            <div
                                key={order._id}
                                className="glass-card p-5 flex items-center justify-between group hover:border-emerald-200 transition-colors"
                            >
                                <div className="flex gap-4 items-center">
                                    <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                                        {buyerName[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{buyerName}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                            <span>{order._id?.slice(-8)?.toUpperCase()}</span>
                                            <span>•</span>
                                            <span>{itemsSummary}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="font-bold text-emerald-700">{amount}</div>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium justify-end">
                                            <Calendar size={10} /> {date}
                                        </div>
                                    </div>

                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${paymentStatusStyles[paymentStatus] || paymentStatusStyles.pending}`}>
                                        <T>{paymentStatusLabel[paymentStatus] || paymentStatusLabel.pending}</T>
                                    </span>

                                    <div className="text-[10px] text-slate-500 font-semibold min-w-18 text-right">
                                        <T>{orderStatusLabel}</T>
                                    </div>

                                    <button className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}
