/**
 * @fileoverview Trust Score Gauge Component for AgriSahayak Frontend
 * 
 * Visual credibility indicator showing a farmer's trust score as a
 * percentage bar with animated fill. Levels: Excellent (90+), Good (70+),
 * Fair (50+), Building (<50). Uses emerald gradient with Framer Motion.
 * 
 * @component TrustGauge
 * @param {Object} props
 * @param {number} props.score - Trust score (0-100)
 * 
 * @see Epic 7, Story 7.10 - Trust Score Display
 */
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp } from 'lucide-react';

export default function TrustGauge({ score }) {
  // Story 7.10: Visual credibility indicator based on trade history [cite: 347]
  const getTrustLevel = (s) => {
    if (s >= 90) return { label: 'Excellent', color: 'emerald' };
    if (s >= 70) return { label: 'Good', color: 'green' };
    if (s >= 50) return { label: 'Fair', color: 'yellow' };
    return { label: 'Building', color: 'orange' };
  };

  const trust = getTrustLevel(score);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-emerald-600" size={16} />
          <span className="text-[10px] font-black uppercase text-slate-400">Trust Rating</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg font-black text-emerald-600">{score}%</span>
          <TrendingUp className="text-emerald-500" size={14} />
        </div>
      </div>

      <div className="relative w-full bg-slate-100 h-4 rounded-full overflow-hidden">
        <motion.div
          className={`bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full shadow-lg shadow-emerald-200/50`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9px] font-black text-slate-600 uppercase">{trust.label}</span>
        </div>
      </div>
    </div>
  );
}