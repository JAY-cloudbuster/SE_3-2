import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Calendar, DollarSign, Package } from 'lucide-react';
import { T } from '../../../context/TranslationContext';

/**
 * AuctionForm Component
 * Create new auction for a crop
 */
export default function AuctionForm({ crop, onSuccess }) {
    const [formData, setFormData] = useState({
        startingPrice: crop?.price || '',
        reservePrice: '',
        duration: 24, // hours
        quantity: crop?.quantity || '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const auction = {
            id: `auction_${Date.now()}`,
            cropId: crop.id,
            farmerId: crop.farmerId,
            farmerName: crop.farmerName,
            cropName: crop.name,
            startingPrice: Number(formData.startingPrice),
            currentBid: Number(formData.startingPrice),
            reservePrice: Number(formData.reservePrice),
            highestBidder: null,
            highestBidderName: null,
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + formData.duration * 3600000).toISOString(),
            status: 'active',
            bids: [],
            quantity: Number(formData.quantity),
        };

        // Save to localStorage
        const auctions = JSON.parse(localStorage.getItem('mockAuctions') || '[]');
        auctions.push(auction);
        localStorage.setItem('mockAuctions', JSON.stringify(auctions));

        setSubmitting(false);
        onSuccess?.(auction);
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Gavel className="text-purple-600" size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-900"><T>Create Auction</T></h3>
                    <p className="text-sm text-slate-500"><T>Set auction parameters</T></p>
                </div>
            </div>

            {/* Crop Info */}
            {crop && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <p className="text-sm font-bold text-emerald-900 mb-1">{crop.name}</p>
                    <p className="text-xs text-emerald-600">
                        <T>Available:</T> {crop.quantity}kg · <T>Quality:</T> {crop.quality}
                    </p>
                </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        <T>Starting Price (₹/kg)</T>
                    </label>
                    <input
                        type="number"
                        required
                        value={formData.startingPrice}
                        onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="25"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        <T>Reserve Price (₹/kg)</T>
                    </label>
                    <input
                        type="number"
                        required
                        value={formData.reservePrice}
                        onChange={(e) => setFormData({ ...formData, reservePrice: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="30"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                        <T>Minimum price you'll accept</T>
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        <T>Quantity (kg)</T>
                    </label>
                    <input
                        type="number"
                        required
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        placeholder="500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        <T>Auction Duration</T>
                    </label>
                    <select
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    >
                        <option value={1}>1 <T>hour</T></option>
                        <option value={6}>6 <T>hours</T></option>
                        <option value={12}>12 <T>hours</T></option>
                        <option value={24}>24 <T>hours</T></option>
                        <option value={48}>48 <T>hours</T></option>
                    </select>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting ? <T>Creating...</T> : <T>Start Auction</T>}
            </button>
        </motion.form>
    );
}
