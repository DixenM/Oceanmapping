/**
 * Mock tide service - in production, this would connect to a real tide API
 * For Denmark, you might use DMI (Danish Meteorological Institute) or similar
 */

/**
 * Fetches tide data for a given location
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise<Object>} Tide data
 */
export async function fetchTideData(latitude, longitude) {
  try {
    const tideData = generateMockTideData(latitude, longitude);
    return tideData;
  } catch (error) {
    console.error('Error fetching tide data:', error);
    throw error;
  }
}

/**
 * Generates mock tide data for demonstration
 * In production, replace with actual API call
 */
function generateMockTideData(latitude, longitude) {
  const now = new Date();
  const tides = [];
  
  for (let i = 0; i < 4; i++) {
    const time = new Date(now);
    time.setHours(now.getHours() + (i * 6));
    
    tides.push({
      time: time.toISOString(),
      height: Math.random() * 2 + 0.5,
      type: i % 2 === 0 ? 'high' : 'low'
    });
  }

  return {
    location: { latitude, longitude },
    currentHeight: Math.random() * 2 + 0.5,
    tides,
    nextTide: tides[0]
  };
}

/**
 * Formats tide time for display
 * @param {string} isoTime - ISO time string
 * @returns {string} Formatted time
 */
export function formatTideTime(isoTime) {
  const date = new Date(isoTime);
  return date.toLocaleTimeString('da-DK', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}
