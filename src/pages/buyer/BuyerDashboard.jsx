import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MarketMap from '../../features/buyer/components/MarketMap';
import CropCard from '../../features/buyer/components/CropCard';
import { cropService } from '../../services/cropService';

export default function BuyerDashboard() {
  const [crops, setCrops] = useState([]);

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
          Discover Fresh Produce
        </h2>
        <p className="text-slate-500 font-medium">
          Explore trusted farmers around you with a live crop availability map.
        </p>
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

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {crops.map((crop) => (
          <motion.div
            key={crop._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CropCard crop={crop} onBuy={(c) => console.log('Purchase', c)} />
          </motion.div>
        ))}
      </section>
    </motion.div>
  );
}