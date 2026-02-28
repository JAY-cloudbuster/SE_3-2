/**
 * @fileoverview SmartPostModal — AI Intercept Modal for Crop Listing
 *
 * Pops up after the farmer clicks "Submit" on CropForm, BEFORE the
 * listing is saved.  Fetches the AI decision from /api/decision,
 * shows the MarketTrendChart + recommendation, and offers:
 *   • "Post Anyway"       → saves with status 'Available'
 *   • "Save as Draft & Wait" → saves with status 'Draft'
 *
 * Props:
 *   formData   {Object}   — The crop form payload (name, price, quantity…)
 *   onClose    {Function} — Close modal without saving
 *   onPost     {Function} — Called with (formData, status) when the farmer
 *                            decides. Parent performs the actual API save.
 *
 * @component SmartPostModal
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import MarketTrendChart from './MarketTrendChart';
import api from '../services/api';

export default function SmartPostModal({ formData, onClose, onPost, inline = false }) {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);

  // Decision support uses selected crop only.
  const cropName = formData?.name || '';
  const selectedState = (formData?.state || '').trim();

  useEffect(() => {
    if (!cropName) {
      setLoading(false);
      return;
    }

    const fetchAI = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/decision?crop=${encodeURIComponent(cropName)}`
        );
        setAiData(res.data);
      } catch (err) {
        console.error('SmartPostModal AI fetch error:', err);
        setError('Could not fetch AI insights. You can still post your listing.');
      } finally {
        setLoading(false);
      }
    };

    fetchAI();
  }, [cropName]);

  const handlePost = async (status) => {
    setPosting(true);
    try {
      await onPost(formData, status);
    } finally {
      setPosting(false);
    }
  };

  // Recommendation → icon mapping
  const recIcon = {
    WAIT: <Clock size={20} className="text-amber-500" />,
    'SELL NOW': <AlertTriangle size={20} className="text-rose-500" />,
    HOLD: <TrendingUp size={20} className="text-emerald-500" />,
  };

  const recBg = {
    WAIT: 'bg-amber-50 border-amber-200',
    'SELL NOW': 'bg-rose-50 border-rose-200',
    HOLD: 'bg-emerald-50 border-emerald-200',
  };

  return (
    <motion.div
      className={inline ? 'glass-card p-6 rounded-3xl border border-emerald-100 space-y-4' : 'bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto'}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-emerald-600" size={22} />
              <h2 className="text-lg font-black text-emerald-900">
                AI Market Insight
              </h2>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={18} className="text-slate-400" />
              </button>
            )}
          </div>

          {/* Crop summary */}
          <div className="px-6 pb-3">
            <p className="text-sm text-slate-500">
              Analysing market for{' '}
              <span className="font-bold text-slate-700">{cropName}</span>
              {selectedState ? (
                <>
                  {' '}in <span className="font-bold text-slate-700">{selectedState}</span> (shown for context).
                </>
              ) : '.'}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 pb-4 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center py-10 text-slate-400 animate-pulse">
                <TrendingUp size={36} className="mb-3 opacity-50" />
                <span className="text-sm font-medium">Running AI analysis…</span>
              </div>
            ) : error ? (
              <div className="text-center py-6 text-rose-500 text-sm">{error}</div>
            ) : aiData ? (
              <>
                {/* Recommendation card */}
                <div
                  className={`rounded-2xl border p-4 ${
                    recBg[aiData.recommendation] || 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {recIcon[aiData.recommendation]}
                    <span className="text-base font-black">
                      {aiData.recommendationLabel || aiData.recommendation}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{aiData.explanation}</p>
                  {aiData.predictedPrice && (
                    <p className="text-xs text-slate-500 mt-2">
                      Tomorrow's predicted price:{' '}
                      <span className="font-bold text-slate-800">
                        ₹{aiData.predictedPrice}/quintal
                      </span>
                    </p>
                  )}
                </div>

                {/* Chart */}
                <MarketTrendChart data={aiData} />
              </>
            ) : (
              <div className="py-6 text-center text-slate-400 text-sm">
                No market data available for this crop.
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 p-6 pt-2 border-t border-slate-100">
            <button
              onClick={() => handlePost('Draft')}
              disabled={posting}
              className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-50"
            >
              {posting ? 'Saving…' : 'Save as Draft & Wait'}
            </button>
            <button
              onClick={() => handlePost('Available')}
              disabled={posting}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg transition-colors disabled:opacity-50"
            >
              {posting ? 'Posting…' : 'Post Anyway'}
            </button>
          </div>
    </motion.div>
  );
}
