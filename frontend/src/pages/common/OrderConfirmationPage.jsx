/**
 * @fileoverview Order Confirmation Page for AgriSahayak Frontend
 * 
 * Success page shown after placing an order. Displays a spring-animated
 * checkmark, order details (crop, quantity, amount, farmer, delivery
 * address, date), and current status. Provides navigation to the
 * buyer dashboard and order tracking.
 * 
 * Reads order data from location.state; shows fallback if missing.
 * 
 * @component OrderConfirmationPage
 * @see Epic 4, Story 4.6 - Order Confirmation
 * @see BuyNowPaymentPage - Redirects here after checkout
 * @see OrderSummaryModal - Alternative checkout also redirects here
 */
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { T } from '../../context/TranslationContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500"><T>No order found</T></p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full"
            >
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/50">
                        <CheckCircle className="text-white" size={64} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">
                        <T>Order Placed Successfully!</T>
                    </h1>
                    <p className="text-slate-600 text-lg">
                        <T>Your order has been sent to the farmer for confirmation</T>
                    </p>
                </motion.div>

                {/* Order Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
                >
                    {/* Order ID */}
                    <div className="text-center pb-6 border-b border-slate-200">
                        <p className="text-sm text-slate-500 mb-1"><T>Order ID</T></p>
                        <p className="text-2xl font-black text-emerald-600">{order.id}</p>
                    </div>

                    {/* Order Info */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Package className="text-emerald-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 mb-1">{order.cropName}</h3>
                                <p className="text-sm text-slate-600">
                                    {order.quantity}kg × ₹{order.pricePerKg}/kg = ₹{order.totalAmount}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    <T>From</T> {order.farmerName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <MapPin className="text-blue-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 mb-1"><T>Delivery Address</T></h3>
                                <p className="text-sm text-slate-600">
                                    {order.deliveryAddress.street}<br />
                                    {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Calendar className="text-purple-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 mb-1"><T>Order Date</T></h3>
                                <p className="text-sm text-slate-600">
                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-emerald-900"><T>Current Status</T></p>
                                <p className="text-xs text-emerald-600 mt-1">
                                    <T>Waiting for farmer confirmation</T>
                                </p>
                            </div>
                            <div className="px-4 py-2 bg-emerald-600 text-white rounded-full text-xs font-bold uppercase">
                                <T>Pending</T>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => navigate('/dashboard/buyer')}
                            className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition-colors"
                        >
                            <T>Back to Dashboard</T>
                        </button>
                        <button
                            onClick={() => navigate('/orders')}
                            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <T>Track Order</T>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>

                {/* Next Steps */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 text-center"
                >
                    <p className="text-sm text-slate-500">
                        <T>You will receive a notification once the farmer confirms your order</T>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
