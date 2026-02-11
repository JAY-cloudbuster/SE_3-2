/**
 * @fileoverview Socket.io Context Provider for AgriSahayak Frontend
 * 
 * This module provides a React Context for managing the WebSocket connection
 * to the backend Socket.io server. It automatically establishes a connection
 * when a user is authenticated and cleans up the connection on logout.
 * 
 * The socket connection enables real-time features across the platform:
 * - Live auction bidding updates (Epic 4, Story 4.3)
 * - Real-time negotiation chat messages (Epic 4, Story 4.4)
 * - Order status update notifications (Epic 4, Story 4.8)
 * 
 * @module context/SocketContext
 * @requires socket.io-client - Socket.io client library
 * @requires react - React hooks (createContext, useEffect, useState, useContext)
 * @requires context/AuthContext - To check if user is authenticated
 * 
 * @see Epic 4, Story 4.3 - Place Bids (real-time updates)
 * @see Epic 4, Story 4.4 - Negotiate Price (real-time chat)
 * @see backend/server.js - Socket.io server setup
 */

import { createContext, useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

/**
 * SocketContext - React Context for the Socket.io client instance.
 * 
 * The context value is the raw socket instance (or null if not connected).
 * Components can use this to emit events and listen for server messages.
 * 
 * @type {React.Context}
 */
export const SocketContext = createContext();

/**
 * SocketProvider Component
 * 
 * Manages the lifecycle of the Socket.io connection:
 * 1. When user logs in → creates a new socket connection
 * 2. While connected → socket is available via context
 * 3. When user logs out → closes the socket connection (cleanup)
 * 
 * The socket connects to the backend server at http://localhost:5000.
 * 
 * Usage in child components:
 * ```jsx
 * const socket = useContext(SocketContext);
 * socket.emit('join_room', roomId);
 * socket.on('receive_message', handleMessage);
 * ```
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} SocketContext.Provider wrapping children
 */
export const SocketProvider = ({ children }) => {
  // Get the current authenticated user from AuthContext
  const { user } = useContext(AuthContext);

  /**
   * The Socket.io client instance.
   * Null when user is not authenticated or connection hasn't been established.
   * @type {import('socket.io-client').Socket|null}
   */
  const [socket, setSocket] = useState(null);

  /**
   * Effect: Manage Socket Connection Lifecycle
   * 
   * Creates a new Socket.io connection when a user is authenticated.
   * The cleanup function closes the connection when:
   * - The user logs out (user becomes null)
   * - The component unmounts
   * 
   * This prevents orphaned socket connections and memory leaks.
   */
  useEffect(() => {
    if (user) {
      // User is authenticated - establish WebSocket connection
      const newSocket = io('http://localhost:5000'); // Backend Socket.io server URL
      setSocket(newSocket);

      // Cleanup: close the socket when user logs out or component unmounts
      return () => newSocket.close();
    }
  }, [user]); // Re-run when user changes (login/logout)

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};