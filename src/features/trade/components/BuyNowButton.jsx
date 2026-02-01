import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../../context/TranslationContext';

/**
 * BuyNowButton Component
 * Quick purchase button for crops - navigates to standalone payment page
 * 
 * Props:
 * - crop: Crop object with details
 * - onOrderComplete: Callback when order is placed (optional, for backwards compatibility)
 */
export default function BuyNowButton({ crop, onOrderComplete }) {
    const navigate = useNavigate();

    const handleBuyNow = () => {
        // Navigate to standalone payment page with crop data
        navigate(`/buy/${crop.id}`, { state: { crop } });
    };

    return (
        <motion.button
            onClick={handleBuyNow}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Zap size={20} className="fill-white" />
            <span><T>Buy Now</T></span>
        </motion.button>
    );
}
