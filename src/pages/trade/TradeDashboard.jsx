import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, MessageSquare, Package, CheckCircle, TrendingUp } from 'lucide-react';
import { T } from '../../context/TranslationContext';
import { getTradingData, initializeTradingData } from '../../data/mockTradingData';
import AuctionCard from '../../features/trade/components/AuctionCard';
import NegotiationChat from '../../features/trade/components/NegotiationChat';
import OrderTrackingCard from '../../features/trade/components/OrderTrackingCard';

/**
 * TradeDashboard Component
 * Unified view of all trading activities
 */
export default function TradeDashboard() {
    const [activeTab, setActiveTab] = useState('auctions');
    const [tradingData, setTradingData] = useState({
        auctions: [],
        negotiations: [],
        orders: [],
    });
    const [selectedNegotiation, setSelectedNegotiation] = useState(null);

    // Load data
    useEffect(() => {
        initializeTradingData();
        const data = getTradingData();
        setTradingData({
            auctions: data.auctions.filter(a => a.status === 'active'),
            negotiations: data.negotiations,
            orders: data.orders,
        });
    }, []);

    const tabs = [
        { id: 'auctions', label: 'Active Auctions', icon: Gavel, count: tradingData.auctions.length },
        { id: 'negotiations', label: 'Negotiations', icon: MessageSquare, count: tradingData.negotiations.length },
        { id: 'orders', label: 'My Orders', icon: Package, count: tradingData.orders.length },
    ];

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-black text-slate-900 mb-2">
                    <T>Trade Dashboard</T>
                </h1>
                <p className="text-slate-600">
                    <T>Manage your auctions, negotiations, and orders</T>
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Gavel size={32} />
                        <span className="text-3xl font-black">{tradingData.auctions.length}</span>
                    </div>
                    <p className="text-purple-100 text-sm font-bold"><T>Active Auctions</T></p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
                >
                    <div className="flex items-center justify-between mb-4">
                        <MessageSquare size={32} />
                        <span className="text-3xl font-black">{tradingData.negotiations.length}</span>
                    </div>
                    <p className="text-emerald-100 text-sm font-bold"><T>Ongoing Negotiations</T></p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
                >
                    <div className="flex items-center justify-between mb-4">
                        <Package size={32} />
                        <span className="text-3xl font-black">{tradingData.orders.length}</span>
                    </div>
                    <p className="text-blue-100 text-sm font-bold"><T>Total Orders</T></p>
                </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b-2 border-slate-200">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 font-bold transition-all relative ${activeTab === tab.id
                                    ? 'text-emerald-600'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Icon size={20} />
                            <span><T>{tab.label}</T></span>
                            {tab.count > 0 && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                    {tab.count}
                                </span>
                            )}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Auctions Tab */}
                    {activeTab === 'auctions' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tradingData.auctions.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <Gavel className="mx-auto text-slate-300 mb-4" size={64} />
                                    <p className="text-slate-500"><T>No active auctions</T></p>
                                </div>
                            ) : (
                                tradingData.auctions.map((auction) => (
                                    <AuctionCard
                                        key={auction.id}
                                        auction={auction}
                                        onBidClick={(a) => console.log('Bid on', a)}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {/* Negotiations Tab */}
                    {activeTab === 'negotiations' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Negotiation List */}
                            <div className="space-y-4">
                                {tradingData.negotiations.length === 0 ? (
                                    <div className="text-center py-12">
                                        <MessageSquare className="mx-auto text-slate-300 mb-4" size={64} />
                                        <p className="text-slate-500"><T>No negotiations</T></p>
                                    </div>
                                ) : (
                                    tradingData.negotiations.map((neg) => (
                                        <motion.div
                                            key={neg.id}
                                            onClick={() => setSelectedNegotiation(neg)}
                                            className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${selectedNegotiation?.id === neg.id
                                                    ? 'border-emerald-500 shadow-lg'
                                                    : 'border-slate-200 hover:border-emerald-300'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="font-bold text-lg">{neg.farmerName}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${neg.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                                        neg.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    <T>{neg.status}</T>
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-2">
                                                {neg.messages[neg.messages.length - 1]?.content}
                                            </p>
                                            {neg.currentOffer && (
                                                <div className="flex items-center gap-2 text-emerald-600">
                                                    <TrendingUp size={16} />
                                                    <span className="font-bold">₹{neg.currentOffer.price}/kg</span>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Chat View */}
                            <div>
                                {selectedNegotiation ? (
                                    <NegotiationChat
                                        negotiationId={selectedNegotiation.id}
                                        currentUserId="buyer_1"
                                        currentUserRole="buyer"
                                    />
                                ) : (
                                    <div className="bg-slate-50 rounded-2xl h-[600px] flex items-center justify-center border-2 border-dashed border-slate-300">
                                        <p className="text-slate-400"><T>Select a negotiation to view chat</T></p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {tradingData.orders.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <Package className="mx-auto text-slate-300 mb-4" size={64} />
                                    <p className="text-slate-500"><T>No orders yet</T></p>
                                </div>
                            ) : (
                                tradingData.orders.map((order) => (
                                    <OrderTrackingCard key={order.id} order={order} />
                                ))
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
