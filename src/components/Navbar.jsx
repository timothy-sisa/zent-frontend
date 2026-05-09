// src/components/Navbar.jsx
// Authors: Timothy Sisa, Alazar Kidane, Adarsh Pandit
// Top nav bar — links change based on auth state.

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const API = import.meta.env.VITE_API_URL;

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Calls POST /api/auth/logout then clears local auth state and redirects home.
  const handleLogout = async () => {
    try {
      await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand — links to home */}
        <Link to="/" className="navbar-brand">ZENT</Link>

        <div className="navbar-links">
          <Link to="/resources">Resources</Link>

          {user ? (
            <>
              {/* Upload link visible only to logged-in users */}
              <Link to="/upload" className="btn-upload">Upload</Link>
              <Link to="/dashboard" className="navbar-username">{user.username}</Link>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
