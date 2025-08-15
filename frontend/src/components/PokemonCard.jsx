// frontend/src/components/PokemonCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './PokemonCard.css';

function capitalize(s) {
  return (s || '').charAt(0).toUpperCase() + (s || '').slice(1);
}

const placeholderSvg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" role="img" aria-label="No sprite">
  <rect width="100%" height="100%" fill="#f2f2f2"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="#888">
    No Image
  </text>
</svg>
`);

export default function PokemonCard({
  pokemon,
  onTypeClick,
  onOpen,
  className = '',
  linkHref,
  ...rest
}) {
  const { id, name, types = [], sprites } = pokemon || {};
  const imgSrc = sprites?.front_default || placeholderSvg;
  const detailsHref = linkHref || `/pokemon/${id}`;

  return (
    <article className={`pokemon-card ${className}`} aria-label={`${name} card`} {...rest}>
      <Link
        to={detailsHref}
        className="card-link"
        aria-label={`View details for ${capitalize(name)} (#${id})`}
        onClick={onOpen}
      >
        <div className="image-wrap">
          <img
            className="sprite"
            src={imgSrc}
            alt={
              imgSrc === placeholderSvg
                ? `${capitalize(name)} sprite not available`
                : `${capitalize(name)} sprite`
            }
            loading="lazy"
            width="128"
            height="128"
          />
        </div>
        <h2 className="title" id={`pokemon-${id}-title`}>
          <span className="id">#{id}</span> {capitalize(name)}
        </h2>
      </Link>

      <div className="types" aria-label="Types">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            className={`type-chip type-${t}`}
            onClick={() => onTypeClick?.(t)}
            aria-label={`Filter by ${t} type`}
          >
            {t}
          </button>
        ))}
      </div>
    </article>
  );
}
