import { useState, useEffect, useCallback, useMemo } from 'react'
import { FavoriteStation } from '../types'
import { logger } from '../utils/logger'

/**
 * Local storage key for persisting favorites
 */
const STORAGE_KEY = 'oceanmapping_favorites'

/**
 * Custom hook to manage favorite tide stations with localStorage persistence
 * 
 * Purpose: Provides a complete favorites management system with automatic
 * localStorage persistence, add/remove/check operations, and error handling
 * 
 * Features:
 * - Add/remove stations from favorites
 * - Check if a station is favorited
 * - Get all favorite stations with metadata
 * - Automatic localStorage persistence
 * - Error handling for storage operations
 * - Sorted by most recently added first
 * - Type-safe with TypeScript
 * 
 * @returns {Object} oFavoritesApi - Favorites management API
 * @returns {FavoriteStation[]} oFavoritesApi.oFavorites - Array of favorite stations
 * @returns {Function} oFavoritesApi.oAddFavorite - Add a station to favorites
 * @returns {Function} oFavoritesApi.oRemoveFavorite - Remove a station from favorites
 * @returns {Function} oFavoritesApi.oToggleFavorite - Toggle favorite status
 * @returns {Function} oFavoritesApi.oIsFavorite - Check if station is favorited
 * @returns {Function} oFavoritesApi.oClearFavorites - Clear all favorites
 * @returns {number} oFavoritesApi.oFavoriteCount - Total number of favorites
 * @returns {boolean} oFavoritesApi.oIsLoaded - Whether favorites have finished loading
 * @returns {string | null} oFavoritesApi.oLoadError - Error message if loading failed
 * @returns {Map<string, boolean>} oFavoritesApi.oFavoriteMap - Map for O(1) lookups
 * 
 * @example
 * const { oFavorites, oAddFavorite, oIsFavorite } = useFavorites()
 * 
 * if (oIsFavorite('copenhagen')) {
 *   console.log('Copenhagen is favorited!')
 * }
 * 
 * oAddFavorite('esbjerg')
 */
export const useFavorites = () => {
  const [oFavorites, setFavorites] = useState<FavoriteStation[]>([])
  const [oIsLoaded, setIsLoaded] = useState(false)
  const [oLoadError, setLoadError] = useState<string | null>(null)

  /**
   * Loads favorites from localStorage on initial mount
   * 
   * Purpose: Hydrate favorites state from persisted localStorage data
   * 
   * @returns {void}
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as FavoriteStation[]
        // Sort by most recently added first
        const sorted = parsed.sort((a, b) => b.addedAt - a.addedAt)
        setFavorites(sorted)
        logger.info(`Loaded ${sorted.length} favorites from storage`)
      }
    } catch (error) {
      logger.error('Failed to load favorites from localStorage', error)
      // Reset to empty array if corrupted
      setFavorites([])
      setLoadError('Failed to load saved favorites. Your favorites list has been reset.')
    } finally {
      setIsLoaded(true)
    }
  }, [])

  /**
   * Persists favorites to localStorage whenever they change
   * 
   * Purpose: Automatically sync favorites state with localStorage
   * 
   * @returns {void}
   */
  useEffect(() => {
    if (!oIsLoaded) return // Skip initial render before loading

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(oFavorites))
      logger.info(`Persisted ${oFavorites.length} favorites to storage`)
    } catch (error) {
      logger.error('Failed to persist favorites to localStorage', error)
    }
  }, [oFavorites, oIsLoaded])

  /**
   * Adds a station to favorites
   * 
   * Purpose: Add a new station to the favorites list if not already present
   * 
   * @param {string} iStationId - Station ID to add
   * @returns {void}
   */
  const oAddFavorite = useCallback((iStationId: string): void => {
    if (!iStationId || typeof iStationId !== 'string' || iStationId.trim() === '') {
      logger.warn('Invalid station ID provided to oAddFavorite')
      return
    }

    setFavorites((prevFavorites) => {
      // Check if already favorited
      if (prevFavorites.some((fav) => fav.stationId === iStationId)) {
        logger.info(`Station ${iStationId} is already favorited`)
        return prevFavorites
      }

      const newFavorite: FavoriteStation = {
        stationId: iStationId,
        addedAt: Date.now()
      }

      logger.info(`Added station ${iStationId} to favorites`)
      // Add to front of array (most recent first)
      return [newFavorite, ...prevFavorites]
    })
  }, [])

  /**
   * Removes a station from favorites
   * 
   * Purpose: Remove a station from the favorites list
   * 
   * @param {string} iStationId - Station ID to remove
   * @returns {void}
   */
  const oRemoveFavorite = useCallback((iStationId: string): void => {
    if (!iStationId || typeof iStationId !== 'string') {
      logger.warn('Invalid station ID provided to oRemoveFavorite')
      return
    }

    setFavorites((prevFavorites) => {
      const filtered = prevFavorites.filter((fav) => fav.stationId !== iStationId)
      
      if (filtered.length === prevFavorites.length) {
        logger.info(`Station ${iStationId} was not in favorites`)
      } else {
        logger.info(`Removed station ${iStationId} from favorites`)
      }

      return filtered
    })
  }, [])

  /**
   * Toggles favorite status for a station
   * 
   * Purpose: Add station if not favorited, remove if already favorited
   * 
   * @param {string} iStationId - Station ID to toggle
   * @returns {void}
   */
  const oToggleFavorite = useCallback((iStationId: string): void => {
    if (!iStationId || typeof iStationId !== 'string') {
      logger.warn('Invalid station ID provided to oToggleFavorite')
      return
    }

    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.some((fav) => fav.stationId === iStationId)

      if (isFavorited) {
        logger.info(`Toggling off favorite for station ${iStationId}`)
        return prevFavorites.filter((fav) => fav.stationId !== iStationId)
      } else {
        logger.info(`Toggling on favorite for station ${iStationId}`)
        const newFavorite: FavoriteStation = {
          stationId: iStationId,
          addedAt: Date.now()
        }
        return [newFavorite, ...prevFavorites]
      }
    })
  }, [])

  /**
   * Creates a Map for O(1) favorite lookups
   * 
   * Purpose: Optimize favorite checking performance
   * 
   * @returns {Map<string, boolean>} Map of favorited station IDs
   */
  const oFavoriteMap = useMemo(() => {
    return new Map(oFavorites.map((fav) => [fav.stationId, true]))
  }, [oFavorites])

  /**
   * Checks if a station is in favorites
   * 
   * Purpose: Determine if a given station ID is currently favorited
   * Uses Map for O(1) lookup performance
   * 
   * @param {string} iStationId - Station ID to check
   * @returns {boolean} oIsFavorited - True if station is favorited
   */
  const oIsFavorite = useCallback((iStationId: string): boolean => {
    return oFavoriteMap.has(iStationId)
  }, [oFavoriteMap])

  /**
   * Clears all favorites
   * 
   * Purpose: Remove all stations from favorites (useful for reset functionality)
   * 
   * @returns {void}
   */
  const oClearFavorites = useCallback((): void => {
    setFavorites([])
    logger.info('Cleared all favorites')
  }, [])

  /**
   * Gets the total count of favorites
   * 
   * Purpose: Provide quick access to favorites count for UI badges
   * 
   * @returns {number} oFavoriteCount - Number of favorited stations
   */
  const oFavoriteCount = oFavorites.length

  return {
    oFavorites,
    oAddFavorite,
    oRemoveFavorite,
    oToggleFavorite,
    oIsFavorite,
    oClearFavorites,
    oFavoriteCount,
    oIsLoaded,
    oLoadError,
    oFavoriteMap
  }
}
