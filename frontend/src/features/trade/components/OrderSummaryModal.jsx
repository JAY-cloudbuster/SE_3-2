/**
 * @fileoverview Order Summary Modal Component for AgriSahayak Trade System
 * 
 * Full-screen modal with a 3-step checkout flow:
 * 1. Order Details - Crop info, quantity selector, price breakdown
 * 2. Delivery Address - Street, city, state, pincode, and notes
 * 3. Confirmation - Final review before placing order
 * 
 * Saves orders to localStorage (mockOrders) and redirects to
 * /order-confirmation with order data. Used as an alternative to
 * the standalone BuyNowPaymentPage.
 * 
 * @component OrderSummaryModal
 * @param {Object} props
 * @param {Object} props.crop - Crop data (id, name, price, quantity, etc.)
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onConfirm - Callback with the created order
 * 
 * @see Epic 4, Story 4.5 - Buy Now Checkout
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import { T } from '../../../context/TranslationContext';
import { useNavigate } from 'react-router-dom';

export default function OrderSummaryModal({ crop, onClose, onConfirm }) {
    const [quantity, setQuantity] = useState(10);
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [notes, setNotes] = useState('');
    const [step, setStep] = useState(1); // 1: Summary, 2: Address, 3: Confirm
    const navigate = useNavigate();

    const subtotal = crop.price * quantity;
    const deliveryFee = 50;
    const total = subtotal + deliveryFee;

    const handleConfirmOrder = () => {
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

        onConfirm(order);
        navigate('/order-confirmation', { state: { order } });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between text-white">
                        <div>
                            <h2 className="text-2xl font-black"><T>Order Summary</T></h2>
                            <p className="text-sm text-emerald-100"><T>Review your order details</T></p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-emerald-800 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4 px-6 py-4 bg-emerald-50">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-200 text-slate-400'
                                        }`}
                                >
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div
                                        className={`w-12 h-1 ${step > s ? 'bg-emerald-600' : 'bg-slate-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 overflow-y-auto max-h-[50vh]">
                        {/* Step 1: Order Details */}
                        {step === 1 && (
                            <div className="space-y-6">
                                {/* Crop Info */}
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                    <img
                                        src={crop.image}
                                        alt={crop.name}
                                        className="w-20 h-20 rounded-xl object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-slate-900">{crop.name}</h3>
                                        <p className="text-sm text-slate-500">
                                            <T>From</T> {crop.farmerName} · {crop.farmerLocation}
                                        </p>
                                        <p className="text-emerald-600 font-bold mt-1">₹{crop.price}/kg</p>
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        <T>Quantity (kg)</T>
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 10))}
                                            className="w-12 h-12 bg-slate-200 rounded-xl font-bold text-xl hover:bg-slate-300 transition-colors"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                            className="flex-1 text-center text-2xl font-bold py-3 border-2 border-emerald-200 rounded-xl"
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(crop.quantity, quantity + 10))}
                                            className="w-12 h-12 bg-emerald-600 text-white rounded-xl font-bold text-xl hover:bg-emerald-700 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        <T>Available:</T> {crop.quantity}kg
                                    </p>
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600"><T>Subtotal</T></span>
                                        <span className="font-bold">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600"><T>Delivery Fee</T></span>
                                        <span className="font-bold">₹{deliveryFee}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black text-emerald-600 pt-3 border-t-2 border-slate-200">
                                        <span><T>Total</T></span>
                                        <span>₹{total}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Delivery Address */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="text-emerald-600" size={24} />
                                    <h3 className="text-lg font-bold"><T>Delivery Address</T></h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">
                                        <T>Street Address</T>
                                    </label>
                                    <input
                                        type="text"
                                        value={deliveryAddress.street}
                                        onChange={(e) =>
                                            setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                        placeholder="123 Market Road"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">
                                            <T>City</T>
                                        </label>
                                        <input
                                            type="text"
                                            value={deliveryAddress.city}
                                            onChange={(e) =>
                                                setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                            placeholder="Mumbai"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">
                                            <T>State</T>
                                        </label>
                                        <input
                                            type="text"
                                            value={deliveryAddress.state}
                                            onChange={(e) =>
                                                setDeliveryAddress({ ...deliveryAddress, state: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                            placeholder="Maharashtra"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">
                                        <T>Pincode</T>
                                    </label>
                                    <input
                                        type="text"
                                        value={deliveryAddress.pincode}
                                        onChange={(e) =>
                                            setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                        placeholder="400001"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">
                                        <T>Special Instructions (Optional)</T>
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                        rows={3}
                                        placeholder="Any special delivery instructions..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Confirmation */}
                        {step === 3 && (
                            <div className="space-y-6 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                    className="w-24 h-24 mx-auto bg-emerald-100 rounded-full flex items-center justify-center"
                                >
                                    <CheckCircle className="text-emerald-600" size={48} />
                                </motion.div>

                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">
                                        <T>Ready to Place Order?</T>
                                    </h3>
                                    <p className="text-slate-600">
                                        <T>Your order will be sent to the farmer for confirmation</T>
                                    </p>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600"><T>Crop:</T></span>
                                        <span className="font-bold">{crop.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600"><T>Quantity:</T></span>
                                        <span className="font-bold">{quantity}kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600"><T>Total Amount:</T></span>
                                        <span className="font-bold text-emerald-600">₹{total}</span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-slate-200">
                                        <span className="text-slate-600"><T>Delivery to:</T></span>
                                        <span className="font-bold text-right text-sm">
                                            {deliveryAddress.city}, {deliveryAddress.state}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-slate-50 flex gap-3">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
                            >
                                <T>Back</T>
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
                            >
                                <T>Continue</T>
                            </button>
                        ) : (
                            <button
                                onClick={handleConfirmOrder}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
                            >
                                <T>Place Order</T>
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
