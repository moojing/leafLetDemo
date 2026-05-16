# Leaflet React Demo Design

## Goal

Build a minimal React demo that verifies a Leaflet map can render custom icon markers and keep those marker icons synchronized with React state.

## Scope

In scope:

- React-based single-page demo
- Leaflet map rendered through `react-leaflet`
- Custom marker icons implemented with `L.divIcon`
- Marker appearance driven by park `count`
- Marker click interaction
- Control panel for changing each park's `count`
- Debug output that exposes current React state

Out of scope:

- Backend API integration
- Persistence
- Authentication
- Multi-city tabs
- Production styling

## Functional Requirements

The demo must:

- Render a Leaflet map centered on Taipei with OpenStreetMap tiles
- Display 3 to 5 mock park markers
- Show a red marker with a number when `count > 0`
- Show a gray marker without a number when `count === 0`
- Allow the user to click a marker and inspect its current data
- Allow the user to update a park's `count` from the UI
- Update the visible marker icon immediately after React state changes
- Keep the selected park detail panel synchronized after state changes
- Expose current park state in a debug JSON block for verification

## Technical Design

### Stack

- Vite
- React
- Leaflet
- react-leaflet

An open-source SVG library may be used if it helps shape the marker artwork cleanly, but the primary integration point remains `L.divIcon`.

### State Model

React is the single source of truth.

The page state will include:

- `parks`: array of park objects
- `selectedParkId`: the currently selected marker, or `null`

Each park object will include:

- `id`
- `name`
- `lat`
- `lng`
- `count`

Derived state:

- `enabled = count > 0`

### Marker Rendering

Each marker icon is generated from the current park state through a helper such as `createParkDivIcon(park)`.

Rules:

- Enabled park: red icon, numeric badge visible
- Disabled park: gray icon, numeric badge hidden

The helper will return a fresh `L.divIcon` built from HTML and CSS classes. The HTML will contain the marker shell and a small numeric area tied to `count`.

### State Synchronization

The demo is specifically intended to verify synchronization between React state and Leaflet marker UI.

Synchronization flow:

1. User changes a park's `count` from the control panel
2. React updates `parks`
3. The updated park data is passed back into marker rendering
4. The corresponding marker icon updates to reflect the new state
5. If the selected park was changed, the detail panel also updates from the same React state

Verification signals shown in the UI:

- Control panel displays each park's current `count` and enabled/disabled status
- Detail panel displays the selected park's live data
- Debug JSON block prints the full `parks` array and `selectedParkId`

This makes it possible to verify that:

- Marker icon appearance matches React state
- Selected marker detail matches React state
- Debug output matches both

## UI Layout

Minimal page layout:

- Page title
- Main map area
- Side or bottom control panel
- Selected park detail panel
- Debug JSON section

The visual goal is clarity for state verification, not production polish.

## Interaction Flow

1. Initial load shows the map and mock markers
2. User clicks a marker
3. The selected park detail panel updates
4. User changes that park's `count` through the control panel
5. The marker icon updates immediately
6. The detail panel updates immediately
7. The debug JSON reflects the same new state

Expected transitions:

- `3 -> 2 -> 1`: stays red, number changes
- `1 -> 0`: turns gray, number disappears
- `0 -> 1`: turns red, number reappears

## Testing Strategy

The demo needs lightweight automated coverage focused on behavior, not map internals.

Test targets:

- Icon helper returns enabled styling when `count > 0`
- Icon helper returns disabled styling when `count === 0`
- State update logic changes the target park count correctly
- Selected park detail reflects updated React state

Manual verification checklist:

- Load page and confirm markers render
- Click a marker and confirm selected park data changes
- Change a park count to `0` and confirm gray disabled marker
- Change a park count from `0` to positive and confirm red enabled marker
- Compare marker visuals, detail panel, and debug JSON for consistency

## Implementation Notes

- Keep marker creation isolated in a small helper so icon rules are easy to inspect
- Keep state update logic in React, not in Leaflet event handlers directly
- Avoid over-abstracting; this is a focused verification demo

## Acceptance Criteria

The demo is complete when:

- The map renders successfully in React
- Custom markers appear at park coordinates
- Marker visuals change when React state changes
- Selected marker details stay synchronized with state updates
- Debug JSON confirms the same underlying state
