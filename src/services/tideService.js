/**
 * Tide Service
 * Handles fetching and generating tide data
 * 
 * SUPPORTED APIs:
 * - WorldTides API (https://www.worldtides.info/)
 * - DMI (Danish Meteorological Institute)
 * 
 * HOW TO USE REAL API:
 * 1. Get a free API key from https://www.worldtides.info/developer
 * 2. Create a .env file in the project root
 * 3. Add: VITE_TIDE_API_KEY=your_api_key_here
 * 4. Uncomment the real API code in fetchTideData()
 * 
 * For now, this service uses realistic mock data that simulates
 * semi-diurnal tides (2 high tides and 2 low tides per day)
 */

const API_BASE_URL = 'https://www.worldtides.info/api/v3'
const API_KEY = import.meta.env.VITE_TIDE_API_KEY || 'demo-key'

/**
 * Generate realistic mock tide data
 * 
 * Creates tide patterns based on semi-diurnal tides (most common in Denmark)
 * - Tides cycle approximately every 12 hours and 25 minutes
 * - Different stations have different base heights and amplitudes
 * - Includes realistic variation based on location
 * 
 * @param {string} stationName - Name of the tide station
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Object} Complete tide data including current state and predictions
 */
export const generateMockTideData = (stationName, lat, lon) => {
  const now = new Date()
  
  // Different stations have different tide characteristics
  // North Sea (west coast) has higher tides than Baltic Sea (east coast)
  const isWestCoast = lon < 11.0
  const baseHeight = isWestCoast ? 1.8 : 0.5
  const amplitude = isWestCoast ? 1.2 : 0.3
  
  // Add location-based variation
  const locationSeed = (lat * lon) % 1
  const phaseOffset = locationSeed * Math.PI
  
  /**
   * Calculate tide height at a given time
   * Using semi-diurnal tide formula
   */
  const calculateTideHeight = (date) => {
    const hours = date.getHours() + date.getMinutes() / 60
    // Tides cycle every 12.42 hours (lunar day / 2)
    const tidePhase = ((hours + phaseOffset) * Math.PI) / 6.21
    const height = baseHeight + amplitude * Math.sin(tidePhase)
    return parseFloat(height.toFixed(2))
  }
  
  // Current tide height and status
  const currentHeight = calculateTideHeight(now)
  const futureHeight = calculateTideHeight(new Date(now.getTime() + 30 * 60 * 1000))
  const tideStatus = futureHeight > currentHeight ? 'rising' : 'falling'
  
  // Generate predictions for next 48 hours (every 30 minutes for better accuracy)
  const predictions = []
  for (let i = 0; i < 96; i++) {
    const futureTime = new Date(now.getTime() + i * 30 * 60 * 1000)
    const height = calculateTideHeight(futureTime)
    
    predictions.push({
      time: futureTime.toISOString(),
      height: height,
      type: 'normal'
    })
  }
  
  // Find extremes (high and low tides) by detecting peaks and troughs
  const extremes = []
  for (let i = 1; i < predictions.length - 1; i++) {
    const prev = predictions[i - 1].height
    const curr = predictions[i].height
    const next = predictions[i + 1].height
    
    // High tide: peak
    if (curr > prev && curr > next && curr > baseHeight + amplitude * 0.6) {
      extremes.push({
        ...predictions[i],
        type: 'high'
      })
    }
    // Low tide: trough
    else if (curr < prev && curr < next && curr < baseHeight - amplitude * 0.6) {
      extremes.push({
        ...predictions[i],
        type: 'low'
      })
    }
  }
  
  // Return data in standard format
  return {
    station: stationName,
    coordinates: { lat, lon },
    currentTide: {
      height: currentHeight,
      time: now.toISOString(),
      status: tideStatus
    },
    nextTides: extremes.slice(0, 6),
    predictions: predictions.filter((_, idx) => idx % 2 === 0),
    unit: 'meters',
    datum: 'MSL',
    source: 'mock',
    lastUpdated: now.toISOString(),
    tideRange: {
      min: baseHeight - amplitude,
      max: baseHeight + amplitude,
      average: baseHeight
    }
  }
}

/**
 * Fetch tide data from WorldTides API or return mock data
 * 
 * This function will:
 * 1. Try to fetch real data from WorldTides API if API key is provided
 * 2. Fall back to realistic mock data if API is unavailable
 * 3. Cache results for 5 minutes (handled by React Query in components)
 * 
 * @param {number} lat - Latitude of the location
 * @param {number} lon - Longitude of the location
 * @param {string} stationName - Name of the station (for display)
 * @returns {Promise<Object>} Tide data object
 */
export const fetchTideData = async (lat, lon, stationName = 'Unknown') => {
  // For demo/development, return mock data
  // To use real API: uncomment the code below and add your API key to .env
  
  try {
    // ========================================
    // REAL API INTEGRATION (Active)
    // ========================================
    // Try real API if we have a valid key
    if (API_KEY && API_KEY !== 'demo-key') {
      const now = new Date()
      const start = Math.floor(now.getTime() / 1000)
      
      // Build API request parameters
      const params = new URLSearchParams({
        key: API_KEY,
        lat: lat.toString(),
        lon: lon.toString(),
        start: start.toString(),
        length: '172800', // 48 hours in seconds
        datum: 'MSL',
        extremes: 'true',
        heights: 'true',
        step: '3600' // Data point every hour
      })
      
      const response = await fetch(`${API_BASE_URL}?${params}`)
      
      if (!response.ok) {
        console.warn(`API error: ${response.status}, falling back to mock data`)
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Check if API returned valid data
      if (!data.heights || data.heights.length === 0) {
        console.warn('No tide data returned from API, using mock data')
        throw new Error('No tide data available')
      }
      
      // Transform API response to our format
      return {
        station: stationName,
        coordinates: { lat, lon },
        currentTide: {
          height: parseFloat((data.heights[0]?.height || 0).toFixed(2)),
          time: data.heights[0]?.dt || now.toISOString(),
          status: data.heights[1]?.height > data.heights[0]?.height ? 'rising' : 'falling'
        },
        nextTides: (data.extremes || []).map(ext => ({
          time: ext.dt,
          height: parseFloat(ext.height.toFixed(2)),
          type: ext.type === 'High' ? 'high' : 'low'
        })).slice(0, 6),
        predictions: (data.heights || []).map(h => ({
          time: h.dt,
          height: parseFloat(h.height.toFixed(2)),
          type: 'normal'
        })),
        unit: 'meters',
        datum: data.datum || 'MSL',
        source: 'worldtides',
        lastUpdated: now.toISOString(),
        tideRange: {
          min: Math.min(...(data.heights || []).map(h => h.height)),
          max: Math.max(...(data.heights || []).map(h => h.height)),
          average: (data.heights || []).reduce((sum, h) => sum + h.height, 0) / (data.heights || []).length
        }
      }
    }
    
    // ========================================
    // MOCK DATA (Fallback)
    // ========================================
    // Using realistic mock data as fallback
    console.info('Using mock tide data (no API key or API unavailable)')
    return generateMockTideData(stationName, lat, lon)
    
  } catch (error) {
    console.error('Error fetching tide data:', error)
    // Always fall back to mock data on error
    return generateMockTideData(stationName, lat, lon)
  }
}

/**
 * Search for tide stations near given coordinates
 * 
 * This would typically query a database of tide stations.
 * For now, returns empty array (stations are hardcoded in danishStations.js)
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in kilometers
 * @returns {Promise<Array>} List of nearby stations
 */
export const searchNearbyStations = async (lat, lon, radius = 50) => {
  return []
}

/**
 * Get current water temperature (if available)
 * 
 * This could integrate with marine weather APIs like:
 * - NOAA
 * - Marine Weather API
 * - OpenWeatherMap (marine data)
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Temperature data
 */
export const fetchWaterTemperature = async (lat, lon) => {
  // Mock implementation
  // Baltic Sea: 15-18°C, North Sea: 12-16°C in summer
  const isWestCoast = lon < 11.0
  const baseTemp = isWestCoast ? 14 : 17
  const variation = Math.random() * 3
  
  return {
    temperature: parseFloat((baseTemp + variation).toFixed(1)),
    unit: 'celsius',
    time: new Date().toISOString(),
    source: 'mock'
  }
}

// Export all functions as default object
export default {
  fetchTideData,
  generateMockTideData,
  searchNearbyStations,
  fetchWaterTemperature
}
