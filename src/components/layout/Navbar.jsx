import { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import LanguageSelector from '../common/LanguageSelector';
import { T } from '../../context/TranslationContext';
import { LogOut, User, Bell, Search, Menu } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <motion.nav
      className="sticky top-4 z-30 px-4 mb-8"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="glass-card px-6 py-3 flex justify-between items-center rounded-2xl">
        {/* Mobile Menu Trigger & Search */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 text-slate-600 hover:bg-emerald-50 rounded-xl">
            <Menu size={20} />
          </button>

          <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search markets..."
              className="bg-transparent border-none outline-none text-sm w-48 text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          <LanguageSelector />

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          <button className="relative p-2.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          <motion.div
            className="flex items-center gap-3 pl-2 cursor-pointer group"
            onClick={logout}
            whileHover={{ scale: 1.02 }}
            title="Click to Switch Account"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800 leading-tight group-hover:text-rose-600 transition-colors">Agri User</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider group-hover:text-rose-500 transition-colors">{user?.role}</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-100 to-teal-50 p-1 rounded-full border-2 border-white shadow-sm group-hover:from-rose-100 group-hover:to-pink-50 transition-colors">
              <div className="bg-emerald-600 text-white p-2 rounded-full group-hover:bg-rose-500 transition-colors">
                <User size={20} />
              </div>
            </div>
            <LogOut size={20} className="ml-2 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
