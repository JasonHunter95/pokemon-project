// Example of how to use in App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import TypeButtonGroup from './components/TypeButtonGroup';
import { fetchPokemon } from './api';
import PokemonCard from './components/PokemonCard';
import PokemonCardGrid from './components/PokemonCardGrid';

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

  // Clicking a type chip on a card refines filters to that type
  const handleTypeChipClick = (type) => {
    const nextTypes = [type];
    setTypes(nextTypes);
    load({ search: searchTerm, t: nextTypes });
  };

  // Optional: clicking the card or name – stub link already navigates via href
  const handleOpenDetails = () => {
    // Leave empty or plug in router navigation later
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

        {loading && (
          <>
            <p>Loading...</p>
            <PokemonCardGrid aria-busy="true" aria-live="polite">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="pokemon-card skeleton" aria-hidden="true">
                  <div className="image-wrap" />
                  <div className="title" style={{ marginTop: 8, width: '70%' }} />
                  <div className="types" style={{ marginTop: 8, width: '50%' }} />
                </div>
              ))}
            </PokemonCardGrid>
          </>
        )}

        {!loading && error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <>
            {pokemon.length === 0 ? (
              <p role="status" aria-live="polite">
                No Pokémon found. Try a different search or type filter.
              </p>
            ) : (
              <PokemonCardGrid aria-live="polite">
                {pokemon.map((p) => (
                  <PokemonCard
                    key={p.id}
                    pokemon={p}
                    onTypeClick={handleTypeChipClick}
                    onOpen={handleOpenDetails}
                    linkHref={`/pokemon/${p.id}`}
                  />
                ))}
              </PokemonCardGrid>
            )}
          </>
        )}

        <p>
          Select up to two Pokemon types.
          Click on a type to select or deselect it.
          Selected types will be highlighted.
          Try selecting different combinations!
        </p>
      </header>
    </div>
  );
}

export default App;