import { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import LanguagePicker from '../common/LanguagePicker';
import { LogOut, User, Bell, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <motion.nav
      className="bg-white/90 backdrop-blur-lg border-b border-emerald-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 p-2 rounded-xl text-white font-black shadow-lg">
          AG
        </div>
        <span className="font-black text-emerald-900 tracking-tight text-lg">AgriTech</span>
      </div>

      <div className="flex items-center gap-4">
        <LanguagePicker />
        
        <button className="relative p-2 text-slate-600 hover:bg-emerald-50 rounded-full transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl">
          <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
            <User size={14} />
          </div>
          <span className="text-sm font-bold uppercase text-emerald-900">{user?.role}</span>
        </div>

        <button
          onClick={logout}
          className="text-rose-500 hover:bg-rose-50 p-2 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </motion.nav>
  );
}