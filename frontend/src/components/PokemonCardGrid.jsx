import React from 'react';
import styles from './PokemonCardGrid.module.css';

export default function PokemonCardGrid({ children, className = '', ...rest }) {
  const combinedClassName = `${styles['pokemon-grid']} ${className}`.trim();

  return (
    <section className={combinedClassName} {...rest}>
      {children}
    </section>
  );
}
