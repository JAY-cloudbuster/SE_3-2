import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { T } from '../../context/TranslationContext';
import { AuthContext } from '../../context/AuthContext';
import { cropService } from '../../services/cropService';
import { formatQuintalQuantity, formatQuintalRate } from '../../utils/formatters';
import TradeRoom from '../../components/TradeRoom';

export default function NegotiationPage() {
    const { negotiationId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [crop, setCrop] = useState(null);

    const dashboardRoute = user?.role === 'BUYER' ? '/dashboard/buyer' : '/marketplace';

    useEffect(() => {
        const loadCrop = async () => {
            if (location.state?.crop) {
                setCrop(location.state.crop);
                return;
            }

            const res = await cropService.getAll();
            const selected = res.data.find((c) => c._id === negotiationId);
            if (selected) {
                setCrop(selected);
            }
        };

        loadCrop();
    }, [location.state, negotiationId]);

    if (!crop) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-slate-500 mb-4"><T>Loading negotiation...</T></p>
                    <button
                        onClick={() => navigate(dashboardRoute)}
                        className="text-emerald-600 font-bold hover:underline"
                    >
                        <T>Back to Marketplace</T>
                    </button>
                </div>
            </div>
        );
    }

    const listingId = crop._id || crop.id;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="bg-white border-b border-slate-200 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(dashboardRoute)}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-lg"
                        >
                            <ArrowLeft size={20} />
                            <span><T>Back to Marketplace</T></span>
                        </button>

                        <div className="text-center">
                            <h1 className="text-2xl font-black text-slate-900"><T>Price Negotiation</T></h1>
                            <p className="text-sm text-slate-500">{crop.name}</p>
                        </div>

                        <button
                            onClick={() => navigate('/trade')}
                            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-bold transition-colors"
                            title="Trade Dashboard"
                        >
                            <T>View All Negotiations</T>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 space-y-6">
                            <div className="relative">
                                <img
                                    src={crop.image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600'}
                                    alt={crop.name}
                                    className="w-full h-48 object-cover rounded-xl"
                                />
                                <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                                    Grade {crop.quality || 'A'}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">{crop.name}</h2>
                                <p className="text-sm text-slate-600 mb-4">{crop.description || `Fresh ${crop.name} ready for trade.`}</p>

                                <div className="space-y-3 pt-4 border-t border-slate-200">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Listed Price</T></span>
                                        <span className="text-lg font-black text-emerald-600">{formatQuintalRate(crop.price)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Available Quantity</T></span>
                                        <span className="font-bold text-slate-900">{formatQuintalQuantity(crop.quantity)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Farmer Name</T></span>
                                        <span className="font-bold text-slate-900">{crop.farmer?.name || crop.farmerName || 'Farmer'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Location</T></span>
                                        <span className="font-bold text-slate-900">{crop.farmer?.location || crop.location || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 py-3 rounded-xl text-center bg-blue-100 text-blue-700">
                                <p className="text-xs font-bold uppercase tracking-wider"><T>ACTIVE</T></p>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate('/trade')}
                                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors"
                                >
                                    <T>View All Negotiations</T>
                                </button>
                                <button
                                    onClick={() => navigate('/marketplace')}
                                    className="w-full bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition-colors"
                                >
                                    <T>Back to Marketplace</T>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <TradeRoom
                            listingId={listingId}
                            currentUserRole={user?.role === 'FARMER' ? 'Farmer' : 'Buyer'}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
