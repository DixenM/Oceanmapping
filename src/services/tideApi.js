/**
 * Tide API Service
 * Handles fetching tide data from external APIs
 * 
 * Supported APIs:
 * - WorldTides API (https://www.worldtides.info/)
 * - DMI (Danish Meteorological Institute)
 * 
 * Note: For production, add your API key to .env as VITE_TIDE_API_KEY
 */

const API_BASE_URL = 'https://www.worldtides.info/api/v3'
const API_KEY = import.meta.env.VITE_TIDE_API_KEY || 'demo-key'

/**
 * Generate mock tide data for development/demo purposes
 * Creates realistic tide patterns with semi-diurnal cycles
 */
export const generateMockTideData = (stationName, lat, lon) => {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  
  // Semi-diurnal tide (2 high tides, 2 low tides per day)
  // Tides cycle approximately every 12.4 hours
  const baseHeight = 1.5 // meters above mean sea level
  const amplitude = 0.8 // tide range
  
  const currentTimeDecimal = currentHour + currentMinute / 60
  const tidePhase = (currentTimeDecimal * Math.PI) / 6.2
  const currentHeight = baseHeight + amplitude * Math.sin(tidePhase)
  
  // Generate next 48 hours of predictions (every hour)
  const predictions = []
  for (let i = 0; i < 48; i++) {
    const futureTime = new Date(now.getTime() + i * 60 * 60 * 1000)
    const futureTimeDecimal = futureTime.getHours() + futureTime.getMinutes() / 60
    const futurePhase = (futureTimeDecimal * Math.PI) / 6.2
    const height = baseHeight + amplitude * Math.sin(futurePhase)
    
    predictions.push({
      time: futureTime.toISOString(),
      height: parseFloat(height.toFixed(2)),
      type: height > baseHeight + amplitude * 0.7 ? 'high' : 
            height < baseHeight - amplitude * 0.7 ? 'low' : 'normal'
    })
  }
  
  // Find next high and low tides
  const extremes = []
  for (let i = 1; i < predictions.length - 1; i++) {
    const prev = predictions[i - 1].height
    const curr = predictions[i].height
    const next = predictions[i + 1].height
    
    if (curr > prev && curr > next) {
      extremes.push({ ...predictions[i], type: 'high' })
    } else if (curr < prev && curr < next) {
      extremes.push({ ...predictions[i], type: 'low' })
    }
  }
  
  return {
    station: stationName,
    coordinates: { lat, lon },
    currentTide: {
      height: parseFloat(currentHeight.toFixed(2)),
      time: now.toISOString(),
      status: currentHeight > baseHeight ? 'rising' : 'falling'
    },
    nextTides: extremes.slice(0, 4),
    predictions: predictions,
    unit: 'meters',
    datum: 'MSL',
    source: 'mock',
    lastUpdated: now.toISOString()
  }
}

/**
 * Fetch tide data from WorldTides API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} stationName - Name of the station
 * @returns {Promise} Tide data
 */
export const fetchTideData = async (lat, lon, stationName = 'Unknown') => {
  // For demo purposes, return mock data
  // Uncomment below to use real API when you have a key
  
  try {
    // Real API call (commented out for demo)
    /*
    const now = new Date()
    const start = Math.floor(now.getTime() / 1000)
    const end = start + (48 * 60 * 60) // 48 hours
    
    const params = new URLSearchParams({
      key: API_KEY,
      lat: lat.toString(),
      lon: lon.toString(),
      start: start.toString(),
      length: '172800', // 48 hours in seconds
      datum: 'MSL',
      extremes: 'true',
      heights: 'true'
    })
    
    const response = await fetch(`${API_BASE_URL}?${params}`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      station: stationName,
      coordinates: { lat, lon },
      currentTide: {
        height: data.heights?.[0]?.height || 0,
        time: data.heights?.[0]?.dt || new Date().toISOString(),
        status: 'unknown'
      },
      nextTides: data.extremes || [],
      predictions: data.heights || [],
      unit: 'meters',
      datum: data.datum || 'MSL',
      source: 'worldtides',
      lastUpdated: new Date().toISOString()
    }
    */
    
    // Using mock data for demo
    return generateMockTideData(stationName, lat, lon)
    
  } catch (error) {
    console.error('Error fetching tide data:', error)
    // Fallback to mock data on error
    return generateMockTideData(stationName, lat, lon)
  }
}

/**
 * Search for tide stations near coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in km
 * @returns {Promise} List of nearby stations
 */
export const searchNearbyStations = async (lat, lon, radius = 50) => {
  // Mock implementation
  // In production, this would query a stations database or API
  return []
}

/**
 * Get current water temperature (if available)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise} Temperature data
 */
export const fetchWaterTemperature = async (lat, lon) => {
  // Mock implementation
  // Could integrate with marine weather APIs
  return {
    temperature: 15 + Math.random() * 5, // Mock: 15-20°C
    unit: 'celsius',
    time: new Date().toISOString()
  }
}

export default {
  fetchTideData,
  generateMockTideData,
  searchNearbyStations,
  fetchWaterTemperature
}
