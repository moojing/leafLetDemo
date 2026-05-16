# Leaflet React Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal React demo that proves Leaflet custom marker icons stay synchronized with React state.

**Architecture:** Create a small Vite + React app that renders a `react-leaflet` map, stores park data in React state, and derives each marker icon from that state through a focused `L.divIcon` helper. Add a compact control panel, selected-park detail panel, and debug JSON block so marker UI, selection state, and raw React state can be compared directly.

**Tech Stack:** Vite, React, Leaflet, react-leaflet, Vitest, Testing Library

---

## File Structure

- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/index.css`
- Create: `src/data/parks.js`
- Create: `src/lib/createParkDivIcon.js`
- Create: `src/lib/createParkDivIcon.test.js`
- Create: `src/App.test.jsx`

## Task 1: Bootstrap the React Demo

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`

- [ ] **Step 1: Write the minimal project manifest**

```json
{
  "name": "leaflet-react-demo",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: Add Vite entry files**

```html
<!-- index.html -->
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`
Expected: install succeeds and lockfile is created

## Task 2: Implement Marker Icon Helper with TDD

**Files:**
- Create: `src/lib/createParkDivIcon.js`
- Create: `src/lib/createParkDivIcon.test.js`

- [ ] **Step 1: Write the failing tests**

```jsx
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/lib/createParkDivIcon.test.js`
Expected: FAIL because `createParkDivIcon` does not exist yet

- [ ] **Step 3: Write the minimal implementation**

```jsx
import L from 'leaflet';

export function createParkDivIcon(park) {
  const isEnabled = park.count > 0;
  const statusClass = isEnabled ? 'marker--enabled' : 'marker--disabled';
  const countMarkup = isEnabled
    ? `<span class="marker__count">${park.count}</span>`
    : '<span class="marker__count marker__count--hidden"></span>';

  return L.divIcon({
    className: 'park-marker-icon',
    html: `
      <div class="marker ${statusClass}" aria-label="${park.name}">
        <span class="marker__pin"></span>
        ${countMarkup}
      </div>
    `,
    iconSize: [44, 56],
    iconAnchor: [22, 56],
    popupAnchor: [0, -48]
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/lib/createParkDivIcon.test.js`
Expected: PASS

## Task 3: Implement App State, Controls, and Map with TDD

**Files:**
- Create: `src/data/parks.js`
- Create: `src/App.jsx`
- Create: `src/App.test.jsx`
- Modify: `src/main.jsx`

- [ ] **Step 1: Write the failing app behavior tests**

```jsx
import { fireEvent, render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import App from './App';

test('updates selected park details when marker control changes count', async () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /select anhe park/i }));
  fireEvent.click(screen.getByRole('button', { name: /set anhe park count to 0/i }));

  expect(screen.getByText(/status: disabled/i)).toBeInTheDocument();
  expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/App.test.jsx`
Expected: FAIL because `App` does not implement the expected controls yet

- [ ] **Step 3: Write the minimal implementation**

Implementation points:

- `src/data/parks.js` exports 3 mock Taipei parks
- `App.jsx` stores `parks` and `selectedParkId` in `useState`
- `App.jsx` renders:
  - map with `MapContainer`, `TileLayer`, and `Marker`
  - one button to select each park for testability
  - one button set per park for counts `3`, `2`, `1`, `0`
  - selected park detail panel
  - debug JSON block
- Each marker receives `icon={createParkDivIcon(park)}`
- Each marker click sets `selectedParkId`
- Each count button updates the targeted park in state

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/App.test.jsx`
Expected: PASS

## Task 4: Add Styling and Manual Verification Support

**Files:**
- Create: `src/index.css`
- Modify: `src/App.jsx`
- Modify: `src/lib/createParkDivIcon.js`

- [ ] **Step 1: Write the failing visual contract tests**

```jsx
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import App from './App';

test('prints debug JSON for current parks state', () => {
  render(<App />);
  expect(screen.getByLabelText(/parks state json/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail or remain incomplete**

Run: `npm test -- src/App.test.jsx`
Expected: FAIL until debug block labeling is present

- [ ] **Step 3: Write the minimal styling and accessibility implementation**

Implementation points:

- Add layout styling for page, map panel, controls, detail panel, and debug block
- Add marker CSS classes for red enabled state and gray disabled state
- Ensure the debug JSON block has an accessible label
- Keep map height fixed so demo is usable immediately

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/App.test.jsx`
Expected: PASS

## Task 5: Full Verification

**Files:**
- Verify only

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS with 0 failures

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: build succeeds

- [ ] **Step 3: Run the local dev server for manual verification**

Run: `npm run dev`
Expected: Vite serves the app locally

- [ ] **Step 4: Manually verify the demo**

Checklist:

- Click a marker and confirm selected park details update
- Change a selected park count to `0` and confirm disabled status
- Change it back to `1` or `2` and confirm enabled status
- Compare marker icon, detail panel, and debug JSON for consistency
