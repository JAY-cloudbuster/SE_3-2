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
import { ShoppingBag, Calendar, Clock, ChevronRight, PackageOpen } from 'lucide-react';
import { T } from '../../../context/TranslationContext';
import { tradeService } from '../../../services/tradeService';

const statusStyles = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Processing: 'bg-blue-100 text-blue-700 border-blue-200',
    Shipped: 'bg-purple-100 text-purple-700 border-purple-200',
    Delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function FarmerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await tradeService.getOrders();
                setOrders(res.data || []);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                setError(err.response?.data?.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

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
            {!loading && !error && orders.length === 0 && (
                <div className="glass-card p-10 text-center">
                    <PackageOpen className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="font-bold text-slate-700 mb-1"><T>No orders yet</T></h3>
                    <p className="text-sm text-slate-500"><T>Orders will appear here when buyers purchase your crops</T></p>
                </div>
            )}

            {/* Orders list */}
            {!loading && !error && orders.length > 0 && (
                <div className="grid gap-4">
                    {orders.map((order) => {
                        const buyerName = order.buyer?.name || order.buyer?.phone || 'Buyer';
                        const itemsSummary = order.items?.map(item => `${item.quantity}kg ${item.name}`).join(', ') || 'N/A';
                        const status = order.orderStatus || 'Pending';
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

                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[status] || statusStyles.Pending}`}>
                                        <T>{status}</T>
                                    </span>

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
