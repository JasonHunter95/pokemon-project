import React from 'react';
import Pagination from '../components/Pagination';
import { expect, fn, userEvent, within } from '@storybook/test';

export default {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    pagination: {
      offset: 40,
      limit: 20,
      count: 151,
      previous: '/?offset=20&limit=20',
      next: '/?offset=60&limit=20',
    },
    onNext: fn(),
    onPrevious: fn(),
    loading: false,
  },
  parameters: {
    layout: 'centered',
    chromatic: { viewports: [320, 768, 1024] },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520, padding: 16, border: '1px dashed #e2e2e2' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Mid-list, both buttons enabled.
 */
export const Default = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const prev = c.getByRole('button', { name: /previous/i });
    const next = c.getByRole('button', { name: /next/i });

    await expect(prev).not.toBeDisabled();
    await expect(next).not.toBeDisabled();

    await userEvent.click(next);
    await expect(args.onNext).toHaveBeenCalledTimes(1);

    await userEvent.click(prev);
    await expect(args.onPrevious).toHaveBeenCalledTimes(1);
  },
};

/**
 * First page: Previous disabled.
 */
export const FirstPage = {
  args: {
    pagination: {
      offset: 0,
      limit: 20,
      count: 151,
      previous: null,
      next: '/?offset=20&limit=20',
    },
  },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const prev = c.getByRole('button', { name: /previous/i });
    const next = c.getByRole('button', { name: /next/i });

    await expect(prev).toBeDisabled();
    await expect(next).not.toBeDisabled();

    await userEvent.click(prev);
    await expect(args.onPrevious).toHaveBeenCalledTimes(0);
  },
};

/**
 * Last page: Next disabled.
 */
export const LastPage = {
  args: {
    pagination: {
      offset: 140, // last page for 151 with limit 20
      limit: 20,
      count: 151,
      previous: '/?offset=120&limit=20',
      next: null,
    },
  },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const prev = c.getByRole('button', { name: /previous/i });
    const next = c.getByRole('button', { name: /next/i });

    await expect(prev).not.toBeDisabled();
    await expect(next).toBeDisabled();

    await userEvent.click(next);
    await expect(args.onNext).toHaveBeenCalledTimes(0);
  },
};

/**
 * Loading state disables both controls.
 */
export const Loading = {
  args: {
    loading: true,
    pagination: {
      offset: 40,
      limit: 20,
      count: 151,
      previous: '/?offset=20&limit=20',
      next: '/?offset=60&limit=20',
    },
  },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const prev = c.getByRole('button', { name: /previous/i });
    const next = c.getByRole('button', { name: /next/i });

    await expect(prev).toBeDisabled();
    await expect(next).toBeDisabled();

    await userEvent.click(next);
    await userEvent.click(prev);
    await expect(args.onNext).toHaveBeenCalledTimes(0);
    await expect(args.onPrevious).toHaveBeenCalledTimes(0);
  },
};

/**
 * Short last page: range should be 141–145 of 145.
 */
export const PartialLastPage = {
  args: {
    pagination: {
      offset: 140,
      limit: 20,
      count: 145,
      previous: '/?offset=120&limit=20',
      next: null,
    },
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText(/showing\s+141-145\s+of\s+145/i)).toBeInTheDocument();
  },
};

/**
 * Zero results surface any formatting issues.
 */
export const ZeroResults = {
  args: {
    pagination: {
      offset: 0,
      limit: 20,
      count: 0,
      previous: null,
      next: null,
    },
  },
};

/**
 * Constrained width for wrapping checks.
 */
export const ConstrainedWidth = {
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * RTL rendering.
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

/**
 * Dark background contrast check (requires backgrounds addon).
 */
export const DarkBackground = {
  parameters: { backgrounds: { default: 'dark' } },
};
