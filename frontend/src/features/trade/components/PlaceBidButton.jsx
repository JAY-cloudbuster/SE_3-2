/**
 * @fileoverview Place Bid Button Component for Auction-Enabled Crops
 *
 * Opens an inline bid form allowing a buyer to enter a bid amount
 * and submit it via the tradeService API. Calls onBidPlaced callback
 * with the returned bid on success.
 *
 * @component PlaceBidButton
 * @param {Object} props
 * @param {Object} props.crop   - Crop data (id/cropId, name, price)
 * @param {Function} [props.onBidPlaced] - Callback after successful bid
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, X, Check } from 'lucide-react';
import { T } from '../../../context/TranslationContext';
import { tradeService } from '../../../services/tradeService';
import toast from 'react-hot-toast';

export default function PlaceBidButton({ crop, onBidPlaced }) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const cropId = crop._id || crop.id;
    const minBid = (crop.price || 0) + 1;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const bid = Number(amount);
        if (!bid || bid <= (crop.price || 0)) {
            toast.error(`Bid must be higher than ₹${crop.price}/quintal`);
            return;
        }
        setLoading(true);
        try {
            const res = await tradeService.placeBid({ cropId, amount: bid });
            toast.success('Bid placed successfully!');
            setOpen(false);
            setAmount('');
            if (onBidPlaced) onBidPlaced(res.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to place bid');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {!open ? (
                <motion.button
                    onClick={() => setOpen(true)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Gavel size={18} />
                    <span><T>Place Bid</T></span>
                </motion.button>
            ) : (
                <AnimatePresence>
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                    >
                        <div className="flex items-center gap-1">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min={minBid}
                                    placeholder={`Min ₹${minBid}`}
                                    className="w-full pl-7 pr-3 py-2.5 border-2 border-amber-300 rounded-xl text-sm font-bold focus:outline-none focus:border-amber-500 bg-amber-50"
                                    autoFocus
                                />
                            </div>
                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="bg-amber-500 hover:bg-amber-600 text-white p-2.5 rounded-xl disabled:opacity-60 shadow"
                                whileTap={{ scale: 0.95 }}
                            >
                                <Check size={18} />
                            </motion.button>
                            <motion.button
                                type="button"
                                onClick={() => { setOpen(false); setAmount(''); }}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-600 p-2.5 rounded-xl shadow"
                                whileTap={{ scale: 0.95 }}
                            >
                                <X size={18} />
                            </motion.button>
                        </div>
                        <p className="text-[10px] text-amber-700 font-medium text-center">
                            Current price: ₹{crop.price}/quintal — bid higher to win
                        </p>
                    </motion.form>
                </AnimatePresence>
            )}
        </div>
    );
}
