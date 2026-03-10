import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import {
    Send,
    CheckCircle,
    XCircle,
    MessageSquare,
    Gavel,
    Clock3,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { T, useT } from '../context/TranslationContext';
import ChatBubble from './ChatBubble';
import BidInputForm from './BidInputForm';
import AuctionLeaderboard from './AuctionLeaderboard';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const getRemaining = (expiresAt) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}h ${m}m`;
};

const statusChipClass = {
    Pending: 'bg-amber-100 text-amber-700',
    Accepted: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-rose-100 text-rose-700',
    Completed: 'bg-blue-100 text-blue-700',
    Expired: 'bg-slate-200 text-slate-600',
};

export default function TradeRoom({ listingId, currentUserRole }) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const tr = useT();
    const [bids, setBids] = useState([]);
    const [messages, setMessages] = useState([]);
    const [bidStatusUpdate, setBidStatusUpdate] = useState(null);

    const [msgText, setMsgText] = useState('');
    const chatEndRef = useRef(null);
    const [crop, setCrop] = useState(null);

    const loadTradeData = useCallback(async () => {
        if (!listingId || !user?._id) return;

        try {
            const [bidRes, cropListRes] = await Promise.all([
                api.get(`/bids/${listingId}`),
                api.get('/crops'),
            ]);

            const bidList = bidRes.data || [];
            const cropRes = cropListRes.data.find?.((c) => c._id === listingId) || null;
            setBids(bidList);
            if (cropRes) setCrop(cropRes);

            const farmerId = cropRes?.farmer?._id || cropRes?.farmer;
            const latestBidBuyerId = bidList[0]?.buyerId?._id || bidList[0]?.buyerId;
            const conversationPeer = currentUserRole === 'Buyer' ? farmerId : latestBidBuyerId;

            const params = { listingId };
            if (conversationPeer) {
                params.user1 = user._id;
                params.user2 = conversationPeer;
            }

            const msgRes = await api.get('/messages/conversation', { params });
            setMessages(msgRes.data || []);
        } catch {
            // silent — data may not exist yet
        }
    }, [listingId, user?._id, currentUserRole]);

    useEffect(() => {
        loadTradeData();
    }, [loadTradeData]);

    useEffect(() => {
        if (!listingId || !user?._id) return;
        const id = setInterval(loadTradeData, 6000);
        return () => clearInterval(id);
    }, [listingId, user?._id, loadTradeData]);

    // Scroll chat on new message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Toast on bid status change
    useEffect(() => {
        if (!bidStatusUpdate) return;
        if (bidStatusUpdate.status === 'Accepted') toast.success(tr('Bid accepted!'));
        if (bidStatusUpdate.status === 'Rejected') toast.error(tr('Bid rejected'));
    }, [bidStatusUpdate]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!msgText.trim()) return;

        const farmerId = crop?.farmer?._id || crop?.farmer;
        const receiverId =
            currentUserRole === 'Buyer'
                ? farmerId
                : bids[0]?.buyerId?._id || bids[0]?.buyerId;

        if (!receiverId) {
            toast.error(tr('No recipient available for this conversation yet'));
            return;
        }

        api
            .post('/messages/send', {
                listingId,
                fromId: user._id,
                toId: receiverId,
                text: msgText.trim(),
            })
            .then((res) => {
                const created = res.data;
                setMessages((prev) => {
                    const exists = prev.some((m) => m._id === created._id);
                    return exists ? prev : [...prev, created];
                });
                setMsgText('');
            })
            .catch(() => {
                toast.error(tr('Failed to send message'));
            });
    };

    const handlePlaceBid = async (amount) => {
        try {
            const created = await api.post('/bids/place', {
                listingId,
                buyerId: user._id,
                amount,
                quantity: crop?.quantity,
            });

            setBids((prev) => {
                const exists = prev.some((b) => b._id === created.data._id);
                return exists ? prev : [created.data, ...prev];
            });
            toast.success(tr('Bid placed successfully'));
        } catch {
            toast.error(tr('Failed to place bid'));
        }
    };

    const handleUpdateBidStatus = async (bidId, status) => {
        try {
            const updated = await api.put(`/bids/${bidId}/status`, { status });
            setBidStatusUpdate(updated.data);
            setBids((prev) => prev.map((b) => (b._id === updated.data._id ? updated.data : b)));
        } catch {
            toast.error(tr('Failed to update bid status'));
        }
    };

    const highestBid = bids.length
        ? Math.max(...bids.map((b) => b.amount))
        : 0;

    const myAcceptedBid = bids.find(
        (b) => (b.buyerId?._id || b.buyerId) === user?._id && b.status === 'Accepted'
    );
    const acceptedRemaining = getRemaining(myAcceptedBid?.expiresAt);

    // ──────────────── BUYER VIEW ────────────────
    if (currentUserRole === 'Buyer') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Left — Leaderboard + Bid */}
                <div className="flex flex-col gap-4">
                    {myAcceptedBid && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-sm font-bold text-blue-700 flex items-center gap-2">
                                <Clock3 className="w-4 h-4" />
                                <T>Accepted bid ready for checkout</T>
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                <T>Time left</T>: {acceptedRemaining || 'N/A'}
                            </p>
                            <button
                                onClick={() =>
                                    navigate(`/buy/${listingId}`, {
                                        state: {
                                            crop,
                                            bid: myAcceptedBid,
                                        },
                                    })
                                }
                                disabled={acceptedRemaining === 'Expired'}
                                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold rounded-lg"
                            >
                                <T>Proceed to Payment</T>
                            </button>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-md p-5">
                        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-4">
                            <Gavel className="w-5 h-5 text-emerald-600" />
                            <T>Auction Leaderboard</T>
                        </h3>
                        <AuctionLeaderboard bids={bids} />
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-5">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            <T>Place Your Bid</T>
                        </h3>
                        <BidInputForm
                            minAmount={highestBid}
                            onPlaceBid={handlePlaceBid}
                        />
                    </div>
                </div>

                {/* Right — Chat */}
                <div className="bg-white rounded-xl shadow-md flex flex-col h-[600px]">
                    <div className="px-5 py-3 border-b border-gray-100">
                        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            <T>Price Negotiation</T>
                        </h3>
                        <p className="text-xs text-gray-400">
                            <T>Chat to agree on the best price</T>
                        </p>
                    </div>
                    <div className="flex-1 overflow-y-auto px-5 py-4">
                        {messages.map((m, i) => (
                            <ChatBubble
                                key={m._id || i}
                                text={m.text}
                                senderName={m.fromId?.name || m.senderId?.name || 'User'}
                                timestamp={m.createdAt}
                                isOwn={
                                    (m.fromId?._id || m.fromId || m.senderId?._id || m.senderId) ===
                                    user._id
                                }
                            />
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form
                        onSubmit={handleSendMessage}
                        className="px-5 py-3 border-t border-gray-100 flex gap-2"
                    >
                        <input
                            value={msgText}
                            onChange={(e) => setMsgText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                        />
                        <button
                            type="submit"
                            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ──────────────── FARMER VIEW ────────────────
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left — Bids with Accept / Reject */}
            <div className="bg-white rounded-xl shadow-md p-5 max-h-[600px] overflow-y-auto">
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <Gavel className="w-5 h-5 text-emerald-600" />
                    <T>Incoming Bids</T>
                </h3>
                {bids.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">
                        <T>No bids yet</T>
                    </p>
                ) : (
                    <div className="space-y-3">
                        {bids.map((bid, idx) => (
                            <div
                                key={bid._id || idx}
                                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {bid.buyerId?.name || 'Buyer'}
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">
                                        ₹{bid.amount?.toLocaleString('en-IN')}
                                        <span className="text-xs font-normal text-gray-400 ml-1">
                                            /quintal
                                        </span>
                                    </p>
                                </div>
                                {bid.status === 'Pending' ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleUpdateBidStatus(
                                                    bid._id,
                                                    'Accepted'
                                                )
                                            }
                                            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleUpdateBidStatus(
                                                    bid._id,
                                                    'Rejected'
                                                )
                                            }
                                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <span
                                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusChipClass[bid.status] || 'bg-slate-100 text-slate-600'}`}
                                    >
                                        {bid.status}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right — Chat Inbox */}
            <div className="bg-white rounded-xl shadow-md flex flex-col h-[600px]">
                <div className="px-5 py-3 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        Chat Inbox
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {messages.map((m, i) => (
                        <ChatBubble
                            key={m._id || i}
                            text={m.text}
                            senderName={m.fromId?.name || m.senderId?.name || 'User'}
                            timestamp={m.createdAt}
                            isOwn={
                                (m.fromId?._id || m.fromId || m.senderId?._id || m.senderId) === user._id
                            }
                        />
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <form
                    onSubmit={handleSendMessage}
                    className="px-5 py-3 border-t border-gray-100 flex gap-2"
                >
                    <input
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                        placeholder={tr('Type a message...')}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                    />
                    <button
                        type="submit"
                        className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
