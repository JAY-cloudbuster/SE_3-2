import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../../context/TranslationContext';

/**
 * NegotiateButton Component
 * Navigates to dedicated negotiation page
 * 
 * Props:
 * - crop: Crop object with details
 * - currentUserId: ID of current user
 * - currentUserRole: 'buyer' or 'farmer'
 */
export default function NegotiateButton({ crop, currentUserId = 'buyer_1', currentUserRole = 'buyer' }) {
    const navigate = useNavigate();

    const handleOpenNegotiation = () => {
        // Check if negotiation already exists for this crop
        const negotiations = JSON.parse(localStorage.getItem('mockNegotiations') || '[]');
        const existingNeg = negotiations.find(
            n => n.cropId === crop.id && n.buyerId === currentUserId
        );

        if (existingNeg) {
            // Navigate to existing negotiation
            navigate(`/negotiation/${existingNeg.id}`, { state: { crop } });
        } else {
            // Navigate to new negotiation (will be created on page)
            navigate(`/negotiation/new`, { state: { crop } });
        }
    };

    return (
        <motion.button
            onClick={handleOpenNegotiation}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <MessageSquare size={20} />
            <span><T>Negotiate Price</T></span>
        </motion.button>
    );
}
