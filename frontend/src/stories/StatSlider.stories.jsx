import React, { useState } from 'react';
import StatSlider from '../components/StatSlider';

export default {
  title: 'Components/StatSlider',
  component: StatSlider,
  argTypes: {
    statName: {
      control: 'text',
      description: 'The name of the stat to display',
    },
    value: {
      control: 'object',
      description: 'The min/max range object',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'A slider component for setting min/max ranges for Pokemon stats.',
      },
    },
  },
};

const Template = (args) => {
  const [value, setValue] = useState(args.value);

  const handleChange = (newValue) => {
    setValue(newValue);
    args.onChange?.(newValue);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '300px' }}>
      <StatSlider {...args} value={value} onChange={handleChange} />
    </div>
  );
};

export const HP = Template.bind({});
HP.args = {
  statName: 'hp',
  value: { min: 5, max: 255 },
  onChange: (value) => console.log('HP changed:', value),
};

export const Attack = Template.bind({});
Attack.args = {
  statName: 'attack',
  value: { min: 50, max: 150 },
  onChange: (value) => console.log('Attack changed:', value),
};

export const Defense = Template.bind({});
Defense.args = {
  statName: 'defense',
  value: { min: 80, max: 200 },
  onChange: (value) => console.log('Defense changed:', value),
};

export const SpecialAttack = Template.bind({});
SpecialAttack.args = {
  statName: 'special-attack',
  value: { min: 60, max: 120 },
  onChange: (value) => console.log('Special Attack changed:', value),
};

export const SpecialDefense = Template.bind({});
SpecialDefense.args = {
  statName: 'special-defense',
  value: { min: 40, max: 100 },
  onChange: (value) => console.log('Special Defense changed:', value),
};

export const Speed = Template.bind({});
Speed.args = {
  statName: 'speed',
  value: { min: 90, max: 180 },
  onChange: (value) => console.log('Speed changed:', value),
};
