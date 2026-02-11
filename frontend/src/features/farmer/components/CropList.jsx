/**
 * @fileoverview Crop List Component for AgriSahayak Farmer Dashboard
 * 
 * This component displays the farmer's "My Harvest Inventory" table,
 * showing all crop listings created by the currently logged-in farmer.
 * Data is fetched from the backend via cropService.getMyCrops().
 * 
 * Table columns: Crop Name, Location (with MapPin icon), Quantity (kg),
 * Price/kg (₹), Quality Grade (A/B/C badge), and Actions (Edit/Delete).
 * 
 * Current status:
 * - ✅ Data fetching and display works correctly
 * - ✅ Location column with MapPin icon
 * - ✅ Quality grade color-coded badges (A=green, B=yellow, C=grey)
 * - ✅ Price trend indicator (↑ for prices > ₹20/kg)
 * - ⚠️ Edit button (Edit3 icon) - UI only, handler NOT implemented
 * - ⚠️ Delete button (Trash2 icon) - UI only, handler NOT implemented
 * 
 * @component CropList
 * 
 * @see Epic 2, Story 2.6 - View Crop Listings
 * @see Epic 2, Story 2.7 - Edit Crop Details (planned)
 * @see Epic 2, Story 2.8 - Delete Crop Listing (planned)
 * @see cropService.getMyCrops() - API call for fetching farmer's crops
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, Edit3, Trash2, MapPin } from 'lucide-react';

// Mock data (used as fallback for development, actual API data used in production)
const MOCK_CROPS = [
    { id: 1, name: 'Organic Wheat', quantity: 500, price: 24, quality: 'A', date: '2023-10-15', location: 'Punawale, Pune' },
    { id: 2, name: 'Red Onions', quantity: 1200, price: 35, quality: 'B', date: '2023-10-12', location: 'Nashik, MH' },
    { id: 3, name: 'Basmati Rice', quantity: 800, price: 85, quality: 'A', date: '2023-10-10', location: 'Karnal, HR' },
    { id: 4, name: 'Potatoes (Large)', quantity: 2000, price: 18, quality: 'C', date: '2023-10-08', location: 'Indore, MP' },
];

import { cropService } from '../../../services/cropService';

export default function CropList() {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const res = await cropService.getMyCrops();
                setCrops(res.data);
            } catch (error) {
                console.error("Failed to fetch crops", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCrops();
    }, []);

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Package className="text-emerald-600" size={24} />
                    <h2 className="text-2xl font-black text-emerald-900">My Harvest Inventory</h2>
                </div>
                <div className="bg-white/50 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 border border-emerald-100">
                    Total Items: {crops.length}
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-emerald-50/50 border-b border-emerald-100">
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Crop Name</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Location</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Quantity</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Price/kg</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Quality</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400 text-sm font-medium">
                                        Loading inventory...
                                    </td>
                                </tr>
                            ) : crops.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400 text-sm font-medium">
                                        No crops listed yet. Start by listing a new harvest!
                                    </td>
                                </tr>
                            ) : (
                                crops.map((crop) => (
                                    <tr key={crop._id} className="hover:bg-emerald-50/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{crop.name}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">Added on {new Date(crop.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5 text-slate-600 font-medium text-sm">
                                                <MapPin size={14} className="text-emerald-500" />
                                                {crop.location}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-semibold text-emerald-700">{crop.quantity} kg</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 font-semibold text-slate-700">
                                                ₹{crop.price}
                                                {crop.price > 20 && <TrendingUp size={14} className="text-emerald-500" />}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold
                        ${crop.quality === 'A' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                    crop.quality === 'B' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                        'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                Grade {crop.quality}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                                <Edit3 size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
