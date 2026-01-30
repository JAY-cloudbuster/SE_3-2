import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../services/authService';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    role: 'FARMER',
    phone: '',
    password: '',
    language: 'en',
    avatarUrl: 'avatar_1.png',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authService.register(formData);
    // After successful registration, guide user clearly to Login
    navigate('/login?registered=1');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
      {/* Soft radial accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-80 h-80 rounded-full bg-emerald-700/25 blur-3xl" />
      </div>

      <div className="relative z-10 grid max-w-5xl w-full grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <p className="inline-flex items-center text-[11px] font-black tracking-[0.25em] uppercase text-emerald-700 bg-emerald-50/80 rounded-full px-4 py-1 border border-emerald-100">
            AgriTech Marketplace
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-emerald-950">
            Grow trust between{' '}
            <span className="text-emerald-600">farmers</span> and{' '}
            <span className="text-emerald-600">buyers</span>.
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium max-w-md">
            Create a role-based profile in under a minute and unlock live
            pricing, trusted identities, and a modern trading experience.
          </p>
        </div>

        <div className="glass-card p-8 md:p-10 w-full max-w-md ml-auto animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-black text-emerald-900 mb-2">
            Create account
          </h2>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-6">
            Step 1 · Choose your role & set credentials
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {['FARMER', 'BUYER'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r })}
                  className={`flex-1 py-2 rounded-xl text-xs font-black tracking-wide ${
                    formData.role === r
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-500'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <input
              type="tel"
              required
              placeholder="Phone number"
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <button type="submit" className="btn-primary w-full mt-1">
              Continue
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-slate-500">
            Already registered?{' '}
            <Link
              to="/login"
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}