import React, { useEffect, useState } from 'react';
import RatingStars from '../components/RatingStars';
import ProfileTab from '../components/ProfileTab';

export default function FarmerProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{profile.name}</h1>
        <p className="text-slate-500 mb-4">
          {profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'Location not set'}
        </p>
        <RatingStars ratingAverage={profile.ratingAverage} ratingCount={profile.ratingCount} />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">About Me</h2>
          <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {profile.bio || 'No bio provided.'}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Edit Profile</h2>
        <ProfileTab currentProfile={profile} onSave={(updated) => setProfile({ ...profile, ...updated })} />
      </div>
    </div>
  );
}