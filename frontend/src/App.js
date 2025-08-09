// Example of how to use in App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import TypeButtonGroup from './components/TypeButtonGroup';
import { fetchPokemon } from './api';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [types, setTypes] = useState([]);
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async ({ search = searchTerm, t = types } = {}) => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchPokemon({ search, types: t, limit: 20, offset: 0 });
      setPokemon(data);
    } catch (e) {
      console.error(e);
      setPokemon([]);
      setError('Failed to load Pokémon.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    load({ search: term, t: types });
  };

  const handleTypesChange = (nextTypes) => {
    setTypes(nextTypes);
    load({ search: searchTerm, t: nextTypes });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokemon Type Selector</h1>
        
        <SearchBar onSearch={handleSearch} />
        
        {searchTerm && (
          <p>You searched for: {searchTerm}</p>
        )}
        
        <TypeButtonGroup onSelectionChange={handleTypesChange} />
        
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
        {pokemon
          .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(p => (<li key={p.id}>{p.name} ({p.types.join(', ')})</li>))}
        </ul>
        
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