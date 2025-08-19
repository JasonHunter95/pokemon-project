// frontend/src/components/SearchBar.jsx
import React, { useState } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({
  onSearch = () => {},
  onClear = () => {},
  isSearchMode,
  placeholder = 'Search Pokémon by name...',
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className={styles['search-bar']}>
      <form onSubmit={handleSubmit}>
        <div className={styles['search-input-group']}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={styles['search-input']}
            aria-label="Search"
          />
          <button type="submit" className={styles['search-button']}>
            🔍 Search
          </button>
          {isSearchMode && (
            <button type="button" onClick={handleClear} className={styles['clear-button']}>
              ✕ Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
