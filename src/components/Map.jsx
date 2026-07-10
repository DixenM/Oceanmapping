import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getWaveHeightColor } from '../services/marineWeatherService';

const DENMARK_CENTER = [56.2639, 9.5018];

const DEFAULT_STATIONS = [
  { id: 1, name: 'Copenhagen Harbor', lat: 55.6761, lon: 12.5683 },
  { id: 2, name: 'Aarhus Bay', lat: 56.1629, lon: 10.2134 },
  { id: 3, name: 'Esbjerg Port', lat: 55.4677, lon: 8.4521 },
  { id: 4, name: 'Skagen', lat: 57.7209, lon: 10.5830 },
  { id: 5, name: 'Roskilde Fjord', lat: 55.8403, lon: 12.0859 }
];

function Map({ onStationClick, showWaveOverlay, marineData }) {
  const createMarkerIcon = (station) => {
    if (!showWaveOverlay || !marineData[station.id]) {
      return L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    }

    const waveHeight = marineData[station.id]?.current?.waveHeight || 0;
    const color = getWaveHeightColor(waveHeight);
    
    const svgIcon = `
      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="20" fill="${color}" stroke="white" stroke-width="3" opacity="0.85"/>
        <text x="25" y="30" text-anchor="middle" fill="white" font-size="14" font-weight="bold">
          ${waveHeight.toFixed(1)}m
        </text>
      </svg>
    `;

    return L.divIcon({
      html: svgIcon,
      className: 'wave-overlay-marker',
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    });
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={DENMARK_CENTER} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {DEFAULT_STATIONS.map(station => (
          <Marker
            key={station.id}
            position={[station.lat, station.lon]}
            icon={createMarkerIcon(station)}
            eventHandlers={{
              click: () => onStationClick(station)
            }}
          >
            <Popup>
              <strong>{station.name}</strong>
              <br />
              {marineData[station.id] && (
                <span>
                  Wave: {marineData[station.id].current.waveHeight.toFixed(1)}m
                  <br />
                  Wind: {marineData[station.id].current.windSpeed.toFixed(1)} km/h
                </span>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
export { DEFAULT_STATIONS };
