import { http, HttpResponse } from 'msw';

export const handlers = [
  // Minimal mock so TypeButtonGroup never hits a real backend
  http.get('/pokemon/types', () =>
    HttpResponse.json([
      'grass',
      'poison',
      'fire',
      'water',
      'electric',
      'ice',
      'ground',
      'flying',
      'psychic',
      'bug',
      'rock',
      'ghost',
      'dragon',
      'dark',
      'steel',
      'fairy',
    ])
  ),
];
