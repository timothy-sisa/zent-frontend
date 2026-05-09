// src/context/AuthContext.jsx
// Provides global auth state (user, login, logout) to all components.

import { createContext, useContext, useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

// Wrap the app with this so any child can call useAuth().
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Store user after a successful login or register response.
  const login = (userData) => setUser(userData);

  // Clear user — backend session destroyed by POST /api/auth/logout.
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth state.
export function useAuth() {
  return useContext(AuthContext);
}
