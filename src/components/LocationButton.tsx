import React, { useState, useCallback } from 'react'
import { TideStation } from '../types'
import { findNearestStation } from '../utils/helpers'
import '../styles/LocationButton.css'

interface LocationButtonProps {
  stations: TideStation[]
  onLocationFound: (station: TideStation) => void
}

export const LocationButton: React.FC<LocationButtonProps> = ({ 
  stations, 
  onLocationFound 
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        const nearest = findNearestStation(latitude, longitude, stations)
        
        if (nearest) {
          onLocationFound(nearest)
        } else {
          setError('No nearby station found')
        }
        
        setLoading(false)
      },
      error => {
        setError('Location access denied')
        setLoading(false)
        console.error('Geolocation error:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }, [stations, onLocationFound])

  return (
    <div className="location-button-container">
      <button
        onClick={handleGetLocation}
        disabled={loading}
        className="location-button"
        title="Find nearest station"
      >
        {loading ? '⌛' : '📍'}
      </button>
      {error && <div className="location-error">{error}</div>}
    </div>
  )
}
