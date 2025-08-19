import ErrorMessage from '../components/ErrorMessage';
import React from 'react';
import { expect, fn, userEvent, within } from '@storybook/test';

export default {
  title: 'Components/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs'],
  args: {
    message: 'Something went wrong while fetching data. Please try again.',
    showRetry: true,
    onRetry: fn(),
  },
  parameters: {
    layout: 'centered',
    // Helps visual regression catch wrapping/overflow issues
    chromatic: { viewports: [320, 768, 1024] },
    a11y: { disable: false },
  },
  // Constrain width for realistic layouts and consistent snapshots
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420, padding: 16, border: '1px dashed #e2e2e2' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Baseline state with clickable Retry.
 */
export const Default = {
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    // Heading is visible
    await expect(c.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();

    // Clicking Retry calls handler
    const btn = c.getByRole('button', { name: /retry/i });
    await userEvent.click(btn);
    await expect(args.onRetry).toHaveBeenCalledTimes(1);
  },
};

/**
 * Retry hidden via prop.
 */
export const WithoutRetryButton = {
  args: { showRetry: false },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.queryByRole('button', { name: /retry/i })).toBeNull();
  },
};

/**
 * Retry suppressed when no handler provided (component checks onRetry && showRetry).
 */
export const WithoutHandler = {
  args: { onRetry: undefined },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.queryByRole('button', { name: /retry/i })).toBeNull();
  },
};

/**
 * Long, multi-paragraph message to test wrapping and spacing.
 */
export const LongMessage = {
  args: {
    message:
      'We could not load your Pokémon right now. This might be due to a network issue, the server being busy, or an unexpected error.\n\nTry again in a few seconds. If the problem persists, check your connection or contact support.',
  },
};

/**
 * Unbroken content to test overflow handling.
 */
export const LongUnbrokenMessage = {
  args: {
    message: 'ERROR_' + 'X'.repeat(300),
  },
};

/**
 * Empty string to surface how UI behaves with missing text.
 */
export const EmptyMessage = {
  args: { message: '' },
};

/**
 * Emoji and punctuation rendering.
 */
export const EmojisAndSymbols = {
  args: {
    message: '🔥 Network timeout while contacting PokéAPI. ✨ Please try again.',
  },
};

/**
 * Right-to-left rendering.
 */
export const RTL = {
  args: { message: 'حدث خطأ غير متوقع. حاول مرة أخرى.' },
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
};

/**
 * Dark background contrast check (requires backgrounds addon preset).
 */
export const DarkBackground = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
