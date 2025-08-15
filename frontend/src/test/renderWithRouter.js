import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

export function renderWithRouter(ui, { route = '/', entries, future } = {}) {
  const initialEntries = entries || [route];
  return render(
    <MemoryRouter
      initialEntries={initialEntries}
      future={{ v7_relativeSplatPath: true, v7_startTransition: true, ...future }}
    >
      {ui}
    </MemoryRouter>
  );
}
