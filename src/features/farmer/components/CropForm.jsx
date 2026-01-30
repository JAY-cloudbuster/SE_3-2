import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Mic, CheckCircle } from 'lucide-react';
import { cropService } from '../../../services/cropService';
import VoiceInput from '../../../components/common/VoiceInput';
import CurrencyLabel from '../../../components/shared/CurrencyLabel';

export default function CropForm() {
  const [data, setData] = useState({ name: '', quantity: '', price: '', quality: 'A' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await cropService.create(data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setData({ name: '', quantity: '', price: '', quality: 'A' });
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
        <h3 className="text-xl font-black text-emerald-900">Crop Listed Successfully!</h3>
        <p className="text-sm text-slate-500">Your harvest is now visible to buyers.</p>
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
        <h3 className="text-xl font-black text-emerald-900">List New Harvest</h3>
      </div>

      <div>
        <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Crop Name</label>
        <input
          placeholder="e.g., Organic Wheat"
          value={data.name}
          className="w-full bg-emerald-50/50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 border border-emerald-100"
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Quantity (kg)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="100"
              value={data.quantity}
              className="flex-1 bg-emerald-50/50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 border border-emerald-100"
              onChange={(e) => setData({ ...data, quantity: e.target.value })}
              required
            />
            <VoiceInput onResult={handleVoiceQuantity} />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Price (₹/kg)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="40"
              value={data.price}
              className="flex-1 bg-emerald-50/50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 border border-emerald-100"
              onChange={(e) => setData({ ...data, price: e.target.value })}
              required
            />
            <VoiceInput onResult={handleVoicePrice} />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Quality Grade</label>
        <div className="flex gap-2">
          {['A', 'B', 'C'].map((grade) => (
            <button
              key={grade}
              type="button"
              onClick={() => setData({ ...data, quality: grade })}
              className={`flex-1 py-2 rounded-xl font-black transition-all ${
                data.quality === grade
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
        {submitting ? 'Publishing...' : 'Publish Listing'}
      </button>
    </motion.form>
  );
}