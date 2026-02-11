/**
 * @fileoverview Registration Form Component for AgriSahayak Frontend
 * 
 * This component renders the user registration page with a multi-field form.
 * Users can register as either FARMER or BUYER with:
 * - Role selection (FARMER/BUYER toggle)
 * - Preferred language selection (13 Indian languages)
 * - Full name, phone number (10-digit), and password
 * - Password strength meter (0-4 scale with visual bar)
 * - Password confirmation with match validation
 * 
 * On successful registration, the user is redirected to the login page
 * with a success notification (?registered=1 query parameter).
 * 
 * The form includes a LanguageSelector in the top-right corner,
 * allowing users to switch the UI language even before registration.
 * All visible text is wrapped in <T> components for automatic translation.
 * 
 * @component RegisterForm
 * @route /register (Public)
 * 
 * @see Epic 1, Story 1.1 - Register as Farmer or Buyer
 * @see Epic 1, Story 1.3 - Select Preferred Language
 * @see Epic 1, Story 1.7 - Password Encryption (handled by backend)
 * @see authService.register() - API call for registration
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { T } from '../../../context/TranslationContext';
import LanguageSelector from '../../../components/common/LanguageSelector';
import { authService } from '../../../services/authService';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    role: 'FARMER',
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    language: 'en',
    avatarUrl: 'avatar_1.png',
  });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-4 scale

  const navigate = useNavigate();

  const calculateStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9!@#$%^&*]/.test(pwd)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, password: val });
    setPasswordStrength(calculateStrength(val));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name.trim()) return setError('Full Name is required');
    if (!/^\d{10}$/.test(formData.phone)) return setError('Phone number must be exactly 10 digits');
    if (formData.password.length < 8) return setError('Password must be at least 8 characters');
    if (passwordStrength < 3) return setError('Password is too weak (use mix of cases & symbols)');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');

    try {
      await authService.register(formData);
      navigate('/login?registered=1');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
      {/* Language Selector - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSelector />
      </div>

      {/* Soft radial accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 w-80 h-80 rounded-full bg-emerald-700/25 blur-3xl" />
      </div>

      <div className="relative z-10 grid max-w-5xl w-full grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <p className="inline-flex items-center text-[11px] font-black tracking-[0.25em] uppercase text-emerald-700 bg-emerald-50/80 rounded-full px-4 py-1 border border-emerald-100">
            <T>AgriTech Marketplace</T>
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-emerald-950">
            <T>Grow trust between</T>{' '}
            <span className="text-emerald-600"><T>farmers</T></span> <T>and</T>{' '}
            <span className="text-emerald-600"><T>buyers</T></span>.
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium max-w-md">
            <T>Create a role-based profile in under a minute and unlock live pricing, trusted identities, and a modern trading experience.</T>
          </p>
        </div>

        <div className="glass-card p-8 md:p-10 w-full max-w-md ml-auto animate-slide-up max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl md:text-3xl font-black text-emerald-900 mb-2">
            <T>Create account</T>
          </h2>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-6">
            <T>Step 1 · Choose your role & set credentials</T>
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text"><T>I am a</T></label>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {['FARMER', 'BUYER'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${formData.role === r
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                      }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label-text"><T>Preferred Language</T></label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="input-field cursor-pointer"
              >
                <option value="en">English (Default)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="ta">Tamil (தமிழ்)</option>
                <option value="te">Telugu (తెలుగు)</option>
                <option value="bn">Bengali (বাংলা)</option>
                <option value="mr">Marathi (मराठी)</option>
                <option value="gu">Gujarati (ગુજરાતી)</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="ml">Malayalam (മലയാളം)</option>
                <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
                <option value="or">Odia (ଓଡ଼ିଆ)</option>
                <option value="as">Assamese (অসমীয়া)</option>
                <option value="ur">Urdu (اردو)</option>
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label-text"><T>Full Name</T></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  className="input-field"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="label-text"><T>Phone Number</T></label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  className="input-field"
                  maxLength={10}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                />
                <p className="text-[10px] text-slate-400 mt-1 text-right">Must be 10 digits</p>
              </div>

              <div>
                <label className="label-text"><T>Password</T></label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 chars, mixed case & symbols"
                  className="input-field mb-2"
                  onChange={handlePasswordChange}
                />
                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="flex gap-1 h-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? getStrengthColor() : 'bg-slate-100'}`}
                      />
                    ))}
                  </div>
                )}
                {formData.password && (
                  <p className="text-[10px] text-slate-400 font-medium text-right">
                    {passwordStrength < 3 ? 'Weak - Add symbols/Capital letters' : 'Strong Password'}
                  </p>
                )}
              </div>

              <div>
                <label className="label-text"><T>Confirm Password</T></label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  className="input-field"
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-4 shadow-emerald-500/25">
              <T>Create Account</T>
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-slate-500">
            <T>Already registered?</T>{' '}
            <Link
              to="/login"
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <T>Log in</T>
            </Link>
          </p>
        </div>
      </div >
    </div >
  );
}