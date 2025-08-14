import React from 'react';
import './pokemon-grid.css';

export default function PokemonCardGrid({ children, className = '', ...rest }) {
  return (
    <section className={`pokemon-grid ${className}`} {...rest}>
      {children}
    </section>
  );
}
