import '../src/index.css';
import '../src/App.css';
import { handlers } from '../src/stories/msw-handlers';

const preview = {
  parameters: {
    msw: { handlers },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
