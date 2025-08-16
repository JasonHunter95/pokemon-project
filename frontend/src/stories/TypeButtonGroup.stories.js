import React from 'react';
import TypeButtonGroup from '../components/TypeButtonGroup';

const DEMO_TYPES = [
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
];

export default {
  title: 'Pokemon/TypeButtonGroup',
  component: TypeButtonGroup,
  argTypes: {
    onTypeSelect: { action: 'type selected' },
    onSelectionChange: { action: 'selection changed' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A group of buttons for selecting Pokémon types. Users can choose up to two types. In Storybook we pass a static list to avoid network calls.',
      },
    },
  },
};

export const Default = {
  args: {
    types: DEMO_TYPES,
  },
};

export const WithCallback = {
  args: {
    types: DEMO_TYPES,
    onTypeSelect: (t) => console.log(`Selected type: ${t}`),
  },
};

export const WithInitialSelection = {
  args: {
    types: DEMO_TYPES,
    initialSelected: ['grass', 'poison'],
  },
};

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
  args: {
    types: DEMO_TYPES,
  },
};
