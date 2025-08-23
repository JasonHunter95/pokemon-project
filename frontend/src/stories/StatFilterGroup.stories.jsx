import React, { useState } from 'react';
import StatFilterGroup from '../components/StatFilterGroup';

export default {
  title: 'Components/StatFilterGroup',
  component: StatFilterGroup,
  parameters: {
    docs: {
      description: {
        component: 'A group of stat sliders for filtering Pokemon by their base stats.',
      },
    },
  },
};

const Template = (args) => {
  const [stats, setStats] = useState(args.stats);

  const handleStatsChange = (newStats) => {
    setStats(newStats);
    args.onStatsChange?.(newStats);
  };

  const handleClear = () => {
    setStats({});
    args.onClear?.();
  };

  return (
    <StatFilterGroup
      {...args}
      stats={stats}
      onStatsChange={handleStatsChange}
      onClear={handleClear}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  stats: {},
  onStatsChange: (stats) => console.log('Stats changed:', stats),
  onClear: () => console.log('Stats cleared'),
};

export const WithActiveFilters = Template.bind({});
WithActiveFilters.args = {
  stats: {
    hp: { min: 50, max: 150 },
    attack: { min: 80, max: 200 },
    speed: { min: 60, max: 120 },
  },
  onStatsChange: (stats) => console.log('Stats changed:', stats),
  onClear: () => console.log('Stats cleared'),
};

export const SingleStatFilter = Template.bind({});
SingleStatFilter.args = {
  stats: {
    attack: { min: 100, max: 255 },
  },
  onStatsChange: (stats) => console.log('Stats changed:', stats),
  onClear: () => console.log('Stats cleared'),
};
