import React from 'react';
import CropForm from '../../features/farmer/components/CropForm';
import TrustGauge from '../../components/shared/TrustGauge';
import PriceChart from '../../features/market/components/PriceChart';
import { motion } from 'framer-motion';

export default function FarmerDashboard() {
  return (
    <motion.div
      className="p-8 max-w-7xl mx-auto space-y-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <header className="flex justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl font-black text-emerald-950 tracking-tighter">
            Farmer Dashboard
          </h1>
          <p className="text-emerald-600 font-bold mt-2">
            Manage harvests and market trends
          </p>
        </div>
        <div className="w-64 glass-card p-4 rounded-3xl border border-emerald-50">
          <TrustGauge score={92} />
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-6">
          <CropForm />
          <PriceChart crop="Tomato" />
        </div>
        <div className="glass-card bg-gradient-to-b from-emerald-900 to-emerald-800 rounded-[2.5rem] p-10 text-white shadow-2xl border border-emerald-700/40">
          <h3 className="text-2xl font-bold mb-4">Price Alert</h3>
          <p className="opacity-80 italic">
            "Onion prices are expected to rise by 15% next week."
          </p>
        </div>
      </div>
    </motion.div>
  );
}