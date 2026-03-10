/**
 * @fileoverview Farmer Negotiations Inbox Page
 *
 * Shows all active buyer conversations for the farmer, grouped by crop.
 * Fetches from GET /api/bidmessage/inbox which returns each unique
 * buyer-crop pair with the last message and timestamp.
 * Clicking a conversation opens the NegotiationPage for that crop.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    MessageSquare, RefreshCw, PackageOpen,
    Clock, ChevronRight, User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { T } from '../../context/TranslationContext';
import api from '../../services/api';

function timeAgo(date) {
    if (!date) return '';
    const secs = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (secs < 60) return 'just now';
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
    if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function ConversationCard({ conv, onClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex items-center gap-4 cursor-pointer group"
        >
            {/* Crop image / avatar */}
            <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-emerald-50 flex items-center justify-center">
                {conv.cropImage
                    ? <img src={conv.cropImage} alt={conv.cropName} className="w-full h-full object-cover" />
                    : <PackageOpen size={22} className="text-emerald-400" />
                }
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className="font-black text-slate-800 truncate">{conv.cropName}</p>
                    <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock size={10} />
                        {timeAgo(conv.lastTime)}
                    </span>
                </div>
                <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <User size={10} className="text-slate-400" />
                    <span className="font-semibold text-slate-700">{conv.buyerName}</span>
                </p>
                <p className="text-xs text-slate-400 truncate mt-1 italic">"{conv.lastMessage}"</p>
            </div>

            {/* Unread badge + caret */}
            <div className="shrink-0 flex items-center gap-2">
                {conv.unreadCount > 0 && (
                    <span className="min-w-[22px] h-[22px] bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                    </span>
                )}
                <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
        </motion.div>
    );
}

export default function FarmerNegotiationsPage() {
    const navigate = useNavigate();
    const [inbox, setInbox] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchInbox = useCallback(async (showSpinner = false) => {
        if (showSpinner) setRefreshing(true);
        try {
            const res = await api.get('/bidmessage/inbox');
            setInbox(res.data || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load conversations');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchInbox();
        // Auto-refresh every 10 seconds
        const interval = setInterval(() => fetchInbox(), 10000);
        return () => clearInterval(interval);
    }, [fetchInbox]);

    const openConversation = (conv) => {
        // Navigate to NegotiationPage for this crop so TradeRoom loads
        navigate(`/negotiation/${conv.listingId}`, {
            state: {
                crop: {
                    _id: conv.listingId,
                    name: conv.cropName,
                    image: conv.cropImage,
                    // NegotiationPage also accepts the full crop via REST fallback
                },
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare className="text-blue-600" size={24} />
                    <h2 className="text-2xl font-black text-slateald-900">
                        <T>Buyer Negotiations</T>
                    </h2>
                </div>
                <button
                    onClick={() => fetchInbox(true)}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                    <T>Refresh</T>
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="grid gap-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass-card p-5 animate-pulse flex gap-4">
                            <div className="w-14 h-14 rounded-xl bg-slate-200 shrink-0" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 w-32 bg-slate-200 rounded" />
                                <div className="h-3 w-48 bg-slate-100 rounded" />
                                <div className="h-3 w-56 bg-slate-100 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && inbox.length === 0 && (
                <div className="glass-card p-12 text-center">
                    <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="font-black text-slate-600 mb-1"><T>No conversations yet</T></h3>
                    <p className="text-sm text-slate-400">
                        <T>When buyers start negotiating on your crops, they will appear here</T>
                    </p>
                </div>
            )}

            {/* Conversation list */}
            {!loading && inbox.length > 0 && (
                <div className="grid gap-3">
                    <p className="text-xs text-slate-400 font-medium">
                        {inbox.length} <T>active conversation{inbox.length !== 1 ? 's' : ''}</T>
                    </p>
                    {inbox.map((conv, i) => (
                        <ConversationCard
                            key={`${conv.listingId}-${conv.buyerId}-${i}`}
                            conv={conv}
                            onClick={() => openConversation(conv)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
