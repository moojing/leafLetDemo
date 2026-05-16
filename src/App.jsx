import { useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { initialParks } from './data/parks';
import { createParkDivIcon } from './lib/createParkDivIcon';

const taipeiCenter = [25.033, 121.5654];
const countOptions = [3, 2, 1, 0];

function getStatusText(count) {
  return count > 0 ? 'enabled' : 'disabled';
}

export default function App() {
  const [parks, setParks] = useState(initialParks);
  const [selectedParkId, setSelectedParkId] = useState(initialParks[0].id);

  const selectedPark = useMemo(
    () => parks.find((park) => park.id === selectedParkId) ?? parks[0],
    [parks, selectedParkId]
  );

  function updateParkCount(parkId, nextCount) {
    setParks((currentParks) =>
      currentParks.map((park) =>
        park.id === parkId ? { ...park, count: nextCount } : park
      )
    );
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <h1>Leaflet Marker State Demo</h1>
        <p>Verify custom marker icons stay synchronized with React state.</p>
      </header>

      <section className="map-panel">
        <div className="map-frame">
          <MapContainer center={taipeiCenter} zoom={14} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {parks.map((park) => (
              <Marker
                key={park.id}
                position={[park.lat, park.lng]}
                icon={createParkDivIcon(park)}
                eventHandlers={{
                  click: () => setSelectedParkId(park.id)
                }}
              >
                <Popup>{park.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>

      <section className="dashboard-grid">
        <section className="card">
          <h2>Parks</h2>
          <div className="park-list">
            {parks.map((park) => (
              <article key={park.id} className="park-card">
                <div className="park-card__header">
                  <div>
                    <h3>{park.name}</h3>
                    <p>
                      Live state: {park.count} / {getStatusText(park.count)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => setSelectedParkId(park.id)}
                  >
                    Select {park.name}
                  </button>
                </div>
                <div className="count-actions">
                  {countOptions.map((count) => (
                    <button
                      key={`${park.id}-${count}`}
                      type="button"
                      className="count-button"
                      onClick={() => updateParkCount(park.id, count)}
                    >
                      Set {park.name} count to {count}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Selected Park</h2>
          <div className="selected-park">
            <p>Name: {selectedPark.name}</p>
            <p>Count: {selectedPark.count}</p>
            <p>Status: {getStatusText(selectedPark.count)}</p>
          </div>
        </section>

        <section className="card card--debug">
          <h2>Debug State</h2>
          <pre aria-label="Parks state JSON" className="debug-output">
            {JSON.stringify({ parks, selectedParkId }, null, 2)}
          </pre>
        </section>
      </section>

    </main>
  );
}
