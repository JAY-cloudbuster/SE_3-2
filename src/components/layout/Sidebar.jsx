import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, BarChart2, MessageSquare, ShieldCheck, Sprout } from 'lucide-react';

export default function Sidebar({ role }) {
  const links = role === 'FARMER' ? [
    { to: '/dashboard/farmer', icon: <Home size={20} />, label: 'Overview' },
    { to: '/dashboard/farmer/inventory', icon: <ShoppingBag size={20} />, label: 'My Crops' },
    { to: '/dashboard/farmer/analytics', icon: <BarChart2 size={20} />, label: 'Market Prices' },
    { to: '/profile/verify', icon: <ShieldCheck size={20} />, label: 'Get Verified' },
  ] : [
    { to: '/dashboard/buyer', icon: <Home size={20} />, label: 'Discover' },
    { to: '/dashboard/buyer/orders', icon: <ShoppingBag size={20} />, label: 'My Orders' },
  ];

  return (
    <aside className="w-64 h-screen bg-white/95 backdrop-blur-md border-r border-emerald-100 p-6 hidden lg:block shadow-lg">
      {/* Logo */}
      <motion.div
        className="flex items-center gap-2 mb-8 pb-6 border-b border-emerald-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-2 rounded-xl text-white font-black shadow-lg">
          <Sprout size={20} />
        </div>
        <span className="font-black text-emerald-900 tracking-tight text-sm">AgriTech</span>
      </motion.div>

      {/* Navigation Links */}
      <div className="space-y-2">
        {links.map((link, index) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-4 rounded-2xl font-bold transition-all relative ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-200'
                    : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.icon}
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}