import React, { useState } from 'react';
import { IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BidInputForm({ onPlaceBid, minAmount = 0 }) {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const numVal = Number(amount);
        if (!numVal || numVal <= 0) {
            toast.error('Enter a valid bid amount');
            return;
        }
        if (numVal > 10000) {
            toast.error('Bid cannot exceed ₹10,000/quintal');
            return;
        }
        if (numVal <= minAmount) {
            toast.error(`Bid must be higher than ₹${minAmount}`);
            return;
        }
        onPlaceBid(numVal);
        setAmount('');
        toast.success('Bid placed!');
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="relative flex-1">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="number"
                    min="1"
                    max="10000"
                    step="1"
                    value={amount}
                    onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v <= 10000) setAmount(e.target.value);
                    }}
                    placeholder="Enter bid (₹/quintal)"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                />
            </div>
            <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors shadow-md"
            >
                Place Bid
            </button>
        </form>
    );
}
