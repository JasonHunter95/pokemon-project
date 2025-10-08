// frontend/src/pages/PokemonList.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { fetchTypes } from '../API'; // Import a function to fetch types
import { usePokemonList } from '../hooks/usePokemon';
import PokemonListComponent from '../components/PokemonList';
import SearchBar from '../components/SearchBar';
import TypeButtonGroup from '../components/TypeButtonGroup'; // Import the component
import StatFilterGroup from '../components/StatFilterGroup';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const PokemonList = () => {
  const [filters, setFilters] = useState({
    search: '',
    types: [], // Add types to your filter state
    stats: {}, // Add stats to your filter state
    limit: 20,
    offset: 0,
  });

  // Fetch the list of all Pokemon types for the button group
  const { data: typesData } = useQuery({
    queryKey: ['types'],
    queryFn: fetchTypes,
  });

  const { data, isLoading, isError, error } = usePokemonList(filters);

  const handleSearch = (query) => {
    setFilters((prev) => ({ ...prev, search: query, offset: 0 }));
  };

  // Clears both the search and type filters
  const handleClearSearch = () => {
    setFilters((prev) => ({ ...prev, search: '', types: [], stats: {}, offset: 0 }));
  };

  // Add a handler for when the type selection changes
  const handleTypeChange = (newTypes) => {
    setFilters((prev) => ({ ...prev, types: newTypes, offset: 0 }));
  };

  // Debounce timer for stats changes
  const statsDebounceRef = useRef(null);

  // Debounced handler for stat filters
  const handleStatsChange = useCallback(
    (newStats) => {
      if (statsDebounceRef.current) {
        clearTimeout(statsDebounceRef.current);
      }
      statsDebounceRef.current = setTimeout(() => {
        const activeStats = {};
        Object.entries(newStats).forEach(([statName, statRange]) => {
          if (statRange.min !== 5 || statRange.max !== 255) {
            activeStats[statName] = statRange;
          }
        });
        setFilters((prev) => ({ ...prev, stats: activeStats, offset: 0 }));
      }, 300);
    },
    [setFilters]
  );

  // Clear any pending debounce on unmount
  useEffect(() => {
    return () => {
      if (statsDebounceRef.current) clearTimeout(statsDebounceRef.current);
    };
  }, []);

  // Add a handler to clear stat filters
  const handleClearStats = () => {
    setFilters((prev) => ({ ...prev, stats: {}, offset: 0 }));
  };

  const handleNextPage = () => {
    setFilters((prev) => ({ ...prev, offset: prev.offset + prev.limit }));
  };

  const handlePreviousPage = () => {
    setFilters((prev) => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }));
  };

  const isSearchMode =
    !!filters.search || filters.types.length > 0 || Object.keys(filters.stats).length > 0;

  const filteredTypes =
    typesData?.filter((t) => t.name !== 'stellar' && t.name !== 'unknown').map((t) => t.name) || [];

  return (
    <>
      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isSearchMode={isSearchMode} />

      {/* Render the TypeButtonGroup here */}
      <div
        style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <TypeButtonGroup
          types={filteredTypes}
          onSelectionChange={handleTypeChange}
          initialSelected={filters.types}
        />
      </div>

      {/* Render the StatFilterGroup here */}
      <StatFilterGroup
        stats={filters.stats}
        onStatsChange={handleStatsChange}
        onClear={handleClearStats}
      />

      {isError && <ErrorMessage message={error.message} onRetry={() => {}} showRetry={false} />}

      {isLoading && <LoadingSpinner />}

      {data && (
        <>
          <PokemonListComponent pokemon={data.results} isSearchMode={isSearchMode} />

          {data.count > filters.limit && (
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
          <p>No Pokemon found matching your search and filter criteria.</p>
        </div>
      )}
    </>
  );
};

export default PokemonList;
