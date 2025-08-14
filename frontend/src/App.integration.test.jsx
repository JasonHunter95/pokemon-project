import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from './App';

test('loads and renders Pokémon cards on initial load', async () => {
  render(<App />);
  await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

  const cards = screen.getAllByLabelText(/card$/i);
  expect(cards.length).toBeGreaterThanOrEqual(2);

  // Names come from MSW handlers
  expect(screen.getByLabelText(/bulbasaur card/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/charmander card/i)).toBeInTheDocument();
});

test('renders Pokemon cards from API search', async () => {
  render(<App />);
  // Wait for initial load to complete and cards to appear
  await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  const cards = screen.getAllByLabelText(/card$/i);
  expect(cards.length).toBeGreaterThan(0);

  // Search by name (relies on MSW to respond accordingly)
  const input = screen.getByRole('textbox', { name: /search/i });
  await userEvent.clear(input);
  await userEvent.type(input, 'pikachu{enter}');

  await waitFor(() => {
    const pikachu = screen.getByLabelText(/pikachu card/i);
    expect(pikachu).toBeInTheDocument();
  });
});

test('filters by type when clicking a type chip on a card', async () => {
  render(<App />);
  await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

  // Click a type chip (assumes first card has at least one type)
  const typeButtons = screen.getAllByRole('button', { name: /filter by .* type/i });
  await userEvent.click(typeButtons[0]);

  // After refetch, cards update
  await waitFor(() => {
    const cards = screen.getAllByLabelText(/card$/i);
    expect(cards.length).toBeGreaterThan(0);
  });
});