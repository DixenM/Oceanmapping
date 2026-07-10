import { DepthPoint } from '../types'

/**
 * Danish coastal depth points data
 * 
 * Purpose: Provides 80+ strategic depth measurements around Danish coast and harbors
 * Data based on typical depths in Danish waters (Baltic Sea and North Sea)
 * 
 * Depth characteristics:
 * - Baltic Sea (East Denmark): Generally shallow, 5-40m typical
 * - Kattegat (North): Medium depth, 15-60m typical
 * - North Sea (West): Deeper, 20-80m typical
 * - Harbor approaches: 5-15m typical
 * - Offshore areas: Can reach 100m+ in deeper channels
 * 
 * minZoom: Markers only visible at specified zoom level or higher
 * - undefined: Always visible
 * - 8: Visible at medium zoom
 * - 10: Visible only when zoomed in (detail markers)
 */
export const danishDepthPoints: DepthPoint[] = [
  // Bønnerup Havn area (Kattegat, East Jutland)
  { id: 'dp-bonnerup-1', latitude: 56.4889, longitude: 10.7556, depth: 8, location: 'Bønnerup Harbor entrance', minZoom: 10 },
  { id: 'dp-bonnerup-2', latitude: 56.4900, longitude: 10.7650, depth: 12, location: 'Bønnerup offshore', minZoom: 9 },
  { id: 'dp-bonnerup-3', latitude: 56.4850, longitude: 10.7700, depth: 18, location: 'Bønnerup Bay', minZoom: 9 },
  
  // Copenhagen/Zealand East Coast (Øresund)
  { id: 'dp-cph-1', latitude: 55.6861, longitude: 12.5950, depth: 7, location: 'Copenhagen Harbor', minZoom: 10 },
  { id: 'dp-cph-2', latitude: 55.6900, longitude: 12.6100, depth: 12, location: 'Copenhagen offshore', minZoom: 9 },
  { id: 'dp-cph-3', latitude: 55.7000, longitude: 12.6300, depth: 15, location: 'Øresund North', minZoom: 8 },
  { id: 'dp-cph-4', latitude: 55.6700, longitude: 12.6200, depth: 10, location: 'Øresund South', minZoom: 9 },
  
  // Helsingør area (North Zealand)
  { id: 'dp-helsingor-1', latitude: 56.0361, longitude: 12.6139, depth: 6, location: 'Helsingør Harbor', minZoom: 10 },
  { id: 'dp-helsingor-2', latitude: 56.0400, longitude: 12.6300, depth: 18, location: 'Øresund narrows', minZoom: 9 },
  { id: 'dp-helsingor-3', latitude: 56.0500, longitude: 12.6400, depth: 25, location: 'Øresund deep', minZoom: 8 },
  
  // Roskilde Fjord
  { id: 'dp-roskilde-1', latitude: 55.8500, longitude: 12.0800, depth: 4, location: 'Roskilde Fjord inner', minZoom: 10 },
  { id: 'dp-roskilde-2', latitude: 55.8600, longitude: 12.1000, depth: 8, location: 'Roskilde Fjord mid', minZoom: 9 },
  { id: 'dp-roskilde-3', latitude: 55.8700, longitude: 12.1500, depth: 12, location: 'Roskilde Fjord entrance', minZoom: 9 },
  
  // Aarhus (East Jutland, Kattegat)
  { id: 'dp-aarhus-1', latitude: 56.1572, longitude: 10.2108, depth: 8, location: 'Aarhus Harbor', minZoom: 10 },
  { id: 'dp-aarhus-2', latitude: 56.1600, longitude: 10.2300, depth: 15, location: 'Aarhus Bay shallow', minZoom: 9 },
  { id: 'dp-aarhus-3', latitude: 56.1700, longitude: 10.2600, depth: 25, location: 'Aarhus Bay mid', minZoom: 8 },
  { id: 'dp-aarhus-4', latitude: 56.1800, longitude: 10.3000, depth: 35, location: 'Aarhus Bay deep', minZoom: 8 },
  { id: 'dp-aarhus-5', latitude: 56.2000, longitude: 10.3500, depth: 45, location: 'Kattegat offshore Aarhus', minZoom: 7 },
  
  // Esbjerg (West Jutland, North Sea)
  { id: 'dp-esbjerg-1', latitude: 55.4706, longitude: 8.4392, depth: 10, location: 'Esbjerg Harbor', minZoom: 10 },
  { id: 'dp-esbjerg-2', latitude: 55.4800, longitude: 8.4000, depth: 15, location: 'Esbjerg approach', minZoom: 9 },
  { id: 'dp-esbjerg-3', latitude: 55.5000, longitude: 8.3500, depth: 22, location: 'North Sea shallow', minZoom: 8 },
  { id: 'dp-esbjerg-4', latitude: 55.5200, longitude: 8.3000, depth: 30, location: 'North Sea mid', minZoom: 7 },
  { id: 'dp-esbjerg-5', latitude: 55.5500, longitude: 8.2500, depth: 42, location: 'North Sea deeper', minZoom: 7 },
  
  // Skagen (Northern tip, where seas meet)
  { id: 'dp-skagen-1', latitude: 57.7200, longitude: 10.5833, depth: 8, location: 'Skagen Harbor', minZoom: 10 },
  { id: 'dp-skagen-2', latitude: 57.7400, longitude: 10.6200, depth: 18, location: 'Grenen shallow', minZoom: 9 },
  { id: 'dp-skagen-3', latitude: 57.7600, longitude: 10.6500, depth: 28, location: 'Skagerrak approach', minZoom: 8 },
  { id: 'dp-skagen-4', latitude: 57.8000, longitude: 10.7000, depth: 45, location: 'Skagerrak mid', minZoom: 7 },
  { id: 'dp-skagen-5', latitude: 57.8500, longitude: 10.8000, depth: 65, location: 'Skagerrak deep', minZoom: 7 },
  
  // Frederikshavn (East coast North Jutland)
  { id: 'dp-frederikshavn-1', latitude: 57.4389, longitude: 10.5361, depth: 7, location: 'Frederikshavn Harbor', minZoom: 10 },
  { id: 'dp-frederikshavn-2', latitude: 57.4500, longitude: 10.5600, depth: 15, location: 'Frederikshavn Bay', minZoom: 9 },
  { id: 'dp-frederikshavn-3', latitude: 57.4700, longitude: 10.6000, depth: 25, location: 'Kattegat North', minZoom: 8 },
  
  // Hirtshals (Northwest Jutland)
  { id: 'dp-hirtshals-1', latitude: 57.5956, longitude: 9.9617, depth: 9, location: 'Hirtshals Harbor', minZoom: 10 },
  { id: 'dp-hirtshals-2', latitude: 57.6100, longitude: 9.9500, depth: 18, location: 'Hirtshals approach', minZoom: 9 },
  { id: 'dp-hirtshals-3', latitude: 57.6300, longitude: 9.9200, depth: 32, location: 'Skagerrak shallow', minZoom: 8 },
  { id: 'dp-hirtshals-4', latitude: 57.6600, longitude: 9.8800, depth: 48, location: 'Skagerrak mid', minZoom: 7 },
  
  // Aalborg/Limfjord (North Jutland inland)
  { id: 'dp-aalborg-1', latitude: 57.0489, longitude: 9.9217, depth: 6, location: 'Aalborg Harbor', minZoom: 10 },
  { id: 'dp-aalborg-2', latitude: 57.0600, longitude: 9.9500, depth: 9, location: 'Limfjord East', minZoom: 9 },
  { id: 'dp-aalborg-3', latitude: 57.0700, longitude: 10.0000, depth: 12, location: 'Limfjord channel', minZoom: 9 },
  
  // Rønne (Bornholm)
  { id: 'dp-ronne-1', latitude: 55.0989, longitude: 14.7053, depth: 6, location: 'Rønne Harbor', minZoom: 10 },
  { id: 'dp-ronne-2', latitude: 55.1100, longitude: 14.6900, depth: 15, location: 'Rønne offshore', minZoom: 9 },
  { id: 'dp-ronne-3', latitude: 55.1300, longitude: 14.6700, depth: 25, location: 'Baltic Sea Bornholm', minZoom: 8 },
  { id: 'dp-ronne-4', latitude: 55.1600, longitude: 14.6400, depth: 38, location: 'Baltic Sea deeper', minZoom: 7 },
  
  // Gedser (South Zealand)
  { id: 'dp-gedser-1', latitude: 54.5733, longitude: 11.9258, depth: 7, location: 'Gedser Harbor', minZoom: 10 },
  { id: 'dp-gedser-2', latitude: 54.5900, longitude: 11.9400, depth: 12, location: 'Gedser offshore', minZoom: 9 },
  { id: 'dp-gedser-3', latitude: 54.6100, longitude: 11.9600, depth: 18, location: 'Baltic South', minZoom: 8 },
  
  // Korsør (Great Belt)
  { id: 'dp-korsor-1', latitude: 55.3333, longitude: 11.1428, depth: 8, location: 'Korsør Harbor', minZoom: 10 },
  { id: 'dp-korsor-2', latitude: 55.3500, longitude: 11.1600, depth: 15, location: 'Great Belt shallow', minZoom: 9 },
  { id: 'dp-korsor-3', latitude: 55.3700, longitude: 11.1800, depth: 25, location: 'Great Belt mid', minZoom: 8 },
  { id: 'dp-korsor-4', latitude: 55.4000, longitude: 11.2000, depth: 35, location: 'Great Belt deep', minZoom: 7 },
  
  // Fredericia (Little Belt)
  { id: 'dp-fredericia-1', latitude: 55.5653, longitude: 9.7522, depth: 7, location: 'Fredericia Harbor', minZoom: 10 },
  { id: 'dp-fredericia-2', latitude: 55.5800, longitude: 9.7700, depth: 12, location: 'Little Belt South', minZoom: 9 },
  { id: 'dp-fredericia-3', latitude: 55.6000, longitude: 9.7900, depth: 18, location: 'Little Belt mid', minZoom: 8 },
  
  // Odense Fjord
  { id: 'dp-odense-1', latitude: 55.4500, longitude: 10.3800, depth: 5, location: 'Odense Fjord inner', minZoom: 10 },
  { id: 'dp-odense-2', latitude: 55.4700, longitude: 10.4000, depth: 8, location: 'Odense Fjord mid', minZoom: 9 },
  { id: 'dp-odense-3', latitude: 55.4900, longitude: 10.4300, depth: 12, location: 'Odense Fjord entrance', minZoom: 9 },
  
  // Svendborg (South Funen)
  { id: 'dp-svendborg-1', latitude: 55.0597, longitude: 10.6069, depth: 6, location: 'Svendborg Harbor', minZoom: 10 },
  { id: 'dp-svendborg-2', latitude: 55.0700, longitude: 10.6300, depth: 10, location: 'Svendborg Sound', minZoom: 9 },
  { id: 'dp-svendborg-3', latitude: 55.0900, longitude: 10.6600, depth: 15, location: 'South Funen waters', minZoom: 8 },
  
  // Thyborøn (West Jutland, Limfjord entrance)
  { id: 'dp-thyboron-1', latitude: 56.7047, longitude: 8.2144, depth: 8, location: 'Thyborøn channel', minZoom: 10 },
  { id: 'dp-thyboron-2', latitude: 56.7200, longitude: 8.1800, depth: 12, location: 'Thyborøn approach', minZoom: 9 },
  { id: 'dp-thyboron-3', latitude: 56.7400, longitude: 8.1400, depth: 18, location: 'North Sea Thyborøn', minZoom: 8 },
  
  // Rømø (South Jutland, Wadden Sea)
  { id: 'dp-romo-1', latitude: 55.1589, longitude: 8.5428, depth: 4, location: 'Rømø shallow', minZoom: 10 },
  { id: 'dp-romo-2', latitude: 55.1700, longitude: 8.5200, depth: 6, location: 'Wadden Sea', minZoom: 9 },
  { id: 'dp-romo-3', latitude: 55.1900, longitude: 8.4900, depth: 10, location: 'North Sea Rømø', minZoom: 8 },
  
  // Additional strategic points - Kattegat central
  { id: 'dp-kattegat-1', latitude: 56.5000, longitude: 11.0000, depth: 20, location: 'Kattegat central', minZoom: 7 },
  { id: 'dp-kattegat-2', latitude: 56.7000, longitude: 11.2000, depth: 28, location: 'Kattegat mid', minZoom: 7 },
  { id: 'dp-kattegat-3', latitude: 56.9000, longitude: 11.4000, depth: 35, location: 'Kattegat North', minZoom: 7 },
  { id: 'dp-kattegat-4', latitude: 57.1000, longitude: 11.5000, depth: 42, location: 'Kattegat deep', minZoom: 7 },
  
  // Additional strategic points - Baltic Sea
  { id: 'dp-baltic-1', latitude: 54.8000, longitude: 12.5000, depth: 18, location: 'Baltic Sea South', minZoom: 7 },
  { id: 'dp-baltic-2', latitude: 55.0000, longitude: 13.0000, depth: 22, location: 'Baltic Sea mid', minZoom: 7 },
  { id: 'dp-baltic-3', latitude: 55.2000, longitude: 13.5000, depth: 28, location: 'Baltic Sea East', minZoom: 7 },
  { id: 'dp-baltic-4', latitude: 55.4000, longitude: 14.0000, depth: 32, location: 'Baltic Sea Bornholm Basin', minZoom: 7 },
  
  // Additional strategic points - North Sea
  { id: 'dp-northsea-1', latitude: 55.7000, longitude: 7.8000, depth: 25, location: 'North Sea shallow', minZoom: 7 },
  { id: 'dp-northsea-2', latitude: 55.9000, longitude: 7.5000, depth: 35, location: 'North Sea mid', minZoom: 7 },
  { id: 'dp-northsea-3', latitude: 56.1000, longitude: 7.2000, depth: 45, location: 'North Sea deeper', minZoom: 7 },
  { id: 'dp-northsea-4', latitude: 56.3000, longitude: 7.0000, depth: 58, location: 'North Sea deep', minZoom: 7 },
  
  // Additional strategic points - Skagerrak
  { id: 'dp-skagerrak-1', latitude: 57.5000, longitude: 10.0000, depth: 35, location: 'Skagerrak shallow', minZoom: 7 },
  { id: 'dp-skagerrak-2', latitude: 57.7000, longitude: 9.5000, depth: 52, location: 'Skagerrak mid', minZoom: 7 },
  { id: 'dp-skagerrak-3', latitude: 57.9000, longitude: 9.0000, depth: 72, location: 'Skagerrak deep', minZoom: 7 },
  { id: 'dp-skagerrak-4', latitude: 58.1000, longitude: 8.5000, depth: 95, location: 'Skagerrak very deep', minZoom: 7 },
]

/**
 * Gets depth points visible at current zoom level
 * 
 * Purpose: Filter depth points based on map zoom for performance
 * Shows more detail at higher zoom levels
 * 
 * @param {number} iZoom - Current map zoom level
 * @returns {DepthPoint[]} oVisiblePoints - Depth points to display
 */
export const getVisibleDepthPoints = (iZoom: number): DepthPoint[] => {
  const oVisiblePoints = danishDepthPoints.filter(point => {
    if (!point.minZoom) return true
    return iZoom >= point.minZoom
  })
  
  return oVisiblePoints
}

/**
 * Gets depth point by ID
 * 
 * Purpose: Retrieve specific depth point data
 * 
 * @param {string} iId - Depth point identifier
 * @returns {DepthPoint | undefined} oPoint - Depth point if found
 */
export const getDepthPointById = (iId: string): DepthPoint | undefined => {
  const oPoint = danishDepthPoints.find(point => point.id === iId)
  return oPoint
}
