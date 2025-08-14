export function makePokemon(overrides = {}) {
  const base = {
    id: 999,
    name: 'testmon',
    types: ['normal'],
    sprites: { front_default: '' },
    stats: {},
  };
  return { ...base, ...overrides };
}
