// src/components/Footer.jsx
// Site footer shown on every page.
// Author: Timothy Sisa

import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-brand">ZENT</span>
        <p className="footer-text">Centralized Academic Resource Platform</p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/resources">Browse</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
