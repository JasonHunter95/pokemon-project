import React, { useState } from 'react';
import './searchbar.css';

export default function SearchBar({
  placeholder = 'Search Pokémon...',
  onSearch,
  className = '',
  initialValue = '',
  size = 'default', // new size prop with default value
}) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  // Create size class based on the size prop
  const sizeClass = size !== 'default' ? `size-${size}` : '';

  return (
    <form className={`search-container ${sizeClass} ${className}`} onSubmit={handleSubmit}>
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          aria-label="Search"
          placeholder="Search Pokémon..."
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
        />
        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}
