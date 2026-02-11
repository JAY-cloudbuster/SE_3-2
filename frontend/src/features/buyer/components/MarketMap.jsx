/**
 * @fileoverview Interactive Crop Map Component for AgriSahayak Buyer Dashboard
 * 
 * Visual map showing farm locations as animated MapPin markers.
 * Clicking a pin selects it and shows a tooltip with crop name,
 * village, and availability status. Uses Framer Motion for marker
 * entrance animation and tooltip transitions.
 * 
 * Note: This is a simplified CSS-positioned map (not a real mapping library).
 * Farm coordinates are x/y percentages within the container.
 * 
 * @component MarketMap
 * @param {Object} props
 * @param {Array<{id, crop, village, x, y}>} props.farms - Farm marker data
 * 
 * @see Epic 3, Story 3.4 - Interactive Crop Map
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

export default function MarketMap({ farms }) {
  // Story 3.4: Interactive Crop Map with real-time availability
  const [selectedFarm, setSelectedFarm] = useState(null);

  return (
    <motion.div
      className="glass-card relative w-full h-[450px] bg-gradient-to-br from-emerald-50 via-stone-50 to-emerald-50 overflow-hidden border-2 border-emerald-100"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')]"></div>

      {/* Header */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <Navigation className="text-emerald-600" size={18} />
        <h3 className="font-black text-emerald-900 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm">
          Live Crop Availability Map
        </h3>
      </div>

      {/* Farm markers */}
      <AnimatePresence>
        {farms.map((farm, index) => (
          <motion.div
            key={farm.id}
            className="absolute cursor-pointer group"
            style={{ left: `${farm.x}%`, top: `${farm.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.2 }}
            onClick={() => setSelectedFarm(selectedFarm?.id === farm.id ? null : farm)}
          >
            <MapPin
              className={`transition-all ${selectedFarm?.id === farm.id
                  ? 'text-emerald-700 fill-emerald-300 scale-125'
                  : 'text-emerald-600 fill-emerald-200'
                }`}
              size={36}
            />

            {/* Tooltip */}
            <motion.div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 p-3 bg-white rounded-xl shadow-2xl border border-emerald-100 z-30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: selectedFarm?.id === farm.id ? 1 : 0, y: selectedFarm?.id === farm.id ? 0 : 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-emerald-800 font-black text-sm">{farm.crop}</p>
              <p className="text-slate-500 text-xs mt-1">{farm.village}</p>
              <div className="mt-2 pt-2 border-t border-emerald-50">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Available Now</span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg text-xs">
        <p className="font-black text-slate-700 mb-1">Legend</p>
        <div className="flex items-center gap-2">
          <MapPin className="text-emerald-600 fill-emerald-200" size={16} />
          <span className="text-slate-600">Active Farms</span>
        </div>
      </div>
    </motion.div>
  );
}