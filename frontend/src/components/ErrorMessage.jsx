import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry, showRetry = true }) => (
  <div className="error-message">
    <h3>⚠️ Something went wrong</h3>
    <p>{message}</p>
    {showRetry && onRetry && (
      <button onClick={onRetry} className="retry-button">
        🔄 Retry
      </button>
    )}
  </div>
);

export default ErrorMessage;
