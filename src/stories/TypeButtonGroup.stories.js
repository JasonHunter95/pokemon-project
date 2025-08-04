import React from 'react';
import TypeButtonGroup from '../TypeButtonGroup';

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
export const Default = () => <TypeButtonGroup />;

// With a callback to show type selection
export const WithCallback = () => (
    <TypeButtonGroup 
    onTypeSelect={(type) => console.log(`Selected type: ${type}`)}
     />
);

// Wrapped in a container with styling
export const WithStyling = () => (
  <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
    <h3>Choose Your Pokemon Type(s)</h3>
    <TypeButtonGroup />
  </div>
);