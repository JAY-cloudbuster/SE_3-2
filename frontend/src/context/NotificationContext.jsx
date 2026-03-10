import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { notificationService } from '../services/notificationService';

export const NotificationContext = createContext(null);

const POLL_INTERVAL_MS = 15_000;

export function NotificationProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupQueue, setPopupQueue] = useState([]);
  const [activePopup, setActivePopup] = useState(null);
  const [popupPhase, setPopupPhase] = useState('idle');
  const knownIdsRef = useRef(new Set());

  const queuePopup = useCallback((notification) => {
    setPopupQueue((prev) => {
      if (prev.some((item) => String(item._id) === String(notification._id))) return prev;
      return [...prev, notification];
    });
  }, []);

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
        list.forEach((n) => knownIdsRef.current.add(String(n._id)));
        setNotifications(list);

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

  useEffect(() => {
    if (!user?._id) return;

    const poll = () => {
      notificationService
        .getMyNotifications()
        .then((res) => {
          const list = res.data?.notifications || [];
          const newUnread = list.filter(
            (n) => !n.isRead && !knownIdsRef.current.has(String(n._id))
          );

          list.forEach((n) => knownIdsRef.current.add(String(n._id)));
          setNotifications(list);

          newUnread
            .slice(0, 2)
            .reverse()
            .forEach(queuePopup);
        })
        .catch(() => {});
    };

    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [user?._id, queuePopup]);

  useEffect(() => {
    if (activePopup || popupQueue.length === 0) return;
    const [nextPopup, ...rest] = popupQueue;
    setPopupQueue(rest);
    setActivePopup(nextPopup);
    setPopupPhase('visible');
  }, [activePopup, popupQueue]);

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
