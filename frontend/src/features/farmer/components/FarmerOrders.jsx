/**
 * @fileoverview Farmer Orders Component for AgriSahayak Frontend
 * 
 * Displays a list of recent orders received by the farmer.
 * Uses mock data (MOCK_ORDERS) with simulated loading delay.
 * Each order card shows buyer name, order ID, items, amount,
 * date, and status badge (Pending/Completed/Processing).
 * 
 * @component FarmerOrders
 * @see Epic 4, Story 4.7 - Order Tracking for Farmers
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, Clock, ChevronRight } from 'lucide-react';

const MOCK_ORDERS = [
    { id: 'ORD-7829', buyer: 'Metro Retail', amount: '₹12,400', date: 'Oct 24, 2023', status: 'Pending', items: '200kg Tomato' },
    { id: 'ORD-7830', buyer: 'Fresh Basket', amount: '₹8,350', date: 'Oct 23, 2023', status: 'Completed', items: '100kg Wheat' },
    { id: 'ORD-7831', buyer: 'Green Grocers', amount: '₹15,200', date: 'Oct 22, 2023', status: 'Processing', items: '500kg Onion' },
];

const statusStyles = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Processing: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function FarmerOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Simulate data fetch
        setTimeout(() => setOrders(MOCK_ORDERS), 500);
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
                    <h2 className="text-2xl font-black text-emerald-900">Recent Orders</h2>
                </div>
            </div>

            <div className="grid gap-4">
                {orders.map((order, i) => (
                    <div key={order.id} className="glass-card p-5 flex items-center justify-between group hover:border-emerald-200 transition-colors">
                        <div className="flex gap-4 items-center">
                            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                                {order.buyer[0]}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{order.buyer}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                    <span>{order.id}</span>
                                    <span>•</span>
                                    <span>{order.items}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <div className="font-bold text-emerald-700">{order.amount}</div>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium justify-end">
                                    <Calendar size={10} /> {order.date}
                                </div>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyles[order.status]}`}>
                                {order.status}
                            </span>

                            <button className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
