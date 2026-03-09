/**
 * @fileoverview Top Navigation Bar Component for AgriSahayak Frontend
 * 
 * Renders a sticky glass-morphism navigation bar at the top of dashboard pages.
 * Contains a search input, language selector, interactive notification bell
 * with dropdown, and user actions.
 * Hidden on standalone pages (auth, negotiation, trade dashboard, buy now).
 * 
 * @component Navbar
 * @see App.jsx - Controls visibility based on route and auth status
 * @see LanguageSelector - Embedded language switching dropdown
 */
import { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import LanguageSelector from '../common/LanguageSelector';
import { T } from '../../context/TranslationContext';
import { Bell, Search, Menu, CheckCheck, Package, ShieldCheck, TrendingUp } from 'lucide-react';

// Generate system notifications based on app state
function getNotifications() {
  const notifications = [];

  // Check localStorage for recent orders
  const mockOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
  mockOrders.slice(-5).reverse().forEach((order) => {
    notifications.push({
      id: `order-${order.id}`,
      type: 'order',
      icon: Package,
      title: `Order ${order.id?.slice(-8)?.toUpperCase() || 'NEW'}`,
      message: `${order.cropName} — ${order.quantity}kg ordered`,
      time: order.createdAt ? new Date(order.createdAt) : new Date(),
      read: false,
    });
  });

  // System notifications
  notifications.push({
    id: 'welcome',
    type: 'system',
    icon: ShieldCheck,
    title: 'Welcome to AgriTech',
    message: 'Your account is active and verified.',
    time: new Date(Date.now() - 3600000),
    read: true,
  });

  notifications.push({
    id: 'market-update',
    type: 'market',
    icon: TrendingUp,
    title: 'Market Update',
    message: 'Onion prices are trending up 12% this week.',
    time: new Date(Date.now() - 7200000),
    read: true,
  });

  return notifications;
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('readNotificationIds') || '[]'); }
    catch { return []; }
  });
  const dropdownRef = useRef(null);

  // Load notifications
  useEffect(() => {
    setNotifications(getNotifications());
  }, [showNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const unreadCount = notifications.filter(n => !n.read && !readIds.includes(n.id)).length;

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
    localStorage.setItem('readNotificationIds', JSON.stringify(allIds));
  };

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

          {/* Notification Bell with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-rose-500 rounded-full ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm"><T>Notifications</T></h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <CheckCheck size={14} />
                        <T>Mark all read</T>
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell className="mx-auto text-slate-300 mb-2" size={32} />
                        <p className="text-sm text-slate-500 font-medium"><T>No notifications</T></p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const isRead = n.read || readIds.includes(n.id);
                        const NotifIcon = n.icon;
                        return (
                          <div
                            key={n.id}
                            className={`px-4 py-3 flex gap-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!isRead ? 'bg-emerald-50/40' : ''}`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'order' ? 'bg-blue-100 text-blue-600' :
                                n.type === 'market' ? 'bg-emerald-100 text-emerald-600' :
                                  'bg-slate-100 text-slate-500'
                              }`}>
                              <NotifIcon size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-bold text-slate-800 truncate">{n.title}</p>
                                {!isRead && <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />}
                              </div>
                              <p className="text-xs text-slate-500 truncate">{n.message}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{timeAgo(n.time)}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
