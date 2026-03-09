/**
 * @fileoverview Trust Score Gauge Component for AgriSahayak Frontend
 * 
 * Interactive visual credibility indicator showing a farmer's trust score
 * as a percentage bar with animated fill. Clicking reveals a detailed
 * breakdown popover with sub-scores for delivery, quality, and response.
 * Levels: Excellent (90+), Good (70+), Fair (50+), Building (<50).
 * 
 * @component TrustGauge
 * @param {Object} props
 * @param {number} props.score - Trust score (0-100)
 * 
 * @see Epic 7, Story 7.10 - Trust Score Display
 */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, TrendingUp, Truck, Star, Clock, ChevronDown } from 'lucide-react';

export default function TrustGauge({ score }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const popoverRef = useRef(null);

  const getTrustLevel = (s) => {
    if (s >= 90) return { label: 'Excellent', color: 'emerald' };
    if (s >= 70) return { label: 'Good', color: 'green' };
    if (s >= 50) return { label: 'Fair', color: 'yellow' };
    return { label: 'Building', color: 'orange' };
  };

  const trust = getTrustLevel(score);

  // Simulated sub-scores derived from main score
  const subScores = [
    { label: 'On-time Delivery', icon: Truck, score: Math.min(100, score + 3), color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Crop Quality', icon: Star, score: Math.min(100, score - 2), color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Response Rate', icon: Clock, score: Math.min(100, score - 4), color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowBreakdown(false);
      }
    }
    if (showBreakdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBreakdown]);

  return (
    <div className="space-y-3 relative" ref={popoverRef}>
      {/* Clickable Header */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full text-left group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-600 group-hover:scale-110 transition-transform" size={16} />
            <span className="text-[10px] font-black uppercase text-slate-400">Trust Rating</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg font-black text-emerald-600">{score}%</span>
            <TrendingUp className="text-emerald-500" size={14} />
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 ${showBreakdown ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </button>

      {/* Progress Bar */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="relative w-full bg-slate-100 h-4 rounded-full overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      >
        <motion.div
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full shadow-lg shadow-emerald-200/50"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9px] font-black text-slate-600 uppercase">{trust.label}</span>
        </div>
      </button>

      {/* Breakdown Popover */}
      <AnimatePresence>
        {showBreakdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 p-3 space-y-3 mt-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score Breakdown</p>
              {subScores.map((sub) => {
                const SubIcon = sub.icon;
                return (
                  <div key={sub.label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`${sub.bg} p-1 rounded-lg`}>
                          <SubIcon size={12} className={sub.color} />
                        </div>
                        <span className="text-xs font-semibold text-slate-600">{sub.label}</span>
                      </div>
                      <span className="text-xs font-black text-slate-700">{sub.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-emerald-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${sub.score}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                Based on your last 30 transactions
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}