/**
 * @fileoverview Authentication Context Provider for AgriSahayak Frontend
 * 
 * This module provides global authentication state management using React Context.
 * It handles user session persistence (via localStorage), login/logout state updates,
 * and exposes the authenticated user data to all child components.
 * 
 * The AuthContext is consumed by:
 * - ProtectedRoute.jsx (to check if user is authenticated and has correct role)
 * - App.jsx (to conditionally render Sidebar/Navbar based on auth state)
 * - Navbar.jsx (to display user info and logout button)
 * - SocketContext.jsx (to establish WebSocket connection when user is logged in)
 * 
 * Data flow:
 * 1. On app load → checks localStorage for existing session
 * 2. On login → stores auth data in localStorage + updates React state
 * 3. On logout → clears localStorage + resets React state to null
 * 
 * @module context/AuthContext
 * @requires react - React library for createContext, useState, useEffect
 * 
 * @see Epic 1, Story 1.2 - Login with Phone & Password
 * @see Epic 1, Story 1.8 - Role-Based Redirect
 * @see Epic 1, Story 1.10 - Secure Logout
 */

import React, { createContext, useState, useEffect } from 'react';

/**
 * AuthContext - React Context for global authentication state.
 * 
 * Provides the following values to consuming components:
 * - user: The authenticated user object (or null if not logged in)
 * - login: Function to set the authenticated user
 * - logout: Function to clear the authenticated user
 * - loading: Boolean indicating if the initial auth check is still in progress
 * 
 * @type {React.Context}
 */
export const AuthContext = createContext();

/**
 * AuthProvider Component
 * 
 * Wraps the entire application (in App.jsx) to provide authentication
 * state to all child components via React Context.
 * 
 * On mount, it checks localStorage for a previously saved session.
 * If a valid session exists (with a token), the user state is restored
 * without requiring a fresh login.
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} AuthContext.Provider wrapping children
 */
export const AuthProvider = ({ children }) => {
  /**
   * Current authenticated user object.
   * Contains: _id, phone, role, name, language
   * Set to null when user is not logged in.
   * @type {Object|null}
   */
  const [user, setUser] = useState(null);

  /**
   * Loading flag for initial authentication check.
   * When true, the app shows a loading screen (see AppContent in App.jsx).
   * Prevents flash of login page for already-authenticated users.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);

  /**
   * Effect: Restore Session on App Load
   * 
   * Runs once on component mount. Checks localStorage for a saved
   * user session (set during previous login). If found and valid
   * (contains a token), restores the user state.
   * 
   * The 'user' key in localStorage stores the full auth response:
   * { success: true, token: "jwt...", user: { _id, phone, role, name, language } }
   */
  useEffect(() => {
    // Attempt to retrieve saved session from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        // Parse the stored JSON string back into an object
        const parsedUser = JSON.parse(savedUser);
        // Only restore session if a valid token exists
        if (parsedUser.token) {
          setUser(parsedUser.user); // Set just the user object (not the full response)
        }
      } catch (e) {
        // Handle corrupted localStorage data gracefully
        console.error("Failed to parse user", e);
      }
    }
    // Mark loading as complete - app can now render the appropriate view
    setLoading(false);
  }, []);

  /**
   * Login Function
   * 
   * Called by LoginForm.jsx after successful authentication.
   * Stores the complete auth response (including JWT token) in localStorage
   * and updates the React state with the user object.
   * 
   * @param {Object} data - The full auth response from the login API
   * @param {string} data.token - JWT token for subsequent API calls
   * @param {Object} data.user - User profile object { _id, phone, role, name, language }
   * 
   * @see Epic 1, Story 1.2 - Login with Phone & Password
   */
  const login = (data) => {
    // Persist the auth data in localStorage for session restoration
    localStorage.setItem('user', JSON.stringify(data));
    // Update React state to trigger re-renders across the app
    setUser(data.user);
  };

  /**
   * Logout Function
   * 
   * Called by the Sidebar's logout button. Clears the JWT token
   * and user data from localStorage, then resets the user state to null.
   * This triggers a re-render that redirects to the login page.
   * 
   * @see Epic 1, Story 1.10 - Secure Logout
   */
  const logout = () => {
    // Remove stored authentication data
    localStorage.removeItem('user');
    // Reset user state to null (triggers redirect to login)
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};