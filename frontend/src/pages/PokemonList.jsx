// frontend/src/pages/PokemonList.jsx
import React, { useState } from 'react';
import { usePokemonList, usePokemonSearch } from '../hooks/usePokemon';
import PokemonListComponent from '../components/PokemonList'; // Renaming to avoid confusion
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const PokemonList = () => {
  const [searchMode, setSearchMode] = useState(false);

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

  const isLoading = listLoading || searchLoading;
  const currentError = searchMode ? searchError : listError;
  const currentPokemon = searchMode ? searchResults : pokemon;

  return (
    <>
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
          <PokemonListComponent pokemon={currentPokemon} isSearchMode={searchMode} />

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
    </>
  );
};

export default PokemonList;
