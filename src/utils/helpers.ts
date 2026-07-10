import { TideStation } from '../types'

/**
 * Converts degrees to radians
 * 
 * Purpose: Helper function for geographic calculations
 * 
 * @param {number} iDegrees - Angle in degrees
 * @returns {number} oRadians - Angle in radians
 */
const toRadians = (iDegrees: number): number => {
  const oRadians = iDegrees * (Math.PI / 180)
  return oRadians
}

/**
 * Calculates distance between two geographic coordinates using Haversine formula
 * 
 * Purpose: Find distance between user location and tide stations for nearest station detection
 * 
 * @param {number} iLat1 - Latitude of first point (-90 to 90)
 * @param {number} iLon1 - Longitude of first point (-180 to 180)
 * @param {number} iLat2 - Latitude of second point (-90 to 90)
 * @param {number} iLon2 - Longitude of second point (-180 to 180)
 * @returns {number} oDistance - Distance in kilometers
 */
export const calculateDistance = (
  iLat1: number,
  iLon1: number,
  iLat2: number,
  iLon2: number
): number => {
  const earthRadius = 6371 // Earth's radius in kilometers
  const dLat = toRadians(iLat2 - iLat1)
  const dLon = toRadians(iLon2 - iLon1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(iLat1)) *
      Math.cos(toRadians(iLat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const oDistance = earthRadius * c
  
  return oDistance
}

/**
 * Finds the nearest tide station to a given geographic coordinate
 * 
 * Purpose: Help users find the closest tide monitoring station to their location
 * 
 * @param {number} iUserLat - User's latitude
 * @param {number} iUserLon - User's longitude
 * @param {TideStation[]} iStations - Array of available tide stations
 * @returns {TideStation | null} oNearestStation - Nearest station or null if no stations available
 */
export const findNearestStation = (
  iUserLat: number,
  iUserLon: number,
  iStations: TideStation[]
): TideStation | null => {
  if (iStations.length === 0) {
    return null
  }

  let nearestStation = iStations[0]
  let minDistance = calculateDistance(
    iUserLat,
    iUserLon,
    nearestStation.latitude,
    nearestStation.longitude
  )

  for (const station of iStations) {
    const distance = calculateDistance(
      iUserLat,
      iUserLon,
      station.latitude,
      station.longitude
    )
    
    if (distance < minDistance) {
      minDistance = distance
      nearestStation = station
    }
  }

  const oNearestStation = nearestStation
  return oNearestStation
}

/**
 * Formats tide height value for display
 * 
 * Purpose: Consistent height formatting across the application
 * 
 * @param {number} iHeight - Tide height in meters
 * @returns {string} oFormattedHeight - Formatted string with unit (e.g., "1.23 m")
 */
export const formatHeight = (iHeight: number): string => {
  const oFormattedHeight = `${iHeight.toFixed(2)} m`
  return oFormattedHeight
}

/**
 * Formats ISO time string to localized time
 * 
 * Purpose: Display time in Danish format (24-hour clock)
 * 
 * @param {string} iIsoTime - ISO 8601 time string
 * @returns {string} oFormattedTime - Formatted time string (e.g., "14:30")
 */
export const formatTime = (iIsoTime: string): string => {
  const date = new Date(iIsoTime)
  const oFormattedTime = date.toLocaleTimeString('da-DK', {
    hour: '2-digit',
    minute: '2-digit'
  })
  return oFormattedTime
}

/**
 * Formats ISO time string to localized date and time
 * 
 * Purpose: Display full date and time for tide extremes
 * 
 * @param {string} iIsoTime - ISO 8601 time string
 * @returns {string} oFormattedDateTime - Formatted date and time string (e.g., "9 jul 14:30")
 */
export const formatDateTime = (iIsoTime: string): string => {
  const date = new Date(iIsoTime)
  const oFormattedDateTime = date.toLocaleString('da-DK', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
  return oFormattedDateTime
}
