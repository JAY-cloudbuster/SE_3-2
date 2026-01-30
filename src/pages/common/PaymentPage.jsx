import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Truck, Check, Smartphone, Banknote } from 'lucide-react';

export default function PaymentPage() {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [processing, setProcessing] = useState(false);
    const [completed, setCompleted] = useState(false);

    // Mock order details
    const order = {
        id: 'ORD-7890',
        items: [
            { name: 'Organic Red Onions', qty: '50 kg', price: '₹35/kg', total: 1750 },
            { name: 'Fresh Potatoes', qty: '100 kg', price: '₹18/kg', total: 1800 },
        ],
        subtotal: 3550,
        shipping: 450,
        total: 4000
    };

    const handlePayment = (e) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setCompleted(true);
        }, 2000);
    };

    if (completed) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-emerald-50/50">
                <motion.div
                    className="glass-card max-w-md w-full p-8 text-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                        <Check size={40} strokeWidth={3} />
                    </div>
                    <h2 className="text-2xl font-black text-emerald-900 mb-2">Payment Successful!</h2>
                    <p className="text-slate-500 font-medium mb-8">
                        Your order <span className="text-slate-800 font-bold">#{order.id}</span> has been confirmed and will be shipped shortly.
                    </p>
                    <button className="btn-primary w-full shadow-emerald-500/25">
                        Track Order
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            className="max-w-6xl mx-auto p-6 lg:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <header className="mb-10">
                <h1 className="text-4xl font-black text-emerald-950 tracking-tight">Secure Checkout</h1>
                <p className="text-emerald-600 font-bold mt-2 flex items-center gap-2">
                    <ShieldCheck size={18} /> 256-bit SSL Encrypted Payment
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Payment Form */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass-card p-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Payment Method</h3>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {[
                                { id: 'card', label: 'Card', icon: <CreditCard size={20} /> },
                                { id: 'upi', label: 'UPI', icon: <Smartphone size={20} /> },
                                { id: 'cod', label: 'Cash', icon: <Banknote size={20} /> },
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${paymentMethod === method.id
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                            : 'border-slate-100 hover:border-emerald-200 text-slate-400'
                                        }`}
                                >
                                    {method.icon}
                                    {method.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handlePayment} className="space-y-6">
                            {paymentMethod === 'card' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                    <div>
                                        <label className="label-text">Card Number</label>
                                        <div className="relative">
                                            <input type="text" placeholder="0000 0000 0000 0000" className="input-field pl-10" />
                                            <CreditCard size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label-text">Expiry Date</label>
                                            <input type="text" placeholder="MM/YY" className="input-field" />
                                        </div>
                                        <div>
                                            <label className="label-text">CVC</label>
                                            <input type="text" placeholder="123" className="input-field" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="label-text">Cardholder Name</label>
                                        <input type="text" placeholder="John Doe" className="input-field" />
                                    </div>
                                </motion.div>
                            )}

                            {paymentMethod === 'upi' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <label className="label-text">UPI ID</label>
                                    <input type="text" placeholder="username@upi" className="input-field" />
                                    <p className="text-xs text-slate-400 mt-2 font-medium">Verify on your UPI app after clicking pay.</p>
                                </motion.div>
                            )}

                            {paymentMethod === 'cod' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800 text-sm font-medium flex gap-3">
                                        <Truck size={20} />
                                        Pay cash when your order is delivered to your doorstep.
                                    </div>
                                </motion.div>
                            )}

                            <button
                                disabled={processing}
                                className="btn-primary w-full py-4 text-lg shadow-emerald-500/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing ? 'Processing...' : `Pay ₹${order.total.toLocaleString()}`}
                            </button>
                        </form>
                    </section>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">Order Summary</h3>

                        <div className="space-y-4 mb-6">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-start text-sm">
                                    <div>
                                        <div className="font-bold text-slate-700">{item.name}</div>
                                        <div className="text-slate-500 font-medium text-xs">{item.qty} x {item.price}</div>
                                    </div>
                                    <div className="font-bold text-slate-800">₹{item.total}</div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 pt-4 space-y-2 text-sm font-medium text-slate-500">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{order.shipping}</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between font-black text-lg text-emerald-900">
                            <span>Total</span>
                            <span>₹{order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
