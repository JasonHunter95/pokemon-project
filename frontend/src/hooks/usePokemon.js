import { useState, useEffect, useCallback } from 'react';
import { fetchPokemon, API_BASE } from '../API';

export function usePokemonList(initialLimit = 20) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    limit: initialLimit,
    offset: 0,
  });

  const loadPokemon = useCallback(
    async (limit = pagination.limit, offset = 0) => {
      setLoading(true);
      setError(null);

      try {
        // Use the existing fetchPokemon function from api.js
        const data = await fetchPokemon({ limit, offset });

        // The backend returns results array directly for the modular structure
        if (Array.isArray(data)) {
          // If backend returns array directly
          setPokemon(data);
          setPagination((prev) => ({
            ...prev,
            limit,
            offset,
          }));
        } else if (data.results) {
          // If backend returns paginated response
          setPokemon(data.results);
          setPagination({
            count: data.count || 0,
            next: data.next,
            previous: data.previous,
            limit,
            offset,
          });
        } else {
          setPokemon([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load Pokemon');
        console.error('Error loading Pokemon:', err);
        setPokemon([]);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  const nextPage = useCallback(() => {
    const newOffset = pagination.offset + pagination.limit;
    loadPokemon(pagination.limit, newOffset);
  }, [loadPokemon, pagination.limit, pagination.offset]);

  const previousPage = useCallback(() => {
    const newOffset = Math.max(0, pagination.offset - pagination.limit);
    loadPokemon(pagination.limit, newOffset);
  }, [loadPokemon, pagination.limit, pagination.offset]);

  useEffect(() => {
    loadPokemon(initialLimit, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    pokemon,
    loading,
    error,
    pagination,
    loadPokemon,
    nextPage,
    previousPage,
    reload: () => loadPokemon(pagination.limit, pagination.offset),
  };
}

export function usePokemonSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchPokemon = useCallback(async (query, limit = 10) => {
    if (!query || query.length < 1) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the existing fetchPokemon with search parameter
      const data = await fetchPokemon({
        search: query,
        limit,
      });

      // Handle the response based on your backend structure
      if (Array.isArray(data)) {
        setResults(data);
      } else if (data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError(err.message || 'Search failed');
      console.error('Error searching Pokemon:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchPokemon,
    clearResults,
  };
}

export function usePokemonDetail(pokemonId) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPokemon = useCallback(async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      // For detail view, you might need a separate API call
      const response = await fetch(`${API_BASE}/pokemon/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon details: ${response.status}`);
      }
      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setError(err.message || 'Failed to load Pokemon details');
      console.error('Error loading Pokemon detail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pokemonId) {
      loadPokemon(pokemonId);
    }
  }, [pokemonId, loadPokemon]);

  return {
    pokemon,
    loading,
    error,
    reload: () => loadPokemon(pokemonId),
  };
}
