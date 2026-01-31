import React from 'react';
import { T } from '../../../context/TranslationContext';
import BuyNowButton from './BuyNowButton';
import NegotiateButton from './NegotiateButton';

/**
 * CropActionButtons Component
 * Displays Buy Now and Negotiate buttons for a crop
 * 
 * Props:
 * - crop: Crop object
 * - currentUserId: Current user ID
 * - currentUserRole: 'buyer' or 'farmer'
 * - onOrderComplete: Callback when order is placed
 */
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
