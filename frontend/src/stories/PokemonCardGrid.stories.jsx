import React from 'react';
import PokemonCardGrid from '../components/PokemonCardGrid';
import { expect, within } from '@storybook/test';

const DummyCard = ({ index, long = false }) => {
  const name = long
    ? `Bulbasaur the Very Very Long-Named Pokémon Variant ${index + 1} — Alpha Omega`
    : `Bulbasaur ${index + 1}`;
  return (
    <article
      aria-label={name}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 12,
        borderRadius: 8,
        border: '1px solid #e5e7eb',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        minHeight: 120,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          background: 'linear-gradient(135deg, rgba(229,231,235,1) 0%, rgba(243,244,246,1) 100%)',
          borderRadius: 6,
        }}
      />
      <strong style={{ fontSize: 14, lineHeight: 1.2, wordBreak: 'break-word' }}>{name}</strong>
    </article>
  );
};

function renderGrid(args) {
  const items = Array.from({ length: args.itemCount || 0 }, (_, i) => i);
  return (
    <PokemonCardGrid {...args}>
      {items.map((i) => (
        <DummyCard key={i} index={i} long={args.longNames && i % 3 === 0} />
      ))}
    </PokemonCardGrid>
  );
}

export default {
  title: 'Components/PokemonCardGrid',
  component: PokemonCardGrid,
  tags: ['autodocs'],
  args: {
    itemCount: 6,
    className: '',
    'aria-label': 'Pokémon results',
    longNames: false,
  },
  argTypes: {
    itemCount: { control: { type: 'number', min: 0, max: 48, step: 1 } },
    longNames: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
    chromatic: { viewports: [320, 768, 1024] },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900, padding: 16, border: '1px dashed #e2e2e2' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Default grid with 6 items.
 */
export const Default = {
  render: renderGrid,
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    // Section becomes a region when labelled
    await expect(c.getByRole('region', { name: /pokémon results/i })).toBeInTheDocument();
    // Correct number of cards rendered
    const cards = c.getAllByRole('article');
    await expect(cards.length).toBe(args.itemCount);
  },
};

/**
 * Empty grid (no children).
 */
export const Empty = {
  args: { itemCount: 0 },
  render: renderGrid,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.queryAllByRole('article').length).toBe(0);
  },
};

/**
 * Single item layout.
 */
export const Single = {
  args: { itemCount: 1 },
  render: renderGrid,
};

/**
 * Many items to exercise wrapping/virtual spacing.
 */
export const Many = {
  args: { itemCount: 30 },
  render: renderGrid,
};

/**
 * Uneven count to check last-row alignment.
 */
export const Uneven = {
  args: { itemCount: 7 },
  render: renderGrid,
};

/**
 * Long names to test wrapping/overflow.
 */
export const LongNames = {
  args: { longNames: true, itemCount: 9 },
  render: renderGrid,
};

/**
 * Constrained container width for small screens.
 */
export const ConstrainedWidth = {
  args: { itemCount: 8 },
  render: renderGrid,
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Dark background contrast check (requires backgrounds addon).
 */
export const DarkBackground = {
  args: { itemCount: 6 },
  render: renderGrid,
  parameters: { backgrounds: { default: 'dark' } },
};

/**
 * RTL rendering.
 */
export const RTL = {
  args: { itemCount: 6 },
  render: renderGrid,
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
};
