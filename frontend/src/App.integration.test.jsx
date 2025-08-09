import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

test('loads and renders Pokémon from API on initial load', async () => {
  render(<App />);

  // Optional: if you render a loading state
  // expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for list items that our MSW handler returns
  const items = await screen.findAllByRole('listitem');
  expect(items.length).toBeGreaterThanOrEqual(2);
  expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
  expect(screen.getByText(/charmander/i)).toBeInTheDocument();
});