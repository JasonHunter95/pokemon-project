import React from 'react';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ message, onRetry, showRetry = true }) => (
  <div className={styles.errorMessage}>
    <h3>⚠️ Something went wrong</h3>
    <p>{message}</p>
    {showRetry && onRetry && (
      <button onClick={onRetry} className={styles.retryButton}>
        🔄 Retry
      </button>
    )}
  </div>
);

export default ErrorMessage;
