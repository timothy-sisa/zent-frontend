// src/components/ProtectedRoute.jsx
// Redirects unauthenticated users to login.
// Author: Timothy Sisa

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // No active session — send to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
