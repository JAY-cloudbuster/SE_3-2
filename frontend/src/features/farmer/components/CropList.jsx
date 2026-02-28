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

import { cropService } from '../../../services/cropService';

export default function CropList() {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [savingId, setSavingId] = useState(null);
    const [editingCropId, setEditingCropId] = useState(null);
    const [editData, setEditData] = useState({
        name: '',
        location: '',
        quantity: '',
        price: '',
        quality: 'A',
        description: '',
        category: 'other',
        image: '',
        status: 'Available',
        isSold: false
    });

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

    const startEditing = (crop) => {
        setEditingCropId(crop._id);
        setEditData({
            name: crop.name || '',
            location: crop.location || '',
            quantity: crop.quantity ?? '',
            price: crop.price ?? '',
            quality: crop.quality || 'A',
            description: crop.description || '',
            category: crop.category || 'other',
            image: crop.image || 'default_crop.jpg',
            status: crop.status || 'Available',
            isSold: Boolean(crop.isSold)
        });
    };

    const cancelEditing = () => {
        setEditingCropId(null);
    };

    const handleDelete = async (cropId) => {
        const confirmed = window.confirm('Delete this crop listing? This action cannot be undone.');
        if (!confirmed) return;

        setDeletingId(cropId);
        try {
            await cropService.delete(cropId);
            setCrops((prev) => prev.filter((crop) => crop._id !== cropId));
            if (editingCropId === cropId) {
                setEditingCropId(null);
            }
        } catch (error) {
            console.error('Failed to delete crop listing:', error);
            window.alert(error?.response?.data?.message || 'Failed to delete crop listing');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSave = async (cropId) => {
        setSavingId(cropId);
        try {
            const payload = {
                ...editData,
                quantity: Number(editData.quantity),
                price: Number(editData.price)
            };

            const response = await cropService.update(cropId, payload);
            setCrops((prev) => prev.map((crop) => (crop._id === cropId ? response.data : crop)));
            setEditingCropId(null);
        } catch (error) {
            console.error('Failed to update crop listing:', error);
            window.alert(error?.response?.data?.message || 'Failed to update crop listing');
        } finally {
            setSavingId(null);
        }
    };

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
                                            {editingCropId === crop._id ? (
                                                <input
                                                    value={editData.name}
                                                    onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                                                    className="w-full bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500"
                                                    required
                                                />
                                            ) : (
                                                <div className="font-bold text-slate-800">{crop.name}</div>
                                            )}
                                            <div className="text-[10px] text-slate-400 font-medium">Added on {new Date(crop.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5 text-slate-600 font-medium text-sm">
                                                <MapPin size={14} className="text-emerald-500" />
                                                {editingCropId === crop._id ? (
                                                    <input
                                                        value={editData.location}
                                                        onChange={(e) => setEditData((prev) => ({ ...prev, location: e.target.value }))}
                                                        className="w-full bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500"
                                                        required
                                                    />
                                                ) : (
                                                    crop.location
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {editingCropId === crop._id ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="200"
                                                    value={editData.quantity}
                                                    onChange={(e) => setEditData((prev) => ({ ...prev, quantity: e.target.value }))}
                                                    className="w-24 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500"
                                                    required
                                                />
                                            ) : (
                                                <span className="font-semibold text-emerald-700">{crop.quantity} kg</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingCropId === crop._id ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="500"
                                                    value={editData.price}
                                                    onChange={(e) => setEditData((prev) => ({ ...prev, price: e.target.value }))}
                                                    className="w-24 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500"
                                                    required
                                                />
                                            ) : (
                                                <div className="flex items-center gap-1 font-semibold text-slate-700">
                                                    ₹{crop.price}
                                                    {crop.price > 20 && <TrendingUp size={14} className="text-emerald-500" />}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingCropId === crop._id ? (
                                                <select
                                                    value={editData.quality}
                                                    onChange={(e) => setEditData((prev) => ({ ...prev, quality: e.target.value }))}
                                                    className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500"
                                                >
                                                    <option value="A">Grade A</option>
                                                    <option value="B">Grade B</option>
                                                    <option value="C">Grade C</option>
                                                </select>
                                            ) : (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold
                        ${crop.quality === 'A' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                    crop.quality === 'B' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                        'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                    Grade {crop.quality}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            {editingCropId === crop._id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(crop._id)}
                                                        disabled={savingId === crop._id}
                                                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg disabled:opacity-60"
                                                    >
                                                        {savingId === crop._id ? 'Saving...' : 'Save'}
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEditing(crop)}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        aria-label="Edit crop"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(crop._id)}
                                                        disabled={deletingId === crop._id}
                                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-60"
                                                        aria-label="Delete crop"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {editingCropId && (
                    <div className="p-4 border-t border-emerald-100 bg-emerald-50/30 space-y-3">
                        <h4 className="text-sm font-bold text-emerald-900">Edit Listing Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Description</label>
                                <textarea
                                    value={editData.description}
                                    onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                                    className="w-full bg-white p-2 rounded-lg border border-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500"
                                    maxLength={500}
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Category</label>
                                <select
                                    value={editData.category}
                                    onChange={(e) => setEditData((prev) => ({ ...prev, category: e.target.value }))}
                                    className="w-full bg-white p-2 rounded-lg border border-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="grain">grain</option>
                                    <option value="vegetable">vegetable</option>
                                    <option value="fruit">fruit</option>
                                    <option value="spice">spice</option>
                                    <option value="pulse">pulse</option>
                                    <option value="oilseed">oilseed</option>
                                    <option value="other">other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Image Path</label>
                                <input
                                    value={editData.image}
                                    onChange={(e) => setEditData((prev) => ({ ...prev, image: e.target.value }))}
                                    className="w-full bg-white p-2 rounded-lg border border-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Status</label>
                                <select
                                    value={editData.status}
                                    onChange={(e) => setEditData((prev) => ({ ...prev, status: e.target.value }))}
                                    className="w-full bg-white p-2 rounded-lg border border-emerald-100 outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="Available">Available</option>
                                    <option value="OutOfStock">OutOfStock</option>
                                    <option value="Sold">Sold</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 pt-5">
                                <input
                                    id="isSold"
                                    type="checkbox"
                                    checked={editData.isSold}
                                    onChange={(e) => setEditData((prev) => ({ ...prev, isSold: e.target.checked }))}
                                />
                                <label htmlFor="isSold" className="text-sm text-slate-700 font-medium">Mark as sold</label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
