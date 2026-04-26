// src/pages/NotFoundPage.jsx
// 404 — shown when a route does not exist.
// Author: Adarsh Pandit

import { Link } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="notfound-page">
      <h1 className="notfound-code">404</h1>
      <p className="notfound-msg">This page doesn't exist.</p>
      <Link to="/" className="notfound-btn">Go back home</Link>
    </div>
  );
}

export default NotFoundPage;
