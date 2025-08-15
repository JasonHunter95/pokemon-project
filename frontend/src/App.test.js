import { screen } from '@testing-library/react';
import { rest } from 'msw';
import { server } from './test/msw/server';
import { renderWithRouter } from './test/renderWithRouter';
import { API_BASE } from './API';
import App from './App';

beforeEach(() => {
  server.use(rest.get(`${API_BASE}/health`, (_req, res, ctx) => res(ctx.status(200))));
});

test('renders header', () => {
  renderWithRouter(<App />);
  expect(screen.getByRole('heading', { name: /Pokedex/i })).toBeInTheDocument();
});
