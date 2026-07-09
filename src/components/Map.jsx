import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet'
import { useState } from 'react'
import StationMarker from './StationMarker'
import { danishStations } from '../data/danishStations'

/**
 * Main Map Component
 * Displays an interactive Leaflet map centered on Denmark
 * with tide station markers
 */
const Map = ({ onStationClick, selectedStation }) => {
  const [map, setMap] = useState(null)

  // Denmark center coordinates
  const denmarkCenter = [55.7, 10.5]
  const defaultZoom = 7

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={denmarkCenter}
        zoom={defaultZoom}
        zoomControl={false}
        className="w-full h-full"
        ref={setMap}
        scrollWheelZoom={true}
        touchZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        
        <ZoomControl position="topright" />

        {danishStations.map((station) => (
          <StationMarker
            key={station.id}
            station={station}
            onClick={() => onStationClick(station)}
            isSelected={selectedStation?.id === station.id}
          />
        ))}
      </MapContainer>
    </div>
  )
}

export default Map
