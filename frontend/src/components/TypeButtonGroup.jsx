import React, { useState } from 'react';
import TypeButton from './TypeButton';

const POKEMON_TYPES = [
  { type: 'Fire', color: '#EE8130' },
  { type: 'Water', color: '#6390F0' },
  { type: 'Grass', color: '#7AC74C' },
  { type: 'Electric', color: '#F7D02C' },
  { type: 'Psychic', color: '#F95587' },
  { type: 'Dark', color: '#705746' },
  { type: 'Fairy', color: '#D685AD' },
  { type: 'Ghost', color: '#735797' },
  { type: 'Normal', color: '#A8A77A' },
  { type: 'Fighting', color: '#C22E28' },
  { type: 'Flying', color: '#A98FF3' },
  { type: 'Poison', color: '#A33EA1' },
  { type: 'Ice', color: '#96D9D6' },
  { type: 'Dragon', color: '#6F35FC' },
  { type: 'Ground', color: '#E2BF65' },
  { type: 'Rock', color: '#B6A136' },
  { type: 'Bug', color: '#A6B91A' },
  { type: 'Steel', color: '#B7B7CE' }    
];

export default function TypeButtonGroup({ onTypeSelect }) {
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleTypeClick = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else if (prev.length < 2) {
        return [...prev, type];
      } else {
        return [prev[1], type]; // unselect the previous first type if already two selected
      }                         // this keeps the last two selected types
    });
    onTypeSelect && onTypeSelect(type);
  };

  return (
    <div>
      {POKEMON_TYPES.map(({ type, color }) => (
        <TypeButton
          key={type}
          type={type}
          color={color}
          selected={selectedTypes.includes(type)}
          onClick={handleTypeClick}
        />
      ))}
    </div>
  );
}