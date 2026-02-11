/**
 * @fileoverview Negotiate Button Component for AgriSahayak Trade System
 * 
 * Button that navigates to the standalone negotiation page. Checks
 * localStorage for an existing negotiation on the crop; if found,
 * navigates to it, otherwise opens /negotiation/new with crop state.
 * 
 * @component NegotiateButton
 * @param {Object} props
 * @param {Object} props.crop - Crop data (id, name, price, etc.)
 * @param {string} [props.currentUserId='buyer_1'] - Current user identifier
 * @param {string} [props.currentUserRole='buyer'] - 'buyer' or 'farmer'
 * 
 * @see Epic 4, Story 4.4 - Negotiate Price
 * @see NegotiationPage - Destination page for negotiations
 * @see CropActionButtons - Parent component that renders this button
 */
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { T } from '../../../context/TranslationContext';

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
