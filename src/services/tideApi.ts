import { TideInfo, TideData, TideStatus } from '../types'
import { logError } from '../utils/logger'

/**
 * WorldTides API configuration
 * Purpose: Load API key from environment and set base URL
 */
const WORLDTIDES_API_KEY = import.meta.env.VITE_WORLDTIDES_KEY || ''
const API_BASE_URL = 'https://www.worldtides.info/api/v3'

// Debug logging for API key (only shows if key exists, not the actual key value)
if (import.meta.env.DEV) {
  console.log('[TideAPI] API Key loaded:', WORLDTIDES_API_KEY ? '✓ Present' : '✗ Missing')
}

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
  // Check if API key is configured
  if (!WORLDTIDES_API_KEY || WORLDTIDES_API_KEY.trim() === '') {
    const errorMessage = 'API key not configured. Please add VITE_WORLDTIDES_KEY to your .env file.'
    console.error('[TideAPI] ' + errorMessage)
    throw new Error(errorMessage)
  }

  if (import.meta.env.DEV) {
    console.log(`[TideAPI] Fetching tide data for lat: ${iLatitude}, lon: ${iLongitude}`)
  }

  try {
    const now = new Date()
    const startTimestamp = Math.floor(now.getTime() / 1000) - 86400 // 24 hours ago
    const lengthSeconds = 86400 * 2 // 48 hours

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const apiUrl = `${API_BASE_URL}?extremes&heights&lat=${iLatitude}&lon=${iLongitude}&start=${startTimestamp}&length=${lengthSeconds}&key=${WORLDTIDES_API_KEY}`
    
    if (import.meta.env.DEV) {
      // Log URL without exposing the full API key
      console.log(`[TideAPI] Request URL: ${apiUrl.replace(WORLDTIDES_API_KEY, '***KEY***')}`)
    }

    const response = await fetch(apiUrl, { signal: controller.signal })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error(`[TideAPI] API error ${response.status}: ${errorText}`)
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid API key. Please check your VITE_WORLDTIDES_KEY.')
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      } else {
        throw new Error(`API error (${response.status}). Please try again.`)
      }
    }

    const data = await response.json()

    if (import.meta.env.DEV) {
      console.log('[TideAPI] Response data:', data)
    }

    if (!data.extremes || data.extremes.length === 0) {
      console.error('[TideAPI] No tide extremes in response:', data)
      throw new Error('No tide data available for this location.')
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

    if (import.meta.env.DEV) {
      console.log('[TideAPI] Successfully fetched tide data:', oTideData)
    }

    return oTideData
  } catch (error) {
    // Handle timeout errors specifically
    if (error instanceof Error && error.name === 'AbortError') {
      const timeoutError = 'Request timeout - please try again'
      console.error('[TideAPI] ' + timeoutError)
      logError('Request timeout: WorldTides API took longer than 10 seconds', error)
      throw new Error(timeoutError)
    }
    
    // Re-throw API key and other user-facing errors as-is
    if (error instanceof Error && 
        (error.message.includes('API key') || 
         error.message.includes('Rate limit') ||
         error.message.includes('No tide data'))) {
      throw error
    }

    // Log and wrap unexpected errors
    console.error('[TideAPI] Unexpected error:', error)
    logError('Error fetching tide data from WorldTides API', error)
    throw new Error('Failed to load tide data. Please check your connection and try again.')
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
