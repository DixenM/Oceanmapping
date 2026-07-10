import { logError } from '../utils/logger'

const BASE_URL = 'https://marine-api.open-meteo.com/v1/marine'

/**
 * Marine weather data for current conditions
 */
export interface CurrentMarineData {
  waveHeight: number
  waveDirection: number
  windWaveHeight: number
  windSpeed: number
  windDirection: number
  timestamp?: string
}

/**
 * Marine weather forecast data point
 */
export interface MarineForecastPoint {
  time: string
  waveHeight: number
  waveDirection: number
  windWaveHeight: number
  windSpeed: number
  windDirection: number
  swellWaveHeight: number
  wavePeriod: number
}

/**
 * Condition assessment result
 */
export interface MarineConditions {
  status: 'good' | 'caution' | 'dangerous'
  level: number
  warnings: string[]
  message: string
}

/**
 * Complete marine weather response
 */
export interface MarineWeatherData {
  current: CurrentMarineData
  forecast: MarineForecastPoint[]
  conditions: MarineConditions
}

/**
 * Fetches marine weather data from Open-Meteo API
 * 
 * Purpose: Retrieves wave height, wind speed, and ocean conditions for coastal locations
 * Provides current conditions and 24-hour forecast
 * 
 * @param {number} iLatitude - Location latitude (-90 to 90)
 * @param {number} iLongitude - Location longitude (-180 to 180)
 * @returns {Promise<MarineWeatherData>} oMarineData - Complete marine weather data
 * @throws {Error} When API request fails
 */
export async function fetchMarineWeather(
  iLatitude: number,
  iLongitude: number
): Promise<MarineWeatherData> {
  try {
    const params = new URLSearchParams({
      latitude: iLatitude.toString(),
      longitude: iLongitude.toString(),
      hourly: 'wave_height,wave_direction,wind_wave_height,wind_speed_10m,wind_direction_10m,swell_wave_height,ocean_current_velocity,wave_period',
      current: 'wave_height,wave_direction,wind_wave_height,wind_speed_10m,wind_direction_10m',
      timezone: 'auto'
    })

    const response = await fetch(`${BASE_URL}?${params}`)
    
    if (!response.ok) {
      throw new Error(`Marine weather API error: ${response.status}`)
    }

    const data = await response.json()
    const oMarineData = parseMarineWeatherData(data)
    return oMarineData
  } catch (error) {
    logError('Error fetching marine weather', error)
    throw error
  }
}

/**
 * Parses and structures the marine weather data from API response
 * 
 * Purpose: Transform raw API response into structured, type-safe data
 * 
 * @param {any} iApiData - Raw API response data
 * @returns {MarineWeatherData} oStructuredData - Parsed and structured marine data
 */
function parseMarineWeatherData(iApiData: any): MarineWeatherData {
  const current = iApiData.current || {}
  const hourly = iApiData.hourly || {}
  
  const currentData: CurrentMarineData = {
    waveHeight: current.wave_height || 0,
    waveDirection: current.wave_direction || 0,
    windWaveHeight: current.wind_wave_height || 0,
    windSpeed: current.wind_speed_10m || 0,
    windDirection: current.wind_direction_10m || 0,
    timestamp: current.time
  }

  const forecast: MarineForecastPoint[] = []
  if (hourly.time) {
    const forecastLength = Math.min(24, hourly.time.length)
    for (let i = 0; i < forecastLength; i++) {
      forecast.push({
        time: hourly.time[i],
        waveHeight: hourly.wave_height?.[i] || 0,
        waveDirection: hourly.wave_direction?.[i] || 0,
        windWaveHeight: hourly.wind_wave_height?.[i] || 0,
        windSpeed: hourly.wind_speed_10m?.[i] || 0,
        windDirection: hourly.wind_direction_10m?.[i] || 0,
        swellWaveHeight: hourly.swell_wave_height?.[i] || 0,
        wavePeriod: hourly.wave_period?.[i] || 0
      })
    }
  }

  const oStructuredData: MarineWeatherData = {
    current: currentData,
    forecast,
    conditions: evaluateConditions(currentData)
  }

  return oStructuredData
}

/**
 * Evaluates marine conditions based on wave height and wind speed
 * 
 * Purpose: Assess safety level for marine activities
 * Provides warnings and safety recommendations
 * 
 * @param {CurrentMarineData} iCurrentData - Current marine weather data
 * @returns {MarineConditions} oConditionAssessment - Safety assessment with warnings
 */
export function evaluateConditions(iCurrentData: CurrentMarineData): MarineConditions {
  const { waveHeight, windSpeed } = iCurrentData
  
  let status: 'good' | 'caution' | 'dangerous' = 'good'
  let level = 1
  const warnings: string[] = []

  // Dangerous conditions
  if (waveHeight > 3 || windSpeed > 25) {
    status = 'dangerous'
    level = 3
    if (waveHeight > 3) warnings.push('High waves')
    if (windSpeed > 25) warnings.push('Strong winds')
  } 
  // Caution conditions
  else if (waveHeight > 1.5 || windSpeed > 15) {
    status = 'caution'
    level = 2
    if (waveHeight > 1.5) warnings.push('Moderate waves')
    if (windSpeed > 15) warnings.push('Moderate winds')
  } 
  // Good conditions
  else {
    warnings.push('Calm conditions')
  }

  const oConditionAssessment: MarineConditions = {
    status,
    level,
    warnings,
    message: getConditionMessage(status)
  }

  return oConditionAssessment
}

/**
 * Gets a user-friendly condition message based on status
 * 
 * Purpose: Provide clear safety guidance to users
 * 
 * @param {string} iStatus - Condition status ('good', 'caution', or 'dangerous')
 * @returns {string} oMessage - User-friendly message
 */
function getConditionMessage(iStatus: 'good' | 'caution' | 'dangerous'): string {
  const messages = {
    good: 'Conditions are favorable for marine activities',
    caution: 'Exercise caution - moderate conditions',
    dangerous: 'Dangerous conditions - avoid marine activities'
  }
  const oMessage = messages[iStatus] || messages.good
  return oMessage
}

/**
 * Formats wind direction from degrees to compass direction
 * 
 * Purpose: Convert numeric degrees to easy-to-understand compass points
 * 
 * @param {number} iDegrees - Wind direction in degrees (0-360)
 * @returns {string} oCompassDirection - Compass direction (N, NE, E, SE, S, SW, W, NW)
 */
export function formatWindDirection(iDegrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(iDegrees / 45) % 8
  const oCompassDirection = directions[index]
  return oCompassDirection
}

/**
 * Gets color code for wave height visualization
 * 
 * Purpose: Provide visual indication of wave conditions
 * Used for map markers and UI elements
 * 
 * @param {number} iWaveHeight - Wave height in meters
 * @returns {string} oColorHex - Color hex code (red for high, orange for moderate, green for calm)
 */
export function getWaveHeightColor(iWaveHeight: number): string {
  let oColorHex: string
  
  if (iWaveHeight > 3) {
    oColorHex = '#dc2626' // Red - dangerous
  } else if (iWaveHeight > 1.5) {
    oColorHex = '#f59e0b' // Orange - caution
  } else {
    oColorHex = '#10b981' // Green - good
  }
  
  return oColorHex
}
