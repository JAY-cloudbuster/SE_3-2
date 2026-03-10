import React, { useState, useEffect } from 'react';
import RatingStars from './RatingStars';
import api from '../services/api';

export default function ViewFarmerProfile({ farmerId, onClose }) {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const res = await api.get(`/user/${farmerId}`);
        setFarmer(res.data);
      } catch (error) {
        console.error("Failed to fetch farmer profile", error);
      } finally {
        setLoading(false);
      }
    };
    if (farmerId) fetchFarmer();
  }, [farmerId]);

  if (!farmerId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        {loading ? (
          <div className="text-center text-slate-500 py-8">Loading profile...</div>
        ) : farmer ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-black text-emerald-950">{farmer.name}</h2>
              <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                <p className="text-slate-800 font-medium">
                  {farmer.city && farmer.state ? `${farmer.city}, ${farmer.state}` : 'Not provided'}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rating</p>
                <RatingStars ratingAverage={farmer.ratingAverage} ratingCount={farmer.ratingCount} />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About</p>
                <p className="text-slate-700 bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm leading-relaxed">
                  {farmer.bio || 'No bio available.'}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-slate-500 py-8">Profile not found.</div>
        )}
        
        <button 
          onClick={onClose}
          className="w-full mt-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}