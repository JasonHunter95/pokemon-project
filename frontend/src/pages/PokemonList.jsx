// frontend/src/pages/PokemonList.jsx
import React, { useState } from 'react';
import { usePokemonList } from '../hooks/usePokemon';
import PokemonListComponent from '../components/PokemonList';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const PokemonList = () => {
  const [filters, setFilters] = useState({
    search: '',
    types: [],
    limit: 20,
    offset: 0,
  });

  const { data, isLoading, isError, error } = usePokemonList(filters);

  const handleSearch = (query) => {
    setFilters((prev) => ({ ...prev, search: query, offset: 0 }));
  };

  const handleClearSearch = () => {
    setFilters((prev) => ({ ...prev, search: '', offset: 0 }));
  };

  const handleNextPage = () => {
    setFilters((prev) => ({ ...prev, offset: prev.offset + prev.limit }));
  };

  const handlePreviousPage = () => {
    setFilters((prev) => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }));
  };

  const isSearchMode = !!filters.search;

  return (
    <>
      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isSearchMode={isSearchMode} />

      {isError && <ErrorMessage message={error.message} onRetry={() => {}} showRetry={false} />}

      {isLoading && <LoadingSpinner />}

      {data && (
        <>
          <PokemonListComponent pokemon={data.results} isSearchMode={isSearchMode} />

          {!isSearchMode && data.count > filters.limit && (
            <Pagination
              pagination={{
                ...filters,
                count: data.count,
                next: data.next,
                previous: data.previous,
              }}
              onNext={handleNextPage}
              onPrevious={handlePreviousPage}
              loading={isLoading}
            />
          )}
        </>
      )}

      {isSearchMode && !isLoading && data?.results.length === 0 && (
        <div className="no-results">
          <p>No Pokemon found matching your search.</p>
        </div>
      )}
    </>
  );
};

export default PokemonList;
