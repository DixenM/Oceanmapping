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

/**
 * Default Leaflet marker icon configuration
 * 
 * Purpose: Configure standard blue marker icons for tide station locations
 */
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

/**
 * MapController component props
 */
interface MapControllerProps {
  iCenter: LatLngExpression
  iZoom: number
}

/**
 * MapController component - Controls map view programmatically
 * 
 * Purpose: Animates map to new center/zoom when station is selected
 * Uses React-Leaflet's useMap hook to access Leaflet map instance
 * 
 * @param {MapControllerProps} props - Map center and zoom level
 * @returns {null} Component has no visual output
 */
const MapController: React.FC<MapControllerProps> = ({ iCenter, iZoom }) => {
  const map = useMap()
  
  React.useEffect(() => {
    map.flyTo(iCenter, iZoom, {
      duration: 1.5
    })
  }, [iCenter, iZoom, map])

  return null
}

/**
 * App component - Main application component
 * 
 * Purpose: Root component for Danish Tide Tracker application
 * Manages application state and coordinates all child components
 * 
 * Features:
 * - Interactive Leaflet map centered on Denmark
 * - 53 tide monitoring stations across all Danish regions
 * - Station search and filtering
 * - GPS location detection
 * - Real-time tide data display
 * - Mobile-responsive design
 * 
 * @returns {JSX.Element} Main application UI
 */
const App: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<TideStation | null>(null)
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([56.0, 10.0])
  const [mapZoom, setMapZoom] = useState(7)
  const [showPopup, setShowPopup] = useState(false)

  /**
   * Handles station selection from search, location, or station list
   * 
   * Purpose: Center map on selected station and open tide info popup
   * 
   * @param {TideStation} iStation - Selected tide station
   * @returns {void}
   */
  const handleStationSelect = useCallback((iStation: TideStation): void => {
    setMapCenter([iStation.latitude, iStation.longitude])
    setMapZoom(12)
    setSelectedStation(iStation)
    setShowPopup(true)
  }, [])

  /**
   * Handles marker click on map
   * 
   * Purpose: Open tide info popup when user clicks a map marker
   * 
   * @param {TideStation} iStation - Clicked tide station
   * @returns {void}
   */
  const handleMarkerClick = useCallback((iStation: TideStation): void => {
    setSelectedStation(iStation)
    setShowPopup(true)
  }, [])

  /**
   * Handles popup close request
   * 
   * Purpose: Hide tide info popup
   * 
   * @returns {void}
   */
  const handleClosePopup = useCallback((): void => {
    setShowPopup(false)
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌊 Danish Tide Tracker</h1>
      </header>

      <div className="search-controls">
        <SearchBar iOnStationSelect={handleStationSelect} />
        <LocationButton 
          iStations={danishTideStations} 
          iOnLocationFound={handleStationSelect} 
        />
      </div>

      <StationList 
        iStations={danishTideStations}
        iOnStationSelect={handleStationSelect}
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
          
          <MapController iCenter={mapCenter} iZoom={mapZoom} />

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
            iStation={selectedStation}
            iOnClose={handleClosePopup}
          />
        </div>
      )}
    </div>
  )
}

export default App
