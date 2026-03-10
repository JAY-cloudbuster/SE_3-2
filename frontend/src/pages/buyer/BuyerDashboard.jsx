/**
 * @fileoverview Buyer Dashboard — AgriSahayak
 *
 * Main landing page for authenticated buyers. Contains three vertically-stacked
 * tabs (driven by the ?tab= URL param so the Sidebar highlights correctly):
 *
 *  1. Marketplace  — Browse all crop listings; Buy Now / Negotiate / Place Bid
 *  2. Negotiations — All price-negotiation threads with farmers
 *  3. My Orders    — Full history: direct purchases, bid orders, negotiated orders
 *
 * Real-time socket events automatically refresh the relevant tab:
 *   buyer_bid_accepted | buyer_bid_rejected → refresh My Orders
 *   buyer_order_confirmed | payment_completed → refresh My Orders
 *
 * @component BuyerDashboard
 */
import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { T } from '../../context/TranslationContext';
import { AuthContext } from '../../context/AuthContext';
import MarketplaceTab  from '../../features/buyer/components/MarketplaceTab';
import NegotiationsTab from '../../features/buyer/components/NegotiationsTab';
import MyOrdersTab     from '../../features/buyer/components/MyOrdersTab';

export default function BuyerDashboard() {
    const { user }   = useContext(AuthContext);
    const location   = useLocation();

    // Derive active tab from ?tab= URL param (defaults to marketplace)
    const activeTab = new URLSearchParams(location.search).get('tab') || 'marketplace';

    const [ordersRefresh, setOrdersRefresh] = useState(0);

    // Keep orders tab refreshed periodically in REST-only mode.
    useEffect(() => {
        if (!user?._id) return;
        const id = setInterval(() => setOrdersRefresh((n) => n + 1), 15000);
        return () => clearInterval(id);
    }, [user?._id]);

    return (
        <motion.div
            className="max-w-7xl mx-auto p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
        >
            {/* ── Page Header ─────────────────────────────────────────── */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    <T>Buyer Dashboard</T>
                </h1>
                <p className="text-slate-500 font-medium mt-1">
                    <T>Browse crops, negotiate prices, and track your orders</T>
                </p>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.22 }}
                >
                    {activeTab === 'marketplace'  && <MarketplaceTab />}
                    {activeTab === 'negotiations' && <NegotiationsTab refreshTrigger={ordersRefresh} />}
                    {activeTab === 'orders'       && <MyOrdersTab     refreshTrigger={ordersRefresh} />}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}

