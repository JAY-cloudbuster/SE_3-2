import React, { useState } from 'react';

export default function ProfileTab({ currentProfile, onSave }) {
  const [city, setCity] = useState(currentProfile?.city || '');
  const [state, setState] = useState(currentProfile?.state || '');
  const [bio, setBio] = useState(currentProfile?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ city, state, bio })
      });
      if (res.ok) {
        const data = await res.json();
        if (onSave) onSave(data);
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">City</label>
          <input 
            type="text" 
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">State</label>
          <input 
            type="text" 
            className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
            value={state} 
            onChange={(e) => setState(e.target.value)} 
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">Bio (Max 200 characters)</label>
        <textarea 
          maxLength="200"
          rows="4"
          className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all" 
          value={bio} 
          onChange={(e) => setBio(e.target.value)} 
        />
        <div className="text-right text-xs font-medium text-slate-400 mt-1.5">
          {bio.length}/200
        </div>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}