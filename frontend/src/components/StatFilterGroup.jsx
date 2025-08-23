import React from 'react';
import StatSlider from './StatSlider';
import styles from './StatFilterGroup.module.css';

const StatFilterGroup = ({ stats, onStatsChange, onClear }) => {
  const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];

  const handleStatChange = (statName, newValue) => {
    onStatsChange({
      ...stats,
      [statName]: newValue,
    });
  };

  const handleClearStats = () => {
    onClear();
  };

  const hasActiveFilters = Object.keys(stats).length > 0;

  return (
    <div className={styles.statFilterGroup}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filter by Stats</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearStats}
            className={styles.clearButton}
            aria-label="Clear stat filters"
          >
            Clear Stats
          </button>
        )}
      </div>

      <div className={styles.sliders}>
        {statNames.map((statName) => (
          <StatSlider
            key={statName}
            statName={statName}
            value={stats[statName] || { min: 5, max: 255 }}
            onChange={(newValue) => handleStatChange(statName, newValue)}
          />
        ))}
      </div>
    </div>
  );
};

export default StatFilterGroup;
