import React from 'react';
import TypeButtonGroup from '../components/TypeButtonGroup';

export default {
  title: 'Pokemon/TypeButtonGroup',
  component: TypeButtonGroup,
  argTypes: {
    onTypeSelect: { action: 'type selected' } // Logging when a type is selected
  },
    parameters: {
        docs: {
            description: {
                component: 'A group of buttons for selecting Pokemon types. Users can choose up to two types simultaneously from a predefined list.'
            }
        }
    }
};
// basic usage of TypeButtonGroup component
export const Default = () => <TypeButtonGroup />;

// With a callback to show type selection
export const WithCallback = () => (
    <TypeButtonGroup 
    onTypeSelect={(type) => console.log(`Selected type: ${type}`)}
     />
);

// Styled example in context
export const InContext = () => (
  <div style={{ 
    padding: '20px', 
    background: '#2a2a2a', 
    borderRadius: '10px',
    color: 'white',
    maxWidth: '600px'
  }}>
    <h3>Pokémon Type Selector</h3>
    <p style={{ fontSize: '14px' }}>Select up to two types to find matching Pokémon</p>
    <TypeButtonGroup />
  </div>
);