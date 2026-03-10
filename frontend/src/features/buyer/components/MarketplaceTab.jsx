/**
 * @fileoverview Marketplace Tab for Buyer Dashboard
 *
 * Displays all available crop listings with Buy Now, Negotiate Price,
 * and Place Bid actions. Supports search filtering by crop name.
 *
 * @component MarketplaceTab
 */
import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, Package } from 'lucide-react';
import { T, useT } from '../../../context/TranslationContext';
import { cropService } from '../../../services/cropService';
import CropCard from './CropCard';
import toast from 'react-hot-toast';

export default function MarketplaceTab() {
    const [crops, setCrops] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const tr = useT();

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const res = await cropService.getAll();
                setCrops(res.data || []);
            } catch {
                toast.error(tr('Failed to load marketplace listings'));
            } finally {
                setLoading(false);
            }
        };
        fetchCrops();
    }, []);

    const filtered = crops.filter((c) =>
        !search || c.name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Search bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={tr('Search crops...')}
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-400 bg-white"
                />
            </div>

            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            )}

            {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Package size={48} className="mb-4 opacity-40" />
                    <p className="font-bold text-lg"><T>No crop listings found</T></p>
                    <p className="text-sm mt-1"><T>Try a different search or check back later</T></p>
                </div>
            )}

            {!loading && filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((crop, idx) => (
                        <motion.div
                            key={crop._id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.04 }}
                        >
                            <CropCard crop={crop} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
