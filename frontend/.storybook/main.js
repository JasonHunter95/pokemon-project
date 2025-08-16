/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs',
    '@storybook/addon-essentials',
    '@storybook/addon-msw',
  ],
  framework: { name: '@storybook/react-webpack5', options: {} },
  staticDirs: ['..\\public'],
};
export default config;
