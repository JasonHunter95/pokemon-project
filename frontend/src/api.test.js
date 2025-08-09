import { rest } from 'msw';
import { server } from './test/msw/server';
import { fetchPokemon, API_BASE } from './api';

test('fetchPokemon passes search, types, limit, and offset', async () => {
  let captured;
  server.use(
    rest.get(`${API_BASE}/pokemon`, (req, res, ctx) => {
      captured = req.url;
      return res(ctx.json([]));
    })
  );

  await fetchPokemon({
    search: 'Pika',
    types: ['electric', 'flying'],
    limit: 30,
    offset: 10,
  });

  expect(captured).toBeDefined();
  expect(captured.searchParams.get('search')).toBe('Pika');
  expect(captured.searchParams.get('types')).toBe('electric,flying');
  expect(captured.searchParams.get('limit')).toBe('30');
  expect(captured.searchParams.get('offset')).toBe('10');
});