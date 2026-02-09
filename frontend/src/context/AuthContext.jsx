import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.token) {
          setUser(parsedUser.user);
        }
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    // Auth service already sets localStorage 'user'. We just update state.
    // However, if the service just sets the *response*, we need to be careful.
    // My authService sets 'user' = response.data (which is { success, token, user: {...} })
    // So here we set state to data.user

    // Safety: ensure localstorage is set if not already
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};