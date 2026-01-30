import { motion } from 'framer-motion';
import { Star, MapPin, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import CurrencyLabel from '../../../components/shared/CurrencyLabel';

export default function CropCard({ crop, onBuy }) {
  // Story 3.9: Virtual Crop Inspection with quality indicators [cite: 130]
  const qualityColors = {
    A: 'bg-emerald-500 text-white',
    B: 'bg-green-500 text-white',
    C: 'bg-yellow-500 text-white',
  };

  return (
    <motion.div
      className="glass-card overflow-hidden group hover:border-emerald-500 transition-all duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image with quality badge */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-stone-100">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400')] bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        <div className="absolute top-3 right-3 flex gap-2">
          <div className={`${qualityColors[crop.quality] || qualityColors.A} px-2 py-1 rounded-lg text-[10px] font-black uppercase shadow-lg`}>
            Grade {crop.quality || 'A'}
          </div>
          {crop.verified && (
            <div className="bg-emerald-600 text-white p-1 rounded-lg shadow-lg">
              <ShieldCheck size={12} />
            </div>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Star className="text-yellow-500 fill-yellow-500" size={12} />
          <span className="text-xs font-bold text-slate-700">4.8</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-black text-slate-800 leading-tight">{crop.name}</h4>
          <div className="text-right">
            <CurrencyLabel amount={crop.price} className="text-emerald-600 font-black text-lg" />
            <span className="text-xs text-slate-500 block">per kg</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin size={12} />
          <span className="line-clamp-1">{crop.city || 'Ettimadai'}</span>
        </div>

        <div className="pt-2 border-t border-emerald-50">
          <p className="text-xs text-slate-600 mb-3">
            By <span className="font-bold text-emerald-700">{crop.farmerName || 'Local Farmer'}</span>
          </p>

          {/* Story 4.1: Fixed-Price Purchase [cite: 138] */}
          <motion.button
            onClick={() => onBuy(crop)}
            className="w-full btn-primary py-2.5 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Buy Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}