import React, { useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { LatLngExpression, Icon } from 'leaflet'
import { SearchBar } from './components/SearchBar'
import { LocationButton } from './components/LocationButton'
import { StationList } from './components/StationList'
import { TideInfoPopup } from './components/TideInfoPopup'
import { danishTideStations } from './data/stations'
import { TideStation } from './types'
import './styles/App.css'
import 'leaflet/dist/leaflet.css'

const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface MapControllerProps {
  center: LatLngExpression
  zoom: number
}

const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
  const map = useMap()
  
  React.useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5
    })
  }, [center, zoom, map])

  return null
}

const App: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<TideStation | null>(null)
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([56.0, 10.0])
  const [mapZoom, setMapZoom] = useState(7)
  const [showPopup, setShowPopup] = useState(false)

  const handleStationSelect = useCallback((station: TideStation) => {
    setMapCenter([station.latitude, station.longitude])
    setMapZoom(12)
    setSelectedStation(station)
    setShowPopup(true)
  }, [])

  const handleMarkerClick = useCallback((station: TideStation) => {
    setSelectedStation(station)
    setShowPopup(true)
  }, [])

  const handleClosePopup = useCallback(() => {
    setShowPopup(false)
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌊 Danish Tide Tracker</h1>
      </header>

      <div className="search-controls">
        <SearchBar onStationSelect={handleStationSelect} />
        <LocationButton 
          stations={danishTideStations} 
          onLocationFound={handleStationSelect} 
        />
      </div>

      <StationList 
        stations={danishTideStations}
        onStationSelect={handleStationSelect}
      />

      <div className="map-container">
        <MapContainer
          center={[56.0, 10.0]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={mapCenter} zoom={mapZoom} />

          {danishTideStations.map(station => (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={defaultIcon}
              eventHandlers={{
                click: () => handleMarkerClick(station)
              }}
            >
              <Popup>
                <div className="marker-popup">
                  <strong>{station.name}</strong>
                  <p>{station.city}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {showPopup && selectedStation && (
        <div className="popup-overlay">
          <TideInfoPopup 
            station={selectedStation}
            onClose={handleClosePopup}
          />
        </div>
      )}
    </div>
  )
}

export default App
