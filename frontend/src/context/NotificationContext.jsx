import React, { createContext, useCallback, useContext, useEffect, useRef, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';
import { notificationService } from '../services/notificationService';

export const NotificationContext = createContext(null);

// Fallback poll interval — catches any notifications the socket might have missed
const POLL_INTERVAL_MS = 15_000;

export function NotificationProvider({ children }) {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupQueue, setPopupQueue] = useState([]);
  const [activePopup, setActivePopup] = useState(null);
  const [popupPhase, setPopupPhase] = useState('idle');

  // Tracks notification IDs already processed — prevents duplicate popups
  // when polling and socket events overlap for the same notification.
  const knownIdsRef = useRef(new Set());

  const queuePopup = useCallback((notification) => {
    setPopupQueue((prev) => {
      if (prev.some((item) => String(item._id) === String(notification._id))) return prev;
      return [...prev, notification];
    });
  }, []);

  // --- Initial fetch on login ---
  useEffect(() => {
    if (!user?._id) {
      setNotifications([]);
      setPopupQueue([]);
      setActivePopup(null);
      setPopupPhase('idle');
      knownIdsRef.current = new Set();
      return;
    }

    let cancelled = false;
    setLoading(true);

    notificationService
      .getMyNotifications()
      .then((res) => {
        if (cancelled) return;
        const list = res.data?.notifications || [];
        // Register all IDs as known before showing initial popups
        list.forEach((n) => knownIdsRef.current.add(String(n._id)));
        setNotifications(list);
        // Show popup for up to 2 initial unread notifications
        list
          .filter((n) => !n.isRead)
          .slice(0, 2)
          .reverse()
          .forEach(queuePopup);
      })
      .catch(() => {
        if (!cancelled) setNotifications([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?._id, queuePopup]);

  // --- Silent polling fallback every 15s ---
  // Refreshes the notification list from the API. This catches any notification
  // that the socket might have missed (disconnect, reconnect races, etc.).
  // Polling does NOT trigger popups — only real-time socket events do.
  useEffect(() => {
    if (!user?._id) return;

    const poll = () => {
      notificationService
        .getMyNotifications()
        .then((res) => {
          const list = res.data?.notifications || [];
          list.forEach((n) => knownIdsRef.current.add(String(n._id)));
          setNotifications(list);
        })
        .catch(() => {});
    };

    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [user?._id]);

  // --- Real-time: listen ONLY for 'notification_created' ---
  // The backend always emits this event for every notification.
  // Listening to a single event avoids the double-invocation that happened
  // when we also listened to the per-role events (farmer_new_bid, etc.).
  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleIncoming = (payload) => {
      if (!payload?._id) return;
      const id = String(payload._id);

      // Only show popup if this ID hasn't been seen yet (guards against
      // rare cases where both socket and poll deliver the same notification)
      const isNew = !knownIdsRef.current.has(id);
      knownIdsRef.current.add(id);

      setNotifications((prev) => {
        const exists = prev.some((item) => String(item._id) === id);
        if (exists) {
          return prev.map((item) =>
            String(item._id) === id ? { ...item, ...payload } : item
          );
        }
        return [payload, ...prev];
      });

      if (isNew && !payload.isRead) {
        queuePopup(payload);
      }
    };

    socket.on('notification_created', handleIncoming);
    return () => socket.off('notification_created', handleIncoming);
  }, [socket, user?._id, queuePopup]);

  // --- Popup dequeue ---
  useEffect(() => {
    if (activePopup || popupQueue.length === 0) return;
    const [nextPopup, ...rest] = popupQueue;
    setPopupQueue(rest);
    setActivePopup(nextPopup);
    setPopupPhase('visible');
  }, [activePopup, popupQueue]);

  // --- Popup timer ---
  useEffect(() => {
    if (!activePopup) return;
    const t1 = setTimeout(() => setPopupPhase('whoosh'), 3000);
    const t2 = setTimeout(() => {
      setActivePopup(null);
      setPopupPhase('idle');
    }, 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activePopup]);

  const markOneAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((item) => (String(item._id) === String(id) ? { ...item, isRead: true } : item))
    );
    try {
      await notificationService.markRead(id);
    } catch {
      setNotifications((prev) =>
        prev.map((item) => (String(item._id) === String(id) ? { ...item, isRead: false } : item))
      );
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const previous = notifications;
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    try {
      await notificationService.markAllRead();
    } catch {
      setNotifications(previous);
    }
  }, [notifications]);

  const unreadCount = useMemo(
    () => notifications.reduce((acc, item) => acc + (item.isRead ? 0 : 1), 0),
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      activePopup,
      popupPhase,
      markOneAsRead,
      markAllAsRead,
    }),
    [notifications, unreadCount, loading, activePopup, popupPhase, markOneAsRead, markAllAsRead]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
