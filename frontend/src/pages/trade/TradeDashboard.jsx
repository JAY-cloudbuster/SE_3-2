import React, { useState, useEffect, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Gavel, MessageSquare, Package, ArrowLeft, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { T, useT } from '../../context/TranslationContext';
import { formatQuintalRate, formatQuintalQuantity } from '../../utils/formatters';
import { AuthContext } from '../../context/AuthContext';
import { cropService } from '../../services/cropService';
import { tradeService } from '../../services/tradeService';
import AuctionCard from '../../features/trade/components/AuctionCard';
import TradeRoom from '../../components/TradeRoom';

export default function TradeDashboard() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const tr = useT();
    const [activeTab, setActiveTab] = useState('auctions');
    const [listings, setListings] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [selectedNegotiationListing, setSelectedNegotiationListing] = useState(null);

    const dashboardRoute =
        user?.role === 'BUYER' ? '/dashboard/buyer' : '/dashboard/farmer';

    const loadTradeData = async () => {
        try {
            const [listingRes, orderRes] = await Promise.all([
                cropService.getAll(),
                tradeService.getOrders(),
            ]);
            setListings(listingRes.data || []);
            setOrders(orderRes.data || []);
        } catch {
            toast.error(tr('Unable to load trade dashboard data'));
        }
    };

    useEffect(() => {
        loadTradeData();
    }, []);

    const auctions = useMemo(
        () =>
            listings.map((listing) => {
                const created = listing.createdAt ? new Date(listing.createdAt) : new Date();
                const endTime = new Date(created.getTime() + 6 * 60 * 60 * 1000);
                return {
                    id: listing._id,
                    cropName: listing.name,
                    farmerName: listing.farmer?.name || 'Farmer',
                    endTime: endTime.toISOString(),
                    currentBid: listing.price,
                    startingPrice: listing.price,
                    quantity: listing.quantity,
                    bids: [],
                    highestBidder: null,
                    highestBidderName: null,
                };
            }),
        [listings]
    );

    const handleCancelOrder = async (orderId) => {
        try {
            await tradeService.updateOrderStatus(orderId, { status: 'Cancelled' });
            setOrders((prev) =>
                prev.map((o) =>
                    (o._id || o.id) === orderId ? { ...o, status: 'Cancelled' } : o
                )
            );
            toast.success(tr('Order cancelled'));
        } catch {
            toast.error(tr('Failed to cancel order'));
        }
    };

    const tabs = [
        { id: 'auctions', label: 'Active Auctions', icon: Gavel, count: auctions.length },
        {
            id: 'negotiations',
            label: 'Negotiations',
            icon: MessageSquare,
            count: listings.length,
        },
        { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
    ];

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
                            <span><T>Back to Dashboard</T></span>
                        </button>
                        <div className="text-center">
                            <h1 className="text-2xl font-black text-slate-900"><T>Trade Dashboard</T></h1>
                            <p className="text-sm text-slate-500"><T>Manage your trading activities</T></p>
                        </div>
                        <button
                            onClick={() => navigate('/marketplace')}
                            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-bold transition-colors"
                        >
                            <T>Marketplace</T>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Gavel size={32} />
                            <span className="text-3xl font-black">{auctions.length}</span>
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
                            <span className="text-3xl font-black">{listings.length}</span>
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
                            <span className="text-3xl font-black">{orders.length}</span>
                        </div>
                        <p className="text-blue-100 text-sm font-bold"><T>Total Orders</T></p>
                    </motion.div>
                </div>

                <div className="flex gap-2 border-b-2 border-slate-200">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSelectedAuction(null);
                                    setSelectedNegotiationListing(null);
                                }}
                                className={`flex items-center gap-2 px-6 py-3 font-bold transition-all relative ${
                                    activeTab === tab.id
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

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'auctions' && (
                            <>
                                {selectedAuction ? (
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setSelectedAuction(null)}
                                            className="flex items-center gap-2 text-sm text-emerald-600 font-bold hover:underline"
                                        >
                                            <ArrowLeft size={16} /> <T>Back to auctions</T>
                                        </button>
                                        <TradeRoom
                                            listingId={selectedAuction.id}
                                            currentUserRole={user?.role === 'FARMER' ? 'Farmer' : 'Buyer'}
                                        />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {auctions.length === 0 ? (
                                            <div className="col-span-full text-center py-12">
                                                <Gavel className="mx-auto text-slate-300 mb-4" size={64} />
                                                <p className="text-slate-500"><T>No active auctions</T></p>
                                            </div>
                                        ) : (
                                            auctions.map((auction) => (
                                                <AuctionCard
                                                    key={auction.id}
                                                    auction={auction}
                                                    onBidClick={() => setSelectedAuction(auction)}
                                                />
                                            ))
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'negotiations' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    {listings.length === 0 ? (
                                        <div className="text-center py-12">
                                            <MessageSquare className="mx-auto text-slate-300 mb-4" size={64} />
                                            <p className="text-slate-500"><T>No negotiations</T></p>
                                        </div>
                                    ) : (
                                        listings.map((listing) => (
                                            <button
                                                key={listing._id}
                                                onClick={() => setSelectedNegotiationListing(listing)}
                                                className={`w-full text-left bg-white rounded-xl p-5 border-2 transition-all ${
                                                    selectedNegotiationListing?._id === listing._id
                                                        ? 'border-emerald-500 shadow-lg'
                                                        : 'border-slate-200 hover:border-emerald-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-slate-900">{listing.name}</h3>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">
                                                        <T>ACTIVE</T>
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1">{listing.farmer?.name || 'Farmer'}</p>
                                                <p className="text-sm text-emerald-600 font-bold mt-2">{formatQuintalRate(listing.price)}</p>
                                            </button>
                                        ))
                                    )}
                                </div>

                                <div>
                                    {selectedNegotiationListing ? (
                                        <TradeRoom
                                            listingId={selectedNegotiationListing._id}
                                            currentUserRole={user?.role === 'FARMER' ? 'Farmer' : 'Buyer'}
                                        />
                                    ) : (
                                        <div className="bg-slate-50 rounded-2xl h-[600px] flex items-center justify-center border-2 border-dashed border-slate-300">
                                            <p className="text-slate-400"><T>Select a negotiation to open chat</T></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {orders.length === 0 ? (
                                    <div className="col-span-full text-center py-12">
                                        <Package className="mx-auto text-slate-300 mb-4" size={64} />
                                        <p className="text-slate-500"><T>No orders yet</T></p>
                                    </div>
                                ) : (
                                    orders.map((order) => {
                                        const id = order._id || order.id;
                                        const item = order.items?.[0];
                                        return (
                                            <div key={id} className="bg-white rounded-xl shadow-md p-6 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-bold text-lg text-gray-900">{item?.name || order.cropName || 'Crop'}</h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                            order.status === 'Delivered'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : order.status === 'Cancelled'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                    >
                                                        {order.status || 'Pending'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400">Order ID: {id}</p>
                                                <div className="grid grid-cols-3 gap-2 text-sm">
                                                    <div>
                                                        <p className="text-gray-400">Quantity</p>
                                                        <p className="font-bold">{formatQuintalQuantity(item?.quantity || order.quantity)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400">Price/quintal</p>
                                                        <p className="font-bold">{formatQuintalRate(item?.pricePerKg || order.pricePerUnit)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400">Total</p>
                                                        <p className="font-bold text-emerald-600">₹{(order.totalAmount || item?.total || 0).toLocaleString('en-IN')}</p>
                                                    </div>
                                                </div>
                                                {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                                    <button
                                                        onClick={() => handleCancelOrder(id)}
                                                        className="flex items-center gap-1 text-sm text-red-600 font-semibold hover:text-red-700 mt-2"
                                                    >
                                                        <XCircle size={14} />
                                                        <T>Cancel Order</T>
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
