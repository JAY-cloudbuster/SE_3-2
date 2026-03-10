import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, MapPin, Calendar, ArrowRight, Receipt, CreditCard, ShieldCheck, Star } from 'lucide-react';
import { T } from '../../context/TranslationContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatQuintalQuantity, formatQuintalRate } from '../../utils/formatters';
import RateFarmerModal from '../../components/RateFarmerModal';

function parseAddress(address) {
    if (!address) return { line1: 'N/A', line2: '' };
    if (typeof address === 'string') {
        const parts = address.split(',').map((p) => p.trim());
        return {
            line1: parts[0] || address,
            line2: parts.slice(1).join(', '),
        };
    }
    return {
        line1: address.street || 'N/A',
        line2: `${address.city || ''}${address.state ? `, ${address.state}` : ''}${address.pincode ? ` - ${address.pincode}` : ''}`.trim(),
    };
}

function normalizeOrder(raw) {
    if (!raw) return null;

    const item = raw.items?.[0] || null;
    const quantity = item?.quantity ?? raw.quantity ?? 0;
    const pricePerQuintal = item?.pricePerKg ?? raw.pricePerKg ?? raw.pricePerUnit ?? 0;
    const subtotal = item?.total ?? (quantity * pricePerQuintal);
    const shipping = raw.shippingCost ?? 0;
    const total = raw.totalAmount ?? subtotal + shipping;

    const address = parseAddress(raw.shippingAddress || raw.deliveryAddress);

    return {
        id: raw._id || raw.id || 'N/A',
        cropName: item?.name || raw.cropName || 'Crop',
        quantity,
        pricePerQuintal,
        subtotal,
        shipping,
        total,
        farmerId: raw.farmer?._id || raw.farmer || null,
        farmerName: raw.farmer?.name || raw.farmerName || 'Farmer',
        buyerName: raw.buyer?.name || raw.buyerName || 'Buyer',
        paymentMethod: (raw.paymentMethod || 'N/A').toUpperCase(),
        paymentStatus: raw.paymentStatus || 'pending',
        orderStatus: raw.orderStatus || raw.status || 'Pending',
        address,
        createdAt: raw.createdAt || new Date().toISOString(),
        sourceBid: raw.sourceBid,
    };
}

export default function OrderConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isRateModalOpen, setIsRateModalOpen] = useState(false);

    const order = normalizeOrder(location.state?.order);

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
                    <p className="text-slate-600 font-semibold"><T>No order found</T></p>
                    <button
                        onClick={() => navigate('/dashboard/buyer')}
                        className="mt-4 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                    >
                        <T>Go to Dashboard</T>
                    </button>
                </div>
            </div>
        );
    }

    const orderDate = new Date(order.createdAt);

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    className="text-center mb-8"
                >
                    <div className="w-28 h-28 mx-auto bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mb-5 shadow-xl shadow-emerald-500/40">
                        <CheckCircle className="text-white" size={56} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">
                        <T>Purchase Successful</T>
                    </h1>
                    <p className="text-slate-600 text-lg">
                        <T>Your crop order and payment have been recorded successfully.</T>
                    </p>
                </motion.div>

                <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-200">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-500"><T>Order ID</T></p>
                            <p className="text-sm font-black text-emerald-700 break-all">{order.id}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-500"><T>Order Status</T></p>
                            <p className="text-sm font-black text-slate-900">{order.orderStatus}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-500"><T>Payment Status</T></p>
                            <p className="text-sm font-black text-slate-900">{order.paymentStatus}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                            <div className="flex items-center gap-2 text-emerald-700 font-bold">
                                <Package size={18} /> <T>Purchase Details</T>
                            </div>
                            <div className="text-sm text-slate-700 space-y-1">
                                <p><span className="font-semibold"><T>Crop</T>:</span> {order.cropName}</p>
                                <p><span className="font-semibold"><T>Quantity</T>:</span> {formatQuintalQuantity(order.quantity)}</p>
                                <p><span className="font-semibold"><T>Price/quintal</T>:</span> {formatQuintalRate(order.pricePerQuintal)}</p>
                                <p><span className="font-semibold"><T>Farmer</T>:</span> {order.farmerName}</p>
                                {order.sourceBid && <p><span className="font-semibold"><T>Source</T>:</span> <T>Accepted Bid Checkout</T></p>}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
                            <div className="flex items-center gap-2 text-blue-700 font-bold">
                                <CreditCard size={18} /> <T>Payment Report</T>
                            </div>
                            <div className="text-sm text-slate-700 space-y-1">
                                <p><span className="font-semibold"><T>Method</T>:</span> {order.paymentMethod}</p>
                                <p><span className="font-semibold"><T>Subtotal</T>:</span> ₹{Number(order.subtotal || 0).toLocaleString('en-IN')}</p>
                                <p><span className="font-semibold"><T>Shipping</T>:</span> ₹{Number(order.shipping || 0).toLocaleString('en-IN')}</p>
                                <p className="text-emerald-700 font-black"><span><T>Total Paid</T>:</span> ₹{Number(order.total || 0).toLocaleString('en-IN')}</p>
                                <p className="text-xs text-slate-500 pt-1"><ShieldCheck size={12} className="inline mr-1" /><T>Payment details stored securely in encrypted form.</T></p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4 space-y-2">
                        <div className="flex items-center gap-2 text-purple-700 font-bold">
                            <MapPin size={18} /> <T>Delivery Report</T>
                        </div>
                        <p className="text-sm text-slate-700">{order.address.line1}</p>
                        {order.address.line2 && <p className="text-sm text-slate-600">{order.address.line2}</p>}
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-4 flex items-center gap-3 text-slate-700 text-sm">
                        <Calendar size={18} className="text-slate-500" />
                        <span>
                            <T>Transaction Timestamp</T>: {orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} {orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                            onClick={() => navigate('/dashboard/buyer')}
                            className="bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition-colors"
                        >
                            <T>Back to Dashboard</T>
                        </button>
                        
                        {order.farmerId && (
                            <button
                                onClick={() => setIsRateModalOpen(true)}
                                className="bg-yellow-50 text-yellow-700 font-bold py-3 rounded-xl hover:bg-yellow-100 transition-colors flex items-center justify-center gap-2 border border-yellow-200"
                            >
                                <Star size={18} className="fill-yellow-500 text-yellow-500" />
                                <T>Rate Farmer</T>
                            </button>
                        )}
                        
                        <button
                            onClick={() => navigate('/orders')}
                            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Receipt size={18} />
                            <T>Order Tracking</T>
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {order.farmerId && (
                <RateFarmerModal
                    isOpen={isRateModalOpen}
                    onClose={() => setIsRateModalOpen(false)}
                    farmerId={order.farmerId}
                    farmerName={order.farmerName}
                />
            )}
        </div>
    );
}
