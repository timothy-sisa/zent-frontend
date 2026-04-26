// src/components/ErrorBanner.jsx
// Inline error alert .
// Author: Adarsh Pandit

import './ErrorBanner.css';

// Props: message (string), onDismiss (optional callback — shows × button).
function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner-shared" role="alert" aria-live="assertive">
      <span className="error-banner-icon" aria-hidden="true">⚠</span>
      <span className="error-banner-text">{message}</span>
      {onDismiss && (
        <button
          className="error-banner-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorBanner;
