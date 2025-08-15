import React, { useEffect, useState } from 'react';
import TypeButton from './TypeButton';

export default function TypeButtonGroup({ onTypeSelect, onSelectionChange }) {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTypes() {
      try {
        setLoading(true);
        setError(null);
        // Adjust the URL if your backend is mounted under a prefix
        const res = await fetch('/pokemon/types', { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch types: ${res.status}`);
        const data = await res.json();

        // Normalize if API returns strings or objects
        const normalized = Array.isArray(data)
          ? data.map((item) => (typeof item === 'string' ? { type: item, color: undefined } : item))
          : [];

        setTypes(normalized);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError('Failed to load Pokémon types.');
          setTypes([]);
        }
      } finally {
        setLoading(false);
      }
    }

    loadTypes();
    return () => controller.abort();
  }, []);

  const handleTypeClick = (type) => {
    setSelectedTypes((prev) => {
      let next;
      if (prev.includes(type)) {
        next = prev.filter((t) => t !== type);
      } else if (prev.length < 2) {
        next = [...prev, type];
      } else {
        next = [prev[1], type]; // unselect the previous first type if already two selected
      } // this keeps the last two selected types
      onTypeSelect && onTypeSelect(type);
      onSelectionChange && onSelectionChange(next);
      return next;
    });
  };

  if (loading) {
    return <div>Loading types...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {types.map(({ type, color }) => (
        <TypeButton
          key={type}
          type={type}
          color={color || '#B7B7CE'}
          selected={selectedTypes.includes(type)}
          onClick={handleTypeClick}
        />
      ))}
    </div>
  );
}
