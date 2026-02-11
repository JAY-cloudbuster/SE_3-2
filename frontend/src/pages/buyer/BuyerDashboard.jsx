/**
 * @fileoverview Buyer Dashboard Page for AgriSahayak Frontend
 * 
 * Main landing page for buyers. Fetches available crops from the API
 * and displays:
 * - MarketMap with randomized farm pin locations
 * - Responsive grid of CropCard components for browsing/purchasing
 * 
 * @component BuyerDashboard
 * @see Epic 3, Story 3.1 - Browse Available Crops
 * @see MarketMap - Interactive crop location map
 * @see CropCard - Individual crop listing card
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { T } from '../../context/TranslationContext';
import MarketMap from '../../features/buyer/components/MarketMap';
import CropCard from '../../features/buyer/components/CropCard';
import { cropService } from '../../services/cropService';

export default function BuyerDashboard() {
  const [crops, setCrops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrops = async () => {
      const res = await cropService.getAll(); // Story 2.6 [cite: 72]
      setCrops(res.data);
    };
    fetchCrops();
  }, []);

  return (
    <motion.div
      className="max-w-7xl mx-auto p-6 space-y-10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <section className="space-y-4">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          <T>Discover Fresh Produce</T>
        </h2>
        <p className="text-slate-500 font-medium">
          <T>Explore trusted farmers around you with a live crop availability map.</T>
        </p>
        <MarketMap
          farms={crops.map((c) => ({
            id: c._id,
            x: Math.random() * 80,
            y: Math.random() * 80,
            crop: c.name,
            village: c.farmer?.location || c.location || 'Unknown',
          }))}
        />
      </section>

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