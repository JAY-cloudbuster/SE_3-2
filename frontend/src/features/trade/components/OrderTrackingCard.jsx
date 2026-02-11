/**
 * @fileoverview Order Tracking Card Component for AgriSahayak Trade System
 * 
 * Displays order status with a vertical timeline showing progression
 * through Pending → Confirmed → Shipped → Delivered (or Cancelled).
 * Each timeline event shows icon, label, note, and timestamp.
 * Includes order details (quantity, price, total) and a cancel button
 * for pending orders.
 * 
 * @component OrderTrackingCard
 * @param {Object} props
 * @param {Object} props.order - Order data (id, cropName, status, timeline, quantity, etc.)
 * 
 * @see Epic 4, Story 4.7 - Order Tracking
 * @see TradeDashboard - Renders OrderTrackingCard in the orders tab
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { T } from '../../../context/TranslationContext';

export default function OrderTrackingCard({ order }) {
    const statusConfig = {
        pending: { icon: Clock, color: 'yellow', label: 'Pending' },
        confirmed: { icon: CheckCircle, color: 'blue', label: 'Confirmed' },
        shipped: { icon: Truck, color: 'purple', label: 'Shipped' },
        delivered: { icon: Package, color: 'green', label: 'Delivered' },
        cancelled: { icon: XCircle, color: 'red', label: 'Cancelled' },
    };

    const currentStatus = statusConfig[order.status] || statusConfig.pending;
    const StatusIcon = currentStatus.icon;

    const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(order.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-lg text-slate-900">{order.cropName}</h3>
                    <p className="text-sm text-slate-500"><T>Order ID:</T> {order.id}</p>
                </div>
                <div className={`px-4 py-2 bg-${currentStatus.color}-100 text-${currentStatus.color}-700 rounded-full text-xs font-bold uppercase`}>
                    <T>{currentStatus.label}</T>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
                {order.timeline?.map((event, index) => {
                    const eventStatus = statusConfig[event.status] || statusConfig.pending;
                    const EventIcon = eventStatus.icon;
                    const isLast = index === order.timeline.length - 1;

                    return (
                        <div key={index} className="flex gap-4">
                            {/* Icon */}
                            <div className="relative">
                                <div className={`w-10 h-10 rounded-full bg-${eventStatus.color}-100 flex items-center justify-center`}>
                                    <EventIcon className={`text-${eventStatus.color}-600`} size={20} />
                                </div>
                                {!isLast && (
                                    <div className={`absolute left-5 top-10 w-0.5 h-12 bg-${eventStatus.color}-200`} />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-4">
                                <p className="font-bold text-slate-900"><T>{eventStatus.label}</T></p>
                                <p className="text-sm text-slate-600">{event.note}</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {new Date(event.timestamp).toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Order Details */}
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600"><T>Quantity:</T></span>
                    <span className="font-bold">{order.quantity}kg</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600"><T>Price per kg:</T></span>
                    <span className="font-bold">₹{order.pricePerKg}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-emerald-600 pt-2 border-t border-slate-200">
                    <span><T>Total:</T></span>
                    <span>₹{order.totalAmount}</span>
                </div>
            </div>

            {/* Actions */}
            {order.status === 'pending' && (
                <button className="w-full mt-4 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors">
                    <T>Cancel Order</T>
                </button>
            )}
        </motion.div>
    );
}
