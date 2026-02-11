/**
 * @fileoverview Crop Action Buttons Component for AgriSahayak Trade System
 * 
 * Composite component that renders Buy Now and Negotiate buttons for a crop.
 * The Negotiate button is conditionally shown based on crop.negotiationEnabled.
 * Used within CropCard and FarmerMarketplace to provide trade actions.
 * 
 * @component CropActionButtons
 * @param {Object} props
 * @param {Object} props.crop - Crop data object
 * @param {string} [props.currentUserId='buyer_1'] - Current user ID
 * @param {string} [props.currentUserRole='buyer'] - 'buyer' or 'farmer'
 * @param {Function} [props.onOrderComplete] - Callback when order is placed
 * 
 * @see Epic 4, Story 4.5 - Buy Now
 * @see Epic 4, Story 4.4 - Negotiate Price
 * @see BuyNowButton - Renders the Buy Now action
 * @see NegotiateButton - Renders the Negotiate action
 */
import React from 'react';
import { T } from '../../../context/TranslationContext';
import BuyNowButton from './BuyNowButton';
import NegotiateButton from './NegotiateButton';

export default function CropActionButtons({
    crop,
    currentUserId = 'buyer_1',
    currentUserRole = 'buyer',
    onOrderComplete
}) {
    return (
        <div className="space-y-3">
            {/* Buy Now Button */}
            <BuyNowButton crop={crop} onOrderComplete={onOrderComplete} />

            {/* Negotiate Button */}
            {crop.negotiationEnabled !== false && (
                <NegotiateButton
                    crop={crop}
                    currentUserId={currentUserId}
                    currentUserRole={currentUserRole}
                />
            )}

            {/* Info Text */}
            <p className="text-xs text-center text-slate-500">
                <T>Buy instantly or negotiate for a better price</T>
            </p>
        </div>
    );
}
