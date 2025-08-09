import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /pokemon type selector/i });
  expect(headerElement).toBeInTheDocument();
});
