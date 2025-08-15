import React from 'react';
import './TypeButton.css';

export default function TypeButton({ type, color, selected, onClick }) {
  return (
    <button
      className={`type-button${selected ? ' selected' : ''}`}
      style={{ backgroundColor: color }}
      onClick={() => onClick(type)}
    >
      {type}
    </button>
  );
}
