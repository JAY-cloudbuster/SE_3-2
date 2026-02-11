/**
 * @fileoverview Sidebar Navigation Component for AgriSahayak Frontend
 * 
 * Fixed left sidebar that provides role-based navigation links.
 * - FARMER role: Overview, My Crops, Marketplace, My Orders, Market Prices, Get Verified
 * - BUYER role: Discover, My Orders
 * 
 * Includes the AgriTech logo, animated NavLinks with active tab indicator,
 * and a logout button styled as a user badge.
 * Hidden on standalone pages and mobile viewports (lg: breakpoint).
 * 
 * @component Sidebar
 * @param {Object} props
 * @param {string} props.role - User role: 'FARMER' or 'BUYER'
 * 
 * @see Epic 1, Story 1.8 - Role-Based Dashboard Navigation
 * @see App.jsx - Controls visibility based on route and auth status
 */
import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, BarChart2, ShieldCheck, Sprout, Store } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { T } from '../../context/TranslationContext';

export default function Sidebar({ role }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
    logout();
  };

  const links = role === 'FARMER' ? [
    { to: '/dashboard/farmer', icon: <Home size={20} />, label: 'Overview' },
    { to: '/dashboard/farmer/inventory', icon: <ShoppingBag size={20} />, label: 'My Crops' },
    { to: '/marketplace', icon: <Store size={20} />, label: 'Marketplace' },
    { to: '/dashboard/farmer/orders', icon: <ShoppingBag size={20} />, label: 'My Orders' },
    { to: '/dashboard/farmer/analytics', icon: <BarChart2 size={20} />, label: 'Market Prices' },
    { to: '/profile/verify', icon: <ShieldCheck size={20} />, label: 'Get Verified' },
  ] : [
    { to: '/dashboard/buyer', icon: <Home size={20} />, label: 'Discover' },
    { to: '/dashboard/buyer/orders', icon: <ShoppingBag size={20} />, label: 'My Orders' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-2rem)] fixed left-4 top-4 bottom-4 z-40">
      <div className="h-full glass-card flex flex-col p-6">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3 mb-10 px-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-500/20">
            <Sprout size={22} className="fill-white/10" />
          </div>
          <div>
            <span className="block font-bold text-emerald-950 text-lg tracking-tight leading-none"><T>AgriTech</T></span>
            <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest"><T>Workspace</T></span>
          </div>
        </motion.div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          {links.map((link, index) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
            >
              <NavLink
                to={link.to}
                end={link.to === '/dashboard/farmer' || link.to === '/dashboard/buyer'}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 relative group overflow-hidden ${isActive
                    ? 'text-emerald-900 bg-emerald-50/80 shadow-sm shadow-emerald-100/50'
                    : 'text-slate-500 hover:text-emerald-700 hover:bg-white/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {link.icon}
                    </div>
                    <span className="relative z-10"><T>{link.label}</T></span>
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* User Badge / Footer */}
        <div className="mt-auto pt-6 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-100 flex items-center gap-3 hover:bg-rose-50 hover:border-rose-100 transition-all group"
            title="Click to Switch Account (Logout)"
          >
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm border-2 border-white shadow-sm group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
              {role[0]}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 group-hover:text-rose-900"><T>Logged in as</T></p>
              <p className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase group-hover:text-rose-600"><T>{role}</T></p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
