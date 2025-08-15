import React, { useState, useEffect } from 'react';
import { usePokemonList, usePokemonSearch } from './hooks/usePokemon';
import PokemonList from './components/PokemonList';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { API_BASE } from './API';
import './App.css';

function App() {
  const [searchMode, setSearchMode] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  // Use custom hooks for Pokemon data
  const {
    pokemon,
    loading: listLoading,
    error: listError,
    pagination,
    nextPage,
    previousPage,
    reload,
  } = usePokemonList(20);

  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    searchPokemon,
    clearResults,
  } = usePokemonSearch();

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
          setApiStatus('healthy');
        } else {
          setApiStatus('unhealthy');
        }
      } catch (error) {
        console.error('API health check failed:', error);
        setApiStatus('unhealthy');
      }
    };

    checkApiHealth();
  }, []);

  const handleSearch = async (query) => {
    if (query.trim()) {
      setSearchMode(true);
      await searchPokemon(query);
    } else {
      setSearchMode(false);
      clearResults();
    }
  };

  const handleClearSearch = () => {
    setSearchMode(false);
    clearResults();
  };

  // Show API status if unhealthy
  if (apiStatus === 'unhealthy') {
    return (
      <div className="app">
        <div className="api-error">
          <h1>🚨 API Connection Error</h1>
          <p>Unable to connect to the Pokemon API backend.</p>
          <p>
            Please ensure the backend server is running on <code>{API_BASE}</code>
          </p>
          <button onClick={() => window.location.reload()}>Retry Connection</button>
        </div>
      </div>
    );
  }

  const isLoading = listLoading || searchLoading;
  const currentError = searchMode ? searchError : listError;
  const currentPokemon = searchMode ? searchResults : pokemon;

  return (
    <div className="app">
      <header className="app-header">
        <h1> Pokedex </h1>
        <p>Discover and explore Pokemon using PokeAPI</p>
        {apiStatus === 'healthy' && <span className="api-status healthy">✅ API Connected</span>}
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isSearchMode={searchMode} />

        {currentError && (
          <ErrorMessage
            message={currentError}
            onRetry={searchMode ? () => {} : reload}
            showRetry={!searchMode}
          />
        )}

        {isLoading && <LoadingSpinner />}

        {!isLoading && !currentError && (
          <>
            <PokemonList pokemon={currentPokemon} isSearchMode={searchMode} />

            {!searchMode && (
              <Pagination
                pagination={pagination}
                onNext={nextPage}
                onPrevious={previousPage}
                loading={listLoading}
              />
            )}
          </>
        )}

        {searchMode && !isLoading && !searchError && searchResults.length === 0 && (
          <div className="no-results">
            <p>No Pokemon found matching your search.</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by PokeAPI • Enhanced Backend with Caching</p>
      </footer>
    </div>
  );
}

export default App;
