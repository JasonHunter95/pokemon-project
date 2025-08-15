import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '../test/renderWithRouter';
import PokemonCard from './PokemonCard';

const pokemon = {
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  sprites: {
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  },
};

test('renders name, id, image, and type chips', () => {
  renderWithRouter(<PokemonCard pokemon={pokemon} />);
  expect(screen.getByText(/#25/i)).toBeInTheDocument();
  expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /pikachu sprite/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /filter by electric type/i })).toBeInTheDocument();
});

test('calls onTypeClick when clicking a type chip', () => {
  const onTypeClick = jest.fn();
  renderWithRouter(<PokemonCard pokemon={pokemon} onTypeClick={onTypeClick} />);
  fireEvent.click(screen.getByRole('button', { name: /filter by electric type/i }));
  expect(onTypeClick).toHaveBeenCalledWith('electric');
});

test('falls back when sprite missing', () => {
  renderWithRouter(<PokemonCard pokemon={{ ...pokemon, sprites: { front_default: '' } }} />);
  expect(screen.getByRole('img', { name: /sprite not available/i })).toBeInTheDocument();
});

test('links to details via anchor', () => {
  renderWithRouter(<PokemonCard pokemon={pokemon} linkHref="/pokemon/25" />);
  const link = screen.getByRole('link', { name: /view details/i });
  expect(link).toHaveAttribute('href', '/pokemon/25');
});
