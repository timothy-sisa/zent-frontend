// src/components/LoadingSpinner.jsx
// Full-area loading indicator — drop in wherever a fetch is pending.
// Author: Adarsh Pandit

import './LoadingSpinner.css';

// Props: size ("sm" | "md" | "lg"), message (optional label).
function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  return (
    <div className={`spinner-wrapper spinner-${size}`} role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
