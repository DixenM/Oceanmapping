import { TideInfo, TideData, TideStatus } from '../types'
import { logError } from '../utils/logger'

const WORLDTIDES_API_KEY = import.meta.env.VITE_WORLDTIDES_API_KEY || 'demo'
const API_BASE_URL = 'https://www.worldtides.info/api/v3'

/**
 * Fetches tide data for a given geographic location from WorldTides API
 * 
 * Purpose: Retrieves current tide height, upcoming extremes (high/low tides), 
 * and calculates tide status (rising/falling) for tide monitoring stations
 * 
 * @param {number} iLatitude - Location latitude (-90 to 90)
 * @param {number} iLongitude - Location longitude (-180 to 180)
 * @returns {Promise<TideInfo>} oTideData - Complete tide information including current height, extremes, and status
 * @throws {Error} When API request fails or returns invalid data
 */
export const fetchTideData = async (
  iLatitude: number,
  iLongitude: number
): Promise<TideInfo> => {
  try {
    const now = new Date()
    const startTimestamp = Math.floor(now.getTime() / 1000) - 86400 // 24 hours ago
    const lengthSeconds = 86400 * 2 // 48 hours

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(
      `${API_BASE_URL}?extremes&heights&lat=${iLatitude}&lon=${iLongitude}&start=${startTimestamp}&length=${lengthSeconds}&key=${WORLDTIDES_API_KEY}`,
      { signal: controller.signal }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`WorldTides API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.extremes || data.extremes.length === 0) {
      throw new Error('No tide extremes data available from API')
    }

    const currentHeight = data.heights?.[0]?.height || 0
    const currentTime = data.heights?.[0]?.dt || now.toISOString()

    const extremes: TideData[] = data.extremes.map((extreme: any) => ({
      height: extreme.height,
      time: new Date(extreme.dt * 1000).toISOString(),
      type: extreme.type === 'High' ? 'High' : 'Low'
    }))

    const status = calculateTideStatus(extremes, currentTime)

    const oTideData: TideInfo = {
      current: {
        height: currentHeight,
        time: currentTime
      },
      extremes: extremes.slice(0, 6), // Next 6 extremes
      status
    }

    return oTideData
  } catch (error) {
    // Handle timeout errors specifically
    if (error instanceof Error && error.name === 'AbortError') {
      logError('Request timeout: WorldTides API took longer than 10 seconds', error)
      throw new Error('Request timeout - please try again')
    }
    logError('Error fetching tide data from WorldTides API', error)
    throw error
  }
}

/**
 * Calculates current tide status based on tide height and extremes
 * 
 * Purpose: Determine if tide is rising, falling, at high tide, or at low tide
 * Used for visual indicators and user information
 * 
 * @param {TideData[]} iExtremes - Array of upcoming tide extremes
 * @param {string} iCurrentTime - Current time as ISO string
 * @returns {TideStatus} oStatus - Tide status with state, message, color, and icon
 */
const calculateTideStatus = (
  iExtremes: TideData[],
  iCurrentTime: string
): TideStatus => {
  // Default status if insufficient data
  if (iExtremes.length < 2) {
    const oStatus: TideStatus = {
      state: 'rising',
      message: 'Data unavailable',
      color: '#6b7280',
      icon: '〰️'
    }
    return oStatus
  }

  const currentTimestamp = new Date(iCurrentTime).getTime()
  
  let prevExtreme: TideData | null = null
  let nextExtreme: TideData | null = null

  // Find the two extremes surrounding current time
  for (let i = 0; i < iExtremes.length - 1; i++) {
    const extremeTime = new Date(iExtremes[i].time).getTime()
    const nextExtremeTime = new Date(iExtremes[i + 1].time).getTime()

    if (extremeTime <= currentTimestamp && currentTimestamp <= nextExtremeTime) {
      prevExtreme = iExtremes[i]
      nextExtreme = iExtremes[i + 1]
      break
    }
  }

  // If we can't determine position between extremes
  if (!prevExtreme || !nextExtreme) {
    const oStatus: TideStatus = {
      state: 'rising',
      message: 'Calculating...',
      color: '#6b7280',
      icon: '〰️'
    }
    return oStatus
  }

  const prevTime = new Date(prevExtreme.time).getTime()
  const nextTime = new Date(nextExtreme.time).getTime()
  const progress = (currentTimestamp - prevTime) / (nextTime - prevTime)

  let oStatus: TideStatus

  // Determine if we're between low->high (rising) or high->low (falling)
  if (prevExtreme.type === 'Low' && nextExtreme.type === 'High') {
    // Rising tide
    if (progress < 0.15) {
      // Very close to low tide
      oStatus = {
        state: 'low',
        message: 'Low Tide',
        color: '#ef4444',
        icon: '⬇️'
      }
    } else {
      // Rising
      oStatus = {
        state: 'rising',
        message: 'Rising',
        color: '#3b82f6',
        icon: '↗️'
      }
    }
  } else {
    // Falling tide (high->low)
    if (progress < 0.15) {
      // Very close to high tide
      oStatus = {
        state: 'high',
        message: 'High Tide',
        color: '#10b981',
        icon: '⬆️'
      }
    } else {
      // Falling
      oStatus = {
        state: 'falling',
        message: 'Falling',
        color: '#f59e0b',
        icon: '↘️'
      }
    }
  }

  return oStatus
}
