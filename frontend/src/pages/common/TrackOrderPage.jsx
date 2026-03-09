/**
 * @fileoverview Track Order Page for AgriSahayak Frontend
 *
 * Displays all user orders with tracking status. Fetches orders from
 * the backend API and also checks localStorage for locally-stored orders.
 * Uses the existing OrderTrackingCard component for individual order display.
 *
 * @component TrackOrderPage
 * @route /orders
 * @see OrderConfirmationPage - Redirects here after checkout
 * @see OrderTrackingCard - Used to render individual orders
 */
import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Package, PackageOpen, ShoppingBag } from 'lucide-react';
import { T } from '../../context/TranslationContext';
import { AuthContext } from '../../context/AuthContext';
import { tradeService } from '../../services/tradeService';
import OrderTrackingCard from '../../features/trade/components/OrderTrackingCard';

export default function TrackOrderPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const dashboardRoute = user?.role === 'BUYER' ? '/dashboard/buyer' : '/dashboard/farmer';

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch from backend API
                const res = await tradeService.getOrders();
                const apiOrders = (res.data || []).map(order => ({
                    id: order._id,
                    cropName: order.items?.[0]?.name || 'Crop',
                    quantity: order.items?.[0]?.quantity || 0,
                    pricePerKg: order.items?.[0]?.pricePerKg || 0,
                    totalAmount: order.totalAmount || 0,
                    status: (order.orderStatus || 'Pending').toLowerCase(),
                    timeline: [
                        {
                            status: 'pending',
                            timestamp: order.createdAt,
                            note: 'Order placed successfully',
                        },
                        ...(order.orderStatus === 'Processing' ? [{
                            status: 'confirmed',
                            timestamp: order.updatedAt,
                            note: 'Order confirmed by farmer',
                        }] : []),
                        ...(order.orderStatus === 'Shipped' ? [{
                            status: 'confirmed',
                            timestamp: order.updatedAt,
                            note: 'Order confirmed by farmer',
                        }, {
                            status: 'shipped',
                            timestamp: order.updatedAt,
                            note: 'Order has been shipped',
                        }] : []),
                        ...(order.orderStatus === 'Delivered' ? [{
                            status: 'confirmed',
                            timestamp: order.updatedAt,
                            note: 'Order confirmed by farmer',
                        }, {
                            status: 'shipped',
                            timestamp: order.updatedAt,
                            note: 'Order has been shipped',
                        }, {
                            status: 'delivered',
                            timestamp: order.updatedAt,
                            note: 'Order delivered successfully',
                        }] : []),
                    ],
                }));
                setOrders(apiOrders);
            } catch (err) {
                console.error('Failed to fetch from API, falling back to localStorage:', err);
                // Fallback: load from localStorage
                const localOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
                setOrders(localOrders.reverse());
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // If navigated with a specific order in state, highlight it
    const highlightOrderId = location.state?.order?.id;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(dashboardRoute)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span><T>Back to Dashboard</T></span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                            <ShoppingBag className="text-emerald-600" size={24} />
                            <T>My Orders</T>
                        </h1>
                    </div>
                    <div className="w-36" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Loading state */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                                <div className="flex justify-between mb-4">
                                    <div className="space-y-2">
                                        <div className="h-5 w-32 bg-slate-200 rounded" />
                                        <div className="h-3 w-48 bg-slate-100 rounded" />
                                    </div>
                                    <div className="h-8 w-20 bg-slate-200 rounded-full" />
                                </div>
                                <div className="h-20 bg-slate-50 rounded-xl" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && orders.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <PackageOpen className="mx-auto text-slate-300 mb-4" size={64} />
                        <h2 className="text-xl font-black text-slate-700 mb-2"><T>No orders yet</T></h2>
                        <p className="text-slate-500"><T>Your orders will appear here once you make a purchase</T></p>
                        <button
                            onClick={() => navigate('/marketplace')}
                            className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
                        >
                            <T>Browse Marketplace</T>
                        </button>
                    </motion.div>
                )}

                {/* Orders list */}
                {!loading && orders.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <p className="text-sm text-slate-500 font-medium">
                            <T>Showing</T> {orders.length} <T>orders</T>
                        </p>
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className={`transition-all ${highlightOrderId === order.id ? 'ring-2 ring-emerald-500 ring-offset-2 rounded-2xl' : ''}`}
                            >
                                <OrderTrackingCard order={order} />
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
