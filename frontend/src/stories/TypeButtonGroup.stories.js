import React from 'react';
import TypeButtonGroup from '../components/TypeButtonGroup';
import { userEvent, within, expect, fn } from '@storybook/test';
import { http, HttpResponse, delay } from 'msw';

// Canonical palette for all Pokémon types
const TYPE_COLORS = {
  normal: '#A8A77A',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C22E28',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B8A038',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#EE99AC',
};

// Utility to add colors to any input shape (string[] or {type,color}[])
const colorize = (arr) =>
  Array.isArray(arr)
    ? arr.map((it) =>
        typeof it === 'string'
          ? { type: it, color: TYPE_COLORS[it] ?? '#B7B7CE' }
          : { ...it, color: it.color ?? TYPE_COLORS[it.type] ?? '#B7B7CE' }
      )
    : arr;

const DEMO_TYPES = [
  'grass',
  'poison',
  'fire',
  'water',
  'electric',
  'ice',
  'ground',
  'flying',
  'fighting',
  'normal',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

// Stable, module-scoped colored array for tests/interactions
const COLORED_DEMO_TYPES = colorize(DEMO_TYPES);

export default {
  title: 'Components/TypeButtonGroup',
  component: TypeButtonGroup,
  tags: ['autodocs'],
  args: {
    // Keep strings in args for readability; decorator injects colors
    types: DEMO_TYPES,
  },
  argTypes: {
    types: {
      control: 'object',
      description: 'Array of strings or objects like { type, color }',
    },
    initialSelected: {
      control: 'object',
      description: 'Array of up to two preselected type strings',
    },
    onTypeSelect: { action: 'type selected' },
    onSelectionChange: { action: 'selection changed' },
  },
  // Decorator: add padding and auto-colorize string arrays.
  decorators: [
    (Story, ctx) => {
      // Memoize to avoid producing a new array identity each render
      const colored = React.useMemo(
        () => (Array.isArray(ctx.args.types) ? colorize(ctx.args.types) : ctx.args.types),
        [ctx.args.types]
      );
      return (
        <div style={{ padding: 16, background: 'transparent' }}>
          <Story args={{ ...ctx.args, types: colored }} />
        </div>
      );
    },
  ],
  parameters: {
    layout: 'padded',
    chromatic: { viewports: [360, 768, 1200] },
    docs: {
      description: {
        component:
          'A group of buttons for selecting Pokémon types. Users can choose up to two types. ' +
          'When no "types" prop is provided, the component fetches from "/pokemon/types". ' +
          'This story file decorates string inputs with a consistent color palette.',
      },
    },
  },
};

// Basic: static list (no network)
export const Default = {};

// Callback sample
export const WithCallback = {
  args: {
    onTypeSelect: (t) => console.log(`Selected type: ${t}`),
  },
};

export const WithInitialSelection = {
  args: {
    initialSelected: ['grass', 'poison'],
  },
};

// Explicit colors (shows that custom per-type colors override the palette)
export const WithCustomColors = {
  args: {
    types: [
      { type: 'grass', color: '#31C48D' },
      { type: 'poison', color: '#7E22CE' },
      { type: 'fire', color: '#F87171' },
    ],
    initialSelected: ['fire'],
  },
  parameters: {
    docs: { description: { story: 'Demonstrates overriding the default palette per type.' } },
  },
};

// Constrained container to verify wrapping and spacing
export const NarrowLayout = {
  render: (args) => (
    <div style={{ maxWidth: 280, border: '1px dashed #ccc', padding: 8 }}>
      <TypeButtonGroup {...args} />
    </div>
  ),
  parameters: { docs: { description: { story: 'Narrow container to force wrapping.' } } },
};

// In-context demo card
export const InContext = {
  render: (args) => (
    <div
      style={{
        padding: '20px',
        background: '#2a2a2a',
        borderRadius: '10px',
        color: 'white',
        maxWidth: '600px',
      }}
    >
      <h3>Pokémon Type Selector</h3>
      <p style={{ fontSize: '14px' }}>Select up to two types to find matching Pokémon</p>
      <TypeButtonGroup {...args} />
    </div>
  ),
};

// API-driven states (no "types" prop) using MSW mock handlers

export const LoadingFromAPI = {
  args: { types: undefined }, // force fetch
  parameters: {
    chromatic: { delay: 500 },
    msw: {
      handlers: [
        http.get('/pokemon/types', async () => {
          await delay(3000);
          return HttpResponse.json(colorize(DEMO_TYPES)); // return colored objects
        }),
      ],
    },
    docs: {
      description: {
        story: 'Simulates a delayed network response to show the loading UI (role="status").',
      },
    },
  },
};

export const EmptyFromAPI = {
  args: { types: undefined },
  parameters: {
    msw: { handlers: [http.get('/pokemon/types', () => HttpResponse.json([]))] },
    docs: { description: { story: 'API returns an empty list (no buttons rendered).' } },
  },
};

export const ErrorFromAPI = {
  args: { types: undefined },
  parameters: {
    msw: {
      handlers: [
        http.get('/pokemon/types', () => HttpResponse.text('Server error', { status: 500 })),
      ],
    },
    docs: {
      description: {
        story:
          'Simulates an API error; the component should render an alert with the error message.',
      },
    },
  },
};

// Interaction tests to lock in selection behavior
export const SelectionBehavior = {
  args: {
    // Use a stable, pre-colored array to prevent re-renders from resetting state
    types: COLORED_DEMO_TYPES,
    onSelectionChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const grass = await canvas.findByRole('button', { name: /grass/i });
    const water = await canvas.findByRole('button', { name: /water/i });
    const fire = await canvas.findByRole('button', { name: /fire/i });

    await userEvent.click(grass); // ['grass']
    await userEvent.click(water); // ['grass','water']
    await userEvent.click(fire); // replace oldest -> ['water','fire']

    const calls = args.onSelectionChange.mock.calls.map(([sel]) => sel);
    // Assert the exact sequence for clarity and stability
    expect(calls.slice(0, 3)).toEqual([['grass'], ['grass', 'water'], ['water', 'fire']]);

    await userEvent.click(water); // -> ['fire']
    const last = args.onSelectionChange.mock.calls.at(-1)[0];
    expect(last).toEqual(['fire']);
  },
  parameters: {
    docs: {
      description: {
        story: 'Ensures selecting a third type replaces the oldest; clicking again deselects.',
      },
    },
  },
};

// Keyboard accessibility smoke test
export const KeyboardSelection = {
  args: {
    types: COLORED_DEMO_TYPES, // stable array avoids remounts
    onSelectionChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const grass = await canvas.findByRole('button', { name: /grass/i });
    grass.focus();
    await userEvent.keyboard('{Enter}');
    expect(args.onSelectionChange).toHaveBeenCalled();
  },
  parameters: { docs: { description: { story: 'Reachable via keyboard (Enter).' } } },
};
