// src/components/Navbar.jsx
// Top nav bar — links change based on auth state.
// Author: Timothy Sisa

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Clear session and go home — maps to POST /api/auth/logout in production.
  const handleLogout = () => {
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
