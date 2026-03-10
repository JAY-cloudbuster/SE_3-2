import React, { useState, useContext, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle, Smartphone, Banknote, Truck, ShieldCheck, Clock3 } from 'lucide-react';
import { T } from '../../context/TranslationContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { formatQuintalQuantity, formatQuintalRate } from '../../utils/formatters';
import { cropService } from '../../services/cropService';
import { tradeService } from '../../services/tradeService';

function getBidRemaining(expiresAt) {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}h ${m}m`;
}

export default function BuyNowPaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cropId } = useParams();
    const { user } = useContext(AuthContext);

    const [crop, setCrop] = useState(null);
    const [acceptedBid, setAcceptedBid] = useState(location.state?.bid || null);

    const [quantity, setQuantity] = useState(1);
    const [deliveryAddress, setDeliveryAddress] = useState({ street: '', city: '', state: '', pincode: '' });
    const [notes, setNotes] = useState('');
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [cardDetails, setCardDetails] = useState({ number: '', expiryMonth: '', cvv: '', name: '' });
    const [upiId, setUpiId] = useState('');

    const dashboardRoute = user?.role === 'BUYER' ? '/dashboard/buyer' : '/marketplace';

    useEffect(() => {
        const load = async () => {
            try {
                if (location.state?.crop) {
                    setCrop(location.state.crop);
                } else if (cropId) {
                    const res = await cropService.getAll();
                    const selected = res.data.find((c) => (c._id || c.id) === cropId);
                    if (selected) setCrop(selected);
                }

                if (!location.state?.bid) {
                    const bidRes = await tradeService.getAcceptedBids();
                    const matchedBid = (bidRes.data || []).find(
                        (b) => String(b.listingId?._id || b.listingId) === String(cropId)
                    );
                    if (matchedBid) setAcceptedBid(matchedBid);
                }
            } catch {
                toast.error('Unable to load checkout details');
                navigate(dashboardRoute);
            }
        };

        load();
    }, [location.state, cropId, navigate, dashboardRoute]);

    useEffect(() => {
        if (!crop) return;
        if (quantity > crop.quantity) setQuantity(crop.quantity || 1);
    }, [crop, quantity]);

    const activePrice = useMemo(() => {
        if (acceptedBid?.status === 'Accepted' && acceptedBid?.amount) {
            return acceptedBid.amount;
        }
        return crop?.price || 0;
    }, [acceptedBid, crop]);

    const bidRemaining = useMemo(() => getBidRemaining(acceptedBid?.expiresAt), [acceptedBid]);

    const formatCardNumber = (raw) => {
        const digits = String(raw || '').replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiryMMYY = (monthValue) => {
        if (!monthValue || !monthValue.includes('-')) return '';
        const [year, month] = monthValue.split('-');
        return `${month}/${year.slice(-2)}`;
    };

    const validateCardNumber = (numberFormatted) => {
        const digits = String(numberFormatted || '').replace(/\D/g, '');
        return /^\d{16}$/.test(digits) ? '' : 'Card number must contain exactly 16 digits.';
    };

    const validateCardholderName = (name) => {
        return /^[A-Za-z ]+$/.test(name.trim()) ? '' : 'Cardholder name must contain only letters.';
    };

    const validateExpiryMonth = (monthValue) => {
        if (!monthValue) return 'Card expiry date must be in the future.';
        const [year, month] = monthValue.split('-').map(Number);
        if (!year || !month || month < 1 || month > 12) {
            return 'Card expiry date must be in the future.';
        }
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const selectedMonthStart = new Date(year, month - 1, 1);
        return selectedMonthStart > currentMonthStart ? '' : 'Card expiry date must be in the future.';
    };

    const validateCvv = (cvv) => {
        return /^\d{3}$/.test(cvv) ? '' : 'CVV must be a 3-digit number.';
    };

    const validateUpi = (value) => {
        return /^[^\s@]+@[^\s@]+$/.test(value.trim()) ? '' : 'Enter a valid UPI ID (example: name@upi).';
    };

    const validateAddress = () => {
        const newErrors = {};
        if (!deliveryAddress.street.trim()) newErrors.street = 'Street address is required';
        if (!deliveryAddress.city.trim()) newErrors.city = 'City is required';
        if (!deliveryAddress.state.trim()) newErrors.state = 'State is required';
        if (!deliveryAddress.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(deliveryAddress.pincode.trim())) newErrors.pincode = 'Enter a valid 6-digit pincode';
        setErrors(newErrors);
        if (Object.keys(newErrors).length) toast.error('Please fill all required address fields');
        return !Object.keys(newErrors).length;
    };

    const validatePayment = () => {
        const newErrors = {};
        if (paymentMethod === 'card') {
            const cardNumberError = validateCardNumber(cardDetails.number);
            const cardExpiryError = validateExpiryMonth(cardDetails.expiryMonth);
            const cardCvvError = validateCvv(cardDetails.cvv);
            const cardNameError = validateCardholderName(cardDetails.name);
            if (cardNumberError) newErrors.cardNumber = cardNumberError;
            if (cardExpiryError) newErrors.cardExpiry = cardExpiryError;
            if (cardCvvError) newErrors.cardCvv = cardCvvError;
            if (cardNameError) newErrors.cardName = cardNameError;
        } else if (paymentMethod === 'upi') {
            const upiError = validateUpi(upiId);
            if (upiError) newErrors.upiId = upiError;
        }
        setErrors(newErrors);
        return !Object.keys(newErrors).length;
    };

    const isPaymentValid = useMemo(() => {
        if (paymentMethod === 'cod') return true;
        if (paymentMethod === 'upi') return !validateUpi(upiId);
        return (
            !validateCardNumber(cardDetails.number) &&
            !validateCardholderName(cardDetails.name) &&
            !validateExpiryMonth(cardDetails.expiryMonth) &&
            !validateCvv(cardDetails.cvv)
        );
    }, [paymentMethod, upiId, cardDetails]);

    const handleNext = () => {
        if (step === 2 && !validateAddress()) return;
        setErrors({});
        setStep((s) => s + 1);
    };

    const handleConfirmOrder = async () => {
        if (!validatePayment()) return;

        if (acceptedBid?.expiresAt && new Date(acceptedBid.expiresAt) < new Date()) {
            toast.error('Bid payment window expired. Please place a new bid.');
            return;
        }

        try {
            setProcessing(true);

            const shippingAddressString = `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}${
                notes ? ` (${notes})` : ''
            }`;

            const paymentDetails =
                paymentMethod === 'card'
                    ? {
                          type: 'card',
                          number: cardDetails.number,
                          expiry: formatExpiryMMYY(cardDetails.expiryMonth),
                          cvv: cardDetails.cvv,
                          name: cardDetails.name,
                      }
                    : paymentMethod === 'upi'
                    ? { type: 'upi', upiId }
                    : { type: 'cod' };

            const payload = {
                cropId: crop._id || crop.id,
                quantity,
                paymentMethod,
                shippingAddress: shippingAddressString,
                paymentDetails,
                bidId: acceptedBid?._id,
            };

            const res = await tradeService.createOrder(payload);
            toast.success('Order placed successfully');
            navigate('/order-confirmation', { state: { order: res.data } });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setProcessing(false);
        }
    };

    if (!crop) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500"><T>Loading...</T></p>
            </div>
        );
    }

    const subtotal = activePrice * quantity;
    const deliveryFee = 50;
    const total = subtotal + deliveryFee;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="bg-white border-b border-slate-200 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(dashboardRoute)}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-lg"
                        >
                            <ArrowLeft size={20} />
                            <span><T>Back to Marketplace</T></span>
                        </button>

                        <div className="text-center">
                            <h1 className="text-2xl font-black text-slate-900"><T>Complete Your Purchase</T></h1>
                            <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                                <ShieldCheck size={14} className="text-emerald-600" />
                                <T>Secure Checkout</T>
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                        step >= s ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                                    }`}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 space-y-6">
                            <div className="relative">
                                <img
                                    src={crop.image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600'}
                                    alt={crop.name}
                                    className="w-full h-48 object-cover rounded-xl"
                                />
                                <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                                    Grade {crop.quality || 'A'}
                                </div>
                            </div>

                            {acceptedBid?.status === 'Accepted' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
                                    <div className="flex items-center gap-2 font-bold">
                                        <Clock3 size={14} />
                                        <T>Accepted bid checkout window</T>
                                    </div>
                                    <p className="mt-1">{bidRemaining === 'Expired' ? 'Expired' : `Time left: ${bidRemaining}`}</p>
                                </div>
                            )}

                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">{crop.name}</h2>
                                <p className="text-sm text-slate-600 mb-4">{crop.description || `Fresh ${crop.name} ready for dispatch.`}</p>
                                <div className="space-y-3 pt-4 border-t border-slate-200">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Price</T></span>
                                        <span className="text-lg font-black text-emerald-600">{formatQuintalRate(activePrice)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Available</T></span>
                                        <span className="font-bold text-slate-900">{formatQuintalQuantity(crop.quantity)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Farmer</T></span>
                                        <span className="font-bold text-slate-900">{crop.farmer?.name || crop.farmerName || 'Farmer'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-emerald-50 rounded-xl p-4 space-y-3">
                                <h3 className="font-bold text-emerald-900"><T>Order Summary</T></h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600"><T>Subtotal</T> ({formatQuintalQuantity(quantity)})</span>
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

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
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
                                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                                className="w-14 h-14 bg-slate-200 rounded-xl font-bold text-2xl hover:bg-slate-300 transition-colors"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, Math.min(Number(e.target.value || 1), crop.quantity || 1)))}
                                                className="flex-1 text-center text-3xl font-black py-4 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                            />
                                            <button
                                                onClick={() => setQuantity((q) => Math.min(crop.quantity || 1, q + 1))}
                                                className="w-14 h-14 bg-emerald-600 text-white rounded-xl font-bold text-2xl hover:bg-emerald-700 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-3 text-center"><T>Available</T>: {formatQuintalQuantity(crop.quantity)}</p>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MapPin className="text-emerald-600" size={28} />
                                        <h3 className="text-2xl font-black text-slate-900"><T>Delivery Address</T></h3>
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={deliveryAddress.street}
                                            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                                            className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg ${errors.street ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'}`}
                                            placeholder="Street Address"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                value={deliveryAddress.city}
                                                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                                                className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg ${errors.city ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'}`}
                                                placeholder="City"
                                            />
                                            <input
                                                type="text"
                                                value={deliveryAddress.state}
                                                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                                                className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg ${errors.state ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'}`}
                                                placeholder="State"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={deliveryAddress.pincode}
                                            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                                            className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg ${errors.pincode ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'}`}
                                            placeholder="Pincode"
                                            maxLength={6}
                                        />
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                                            rows={3}
                                            placeholder="Special delivery instructions (optional)"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard className="text-emerald-600" size={28} />
                                        <h3 className="text-2xl font-black text-slate-900"><T>Payment Method</T></h3>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        {[
                                            { id: 'card', label: 'Card', icon: <CreditCard size={24} /> },
                                            { id: 'upi', label: 'UPI', icon: <Smartphone size={24} /> },
                                            { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={24} /> },
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all font-bold ${
                                                    paymentMethod === method.id
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                        : 'border-slate-100 hover:border-emerald-200 text-slate-400'
                                                }`}
                                            >
                                                {method.icon}
                                                <span className="text-sm">{method.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                value={cardDetails.number}
                                                onChange={(e) => {
                                                    const formatted = formatCardNumber(e.target.value);
                                                    setCardDetails((p) => ({ ...p, number: formatted }));
                                                    setErrors((prev) => ({ ...prev, cardNumber: validateCardNumber(formatted) }));
                                                }}
                                                onPaste={(e) => {
                                                    e.preventDefault();
                                                    const pasted = e.clipboardData.getData('text');
                                                    const formatted = formatCardNumber(pasted);
                                                    setCardDetails((p) => ({ ...p, number: formatted }));
                                                    setErrors((prev) => ({ ...prev, cardNumber: validateCardNumber(formatted) }));
                                                }}
                                                inputMode="numeric"
                                                maxLength={19}
                                                className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg ${errors.cardNumber ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'}`}
                                            />
                                            {errors.cardNumber && <p className="text-xs text-rose-500 font-medium -mt-2">{errors.cardNumber}</p>}
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="month"
                                                    value={cardDetails.expiryMonth}
                                                    min={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`}
                                                    onChange={(e) => {
                                                        setCardDetails((p) => ({ ...p, expiryMonth: e.target.value }));
                                                        setErrors((prev) => ({ ...prev, cardExpiry: validateExpiryMonth(e.target.value) }));
                                                    }}
                                                    onKeyDown={(e) => {
                                                        // Force picker selection, avoid manual invalid typing.
                                                        e.preventDefault();
                                                    }}
                                                    className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg ${errors.cardExpiry ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'}`}
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="CVV"
                                                    value={cardDetails.cvv}
                                                    onChange={(e) => {
                                                        const v = e.target.value.replace(/\D/g, '').slice(0, 3);
                                                        setCardDetails((p) => ({ ...p, cvv: v }));
                                                        setErrors((prev) => ({ ...prev, cardCvv: validateCvv(v) }));
                                                    }}
                                                    onPaste={(e) => {
                                                        e.preventDefault();
                                                        const v = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 3);
                                                        setCardDetails((p) => ({ ...p, cvv: v }));
                                                        setErrors((prev) => ({ ...prev, cardCvv: validateCvv(v) }));
                                                    }}
                                                    inputMode="numeric"
                                                    maxLength={3}
                                                    className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg ${errors.cardCvv ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 -mt-2">
                                                <p className="text-xs text-slate-500">{cardDetails.expiryMonth ? `Selected: ${formatExpiryMMYY(cardDetails.expiryMonth)}` : 'Select expiry month (MM/YY)'}</p>
                                                {errors.cardCvv ? <p className="text-xs text-rose-500 font-medium text-right">{errors.cardCvv}</p> : <span />}
                                            </div>
                                            {errors.cardExpiry && <p className="text-xs text-rose-500 font-medium -mt-2">{errors.cardExpiry}</p>}
                                            <input
                                                type="text"
                                                placeholder="Cardholder Name"
                                                value={cardDetails.name}
                                                onChange={(e) => {
                                                    const v = e.target.value.replace(/[^A-Za-z ]/g, '');
                                                    setCardDetails((p) => ({ ...p, name: v }));
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        cardName: v.trim() ? validateCardholderName(v) : 'Cardholder name must contain only letters.',
                                                    }));
                                                }}
                                                onPaste={(e) => {
                                                    e.preventDefault();
                                                    const v = e.clipboardData.getData('text').replace(/[^A-Za-z ]/g, '');
                                                    setCardDetails((p) => ({ ...p, name: v }));
                                                    setErrors((prev) => ({
                                                        ...prev,
                                                        cardName: v.trim() ? validateCardholderName(v) : 'Cardholder name must contain only letters.',
                                                    }));
                                                }}
                                                className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg ${errors.cardName ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'}`}
                                            />
                                            {errors.cardName && <p className="text-xs text-rose-500 font-medium -mt-2">{errors.cardName}</p>}
                                        </div>
                                    )}

                                    {paymentMethod === 'upi' && (
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="username@upi"
                                                value={upiId}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setUpiId(v);
                                                    setErrors((prev) => ({ ...prev, upiId: validateUpi(v) }));
                                                }}
                                                className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none text-lg ${errors.upiId ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500'}`}
                                            />
                                            {errors.upiId && <p className="text-xs text-rose-500 font-medium mt-1">{errors.upiId}</p>}
                                        </div>
                                    )}

                                    {paymentMethod === 'cod' && (
                                        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-2xl text-amber-800 font-medium flex items-center gap-4">
                                            <Truck size={32} />
                                            <div>
                                                <p className="font-bold text-lg"><T>Cash on Delivery</T></p>
                                                <p className="text-sm"><T>Pay cash when your order is delivered.</T></p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-slate-50 rounded-2xl p-6 mt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <CheckCircle className="text-emerald-600" size={20} />
                                            <h4 className="font-bold text-slate-900"><T>Confirm Your Order</T></h4>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span className="text-slate-600"><T>Crop</T>:</span><span className="font-bold">{crop.name}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-600"><T>Quantity</T>:</span><span className="font-bold">{formatQuintalQuantity(quantity)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-600"><T>Delivery to</T>:</span><span className="font-bold text-right">{deliveryAddress.city}, {deliveryAddress.state}</span></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
                                {step > 1 && (
                                    <button onClick={() => setStep((s) => s - 1)} className="px-8 py-4 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors">
                                        <T>Back</T>
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button onClick={handleNext} className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all text-lg">
                                        <T>Continue</T>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleConfirmOrder}
                                        disabled={processing || bidRemaining === 'Expired' || !isPaymentValid}
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
