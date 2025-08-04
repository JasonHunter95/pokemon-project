import React from 'react';
import SearchBar from '../components/SearchBar';

export default {
  title: 'Pokemon/SearchBar',
  component: SearchBar,
  argTypes: {
    onSearch: { action: 'search' },
    size: {
      control: { type: 'select' },
      options: ['small', 'default', 'large'],
      defaultValue: 'default'
    }
  },
  parameters: {
    docs: {
      description: {
        component: 'A responsive search bar component for searching Pokémon. Includes search icon, clear button, and customizable sizing.'
      }
    }
  }
};

// Default search bar
export const Default = () => <SearchBar />;

// With custom placeholder
export const CustomPlaceholder = () => (
  <SearchBar placeholder="Find your favorite Pokémon..." />
);

// Size variations
export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <SearchBar 
      size="small" 
      placeholder="Small search..." 
    />
    <SearchBar 
      placeholder="Default size" 
    />
    <SearchBar 
      size="large" 
      placeholder="Large search..." 
    />
  </div>
);

// With initial value
export const WithInitialValue = () => (
  <SearchBar 
    initialValue="Pikachu" 
    onSearch={(term) => console.log(`Searching for: ${term}`)} 
  />
);

// In context
export const InContext = () => (
  <div style={{ 
    padding: '20px', 
    background: '#2a2a2a', 
    borderRadius: '10px',
    color: 'white',
    maxWidth: '600px'
  }}>
    <h3>Pokémon Finder</h3>
    <p style={{ fontSize: '14px' }}>Search for Pokémon by name or ID</p>
    <SearchBar />
  </div>
);