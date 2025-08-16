import '../src/index.css';
import '../src/App.css';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { handlers } from '../src/stories/msw-handlers';

initialize({ onUnhandledRequest: 'bypass' });

export const decorators = [mswDecorator];

const preview = {
  parameters: {
    msw: { handlers },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: 'centered',
  },
};

export default preview;
