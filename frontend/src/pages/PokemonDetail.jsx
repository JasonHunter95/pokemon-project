// frontend/src/pages/PokemonDetail.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePokemonDetail } from '../hooks/usePokemon';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './PokemonDetail.css';

const PokemonDetail = () => {
  const { pokemonId } = useParams();
  const { data: pokemon, isLoading, isError, error } = usePokemonDetail(pokemonId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error.message} showRetry={false} />;
  }

  if (!pokemon) {
    return (
      <div className="pokemon-detail-container">
        <h2>Pokemon not found.</h2>
        <Link to="/" className="back-link">
          &larr; Back to Pokedex
        </Link>
      </div>
    );
  }

  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <div className="pokemon-detail-container">
      <Link to="/" className="back-link">
        &larr; Back to Pokedex
      </Link>
      <article className="pokemon-detail-card">
        <div className="detail-header">
          <h1>{capitalizedName}</h1>
          <span className="detail-id">#{String(pokemon.id).padStart(3, '0')}</span>
        </div>
        <div className="detail-content">
          <div className="detail-image-wrapper">
            <img
              src={pokemon.sprites?.front_default}
              alt={`${capitalizedName} sprite`}
              className="detail-sprite"
            />
          </div>
          <div className="detail-info">
            <h2>Stats</h2>
            <ul className="stats-list">
              {pokemon.stats.map((statInfo) => (
                <li key={statInfo.stat.name}>
                  <span className="stat-name">{statInfo.stat.name.replace('-', ' ')}</span>
                  <span className="stat-value">{statInfo.base_stat}</span>
                </li>
              ))}
            </ul>
            <h2>Abilities</h2>
            <p>{pokemon.abilities.map((abilityInfo) => abilityInfo.ability.name).join(', ')}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PokemonDetail;
