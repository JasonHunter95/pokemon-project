// frontend/src/components/TypeButtonGroup.jsx
import React, { useState, useEffect } from 'react';
import TypeButton from './TypeButton';

// Utility to create a consistent color palette for types
const TYPE_COLORS = {
  normal: '#A8A77A',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C22E28',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B8A038',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#EE99AC',
};

const TypeButtonGroup = ({ types = [], initialSelected = [], onSelectionChange }) => {
  const [selectedTypes, setSelectedTypes] = useState(initialSelected);

  // When the initialSelected prop changes from the parent, update the internal state
  useEffect(() => {
    setSelectedTypes(initialSelected);
  }, [initialSelected]);

  const handleTypeClick = (type) => {
    let next;
    if (selectedTypes.includes(type)) {
      next = selectedTypes.filter((t) => t !== type);
    } else if (selectedTypes.length < 2) {
      next = [...selectedTypes, type];
    } else {
      next = [selectedTypes[1], type]; // Replace the oldest selection
    }
    setSelectedTypes(next);
    onSelectionChange?.(next); // Notify the parent component of the change
  };

  if (!types.length) {
    // You can show a simple loading state or nothing while types are being fetched by the parent
    return <p style={{ color: '#6c757d' }}>Loading types...</p>;
  }

  return (
    <div>
      {types.map((type) => (
        <TypeButton
          key={type}
          type={type}
          color={TYPE_COLORS[type] || '#B7B7CE'} // Fallback color
          selected={selectedTypes.includes(type)}
          onClick={() => handleTypeClick(type)}
        />
      ))}
    </div>
  );
};

export default TypeButtonGroup;
