// frontend/src/components/LoadingSpinner.jsx
import React from 'react';
import styles from './LoadingSpinner.module.css'; // Import as a module

const LoadingSpinner = () => (
  <div className={styles['loading-spinner']}>
    <div className={styles.spinner}></div>
    <p>Loading Pokemon...</p>
  </div>
);

export default LoadingSpinner;
