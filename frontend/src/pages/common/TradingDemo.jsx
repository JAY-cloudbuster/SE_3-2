/**
 * @fileoverview Trading Features Demo Page for AgriSahayak Frontend
 * 
 * Interactive showcase of all trading features: Buy Now flow,
 * Negotiation Chat, Auction System, and Order Tracking.
 * Uses a tabbed selector to switch between demos. All data
 * is stored in localStorage for demonstration purposes.
 * 
 * Accessible at /demo/trading.
 * 
 * @component TradingDemo
 * @see Epic 4 - All Trading Features
 * @see TradeDashboard - Production trade page
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, MessageSquare, ShoppingCart, Package, Sparkles } from 'lucide-react';
import { T } from '../../context/TranslationContext';
import { mockCrops } from '../../data/mockTradingData';
import BuyNowButton from '../../features/trade/components/BuyNowButton';
import NegotiationChat from '../../features/trade/components/NegotiationChat';
import AuctionForm from '../../features/trade/components/AuctionForm';
import AuctionCard from '../../features/trade/components/AuctionCard';
import OrderTrackingCard from '../../features/trade/components/OrderTrackingCard';

export default function TradingDemo() {
    const [activeDemo, setActiveDemo] = useState('buynow');
    const sampleCrop = mockCrops[0];
    const sampleAuction = {
        id: 'demo_auction',
        cropName: 'Organic Wheat',
        farmerName: 'Demo Farmer',
        startingPrice: 20,
        currentBid: 24,
        highestBidder: 'buyer_1',
        highestBidderName: 'Demo Buyer',
        endTime: new Date(Date.now() + 3600000).toISOString(),
        status: 'active',
        bids: [{ bidderId: 'buyer_1', bidderName: 'Demo Buyer', amount: 24, timestamp: new Date().toISOString() }],
        quantity: 500,
    };
    const sampleOrder = {
        id: 'demo_order',
        cropName: 'Basmati Rice',
        quantity: 500,
        pricePerKg: 42,
        totalAmount: 21000,
        status: 'shipped',
        timeline: [
            { status: 'placed', timestamp: new Date(Date.now() - 172800000).toISOString(), note: 'Order placed' },
            { status: 'confirmed', timestamp: new Date(Date.now() - 169200000).toISOString(), note: 'Farmer confirmed' },
            { status: 'shipped', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Order shipped' },
        ],
    };

    const demos = [
        { id: 'buynow', label: 'Buy Now Flow', icon: ShoppingCart, color: 'emerald' },
        { id: 'negotiation', label: 'Negotiation Chat', icon: MessageSquare, color: 'blue' },
        { id: 'auction', label: 'Auction System', icon: Gavel, color: 'purple' },
        { id: 'tracking', label: 'Order Tracking', icon: Package, color: 'orange' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="text-emerald-600" size={32} />
                        <h1 className="text-5xl font-black text-slate-900">
                            <T>Trading Features Demo</T>
                        </h1>
                    </div>
                    <p className="text-lg text-slate-600">
                        <T>Explore all trading and transaction features</T>
                    </p>
                </motion.div>

                {/* Demo Selector */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {demos.map((demo) => {
                        const Icon = demo.icon;
                        return (
                            <motion.button
                                key={demo.id}
                                onClick={() => setActiveDemo(demo.id)}
                                className={`p-6 rounded-2xl border-2 transition-all ${activeDemo === demo.id
                                    ? `border-${demo.color}-500 bg-${demo.color}-50 shadow-lg`
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Icon
                                    className={activeDemo === demo.id ? `text-${demo.color}-600` : 'text-slate-400'}
                                    size={32}
                                />
                                <p className={`mt-3 font-bold ${activeDemo === demo.id ? `text-${demo.color}-900` : 'text-slate-700'}`}>
                                    <T>{demo.label}</T>
                                </p>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Demo Content */}
                <motion.div
                    key={activeDemo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl p-8"
                >
                    {/* Buy Now Demo */}
                    {activeDemo === 'buynow' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-slate-900 mb-4">
                                <T>Buy Now Flow</T>
                            </h2>
                            <p className="text-slate-600 mb-6">
                                <T>Quick purchase with 3-step checkout: quantity selection, delivery address, and confirmation</T>
                            </p>
                            <div className="max-w-md">
                                <div className="bg-slate-50 rounded-2xl p-6 mb-4">
                                    <img src={sampleCrop.image} alt={sampleCrop.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                                    <h3 className="font-bold text-xl mb-2">{sampleCrop.name}</h3>
                                    <p className="text-sm text-slate-600 mb-4">{sampleCrop.description}</p>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-black text-emerald-600">₹{sampleCrop.price}/kg</span>
                                        <span className="text-sm text-slate-500">{sampleCrop.quantity}kg available</span>
                                    </div>
                                </div>
                                <BuyNowButton
                                    crop={sampleCrop}
                                    onOrderComplete={(order) => console.log('Order placed:', order)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Negotiation Demo */}
                    {activeDemo === 'negotiation' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-slate-900 mb-4">
                                <T>Negotiation Chat</T>
                            </h2>
                            <p className="text-slate-600 mb-6">
                                <T>WhatsApp-style chat with price proposals, accept/reject/counter actions</T>
                            </p>
                            <NegotiationChat
                                negotiationId="neg_1"
                                currentUserId="buyer_1"
                                currentUserRole="buyer"
                            />
                        </div>
                    )}

                    {/* Auction Demo */}
                    {activeDemo === 'auction' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-slate-900 mb-4">
                                <T>Auction System</T>
                            </h2>
                            <p className="text-slate-600 mb-6">
                                <T>Create auctions and place bids with live countdown timer</T>
                            </p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-4"><T>Create Auction</T></h3>
                                    <AuctionForm
                                        crop={sampleCrop}
                                        onSuccess={(auction) => console.log('Auction created:', auction)}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-4"><T>Active Auction</T></h3>
                                    <AuctionCard
                                        auction={sampleAuction}
                                        onBidClick={(a) => console.log('Bid on:', a)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tracking Demo */}
                    {activeDemo === 'tracking' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black text-slate-900 mb-4">
                                <T>Order Tracking</T>
                            </h2>
                            <p className="text-slate-600 mb-6">
                                <T>Track order status with visual timeline</T>
                            </p>
                            <div className="max-w-2xl">
                                <OrderTrackingCard order={sampleOrder} />
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white text-center"
                >
                    <p className="font-bold mb-2">
                        <T>All data is stored in localStorage for demo purposes</T>
                    </p>
                    <p className="text-sm text-emerald-100">
                        <T>Visit /trade to see the unified Trade Dashboard with all features</T>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
