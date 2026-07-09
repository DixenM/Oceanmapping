const BASE_URL = 'https://marine-api.open-meteo.com/v1/marine';

/**
 * Fetches marine weather data from Open-Meteo API
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise<Object>} Marine weather data
 */
export async function fetchMarineWeather(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: 'wave_height,wave_direction,wind_wave_height,wind_speed_10m,wind_direction_10m,swell_wave_height,ocean_current_velocity,wave_period',
      current: 'wave_height,wave_direction,wind_wave_height,wind_speed_10m,wind_direction_10m',
      timezone: 'auto'
    });

    const response = await fetch(`${BASE_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Marine weather API error: ${response.status}`);
    }

    const data = await response.json();
    return parseMarineWeatherData(data);
  } catch (error) {
    console.error('Error fetching marine weather:', error);
    throw error;
  }
}

/**
 * Parses and structures the marine weather data
 */
function parseMarineWeatherData(data) {
  const current = data.current || {};
  const hourly = data.hourly || {};
  
  const currentData = {
    waveHeight: current.wave_height || 0,
    waveDirection: current.wave_direction || 0,
    windWaveHeight: current.wind_wave_height || 0,
    windSpeed: current.wind_speed_10m || 0,
    windDirection: current.wind_direction_10m || 0,
    timestamp: current.time
  };

  const forecast = [];
  if (hourly.time) {
    for (let i = 0; i < Math.min(24, hourly.time.length); i++) {
      forecast.push({
        time: hourly.time[i],
        waveHeight: hourly.wave_height?.[i] || 0,
        waveDirection: hourly.wave_direction?.[i] || 0,
        windWaveHeight: hourly.wind_wave_height?.[i] || 0,
        windSpeed: hourly.wind_speed_10m?.[i] || 0,
        windDirection: hourly.wind_direction_10m?.[i] || 0,
        swellWaveHeight: hourly.swell_wave_height?.[i] || 0,
        wavePeriod: hourly.wave_period?.[i] || 0
      });
    }
  }

  return {
    current: currentData,
    forecast,
    conditions: evaluateConditions(currentData)
  };
}

/**
 * Evaluates marine conditions based on wave height and wind speed
 * @param {Object} currentData - Current marine weather data
 * @returns {Object} Condition assessment with status and details
 */
export function evaluateConditions(currentData) {
  const { waveHeight, windSpeed } = currentData;
  
  let status = 'good';
  let level = 1;
  const warnings = [];

  if (waveHeight > 3 || windSpeed > 25) {
    status = 'dangerous';
    level = 3;
    if (waveHeight > 3) warnings.push('High waves');
    if (windSpeed > 25) warnings.push('Strong winds');
  } else if (waveHeight > 1.5 || windSpeed > 15) {
    status = 'caution';
    level = 2;
    if (waveHeight > 1.5) warnings.push('Moderate waves');
    if (windSpeed > 15) warnings.push('Moderate winds');
  } else {
    warnings.push('Calm conditions');
  }

  return {
    status,
    level,
    warnings,
    message: getConditionMessage(status)
  };
}

/**
 * Gets a user-friendly condition message
 */
function getConditionMessage(status) {
  const messages = {
    good: 'Conditions are favorable for marine activities',
    caution: 'Exercise caution - moderate conditions',
    dangerous: 'Dangerous conditions - avoid marine activities'
  };
  return messages[status] || messages.good;
}

/**
 * Formats wind direction from degrees to compass direction
 * @param {number} degrees - Wind direction in degrees
 * @returns {string} Compass direction (N, NE, E, etc.)
 */
export function formatWindDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

/**
 * Gets color for wave height visualization
 * @param {number} waveHeight - Wave height in meters
 * @returns {string} Color hex code
 */
export function getWaveHeightColor(waveHeight) {
  if (waveHeight > 3) return '#dc2626';
  if (waveHeight > 1.5) return '#f59e0b';
  return '#10b981';
}
