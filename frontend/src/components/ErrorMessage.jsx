import React from 'react';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ message, onRetry, showRetry = true }) => (
  <div className={styles.errorMessage} role="alert" aria-live="polite">
    <h3>⚠️ Something went wrong</h3>
    <p>{message}</p>
    {showRetry && onRetry && (
      <button type="button" onClick={onRetry} className={styles.retryButton}>
        🔄 Retry
      </button>
    )}
  </div>
);

export default ErrorMessage;
