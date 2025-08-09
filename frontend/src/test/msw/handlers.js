import { rest } from 'msw';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

const pikachu = { id: 25, name: 'pikachu', types: ['electric'], sprites: { front_default: '' } };
const bulbasaur = { id: 1, name: 'bulbasaur', types: ['grass', 'poison'], sprites: { front_default: '' } };
const charmander = { id: 4, name: 'charmander', types: ['fire'], sprites: { front_default: '' } };

export const handlers = [
  // Default list
  rest.get(`${API_BASE}/pokemon`, (req, res, ctx) => {
    const search = (req.url.searchParams.get('search') || '').toLowerCase();
    const types = (req.url.searchParams.get('types') || '').split(',').filter(Boolean);
    if (search === 'pikachu') return res(ctx.json([pikachu]));
    if (types.includes('fire')) return res(ctx.json([charmander]));
    if (types.includes('grass')) return res(ctx.json([bulbasaur]));
    return res(ctx.json([bulbasaur, charmander]));
  }),
  // Types list
  rest.get(`${API_BASE}/pokemon/types`, (_req, res, ctx) =>
    res(ctx.json(['grass', 'fire', 'water', 'electric']))
  ),
];