// frontend/src/pages/PokemonDetail.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePokemonDetail } from '../hooks/usePokemon';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import styles from './PokemonDetail.module.css';

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
      <div className={styles.pokemonDetailContainer}>
        <h2>Pokemon not found.</h2>
        <Link to="/" className={styles.backLink}>
          &larr; Back to Pokedex
        </Link>
      </div>
    );
  }

  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <div className={styles['pokemon-detail-container']}>
      <Link to="/" className={styles['back-link']}>
        &larr; Back to Pokedex
      </Link>
      <article className={styles['pokemon-detail-card']}>
        <div className={styles['detail-header']}>
          <h1>{capitalizedName}</h1>
          <span className={styles['detail-id']}>#{String(pokemon.id).padStart(3, '0')}</span>
        </div>
        <div className={styles['detail-content']}>
          <div className={styles['detail-image-wrapper']}>
            <img
              src={pokemon.sprites?.front_default}
              alt={`${capitalizedName} sprite`}
              className={styles['detail-sprite']}
            />
          </div>
          <div className={styles['detail-info']}>
            <h2>Stats</h2>
            <ul className={styles['stats-list']}>
              {pokemon.stats.map((statInfo) => (
                <li key={statInfo.stat.name}>
                  <span>{statInfo.stat.name.replace('-', ' ')}</span>
                  <span className={styles['stat-value']}>{statInfo.base_stat}</span>
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
