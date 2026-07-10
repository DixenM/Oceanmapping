import { useState, useEffect } from 'react'
import { TideStation } from '../types'
import { findNearestStation } from '../utils/helpers'
import { logError, logInfo } from '../utils/logger'

/**
 * Geolocation hook result
 */
export interface UseNearestStationResult {
  nearestStation: TideStation | null
  userLocation: GeolocationCoordinates | null
  isLoading: boolean
  error: string | null
  requestLocation: () => void
}

/**
 * Custom hook to find nearest tide station based on user's GPS location
 * 
 * Purpose: Helps users quickly find the closest tide monitoring station
 * Uses browser Geolocation API to get user coordinates, then calculates
 * distance to all stations to find the nearest one
 * 
 * Features:
 * - GPS location detection
 * - Nearest station calculation
 * - Error handling (permission denied, location unavailable)
 * - Manual location request
 * - Loading states
 * 
 * @param {TideStation[]} iStations - Array of available tide stations
 * @returns {UseNearestStationResult} oLocationResult - Location data, nearest station, loading/error states
 * 
 * @example
 * const { nearestStation, isLoading, error, requestLocation } = useNearestStation(stations)
 * 
 * if (isLoading) return <p>Getting your location...</p>
 * if (error) return <p>Error: {error}</p>
 * if (nearestStation) return <p>Nearest: {nearestStation.name}</p>
 * 
 * <button onClick={requestLocation}>Find Nearest Station</button>
 */
export const useNearestStation = (
  iStations: TideStation[]
): UseNearestStationResult => {
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates | null>(null)
  const [nearestStation, setNearestStation] = useState<TideStation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Requests user's geolocation and finds nearest station
   * 
   * Purpose: Trigger GPS location detection
   * 
   * @returns {void}
   */
  const requestLocation = (): void => {
    // Check if Geolocation API is available
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = position.coords
        setUserLocation(coords)
        
        logInfo('User location obtained', {
          lat: coords.latitude,
          lon: coords.longitude
        })

        // Find nearest station
        const nearest = findNearestStation(
          coords.latitude,
          coords.longitude,
          iStations
        )

        setNearestStation(nearest)
        setIsLoading(false)
      },
      (geoError) => {
        let errorMessage = 'Unable to get your location'
        
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.'
            break
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case geoError.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }

        logError('Geolocation error', geoError)
        setError(errorMessage)
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Cache position for 1 minute
      }
    )
  }

  // Calculate nearest station whenever user location changes
  useEffect(() => {
    if (userLocation && iStations.length > 0) {
      const nearest = findNearestStation(
        userLocation.latitude,
        userLocation.longitude,
        iStations
      )
      setNearestStation(nearest)
    }
  }, [userLocation, iStations])

  const oLocationResult: UseNearestStationResult = {
    nearestStation,
    userLocation,
    isLoading,
    error,
    requestLocation
  }

  return oLocationResult
}
