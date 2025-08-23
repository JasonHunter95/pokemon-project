import React from 'react';
import styles from './StatSlider.module.css';

const StatSlider = ({ statName, value, onChange }) => {
  // Format stat name for display (e.g., "special-attack" -> "Special Attack")
  const displayName = statName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const handleMinChange = (e) => {
    const newMin = Math.max(5, parseInt(e.target.value, 10) || 5);
    if (newMin <= value.max) {
      onChange({ ...value, min: newMin });
    }
  };

  const handleMaxChange = (e) => {
    const newMax = Math.min(255, parseInt(e.target.value, 10) || 255);
    if (newMax >= value.min) {
      onChange({ ...value, max: newMax });
    }
  };

  return (
    <div className={styles.statSlider}>
      <label htmlFor={`${statName}-min`} className={styles.label}>
        {displayName}
      </label>
      <div className={styles.inputs}>
        <input
          type="number"
          id={`${statName}-min`}
          min="5"
          max="255"
          value={value.min}
          onChange={handleMinChange}
          aria-label={`${statName} min value`}
          className={styles.input}
        />
        <span className={styles.separator}>-</span>
        <input
          type="number"
          min="5"
          max="255"
          value={value.max}
          onChange={handleMaxChange}
          aria-label={`${statName} max value`}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default StatSlider;
