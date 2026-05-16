import { describe, expect, test } from 'vitest';
import { createParkDivIcon } from './createParkDivIcon';

describe('createParkDivIcon', () => {
  test('renders enabled marker markup when count is positive', () => {
    const icon = createParkDivIcon({
      name: 'Anhe Park',
      count: 3
    });

    expect(icon.options.html).toContain('marker--enabled');
    expect(icon.options.html).toContain('3');
    expect(icon.options.html).toContain('Anhe Park');
  });

  test('renders disabled marker markup when count is zero', () => {
    const icon = createParkDivIcon({
      name: 'Tonghua Park',
      count: 0
    });

    expect(icon.options.html).toContain('marker--disabled');
    expect(icon.options.html).not.toContain('marker__count">0<');
  });
});
