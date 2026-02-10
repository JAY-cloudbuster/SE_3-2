import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { T, useTranslation } from '../../../context/TranslationContext';
import LanguageSelector from '../../../components/common/LanguageSelector';
import { authService } from '../../../services/authService';

export default function LoginForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const { changeLanguage } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const justRegistered = new URLSearchParams(location.search).get('registered') === '1';

  const handleLogin = async (e, role = null) => {
    e.preventDefault();
    try {
      const res = await authService.login({ phone, password });

      const userRole = res.data.user.role;

      // Optional: Check if role matches what they clicked (if we want to enforce it strict)
      // But for now, we trust the DB return. 

      login(res.data);

      // Set language from user profile
      if (res.data.user.language) {
        changeLanguage(res.data.user.language);
      }

      navigate(`/dashboard/${userRole.toLowerCase()}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
      {/* ... keeping existing layout ... */}
      {/* Language Selector - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-emerald-700/25 blur-3xl" />
      </div>

      <div className="relative z-10 grid max-w-5xl w-full grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 order-2 md:order-1">
          <p className="inline-flex items-center text-[11px] font-black tracking-[0.25em] uppercase text-emerald-700 bg-emerald-50/80 rounded-full px-4 py-1 border border-emerald-100">
            <T>Secure access</T>
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-emerald-950">
            <T>Sign in to your</T>{' '}
            <span className="text-emerald-600">AgriTech</span> <T>workspace.</T>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium max-w-md">
            Use the same phone number you registered with. Buyers start with
            <span className="font-semibold"> “1”</span>, all other numbers log you in as a farmer.
          </p>
        </div>

        <div className="glass-card p-8 md:p-10 w-full max-w-md mr-auto order-1 md:order-2 animate-slide-up">
          {justRegistered && (
            <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-xs font-semibold text-emerald-800">
              <T>Registration successful. Log in to enter your dashboard.</T>
            </div>
          )}

          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
            <T>Welcome back</T>
          </h2>
          <p className="text-slate-400 mb-6 text-[11px] uppercase font-black tracking-[0.25em]">
            Buyer: Starts with “1” · Farmer: Any other number
          </p>
          <form className="space-y-5">
            <div>
              <label className="label-text">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                className="input-field"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="label-text">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="input-field"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => handleLogin(e, 'FARMER')}
                className="btn-primary bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-500/25"
              >
                <T>Login as Farmer</T>
              </button>
              <button
                type="button"
                onClick={(e) => handleLogin(e, 'BUYER')}
                className="btn-secondary text-emerald-800 border-emerald-200 hover:bg-emerald-50"
              >
                <T>Login as Buyer</T>
              </button>
            </div>
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