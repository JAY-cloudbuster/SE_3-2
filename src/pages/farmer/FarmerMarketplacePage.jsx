import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { T } from '../../context/TranslationContext';
import MarketMap from '../../features/buyer/components/MarketMap';
import CropCard from '../../features/buyer/components/CropCard';
import { mockCrops } from '../../data/mockTradingData';

/**
 * FarmerMarketplacePage
 * Dedicated marketplace page for farmers to browse and buy crops from other farmers
 * Mirrors the Buyer Dashboard experience
 */
export default function FarmerMarketplacePage() {
    const [crops, setCrops] = useState([]);
    const navigate = useNavigate();
    const currentFarmerId = 'farmer_1'; // In real app, get from auth context

    useEffect(() => {
        // Load crops from mock data, filter out current farmer's crops
        const availableCrops = mockCrops.filter(crop => crop.farmerId !== currentFarmerId);

        // Convert to format expected by CropCard
        const formattedCrops = availableCrops.map(crop => ({
            _id: crop.id,
            name: crop.name,
            price: crop.price,
            quantity: crop.quantity,
            quality: crop.quality,
            farmer: crop.farmerId,
            farmerName: crop.farmerName,
            city: crop.farmerLocation,
            verified: true,
        }));

        setCrops(formattedCrops);
    }, [currentFarmerId]);

    return (
        <motion.div
            className="max-w-7xl mx-auto p-6 space-y-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <section className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    <T>Marketplace</T>
                </h2>
                <p className="text-slate-500 font-medium">
                    <T>Explore and purchase crops from trusted farmers around you.</T>
                </p>

                {/* Market Map */}
                <MarketMap
                    farms={crops.map((c) => ({
                        id: c._id,
                        x: Math.random() * 80,
                        y: Math.random() * 80,
                        crop: c.name,
                        village: c.city,
                    }))}
                />
            </section>

            {/* Crop Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {crops.map((crop) => (
                    <motion.div
                        key={crop._id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <CropCard crop={crop} onBuy={() => navigate('/payment')} />
                    </motion.div>
                ))}
            </section>
        </motion.div>
    );
}
