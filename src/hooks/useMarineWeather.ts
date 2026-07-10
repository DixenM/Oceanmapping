import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchMarineWeather, MarineWeatherData } from '../services/marineWeatherService'

/**
 * Custom hook to fetch and cache marine weather data for a location
 * 
 * Purpose: Provides wave height, wind speed, and ocean conditions with
 * automatic caching and background refetching using TanStack Query
 * 
 * Features:
 * - Automatic caching (5 minutes stale time)
 * - Background refetching
 * - Error handling
 * - Loading states
 * - 24-hour forecast included
 * 
 * @param {number} iLatitude - Location latitude
 * @param {number} iLongitude - Location longitude
 * @returns {UseQueryResult<MarineWeatherData>} oWeatherQuery - Query result with marine data
 * 
 * @example
 * const { data, isLoading, error } = useMarineWeather(55.6761, 12.5872)
 * if (isLoading) return <Spinner />
 * if (error) return <Error message={error.message} />
 * return <WeatherDisplay waveHeight={data.current.waveHeight} />
 */
export const useMarineWeather = (
  iLatitude: number,
  iLongitude: number
): UseQueryResult<MarineWeatherData, Error> => {
  const oWeatherQuery = useQuery<MarineWeatherData, Error>({
    queryKey: ['marine-weather', iLatitude, iLongitude],
    queryFn: () => fetchMarineWeather(iLatitude, iLongitude),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    enabled: Boolean(iLatitude && iLongitude), // Only fetch if coordinates are valid
  })

  return oWeatherQuery
}
