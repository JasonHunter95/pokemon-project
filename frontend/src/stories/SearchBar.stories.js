import React from 'react';
import SearchBar from '../components/SearchBar';

export default {
  title: 'Components/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  argTypes: {
    onSearch: { action: 'search submitted' },
    onClear: { action: 'cleared' },
    isSearchMode: { control: 'boolean' },
    placeholder: { control: 'text' },
    initialQuery: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A responsive search bar for searching Pokémon. Submit via Enter or the Search button. A Clear button appears when isSearchMode=true.',
      },
    },
    layout: 'centered',
  },
};

// Default search bar
export const Default = {
  args: {
    isSearchMode: false,
  },
  parameters: {
    docs: { description: { story: 'Default appearance without the Clear button.' } },
  },
};

// Search bar with clear button
export const WithClearButton = {
  args: {
    isSearchMode: true,
  },
  parameters: {
    docs: { description: { story: 'Shows the Clear button when isSearchMode is enabled.' } },
  },
};

// With custom placeholder
export const CustomPlaceholder = {
  args: {
    placeholder: 'Find your favorite Pokémon...',
    isSearchMode: false,
  },
  parameters: {
    docs: { description: { story: 'Demonstrates a custom placeholder text.' } },
  },
};

// Search bar with initial query
export const WithInitialQuery = {
  args: {
    isSearchMode: true,
    initialQuery: 'pikachu',
  },
  parameters: {
    docs: {
      description: { story: 'Starts with a pre-filled query and the Clear button visible.' },
    },
  },
};

// Narrow layout example
export const NarrowLayout = {
  render: (args) => (
    <div style={{ width: 320, border: '1px dashed #444', padding: 12, borderRadius: 8 }}>
      <SearchBar {...args} />
    </div>
  ),
  args: {
    isSearchMode: true,
    placeholder: 'Type to search…',
  },
  parameters: {
    docs: { description: { story: 'Emulates a mobile-ish narrow layout to verify wrapping.' } },
  },
};

// In context
export const InContext = {
  render: (args) => (
    <div
      style={{
        padding: 20,
        background: '#2a2a2a',
        borderRadius: 10,
        color: 'white',
        maxWidth: 600,
      }}
    >
      <h3>Pokémon Finder</h3>
      <p style={{ fontSize: 14, opacity: 0.9 }}>Search for Pokémon by name or ID</p>
      <SearchBar {...args} />
    </div>
  ),
  args: {
    isSearchMode: true,
  },
  parameters: {
    docs: { description: { story: 'Styled within a dark card to preview integration.' } },
  },
};

// Small stateful demo to visualize the latest submitted query in-canvas
export const DemoWithState = {
  render: (args) => {
    const [last, setLast] = React.useState('');
    return (
      <div style={{ maxWidth: 600 }}>
        <SearchBar
          {...args}
          onSearch={(q) => {
            setLast(q);
            args.onSearch?.(q);
          }}
          onClear={() => {
            setLast('');
            args.onClear?.();
          }}
        />
        <div style={{ marginTop: 12, fontFamily: 'monospace' }}>
          Last submitted query: {last ? `"${last}"` : '—'}
        </div>
      </div>
    );
  },
  args: {
    isSearchMode: true,
    initialQuery: 'eevee',
  },
  parameters: {
    docs: {
      description: { story: 'Shows the last submitted query without needing interaction tests.' },
    },
  },
};
