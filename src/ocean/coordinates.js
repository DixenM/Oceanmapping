/**
 * Converts coordinates between decimal degrees and degrees-minutes-seconds
 */

/**
 * Converts decimal degrees to degrees, minutes, seconds format
 * @param {number} decimalDegrees - Decimal degrees value
 * @param {boolean} isLatitude - True for latitude, false for longitude
 * @returns {object} Object with degrees, minutes, seconds, and direction
 */
export function decimalToDMS(decimalDegrees, isLatitude = true) {
  const absolute = Math.abs(decimalDegrees);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = ((minutesFloat - minutes) * 60).toFixed(2);
  
  let direction;
  if (isLatitude) {
    direction = decimalDegrees >= 0 ? 'N' : 'S';
  } else {
    direction = decimalDegrees >= 0 ? 'E' : 'W';
  }
  
  return {
    degrees,
    minutes,
    seconds: parseFloat(seconds),
    direction,
  };
}

/**
 * Converts DMS format to decimal degrees
 * @param {number} degrees - Degrees
 * @param {number} minutes - Minutes
 * @param {number} seconds - Seconds
 * @param {string} direction - Direction (N, S, E, W)
 * @returns {number} Decimal degrees
 */
export function dmsToDecimal(degrees, minutes, seconds, direction) {
  let decimal = degrees + minutes / 60 + seconds / 3600;
  
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }
  
  return parseFloat(decimal.toFixed(6));
}

/**
 * Calculates distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;
  
  return parseFloat(distance.toFixed(2));
}

/**
 * Converts degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} Radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Validates if coordinates are within valid ranges
 * @param {number} latitude - Latitude value
 * @param {number} longitude - Longitude value
 * @returns {boolean} True if valid, false otherwise
 */
export function validateCoordinates(latitude, longitude) {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}
