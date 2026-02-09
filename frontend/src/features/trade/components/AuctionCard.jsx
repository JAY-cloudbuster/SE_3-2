import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Users, Gavel } from 'lucide-react';
import { T } from '../../../context/TranslationContext';

/**
 * AuctionCard Component
 * Display auction with countdown timer and bidding info
 */
export default function AuctionCard({ auction, onBidClick }) {
    const [timeLeft, setTimeLeft] = useState('');

    // Calculate time remaining
    useEffect(() => {
        const updateTimer = () => {
            const end = new Date(auction.endTime);
            const now = new Date();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft('Ended');
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [auction.endTime]);

    const isEnded = timeLeft === 'Ended';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-purple-200 hover:border-purple-400 transition-all"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">{auction.cropName}</h3>
                        <p className="text-sm text-purple-100">
                            <T>by</T> {auction.farmerName}
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Gavel size={24} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Timer */}
                <div className="flex items-center justify-between bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-2">
                        <Clock className="text-purple-600" size={20} />
                        <span className="text-sm font-bold text-purple-900">
                            {isEnded ? <T>Auction Ended</T> : <T>Time Left</T>}
                        </span>
                    </div>
                    <span className={`text-lg font-black ${isEnded ? 'text-red-600' : 'text-purple-600'}`}>
                        {timeLeft}
                    </span>
                </div>

                {/* Current Bid */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600"><T>Current Bid</T></span>
                        <div className="flex items-center gap-1 text-emerald-600">
                            <TrendingUp size={16} />
                            <span className="text-2xl font-black">₹{auction.currentBid}</span>
                            <span className="text-sm font-bold">/kg</span>
                        </div>
                    </div>

                    {auction.highestBidder && (
                        <p className="text-xs text-slate-500">
                            <T>Highest bidder:</T> {auction.highestBidderName}
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1"><T>Starting Price</T></p>
                        <p className="text-lg font-bold text-slate-900">₹{auction.startingPrice}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500 mb-1"><T>Quantity</T></p>
                        <p className="text-lg font-bold text-slate-900">{auction.quantity}kg</p>
                    </div>
                </div>

                {/* Bid Count */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users size={16} />
                    <span>
                        {auction.bids?.length || 0} <T>bids placed</T>
                    </span>
                </div>

                {/* Action Button */}
                {!isEnded && (
                    <button
                        onClick={() => onBidClick?.(auction)}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
                    >
                        <T>Place Bid</T>
                    </button>
                )}

                {isEnded && auction.highestBidder && (
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center">
                        <p className="text-sm font-bold text-emerald-900">
                            <T>Winner:</T> {auction.highestBidderName}
                        </p>
                        <p className="text-xs text-emerald-600 mt-1">
                            <T>Winning bid:</T> ₹{auction.currentBid}/kg
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
