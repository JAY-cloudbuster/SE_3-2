/**
 * @fileoverview Buy Now Button Component for AgriSahayak Trade System
 * 
 * Quick purchase button that navigates to the standalone payment page
 * (/buy/:cropId) with crop data. Rendered inside CropActionButtons
 * and CropCard components throughout the marketplace.
 * 
 * @component BuyNowButton
 * @param {Object} props
 * @param {Object} props.crop - Crop data (id, name, price, etc.)
 * @param {Function} [props.onOrderComplete] - Legacy callback (unused, kept for compatibility)
 * 
 * @see Epic 4, Story 4.5 - Buy Now (Instant Purchase)
 * @see BuyNowPaymentPage - Destination page for checkout
 * @see CropActionButtons - Parent component that renders this button
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../../context/TranslationContext';

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
