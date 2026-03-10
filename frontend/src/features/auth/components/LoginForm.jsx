import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { T, useTranslation } from '../../../context/TranslationContext';
import LanguageSelector from '../../../components/common/LanguageSelector';
import { authService } from '../../../services/authService';
import { getRoleHomePath } from '../../../utils/authRedirect';
import toast from 'react-hot-toast';
import { Eye, EyeOff, ShieldCheck, KeyRound, Smartphone } from 'lucide-react';

const calcStrength = (pwd) => {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[a-z]/.test(pwd)) s++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) s++;
  return s;
};

const strengthLabel = (s) => {
  if (s <= 1) return { text: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' };
  if (s === 2) return { text: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
  return { text: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500' };
};

const isPasswordValid = (pwd) =>
  pwd.length >= 8 && /[A-Z]/.test(pwd) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

export default function LoginForm() {
  const [mode, setMode] = useState('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [activateEmail, setActivateEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [userId, setUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const { changeLanguage } = useTranslation();
  const navigate = useNavigate();

  const strength = calcStrength(newPassword);
  const strengthInfo = strengthLabel(strength);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login({ phone, password });
      login(res.data);
      if (res.data.user.language) changeLanguage(res.data.user.language);
      toast.success('Login successful! Welcome back.');
      navigate(getRoleHomePath(res.data.user.role));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.adminLogin({ email: adminEmail, password: adminPassword });
      login(res.data);
      if (res.data.user.language) changeLanguage(res.data.user.language);
      toast.success('Admin login successful!');
      navigate(getRoleHomePath(res.data.user.role));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.activateAccount({ email: activateEmail, password: tempPassword });
      setUserId(res.data.userId);
      setMode('set-password');
      toast.success('Credentials verified! Set your new password.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Activation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (!isPasswordValid(newPassword)) {
      return toast.error('Password must be 8+ chars with uppercase & special symbol.');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    setLoading(true);
    try {
      await authService.setNewPassword({ userId, newPassword });
      setMode('verify-otp');
      toast.success('OTP sent to your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to set password.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.verifyOTP({ userId, otp });
      toast.success('Account activated! Login with your phone number & new password.');
      setMode('login');
      setOtp('');
      setUserId(null);
      setNewPassword('');
      setConfirmPassword('');
      setActivateEmail('');
      setTempPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await authService.resendOTP({ userId });
      toast.success('OTP resent to your email.');
    } catch {
      toast.error('Failed to resend OTP.');
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setLoading(false);
  };

  const ModeToggle = () => (
    <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
      {[
        { key: 'login', icon: <Smartphone size={14} />, label: 'Login' },
        { key: 'activate', icon: <KeyRound size={14} />, label: 'Activate' },
        { key: 'admin-login', icon: <ShieldCheck size={14} />, label: 'Admin' },
      ].map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => switchMode(item.key)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
            mode === item.key || (item.key === 'activate' && (mode === 'set-password' || mode === 'verify-otp'))
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );

  const EyeToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
      tabIndex={-1}
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-10">
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
            {mode === 'login' && 'Login with your phone number and password to access your dashboard.'}
            {mode === 'admin-login' && 'Admin login uses email and password credentials.'}
            {(mode === 'activate' || mode === 'set-password' || mode === 'verify-otp') &&
              'First-time users must activate their account using the email and temporary password sent by the admin.'}
          </p>
        </div>
        <div className="glass-card p-8 md:p-10 w-full max-w-md mr-auto order-1 md:order-2 animate-slide-up max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
            {mode === 'login' && <T>Welcome back</T>}
            {mode === 'admin-login' && <T>Admin Login</T>}
            {mode === 'activate' && <T>Activate Account</T>}
            {mode === 'set-password' && <T>Set New Password</T>}
            {mode === 'verify-otp' && <T>Verify OTP</T>}
          </h2>
          <p className="text-slate-400 mb-4 text-[11px] uppercase font-black tracking-[0.25em]">
            {mode === 'login' && 'Phone number + password'}
            {mode === 'admin-login' && 'Email + password'}
            {mode === 'activate' && 'Email + temporary password'}
            {mode === 'set-password' && 'Create a strong password'}
            {mode === 'verify-otp' && 'Enter the 6-digit OTP from your email'}
          </p>
          <ModeToggle />

          {mode === 'login' && (
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="label-text"><T>Phone Number</T></label>
                <input type="tel" required placeholder="e.g. 9876543210" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="label-text"><T>Password</T></label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••" className="input-field pr-10" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-500/25">
                {loading ? 'Logging in...' : <T>Login</T>}
              </button>
            </form>
          )}

          {mode === 'admin-login' && (
            <form className="space-y-5" onSubmit={handleAdminLogin}>
              <div>
                <label className="label-text"><T>Admin Email</T></label>
                <input type="email" required placeholder="admin@example.com" className="input-field" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
              </div>
              <div>
                <label className="label-text"><T>Password</T></label>
                <div className="relative">
                  <input type={showAdminPassword ? 'text' : 'password'} required placeholder="••••••••" className="input-field pr-10" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
                  <EyeToggle show={showAdminPassword} onToggle={() => setShowAdminPassword(!showAdminPassword)} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full bg-gradient-to-br from-slate-700 to-slate-900 shadow-slate-500/25">
                {loading ? 'Logging in...' : <T>Admin Login</T>}
              </button>
            </form>
          )}

          {mode === 'activate' && (
            <form className="space-y-5" onSubmit={handleActivate}>
              <div>
                <label className="label-text"><T>Email</T></label>
                <input type="email" required placeholder="your@email.com" className="input-field" value={activateEmail} onChange={(e) => setActivateEmail(e.target.value)} />
              </div>
              <div>
                <label className="label-text"><T>Temporary Password</T></label>
                <div className="relative">
                  <input type={showTempPassword ? 'text' : 'password'} required placeholder="From your email" className="input-field pr-10" value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} />
                  <EyeToggle show={showTempPassword} onToggle={() => setShowTempPassword(!showTempPassword)} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-500/25">
                {loading ? 'Verifying...' : <T>Verify & Continue</T>}
              </button>
            </form>
          )}

          {mode === 'set-password' && (
            <form className="space-y-5" onSubmit={handleSetPassword}>
              <div>
                <label className="label-text"><T>New Password</T></label>
                <div className="relative">
                  <input type={showNewPassword ? 'text' : 'password'} required placeholder="Min 8 chars, uppercase & symbol" className="input-field pr-10" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <EyeToggle show={showNewPassword} onToggle={() => setShowNewPassword(!showNewPassword)} />
                </div>
                {newPassword && (
                  <>
                    <div className="flex gap-1 h-1.5 mt-2">
                      {[1, 2, 3, 4].map((level) => (
                        <div key={level} className={`flex-1 rounded-full transition-all duration-300 ${level <= strength ? strengthInfo.color : 'bg-slate-100'}`} />
                      ))}
                    </div>
                    <p className={`text-[10px] font-bold mt-1 text-right ${strengthInfo.textColor}`}>{strengthInfo.text}</p>
                  </>
                )}
              </div>
              <div>
                <label className="label-text"><T>Confirm Password</T></label>
                <input type="password" required placeholder="Re-enter password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">Passwords do not match</p>
                )}
              </div>
              <button type="submit" disabled={loading || !isPasswordValid(newPassword) || newPassword !== confirmPassword} className="btn-primary w-full bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-500/25 disabled:opacity-50">
                {loading ? 'Setting password...' : <T>Set Password & Get OTP</T>}
              </button>
            </form>
          )}

          {mode === 'verify-otp' && (
            <form className="space-y-5" onSubmit={handleVerifyOTP}>
              <div>
                <label className="label-text"><T>Enter 6-digit OTP</T></label>
                <input type="text" required maxLength={6} placeholder="123456" className="input-field text-center text-2xl font-bold tracking-[0.5em]" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} />
                <p className="text-[10px] text-slate-400 mt-1 text-right">OTP expires in 5 minutes</p>
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-500/25 disabled:opacity-50">
                {loading ? 'Verifying...' : <T>Verify OTP</T>}
              </button>
              <button type="button" onClick={handleResendOTP} className="w-full text-xs text-emerald-700 font-bold hover:underline">
                <T>Resend OTP</T>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
