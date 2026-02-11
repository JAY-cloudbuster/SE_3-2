/**
 * @fileoverview Buy Now Payment Page for AgriSahayak Frontend
 * 
 * Standalone full-screen checkout page for crop purchases.
 * Implements a 3-step checkout flow:
 * 1. Select Quantity — Increment/decrement controls
 * 2. Delivery Address — Street, city, state, pincode + special instructions
 * 3. Payment Method — Card, UPI, or Cash on Delivery
 * 
 * After order confirmation, saves the order to localStorage (mockOrders)
 * and redirects to /order-confirmation with the order data.
 * 
 * Layout:
 * - Left sidebar: Crop details + live order summary (subtotal, delivery, total)
 * - Right panel: Multi-step form (quantity → address → payment)
 * - Top navbar: Back button, page title, step indicator (1/2/3)
 * 
 * @component BuyNowPaymentPage
 * @route /buy/:cropId (Standalone, no Sidebar/Navbar)
 * 
 * @see Epic 4, Story 4.5 - Buy Now (Instant Purchase)
 * @see Epic 4, Story 4.6 - Checkout with Payment
 * @see Epic 4, Story 4.7 - Order Confirmation
 * @see OrderConfirmationPage - Redirected to after successful order
 */
import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle, Smartphone, Banknote, Truck, ShieldCheck } from 'lucide-react';
import { T } from '../../context/TranslationContext';
import { AuthContext } from '../../context/AuthContext';

export default function BuyNowPaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [crop, setCrop] = useState(null);

    // Order state
    const [quantity, setQuantity] = useState(10);
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [notes, setNotes] = useState('');
    const [step, setStep] = useState(1); // 1: Summary, 2: Address, 3: Payment
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [processing, setProcessing] = useState(false);

    // Determine correct dashboard route based on user role
    const dashboardRoute = user?.role === 'BUYER' ? '/dashboard/buyer' : '/marketplace';

    // Load crop data from navigation state
    useEffect(() => {
        if (location.state?.crop) {
            setCrop(location.state.crop);
        } else {
            // No crop data, redirect back
            navigate(dashboardRoute);
        }
    }, [location.state, navigate, dashboardRoute]);

    if (!crop) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-slate-500 mb-4"><T>Loading...</T></p>
                </div>
            </div>
        );
    }

    const subtotal = crop.price * quantity;
    const deliveryFee = 50;
    const total = subtotal + deliveryFee;

    const handleConfirmOrder = () => {
        setProcessing(true);

        // Simulate processing
        setTimeout(() => {
            const order = {
                id: `order_${Date.now()}`,
                cropId: crop.id,
                cropName: crop.name,
                farmerId: crop.farmerId,
                farmerName: crop.farmerName,
                quantity,
                pricePerKg: crop.price,
                totalAmount: total,
                status: 'pending',
                orderType: 'buynow',
                paymentMethod,
                createdAt: new Date().toISOString(),
                deliveryAddress,
                notes,
                timeline: [
                    {
                        status: 'placed',
                        timestamp: new Date().toISOString(),
                        note: 'Order placed successfully',
                    },
                ],
            };

            // Save to localStorage
            const orders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
            orders.push(order);
            localStorage.setItem('mockOrders', JSON.stringify(orders));

            setProcessing(false);
            navigate('/order-confirmation', { state: { order } });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Back Button */}
                        <button
                            onClick={() => navigate(dashboardRoute)}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-lg"
                        >
                            <ArrowLeft size={20} />
                            <span><T>Back to Marketplace</T></span>
                        </button>

                        {/* Center: Page Title */}
                        <div className="text-center">
                            <h1 className="text-2xl font-black text-slate-900"><T>Complete Your Purchase</T></h1>
                            <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                                <ShieldCheck size={14} className="text-emerald-600" />
                                <T>Secure Checkout</T>
                            </p>
                        </div>

                        {/* Right: Step Indicator */}
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-200 text-slate-400'
                                        }`}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar: Crop Details & Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 space-y-6">
                            {/* Crop Image */}
                            <div className="relative">
                                <img
                                    src={crop.image}
                                    alt={crop.name}
                                    className="w-full h-48 object-cover rounded-xl"
                                />
                                <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                                    Grade {crop.quality}
                                </div>
                            </div>

                            {/* Crop Info */}
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">{crop.name}</h2>
                                <p className="text-sm text-slate-600 mb-4">{crop.description}</p>

                                <div className="space-y-3 pt-4 border-t border-slate-200">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Price</T></span>
                                        <span className="text-lg font-black text-emerald-600">₹{crop.price}/kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Available</T></span>
                                        <span className="font-bold text-slate-900">{crop.quantity}kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Farmer</T></span>
                                        <span className="font-bold text-slate-900">{crop.farmerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Location</T></span>
                                        <span className="font-bold text-slate-900">{crop.farmerLocation}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-emerald-50 rounded-xl p-4 space-y-3">
                                <h3 className="font-bold text-emerald-900"><T>Order Summary</T></h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600"><T>Subtotal</T> ({quantity}kg)</span>
                                        <span className="font-bold">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600"><T>Delivery Fee</T></span>
                                        <span className="font-bold">₹{deliveryFee}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black text-emerald-700 pt-2 border-t border-emerald-200">
                                        <span><T>Total</T></span>
                                        <span>₹{total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Order Form Steps */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {/* Step 1: Quantity Selection */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Package className="text-emerald-600" size={28} />
                                        <h3 className="text-2xl font-black text-slate-900"><T>Select Quantity</T></h3>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6">
                                        <label className="block text-sm font-bold text-slate-700 mb-4">
                                            <T>How much would you like to order?</T>
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 10))}
                                                className="w-14 h-14 bg-slate-200 rounded-xl font-bold text-2xl hover:bg-slate-300 transition-colors"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                                className="flex-1 text-center text-3xl font-black py-4 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                            />
                                            <button
                                                onClick={() => setQuantity(Math.min(crop.quantity, quantity + 10))}
                                                className="w-14 h-14 bg-emerald-600 text-white rounded-xl font-bold text-2xl hover:bg-emerald-700 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-3 text-center">
                                            <T>Available:</T> {crop.quantity}kg
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Delivery Address */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MapPin className="text-emerald-600" size={28} />
                                        <h3 className="text-2xl font-black text-slate-900"><T>Delivery Address</T></h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                <T>Street Address</T>
                                            </label>
                                            <input
                                                type="text"
                                                value={deliveryAddress.street}
                                                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                                                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
                                                placeholder="123 Market Road"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                                    <T>City</T>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={deliveryAddress.city}
                                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                                                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
                                                    placeholder="Mumbai"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                                    <T>State</T>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={deliveryAddress.state}
                                                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                                                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
                                                    placeholder="Maharashtra"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                <T>Pincode</T>
                                            </label>
                                            <input
                                                type="text"
                                                value={deliveryAddress.pincode}
                                                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                                                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
                                                placeholder="400001"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                <T>Special Instructions (Optional)</T>
                                            </label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                                rows={3}
                                                placeholder="Any special delivery instructions..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard className="text-emerald-600" size={28} />
                                        <h3 className="text-2xl font-black text-slate-900"><T>Payment Method</T></h3>
                                    </div>

                                    {/* Payment Method Selection */}
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        {[
                                            { id: 'card', label: 'Card', icon: <CreditCard size={24} /> },
                                            { id: 'upi', label: 'UPI', icon: <Smartphone size={24} /> },
                                            { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={24} /> },
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all font-bold ${paymentMethod === method.id
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                    : 'border-slate-100 hover:border-emerald-200 text-slate-400'
                                                    }`}
                                            >
                                                {method.icon}
                                                <span className="text-sm">{method.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Payment Form Based on Method */}
                                    {paymentMethod === 'card' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Card Number</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="0000 0000 0000 0000"
                                                        className="w-full px-4 py-4 pl-12 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
                                                    />
                                                    <CreditCard size={20} className="absolute left-4 top-4 text-slate-400" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">CVC</label>
                                                    <input
                                                        type="text"
                                                        placeholder="123"
                                                        className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Cardholder Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {paymentMethod === 'upi' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">UPI ID</label>
                                            <input
                                                type="text"
                                                placeholder="username@upi"
                                                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
                                            />
                                            <p className="text-sm text-slate-500 mt-3">
                                                <T>Verify on your UPI app after clicking pay.</T>
                                            </p>
                                        </motion.div>
                                    )}

                                    {paymentMethod === 'cod' && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-2xl text-amber-800 font-medium flex items-center gap-4">
                                                <Truck size={32} />
                                                <div>
                                                    <p className="font-bold text-lg"><T>Cash on Delivery</T></p>
                                                    <p className="text-sm"><T>Pay cash when your order is delivered to your doorstep.</T></p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Order Confirmation Summary */}
                                    <div className="bg-slate-50 rounded-2xl p-6 mt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <CheckCircle className="text-emerald-600" size={20} />
                                            <h4 className="font-bold text-slate-900"><T>Confirm Your Order</T></h4>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-600"><T>Crop:</T></span>
                                                <span className="font-bold">{crop.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600"><T>Quantity:</T></span>
                                                <span className="font-bold">{quantity}kg</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600"><T>Delivery to:</T></span>
                                                <span className="font-bold text-right">{deliveryAddress.city}, {deliveryAddress.state}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
                                {step > 1 && (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="px-8 py-4 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
                                    >
                                        <T>Back</T>
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button
                                        onClick={() => setStep(step + 1)}
                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all text-lg"
                                    >
                                        <T>Continue</T>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleConfirmOrder}
                                        disabled={processing}
                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {processing ? <T>Processing...</T> : <><T>Pay</T> ₹{total}</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
