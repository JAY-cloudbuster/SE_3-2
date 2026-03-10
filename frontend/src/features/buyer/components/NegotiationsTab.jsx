/**
 * @fileoverview Negotiations Tab for Buyer Dashboard
 *
 * Shows all negotiations the buyer has started, with their status
 * and a link to re-open the negotiation chat.
 *
 * @component NegotiationsTab
 * @param {Object}  props
 * @param {number}  [props.refreshTrigger=0] - Increment to force data reload
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../../context/TranslationContext';
import { tradeService } from '../../../services/tradeService';
import toast from 'react-hot-toast';

const STATUS_META = {
    active:    { label: 'Active',    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',   icon: Clock },
    accepted:  { label: 'Accepted',  color: 'bg-blue-100 text-blue-700 border-blue-200',            icon: CheckCircle },
    rejected:  { label: 'Rejected',  color: 'bg-red-100 text-red-700 border-red-200',               icon: XCircle },
    cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-500 border-slate-200',         icon: XCircle },
};

function NegotiationCard({ neg }) {
    const navigate = useNavigate();
    const crop   = neg.crop    || {};
    const farmer = neg.farmer  || {};
    const meta   = STATUS_META[neg.status] || STATUS_META.active;
    const Icon   = meta.icon;

    const lastMessage = neg.messages?.at(-1);

    return (
        <motion.div
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 space-y-4 cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/negotiation/${crop._id || crop.id}`, { state: { crop } })}
            whileHover={{ y: -2 }}
        >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <MessageSquare className="text-blue-600" size={20} />
                    </div>
                    <div>
                        <p className="font-black text-slate-800 text-base leading-tight">
                            {crop.name || 'Crop'}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Farmer: <span className="font-bold text-slate-700">{farmer.name || '—'}</span>
                        </p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${meta.color}`}>
                    <Icon size={11} />{meta.label}
                </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                    <span className="text-slate-400">Listed Price</span>
                    <p className="font-bold text-emerald-600">₹{crop.price}/quintal</p>
                </div>
                {neg.finalPrice && (
                    <div>
                        <span className="text-slate-400">Agreed Price</span>
                        <p className="font-bold text-emerald-700">₹{neg.finalPrice}/quintal</p>
                    </div>
                )}
                <div className="col-span-2">
                    <span className="text-slate-400">Last Activity</span>
                    <p className="font-bold text-slate-700">
                        {neg.lastActivity
                            ? new Date(neg.lastActivity).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                            : neg.updatedAt
                                ? new Date(neg.updatedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                                : '—'}
                    </p>
                </div>
            </div>

            {/* Last message preview */}
            {lastMessage && (
                <div className="text-xs bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Last message</span>
                    <p className="text-slate-700 font-medium line-clamp-2">{lastMessage.content}</p>
                </div>
            )}

            {/* CTA */}
            {neg.status === 'active' && (
                <div className="pt-1">
                    <div className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-xl text-center transition-colors">
                        Continue Negotiation →
                    </div>
                </div>
            )}
            {neg.status === 'accepted' && !neg.orderCreated && (
                <div className="pt-1">
                    <div className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl text-center transition-colors">
                        Proceed to Payment →
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default function NegotiationsTab({ refreshTrigger = 0 }) {
    const [negotiations, setNegotiations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await tradeService.getMyNegotiations();
                setNegotiations(res.data || []);
            } catch {
                toast.error('Failed to load negotiations');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [refreshTrigger]);

    return (
        <div className="space-y-6">
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-52 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            )}

            {!loading && negotiations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Package size={48} className="mb-4 opacity-40" />
                    <p className="font-bold text-lg"><T>No negotiations yet</T></p>
                    <p className="text-sm mt-1">
                        <T>Use the Negotiate Price button on any crop listing to start</T>
                    </p>
                </div>
            )}

            {!loading && negotiations.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {negotiations.map((neg) => (
                        <NegotiationCard key={neg._id} neg={neg} />
                    ))}
                </div>
            )}
        </div>
    );
}
