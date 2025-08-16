import React from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { expect, within } from '@storybook/test';

export default {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    chromatic: { viewports: [320, 768, 1024] },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 16, border: '1px dashed #e2e2e2' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Live animated spinner for manual review (snapshot disabled to avoid flake).
 */
export const Default = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText(/loading pokemon/i)).toBeInTheDocument();
  },
};

/**
 * Static snapshot with animations paused for visual regression.
 */
export const Static = {
  name: 'Static (animations paused)',
  decorators: [
    (Story) => (
      <div>
        <style>
          {`
            /* Pause animations and transitions for deterministic screenshots */
            * { animation: none !important; transition: none !important; }
          `}
        </style>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText(/loading pokemon/i)).toBeInTheDocument();
  },
};

/**
 * Confined layout to check centering and wrapping.
 */
export const ConstrainedWidth = {
  decorators: [
    (Story) => (
      <div style={{ width: 200, padding: 8, border: '1px dashed #bbb' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Dark theme background for contrast review.
 */
export const DarkBackground = {
  parameters: { backgrounds: { default: 'dark' } },
};

/**
 * RTL rendering sanity check.
 */
export const RTL = {
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
};
