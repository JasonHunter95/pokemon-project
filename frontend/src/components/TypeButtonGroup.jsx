import React, { useEffect, useState } from 'react';
import TypeButton from './TypeButton';

export default function TypeButtonGroup({
  onTypeSelect,
  onSelectionChange,
  // Pass an array of strings or { type, color } objects
  types: providedTypes,
  initialSelected = [],
}) {
  const [selectedTypes, setSelectedTypes] = useState(initialSelected);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // shallow equality helpers
  const eqArray = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
  const eqTypes = (a, b) =>
    a.length === b.length && a.every((v, i) => v.type === b[i].type && v.color === b[i].color);

  const normalize = (arr) =>
    Array.isArray(arr)
      ? arr.map((item) => (typeof item === 'string' ? { type: item, color: undefined } : item))
      : [];

  useEffect(() => {
    // If types are provided, skip network entirely
    if (providedTypes && providedTypes.length > 0) {
      const next = normalize(providedTypes);
      setTypes((prev) => (eqTypes(prev, next) ? prev : next));
      setLoading(false);
      setError(null);
      return; // stop here, do not fetch
    }

    const controller = new AbortController();
    async function loadTypes() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/pokemon/types', { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch types: ${res.status}`);
        const data = await res.json();
        const next = normalize(data);
        setTypes((prev) => (eqTypes(prev, next) ? prev : next));
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
          setError('Failed to load Pokémon types.');
          setTypes((prev) => (prev.length ? [] : prev));
        }
      } finally {
        setLoading(false);
      }
    }
    loadTypes();
    return () => controller.abort();
  }, [providedTypes]);

  useEffect(() => {
    // Keep selected in sync, limit to two and to known types if provided
    const allowed = types.length ? new Set(types.map((t) => t.type)) : null;
    const next = (initialSelected || [])
      .filter((t) => (allowed ? allowed.has(t) : true))
      .slice(0, 2);

    // Only update if it actually changes
    setSelectedTypes((prev) => (eqArray(prev, next) ? prev : next));
  }, [initialSelected, types]);

  const handleTypeClick = (type) => {
    setSelectedTypes((prev) => {
      let next;
      if (prev.includes(type)) {
        next = prev.filter((t) => t !== type);
      } else if (prev.length < 2) {
        next = [...prev, type];
      } else {
        next = [prev[1], type]; // replace oldest
      }
      onTypeSelect && onTypeSelect(type);
      onSelectionChange && onSelectionChange(next);
      return next;
    });
  };

  if (loading) return <div role="status">Loading types…</div>;
  if (error) return <div role="alert">{error}</div>;

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
