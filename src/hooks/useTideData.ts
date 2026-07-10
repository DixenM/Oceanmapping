import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { fetchTideData } from '../services/tideApi'
import { TideInfo } from '../types'

/**
 * Custom hook to fetch and cache tide data for a location
 * 
 * Purpose: Provides tide data with automatic caching, background refetching,
 * and loading/error state management using TanStack Query
 * 
 * Features:
 * - Automatic caching (5 minutes stale time)
 * - Background refetching
 * - Error handling
 * - Loading states
 * - Request deduplication
 * 
 * @param {number} iLatitude - Location latitude
 * @param {number} iLongitude - Location longitude
 * @returns {UseQueryResult<TideInfo>} oTideQuery - Query result with data, isLoading, error, etc.
 * 
 * @example
 * const { data, isLoading, error } = useTideData(55.6761, 12.5872)
 * if (isLoading) return <Spinner />
 * if (error) return <Error message={error.message} />
 * return <TideDisplay data={data} />
 */
export const useTideData = (
  iLatitude: number,
  iLongitude: number
): UseQueryResult<TideInfo, Error> => {
  const oTideQuery = useQuery<TideInfo, Error>({
    queryKey: ['tide', iLatitude, iLongitude],
    queryFn: async () => {
      if (import.meta.env.DEV) {
        console.log(`[useTideData] Fetching tide data for lat: ${iLatitude}, lon: ${iLongitude}`)
      }
      try {
        const oData = await fetchTideData(iLatitude, iLongitude)
        if (import.meta.env.DEV) {
          console.log('[useTideData] Successfully fetched tide data:', oData)
        }
        return oData
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('[useTideData] Error fetching tide data:', error)
        }
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    enabled: Boolean(iLatitude && iLongitude), // Only fetch if coordinates are valid
    retry: 1, // Retry failed requests once
  })

  return oTideQuery
}
