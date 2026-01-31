import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap } from 'lucide-react';
import { T } from '../../../context/TranslationContext';
import OrderSummaryModal from './OrderSummaryModal';

/**
 * BuyNowButton Component
 * Quick purchase button for crops
 * 
 * Props:
 * - crop: Crop object with details
 * - onOrderComplete: Callback when order is placed
 */
export default function BuyNowButton({ crop, onOrderComplete }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <motion.button
                onClick={() => setShowModal(true)}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Zap size={20} className="fill-white" />
                <span><T>Buy Now</T></span>
            </motion.button>

            {showModal && (
                <OrderSummaryModal
                    crop={crop}
                    onClose={() => setShowModal(false)}
                    onConfirm={(orderData) => {
                        setShowModal(false);
                        onOrderComplete?.(orderData);
                    }}
                />
            )}
        </>
    );
}
