// frontend/src/components/LoadingSpinner.jsx
import React from 'react';
import styles from './LoadingSpinner.module.css'; // Import as a module

const LoadingSpinner = () => (
  <div className={styles['loading-spinner']} role="status" aria-live="polite" aria-busy="true">
    <div className={styles.spinner} aria-hidden="true"></div>
    <p>Loading Pokemon...</p>
  </div>
);

export default LoadingSpinner;
