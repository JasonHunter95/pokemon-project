import React, { useMemo } from 'react';
import styles from './StatSlider.module.css';

const MIN_STAT = 5;
const MAX_STAT = 255;

const StatSlider = ({ statName, value, onChange }) => {
  // Format stat name for display (e.g., "special-attack" -> "Special Attack")
  const displayName = useMemo(
    () =>
      statName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    [statName]
  );

  const clamp = (val) => Math.min(Math.max(val, MIN_STAT), MAX_STAT);

  const handleMinChange = (event) => {
    const parsed = clamp(parseInt(event.target.value, 10) || MIN_STAT);
    const nextMin = Math.min(parsed, value.max);
    if (nextMin !== value.min) {
      onChange({ ...value, min: nextMin });
    }
  };

  const handleMaxChange = (event) => {
    const parsed = clamp(parseInt(event.target.value, 10) || MAX_STAT);
    const nextMax = Math.max(parsed, value.min);
    if (nextMax !== value.max) {
      onChange({ ...value, max: nextMax });
    }
  };

  const [minPercent, highlightWidth] = useMemo(() => {
    const range = MAX_STAT - MIN_STAT;
    const minPct = ((value.min - MIN_STAT) / range) * 100;
    const maxPct = ((value.max - MIN_STAT) / range) * 100;
    return [minPct, maxPct, Math.max(maxPct - minPct, 0)];
  }, [value.min, value.max]);

  const sliderIdBase = `stat-${statName}`;

  return (
    <div className={styles.statSlider}>
      <div className={styles.header}>
        <label className={styles.label} htmlFor={`${sliderIdBase}-min`}>
          {displayName}
        </label>
        <div className={styles.valueLabel}>
          <span>{value.min}</span>
          <span aria-hidden="true">–</span>
          <span>{value.max}</span>
        </div>
      </div>

      <div className={styles.sliderWrapper}>
        <div className={styles.track} />
        <div
          className={styles.highlight}
          style={{ left: `${minPercent}%`, width: `${highlightWidth}%` }}
        />

        <input
          type="range"
          min={MIN_STAT}
          max={MAX_STAT}
          step="1"
          value={value.min}
          onChange={handleMinChange}
          className={`${styles.range} ${styles.rangeMin}`}
          aria-label={`${displayName} minimum`}
          id={`${sliderIdBase}-min`}
        />

        <input
          type="range"
          min={MIN_STAT}
          max={MAX_STAT}
          step="1"
          value={value.max}
          onChange={handleMaxChange}
          className={`${styles.range} ${styles.rangeMax}`}
          aria-label={`${displayName} maximum`}
          id={`${sliderIdBase}-max`}
        />
      </div>

      <div className={styles.scale}>
        <span>{MIN_STAT}</span>
        <span>{MAX_STAT}</span>
      </div>
    </div>
  );
};

export default StatSlider;
