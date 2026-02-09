import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle } from 'lucide-react';
import { T } from '../../../context/TranslationContext';
import { cropService } from '../../../services/cropService';
import VoiceInput from '../../../components/common/VoiceInput';

export default function CropForm({ onCropAdded }) {
  const [data, setData] = useState({ name: '', quantity: '', price: '', quality: 'A', location: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await cropService.create(data);
      setSuccess(true);
      if (onCropAdded) onCropAdded(); // Notify parent to refresh list
      setTimeout(() => {
        setSuccess(false);
        setData({ name: '', quantity: '', price: '', quality: 'A', location: '' });
      }, 3000);
    } catch (error) {
      console.error('Failed to list crop:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoiceQuantity = (value) => {
    setData({ ...data, quantity: value.toString() });
  };

  const handleVoicePrice = (value) => {
    setData({ ...data, price: value.toString() });
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 text-center space-y-4"
      >
        <CheckCircle className="mx-auto text-emerald-500" size={48} />
        <h3 className="text-xl font-black text-emerald-900"><T>Crop Listed Successfully!</T></h3>
        <p className="text-sm text-slate-500"><T>Your harvest is now visible to buyers.</T></p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="glass-card p-8 space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Upload className="text-emerald-600" size={20} />
        <h3 className="text-xl font-black text-emerald-900"><T>List New Harvest</T></h3>
      </div>

      <div>
        <label className="text-xs font-bold uppercase text-slate-500 mb-1 block"><T>Crop Name</T></label>
        <input
          placeholder="e.g., Organic Wheat"
          value={data.name}
          className="w-full bg-emerald-50/50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 border border-emerald-100"
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="text-xs font-bold uppercase text-slate-500 mb-1 block"><T>Location</T></label>
        <input
          placeholder="e.g., Coimbatore, Tamil Nadu"
          value={data.location}
          className="w-full bg-emerald-50/50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 border border-emerald-100"
          onChange={(e) => setData({ ...data, location: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-slate-500 mb-1 block"><T>Quantity (kg)</T></label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="1-200"
              value={data.quantity}
              min="1"
              max="200"
              className="flex-1 bg-emerald-50/50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 border border-emerald-100"
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val > 200) return; // Prevent typing > 200
                if (val < 0) return;   // Prevent typing < 0
                setData({ ...data, quantity: e.target.value })
              }}
              required
            />
            <VoiceInput onResult={handleVoiceQuantity} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Max: 200 kg</p>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-500 mb-1 block"><T>Price (₹/kg)</T></label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="1-500"
              value={data.price}
              min="1"
              max="500"
              className="flex-1 bg-emerald-50/50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 border border-emerald-100"
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val > 500) return; // Prevent typing > 500
                if (val < 0) return;   // Prevent typing < 0
                setData({ ...data, price: e.target.value })
              }}
              required
            />
            <VoiceInput onResult={handleVoicePrice} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Max: ₹500/kg</p>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase text-slate-500 mb-1 block"><T>Quality Grade</T></label>
        <div className="flex gap-2">
          {['A', 'B', 'C'].map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => setData({ ...data, quality: grade })}
              className={`flex-1 py-2 rounded-xl font-black transition-all ${data.quality === grade
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-emerald-50 text-slate-600 hover:bg-emerald-100'
                }`}
            >
              Grade {grade}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full btn-primary py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <T>{submitting ? 'Publishing...' : 'Publish Listing'}</T>
      </button>
    </motion.form>
  );
}