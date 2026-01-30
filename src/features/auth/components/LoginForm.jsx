import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { authService } from '../../../services/authService';

export default function LoginForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const justRegistered = new URLSearchParams(location.search).get('registered') === '1';

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await authService.login({ phone, password });
    login(res.data);
    navigate(`/dashboard/${res.data.user.role.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-emerald-700/25 blur-3xl" />
      </div>

      <div className="relative z-10 grid max-w-5xl w-full grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 order-2 md:order-1">
          <p className="inline-flex items-center text-[11px] font-black tracking-[0.25em] uppercase text-emerald-700 bg-emerald-50/80 rounded-full px-4 py-1 border border-emerald-100">
            Secure access
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-emerald-950">
            Sign in to your{' '}
            <span className="text-emerald-600">AgriTech</span> workspace.
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-md">
            Use the same phone number you registered with. Buyers start with
            <span className="font-semibold"> “1”</span>, all other numbers log you in as a farmer.
          </p>
        </div>

        <div className="glass-card p-8 md:p-10 w-full max-w-md mr-auto order-1 md:order-2 animate-slide-up">
          {justRegistered && (
            <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-xs font-semibold text-emerald-800">
              Registration successful. Log in to enter your dashboard.
            </div>
          )}

          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
            Welcome back
          </h2>
          <p className="text-slate-400 mb-6 text-[11px] uppercase font-black tracking-[0.25em]">
            Buyer: Starts with “1” · Farmer: Any other number
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="tel"
              required
              placeholder="Phone number"
              className="w-full bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-primary w-full mt-1">
              Log in
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-slate-500">
            New to AgriTech?{' '}
            <Link
              to="/register"
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}