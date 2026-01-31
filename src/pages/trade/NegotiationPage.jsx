import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, ShoppingCart, Package, User } from 'lucide-react';
import { T } from '../../context/TranslationContext';
import { AuthContext } from '../../context/AuthContext';
import NegotiationChat from '../../features/trade/components/NegotiationChat';

/**
 * NegotiationPage
 * Dedicated page for price negotiations with navigation
 */
export default function NegotiationPage() {
    const { negotiationId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [negotiation, setNegotiation] = useState(null);
    const [crop, setCrop] = useState(null);

    // Determine correct dashboard route based on user role
    const dashboardRoute = user?.role === 'BUYER' ? '/dashboard/buyer' : '/marketplace';

    // Load negotiation data
    useEffect(() => {
        // If we have crop data in state, use it directly
        if (location.state?.crop) {
            const cropData = location.state.crop;

            // Check if negotiation already exists
            const negotiations = JSON.parse(localStorage.getItem('mockNegotiations') || '[]');
            let existingNeg = negotiations.find(
                n => n.cropId === cropData.id && n.buyerId === 'buyer_1'
            );

            if (existingNeg) {
                setNegotiation(existingNeg);
                setCrop(cropData);
                // Update URL if needed
                if (negotiationId !== existingNeg.id) {
                    navigate(`/negotiation/${existingNeg.id}`, { replace: true, state: { crop: cropData } });
                }
            } else {
                // Create new negotiation
                const newNeg = {
                    id: `neg_${Date.now()}`,
                    cropId: cropData.id,
                    buyerId: 'buyer_1',
                    buyerName: 'Current User',
                    farmerId: cropData.farmerId,
                    farmerName: cropData.farmerName,
                    status: 'active',
                    messages: [
                        {
                            id: `msg_${Date.now()}`,
                            sender: 'buyer',
                            type: 'text',
                            content: `Hi! I'm interested in your ${cropData.name}. Can we discuss the price?`,
                            timestamp: new Date().toISOString(),
                        },
                    ],
                    currentOffer: null,
                };

                negotiations.push(newNeg);
                localStorage.setItem('mockNegotiations', JSON.stringify(negotiations));

                setNegotiation(newNeg);
                setCrop(cropData);

                // Update URL with new negotiation ID
                navigate(`/negotiation/${newNeg.id}`, { replace: true, state: { crop: cropData } });
            }
        } else if (negotiationId && negotiationId !== 'new') {
            // Load existing negotiation by ID
            const negotiations = JSON.parse(localStorage.getItem('mockNegotiations') || '[]');
            const neg = negotiations.find(n => n.id === negotiationId);

            if (neg) {
                setNegotiation(neg);

                // Load crop details
                const crops = JSON.parse(localStorage.getItem('mockCrops') || '[]');
                const cropData = crops.find(c => c.id === neg.cropId);
                if (cropData) {
                    setCrop(cropData);
                }
            }
        }
    }, [negotiationId, location.state, navigate]);

    if (!negotiation || !crop) {
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Back Button */}
                        <button
                            onClick={() => navigate(dashboardRoute)}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-lg"
                        >
                            <ArrowLeft size={20} />
                            <span><T>Back to Dashboard</T></span>
                        </button>

                        {/* Center: Page Title */}
                        <div className="text-center">
                            <h1 className="text-2xl font-black text-slate-900"><T>Price Negotiation</T></h1>
                            <p className="text-sm text-slate-500">{crop.name}</p>
                        </div>

                        {/* Right: Quick Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/trade')}
                                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-bold transition-colors"
                                title="Trade Dashboard"
                            >
                                <T>All Negotiations</T>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar: Crop Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 space-y-6">
                            {/* Crop Image */}
                            <div className="relative">
                                <img
                                    src={crop.image}
                                    alt={crop.name}
                                    className="w-full h-48 object-cover rounded-xl"
                                />
                                <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold">
                                    Grade {crop.quality}
                                </div>
                            </div>

                            {/* Crop Info */}
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-2">{crop.name}</h2>
                                <p className="text-sm text-slate-600 mb-4">{crop.description}</p>

                                <div className="space-y-3 pt-4 border-t border-slate-200">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Listed Price</T></span>
                                        <span className="text-lg font-black text-emerald-600">₹{crop.price}/kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Available</T></span>
                                        <span className="font-bold text-slate-900">{crop.quantity}kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Farmer</T></span>
                                        <span className="font-bold text-slate-900">{crop.farmerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-slate-600"><T>Location</T></span>
                                        <span className="font-bold text-slate-900">{crop.farmerLocation}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className={`px-4 py-3 rounded-xl text-center ${negotiation.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                negotiation.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                <p className="text-xs font-bold uppercase tracking-wider">
                                    <T>{negotiation.status}</T>
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate('/trade')}
                                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors"
                                >
                                    <T>View All Negotiations</T>
                                </button>
                                <button
                                    onClick={() => navigate(dashboardRoute)}
                                    className="w-full bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition-colors"
                                >
                                    <T>Back to Marketplace</T>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Chat Interface */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <NegotiationChat
                            negotiationId={negotiation.id}
                            currentUserId="buyer_1"
                            currentUserRole="buyer"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
