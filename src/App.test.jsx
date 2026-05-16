import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => null,
  Marker: ({ children, eventHandlers, icon, position }) => {
    const markerState = icon?.options?.html?.includes('marker--disabled')
      ? 'disabled'
      : 'enabled';

    return (
      <button
        type="button"
        aria-label={`marker-${position[0]}-${position[1]}`}
        data-marker-state={markerState}
        data-icon-html={icon?.options?.html ?? ''}
        onClick={() => eventHandlers?.click?.()}
      >
        {children}
      </button>
    );
  },
  Popup: ({ children }) => <div>{children}</div>
}));

test('updates selected park details when marker control changes count', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /select anhe park/i }));
  fireEvent.click(screen.getByRole('button', { name: /set anhe park count to 0/i }));

  expect(screen.getByText(/status: disabled/i)).toBeInTheDocument();
  expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
});

test('prints debug JSON for current parks state', () => {
  render(<App />);

  expect(screen.getByLabelText(/parks state json/i)).toBeInTheDocument();
});

test('updates marker icon state when the park count changes', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /set anhe park count to 0/i }));

  expect(screen.getByLabelText('marker-25.0335-121.554')).toHaveAttribute(
    'data-marker-state',
    'disabled'
  );
});
