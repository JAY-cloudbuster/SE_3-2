/**
 * @fileoverview Socket.io Context Provider for AgriSahayak Frontend
 * Uses polling→websocket upgrade order for reliable connection.
 * Falls back gracefully — the chat works via REST even if socket is unavailable.
 */

import { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  // Derive socket URL from VITE_API_URL so it works in dev AND production
  const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user) return;

    const newSocket = io(socketUrl, {
      // polling first → upgrade to websocket: the standard robust approach.
      // websocket-only fails silently on some proxies/networks.
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Join the user-specific notification room on every connect/reconnect
    const joinRoom = () => {
      newSocket.emit('join_user_room', String(user._id));
    };
    newSocket.on('connect', joinRoom);
    newSocket.on('reconnect', joinRoom);

    setSocket(newSocket);

    return () => {
      newSocket.off('connect', joinRoom);
      newSocket.off('reconnect', joinRoom);
      newSocket.disconnect();
    };
  }, [user, socketUrl]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};