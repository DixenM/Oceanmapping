import React, { useState } from 'react'
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
 * - Dismissible error messages with retry
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
    requestLocation,
    clearError
  } = useNearestStation(iStations)

  const [isDismissed, setIsDismissed] = useState(false)

  /**
   * Handles location button click
   * 
   * Purpose: Request user location and find nearest station
   * 
   * @returns {void}
   */
  const handleClick = (): void => {
    setIsDismissed(false)
    requestLocation()
  }

  /**
   * Handles retry button click
   * 
   * Purpose: Retry location request after error
   * 
   * @returns {void}
   */
  const handleRetry = (): void => {
    setIsDismissed(false)
    clearError()
    requestLocation()
  }

  /**
   * Handles dismissing the error message
   * 
   * Purpose: Allow user to close error notification
   * 
   * @returns {void}
   */
  const handleDismiss = (): void => {
    setIsDismissed(true)
    clearError()
  }

  // Notify parent when nearest station is found
  React.useEffect(() => {
    if (nearestStation) {
      iOnLocationFound(nearestStation)
    }
  }, [nearestStation, iOnLocationFound])

  // Show success message briefly then auto-dismiss
  const [showSuccess, setShowSuccess] = useState(false)
  React.useEffect(() => {
    if (nearestStation && !error) {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [nearestStation, error])

  return (
    <div className="location-button-container">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`location-button ${isLoading ? 'loading' : ''}`}
        aria-label="Find nearest tide station"
        title="Find nearest station"
      >
        {isLoading ? '⌛' : '📍'}
      </button>
      
      {error && !isDismissed && (
        <div className="location-notification error" role="alert">
          <div className="notification-content">
            <div className="notification-icon">⚠️</div>
            <div className="notification-message">
              <strong>Location Access Needed</strong>
              <p>{error}</p>
            </div>
            <button
              onClick={handleDismiss}
              className="notification-close"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
          <div className="notification-actions">
            <button onClick={handleRetry} className="retry-button">
              🔄 Try Again
            </button>
          </div>
        </div>
      )}
      
      {showSuccess && nearestStation && !error && (
        <div className="location-notification success" role="status">
          <div className="notification-content">
            <div className="notification-icon">✓</div>
            <div className="notification-message">
              <strong>Nearest Station Found</strong>
              <p>{nearestStation.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
