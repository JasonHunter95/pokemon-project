import { rest } from 'msw';

const makePokemon = (overrides = {}) => ({
  id: 25,
  name: 'pikachu',
  types: ['electric'],
  sprites: {
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  },
  ...overrides,
});

export const handlers = [
  // Match any origin for /pokemon
  rest.get('*/pokemon', (req, res, ctx) => {
    const search = req.url.searchParams.get('search') || '';
    const typesCsv = req.url.searchParams.get('types') || '';
    const types = typesCsv ? typesCsv.split(',').filter(Boolean) : [];

    // Mock dataset
    const data = [
      makePokemon(),
      makePokemon({
        id: 1,
        name: 'bulbasaur',
        types: ['grass', 'poison'],
        sprites: {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
        },
      }),
      makePokemon({
        id: 4,
        name: 'charmander',
        types: ['fire'],
        sprites: {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        },
      }),
      makePokemon({
        id: 7,
        name: 'squirtle',
        types: ['water'],
        sprites: {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
        },
      }),
      makePokemon({
        id: 35,
        name: 'clefairy',
        types: ['fairy'],
        sprites: {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png',
        },
      }),
    ];

    let results = data;
    if (search) {
      const s = search.toLowerCase();
      results = results.filter((p) => p.name.includes(s) || String(p.id) === s);
    }
    if (types.length > 0) {
      results = results.filter((p) => types.every((t) => p.types.includes(t)));
    }

    return res(ctx.json(results));
  }),
];
