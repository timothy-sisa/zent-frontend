// src/context/AuthContext.jsx
// Provides global auth state (user, login, logout) to all components.

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Wrap the app with this so any child can call useAuth().
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Store user after a successful login or register response.
  const login = (userData) => setUser(userData);

  // Clear user — backend session destroyed by POST /api/auth/logout.
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth state.
export function useAuth() {
  return useContext(AuthContext);
}
