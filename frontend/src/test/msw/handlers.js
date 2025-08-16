import { rest } from 'msw';

// Use string types (not objects) to match the UI expectation
const POKEMON_DB = [
  {
    id: 1,
    name: 'bulbasaur',
    sprites: {
      front_default:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    },
    types: ['grass', 'poison'],
    stats: [
      { base_stat: 45, stat: { name: 'hp' } },
      { base_stat: 49, stat: { name: 'attack' } },
    ],
    abilities: [{ ability: { name: 'overgrow' } }],
  },
  {
    id: 4,
    name: 'charmander',
    sprites: {
      front_default:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    },
    types: ['fire'],
    stats: [
      { base_stat: 39, stat: { name: 'hp' } },
      { base_stat: 52, stat: { name: 'attack' } },
    ],
    abilities: [{ ability: { name: 'blaze' } }],
  },
  {
    id: 25,
    name: 'pikachu',
    sprites: {
      front_default:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    },
    types: ['electric'],
    stats: [
      { base_stat: 35, stat: { name: 'hp' } },
      { base_stat: 55, stat: { name: 'attack' } },
    ],
    abilities: [{ ability: { name: 'static' } }],
  },
];

function listResponse(url) {
  const u = new URL(url);
  const search = (u.searchParams.get('search') || '').toLowerCase();
  const typesParam = u.searchParams.get('types');
  const match = (u.searchParams.get('match') || 'all').toLowerCase();
  const limit = Number(u.searchParams.get('limit') || 20);
  const offset = Number(u.searchParams.get('offset') || 0);

  let results = POKEMON_DB;

  if (search) {
    results = results.filter((p) => p.name.includes(search));
  }

  if (typesParam) {
    const wanted = typesParam
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    results = results.filter((p) => {
      const pTypes = p.types.map((t) => t.toLowerCase());
      return match === 'any'
        ? wanted.some((t) => pTypes.includes(t))
        : wanted.every((t) => pTypes.includes(t));
    });
  }

  const count = results.length;
  const paged = results.slice(offset, offset + limit);

  const mkUrl = (newOffset) => `${u.origin}/pokemon?limit=${limit}&offset=${newOffset}`;

  return {
    count,
    next: offset + limit < count ? mkUrl(offset + limit) : null,
    previous: offset > 0 ? mkUrl(Math.max(0, offset - limit)) : null,
    // Keep only fields the list needs
    results: paged.map(({ id, name, sprites, types }) => ({ id, name, sprites, types })),
  };
}

export const handlers = [
  // Health (tests sometimes override this, but safe default here)
  rest.get('*/health', (_req, res, ctx) => res(ctx.status(200))),

  // Types list (shape isn’t asserted in current tests; keep it simple)
  rest.get('*/pokemon/types', (_req, res, ctx) =>
    res(ctx.status(200), ctx.json(['grass', 'poison', 'fire', 'electric']))
  ),

  // List endpoint
  rest.get('*/pokemon', (req, res, ctx) => {
    const { pathname } = req.url;
    // Only handle the list, not detail
    if (pathname.endsWith('/pokemon')) {
      return res(ctx.status(200), ctx.json(listResponse(req.url.toString())));
    }
    return undefined;
  }),

  // Detail endpoint
  rest.get('*/pokemon/:id', (req, res, ctx) => {
    const id = Number(req.params.id);
    const found = POKEMON_DB.find((p) => p.id === id);
    if (!found) return res(ctx.status(404), ctx.json({ detail: 'Not found' }));
    return res(ctx.status(200), ctx.json(found));
  }),
];
