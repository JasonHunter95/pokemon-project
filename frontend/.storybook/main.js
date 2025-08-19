/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/preset-create-react-app', '@storybook/addon-docs', '@storybook/test'],
  framework: { name: '@storybook/react-webpack5', options: {} },
  staticDirs: ['../public'],
};
export default config;
