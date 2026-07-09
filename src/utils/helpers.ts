import { TideStation } from '../types'

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180)
}

export const findNearestStation = (
  userLat: number,
  userLon: number,
  stations: TideStation[]
): TideStation | null => {
  if (stations.length === 0) return null

  let nearest = stations[0]
  let minDistance = calculateDistance(
    userLat,
    userLon,
    nearest.latitude,
    nearest.longitude
  )

  for (const station of stations) {
    const distance = calculateDistance(
      userLat,
      userLon,
      station.latitude,
      station.longitude
    )
    
    if (distance < minDistance) {
      minDistance = distance
      nearest = station
    }
  }

  return nearest
}

export const formatHeight = (height: number): string => {
  return `${height.toFixed(2)} m`
}

export const formatTime = (isoTime: string): string => {
  const date = new Date(isoTime)
  return date.toLocaleTimeString('da-DK', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDateTime = (isoTime: string): string => {
  const date = new Date(isoTime)
  return date.toLocaleString('da-DK', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
