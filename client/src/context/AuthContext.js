'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI, logout as logoutAPI, getMe } from '../services/authService';

/**
 * Auth Context
 * 
 * Why Context instead of Redux/Zustand?
 * For auth state (user object + isAuthenticated), Context is sufficient.
 * Redux adds unnecessary complexity for this use case.
 * 
 * This context:
 * 1. Checks if user is logged in on app mount (via getMe)
 * 2. Provides login/register/logout functions to any component
 * 3. Manages loading state to prevent flash of login page
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start true — we're checking auth on mount

  // Check if user is already logged in when the app loads
  // This reads the httpOnly cookie automatically (browser sends it)
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await getMe();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      // Not logged in — that's fine, user will see login page
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await loginAPI(email, password);
    if (data.success) {
      setUser(data.user);
    }
    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerAPI(name, email, password);
    if (data.success) {
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    await logoutAPI();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — cleaner than useContext(AuthContext) everywhere
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
