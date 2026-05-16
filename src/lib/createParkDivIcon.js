import L from 'leaflet';

function buildMarkerSvg(isEnabled) {
  const fill = isEnabled ? '#d62839' : '#8a8f98';

  return `
    <svg class="marker__svg" viewBox="0 0 40 52" aria-hidden="true" focusable="false">
      <path
        d="M20 2C10.059 2 2 10.059 2 20c0 11.544 14.256 27.935 17.228 31.194a1 1 0 0 0 1.544 0C23.744 47.935 38 31.544 38 20 38 10.059 29.941 2 20 2Z"
        fill="${fill}"
      />
      <circle cx="20" cy="20" r="10" fill="rgba(255,255,255,0.18)" />
    </svg>
  `;
}

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
        ${buildMarkerSvg(isEnabled)}
        ${countMarkup}
      </div>
    `,
    iconSize: [44, 56],
    iconAnchor: [22, 56],
    popupAnchor: [0, -48]
  });
}
