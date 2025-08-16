import React from 'react';
import PokemonList from '../components/PokemonList';
import { expect, fn, userEvent, within } from '@storybook/test';
import { MemoryRouter } from 'react-router-dom';

// Deterministic inline SVG "sprites" to avoid network/images flake in snapshots
const svgDataUri = (color, label) =>
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <rect width="96" height="96" rx="8" fill="${color}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#fff">${label}</text>
    </svg>`
  );

// Sample detailed Pokémon set (stable for Chromatic)
const DETAILED = [
  {
    id: 1,
    name: 'Bulbasaur',
    sprites: { front_default: svgDataUri('#78C850', 'Bulbasaur') },
    types: [],
  },
  {
    id: 4,
    name: 'Charmander',
    sprites: { front_default: svgDataUri('#F08030', 'Charmander') },
    types: [],
  },
  {
    id: 7,
    name: 'Squirtle',
    sprites: { front_default: svgDataUri('#6890F0', 'Squirtle') },
    types: [],
  },
  {
    id: 25,
    name: 'Pikachu',
    sprites: { front_default: svgDataUri('#F8D030', 'Pikachu') },
    types: [],
  },
  {
    id: 39,
    name: 'Jigglypuff',
    sprites: { front_default: svgDataUri('#F85888', 'Jigglypuff') },
    types: [],
  },
  {
    id: 52,
    name: 'Meowth',
    sprites: { front_default: svgDataUri('#C6C6A7', 'Meowth') },
    types: [],
  },
];

const makeDetailed = (count = 24) =>
  Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    const name = `Pokemon ${id}`;
    const hues = [120, 24, 210, 50, 330, 180];
    const hue = hues[i % hues.length];
    const color = `hsl(${hue} 60% 50%)`;
    return {
      id,
      name,
      sprites: { front_default: svgDataUri(color, name) },
      types: [],
    };
  });

// Basic API "results" to exercise in-component transform (will generate network sprite URLs)
const makeBasicResults = (count = 6, startId = 1) =>
  Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    return { name: `pokemon-${id}`, url: `https://pokeapi.co/api/v2/pokemon/${id}/` };
  });

export default {
  title: 'Components/PokemonList',
  component: PokemonList,
  tags: ['autodocs'],
  args: {
    pokemon: DETAILED,
    isSearchMode: false,
    onPokemonClick: fn(),
    onTypeClick: fn(),
  },
  parameters: {
    layout: 'centered',
    chromatic: { viewports: [320, 768, 1024] },
  },
  decorators: [
    // provide router context for Link in PokemonCard
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
    (Story) => (
      <div style={{ maxWidth: 980, padding: 16, border: '1px dashed #e2e2e2' }}>
        <style>{`img { max-width: 96px; max-height: 96px; }`}</style>
        <Story />
      </div>
    ),
  ],
};

/**
 * Deterministic detailed items (inline SVG sprites).
 */
export const Default = {};

/**
 * Empty state (default mode).
 */
export const Empty = {
  args: { pokemon: [], isSearchMode: false },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { name: /no pokemon found/i })).toBeInTheDocument();
    await expect(c.getByText(/unable to load pokemon data/i)).toBeInTheDocument();
  },
};

/**
 * Empty state (search mode).
 */
export const EmptySearch = {
  args: { pokemon: [], isSearchMode: true },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { name: /no pokemon found/i })).toBeInTheDocument();
    await expect(c.getByText(/try a different search term/i)).toBeInTheDocument();
  },
};

/**
 * Many items to stress the grid wrapping and spacing.
 */
export const Many = {
  args: { pokemon: makeDetailed(30) },
};

/**
 * Uneven count to observe last-row alignment.
 */
export const Uneven = {
  args: { pokemon: makeDetailed(7) },
};

/**
 * Basic API results to exercise the component's transform path.
 * Snapshot disabled to avoid flake from remote images.
 */
export const BasicApiResults = {
  args: { pokemon: makeBasicResults(8) },
  parameters: { chromatic: { disableSnapshot: true } },
};

/**
 * Click interaction (best-effort): attempts to trigger onPokemonClick.
 * Adjust the query if your PokemonCard uses a different accessible name/role.
 */
export const ClickInteraction = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const target =
      c.queryByRole('button', { name: /bulbasaur/i }) ||
      c.queryByRole('link', { name: /bulbasaur/i }) ||
      c.getByText(/bulbasaur/i);
    await userEvent.click(target);
    await expect(args.onPokemonClick).toHaveBeenCalled();
  },
};

/**
 * Constrained-width container for small screens.
 */
export const ConstrainedWidth = {
  decorators: [
    (Story) => (
      <div style={{ width: 340 }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Dark background contrast check (requires backgrounds addon).
 */
export const DarkBackground = {
  parameters: { backgrounds: { default: 'dark' } },
};

/**
 * RTL rendering.
 */
export const RTL = {
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
};
