import React from 'react';
import { Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';

const statusColors = {
    Pending: 'bg-amber-100 text-amber-700',
    Accepted: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700',
};

const statusIcons = {
    Pending: Clock,
    Accepted: CheckCircle,
    Rejected: XCircle,
};

export default function AuctionLeaderboard({ bids = [] }) {
    const sorted = [...bids].sort((a, b) => b.amount - a.amount);

    if (!sorted.length) {
        return (
            <div className="text-center py-8 text-gray-400 text-sm">
                No bids placed yet
            </div>
        );
    }

    return (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {sorted.map((bid, idx) => {
                const Icon = statusIcons[bid.status] || Clock;
                return (
                    <div
                        key={bid._id || idx}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                            idx === 0 ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-white'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {idx === 0 && (
                                <Trophy className="w-5 h-5 text-amber-500" />
                            )}
                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    {bid.buyerId?.name || 'Buyer'}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {new Date(bid.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-900">
                                ₹{bid.amount?.toLocaleString('en-IN')}
                            </span>
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    statusColors[bid.status] || statusColors.Pending
                                }`}
                            >
                                <Icon className="w-3 h-3 inline mr-1" />
                                {bid.status}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
