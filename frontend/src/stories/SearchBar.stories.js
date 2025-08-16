import React from 'react';
import SearchBar from '../components/SearchBar';

export default {
  title: 'Pokemon/SearchBar',
  component: SearchBar,
  argTypes: {
    onSearch: { action: 'search' },
    onClear: { action: 'clear' },
    isSearchMode: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A responsive search bar for searching Pokémon. Includes a clear button that appears when isSearchMode=true.',
      },
    },
  },
};

// Default search bar
export const Default = {
  args: {},
};

// With custom placeholder
export const CustomPlaceholder = {
  args: {
    placeholder: 'Find your favorite Pokémon...',
  },
};

// Search bar with clear button
export const WithClearButton = {
  args: {
    isSearchMode: true,
  },
};

// In context
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
      <h3>Pokémon Finder</h3>
      <p style={{ fontSize: '14px' }}>Search for Pokémon by name or ID</p>
      <SearchBar {...args} />
    </div>
  ),
  args: {},
};
