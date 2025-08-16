import React from 'react';
import PokemonCard from './PokemonCard';
import PokemonCardGrid from './PokemonCardGrid';
import styles from './PokemonList.module.css';

const PokemonList = ({ pokemon = [], isSearchMode = false, onPokemonClick, onTypeClick }) => {
  if (!pokemon || pokemon.length === 0) {
    return (
      <div className={styles['pokemon-list-empty']} role="status" aria-live="polite">
        <h3>No Pokemon found</h3>
        <p>{isSearchMode ? 'Try a different search term' : 'Unable to load Pokemon data'}</p>
      </div>
    );
  }

  // Transform the data to match what PokemonCard expects
  const transformedPokemon = pokemon.map((poke) => {
    // Handle both detailed and basic Pokemon data structures
    if (poke.id && poke.name && poke.sprites?.front_default) {
      return poke; // Already in correct format
    }

    // Extract ID from URL if needed
    const getPokemonId = (url) => {
      if (!url) return 1;
      const matches = url.match(/\/pokemon\/(\d+)\//);
      return matches ? parseInt(matches[1]) : 1;
    };

    const pokemonId = poke.id || getPokemonId(poke.url);

    return {
      id: pokemonId,
      name: poke.name,
      types: poke.types || [],
      sprites: poke.sprites || {
        front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
      },
    };
  });

  return (
    <PokemonCardGrid className={isSearchMode ? 'search-mode' : ''} aria-label="Pokemon results">
      {transformedPokemon.map((poke) => (
        <PokemonCard
          key={poke.id || poke.name}
          pokemon={poke}
          onTypeClick={onTypeClick}
          onOpen={
            onPokemonClick
              ? (e) => {
                  e.preventDefault();
                  onPokemonClick(poke);
                }
              : undefined
          }
        />
      ))}
    </PokemonCardGrid>
  );
};

export default PokemonList;
