import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'
import { Navigation } from 'lucide-react'
import StationMarker from './StationMarker'
import { danishStations } from '../data/danishStations'

/**
 * FlyToStation Component
 * Helper component to animate map to a selected station
 */
const FlyToStation = ({ station }) => {
  const map = useMap()
  
  useEffect(() => {
    if (station) {
      map.flyTo([station.lat, station.lon], 11, {
        duration: 1.5
      })
    }
  }, [station, map])
  
  return null
}

/**
 * Main Map Component
 * Displays an interactive Leaflet map centered on Denmark
 * with tide station markers
 * 
 * Features:
 * - Touch-friendly controls for mobile
 * - Smooth animations when selecting stations
 * - Current location button (optional)
 * - Custom markers for tide stations
 */
const Map = ({ onStationClick, selectedStation }) => {
  const [map, setMap] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [isLocating, setIsLocating] = useState(false)

  // Denmark center coordinates
  const denmarkCenter = [55.7, 10.5]
  const defaultZoom = 7

  /**
   * Get user's current location
   * Requires browser geolocation permission
   */
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsLocating(true)
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation([latitude, longitude])
        
        if (map) {
          map.flyTo([latitude, longitude], 10, {
            duration: 2
          })
        }
        
        setIsLocating(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to get your location. Please enable location services.')
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  }

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

        {/* Fly to selected station */}
        <FlyToStation station={selectedStation} />

        {/* Station markers */}
        {danishStations.map((station) => (
          <StationMarker
            key={station.id}
            station={station}
            onClick={() => onStationClick(station)}
            isSelected={selectedStation?.id === station.id}
          />
        ))}
      </MapContainer>

      {/* Current Location Button */}
      <button
        onClick={handleLocateUser}
        disabled={isLocating}
        className="absolute bottom-20 right-4 z-[500] bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-700 p-3 rounded-lg shadow-lg border border-gray-300 transition-all duration-200 active:scale-95"
        aria-label="Find my location"
        title="Find my location"
      >
        <Navigation 
          className={`w-5 h-5 ${isLocating ? 'animate-pulse' : ''}`}
        />
      </button>

      {/* User location indicator (shown after location is found) */}
      {userLocation && (
        <div className="absolute bottom-32 right-4 z-[500] bg-white text-gray-700 px-3 py-2 rounded-lg shadow-lg border border-gray-300 text-xs">
          Your location
        </div>
      )}
    </div>
  )
}

export default Map
