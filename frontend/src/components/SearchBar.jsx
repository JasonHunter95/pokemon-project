import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onClear, isSearchMode }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="search-input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Pokemon by name..."
            className="search-input"
            aria-label="Search"
          />
          <button type="submit" className="search-button">
            🔍 Search
          </button>
          {isSearchMode && (
            <button type="button" onClick={handleClear} className="clear-button">
              ✕ Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
