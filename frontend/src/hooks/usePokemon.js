import { useQuery } from '@tanstack/react-query';
import { fetchPokemon, fetchPokemonDetail } from '../API';

/**
 * Custom hook to fetch a paginated and filterable list of Pokémon.
 * @param {{ search?: string, types?: string[], stats?: object, limit?: number, offset?: number }} filters
 */
export function usePokemonList({ search, types, stats, limit = 20, offset = 0 } = {}) {
  return useQuery({
    queryKey: ['pokemon', { search, types, stats, limit, offset }],
    queryFn: () => fetchPokemon({ search, types, stats, limit, offset }),
    // keepPreviousData: true, // uncomment for a smoother pagination experience
  });
}

/**
 * Custom hook to fetch details for a single Pokémon.
 * @param {string | number} pokemonId
 */
export function usePokemonDetail(pokemonId) {
  return useQuery({
    queryKey: ['pokemon', pokemonId],
    queryFn: () => fetchPokemonDetail(pokemonId),
    enabled: !!pokemonId, // Only run the query if pokemonId is truthy
  });
}
