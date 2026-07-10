import React from 'react'
import { TideStation } from '../types'
import { useNearestStation } from '../hooks/useNearestStation'
import '../styles/LocationButton.css'

/**
 * LocationButton component props
 */
interface LocationButtonProps {
  iStations: TideStation[]
  iOnLocationFound: (iStation: TideStation) => void
}

/**
 * LocationButton component - GPS location finder for nearest tide station
 * 
 * Purpose: Uses browser Geolocation API to find user's location and
 * automatically select the nearest tide monitoring station
 * 
 * Features:
 * - GPS location detection
 * - Nearest station calculation
 * - Loading states
 * - Error handling (permission denied, location unavailable)
 * - Accessible button
 * 
 * @param {LocationButtonProps} props - Component props
 * @returns {JSX.Element} Location button component
 */
export const LocationButton: React.FC<LocationButtonProps> = ({ 
  iStations, 
  iOnLocationFound 
}) => {
  const { 
    nearestStation, 
    isLoading, 
    error, 
    requestLocation 
  } = useNearestStation(iStations)

  /**
   * Handles location button click
   * 
   * Purpose: Request user location and find nearest station
   * 
   * @returns {void}
   */
  const handleClick = (): void => {
    requestLocation()
  }

  // Notify parent when nearest station is found
  React.useEffect(() => {
    if (nearestStation) {
      iOnLocationFound(nearestStation)
    }
  }, [nearestStation, iOnLocationFound])

  return (
    <div className="location-button-container">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`location-button ${isLoading ? 'loading' : ''}`}
        aria-label="Find nearest tide station"
        title="Use GPS to find nearest station"
      >
        {isLoading ? '⌛' : '📍'}
      </button>
      
      {error && (
        <div className="location-error" role="alert">
          {error}
        </div>
      )}
      
      {nearestStation && !error && (
        <div className="location-success" role="status">
          ✓ Found: {nearestStation.name}
        </div>
      )}
    </div>
  )
}
