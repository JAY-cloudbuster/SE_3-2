import { useContext, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationContext } from '../../context/NotificationContext';
import LanguageSelector from '../common/LanguageSelector';
import { T } from '../../context/TranslationContext';
import { Bell, Search, Menu, CheckCheck, Package, ShieldCheck, TrendingUp } from 'lucide-react';

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getNotificationIcon(type) {
  if (type === 'bid') return Package;
  if (type === 'buy') return TrendingUp;
  if (type === 'message') return ShieldCheck;
  return Bell;
}

function getNotificationIconStyle(type) {
  if (type === 'bid') return 'bg-blue-100 text-blue-600';
  if (type === 'buy') return 'bg-emerald-100 text-emerald-600';
  if (type === 'message') return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-500';
}

export default function Navbar() {
  const {
    notifications,
    unreadCount,
    activePopup,
    popupPhase,
    markOneAsRead,
    markAllAsRead,
  } = useContext(NotificationContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [whooshVector, setWhooshVector] = useState({ x: 0, y: 0 });

  const dropdownRef = useRef(null);
  const bellButtonRef = useRef(null);
  const popupRef = useRef(null);

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

  useEffect(() => {
    if (popupPhase !== 'whoosh' || !popupRef.current || !bellButtonRef.current) return;

    const popupRect = popupRef.current.getBoundingClientRect();
    const bellRect = bellButtonRef.current.getBoundingClientRect();

    const popupCenterX = popupRect.left + popupRect.width / 2;
    const popupCenterY = popupRect.top + popupRect.height / 2;
    const bellCenterX = bellRect.left + bellRect.width / 2;
    const bellCenterY = bellRect.top + bellRect.height / 2;

    setWhooshVector({
      x: bellCenterX - popupCenterX,
      y: bellCenterY - popupCenterY,
    });
  }, [popupPhase, activePopup?._id]);

  return (
    <motion.nav
      className="sticky top-4 z-30 px-4 mb-8"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="glass-card px-6 py-3 flex justify-between items-center rounded-2xl">
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

        <div className="flex items-center gap-3 md:gap-5">
          <LanguageSelector />
          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          <div className="relative" ref={dropdownRef}>
            <button
              ref={bellButtonRef}
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative p-2.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4.5 h-4.5 bg-rose-500 rounded-full ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-white">
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
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm"><T>Notifications</T></h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <CheckCheck size={14} />
                        <T>Mark all read</T>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell className="mx-auto text-slate-300 mb-2" size={32} />
                        <p className="text-sm text-slate-500 font-medium"><T>No notifications</T></p>
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const isRead = !!notification.isRead;
                        const NotificationIcon = getNotificationIcon(notification.type);

                        return (
                          <div
                            key={notification._id}
                            onClick={() => {
                              if (!isRead) markOneAsRead(notification._id);
                            }}
                            className={`px-4 py-3 flex gap-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!isRead ? 'bg-emerald-50/40' : ''}`}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${getNotificationIconStyle(notification.type)}`}>
                              <NotificationIcon size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-bold text-slate-800 truncate">{notification.title}</p>
                                {!isRead && <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />}
                              </div>
                              <p className="text-xs text-slate-500 truncate">{notification.message}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{timeAgo(notification.createdAt)}</p>
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

          <AnimatePresence>
            {activePopup && (
              <motion.div
                ref={popupRef}
                initial={{ opacity: 0, y: -16, x: 28, scale: 0.96 }}
                animate={
                  popupPhase === 'whoosh'
                    ? { opacity: 0.15, x: whooshVector.x, y: whooshVector.y, scale: 0.24 }
                    : { opacity: 1, y: 0, x: 0, scale: 1 }
                }
                exit={{ opacity: 0, y: -12, scale: 0.9 }}
                transition={{ duration: popupPhase === 'whoosh' ? 0.55 : 0.25, ease: 'easeInOut' }}
                className="fixed top-6 right-6 z-70 w-[320px] rounded-2xl border border-emerald-100 bg-white/95 shadow-2xl backdrop-blur-md p-4 pointer-events-none"
              >
                <p className="text-xs font-black text-emerald-700 uppercase tracking-wide">{activePopup.title}</p>
                <p className="text-sm font-semibold text-slate-700 mt-1 leading-snug">{activePopup.message}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}
