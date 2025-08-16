import React from 'react';
import styles from './TypeButton.module.css';

export default function TypeButton({ type, color, selected, onClick }) {
  const buttonClass = `${styles['type-button']} ${selected ? styles.selected : ''}`.trim();

  return (
    <button
      className={buttonClass}
      style={{ backgroundColor: color }}
      onClick={() => onClick(type)}
    >
      {type}
    </button>
  );
}
