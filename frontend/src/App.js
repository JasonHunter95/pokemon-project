// Example of how to use in App.js
import React, { useState } from 'react';
import './App.css';
import TypeButtonGroup from './components/TypeButtonGroup';
import SearchBar from './components/SearchBar';

function App() {
  const [searchResults, setSearchResults] = useState("");
  
  const handleSearch = (term) => {
    setSearchResults(term);
    // You would typically make an API call here
    console.log(`Searching for: ${term}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokemon Type Selector</h1>
        
        <SearchBar onSearch={handleSearch} />
        
        {searchResults && (
          <p>You searched for: {searchResults}</p>
        )}
        
        <TypeButtonGroup />
        
        <p>Select up to two Pokemon types.
        Click on a type to select or deselect it.
        Selected types will be highlighted.
        Try selecting different combinations!
        </p>
      </header>
    </div>
  );
}

export default App;