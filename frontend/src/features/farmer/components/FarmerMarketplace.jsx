/**
 * @fileoverview Farmer Marketplace Component for AgriSahayak Frontend
 * 
 * Allows farmers to browse and buy crops from other farmers.
 * Filters out the current farmer's own listings. Displays:
 * - SVG grid map with animated crop markers and hover tooltips
 * - Responsive grid of crop cards with image, price, quality, location
 * - CropActionButtons for Buy Now and Negotiate actions
 * 
 * Uses mock crop data from mockTradingData module.
 * 
 * @component FarmerMarketplace
 * @param {Object} props
 * @param {string} [props.currentFarmerId='farmer_1'] - ID of current farmer to exclude
 * 
 * @see Epic 3, Story 3.1 - Browse Available Crops
 * @see CropActionButtons - Trade action buttons (Buy/Negotiate)
 * @see FarmerMarketplacePage - Page wrapper that renders this component
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, MapPin } from 'lucide-react';
import { T } from '../../../context/TranslationContext';
import { mockCrops } from '../../../data/mockTradingData';
import CropActionButtons from '../../../features/trade/components/CropActionButtons';

export default function FarmerMarketplace({ currentFarmerId = 'farmer_1' }) {
    // Filter out current farmer's own crops
    const availableCrops = mockCrops.filter(crop => crop.farmerId !== currentFarmerId);

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <ShoppingBag className="text-emerald-600" size={32} />
                    <h2 className="text-3xl font-black text-slate-900">
                        <T>Marketplace</T>
                    </h2>
                </div>
                <p className="text-slate-600">
                    <T>Browse and purchase crops from other farmers</T>
                </p>
            </motion.div>

            {/* Map Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
            >
                <h3 className="text-xl font-black text-slate-900 mb-4">
                    <T>Crop Locations Map</T>
                </h3>

                {/* Simple Map Visualization */}
                <div className="relative bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl h-80 overflow-hidden border-2 border-emerald-200">
                    {/* Map Background */}
                    <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-300" />
                            </pattern>
                            <rect width="100" height="100" fill="url(#grid)" />
                        </svg>
                    </div>

                    {/* Crop Markers */}
                    {availableCrops.slice(0, 8).map((crop, index) => {
                        const x = 15 + (index % 4) * 22;
                        const y = 20 + Math.floor(index / 4) * 40;

                        return (
                            <motion.div
                                key={crop.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="absolute group cursor-pointer"
                                style={{ left: `${x}%`, top: `${y}%` }}
                            >
                                {/* Marker Pin */}
                                <div className="relative">
                                    <MapPin className="text-emerald-600 fill-emerald-200" size={32} />

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl">
                                            <p>{crop.name}</p>
                                            <p className="text-emerald-300">₹{crop.price}/kg</p>
                                            <p className="text-slate-300">{crop.farmerLocation}</p>
                                        </div>
                                        <div className="w-2 h-2 bg-slate-900 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -mt-1"></div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <p className="text-xs text-slate-500 mt-3 text-center">
                    <T>Hover over markers to see crop details</T>
                </p>
            </motion.div>

            {/* Available Crops Grid */}
            <div>
                <h3 className="text-xl font-black text-slate-900 mb-4">
                    <T>Available Crops</T>
                </h3>

                {availableCrops.length === 0 ? (
                    <div className="bg-slate-50 rounded-2xl p-12 text-center">
                        <ShoppingBag className="mx-auto text-slate-300 mb-4" size={64} />
                        <p className="text-slate-500"><T>No crops available at the moment</T></p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {availableCrops.map((crop, index) => (
                            <motion.div
                                key={crop.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                {/* Crop Image */}
                                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-blue-100">
                                    <img
                                        src={crop.image}
                                        alt={crop.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                                        Grade {crop.quality}
                                    </div>
                                </div>

                                {/* Crop Details */}
                                <div className="p-5 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-lg font-black text-slate-900">{crop.name}</h4>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-emerald-600">₹{crop.price}</p>
                                            <p className="text-xs text-slate-500">per kg</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 line-clamp-2">{crop.description}</p>

                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <MapPin size={12} />
                                        <span>{crop.farmerLocation}</span>
                                    </div>

                                    <div className="pt-3 border-t border-slate-200">
                                        <p className="text-xs text-slate-600 mb-3">
                                            <T>By</T> <span className="font-bold text-emerald-700">{crop.farmerName}</span>
                                        </p>

                                        {/* Buy Now & Negotiate Buttons */}
                                        <CropActionButtons
                                            crop={crop}
                                            currentUserId={currentFarmerId}
                                            currentUserRole="farmer"
                                            onOrderComplete={(order) => {
                                                console.log('Farmer placed order:', order);
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
